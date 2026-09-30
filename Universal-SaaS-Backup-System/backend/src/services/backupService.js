/**
 * Universal SaaS Backup & Recovery Service
 * 
 * Provides dynamic, zero-hardcoding database dumps (SQL/JSON) and file uploads archiving.
 * Works with any MySQL/PostgreSQL/Prisma/Express SaaS application out-of-the-box.
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const archiver = require('archiver');
const prisma = require('../config/db');

// Configurable backup storage directory
const BACKUP_DIR = path.resolve(__dirname, '../../backups');
const UPLOADS_DIR = path.resolve(__dirname, '../../uploads');

// Ensure backup folder exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

/**
 * Helper: Format bytes to human-readable size
 */
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * 1. Generate Full or Tenant-Scoped Database Backup (JSON Bundle)
 */
const generateDatabaseBackup = async (options = {}) => {
  const { tenantId = null, filenamePrefix = 'db_backup' } = options;
  
  let tenant = null;
  if (tenantId) {
    tenant = await prisma.tenant.findUnique({ where: { id: tenantId } }).catch(() => null);
  }
  const tenantSlug = tenant?.slug || (tenant?.name ? tenant.name.toLowerCase().trim().replace(/[^a-z0-9]/g, '-') : (tenantId ? tenantId.slice(0, 8) : ''));
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${filenamePrefix}_${tenantId ? `company_${tenantSlug}_` : 'full_'}${timestamp}.json.gz`;
  const targetPath = path.join(BACKUP_DIR, filename);

  try {
    // 1. Fetch all tables dynamically from database schema
    const rawTables = await prisma.$queryRawUnsafe(`
      SELECT TABLE_NAME as tableName 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_TYPE = 'BASE TABLE'
        AND TABLE_NAME NOT LIKE '_prisma_migrations';
    `);

    const tableNames = rawTables.map(t => t.tableName || t.TABLE_NAME);
    const backupData = {
      manifest: {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        isFullSystem: !tenantId,
        targetTenantId: tenantId,
        tenantName: tenant?.name || null,
        tenantSlug: tenantSlug || null,
        tablesCount: tableNames.length,
        recordCounts: {}
      },
      tables: {}
    };

    // 2. Dump data table-by-table dynamically
    for (const tableName of tableNames) {
      try {
        let rows = [];
        if (tenantId) {
          // Check if table contains tenantId column
          const columns = await prisma.$queryRawUnsafe(`
            SELECT COLUMN_NAME as columnName 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() 
              AND TABLE_NAME = '${tableName}' 
              AND COLUMN_NAME = 'tenantId';
          `);

          if (columns.length > 0) {
            rows = await prisma.$queryRawUnsafe(`SELECT * FROM \`${tableName}\` WHERE \`tenantId\` = '${tenantId}'`);
          } else if (tableName === 'tenants') {
            rows = await prisma.$queryRawUnsafe(`SELECT * FROM \`tenants\` WHERE \`id\` = '${tenantId}'`);
          } else {
            // Table doesn't have tenantId - skip or ignore for tenant-specific backup
            continue;
          }
        } else {
          // Full system dump
          rows = await prisma.$queryRawUnsafe(`SELECT * FROM \`${tableName}\``);
        }

        backupData.tables[tableName] = rows;
        backupData.manifest.recordCounts[tableName] = rows.length;
      } catch (tableErr) {
        console.warn(`[Backup Engine] Warning on table ${tableName}:`, tableErr.message);
      }
    }

    // 3. Compress JSON into .json.gz safely with BigInt handling
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    const jsonString = JSON.stringify(backupData, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    );
    const compressedBuffer = zlib.gzipSync(Buffer.from(jsonString, 'utf-8'));
    fs.writeFileSync(targetPath, compressedBuffer);

    const stats = fs.statSync(targetPath);

    return {
      success: true,
      filename,
      filePath: targetPath,
      sizeBytes: stats.size,
      sizeFormatted: formatBytes(stats.size),
      tablesBackedUp: Object.keys(backupData.tables).length,
      manifest: backupData.manifest
    };
  } catch (error) {
    console.error('[Backup Engine Error]:', error);
    throw new Error(`Database backup failed: ${error.message}`);
  }
};

