import React from 'react';
import { WifiOff } from 'lucide-react';

export default function OfflineNotice({ isOnline }) {
  if (isOnline) return null;

  return (
    <div className="offline-banner animate-fade-up">
      <WifiOff size={16} />
      <span>You are currently in Offline Mode. Cached records remain accessible.</span>
    </div>
  );
}
