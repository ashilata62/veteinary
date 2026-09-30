import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import './i18n'
import { ErrorBoundary } from './components/ErrorBoundary'
import { CurrencyProvider } from './context/CurrencyContext'
import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'

// Initialize native mobile status bar if running inside native APK
if (Capacitor.isNativePlatform()) {
  document.documentElement.classList.add('is-capacitor-native');
  if (Capacitor.getPlatform() === 'android') {
    document.documentElement.classList.add('is-capacitor-android');
  }
  try {
    StatusBar.setOverlaysWebView({ overlay: false }).catch(() => {});
    StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
    StatusBar.setBackgroundColor({ color: '#0f0f0f' }).catch(() => {});
  } catch (err) {
    console.warn('StatusBar init exception:', err);
  }
}

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('[PWA] Service Worker registered:', reg.scope);
      })
      .catch((err) => {
        console.warn('[PWA] Service Worker failed:', err);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <CurrencyProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CurrencyProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