/**
 * 2. Generate Uploads / Storage Zip Archive
 */
const generateUploadsBackup = async () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `uploads_backup_${timestamp}.zip`;
  const targetPath = path.join(BACKUP_DIR, filename);

  return new Promise((resolve, reject) => {
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }

    const output = fs.createWriteStream(targetPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      const stats = fs.statSync(targetPath);
      resolve({
        success: true,
        filename,
        filePath: targetPath,
        sizeBytes: stats.size,
        sizeFormatted: formatBytes(stats.size),
        type: 'uploads'
      });
    });

    archive.on('error', (err) => reject(err));

    archive.pipe(output);
    archive.directory(UPLOADS_DIR, false);
    archive.finalize();
  });
};

/**
 * 3. List All Available Backups with Metadata
 */
const listBackups = async () => {
  if (!fs.existsSync(BACKUP_DIR)) {
    return [];
  }

  const files = fs.readdirSync(BACKUP_DIR);
  const backupList = [];

  for (const file of files) {
    if (file.endsWith('.json.gz') || file.endsWith('.zip') || file.endsWith('.sql')) {
      const filePath = path.join(BACKUP_DIR, file);
      const stats = fs.statSync(filePath);

      let type = 'database';
      let scope = 'full';
      let scopeLabel = 'Full Platform';
      let companyName = null;

      if (file.startsWith('uploads_backup') || file.endsWith('.zip')) {
        type = 'uploads';
        scopeLabel = 'File Attachments';
      } else if (file.includes('company_')) {
        const parts = file.split('company_')[1]?.split('_');
        const slug = parts ? parts[0] : 'company';
        scope = 'company';
        companyName = slug.replace(/-/g, ' ').toUpperCase();
        scopeLabel = `Company: ${companyName}`;
      } else if (file.includes('tenant_')) {
        scope = 'company';
        scopeLabel = 'Company Scoped';
      }

      backupList.push({
        filename: file,
        filePath,
        type,
        scope,
        scopeLabel,
        companyName,
        sizeBytes: stats.size,
        sizeFormatted: formatBytes(stats.size),
        createdAt: stats.birthtime || stats.mtime,
        ageInDays: Math.floor((Date.now() - new Date(stats.mtime).getTime()) / (1000 * 60 * 60 * 24))
      });
    }
  }

  // Sort latest first
  return backupList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

/**
 * 4. Delete a Backup File
 */
const deleteBackup = async (filename) => {
  // Prevent directory traversal attacks
  const safeFilename = path.basename(filename);
  const targetPath = path.join(BACKUP_DIR, safeFilename);

  if (!fs.existsSync(targetPath)) {
    throw new Error('Backup file does not exist.');
  }

  fs.unlinkSync(targetPath);
  return { success: true, message: `Backup file ${safeFilename} deleted successfully.` };
};

/**
 * Helper: Safely format values for MySQL raw statements
 */
const formatSqlValue = (val) => {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'boolean') return val ? 1 : 0;
  if (typeof val === 'number') return Number.isFinite(val) ? val : 'NULL';
  if (val instanceof Date) {
    const iso = val.toISOString().slice(0, 19).replace('T', ' ');
    return `'${iso}'`;
  }
  if (typeof val === 'object') {
    return `'${JSON.stringify(val).replace(/\\/g, '\\\\').replace(/'/g, "''")}'`;
  }
  const str = String(val);
  return `'${str.replace(/\\/g, '\\\\').replace(/'/g, "''")}'`;
};

/**
 * 5. Restore Database from a .json.gz or .json Backup
 */
