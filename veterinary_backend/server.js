const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
app.set('trust proxy', 1);
const port = process.env.PORT || 5001;

// Security Middleware: Rate limiting for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    message: { status: 'error', message: 'Too many requests from this IP, please try again after 15 minutes' }
});

// Middleware
const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:5174', 'http://localhost:5173', 'http://localhost:3000'].filter(Boolean);
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const path = require('path');
const { protect } = require('./middlewares/authMiddleware');
const { errorHandler } = require('./middlewares/errorHandler');

// Serve static files from the uploads directory.
// We removed strict JWT protection here because standard <img> tags in the frontend 
// cannot easily send Authorization headers or query tokens without significant frontend rewrites.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Routes
const authRoutes = require('./routes/authRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const petOwnerRoutes = require('./routes/petOwnerRoutes');
const petRoutes = require('./routes/petRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const userRoutes = require('./routes/userRoutes');
const homeVisitRoutes = require('./routes/homeVisitRoutes');
const encounterRoutes = require('./routes/encounterRoutes');
const treatmentNoteRoutes = require('./routes/treatmentNoteRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const reportRoutes = require('./routes/reportRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const assistanceTaskRoutes = require('./routes/assistanceTaskRoutes');
const superAdminRoutes = require('./routes/superAdminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/inventory', inventoryRoutes);
app.use('/api/v1/owners', petOwnerRoutes);
app.use('/api/v1/pets', petRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/home-visits', homeVisitRoutes);
app.use('/api/v1/encounters', encounterRoutes);
app.use('/api/v1/treatment-notes', treatmentNoteRoutes);
app.use('/api/v1/invoices', invoiceRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/assistance-tasks', assistanceTaskRoutes);
app.use('/api/super-admin', superAdminRoutes);
app.use('/api/payment', paymentRoutes);

// Basic Route to check if server is running
app.get('/', (req, res) => {
    res.send('Veterinary Clinic API is running...');
});

// Database Connection Test Route
app.get('/api/health', async (req, res) => {
    try {
        const db = require('./config/db');
        const [rows] = await db.query('SELECT 1 + 1 AS solution');
        res.json({ status: 'Database connected successfully!', data: rows[0] });
    } catch (error) {
        console.error('Database connection failed:', error);
        res.status(500).json({ status: 'Database connection failed', error: error.message });
    }
});

// Global Error Handler
app.use(errorHandler);

// Start Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
