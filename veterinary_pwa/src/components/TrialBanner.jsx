import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export default function TrialBanner() {
  const navigate = useNavigate();

  const userStr = localStorage.getItem('user');
  if (!userStr) return null;

  let user = {};
  try {
    user = JSON.parse(userStr);
  } catch (e) {
    return null;
  }

  const status = (user.subscription_status || '').toLowerCase();
  const planId = (user.plan_id || '').toLowerCase();

  // Show banner if subscription_status is 'trial' or plan_id is 'plan-free-trial'
  const isTrial = status === 'trial' || planId === 'plan-free-trial' || planId === 'free-trial';
  if (!isTrial) return null;

  // Helper to parse dates strictly as local calendar midnight
  const parseMid = (val) => {
    if (!val) return null;
    if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}/.test(val)) {
      const [y, m, d] = val.slice(0, 10).split('-').map(Number);
      return new Date(y, m - 1, d);
    }
    const dt = new Date(val);
    return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
  };

  const today = new Date();
  const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startMid = parseMid(user.trial_start_date || user.created_at) || todayMid;
  const endMid = parseMid(user.trial_end_date);

  let totalDays = 7;
  let diffDays = 7;
  let currentDay = 1;

  if (endMid) {
    totalDays = Math.max(1, Math.round((endMid - startMid) / (1000 * 60 * 60 * 24))) || 7;
    const daysPassed = Math.max(0, Math.round((todayMid - startMid) / (1000 * 60 * 60 * 24)));
    diffDays = Math.max(0, Math.round((endMid - todayMid) / (1000 * 60 * 60 * 24)));
    currentDay = Math.min(totalDays, daysPassed + 1);

    // If backend provided pre-calculated values, use them
    if (typeof user.trial_days_left === 'number') {
      diffDays = user.trial_days_left;
    }
    if (typeof user.trial_current_day === 'number') {
      currentDay = user.trial_current_day;
    }

    // If trial is completely over, the TrialExpired page/modal takes over
    if (diffDays <= 0) return null;
  }

  const formattedRegDate = startMid 
    ? startMid.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Recently';

  const formattedEndDate = endMid
    ? endMid.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

  return (
    <div 
      className="trial-banner"
      style={{
        background: 'linear-gradient(90deg, #78350f 0%, #92400e 35%, #b45309 100%)',
        color: '#fef3c7',
        padding: '10px 20px',
        margin: '0 0 16px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px',
        borderRadius: '12px',
        border: '1px solid rgba(251, 191, 36, 0.3)',
        boxShadow: '0 4px 14px rgba(180, 83, 9, 0.25)',
        flexWrap: 'wrap'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <span 
          style={{
            backgroundColor: '#fbbf24',
            color: '#78350f',
            padding: '3px 12px',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: '800',
            letterSpacing: '0.5px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            textTransform: 'uppercase',
            boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
          }}
        >
          <Sparkles size={13} /> 7-Day Free Trial
        </span>

        <span style={{ fontSize: '0.88rem', fontWeight: 500, color: '#fffbeb' }}>
          Registered on <strong>{formattedRegDate}</strong> • Day <strong>{currentDay} of 7</strong>
          <span style={{ margin: '0 8px', opacity: 0.6 }}>|</span>
          <span style={{ color: '#fef08a', fontWeight: '700' }}>
            ⏳ {diffDays} {diffDays === 1 ? 'Day' : 'Days'} Remaining
          </span>
          {formattedEndDate && (
            <span style={{ opacity: 0.85, fontSize: '0.8rem', marginLeft: '6px' }}>
              (Expires {formattedEndDate})
            </span>
          )}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button 
          onClick={() => navigate('/plans')}
          style={{
            backgroundColor: '#ea580c',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '20px',
            padding: '6px 18px',
            fontSize: '0.82rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 3px 8px rgba(234, 88, 12, 0.4)',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#c2410c';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#ea580c';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Upgrade Plan / Buy Now <ArrowRight size={14} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
