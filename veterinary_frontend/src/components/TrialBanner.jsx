import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, AlertTriangle, ArrowRight, Eye } from 'lucide-react';

export default function TrialBanner() {
  const navigate = useNavigate();

  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  const user = JSON.parse(userStr);

  if (!user) return null;
  const status = (user.subscription_status || 'active').toLowerCase();
  // Show banner for trial and active users only
  if (status !== 'trial' && status !== 'active') return null;

  const isTrial = status === 'trial';
  let diffDays = 0;
  let isExpiringSoon = false;
  
  if (isTrial && user.trial_end_date) {
    const today = new Date();
    const endDate = new Date(user.trial_end_date);
    diffDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return null; // Handled by TrialExpired modal
    isExpiringSoon = diffDays <= 3;
  }
  
  return (
    <div style={{
      backgroundColor: '#fef3c7',
      color: '#92400e',
      padding: '8px 24px',
      margin: '0 0 20px 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      fontSize: '0.9rem',
      fontWeight: '600',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      borderRadius: '4px'
    }}>
      <span style={{
        backgroundColor: '#f59e0b',
        color: '#ffffff',
        padding: '2px 10px',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '700',
        letterSpacing: '0.5px',
        textTransform: 'uppercase'
      }}>
        Reminder
      </span>

      <span style={{ flex: 1, textAlign: 'center' }}>
        {isTrial ? (
          <>Notice: Only {diffDays} Days Left for Free Trial! Upgrade your plan to unlock full clinic management features.</>
        ) : (
          <>Notice: Want to unlock more premium features? Upgrade your plan today.</>
        )}
      </span>

      <button 
        onClick={() => navigate('/plans')}
        style={{
          backgroundColor: '#ea580c',
          color: '#ffffff',
          border: 'none',
          borderRadius: '20px',
          padding: '6px 16px',
          fontSize: '0.85rem',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: '0 2px 4px rgba(234, 88, 12, 0.2)',
          transition: 'background-color 0.2s ease'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c2410c'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ea580c'}
      >
        Upgrade Plan <ArrowRight size={14} strokeWidth={2.5} />
      </button>
    </div>
  );
}
