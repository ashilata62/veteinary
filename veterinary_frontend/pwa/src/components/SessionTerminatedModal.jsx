import React, { useState, useEffect } from 'react';
import { ShieldAlert, LogIn, Lock } from 'lucide-react';

export default function SessionTerminatedModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleSessionTerminated = (e) => {
      setMessage(e?.detail?.message || 'Your account was logged in from another device.');
      setIsOpen(true);
    };

    window.addEventListener('session_terminated', handleSessionTerminated);
    return () => window.removeEventListener('session_terminated', handleSessionTerminated);
  }, []);

  if (!isOpen) return null;

  const handleRelogin = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '1.25rem'
    }}>
      <div style={{
        background: '#111827',
        border: '1px solid rgba(239, 68, 68, 0.35)',
        borderRadius: '16px',
        padding: '2rem',
        maxWidth: '460px',
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 25px rgba(239, 68, 68, 0.15)',
        textAlign: 'center',
        animation: 'fadeIn 0.25s ease-out'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem auto',
          color: '#ef4444'
        }}>
          <ShieldAlert size={32} />
        </div>

        <h3 style={{
          fontSize: '1.3rem',
          fontWeight: 700,
          color: '#ffffff',
          marginBottom: '0.6rem'
        }}>
          Single Device Policy Triggered
        </h3>

        <p style={{
          fontSize: '0.9rem',
          color: '#cbd5e1',
          lineHeight: '1.55',
          marginBottom: '1rem'
        }}>
          Aapka account kisi dusre computer ya browser par login ho gaya hai. Suraksha ke liye is device ka session disconnect kar diya gaya hai.
        </p>

        <div style={{
          background: 'rgba(30, 41, 59, 0.7)',
          borderRadius: '10px',
          padding: '0.75rem 1rem',
          marginBottom: '1.5rem',
          fontSize: '0.8rem',
          color: '#94a3b8',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          textAlign: 'left'
        }}>
          <Lock size={15} style={{ color: '#ef4444', flexShrink: 0 }} />
          <span>If this wasn't you, someone may have your password. Please re-login and change your password.</span>
        </div>

        <button
          onClick={handleRelogin}
          style={{
            width: '100%',
            padding: '0.75rem 1.25rem',
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)',
            transition: 'all 0.2s'
          }}
        >
          <LogIn size={18} />
          Log In Again
        </button>
      </div>
    </div>
  );
}
