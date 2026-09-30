import React from 'react';
import { WifiOff } from 'lucide-react';

export default function OfflineNotice({ isOnline }) {
  if (isOnline) return null;

  return (
    <div style={{
      backgroundColor: '#e11d48',
      color: '#ffffff',
      fontSize: '0.8rem',
      fontWeight: 600,
      padding: '0.5rem 1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      textAlign: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 9999,
      boxShadow: '0 2px 8px rgba(225, 29, 72, 0.3)'
    }}>
      <WifiOff size={16} />
      <span>You are currently offline. Cached records remain accessible. Changes will sync when reconnected.</span>
    </div>
  );
}
