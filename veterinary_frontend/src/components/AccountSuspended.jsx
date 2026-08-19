import React from 'react';
import { Shield, AlertTriangle, Mail, Phone, LogOut } from 'lucide-react';

export default function AccountSuspended({ onLogout, clinicName }) {
  return (
    <div className="trial-expired-page">
      <div className="trial-expired-bg" />
      <header className="trial-expired-header">
        <div className="trial-expired-logo">
          <img src="/kt-logo.png" alt="PetCare Pro" className="trial-logo-img" />
          <span className="trial-logo-text">PetCare Pro</span>
        </div>
        <button className="trial-logout-btn" onClick={onLogout}>
          <LogOut size={16} />
          Logout
        </button>
      </header>

      <div className="trial-expired-content">
        <div className="trial-hero">
          <div className="trial-lock-icon" style={{ background: 'rgba(239, 68, 68, 0.15)' }}>
            <AlertTriangle size={36} style={{ color: '#ef4444' }} />
          </div>
          <h1 className="trial-hero-title">
            Aapka Account <span className="trial-hero-highlight" style={{ color: '#ef4444' }}>Suspended</span> Hai
          </h1>
          <p className="trial-hero-subtitle">
            Aapka account <strong>{clinicName || ''}</strong> temporarily suspend ho gaya hai. 
            Iske karan aur support ke liye neeche diye gaye contact details ka use karein.
          </p>
        </div>

        <div className="trial-trust-section" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div className="trial-trust-card" style={{ cursor: 'default' }}>
            <AlertTriangle size={22} style={{ color: '#f59e0b' }} />
            <div>
              <strong>Kyun Block Hua?</strong>
              <span>Payment delay, policy violation, ya suspicious activity ke karan account suspend ho sakta hai.</span>
            </div>
          </div>
          <div className="trial-trust-card" style={{ cursor: 'default' }}>
            <Mail size={22} style={{ color: '#3b82f6' }} />
            <div>
              <strong>Email Support</strong>
              <span>support@kiaantechnology.com</span>
            </div>
          </div>
          <div className="trial-trust-card" style={{ cursor: 'default' }}>
            <Phone size={22} style={{ color: '#10b981' }} />
            <div>
              <strong>Phone Support</strong>
              <span>+91 12345 67890</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}