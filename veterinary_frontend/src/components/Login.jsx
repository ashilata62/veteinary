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

export default function Login({ setIsAuthenticated, setCurrentRole }) {
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

  // Particles for the background
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    // Generate random particles
    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      size: Math.random() * 20 + 10,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
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
        const response = await apiFetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await response.json();

        if (data.status === 'success') {
          const { token, user } = data.data;
          
          localStorage.setItem('token', token);
          localStorage.setItem('role', user.role);
          localStorage.setItem('user', JSON.stringify(user));
          
          setSuccess(true);
          setLoading(false);
          setTransitionOut(true);

          // Wait for transition before navigating
          setTimeout(() => {
            setIsAuthenticated(true);
            if (setCurrentRole) setCurrentRole(user.role);
            navigate(pathForTab('dashboard', user.role), { replace: true });
          }, 1000);
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
    if (role === 'Super Admin') {
      navigate('/super-admin/login');
      return;
    }
    setActiveRole(role);
    setEmail(demoEmail);
    setPassword('password123');
    setError('');
  };

  return (
    <div className={`login-premium-page ${transitionOut ? 'page-transition-out' : ''}`}>
      {/* Background Container */}
      <div className="login-bg-container">
        <div className="login-bg-image"></div>
        <div className="login-overlay-grad"></div>
        <div className="login-particles">
          {particles.map(p => (
            <div 
              key={p.id} 
              className="particle"
              style={{
                width: p.size,
                height: p.size,
                left: `${p.left}%`,
                top: `${p.top}%`,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`
              }}
            >
              <HeartHandshake size={p.size} strokeWidth={1} />
            </div>
          ))}
        </div>
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

          <div className="floating-stats-container">
            <div className="glass-stat-card c1">
              <span className="stat-val">500+</span>
              <span className="stat-lbl">Happy Clinics</span>
            </div>
            <div className="glass-stat-card c2">
              <span className="stat-val">50K+</span>
              <span className="stat-lbl">Pets Treated</span>
            </div>
            <div className="glass-stat-card c3">
              <span className="stat-val">99.9%</span>
              <span className="stat-lbl">Uptime</span>
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
              {demoUsers.map(({ role, email: dEmail, icon: Icon }) => {
                const isActive = activeRole === role;
                const label = role === 'Receptionist' ? 'Reception' : role === 'Vet Assistant' ? 'Assistant' : role;
                return (
                  <div 
                    key={role}
                    className={`role-chip ${isActive ? 'active' : ''}`}
                    onClick={() => selectDemoUser(role, dEmail)}
                  >
                    <Icon size={14} />
                    {label}
                  </div>
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
                    <CheckCircle size={20} /> Success! Redirecting...
                  </>
                ) : loading ? (
                  'Authenticating...'
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
