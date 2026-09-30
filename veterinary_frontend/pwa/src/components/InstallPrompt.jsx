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
      onInstallSuccess();
    }
    onClose();
  };

  return (
    <div className="install-prompt-overlay" onClick={onClose}>
      <div className="install-prompt-card animate-fade-up" onClick={(e) => e.stopPropagation()}>
        <button className="install-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="install-header">
          <div className="install-app-icon">
            <Smartphone size={28} />
          </div>
          <div>
            <h3>Install PetCare Pro</h3>
            <p>Get full offline access & instant mobile alerts</p>
          </div>
        </div>

        <div className="install-features">
          <div className="install-feat-item">
            <CheckCircle size={16} className="text-teal" />
            <span>Works 100% Offline with Local Sync</span>
          </div>
          <div className="install-feat-item">
            <CheckCircle size={16} className="text-teal" />
            <span>Fast Native Performance (Zero App Store needed)</span>
          </div>
          <div className="install-feat-item">
            <CheckCircle size={16} className="text-teal" />
            <span>Instant push notifications for visits & tasks</span>
          </div>
        </div>

        {isIOS ? (
          <div className="ios-instructions">
            <p>To install on iPhone/iPad:</p>
            <div className="ios-step">
              1. Tap the <strong>Share</strong> button <Share size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> in Safari.
            </div>
            <div className="ios-step">
              2. Scroll down & select <strong>"Add to Home Screen"</strong>.
            </div>
          </div>
        ) : (
          <button className="pwa-install-action-btn" onClick={handleInstallClick}>
            <Download size={18} />
            <span>Install App on Device</span>
          </button>
        )}
      </div>
    </div>
  );
}
