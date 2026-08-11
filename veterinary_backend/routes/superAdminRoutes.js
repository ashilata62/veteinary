const express = require('express');
const router = express.Router();
const { loginSuperAdmin, getClinics, getStats, suspendClinic, activateClinic } = require('../controllers/superAdminController');
const superAdminAuth = require('../middleware/superAdminAuth');

router.post('/login', loginSuperAdmin);

router.get('/stats', superAdminAuth, getStats);
router.get('/clinics', superAdminAuth, getClinics);
router.post('/clinics/:id/suspend', superAdminAuth, suspendClinic);
router.post('/clinics/:id/activate', superAdminAuth, activateClinic);

module.exports = router;
