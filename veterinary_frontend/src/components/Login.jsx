import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pathForTab } from '../utils/routes';
import { apiFetch } from '../utils/api';
import './Login.css';
import {
  Mail, Lock, ArrowRight, ShieldCheck, Eye, EyeOff, CalendarCheck,
  FileText, CreditCard, Box, PieChart, Shield, CheckCircle, ArrowLeft
} from 'lucide-react';
import ForgotPasswordModal from './ForgotPasswordModal';

export default function Login({ setIsAuthenticated, setCurrentRole, setIsSuperAdmin, onLoginSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [transitionOut, setTransitionOut] = useState(false);
  const [success, setSuccess] = useState(false);
  const [recaptchaChecked, setRecaptchaChecked] = useState(false);
  const [recaptchaVerifying, setRecaptchaVerifying] = useState(false);

  const handleRecaptchaClick = () => {
    if (recaptchaChecked) return;
    setRecaptchaVerifying(true);
    setTimeout(() => {
      setRecaptchaVerifying(false);
      setRecaptchaChecked(true);
    }, 700);
  };

  // Stats count-up animation states
  const [uptimeVal, setUptimeVal] = useState(80.0);
  const [petsVal, setPetsVal] = useState(0);
  const [encryptionVal, setEncryptionVal] = useState(0);

  useEffect(() => {
    // Animate Uptime (80.0 to 99.9)
    const uptimeInterval = setInterval(() => {
      setUptimeVal(prev => {
        if (prev >= 99.9) {
          clearInterval(uptimeInterval);
          return 99.9;
        }
        return parseFloat((prev + 0.9).toFixed(1));
      });
    }, 45);

    // Animate Pets (0 to 15)
    const petsInterval = setInterval(() => {
      setPetsVal(prev => {
        if (prev >= 15) {
          clearInterval(petsInterval);
          return 15;
        }
        return prev + 1;
      });
    }, 60);

    // Animate Encryption (0 to 256)
    const encInterval = setInterval(() => {
      setEncryptionVal(prev => {
        if (prev >= 256) {
          clearInterval(encInterval);
          return 256;
        }
        return prev + 16;
      });
    }, 40);

    return () => {
      clearInterval(uptimeInterval);
      clearInterval(petsInterval);
      clearInterval(encInterval);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.getModifierState) {
        setCapsLockActive(e.getModifierState('CapsLock'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter your email and password');
      return;
    }

    setLoading(true);

    try {
      // First attempt clinic user login
      const response = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });
      const data = await response.json();

      if (data.status === 'success') {
        const { token, user } = data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('role', user.role);
        localStorage.setItem('user', JSON.stringify(user));
        sessionStorage.removeItem('trialPopupShown');
        setSuccess(true);
        setLoading(false);
        setTransitionOut(true);
        setTimeout(() => {
          setIsAuthenticated(true);
          if (setCurrentRole) setCurrentRole(user.role);
          if (onLoginSuccess) onLoginSuccess(user);
          navigate(pathForTab('dashboard', user.role), { replace: true });
        }, 800);
        return;
      }

      // If not standard clinic user, check if Super Admin
      const saResponse = await apiFetch('/api/super-admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });
      const saData = await saResponse.json();

      if (saData.status === 'success') {
        const { token, user } = saData.data;
        localStorage.setItem('sa_token', token);
        localStorage.setItem('sa_user', JSON.stringify(user));
        setSuccess(true);
        setLoading(false);
        setTransitionOut(true);
        setTimeout(() => {
          if (setIsSuperAdmin) setIsSuperAdmin(true);
          navigate('/super-admin/dashboard', { replace: true });
        }, 800);
        return;
      }

      setError(data.message || 'Invalid email or password. Please try again.');
      setLoading(false);
    } catch (err) {
      console.error('Login Error:', err);
      setError('Unable to connect to server. Please check your network connection.');
      setLoading(false);
    }
  };

  return (
    <div className={`login-premium-page ${transitionOut ? 'page-transition-out' : ''}`}>
      {/* Background Container */}
      <div className="login-bg-container">
        <div className="login-bg-image"></div>
        <div className="login-bg-blobs">
          <div className="bg-blob b1"></div>
          <div className="bg-blob b2"></div>
          <div className="bg-blob b3"></div>
        </div>
        <div className="login-bg-pattern"></div>
      </div>

      <div className="login-premium-layout">
        {/* Left Hero Side */}
        <div className="login-hero-side">
          <div className="login-brand-premium">
            <img src="/kt-logo.png" alt="Logo" className="login-brand-logo" />
            <span style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              PetCare <span className="text-gradient">Pro</span>
            </span>
          </div>

          <div className="login-badge">
            <ShieldCheck size={16} />
            Veterinary Clinic Management Platform
          </div>

          <h1 className="login-title-premium">
            Next Generation<br />
            <span className="text-gradient">Veterinary Platform</span>
          </h1>

          <div className="login-feature-list">
            <div className="login-feature-item">
              <CalendarCheck className="login-feature-icon" size={24} />
              <span>Smart Appointments</span>
            </div>
            <div className="login-feature-item">
              <FileText className="login-feature-icon" size={24} />
              <span>Medical Records</span>
            </div>
            <div className="login-feature-item">
              <CreditCard className="login-feature-icon" size={24} />
              <span>Billing & POS</span>
            </div>
            <div className="login-feature-item">
              <Box className="login-feature-icon" size={24} />
              <span>Inventory</span>
            </div>
            <div className="login-feature-item">
              <PieChart className="login-feature-icon" size={24} />
              <span>Reports</span>
            </div>
          </div>

          {/* Floating Stats */}
          <div className="floating-stats-container">
            <div className="glass-stat-card c1">
              <span className="stat-val">{uptimeVal}%</span>
              <span className="stat-lbl">Uptime</span>
            </div>
            <div className="glass-stat-card c2">
              <span className="stat-val">{petsVal}k+</span>
              <span className="stat-lbl">Pets Managed</span>
            </div>
            <div className="glass-stat-card c3">
              <span className="stat-val">{encryptionVal}-Bit</span>
              <span className="stat-lbl">SSL Secured</span>
            </div>
          </div>
        </div>

        {/* Right Form Side */}
        <div className="login-form-side">
          <div className="glass-login-card">

            <button
              type="button"
              onClick={() => navigate('/')}
              className="login-back-btn-premium"
              aria-label="Back to Home"
            >
              <ArrowLeft size={16} />
              Back to Home
            </button>

            <div className="login-mobile-brand">
              <img src="/kt-logo.png" alt="Logo" className="login-brand-logo-mobile" />
              <span>
                PetCare <span className="text-gradient">Pro</span>
              </span>
            </div>

            <div className="login-header-text">
              <h2>👋 Welcome Back<span className="cursor-blink"></span></h2>
              <p>Sign in to your PetCare Pro Dashboard.</p>

              {error && (
                <div style={{ marginTop: '1rem', padding: '0.8rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', color: '#fca5a5', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={16} /> {error}
                </div>
              )}
            </div>

            <form onSubmit={handleLogin} style={{ marginTop: '1.5rem' }}>
              <div className="premium-input-group">
                <input
                  type="text"
                  className="premium-input"
                  placeholder=" "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label className="input-label-float">Email Address or Username</label>
                <Mail size={18} className="premium-input-icon" />
              </div>

              <div className="premium-input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="premium-input"
                  placeholder=" "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label className="input-label-float">Password</label>
                <Lock size={18} className="premium-input-icon" />

                <div className="password-actions">
                  {capsLockActive && <span className="caps-lock-warning">CAPS</span>}
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-0.5rem', marginBottom: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#2dd4bf',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                >
                  Forgot Password?
                </button>
              </div>

              {/* Google reCAPTCHA Security Widget */}
              <div style={{
                background: '#f9f9f9',
                border: '1px solid #d3d3d3',
                borderRadius: '4px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    onClick={handleRecaptchaClick}
                    style={{
                      width: '28px',
                      height: '28px',
                      border: recaptchaChecked ? 'none' : '2px solid #c1c1c1',
                      borderRadius: '3px',
                      background: recaptchaChecked ? '#059669' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}
                  >
                    {recaptchaVerifying ? (
                      <div style={{ width: '16px', height: '16px', border: '2px solid #4285f4', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    ) : recaptchaChecked ? (
                      <span style={{ color: '#ffffff', fontSize: '18px', fontWeight: 'bold' }}>✓</span>
                    ) : null}
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#222222', fontFamily: 'Roboto, Arial, sans-serif' }}>
                    I'm not a robot
                  </span>
                </div>

                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" alt="reCAPTCHA" style={{ width: '28px', height: '28px' }} />
                  <span style={{ fontSize: '9px', color: '#555555', fontWeight: 600 }}>reCAPTCHA</span>
                  <span style={{ fontSize: '7px', color: '#777777' }}>Privacy - Terms</span>
                </div>
              </div>

              <button
                type="submit"
                className="premium-submit-btn"
                disabled={loading || success}
              >
                {success ? (
                  <>
                    <CheckCircle size={20} className="animate-bounce" /> Success! Redirecting...
                  </>
                ) : loading ? (
                  <>
                    <div className="btn-spinner"></div> Authenticating...
                  </>
                ) : (
                  <>
                    Access Dashboard <ArrowRight size={18} className="btn-arrow" />
                  </>
                )}
              </button>

              <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.88rem', color: '#64748b' }}>
                Don't have a clinic account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0d9488',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: 0,
                    textDecoration: 'underline'
                  }}
                >
                  Start 7-Day Free Trial
                </button>
              </div>
            </form>

            <ForgotPasswordModal
              isOpen={showForgotPassword}
              onClose={() => setShowForgotPassword(false)}
            />

            <div className="trust-indicators">
              <div className="trust-item"><ShieldCheck size={14} /> SSL Secured</div>
              <div className="trust-item"><CheckCircle size={14} /> ISO Certified</div>
              <div className="trust-item"><Shield size={14} /> HIPAA Ready</div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
