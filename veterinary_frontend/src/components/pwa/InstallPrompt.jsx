import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, CheckCircle, Share } from 'lucide-react';

export default function InstallPrompt({ deferredPrompt, onInstallSuccess, onClose }) {
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS devices where beforeinstallprompt is not supported
    const isIosDevice = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    const isStandalone = window.navigator.standalone === true;
    if (isIosDevice && !isStandalone) {
      setIsIOS(true);
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      if (onInstallSuccess) onInstallSuccess();
    }
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '1rem'
    }} onClick={onClose}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        maxWidth: '440px',
        width: '100%',
        padding: '1.75rem',
        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.25)',
        border: '1px solid #e2e8f0',
        position: 'relative',
        animation: 'fadeInUp 0.3s ease-out'
      }} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)',
            flexShrink: 0
          }}>
            <Smartphone size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Install PetCare Pro</h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '2px 0 0 0' }}>Fast PWA & offline clinic management</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#334155', fontWeight: 500 }}>
            <CheckCircle size={16} color="#0d9488" />
            <span>Works 100% Offline with Local Sync</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#334155', fontWeight: 500 }}>
            <CheckCircle size={16} color="#0d9488" />
            <span>Instant Launch without App Store downloads</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#334155', fontWeight: 500 }}>
            <CheckCircle size={16} color="#0d9488" />
            <span>Zero phone storage clutter (&lt; 3 MB size)</span>
          </div>
        </div>

        {isIOS ? (
          <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '1rem', fontSize: '0.85rem', color: '#1e3a8a' }}>
            <p style={{ fontWeight: 700, marginBottom: '0.5rem' }}>How to install on iPhone/iPad:</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
              1. Tap the <strong>Share</strong> button <Share size={15} style={{ verticalAlign: 'middle' }} /> in Safari.
            </div>
            <div>
              2. Scroll down and tap <strong>"Add to Home Screen"</strong>.
            </div>
          </div>
        ) : (
          <button
            onClick={handleInstallClick}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '0.75rem 1.25rem',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.92rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(13, 148, 136, 0.35)',
              transition: 'transform 0.15s ease'
            }}
          >
            <Download size={18} />
            <span>Install App on Device</span>
          </button>
        )}
      </div>
    </div>
  );
}
