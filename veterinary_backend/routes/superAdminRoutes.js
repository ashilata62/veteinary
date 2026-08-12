const express = require('express');
const router = express.Router();
const { loginSuperAdmin, getClinics, getStats } = require('../controllers/superAdminController');
const { getAllTicketsForSuperAdmin, replyTicketAsSuperAdmin, updateTicketStatus } = require('../controllers/supportTicketController');
const superAdminAuth = require('../middleware/superAdminAuth');

// Public route for login
router.post('/login', loginSuperAdmin);

// Protected routes (Requires SUPER_ADMIN role)
router.get('/stats', superAdminAuth, getStats);
router.get('/clinics', superAdminAuth, getClinics);

// Ticket routes for SuperAdmin
router.get('/tickets', superAdminAuth, getAllTicketsForSuperAdmin);
router.post('/tickets/:id/reply', superAdminAuth, replyTicketAsSuperAdmin);
router.patch('/tickets/:id/status', superAdminAuth, updateTicketStatus);

module.exports = router;
