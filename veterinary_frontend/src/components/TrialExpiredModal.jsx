import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const PLANS = {
  'testing':  { name: 'Testing Plan', price: 1,  features: ['Razorpay ₹1 Test', 'Full functionality'] },
  'starter':  { name: 'Starter',  price: 599,  features: ['Basic clinic management', 'Up to 100 pets'] },
  'standard': { name: 'Standard', price: 799,  features: ['Complete features', 'Up to 500 pets', 'WhatsApp + Email'] },
  'pro':      { name: 'Pro',      price: 1299, features: ['Advanced features', 'Unlimited pets', 'Multi-clinic support'] },
};

export default function TrialExpiredModal({ user, onClose }) {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('standard');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const planDetails = PLANS[selectedPlan];
      const amount = planDetails.price;

      const orderRes = await api.post('/api/payment/create-order', {
        planId: selectedPlan,
        amount: amount,
        clinicAdminId: user.userId
      });

      const orderData = orderRes.data;
      if (orderData.status !== 'success') throw new Error('Failed to create order');

      const options = {
        key: orderData.data.key_id,
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        name: 'VetCare Pro',
        description: `Upgrade to ${planDetails.name}`,
        image: '/kt-logo.png',
        order_id: orderData.data.order_id,
        handler: async function (response) {
          try {
            const verifyRes = await api.post('/api/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              clinicAdminId: user.userId,
              planId: selectedPlan,
              amount: amount
            });

            if (verifyRes.data.status === 'success') {
              toast.success('Subscription activated! Please login again.');
              onClose();
            } else {
              toast.error('Payment verification failed.');
            }
          } catch (err) {
            toast.error('Payment verification failed.');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: '9999999999'
        },
        theme: { color: '#14b8a6' }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function () {
        toast.error('Payment failed or cancelled.');
      });
      rzp.open();
    } catch (error) {
      toast.error('Failed to initiate payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
    }}>
      <div style={{
        background: '#09090b', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)',
        width: '100%', maxWidth: '700px', padding: '32px', color: '#f3f4f6', fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <AlertCircle size={48} color="#f59e0b" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Your Free Trial Has Expired</h2>
          <p style={{ color: '#9ca3af', marginTop: '8px' }}>
            To continue using VetCare Pro, please select a plan and upgrade your account.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {Object.entries(PLANS).map(([key, plan]) => (
            <div key={key} onClick={() => setSelectedPlan(key)} style={{
              border: `2px solid ${selectedPlan === key ? '#14b8a6' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '12px', padding: '16px', cursor: 'pointer',
              background: selectedPlan === key ? 'rgba(20,184,166,0.05)' : 'rgba(255,255,255,0.02)',
              transition: 'all 0.2s'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: selectedPlan === key ? '#14b8a6' : '#fff' }}>{plan.name}</h3>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '8px 0' }}>₹{plan.price}<span style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 'normal' }}>/mo</span></div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.8rem', color: '#9ca3af' }}>
                {plan.features.map((f, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <Check size={12} color="#14b8a6" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px', color: '#fff', cursor: 'pointer'
          }}>Cancel & Logout</button>
          <button onClick={handleUpgrade} disabled={loading} style={{
            flex: 2, padding: '12px', background: '#14b8a6', border: 'none',
            borderRadius: '8px', color: '#fff', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}>
            {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : 'Upgrade Now via Razorpay'}
          </button>
        </div>
      </div>
    </div>
  );
}
