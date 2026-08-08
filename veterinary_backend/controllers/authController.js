const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const emailService = require('../services/emailService');

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: 'error', message: 'Please provide email and password' });
        }

        // Check if user exists by email or username
        const [users] = await db.query('SELECT * FROM users WHERE email = ? OR username = ?', [email, email]);

        if (users.length === 0) {
            return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
        }

        const user = users[0];

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
        }

        // Check if account is active
        if (user.status !== 'Active') {
            return res.status(403).json({ status: 'error', message: 'User account is suspended or inactive' });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user.id, role: user.role, email: user.email },
            process.env.JWT_SECRET || 'secretkey123',
            { expiresIn: '8h' }
        );

        // Send response
        res.json({
            status: 'success',
            data: {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    profile_image: user.profile_image
                }
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ status: 'error', message: 'Server error during login', error: error.message });
    }
};

// @desc    Register new clinic & admin account
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const {
            businessName,
            adminName,
            email,
            mobile,
            password,
            confirmPassword,
            selectedPlan = 'free-trial'
        } = req.body;

        // 1. Basic Field Presence Check
        if (!businessName || !adminName || !email || !mobile || !password) {
            return res.status(400).json({ status: 'error', message: 'All registration fields are required' });
        }

        // 2. Length & Format Validations
        if (businessName.trim().length < 3) {
            return res.status(400).json({ status: 'error', message: 'Clinic name must be at least 3 characters long' });
        }

        if (adminName.trim().length < 3) {
            return res.status(400).json({ status: 'error', message: 'Admin full name must be at least 3 characters long' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({ status: 'error', message: 'Please provide a valid email address' });
        }

        const mobileClean = mobile.replace(/[^0-9]/g, '');
        if (mobileClean.length < 10) {
            return res.status(400).json({ status: 'error', message: 'Mobile number must contain at least 10 digits' });
        }

        // Password matching check
        if (confirmPassword && password !== confirmPassword) {
            return res.status(400).json({ status: 'error', message: 'Password and Confirm Password do not match' });
        }

        // Password Strength Check
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passRegex.test(password)) {
            return res.status(400).json({
                status: 'error',
                message: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character'
            });
        }

        // 3. Uniqueness Check in Database
        const [existingUsers] = await db.query(
            'SELECT id FROM users WHERE email = ? OR phone = ?',
            [email.trim().toLowerCase(), mobileClean]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({
                status: 'error',
                message: 'This email or mobile number is already registered'
            });
        }

        // 4. Generate Security IDs & Pass Hash
        const userId = crypto.randomUUID ? crypto.randomUUID() : `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const tenantId = crypto.randomUUID ? crypto.randomUUID() : `TEN-${Date.now()}`;
        const adminId = `ADM-${Math.floor(100000 + Math.random() * 900000)}`;
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // 5. Calculate Trial Dates
        const trialStartDate = new Date();
        const trialExpiryDate = new Date();
        trialExpiryDate.setDate(trialStartDate.getDate() + 7);

        // 6. Insert User into Users Table
        const username = email.split('@')[0].toLowerCase() + Math.floor(Math.random() * 100);
        await db.query(
            `INSERT INTO users (id, name, email, phone, role, username, password_hash, status) 
             VALUES (?, ?, ?, ?, 'Admin', ?, ?, 'Active')`,
            [userId, adminName.trim(), email.trim().toLowerCase(), mobileClean, username, passwordHash]
        );

        // Send Welcome email using Brevo
        try {
            const formattedExpiry = trialExpiryDate.toLocaleDateString('en-GB');
            const welcomeHtml = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                  <div style="background-color: #0f172a; padding: 1.5rem; text-align: center;">
                    <span style="color: #ffffff; font-weight: 800; font-size: 1.25rem; letter-spacing: 0.5px;">KIAAN</span>
                    <span style="color: #2dd4bf; font-weight: 800; font-size: 1.25rem; letter-spacing: 0.5px;">VETERINARY</span>
                  </div>
                  <div style="padding: 2rem;">
                    <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 1rem;">Welcome to Kiaan Veterinary!</h2>
                    <p style="color: #475569; font-size: 0.9rem; line-height: 1.5; margin-bottom: 1.5rem;">Hello ${adminName.trim()}, thank you for registering your clinic <strong>${businessName.trim()}</strong>. Your 7-Day Free Trial has been activated successfully!</p>
                    
                    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; margin-bottom: 1.5rem; font-size: 0.9rem;">
                      <h3 style="margin-top: 0; margin-bottom: 0.75rem; font-size: 0.95rem; color: #0f172a; font-weight: 700;">Your Account Details:</h3>
                      <table style="width: 100%; border-collapse: collapse; text-align: left;">
                        <tr>
                          <td style="padding: 0.35rem 0; color: #64748b;">Admin ID:</td>
                          <td style="padding: 0.35rem 0; color: #334155; font-weight: 600; font-family: monospace;">${adminId}</td>
                        </tr>
                        <tr>
                          <td style="padding: 0.35rem 0; color: #64748b;">Registered Email:</td>
                          <td style="padding: 0.35rem 0; color: #334155; font-weight: 600;">${email.trim().toLowerCase()}</td>
                        </tr>
                        <tr>
                          <td style="padding: 0.35rem 0; color: #64748b;">Selected Plan:</td>
                          <td style="padding: 0.35rem 0; color: #334155; font-weight: 600;">Free Trial</td>
                        </tr>
                        <tr>
                          <td style="padding: 0.35rem 0; color: #64748b;">Trial Expiry Date:</td>
                          <td style="padding: 0.35rem 0; color: #b45309; font-weight: 600;">${formattedExpiry}</td>
                        </tr>
                      </table>
                    </div>

                    <div style="text-align: center; margin-top: 1.5rem; margin-bottom: 1.5rem;">
                      <a href="http://localhost:5174/login" style="display: inline-block; background-color: #14b8a6; color: #ffffff; text-decoration: none; padding: 0.75rem 1.75rem; border-radius: 8px; font-weight: 700; font-size: 0.9rem; box-shadow: 0 4px 12px rgba(20, 184, 166, 0.25);">Login to Portal</a>
                    </div>

                    <p style="color: #64748b; font-size: 0.8rem; line-height: 1.5; margin-bottom: 0;">Need to change your password? You can reset it anytime from your profile settings after logging in.</p>
                  </div>
                  <div style="background-color: #f8fafc; padding: 1rem; text-align: center; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 0.75rem;">
                    © 2026 Kiaan Veterinary SaaS Platform. All rights reserved.
                  </div>
                </div>
            `;

            await emailService.sendEmail({
                to: email.trim().toLowerCase(),
                subject: 'Welcome to Kiaan Veterinary - Free Trial Activated',
                text: `Welcome to Kiaan Veterinary, ${adminName.trim()}! Your registration is successful. Admin ID: ${adminId}. Expiry Date: ${formattedExpiry}`,
                html: welcomeHtml
            });
        } catch (emailErr) {
            console.error('Failed to send welcome email to registered admin:', emailErr);
        }

        // 7. Return Structured Response
        res.status(201).json({
            status: 'success',
            message: 'Clinic registered successfully',
            data: {
                adminId,
                tenantId,
                email: email.trim().toLowerCase(),
                adminName: adminName.trim(),
                businessName: businessName.trim(),
                selectedPlan,
                trialStartDate,
                trialExpiryDate
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error during registration',
            error: error.message
        });
    }
};

module.exports = { loginUser, registerUser };
