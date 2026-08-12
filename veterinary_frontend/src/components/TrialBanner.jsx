import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, AlertTriangle, ArrowRight, Eye } from 'lucide-react';

export default function TrialBanner() {
  const navigate = useNavigate();

  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  const user = JSON.parse(userStr);

  if (!user || !user.trial_end_date) return null;
  if (user.subscription_status !== 'Trial') return null; // Only show for Trial

  const today = new Date();
  const endDate = new Date(user.trial_end_date);
  
  // Calculate remaining days
  const diffTime = endDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 0) return null; // Handled by TrialExpired modal
  
  const isExpiringSoon = diffDays <= 3;
  
  return (
    <div style={{
      backgroundColor: isExpiringSoon ? '#fef2f2' : '#f0fdf4',
      border: `1px solid ${isExpiringSoon ? '#f87171' : '#86efac'}`,
      borderRadius: '8px',
      padding: '12px 16px',
      margin: '0 0 20px 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ 
          backgroundColor: isExpiringSoon ? '#fee2e2' : '#dcfce7', 
          padding: '8px', 
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isExpiringSoon ? '#ef4444' : '#22c55e'
        }}>
          {isExpiringSoon ? <AlertTriangle size={20} /> : <Clock size={20} />}
        </div>
        <div>
          <h4 style={{ margin: 0, color: '#1e293b', fontSize: '15px', fontWeight: '600' }}>
            Your 7-day free trial is currently active
          </h4>
          <p style={{ margin: '4px 0 0', color: '#475569', fontSize: '13px' }}>
            You have <strong>{diffDays} days remaining</strong> in your trial. 
            {isExpiringSoon && ' To ensure uninterrupted access, please upgrade your plan.'}
          </p>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
        <button 
          onClick={() => {
            navigate('/landing');
            setTimeout(() => {
              const el = document.getElementById('pricing');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: '#64748b',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Eye size={14} /> View Plans
        </button>
        <button 
          onClick={() => {
            navigate('/landing');
            setTimeout(() => {
              const el = document.getElementById('pricing');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
          style={{
            backgroundColor: isExpiringSoon ? '#ef4444' : '#22c55e',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          Buy Plan Now <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
