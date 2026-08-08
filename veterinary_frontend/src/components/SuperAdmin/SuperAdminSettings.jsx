import React, { useState } from 'react';
import { Save, Globe, Shield, Mail, CreditCard, CheckCircle2 } from 'lucide-react';

export default function SuperAdminSettings() {
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [settings, setSettings] = useState({
    platformName: 'VetCare Pro Platform',
    supportEmail: 'support@vetcarepro.com',
    currency: 'INR',
    maintenanceMode: false,
    razorpayKeyId: 'rzp_test_dummyKeyId',
    razorpaySecret: '••••••••••••••••',
    smtpHost: 'smtp.mailgun.org',
    smtpPort: '587'
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="sa-dash-wrapper" style={{ maxWidth: '900px' }}>
      {savedSuccess && (
        <div style={{
          position: 'fixed', top: '80px', right: '2rem', zIndex: 1000,
          backgroundColor: '#dcfce7', color: '#15803d', padding: '0.85rem 1.5rem',
          borderRadius: '10px', border: '1px solid #86efac', boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
        }}>
          <CheckCircle2 size={18} />
          <span>System Settings Saved Successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave}>
        <div className="sa-renewals-header" style={{ marginBottom: '1.75rem' }}>
          <div>
            <h1 className="sa-dash-title">System Settings</h1>
            <p className="sa-dash-subtitle">Configure platform branding, payment gateway & system security.</p>
          </div>

          <button 
            type="submit" 
            style={{
              backgroundColor: '#14b8a6', color: '#ffffff', border: 'none',
              padding: '0.6rem 1.25rem', borderRadius: '10px', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(20, 184, 166, 0.25)'
            }}
          >
            <Save size={18} /> Save All Changes
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* General Platform Settings */}
          <div className="sa-renewals-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.85rem' }}>
              <Globe color="#14b8a6" size={20} />
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>General Platform Settings</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>Platform Name</label>
                <input 
                  type="text" 
                  value={settings.platformName}
                  onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>Support Email</label>
                <input 
                  type="email" 
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                />
              </div>
            </div>
          </div>

          {/* Payment Gateway Settings */}
          <div className="sa-renewals-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.85rem' }}>
              <CreditCard color="#06b6d4" size={20} />
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Razorpay Integration Config</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>Razorpay Key ID</label>
                <input 
                  type="text" 
                  value={settings.razorpayKeyId}
                  onChange={(e) => setSettings({ ...settings, razorpayKeyId: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'monospace' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>Razorpay Key Secret</label>
                <input 
                  type="password" 
                  value={settings.razorpaySecret}
                  onChange={(e) => setSettings({ ...settings, razorpaySecret: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                />
              </div>
            </div>
          </div>

          {/* Security & Access Settings */}
          <div className="sa-renewals-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.85rem' }}>
              <Shield color="#f59e0b" size={20} />
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Security & Platform Maintenance</h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>Maintenance Mode</div>
                <div style={{ color: '#64748b', fontSize: '0.825rem' }}>Temporarily disable clinic admin access for scheduled updates.</div>
              </div>
              <input 
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                style={{ width: '20px', height: '20px', accentColor: '#14b8a6', cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* SMTP Email Provider Settings */}
          <div className="sa-renewals-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.85rem' }}>
              <Mail color="#8b5cf6" size={20} />
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>System SMTP Notifications</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>SMTP Host</label>
                <input 
                  type="text" 
                  value={settings.smtpHost}
                  onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>SMTP Port</label>
                <input 
                  type="text" 
                  value={settings.smtpPort}
                  onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
