const express = require('express');
const multer = require('multer');
const path = require('path');
const backupService = require('../services/backupService');
const {
  getBackups,
  createBackup,
  downloadBackup,
  deleteBackup,
  restoreBackup,
  uploadBackup
} = require('../controllers/backupController');

// Configure Multer Storage for Backups Repository
const backupStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, backupService.BACKUP_DIR),
  filename: (req, file, cb) => cb(null, path.basename(file.originalname).replace(/[^a-zA-Z0-9._-]/g, '_'))
});
const backupUpload = multer({
  storage: backupStorage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB max limit
});

const router = express.Router();

// Optional: Add your authentication / admin authorization middleware here:
// const { authMiddleware, requireAdmin } = require('../middlewares/auth');
// router.use(authMiddleware, requireAdmin);

router.get('/backups', getBackups);
router.post('/backups/create', createBackup);
router.post('/backups/upload', backupUpload.single('backupFile'), uploadBackup);
router.get('/backups/download/:filename', downloadBackup);
router.delete('/backups/:filename', deleteBackup);
router.post('/backups/restore', restoreBackup);

module.exports = router;
