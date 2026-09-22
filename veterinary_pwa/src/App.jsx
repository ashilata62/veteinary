import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import TopHeader from './components/TopHeader';
import BottomNav from './components/BottomNav';
import OfflineNotice from './components/OfflineNotice';
import InstallPrompt from './components/InstallPrompt';
import QuickActionModal from './components/QuickActionModal';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import Patients from './pages/Patients';
import Billing from './pages/Billing';
import Profile from './pages/Profile';
import './App.css';

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('pwa_user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem('pwa_token')));
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showQuickAction, setShowQuickAction] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // 1. Online / Offline Listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 2. Capture PWA beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('pwa_token');
    localStorage.removeItem('pwa_user');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login', { replace: true });
  };

  const isLoginPage = location.pathname === '/login';

  return (
    <div className="pwa-app-shell">
      {/* Offline Status Warning */}
      <OfflineNotice isOnline={isOnline} />

      {/* Top Header for mobile app */}
      {isAuthenticated && !isLoginPage && (
        <TopHeader 
          user={user} 
          isOnline={isOnline} 
          canInstall={Boolean(deferredPrompt)}
          onInstallClick={() => setShowInstallPrompt(true)}
        />
      )}

      {/* Main Content Viewport */}
      <main className="pwa-main-container">
        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Login onLoginSuccess={handleLoginSuccess} />
              )
            } 
          />

          <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
            <Route 
              path="/dashboard" 
              element={<Dashboard user={user} onOpenQuickAction={() => setShowQuickAction(true)} />} 
            />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/billing" element={<Billing />} />
            <Route 
              path="/profile" 
              element={
                <Profile 
                  user={user} 
                  onLogout={handleLogout} 
                  canInstall={Boolean(deferredPrompt)}
                  onInstallClick={() => setShowInstallPrompt(true)}
                />
              } 
            />
          </Route>

          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </main>

      {/* Fixed Bottom Tab Navigation */}
      {isAuthenticated && !isLoginPage && (
        <BottomNav onOpenQuickAction={() => setShowQuickAction(true)} />
      )}

      {/* Quick Action Bottom Sheet */}
      <QuickActionModal 
        isOpen={showQuickAction} 
        onClose={() => setShowQuickAction(false)} 
      />

      {/* One-tap PWA Install Banner */}
      {showInstallPrompt && (
        <InstallPrompt 
          deferredPrompt={deferredPrompt}
          onInstallSuccess={() => setDeferredPrompt(null)}
          onClose={() => setShowInstallPrompt(false)}
        />
      )}
    </div>
  );
}
