import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, CircleCheck, AlertCircle, Loader2 } from 'lucide-react';
import './PaymentPage.css';

export default function PaymentPage() {
  const location = useLocation();
  const planId = location.pathname.split('/').pop();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, success, failed
  const [planDetails, setPlanDetails] = useState({ name: 'Pro Plan', amount: 199 });

  useEffect(() => {
    // Load Razorpay Script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setLoading(false);
    document.body.appendChild(script);

    // Mock fetching plan details based on ID
    if (planId === 'basic') setPlanDetails({ name: 'Basic Plan', amount: 99 });
    if (planId === 'enterprise') setPlanDetails({ name: 'Enterprise Plan', amount: 1999 });

    return () => {
      document.body.removeChild(script);
    };
  }, [planId]);

  const handlePayment = async () => {
    setProcessing(true);
    setStatus('idle');
    try {
      // 1. Create Order on Backend
      let user = { id: 'temp_user_id', first_name: 'Test', last_name: 'User', email: 'test@vetcarepro.com', phone: '9999999999' };
      try {
        const parsed = JSON.parse(localStorage.getItem('user'));
        if (parsed && typeof parsed === 'object') user = parsed;
      } catch(e) {}
      
      const orderRes = await fetch('http://localhost:5001/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: planId || 'pro',
          amount: planDetails.amount,
          clinicAdminId: user.id
        })
      });
      const orderData = await orderRes.json();

      if (orderData.status !== 'success') throw new Error('Failed to create order');

      // 2. Open Razorpay Checkout
      const options = {
        key: orderData.data.key_id,
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        name: 'VetCare Pro',
        description: `Subscription for ${planDetails.name}`,
        image: '/kt-logo.png', // VetCare Pro logo
        order_id: orderData.data.order_id,
        handler: async function (response) {
          // 3. Verify Payment Signature
          try {
            const verifyRes = await fetch('http://localhost:5001/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                clinicAdminId: user.id,
                planId: planId || 'pro',
                amount: planDetails.amount
              })
            });
            const verifyData = await verifyRes.json();
            
            if (verifyData.status === 'success') {
              setStatus('success');
              setTimeout(() => navigate('/dashboard'), 3000);
            } else {
              setStatus('failed');
            }
          } catch (err) {
            setStatus('failed');
          }
        },
        prefill: {
          name: `${user.first_name || ''} ${user.last_name || ''}`,
          email: user.email,
          contact: user.phone || '9999999999'
        },
        theme: {
          color: '#2dd4bf'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        setStatus('failed');
      });
      rzp.open();
    } catch (error) {
      console.error(error);
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
          <img src="/kt-logo.png" alt="VetCare Pro" className="payment-logo" />
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
              <span className="plan-price">${planDetails.amount}</span>
            </div>
            
            <div className="payment-security-badges">
              <div className="badge"><ShieldCheck size={16} /> 256-bit Encrypted</div>
              <div className="badge">Razorpay Trusted</div>
            </div>

            <button 
              className="btn-pay" 
              onClick={handlePayment} 
              disabled={processing}
            >
              {processing ? <Loader2 className="spinner" size={20} /> : `Pay $${planDetails.amount} Securely`}
            </button>
            <p className="test-mode-text">Test Mode Active: No real money will be deducted.</p>
          </div>
        )}
      </div>
    </div>
  );
}
