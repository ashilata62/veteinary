import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Lock, Mail, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('admin@vetcarepro.com');
  const [password, setPassword] = useState('Password@123');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', { email, password });
      if (res.data?.status === 'success') {
        const { token, user } = res.data.data;
        localStorage.setItem('pwa_token', token);
        localStorage.setItem('pwa_user', JSON.stringify(user));
        toast.success(`Welcome back, ${user.name}!`);
        if (onLoginSuccess) onLoginSuccess(user);
        navigate('/dashboard');
      } else {
        toast.error(res.data?.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error(err.response?.data?.message || 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('Password@123');
  };

  return (
    <div className="pwa-login-container animate-fade-up">
      {/* Brand Header */}
      <div className="login-brand-header">
        <div className="pwa-logo-bubble">
          <Stethoscope size={36} className="text-teal" />
        </div>
        <h2>PetCare Pro PWA</h2>
        <p>Mobile Veterinary Clinic Companion</p>
      </div>

      {/* Login Card */}
      <div className="pwa-card login-card">
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-field">
            <label>Email Address</label>
            <div className="input-wrap">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                required
                placeholder="doctor@clinic.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="input-field">
            <label>Password</label>
            <div className="input-wrap">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="pwa-submit-btn" 
            disabled={loading}
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Mobile Clinic'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Quick Demo Switcher */}
        <div className="quick-demo-section">
          <p className="quick-demo-title">Quick Demo Login</p>
          <div className="quick-demo-pills">
            <button 
              type="button" 
              className={`demo-pill ${email === 'admin@vetcarepro.com' ? 'active' : ''}`}
              onClick={() => handleQuickDemo('admin@vetcarepro.com')}
            >
              Admin
            </button>
            <button 
              type="button" 
              className={`demo-pill ${email === 'demodoctor@gmail.com' ? 'active' : ''}`}
              onClick={() => handleQuickDemo('demodoctor@gmail.com')}
            >
              Doctor
            </button>
            <button 
              type="button" 
              className={`demo-pill ${email === 'manager@vetcarepro.com' ? 'active' : ''}`}
              onClick={() => handleQuickDemo('manager@vetcarepro.com')}
            >
              Manager
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
