import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Mail, Phone, Lock, Eye, EyeOff, Building2, User, Loader2 } from 'lucide-react';
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
    if (form.password !== form.confirmPassword) {
      setErrorMessage('Passwords do not match!'); return;
    }
    setLoading(true);
    try {
      const res = await api.post('/api/auth/register', {
        businessName: form.clinicName, // updated to match backend expectation
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

  const inp = {
    width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
    color: '#f3f4f6', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
    transition: 'border 0.2s',
  };
  const lbl = { fontSize: '0.82rem', fontWeight: '600', color: '#9ca3af', marginBottom: '5px', display: 'block' };
  const grp = { marginBottom: '14px' };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px', animation: 'fadeOverlay 0.2s ease'
    }} onClick={onClose}>
      <div style={{
        background: 'linear-gradient(145deg, #111113, #0d0d0f)',
        border: '1px solid rgba(20,184,166,0.2)',
        borderRadius: '20px',
        boxShadow: '0 30px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(20,184,166,0.1)',
        width: '100%', maxWidth: '480px',
        padding: '32px 28px',
        position: 'relative',
        animation: 'slideUp 0.3s ease',
        fontFamily: "'Inter', system-ui, sans-serif",
        color: '#f3f4f6',
      }} onClick={e => e.stopPropagation()}>

        {/* Close */}
        {!paymentSuccess && (
          <button onClick={onClose} style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '50%', width: '34px', height: '34px',
            cursor: 'pointer', color: '#9ca3af', fontSize: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s', zIndex: 10
          }}>
            <X size={18} />
          </button>
        )}

        {paymentSuccess ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', animation: 'slideUp 0.4s ease' }}>
            <div style={{ fontSize: '4.5rem', marginBottom: '24px', animation: 'bounce 2s infinite' }}>🎉</div>
            <h2 style={{ fontSize: '1.8rem', color: '#10b981', marginBottom: '12px', fontWeight: 'bold' }}>Welcome to VetCare Pro!</h2>
            <p style={{ color: '#9ca3af', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '32px' }}>
              Your payment was successful and your account is now active.<br/>
              Redirecting you to the login page...
            </p>
            <Loader2 size={28} color="#10b981" style={{ animation: 'spin 1s linear infinite', margin: '0 auto' }} />
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '24px', paddingRight: '20px' }}>
              <span style={{ 
                background: 'rgba(20,184,166,0.1)', color: '#14b8a6', padding: '6px 12px', 
                borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' 
              }}>
                {planObj.name} — {planObj.price} {planObj.cycle}
              </span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', margin: '16px 0 8px 0', letterSpacing: '-0.5px' }}>
                Create Your Clinic Account
              </h2>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '6px' }}>
                Quick 2-minute setup. Start managing your clinic instantly.
              </p>
            </div>

        {/* Form */}
        <form onSubmit={submit} noValidate>
          {/* Clinic Name */}
          <div style={grp}>
            <label style={lbl}>Clinic / Business Name *</label>
            <div style={{ position: 'relative' }}>
              <Building2 size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
              <input name="clinicName" value={form.clinicName} onChange={handle} required
                placeholder="Enter your clinic name"
                style={{ ...inp, paddingLeft: '38px' }} />
            </div>
          </div>

          {/* Admin Name */}
          <div style={grp}>
            <label style={lbl}>Admin Full Name *</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
              <input name="adminName" value={form.adminName} onChange={handle} required
                placeholder="Enter admin full name"
                style={{ ...inp, paddingLeft: '38px' }} />
            </div>
          </div>

          {/* Email */}
          <div style={grp}>
            <label style={lbl}>Work Email *</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
              <input name="email" type="email" value={form.email} onChange={handle} required
                placeholder="admin@yourclinic.com"
                style={{ ...inp, paddingLeft: '38px' }} />
            </div>
          </div>

          {/* Mobile */}
          <div style={grp}>
            <label style={lbl}>Mobile Number *</label>
            <div style={{ position: 'relative' }}>
              <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
              <input name="mobile" type="tel" value={form.mobile} onChange={handle} required
                placeholder="+91 98765 43210"
                style={{ ...inp, paddingLeft: '38px' }} />
            </div>
          </div>

          {/* Password row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div style={grp}>
              <label style={lbl}>Password *</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#6b7280" style={{ position: 'absolute', top: 12, left: 14 }} />
                <input 
                  type={showPass ? 'text' : 'password'} 
                  name="password" 
                  value={form.password}
                  placeholder="Create strong password" 
                  required 
                  style={{...inp, paddingLeft: '40px'}} 
                  onChange={handle}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                />
                <div onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', top: 12, right: 14, cursor: 'pointer', color: '#6b7280' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </div>
              </div>
              
              {/* Password Strength Hint */}
              {isPasswordFocused && (
                <div style={{ 
                  marginTop: '8px', padding: '10px', 
                  background: 'rgba(59, 130, 246, 0.05)', 
                  border: '1px solid rgba(59, 130, 246, 0.2)', 
                  borderRadius: '8px', fontSize: '0.75rem', color: '#9ca3af' 
                }}>
                  <div style={{ color: '#60a5fa', fontWeight: 'bold', marginBottom: '4px' }}>Password must contain:</div>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    <li style={{ color: form.password?.length >= 8 ? '#10b981' : '#9ca3af' }}>At least 8 characters</li>
                    <li style={{ color: /[A-Z]/.test(form.password) ? '#10b981' : '#9ca3af' }}>One uppercase letter (A-Z)</li>
                    <li style={{ color: /[a-z]/.test(form.password) ? '#10b981' : '#9ca3af' }}>One lowercase letter (a-z)</li>
                    <li style={{ color: /\d/.test(form.password) ? '#10b981' : '#9ca3af' }}>One number (0-9)</li>
                    <li style={{ color: /[@$!%*?&]/.test(form.password) ? '#10b981' : '#9ca3af' }}>One special character (@$!%*?&)</li>
                  </ul>
                </div>
              )}
            </div>

            <div style={grp}>
              <label style={lbl}>Confirm Password *</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#6b7280" style={{ position: 'absolute', top: 12, left: 14 }} />
                <input 
                  type={showConfirm ? 'text' : 'password'} 
                  name="confirmPassword" 
                  value={form.confirmPassword}
                  placeholder="Confirm password" 
                  required 
                  style={{...inp, paddingLeft: '40px'}} 
                  onChange={handle}
                />
                <div onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', top: 12, right: 14, cursor: 'pointer', color: '#6b7280' }}>
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </div>
              </div>
            </div>
          </div>

          {errorMessage && <div style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '10px', textAlign: 'center' }}>{errorMessage}</div>}

          {/* Submit */}
          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%', padding: '14px', marginTop: '10px',
              background: 'linear-gradient(135deg, #14b8a6, #0d9488)', border: 'none',
              borderRadius: '10px', color: '#fff', fontSize: '1rem', fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              boxShadow: '0 4px 14px rgba(20, 184, 166, 0.4)'
            }}
          >
            {loading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Creating Account...</> : 'Create Account & Get Started →'}
          </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem', color: '#6b7280' }}>
            Already have an account? <span onClick={() => { onClose(); navigate('/login'); }} style={{ color: '#14b8a6', fontWeight: 'bold', cursor: 'pointer' }}>Login here</span>
          </div>
          </>
        )}

        <style>{`
          @keyframes fadeOverlay { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        `}</style>
      </div>
    </div>
  );
}
