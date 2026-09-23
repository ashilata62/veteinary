import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, CircleCheck, AlertCircle, Loader2, CreditCard, Sparkles, FileText, ArrowRight, Download, CheckCircle2 } from 'lucide-react';
import './PaymentPage.css';
import { apiFetch } from '../../utils/api';

export default function PaymentPage() {
  const location = useLocation();
  const rawPlanId = location.pathname.split('/').pop() || 'plan-pro';
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, success, failed
  const [planDetails, setPlanDetails] = useState({ id: 'plan-pro', name: 'Pro Enterprise Clinic', amount: 1999, currency: 'INR' });
  const [paymentConfig, setPaymentConfig] = useState({ activeGateway: 'razorpay', defaultCurrency: 'INR' });
  const [selectedGateway, setSelectedGateway] = useState('razorpay');
  const [invoiceInfo, setInvoiceInfo] = useState(null);

  useEffect(() => {
    // 1. Load Razorpay script dynamically
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    // 2. Fetch plans & config from backend
    const initializeData = async () => {
      try {
        const [configRes, plansRes] = await Promise.all([
          apiFetch('/api/payment/config').catch(() => null),
          apiFetch('/api/subscriptions/plans').catch(() => null)
        ]);

        if (configRes && configRes.ok) {
          const cfgData = await configRes.json();
          if (cfgData.status === 'success') {
            setPaymentConfig(cfgData.data);
            if (cfgData.data.activeGateway === 'stripe') setSelectedGateway('stripe');
          }
        }

        const normalizedKey = rawPlanId.toLowerCase();
        if (normalizedKey === 'custom' || normalizedKey === 'plan-custom') {
          setPlanDetails({ id: 'custom', name: 'Custom Plan', amount: 0, isCustom: true });
          setLoading(false);
          return;
        }

        if (plansRes && plansRes.ok) {
          const plansData = await plansRes.json();
          if (plansData.status === 'success' && plansData.data.length > 0) {
            const found = plansData.data.find(p => 
              p.id.toLowerCase() === normalizedKey || 
              p.name.toLowerCase().includes(normalizedKey.replace('plan-', ''))
            );
            if (found) {
              setPlanDetails({
                id: found.id,
                name: found.name,
                amount: parseFloat(found.price),
                features: found.features || []
              });
              setLoading(false);
              return;
            }
          }
        }

        // Fallback pricing if API is warming up (screen matching prices: 999, 1299, 1499)
        const FALLBACK_PLANS = {
          'starter': { id: 'plan-starter', name: 'Starter Plan', amount: 999 },
          'standard': { id: 'plan-standard', name: 'Standard Plan', amount: 1299 },
          'pro': { id: 'plan-pro', name: 'Pro Plan', amount: 1499 },
          'plan-starter': { id: 'plan-starter', name: 'Starter Plan', amount: 999 },
          'plan-standard': { id: 'plan-standard', name: 'Standard Plan', amount: 1299 },
          'plan-pro': { id: 'plan-pro', name: 'Pro Plan', amount: 1499 },
          'custom': { id: 'custom', name: 'Custom Plan', amount: 0, isCustom: true }
        };

        setPlanDetails(FALLBACK_PLANS[normalizedKey] || { id: 'plan-pro', name: 'Pro Plan', amount: 1499 });
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeData();

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [rawPlanId]);

  const handleRazorpayPayment = async (user) => {
    // 1. Create Order
    const orderRes = await apiFetch('/api/payment/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planId: planDetails.id,
        amount: planDetails.amount,
        clinicAdminId: user.id,
        currency: 'INR'
      })
    });
    const orderData = await orderRes.json();

    if (orderData.status !== 'success') {
      throw new Error(orderData.message || 'Failed to create Razorpay order');
    }

    // 2. Launch Razorpay Checkout Modal
    const options = {
      key: orderData.data.key_id || 'rzp_test_dummyKeyId',
      amount: orderData.data.amount,
      currency: orderData.data.currency || 'INR',
      name: 'Kiaan Veterinary Cloud',
      description: `Subscription for ${planDetails.name}`,
      image: '/kt-logo.png',
      order_id: orderData.data.order_id,
      handler: async function (response) {
        // 3. Verify Payment
        try {
          const verifyRes = await apiFetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              clinicAdminId: user.id,
              planId: planDetails.id,
              amount: planDetails.amount
            })
          });
          const verifyData = await verifyRes.json();

          if (verifyData.status === 'success') {
            setInvoiceInfo(verifyData.data);
            setStatus('success');
          } else {
            setStatus('failed');
          }
        } catch (err) {
          setStatus('failed');
        }
      },
      prefill: {
        name: `${user.name || user.first_name || 'Clinic Administrator'}`,
        email: user.email || 'admin@vetclinic.com',
        contact: user.phone || '9999999999'
      },
      theme: {
        color: '#0d9488'
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function () {
      setStatus('failed');
    });
    rzp.open();
  };

  const handleStripePayment = async (user) => {
    const sessionRes = await apiFetch('/api/payment/stripe/create-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planId: planDetails.id,
        clinicAdminId: user.id,
        currency: 'USD',
        successUrl: `${window.location.origin}/dashboard?payment=success`,
        cancelUrl: `${window.location.origin}/checkout/${planDetails.id}`
      })
    });
    const sessionData = await sessionRes.json();

    if (sessionData.status === 'success' && sessionData.data?.checkoutUrl) {
      window.location.href = sessionData.data.checkoutUrl;
    } else {
      throw new Error(sessionData.message || 'Stripe Checkout unavailable');
    }
  };

  const handlePayment = async () => {
    setProcessing(true);
    setStatus('idle');

    let user = { id: 'temp_user_id', name: 'Clinic Administrator', email: 'admin@vetclinic.com' };
    try {
      const parsed = JSON.parse(localStorage.getItem('user'));
      if (parsed && typeof parsed === 'object') user = parsed;
    } catch (e) {}

    try {
      if (selectedGateway === 'stripe') {
        await handleStripePayment(user);
      } else {
        await handleRazorpayPayment(user);
      }
    } catch (error) {
      console.error(error);
      alert(error.message || 'Payment initiation error');
      setStatus('failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="payment-loading">
        <Loader2 className="spinner" size={48} color="#0d9488" />
        <p style={{ marginTop: '1rem', color: '#64748b' }}>Loading secure checkout gateway...</p>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className="payment-card" style={{ maxWidth: '540px' }}>
        <div className="payment-header">
          <img src="/kt-logo.png" alt="Kiaan Veterinary" className="payment-logo" />
          <h2 style={{ color: '#0f172a', fontWeight: 800 }}>Complete Your Subscription</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Activate unlimited cloud access for your veterinary clinic</p>
        </div>

        {status === 'success' ? (
          <div className="payment-status success" style={{ padding: '1.5rem 1rem', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <CheckCircle2 size={36} />
            </div>
            <h3 style={{ color: '#0f172a', fontWeight: 800, fontSize: '1.35rem' }}>Payment Successful!</h3>
            <p style={{ color: '#475569', fontSize: '0.92rem', marginTop: '0.25rem' }}>
              Your subscription to <strong>{planDetails.name}</strong> is now active.
            </p>

            {invoiceInfo?.invoiceNumber && (
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem', margin: '1.25rem 0', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748b' }}>Invoice Reference: </span>
                <strong style={{ color: '#0f766e', fontFamily: 'monospace' }}>{invoiceInfo.invoiceNumber}</strong>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              {invoiceInfo?.invoiceNumber && (
                <a
                  href={`http://localhost:5002/api/payment/invoice/${invoiceInfo.invoiceNumber}/html`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#334155',
                    fontWeight: 600,
                    textDecoration: 'none',
                    fontSize: '0.9rem'
                  }}
                >
                  <FileText size={16} /> View Tax Invoice
                </a>
              )}
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#0d9488',
                  color: '#ffffff',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Go to Dashboard <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ) : status === 'failed' ? (
          <div className="payment-status failed" style={{ padding: '1.5rem 1rem', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <AlertCircle size={36} />
            </div>
            <h3 style={{ color: '#0f172a', fontWeight: 800 }}>Payment Incomplete</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>We were unable to complete your transaction. No charges were made.</p>
            <button onClick={() => setStatus('idle')} className="btn-retry" style={{ marginTop: '1.25rem' }}>
              Try Again
            </button>
          </div>
        ) : (
          <div className="payment-details">
            {planDetails.isCustom ? (
              <>
                <div className="plan-summary" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span className="plan-name" style={{ display: 'block', fontWeight: 700, fontSize: '1.1rem', color: '#0f172a' }}>{planDetails.name}</span>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Enterprise Custom Setup</span>
                    </div>
                    <span className="plan-price" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0284c7' }}>
                      Custom Quote
                    </span>
                  </div>
                </div>

                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '1.25rem 0', lineHeight: 1.6, textAlign: 'center' }}>
                  Custom plans include personalized setup for your clinic (personal domain, branding, and custom AI integrations). Please contact our sales team to receive a tailored quote.
                </p>
                <button 
                  className="btn-pay" 
                  style={{ 
                    backgroundColor: '#0284c7', 
                    borderColor: '#0284c7',
                    width: '100%',
                    padding: '0.85rem',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '1rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate('/plans')}
                >
                  Contact Sales on Plans Page
                </button>
              </>
            ) : (
              <>
                {/* Plan Summary Box */}
                <div className="plan-summary" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span className="plan-name" style={{ display: 'block', fontWeight: 700, fontSize: '1.1rem', color: '#0f172a' }}>{planDetails.name}</span>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>30 Days Full Cloud Access · 18% GST Included</span>
                    </div>
                    <span className="plan-price" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0d9488' }}>
                      ₹{planDetails.amount}
                    </span>
                  </div>
                </div>

                {/* Gateway Switcher if both enabled */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                    Select Payment Method
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div
                      onClick={() => setSelectedGateway('razorpay')}
                      style={{
                        border: selectedGateway === 'razorpay' ? '2px solid #0d9488' : '1px solid #e2e8f0',
                        background: selectedGateway === 'razorpay' ? '#f0fdfa' : '#ffffff',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      <CreditCard size={20} color={selectedGateway === 'razorpay' ? '#0d9488' : '#64748b'} style={{ margin: '0 auto 4px' }} />
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: selectedGateway === 'razorpay' ? '#0f766e' : '#334155' }}>UPI / NetBanking / Cards</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Razorpay (INR)</div>
                    </div>

                    <div
                      onClick={() => setSelectedGateway('stripe')}
                      style={{
                        border: selectedGateway === 'stripe' ? '2px solid #0d9488' : '1px solid #e2e8f0',
                        background: selectedGateway === 'stripe' ? '#f0fdfa' : '#ffffff',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      <CreditCard size={20} color={selectedGateway === 'stripe' ? '#0d9488' : '#64748b'} style={{ margin: '0 auto 4px' }} />
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: selectedGateway === 'stripe' ? '#0f766e' : '#334155' }}>International Cards</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Stripe (USD)</div>
                    </div>
                  </div>
                </div>

                {/* Security Badges */}
                <div className="payment-security-badges" style={{ marginBottom: '1.25rem' }}>
                  <div className="badge"><ShieldCheck size={16} /> 256-Bit SSL Encrypted</div>
                  <div className="badge"><Sparkles size={16} /> Instant Auto Activation</div>
                </div>

                <button
                  className="btn-pay"
                  onClick={handlePayment}
                  disabled={processing}
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    borderRadius: '8px',
                    background: '#0d9488',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '1rem',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)'
                  }}
                >
                  {processing ? (
                    <>
                      <Loader2 className="spinner" size={20} /> Processing Payment...
                    </>
                  ) : (
                    `Pay ₹${planDetails.amount} Securely`
                  )}
                </button>
                <p className="test-mode-text" style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.75rem' }}>
                  Instant Tax Invoice & GST Receipt generated automatically upon successful payment.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
