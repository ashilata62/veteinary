const express = require('express');
const router = express.Router();
const { loginUser, registerUser } = require('../controllers/authController');
const db = require('../config/db');

router.post('/login', loginUser);
router.post('/register', registerUser);

// Public: Get all active plans (for Admin plans page)
router.get('/plans', async (req, res) => {
    try {
        const [plans] = await db.query(
            'SELECT id, name, price, duration_days, features FROM saas_plans WHERE is_active = 1 AND id != ? ORDER BY price ASC',
            ['plan-free-trial']
        );
        const formatted = plans.map(p => ({
            ...p,
            features: p.features ? JSON.parse(p.features) : []
        }));
        res.json({ status: 'success', data: formatted });
    } catch (err) {
        console.error('Error fetching plans:', err);
        res.status(500).json({ status: 'error', message: 'Failed to fetch plans' });
    }
});

module.exports = router;