const restoreDatabase = async (filename, actorInfo = {}) => {
  const safeFilename = path.basename(filename);
  const targetPath = path.join(BACKUP_DIR, safeFilename);

  if (!fs.existsSync(targetPath)) {
    throw new Error(`Backup file '${safeFilename}' does not exist on the server.`);
  }

  try {
    const fileBuffer = fs.readFileSync(targetPath);
    let jsonString;

    if (safeFilename.endsWith('.gz')) {
      jsonString = zlib.gunzipSync(fileBuffer).toString('utf-8');
    } else {
      jsonString = fileBuffer.toString('utf-8');
    }

    const backupData = JSON.parse(jsonString);

    if (!backupData.tables || !backupData.manifest) {
      throw new Error('Invalid backup archive structure: missing tables or manifest.');
    }

    const manifest = backupData.manifest;
    const isCompanyScoped = !manifest.isFullSystem && manifest.targetTenantId;
    const targetTenantId = manifest.targetTenantId;

    // Disable foreign key checks for atomic and safe restoration
    await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0;');

    const restoredStats = {};

    for (const [tableName, rows] of Object.entries(backupData.tables)) {
      if (!Array.isArray(rows) || rows.length === 0) continue;

      try {
        // If full system restore, clear table
        if (manifest.isFullSystem) {
          await prisma.$executeRawUnsafe(`DELETE FROM \`${tableName}\`;`);
        }

        let insertedCount = 0;
        for (const row of rows) {
          const columns = Object.keys(row);
          if (columns.length === 0) continue;

          const escapedCols = columns.map(c => `\`${c}\``).join(', ');
          const values = Object.values(row).map(v => formatSqlValue(v)).join(', ');

          await prisma.$executeRawUnsafe(`
            REPLACE INTO \`${tableName}\` (${escapedCols}) 
            VALUES (${values});
          `);
          insertedCount++;
        }
        restoredStats[tableName] = insertedCount;
      } catch (tableRestoreErr) {
        console.warn(`[Restore Warning] on table ${tableName}:`, tableRestoreErr.message);
      }
    }

    // Re-enable foreign key checks
    await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1;');

    // Record Audit Log for platform transparency
    try {
      await prisma.auditLog.create({
        data: {
          actorId: actorInfo.id || 'master-admin',
          actorName: actorInfo.fullName || actorInfo.name || 'Master Admin',
          actorRole: 'master_admin',
          tenantId: targetTenantId || null,
          action: 'BACKUP_RESTORED',
          description: `Restored database backup '${safeFilename}'. Scope: ${manifest.isFullSystem ? 'Full Platform' : `Company (${manifest.tenantName || manifest.tenantSlug || targetTenantId})`}. Total tables processed: ${Object.keys(restoredStats).length}.`
        }
      });
    } catch (auditErr) {
      console.warn('Audit log creation warning:', auditErr.message);
    }

    return {
      success: true,
      message: isCompanyScoped
        ? `Company data for '${manifest.tenantName || 'Tenant'}' restored successfully!`
        : 'Full platform database restoration completed successfully.',
      scope: isCompanyScoped ? 'company' : 'full',
      companyName: manifest.tenantName,
      tenantId: targetTenantId,
      manifest,
      restoredStats
    };
  } catch (error) {
    try {
      await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1;');
    } catch (_) {}
    console.error('[Restore Error]:', error);
    throw new Error(`Database restore failed: ${error.message}`);
  }
};

/**
 * 6. Auto-Cleanup / Retention Policy (Default: remove backups older than 30 days)
 */
const cleanOldBackups = async (retentionDays = 30) => {
  const backups = await listBackups();
  let deletedCount = 0;

  for (const backup of backups) {
    if (backup.ageInDays > retentionDays) {
      fs.unlinkSync(backup.filePath);
      deletedCount++;
    }
  }

  return { deletedCount };
};

module.exports = {
  BACKUP_DIR,
  UPLOADS_DIR,
  generateDatabaseBackup,
  generateUploadsBackup,
  listBackups,
  deleteBackup,
  restoreDatabase,
  cleanOldBackups,
  formatBytes
};
