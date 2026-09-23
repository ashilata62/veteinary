import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Shield, KeyRound, CheckCircle2, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { apiFetch } from '../utils/api';
import './Login.css';

export default function SetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [message, setMessage] = useState('');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      setIsValidating(false);
      return;
    }

    const validateToken = async () => {
      try {
        const res = await apiFetch(`/api/auth/reset-password/validate?token=${token}`);
        if (res.ok) {
          setIsValidToken(true);
        } else {
          const data = await res.json();
          setMessage(data.message || 'Invalid or expired token.');
        }
      } catch (err) {
        setMessage('Network error while validating token.');
      } finally {
        setIsValidating(false);
        setLoading(false);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage('');
        alert('Password has been successfully updated. You can now login.');
        navigate('/login');
      } else {
        setMessage(data.message || 'Failed to update password.');
      }
    } catch (err) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            <div className="animate-spin" style={{ width: 32, height: 32, border: '3px solid #e2e8f0', borderTopColor: '#14b8a6', borderRadius: '50%', margin: '0 auto 1rem' }} />
            Validating secure link...
          </div>
        </div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <AlertTriangle size={48} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '0.5rem' }}>Link Expired or Invalid</h2>
            <p style={{ color: '#475569', marginBottom: '2rem' }}>{message || 'The password reset link you clicked is invalid or has expired.'}</p>
            <button onClick={() => navigate('/login')} className="login-btn-primary">
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      {/* Dynamic particles background */}
      <div className="login-particles">
        {Array.from({ length: 15 }).map((_, i) => (
          <span key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 10}s`
          }}></span>
        ))}
      </div>

      <div className="login-container" style={{ position: 'relative', zIndex: 10, maxWidth: '440px' }}>
        <div className="login-header text-center">
          <div className="login-logo-wrap mx-auto">
            <Shield className="login-logo-icon" size={32} />
          </div>
          <h2 className="login-title">Set New Password</h2>
          <p className="login-subtitle">Please enter your new password below.</p>
        </div>

        {message && (
          <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} /> {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label className="input-label">New Password</label>
            <div className="input-wrapper">
              <KeyRound className="input-icon" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="login-input"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="input-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Confirm Password</label>
            <div className="input-wrapper">
              <CheckCircle2 className="input-icon" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="login-input"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className={`login-btn-primary ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <span className="btn-spinner"></span>
            ) : (
              'Save Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
