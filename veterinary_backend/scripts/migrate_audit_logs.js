require('dotenv').config();
const pool = require('../config/db');

async function migrate() {
  try {
    const [cols] = await pool.query('DESCRIBE audit_logs');
    const existing = cols.map(c => c.Field);
    
    if (!existing.includes('method')) {
      await pool.query('ALTER TABLE audit_logs ADD COLUMN method VARCHAR(10) NULL AFTER entity_id');
      console.log('Added method column');
    }
    if (!existing.includes('endpoint')) {
      await pool.query('ALTER TABLE audit_logs ADD COLUMN endpoint VARCHAR(255) NULL AFTER method');
      console.log('Added endpoint column');
    }
    if (!existing.includes('status_code')) {
      await pool.query('ALTER TABLE audit_logs ADD COLUMN status_code INT NULL AFTER endpoint');
      console.log('Added status_code column');
    }
    if (!existing.includes('response_time_ms')) {
      await pool.query('ALTER TABLE audit_logs ADD COLUMN response_time_ms INT NULL AFTER status_code');
      console.log('Added response_time_ms column');
    }
    if (!existing.includes('status')) {
      await pool.query("ALTER TABLE audit_logs ADD COLUMN status VARCHAR(20) DEFAULT 'SUCCESS' AFTER response_time_ms");
      console.log('Added status column');
    }
    
    // Add indexes for high-speed log filtering & performance dashboard analytics
    try {
      await pool.query('CREATE INDEX idx_audit_clinic_created ON audit_logs(clinic_id, created_at)');
    } catch (e) {}
    try {
      await pool.query('CREATE INDEX idx_audit_status ON audit_logs(status)');
    } catch (e) {}
    try {
      await pool.query('CREATE INDEX idx_audit_response_time ON audit_logs(response_time_ms)');
    } catch (e) {}

    console.log('Audit logs migration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
