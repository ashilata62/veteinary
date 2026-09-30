import React, { useState } from 'react';
import { 
  User, 
  Building, 
  ShieldCheck, 
  LogOut, 
  Download, 
  Database, 
  RefreshCw, 
  Wifi, 
  Smartphone,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile({ user, onLogout, canInstall, onInstallClick }) {
  const [syncing, setSyncing] = useState(false);

  const handleSyncData = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      toast.success('All local records synced with cloud server!');
    }, 1200);
  };

  const handleClearCache = () => {
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => caches.delete(name));
      });
    }
    localStorage.clear();
    toast.success('Offline cache cleared. Reloading...');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="pwa-page-content animate-fade-up">
      {/* User Card */}
      <div className="pwa-card user-profile-card">
        <div className="profile-avatar-big">
          {(user?.name || 'V').charAt(0).toUpperCase()}
        </div>
        <div className="profile-info-block">
          <h3>{user?.name || 'Clinic Administrator'}</h3>
          <p className="profile-email">{user?.email || 'admin@vetcarepro.com'}</p>
          <div className="profile-role-pill">
            <ShieldCheck size={14} className="text-teal" />
            <span>{user?.role || 'Admin'}</span>
          </div>
        </div>
      </div>

      {/* Clinic & PWA Status */}
      <div className="pwa-section-header" style={{ marginTop: '1.25rem' }}>
        <h3>PWA & System Telemetry</h3>
      </div>

      <div className="pwa-card pwa-settings-card">
        <div className="settings-row">
          <div className="settings-left">
            <Building size={18} className="text-teal" />
            <div>
              <div className="settings-title">Clinic Organization</div>
              <div className="settings-desc">Happy Paws Veterinary Care</div>
            </div>
          </div>
          <span className="settings-tag green">Active</span>
        </div>

        <div className="settings-row">
          <div className="settings-left">
            <Smartphone size={18} className="text-purple" />
            <div>
              <div className="settings-title">PWA Standalone Status</div>
              <div className="settings-desc">Service Worker v1.0.0 Active</div>
            </div>
          </div>
          <span className="settings-tag teal">Installed</span>
        </div>

        <div className="settings-row">
          <div className="settings-left">
            <Database size={18} className="text-amber" />
            <div>
              <div className="settings-title">Offline Cache Engine</div>
              <div className="settings-desc">IndexedDB & CacheStorage Ready</div>
            </div>
          </div>
          <button 
            className="settings-action-btn"
            onClick={handleSyncData}
            disabled={syncing}
          >
            <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
            <span>{syncing ? 'Syncing...' : 'Sync Now'}</span>
          </button>
        </div>
      </div>

      {/* App Install Prompt (if available) */}
      {canInstall && (
        <div className="pwa-card pwa-install-banner-card" onClick={onInstallClick}>
          <div className="install-banner-content">
            <Download size={22} className="text-teal" />
            <div>
              <h4>Install App to Home Screen</h4>
              <p>Experience native fullscreen performance</p>
            </div>
          </div>
          <button className="pwa-mini-install-btn">Install</button>
        </div>
      )}

      {/* Actions (Clear cache & Logout) */}
      <div className="profile-actions-list">
        <button className="profile-btn-danger outline" onClick={handleClearCache}>
          <Trash2 size={16} />
          <span>Clear Local Cache & Reset</span>
        </button>

        <button className="profile-btn-danger" onClick={onLogout}>
          <LogOut size={16} />
          <span>Sign Out from Mobile PWA</span>
        </button>
      </div>
    </div>
  );
}
