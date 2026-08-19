import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, ArrowLeft, Eye, EyeOff, Key } from 'lucide-react';
import { apiFetch } from '../../utils/api';
import './SuperAdminLogin.css';

export default function SuperAdminLogin({ setIsSuperAdmin }) {
  const [email, setEmail] = useState('superadmin@vetcarepro.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
        
        // Brief delay for visual transition
        setTimeout(() => {
          setIsSuperAdmin(true);
          navigate('/super-admin/dashboard', { replace: true });
        }, 500);
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
    <div className="sa-login-page">
      <div className="sa-login-container">
        
        {/* Left Branding Side */}
        <div className="sa-login-left">
          <div className="sa-brand">
            <img src="/kt-logo.png" alt="Logo" />
            <span>PetCare <span style={{ color: '#2dd4bf' }}>Pro</span></span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2dd4bf', fontWeight: 600, fontSize: '0.85rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            <Key size={14} /> Global Administration
          </div>

          <h1 className="sa-left-title">
            Platform<br />Command Center
          </h1>
          
          <p className="sa-left-desc">
            Secure, global access to manage clinics, subscriptions, and system-wide configurations. Authorized personnel only.
          </p>
        </div>

        {/* Right Form Side */}
        <div className="sa-login-right">
          <button
            type="button"
            className="sa-back-btn"
            onClick={() => navigate('/login')}
          >
            <ArrowLeft size={16} /> Return to Clinic Login
          </button>

          <div className="sa-form-header">
            <h2>System Authentication</h2>
            <p>Enter your super admin credentials.</p>
          </div>

          {error && (
            <div className="sa-error">
              <Shield size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="sa-input-group">
              <input
                type="email"
                required
                placeholder="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="sa-input"
              />
            </div>

            <div className="sa-input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Passphrase"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="sa-input"
              />
              
              <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)' }}>
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="sa-submit-btn"
              disabled={loading}
            >
              <span>{loading ? 'Authenticating...' : 'Secure Login'}</span>
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
