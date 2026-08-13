import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hourglass } from 'lucide-react';

export default function TrialPopup() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);
  const [isTrial, setIsTrial] = useState(false);

  useEffect(() => {
    // Check if we already showed it this session
    if (sessionStorage.getItem('trialPopupShown')) return;

    const userStr = localStorage.getItem('user');
    if (!userStr) return;
    const user = JSON.parse(userStr);

    const status = (user.subscription_status || 'active').toLowerCase();
    const endDateStr = user.trial_end_date; 

    if (!endDateStr) return;

    const today = new Date();
    const endDate = new Date(endDateStr);
    const diffDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

    const isFreeTrial = status === 'trial';
    setIsTrial(isFreeTrial);
    setDaysLeft(diffDays);

    let shouldShow = false;
    if (isFreeTrial && diffDays >= 0) {
      shouldShow = true; // Always show for free plan
    } else if (status === 'active' && diffDays <= 5 && diffDays >= 0) {
      shouldShow = true; // Show for paid plan in last 5 days
    }

    if (shouldShow) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  const handleClose = () => {
    sessionStorage.setItem('trialPopupShown', 'true');
    setShow(false);
  };

  const handleUpgrade = () => {
    sessionStorage.setItem('trialPopupShown', 'true');
    setShow(false);
    navigate('/plans');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      zIndex: 999999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '2.5rem 2rem',
        width: '100%',
        maxWidth: '420px',
        textAlign: 'center',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        position: 'relative'
      }}>
        <div style={{
          backgroundColor: '#ffedd5', // light orange circle
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto'
        }}>
          <Hourglass size={28} color="#9a3412" />
        </div>
        
        <h2 style={{
          fontSize: '1.4rem',
          fontWeight: '800',
          color: '#0f172a',
          margin: '0 0 1rem 0'
        }}>
          {isTrial ? 'Free Trial Expiring Soon!' : 'Subscription Expiring Soon!'}
        </h2>
        
        <p style={{
          color: '#475569',
          fontSize: '0.95rem',
          lineHeight: '1.5',
          margin: '0 0 2rem 0'
        }}>
          Notice: You have only <strong style={{ color: '#d97706' }}>{daysLeft} days left</strong> in your {isTrial ? '7-Day Free Trial' : 'Current'} plan. Upgrade your plan now to avoid clinic management limits.
        </p>

        <button 
          onClick={handleUpgrade}
          style={{
            backgroundColor: '#2563eb', // blue button
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '0.8rem',
            width: '100%',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            marginBottom: '1rem',
            boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
          }}
        >
          UPGRADE PLAN NOW <span style={{ fontSize: '1.1rem' }}>→</span>
        </button>

        <button 
          onClick={handleClose}
          style={{
            backgroundColor: 'transparent',
            color: '#64748b',
            border: 'none',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Remind Me Later
        </button>
      </div>
    </div>
  );
}
