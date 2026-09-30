const fs = require('fs');
const path = require('path');
const backupService = require('../services/backupService');

/**
 * GET /api/v1/master-admin/backups
 * Retrieve all available system backups
 */
const getBackups = async (req, res) => {
  try {
    const backups = await backupService.listBackups();
    return res.status(200).json({
      success: true,
      count: backups.length,
      data: backups
    });
  } catch (error) {
    console.error('[Backup Controller Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/v1/master-admin/backups/create
 * Create a new database or files backup snapshot
 */
const createBackup = async (req, res) => {
  try {
    const { type = 'database', tenantId = null } = req.body;

    let result;
    if (type === 'uploads') {
      result = await backupService.generateUploadsBackup();
    } else {
      result = await backupService.generateDatabaseBackup({ tenantId });
    }

    return res.status(201).json({
      success: true,
      message: `${type === 'uploads' ? 'Files' : 'Database'} backup created successfully.`,
      data: result
    });
  } catch (error) {
    console.error('[Backup Controller Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/v1/master-admin/backups/download/:filename
 * Securely stream and download a backup archive
 */
const downloadBackup = async (req, res) => {
  try {
    const { filename } = req.params;
    const safeFilename = path.basename(filename);
    const filePath = path.join(backupService.BACKUP_DIR, safeFilename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'Backup file not found.' });
    }

    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('[Backup Download Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /api/v1/master-admin/backups/:filename
 * Delete a specific backup file
 */
const deleteBackup = async (req, res) => {
  try {
    const { filename } = req.params;
    const result = await backupService.deleteBackup(filename);
    return res.status(200).json(result);
  } catch (error) {
    console.error('[Backup Delete Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/v1/master-admin/backups/upload
 * Upload a backup file archive and optionally restore immediately
 */
const uploadBackup = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No backup file provided in request.' });
    }

    const { filename, size } = req.file;
    const restoreImmediately = req.body.restoreImmediately === 'true' || req.body.restoreImmediately === true;

    let restoreResult = null;
    if (restoreImmediately && (filename.endsWith('.json.gz') || filename.endsWith('.json') || filename.endsWith('.gz'))) {
      restoreResult = await backupService.restoreDatabase(filename, req.user);
    }

    return res.status(200).json({
      success: true,
      message: restoreResult
        ? (restoreResult.message || 'Backup uploaded and restored successfully!')
        : 'Backup archive uploaded successfully.',
      filename,
      sizeBytes: size,
      restored: !!restoreResult,
      restoreResult
    });
  } catch (error) {
    console.error('[Backup Upload Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/v1/master-admin/backups/restore
 * Restore the database from an existing backup file
 */
const restoreBackup = async (req, res) => {
  try {
    const { filename } = req.body;
    if (!filename) {
      return res.status(400).json({ success: false, message: 'Filename is required for restore.' });
    }

    const result = await backupService.restoreDatabase(filename, req.user);
    return res.status(200).json(result);
  } catch (error) {
    console.error('[Backup Restore Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getBackups,
  createBackup,
  downloadBackup,
  deleteBackup,
  restoreBackup,
  uploadBackup
};
