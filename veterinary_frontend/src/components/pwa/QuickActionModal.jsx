import React from 'react';
import { CalendarPlus, UserPlus, FileText, X, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function QuickActionModal({ isOpen, onClose, setCurrentTab }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleAction = (tabName, routePath) => {
    onClose();
    if (setCurrentTab) setCurrentTab(tabName);
    if (routePath) navigate(routePath);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '0'
    }} onClick={onClose}>
      <div style={{
        backgroundColor: '#ffffff',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        width: '100%',
        maxWidth: '540px',
        padding: '1.5rem',
        boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.15)',
        border: '1px solid #e2e8f0',
        animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }} onClick={(e) => e.stopPropagation()}>
        {/* Top Handle */}
        <div style={{ width: '40px', height: '4px', backgroundColor: '#cbd5e1', borderRadius: '99px', margin: '0 auto 1.25rem auto' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="#0d9488" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Quick Actions</h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b'
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            onClick={() => handleAction('appointments', '/appointments')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.85rem 1rem',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ width: 44, height: 44, borderRadius: '12px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CalendarPlus size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a' }}>Book Appointment</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Schedule a consultation or visit</div>
            </div>
          </button>

          <button
            onClick={() => handleAction('patients', '/patients')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.85rem 1rem',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ width: 44, height: 44, borderRadius: '12px', background: '#f0fdfa', color: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <UserPlus size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a' }}>Register Patient / Pet</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Add new owner and pet records</div>
            </div>
          </button>

          <button
            onClick={() => handleAction('billing', '/billing')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.85rem 1rem',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ width: 44, height: 44, borderRadius: '12px', background: '#faf5ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FileText size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a' }}>Create Invoice / Billing</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Fast POS receipt & payment</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
