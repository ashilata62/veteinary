import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pathForTab } from '../utils/routes';
import { apiFetch } from '../utils/api';
import './Login.css';
import { 
  Mail, Lock, ArrowRight, ShieldCheck, Stethoscope, Users, 
  HeartHandshake, Briefcase, Eye, EyeOff, CalendarCheck, 
  FileText, CreditCard, Box, PieChart, Shield, CheckCircle, ArrowLeft
} from 'lucide-react';

export default function Login({ setIsAuthenticated, setCurrentRole, setIsSuperAdmin, onLoginSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@vetcarepro.com');
  const [password, setPassword] = useState('password123');
  const [activeRole, setActiveRole] = useState('Admin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [transitionOut, setTransitionOut] = useState(false);
  const [success, setSuccess] = useState(false);

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
    setLoading(true);

    if (email && password) {
      try {
        // Super Admin uses a different API endpoint
        const isSuperAdmin = activeRole === 'Super Admin';
        const endpoint = isSuperAdmin ? '/api/super-admin/login' : '/api/auth/login';

        const response = await apiFetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await response.json();

        if (data.status === 'success') {
          if (isSuperAdmin) {
            const { token, user } = data.data;
            localStorage.setItem('sa_token', token);
            localStorage.setItem('sa_user', JSON.stringify(user));
            setSuccess(true);
            setLoading(false);
            setTransitionOut(true);
            setTimeout(() => {
              if (setIsSuperAdmin) setIsSuperAdmin(true);
              navigate('/super-admin/dashboard', { replace: true });
            }, 800);
          } else {
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
            }, 1000);
          }
        } else {
          setError(data.message || 'Login failed. Please check your credentials.');
          setLoading(false);
        }
      } catch (err) {
        console.error('Login Error:', err);
        setError('Unable to connect to server. Ensure backend is running.');
        setLoading(false);
      }
    }
  };

  const demoUsers = [
    { role: 'Admin',        email: 'admin@vetcarepro.com',       icon: Shield },
    { role: 'Manager',      email: 'manager@vetcarepro.com',     icon: Briefcase },
    { role: 'Doctor',       email: 'demodoctor@gmail.com',       icon: Stethoscope },
    { role: 'Receptionist', email: 'demoR@gmail.com',            icon: Users },
    { role: 'Vet Assistant',email: 'assistant@vetcarepro.com',   icon: HeartHandshake },
    { role: 'Super Admin',  email: 'superadmin@vetcarepro.com',  icon: ShieldCheck },
  ];

  const selectDemoUser = (role, demoEmail) => {
    setActiveRole(role);
    setEmail(demoEmail);
    setPassword('password123');
    setError('');
  };

  const activeIndex = Math.max(0, demoUsers.findIndex(u => u.role === activeRole));
  const colIndex = activeIndex % 3;
  const rowIndex = Math.floor(activeIndex / 3);

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
              VetCare <span className="text-gradient">Pro</span>
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
                VetCare <span className="text-gradient">Pro</span>
              </span>
            </div>

            <div className="login-header-text">
              <h2>👋 Welcome Back<span className="cursor-blink"></span></h2>
              <p>Sign in to your VetCare Pro Dashboard.</p>
              
              {error && (
                <div style={{ marginTop: '1rem', padding: '0.8rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', color: '#fca5a5', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={16} /> {error}
                </div>
              )}
            </div>

            <div className="role-chips">
              <div 
                className="active-tab-indicator"
                style={{
                  '--active-left': `calc(0.35rem + ${colIndex} * (100% - 0.7rem) / 3)`,
                  '--active-top': `calc(0.35rem + ${rowIndex} * (100% - 0.7rem) / 2)`
                }}
              />
              {demoUsers.map(({ role, email: dEmail, icon: Icon }) => {
                const isActive = activeRole === role;
                const label = role === 'Receptionist' ? 'Reception' : role === 'Vet Assistant' ? 'Assistant' : role;
                return (
                  <button 
                    key={role}
                    type="button"
                    className={`role-chip ${isActive ? 'active' : ''}`}
                    onClick={() => selectDemoUser(role, dEmail)}
                  >
                    <Icon size={14} />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleLogin}>
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
            </form>

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
