import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, Mail, Phone, Lock, Eye, EyeOff, Building2, User, Loader2, 
  ArrowLeft, ShieldCheck, CheckCircle2, Shield 
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const PLANS = {
  'free-trial': { name: 'Free Trial', price: '₹0', cycle: '7 Days Free' },
  'testing':    { name: 'Testing Plan', price: '₹1', cycle: '/test' },
  'starter':    { name: 'Starter',    price: '₹999', cycle: '/month' },
  'standard':   { name: 'Standard',   price: '₹1,299', cycle: '/month' },
  'pro':        { name: 'Pro',        price: '₹1,499', cycle: '/month' },
  'custom':     { name: 'Custom Plan', price: 'Custom', cycle: '/tailored' },
};

export default function RegisterModal({ plan = 'free-trial', onClose }) {
  const navigate = useNavigate();
  const planObj = PLANS[plan] || PLANS['free-trial'];

  const [form, setForm] = useState({
    clinicName: '', adminName: '', email: '', mobile: '', password: '', confirmPassword: ''
  });
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handle = (e) => {
    setErrorMessage('');
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    // Validation Checks
    if (!form.clinicName.trim()) { setErrorMessage('Clinic name is required'); return; }
    if (!form.adminName.trim()) { setErrorMessage('Admin name is required'); return; }
    if (!form.email.trim()) { setErrorMessage('Email address is required'); return; }
    if (!form.mobile.trim()) { setErrorMessage('Mobile number is required'); return; }
    if (!form.password) { setErrorMessage('Password is required'); return; }
    if (form.password !== form.confirmPassword) {
      setErrorMessage('Passwords do not match!'); return;
    }
    
    setLoading(true);
    try {
      const res = await api.post('/api/auth/register', {
        businessName: form.clinicName,
        adminName:  form.adminName,
        email:      form.email,
        mobile:     form.mobile,
        password:   form.password,
        confirmPassword: form.confirmPassword,
        selectedPlan: plan,
      });

      const { isPaidPlan, userId, adminName, email, mobile } = res.data.data;

      if (!isPaidPlan) {
        toast.success('Account created! Free trial activated.');
        onClose();
        navigate('/login');
      } else {
        // Razorpay Payment Flow
        const amount = parseInt(planObj.price.replace('₹', '').replace(',', ''));
        
        const orderRes = await api.post('/api/payment/create-order', {
          planId: plan,
          amount: amount,
          clinicAdminId: userId
        });

        const orderData = orderRes.data;

        if (orderData.status !== 'success') throw new Error('Failed to create order');

        const options = {
          key: orderData.data.key_id,
          amount: orderData.data.amount,
          currency: orderData.data.currency,
          name: 'VetCare Pro',
          description: `Subscription for ${planObj.name}`,
          image: '/kt-logo.png',
          order_id: orderData.data.order_id,
          handler: async function (response) {
            try {
              const verifyRes = await api.post('/api/payment/verify', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                clinicAdminId: userId,
                planId: plan,
                amount: amount
              });

              if (verifyRes.data.status === 'success') {
                setPaymentSuccess(true);
                setTimeout(() => {
                  onClose();
                  navigate('/login');
                }, 4000);
              } else {
                toast.error('Payment verification failed.');
              }
            } catch (err) {
              toast.error('Payment verification failed.');
            }
          },
          prefill: {
            name: adminName,
            email: email,
            contact: mobile
          },
          theme: { color: '#14b8a6' }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response){
          toast.error('Payment failed or cancelled.');
        });
        rzp.open();
      }

    } catch (err) {
      const msg = err?.response?.data?.message || 'Registration failed. Try again.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-modal-overlay" onClick={onClose}>
      <div className="register-modal-card" onClick={e => e.stopPropagation()}>

        {/* Back to Home Button at Top Right */}
        {!paymentSuccess && (
          <button 
            type="button"
            onClick={onClose} 
            className="register-modal-back-btn"
            aria-label="Back to Home"
          >
            <ArrowLeft size={16} /> Back to Home
          </button>
        )}

        {paymentSuccess ? (
          <div style={{ textAlign: 'center', padding: '30px 10px', animation: 'slideUp 0.4s ease' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px', animation: 'bounce 2s infinite' }}>🎉</div>
            <h2 style={{ fontSize: '1.6rem', color: '#10b981', marginBottom: '10px', fontWeight: 'bold' }}>Welcome to VetCare Pro!</h2>
            <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px' }}>
              Your payment was successful and your account is now active.<br/>
              Redirecting you to the login page...
            </p>
            <Loader2 size={24} color="#10b981" style={{ animation: 'spin 1s linear infinite', margin: '0 auto' }} />
          </div>
        ) : (
          <>
            <div className="register-modal-heading-section">
              <span className="register-modal-plan-badge">
                {planObj.name} — {planObj.price} {planObj.cycle}
              </span>
              <h2 className="register-modal-heading">
                Create Your Clinic Account
              </h2>
              <p className="register-modal-subheading">
                Quick 2-minute setup. Start managing your clinic instantly.
              </p>
            </div>

            {/* Form - 2 Column Grid for Compact Layout */}
            <form onSubmit={submit} noValidate className="register-modal-form-grid">
              
              {/* Clinic Name */}
              <div className="register-modal-group">
                <label className="register-modal-label">Clinic / Business Name *</label>
                <div style={{ position: 'relative' }}>
                  <Building2 size={16} className="register-modal-input-icon" />
                  <input 
                    name="clinicName" 
                    value={form.clinicName} 
                    onChange={handle} 
                    required
                    placeholder="Clinic name"
                    className="register-modal-input" 
                  />
                </div>
              </div>

              {/* Admin Name */}
              <div className="register-modal-group">
                <label className="register-modal-label">Admin Full Name *</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} className="register-modal-input-icon" />
                  <input 
                    name="adminName" 
                    value={form.adminName} 
                    onChange={handle} 
                    required
                    placeholder="Admin full name"
                    className="register-modal-input" 
                  />
                </div>
              </div>

              {/* Email */}
              <div className="register-modal-group">
                <label className="register-modal-label">Work Email *</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} className="register-modal-input-icon" />
                  <input 
                    name="email" 
                    type="email" 
                    value={form.email} 
                    onChange={handle} 
                    required
                    placeholder="admin@yourclinic.com"
                    className="register-modal-input" 
                  />
                </div>
              </div>

              {/* Mobile */}
              <div className="register-modal-group">
                <label className="register-modal-label">Mobile Number *</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} className="register-modal-input-icon" />
                  <input 
                    name="mobile" 
                    type="tel" 
                    value={form.mobile} 
                    onChange={handle} 
                    required
                    placeholder="98765 43210"
                    className="register-modal-input" 
                  />
                </div>
              </div>

              {/* Password */}
              <div className="register-modal-group">
                <label className="register-modal-label">Password *</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} className="register-modal-input-icon" />
                  <input 
                    type={showPass ? 'text' : 'password'} 
                    name="password" 
                    value={form.password}
                    placeholder="Create password" 
                    required 
                    className="register-modal-input"
                    onChange={handle}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                  />
                  <div onClick={() => setShowPass(!showPass)} className="register-modal-password-toggle">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </div>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="register-modal-group">
                <label className="register-modal-label">Confirm Password *</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} className="register-modal-input-icon" />
                  <input 
                    type={showConfirm ? 'text' : 'password'} 
                    name="confirmPassword" 
                    value={form.confirmPassword}
                    placeholder="Confirm password" 
                    required 
                    className="register-modal-input"
                    onChange={handle}
                  />
                  <div onClick={() => setShowConfirm(!showConfirm)} className="register-modal-password-toggle">
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </div>
                </div>
              </div>

              {/* Password Strength Hint - spans 2 columns */}
              {isPasswordFocused && (
                <div className="register-modal-strength-hint">
                  <div style={{ color: '#0f766e', fontWeight: 'bold', marginBottom: '4px' }}>Password must contain:</div>
                  <ul style={{ margin: 0, paddingLeft: '16px' }}>
                    <li style={{ color: form.password?.length >= 8 ? '#10b981' : '#64748b' }}>At least 8 characters</li>
                    <li style={{ color: /[A-Z]/.test(form.password) ? '#10b981' : '#64748b' }}>One uppercase letter (A-Z)</li>
                    <li style={{ color: /[a-z]/.test(form.password) ? '#10b981' : '#64748b' }}>One lowercase letter (a-z)</li>
                    <li style={{ color: /\d/.test(form.password) ? '#10b981' : '#64748b' }}>One number (0-9)</li>
                    <li style={{ color: /[@$!%*?&]/.test(form.password) ? '#10b981' : '#64748b' }}>One special character (@$!%*?&)</li>
                  </ul>
                </div>
              )}

              {errorMessage && <div className="register-modal-error-msg">{errorMessage}</div>}

              {/* Submit - spans 2 columns */}
              <button 
                type="submit" 
                disabled={loading}
                className="register-modal-submit-btn"
              >
                {loading ? <><Loader2 size={18} className="animate-spin" /> Creating Account...</> : <>Create Account & Get Started <span className="btn-arrow">→</span></>}
              </button>
            </form>
          </>
        )}

        <style>{`
          .register-modal-overlay {
            position: fixed;
            inset: 0;
            z-index: 9999;
            background: rgba(9, 13, 22, 0.82);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px;
            animation: fadeOverlay 0.2s ease;
          }
          
          .register-modal-card {
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid rgba(255, 255, 255, 0.6);
            border-radius: 20px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.5);
            width: 100%;
            max-width: 600px;
            padding: 1.75rem 2rem;
            position: relative;
            animation: slideUp 0.3s ease;
            font-family: 'Inter', system-ui, sans-serif;
            color: #0f172a;
            max-height: 90vh;
            overflow-y: auto;
          }

          .register-modal-heading-section {
            margin-bottom: 1.25rem;
            padding-right: 120px;
          }

          .register-modal-back-btn {
            position: absolute;
            top: 1.25rem;
            right: 1.25rem;
            display: inline-flex;
            align-items: center;
            gap: 0.3rem;
            font-size: 0.8rem;
            font-weight: 700;
            color: #0f766e;
            background: transparent;
            border: none;
            cursor: pointer;
            transition: all 0.25s ease;
            z-index: 10;
            padding: 0;
          }

          .register-modal-back-btn:hover {
            color: #0d9488;
            transform: translateX(-3px);
          }

          .register-modal-plan-badge {
            background: rgba(15, 118, 110, 0.08);
            color: #0f766e;
            padding: 4px 10px; 
            border-radius: 20px;
            font-size: 0.7rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            display: inline-block;
          }

          .register-modal-heading {
            font-size: 1.35rem;
            font-weight: 800;
            margin: 8px 0 4px 0;
            letter-spacing: -0.5px;
            color: #0f172a;
          }

          .register-modal-subheading {
            color: #475569;
            font-size: 0.825rem;
            margin: 0;
            font-weight: 500;
          }

          .register-modal-form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.75rem;
          }

          .register-modal-group {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }

          .register-modal-label {
            font-size: 0.775rem;
            font-weight: 700;
            color: #475569;
          }

          .register-modal-input-icon {
            position: absolute;
            left: 0.95rem;
            top: 50%;
            transform: translateY(-50%);
            color: #64748b;
            pointer-events: none;
            transition: color 0.2s;
          }

          .register-modal-input {
            width: 100%;
            box-sizing: border-box;
            background: rgba(255, 255, 255, 0.6);
            border: 1.5px solid rgba(226, 232, 240, 0.9);
            border-radius: 12px;
            padding: 0.65rem 1rem 0.65rem 2.6rem;
            color: #0f172a;
            font-size: 0.9rem;
            font-weight: 600;
            transition: all 0.2s ease;
            outline: none;
            height: 2.85rem;
          }

          .register-modal-input:focus {
            border-color: #0f766e;
            box-shadow: 0 0 0 4px rgba(15, 118, 110, 0.12);
            background: #ffffff;
          }

          .register-modal-input:focus + .register-modal-input-icon {
            color: #0f766e;
          }

          .register-modal-password-toggle {
            position: absolute;
            right: 0.95rem;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            color: #64748b;
            display: flex;
            align-items: center;
          }

          .register-modal-password-toggle:hover {
            color: #0f172a;
          }

          .register-modal-strength-hint {
            grid-column: span 2;
            margin-top: 4px;
            padding: 8px;
            background: rgba(15, 118, 110, 0.04);
            border: 1px solid rgba(15, 118, 110, 0.15);
            border-radius: 8px;
            font-size: 0.7rem;
            color: #475569;
          }

          .register-modal-error-msg {
            grid-column: span 2;
            color: #ef4444;
            font-size: 0.775rem;
            font-weight: 700;
            margin-bottom: 4px;
            text-align: center;
          }

          .register-modal-submit-btn {
            grid-column: span 2;
            width: 100%;
            padding: 0.8rem;
            margin-top: 0.5rem;
            background: linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #2dd4bf 100%);
            background-size: 200% auto;
            border: none;
            border-radius: 12px;
            color: #fff;
            font-size: 0.95rem;
            font-weight: 700;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.6rem;
            box-shadow: 0 8px 20px -5px rgba(15, 118, 110, 0.3);
            position: relative;
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
          }

          .register-modal-submit-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.25),
              transparent
            );
            transition: 0.6s ease;
          }

          .register-modal-submit-btn:hover:not(:disabled)::before {
            left: 100%;
          }

          .register-modal-submit-btn:hover:not(:disabled) {
            background-position: right center;
            transform: translateY(-2px);
            box-shadow: 0 12px 25px -5px rgba(15, 118, 110, 0.4);
          }

          .register-modal-submit-btn .btn-arrow {
            display: inline-block;
            transition: transform 0.25s ease;
          }

          .register-modal-submit-btn:hover:not(:disabled) .btn-arrow {
            transform: translateX(4px);
          }

          .register-modal-submit-btn:disabled {
            background: #cbd5e1;
            cursor: not-allowed;
            box-shadow: none;
            opacity: 0.7;
          }

          @keyframes fadeOverlay { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

          @media (max-width: 600px) {
            .register-modal-form-grid {
              grid-template-columns: 1fr;
            }
            .register-modal-submit-btn,
            .register-modal-strength-hint,
            .register-modal-error-msg {
              grid-column: span 1;
            }
            .register-modal-card {
              padding: 1.5rem 1.25rem;
            }
            .register-modal-heading-section {
              padding-right: 0;
              margin-top: 1.5rem;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
