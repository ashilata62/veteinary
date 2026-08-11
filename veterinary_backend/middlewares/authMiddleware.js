const jwt = require('jsonwebtoken');
const db = require('../config/db');

const protect = async (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey123');
            
            req.user = decoded;
            
            const [users] = await db.query(
                'SELECT id, role, clinic_id, status FROM users WHERE id = ? LIMIT 1',
                [decoded.id]
            );
            
            if (users && users.length > 0) {
                req.user.clinicId = users[0].clinic_id;
                req.user.accountStatus = users[0].status;
            }
            
            next();
        } catch (error) {
            console.error('Token verification failed:', error.message);
            return res.status(401).json({ status: 'error', message: 'Not authorized, token failed' });
        }
    } else {
        return res.status(401).json({ status: 'error', message: 'Not authorized, no token' });
    }
};

// Middleware to check roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ 
                status: 'error', 
                message: `User role '${req.user ? req.user.role : 'Unknown'}' is not authorized to access this route` 
            });
        }
        next();
    };
};

module.exports = { protect, authorize };
