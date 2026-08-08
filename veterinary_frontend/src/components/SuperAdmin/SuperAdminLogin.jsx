import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, ShieldCheck, HeartHandshake, Eye, EyeOff } from 'lucide-react';
import { apiFetch } from '../../utils/api';
import '../Login.css';

export default function SuperAdminLogin({ setIsSuperAdmin }) {
  const [email, setEmail] = useState('superadmin@vetcarepro.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [transitionOut, setTransitionOut] = useState(false);
  const [particles, setParticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Generate animated background particles
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiFetch('/api/super-admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (data.status === 'success') {
        const { token, user } = data.data;
        localStorage.setItem('sa_token', token);
        localStorage.setItem('sa_user', JSON.stringify(user));
        
        setTransitionOut(true);
        // Wait for page exit transition
        setTimeout(() => {
          setIsSuperAdmin(true);
          navigate('/super-admin/dashboard');
        }, 800);
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Network error. Unable to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`login-premium-page ${transitionOut ? 'page-transition-out' : ''}`}>
      
      {/* Animated Background Wrapper */}
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
        
        {/* Left Hero side branding */}
        <div className="login-hero-side">
          <div className="login-brand-premium">
            <img src="/kt-logo.png" alt="Logo" className="login-brand-logo" />
            <span style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              VetCare <span className="text-gradient">Pro</span>
            </span>
          </div>

          <div className="login-badge">
            <Shield size={16} />
            Super Admin Portal
          </div>

          <h1 className="login-title-premium">
            Platform<br />
            <span className="text-gradient">Command Center</span>
          </h1>

          <div className="login-feature-list" style={{ marginTop: '1.5rem' }}>
            <div className="login-feature-item" style={{ animation: 'fadeUp 0.8s ease-out 0.6s forwards', opacity: 1 }}>
              <ShieldCheck className="login-feature-icon" size={24} style={{ color: '#2dd4bf' }} />
              <span>Global Clinic Provisioning</span>
            </div>
            <div className="login-feature-item" style={{ animation: 'fadeUp 0.8s ease-out 0.8s forwards', opacity: 1 }}>
              <ShieldCheck className="login-feature-icon" size={24} style={{ color: '#2dd4bf' }} />
              <span>Subscription & Billing Control</span>
            </div>
            <div className="login-feature-item" style={{ animation: 'fadeUp 0.8s ease-out 1.0s forwards', opacity: 1 }}>
              <ShieldCheck className="login-feature-icon" size={24} style={{ color: '#2dd4bf' }} />
              <span>Helpdesk Support Ticket Terminal</span>
            </div>
          </div>

          <div className="floating-stats-container">
            <div className="glass-stat-card c1">
              <span className="stat-val">Live</span>
              <span className="stat-lbl">Monitoring</span>
            </div>
            <div className="glass-stat-card c2">
              <span className="stat-val">256-bit</span>
              <span className="stat-lbl">SSL Encryption</span>
            </div>
          </div>
        </div>

        {/* Right Form side card */}
        <div className="login-form-side">
          <div className="glass-login-card">
            
            <button
              type="button"
              className="login-back-btn-premium"
              onClick={() => navigate('/login')}
              style={{ position: 'absolute', top: '1.8rem', right: '1.8rem', background: 'none', border: 'none', color: '#2dd4bf', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
            >
              &larr; Clinic Login
            </button>

            <div className="login-header-text">
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff' }}>
                Super Admin Access
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Sign in to the global administration panel.</p>
            </div>

            {error && (
              <div className="login-error-alert" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#f87171', padding: '0.75rem 1rem', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div className="premium-input-group">
                <input
                  type="email"
                  required
                  placeholder=" "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="premium-input"
                  id="sa-email"
                />
                <label htmlFor="sa-email" className="input-label-float">Super Admin Email</label>
                <Mail size={20} className="premium-input-icon" />
              </div>

              <div className="premium-input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder=" "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="premium-input"
                  id="sa-password"
                />
                <label htmlFor="sa-password" className="input-label-float">Password</label>
                <Lock size={20} className="premium-input-icon" />
                
                <div className="password-actions" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                    style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                className="premium-submit-btn"
                disabled={loading}
                style={{ cursor: 'pointer' }}
              >
                <span>{loading ? 'Authenticating...' : 'Access Command Center'}</span>
                {!loading && <ArrowRight size={20} className="btn-arrow" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
