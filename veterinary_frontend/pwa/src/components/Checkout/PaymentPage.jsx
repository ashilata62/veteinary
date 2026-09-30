import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, CircleCheck, AlertCircle, Loader2 } from 'lucide-react';
import './PaymentPage.css';
import { apiFetch } from '../../utils/api';
import { Capacitor } from '@capacitor/core';

export default function PaymentPage() {
  const location = useLocation();
  const planId = location.pathname.split('/').pop();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, success, failed
  const [planDetails, setPlanDetails] = useState({ name: 'Standard Plan', amount: 1299 });
  const isNative = Capacitor.isNativePlatform();

  useEffect(() => {
    let script = null;
    if (!isNative) {
      // Load Razorpay Script only on web
      script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => setLoading(false);
      document.body.appendChild(script);
    } else {
      setLoading(false);
    }

    const PLANS = {
      'starter': { name: 'Starter Plan', amount: 999 },
      'standard': { name: 'Standard Plan', amount: 1299 },
      'pro': { name: 'Pro Plan', amount: 1499 },
      'plan-starter': { name: 'Starter Plan', amount: 999 },
      'plan-standard': { name: 'Standard Plan', amount: 1299 },
      'plan-pro': { name: 'Pro Plan', amount: 1499 },
      'custom': { name: 'Custom Plan', amount: 0, isCustom: true }
    };
    
    const key = (planId || '').toLowerCase();
    if (PLANS[key]) {
      setPlanDetails(PLANS[key]);
    } else {
      setPlanDetails({ name: 'Standard Plan', amount: 1299 });
    }

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [planId]);

  const handlePayment = async () => {
    setProcessing(true);
    setStatus('idle');
    try {
      // 1. Create Order on Backend
      let user = { id: 'temp_user_id', name: 'Clinic Administrator', email: 'admin@vetclinic.com', phone: '9999999999' };
      try {
        const parsed = JSON.parse(localStorage.getItem('user'));
        if (parsed && typeof parsed === 'object') user = parsed;
      } catch(e) {}
      
      const orderRes = await apiFetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: planId || 'standard',
          amount: planDetails.amount,
          clinicAdminId: user.id || user.userId
        })
      });
      const orderData = await orderRes.json();

      if (orderData.status !== 'success') {
        throw new Error(orderData.message || 'Failed to create order');
      }

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: orderData.data.key_id,
        amount: orderData.data.amount,
        currency: orderData.data.currency || 'INR',
        name: 'PetCare Pro',
        description: `Subscription for ${planDetails.name}`,
        image: '/kt-logo.png',
        order_id: orderData.data.order_id,
        handler: async function (response) {
          // 3. Verify Payment Signature
          try {
            const verifyRes = await apiFetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                clinicAdminId: user.id || user.userId,
                planId: planId || 'standard',
                amount: planDetails.amount
              })
            });
            const verifyData = await verifyRes.json();
            
            if (verifyData.status === 'success') {
              try {
                const u = JSON.parse(localStorage.getItem('user') || '{}');
                u.subscription_status = 'active';
                u.plan_id = planId || 'plan-standard';
                localStorage.setItem('user', JSON.stringify(u));
                window.dispatchEvent(new CustomEvent('auth:subscription_status', {
                  detail: { code: 'ACTIVE', data: { plan: planId || 'plan-standard' } }
                }));
              } catch (e) {}
              
              setStatus('success');
              setTimeout(() => navigate('/dashboard'), 2500);
            } else {
              setStatus('failed');
            }
          } catch (err) {
            console.error('Verification error:', err);
            setStatus('failed');
          }
        },
        prefill: {
          name: user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Clinic Administrator',
          email: user.email || 'admin@vetclinic.com',
          contact: user.phone || '9999999999'
        },
        theme: {
          color: '#2dd4bf'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        console.error('Razorpay payment failed:', response.error);
        setStatus('failed');
      });
      rzp.open();
    } catch (error) {
      console.error('Payment initiation error:', error);
      alert(error.message || 'Payment initiation failed');
      setStatus('failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="payment-loading"><Loader2 className="spinner" size={48} /></div>;
  }

  return (
    <div className="payment-container">
      <div className="payment-card">
        <div className="payment-header">
          <img src="/kt-logo.png" alt="PetCare Pro" className="payment-logo" />
          <h2>Complete Your Subscription</h2>
          <p>Secure checkout via Razorpay</p>
        </div>

        {status === 'success' ? (
          <div className="payment-status success">
            <CircleCheck size={64} color="#34d399" />
            <h3>Payment Successful!</h3>
            <p>Your subscription is now active. Redirecting to dashboard...</p>
          </div>
        ) : status === 'failed' ? (
          <div className="payment-status failed">
            <AlertCircle size={64} color="#f87171" />
            <h3>Payment Failed</h3>
            <p>We couldn't process your payment. Please try again.</p>
            <button onClick={() => setStatus('idle')} className="btn-retry">Try Again</button>
          </div>
        ) : (
          <div className="payment-details">
            <div className="plan-summary">
              <span className="plan-name">{planDetails.name}</span>
              <span className="plan-price" style={{ fontSize: '1.4rem', color: '#2dd4bf' }}>
                {planDetails.isCustom ? 'Custom Quote' : `₹${planDetails.amount}`}
              </span>
            </div>
            
            {isNative ? (
              <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
                <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1.25rem', border: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
                  <p style={{ color: '#0f172a', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                    SaaS Subscription Management
                  </p>
                  <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                    PetCare Pro is a multi-platform clinic management service. To activate or manage your <strong>{planDetails.name}</strong>, please access your billing portal via any browser at:
                  </p>
                  <div style={{ margin: '0.75rem 0', padding: '0.6rem', background: '#e0f2fe', borderRadius: '8px', color: '#0369a1', fontWeight: 600, fontSize: '0.85rem', wordBreak: 'break-all' }}>
                    https://veterinary-saas.kiaantechnology.com
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>
                    Subscriptions managed online automatically sync to this mobile app.
                  </p>
                </div>
                <button 
                  className="btn-pay" 
                  onClick={() => navigate('/dashboard')}
                  style={{ backgroundColor: '#0d9488', borderColor: '#0d9488' }}
                >
                  Return to Dashboard
                </button>
              </div>
            ) : planDetails.isCustom ? (
              <>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '1.25rem 0', lineHeight: 1.6, textAlign: 'center' }}>
                  Custom plans include personalized setup for your clinic (personal domain, branding, and custom AI integrations). Please contact our sales team to receive a tailored quote.
                </p>
                <button 
                  className="btn-pay" 
                  style={{ backgroundColor: '#0284c7', borderColor: '#0284c7' }}
                  onClick={() => navigate('/plans')}
                >
                  Contact Sales on Plans Page
                </button>
              </>
            ) : (
              <>
                <div className="payment-security-badges">
                  <div className="badge"><ShieldCheck size={16} /> 256-bit Encrypted</div>
                  <div className="badge">Razorpay Trusted</div>
                </div>

                <button 
                  className="btn-pay" 
                  onClick={handlePayment} 
                  disabled={processing}
                >
                  {processing ? <Loader2 className="spinner" size={20} /> : `Pay ₹${planDetails.amount} Securely`}
                </button>
                <p className="test-mode-text">Official Razorpay Checkout Integration Active</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
