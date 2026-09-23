import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
import { apiFetch } from '../utils/api';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Password rules validation
  const hasMinLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecial = /[@$!%*?&]/.test(newPassword);
  const isMatch = newPassword && newPassword === confirmPassword;
  const isStrong = hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Invalid or missing password reset token. Please request a new link.');
      return;
    }
    if (!isStrong) {
      setError('Please meet all password security requirements.');
      return;
    }
    if (!isMatch) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await apiFetch('/api/v1/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword, confirmPassword })
      });
      const data = await res.json();

      if (data.status === 'success') {
        setSuccess(true);
      } else {
        setError(data.message || 'Failed to reset password.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        background: '#111827',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '20px',
        padding: '2.5rem',
        maxWidth: '480px',
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto',
            color: '#ffffff',
            boxShadow: '0 8px 20px rgba(20, 184, 166, 0.4)'
          }}>
            <KeyRound size={28} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.4rem 0' }}>
            Set New Password
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
            {email ? `For account: ${email}` : 'Enter your new secure password below'}
          </p>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto',
              color: '#10b981'
            }}>
              <CheckCircle size={32} />
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>
              Password Reset Complete!
            </h3>

            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.5', marginBottom: '1.75rem' }}>
              Your password has been updated securely. All previous active sessions have been terminated for safety.
            </p>

            <button
              onClick={() => navigate('/login')}
              style={{
                width: '100%',
                padding: '0.85rem',
                background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              Sign In to Your Dashboard <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fca5a5',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}>
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {/* New Password */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                New Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '0.8rem 2.5rem 0.8rem 2.5rem',
                    background: 'rgba(30, 41, 59, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '0.92rem',
                    outline: 'none'
                  }}
                />
                <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                Confirm New Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '0.8rem 0.85rem 0.8rem 2.5rem',
                    background: 'rgba(30, 41, 59, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '0.92rem',
                    outline: 'none'
                  }}
                />
                <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              </div>
            </div>

            {/* Security Requirements Matrix */}
            <div style={{
              background: 'rgba(30, 41, 59, 0.5)',
              borderRadius: '10px',
              padding: '0.85rem 1rem',
              marginBottom: '1.5rem',
              fontSize: '0.75rem',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.4rem'
            }}>
              <span style={{ color: hasMinLength ? '#10b981' : '#94a3b8' }}>{hasMinLength ? '✓' : '○'} Min 8 Characters</span>
              <span style={{ color: hasUpper ? '#10b981' : '#94a3b8' }}>{hasUpper ? '✓' : '○'} 1 Uppercase (A-Z)</span>
              <span style={{ color: hasLower ? '#10b981' : '#94a3b8' }}>{hasLower ? '✓' : '○'} 1 Lowercase (a-z)</span>
              <span style={{ color: hasNumber ? '#10b981' : '#94a3b8' }}>{hasNumber ? '✓' : '○'} 1 Number (0-9)</span>
              <span style={{ color: hasSpecial ? '#10b981' : '#94a3b8' }}>{hasSpecial ? '✓' : '○'} 1 Symbol (@$!%*?&)</span>
              <span style={{ color: isMatch ? '#10b981' : '#94a3b8' }}>{isMatch ? '✓' : '○'} Passwords Match</span>
            </div>

            <button
              type="submit"
              disabled={loading || !isStrong || !isMatch}
              style={{
                width: '100%',
                padding: '0.85rem',
                background: isStrong && isMatch ? 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)' : 'rgba(51, 65, 85, 0.7)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: isStrong && isMatch && !loading ? 'pointer' : 'not-allowed',
                boxShadow: isStrong && isMatch ? '0 4px 14px rgba(20, 184, 166, 0.35)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              {loading ? 'Resetting Password...' : 'Save New Password & Continue'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
