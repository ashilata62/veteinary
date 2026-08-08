const Razorpay = require('razorpay');
const crypto = require('crypto');
const pool = require('../config/db');
const emailService = require('../services/emailService');
require('dotenv').config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummyKeyId',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummyKeySecret',
});

exports.createOrder = async (req, res) => {
  try {
    const { planId, amount, currency = 'INR', clinicAdminId } = req.body;

    if (!amount) {
      return res.status(400).json({ status: 'error', message: 'Amount is required' });
    }

    const options = {
      amount: amount * 100, // Razorpay works in paise
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Only log payment in DB if there's a real user ID (not temp/null)
    const isRealUser = clinicAdminId && clinicAdminId !== 'temp_user_id';
    if (isRealUser) {
      const paymentId = crypto.randomUUID();
      await pool.query(
        `INSERT INTO saas_payments (id, clinic_admin_id, amount, status, currency, razorpay_order_id, plan_id) 
         VALUES (?, ?, ?, 'Pending', ?, ?, ?)`,
        [paymentId, clinicAdminId, amount, currency, order.id, planId]
      );
    }

    res.status(200).json({
      status: 'success',
      data: {
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: process.env.RAZORPAY_KEY_ID,
      }
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ status: 'error', message: 'Failed to create order' });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, clinicAdminId, planId, amount } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Payment successful
      const invoiceNumber = `INV-${Date.now()}`;
      
      // Update Payment
      await pool.query(
        `UPDATE saas_payments SET 
          status = 'Successful', 
          razorpay_payment_id = ?, 
          razorpay_signature = ?, 
          invoice_number = ?, 
          payment_method = 'Razorpay' 
        WHERE razorpay_order_id = ?`,
        [razorpay_payment_id, razorpay_signature, invoiceNumber, razorpay_order_id]
      );

      // Create or update subscription
      const subId = crypto.randomUUID();
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription
      
      await pool.query(
        `INSERT INTO saas_subscriptions (id, clinic_admin_id, plan_id, status, start_date, end_date, razorpay_payment_id) 
         VALUES (?, ?, ?, 'Active', ?, ?, ?)
         ON DUPLICATE KEY UPDATE status = 'Active', end_date = ?, razorpay_payment_id = ?`,
        [subId, clinicAdminId, planId, startDate, endDate, razorpay_payment_id, endDate, razorpay_payment_id]
      );

      // Fetch user email to send transactional receipt email
      try {
        const [users] = await pool.query('SELECT name, email FROM users WHERE id = ?', [clinicAdminId]);
        if (users.length > 0) {
          const user = users[0];
          const userName = user.name || 'Clinic Administrator';
          const userEmail = user.email;

          // Map plan ID to beautiful plan name
          const planMap = {
            basic: 'Basic Plan',
            pro: 'Pro Plan',
            enterprise: 'Enterprise Plan'
          };
          const planName = planMap[planId] || `${planId.toUpperCase()} Plan`;
          
          const now = new Date();
          const formattedDate = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;

          const receiptHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
              <div style="background-color: #0f172a; padding: 1.5rem; text-align: center;">
                <span style="color: #ffffff; font-weight: 800; font-size: 1.25rem; letter-spacing: 0.5px;">KIAAN</span>
                <span style="color: #2dd4bf; font-weight: 800; font-size: 1.25rem; letter-spacing: 0.5px;">VETERINARY</span>
              </div>
              <div style="padding: 2rem;">
                <div style="display: inline-block; background-color: #dcfce7; color: #15803d; font-size: 0.75rem; font-weight: 700; padding: 0.35rem 0.75rem; border-radius: 4px; text-transform: uppercase; margin-bottom: 1.25rem;">
                  Payment Successful
                </div>
                <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">Payment Receipt #${razorpay_payment_id}</h2>
                <p style="color: #475569; font-size: 0.9rem; line-height: 1.5; margin-bottom: 1.5rem;">Thank you for your payment. Here is your transaction summary for ${userName}:</p>
                
                <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
                  <thead>
                    <tr style="border-bottom: 2px solid #e2e8f0; color: #64748b; font-weight: 700;">
                      <th style="padding: 0.5rem 0;">DESCRIPTION</th>
                      <th style="padding: 0.5rem 0; text-align: right;">AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                      <td style="padding: 0.75rem 0; color: #0f172a; font-weight: 600;">Plan: ${planName}</td>
                      <td style="padding: 0.75rem 0; text-align: right; color: #0f172a; font-weight: 600;">₹${amount}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                      <td style="padding: 0.75rem 0; color: #64748b;">Transaction ID</td>
                      <td style="padding: 0.75rem 0; text-align: right; color: #334155; font-family: monospace;">${razorpay_payment_id}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                      <td style="padding: 0.75rem 0; color: #64748b;">Payment Method</td>
                      <td style="padding: 0.75rem 0; text-align: right; color: #334155;">Razorpay</td>
                    </tr>
                    <tr>
                      <td style="padding: 0.75rem 0; color: #64748b;">Date</td>
                      <td style="padding: 0.75rem 0; text-align: right; color: #334155;">${formattedDate}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div style="background-color: #f8fafc; padding: 1rem; text-align: center; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 0.75rem;">
                © 2026 Kiaan Veterinary SaaS Platform. All rights reserved.
              </div>
            </div>
          `;

          await emailService.sendEmail({
            to: userEmail,
            subject: `Payment Receipt #${razorpay_payment_id} - Kiaan Veterinary`,
            text: `Thank you for your payment. Receipt ID: ${razorpay_payment_id}. Plan: ${planName}, Amount: ₹${amount}`,
            html: receiptHtml
          });
        }
      } catch (emailErr) {
        console.error('Failed to send payment receipt email:', emailErr);
      }

      res.status(200).json({
        status: 'success',
        message: 'Payment verified and subscription activated successfully',
        data: { invoiceNumber }
      });
    } else {
      // Payment failed/tampered
      await pool.query(
        `UPDATE saas_payments SET status = 'Failed' WHERE razorpay_order_id = ?`,
        [razorpay_order_id]
      );

      res.status(400).json({ status: 'error', message: 'Invalid payment signature' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error during verification' });
  }
};

exports.getPaymentHistory = async (req, res) => {
  try {
    const [payments] = await pool.query(
      `SELECT p.*, u.email as user_email, u.first_name, u.last_name 
       FROM saas_payments p 
       JOIN users u ON p.clinic_admin_id = u.id 
       ORDER BY p.payment_date DESC`
    );
    res.status(200).json({ status: 'success', data: payments });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch payment history' });
  }
};
