import React from 'react';
import { Bell, Download, ShieldCheck, Wifi, WifiOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TopHeader({ user, isOnline, canInstall, onInstallClick }) {
  const navigate = useNavigate();

  return (
    <header className="pwa-top-header">
      <div className="header-left">
        <div className="clinic-badge-avatar" onClick={() => navigate('/profile')}>
          {(user?.name || 'V').charAt(0).toUpperCase()}
        </div>
        <div className="header-clinic-info">
          <div className="header-clinic-name">
            <span>PetCare Pro</span>
            <span className="pwa-badge">PWA</span>
          </div>
          <div className="header-user-role">
            {user?.name || 'Doctor'} &bull; {user?.role || 'Staff'}
          </div>
        </div>
      </div>

      <div className="header-right">
        {/* Network status icon */}
        <div className={`status-indicator ${isOnline ? 'online' : 'offline'}`} title={isOnline ? 'Connected' : 'Offline Mode'}>
          {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
        </div>

        {/* Install Button if browser supports it */}
        {canInstall && (
          <button className="header-install-btn" onClick={onInstallClick} title="Install App">
            <Download size={15} />
            <span>Install</span>
          </button>
        )}
      </div>
    </header>
  );
}
