import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserX, ArrowLeft, AlertTriangle, ShieldCheck, Mail, CheckCircle2, Loader2 } from 'lucide-react';
import { apiFetch } from '../utils/api';

export default function DeleteAccount() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your registered email address.');
      return;
    }
    setErrorMsg('');
    setSubmitting(true);

    try {
      const res = await apiFetch('/api/v1/users/request-deletion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, clinicName, reason })
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setErrorMsg(data.message || 'Failed to submit deletion request.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error. Please try again or email support@kiaantechnology.com.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      color: '#1e293b',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      padding: '2rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{
        maxWidth: '750px',
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.05)',
        border: '1px solid #e2e8f0',
        padding: '2.5rem 2rem',
        boxSizing: 'border-box'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 44, height: 44, borderRadius: '12px', background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <UserX size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Request Account Deletion</h1>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '2px 0 0 0' }}>PetCare Pro — Google Play Compliance</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              backgroundColor: '#f1f5f9',
              color: '#334155',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} /> Home
          </button>
        </div>

        {/* Explanation */}
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.75rem', color: '#991b1b', fontSize: '0.9rem', lineHeight: '1.6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, marginBottom: '6px' }}>
            <AlertTriangle size={18} /> Important Information Regarding Account Deletion
          </div>
          <ul style={{ margin: '0', paddingLeft: '1.25rem' }}>
            <li>Deleting your account permanently removes your login profile, staff credentials, and personal details.</li>
            <li>In-app deletion is available instantly under <strong>Settings &rarr; Profile &rarr; Delete Account</strong>.</li>
            <li>If you no longer have access to the app, you may submit this form to request complete data deletion.</li>
            <li>Financial invoice history may be anonymized and archived as required by commercial tax and auditing laws.</li>
          </ul>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
              <CheckCircle2 size={36} />
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#065f46', marginBottom: '0.5rem' }}>
              Deletion Request Received
            </h2>
            <p style={{ color: '#475569', fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto 1.5rem auto', lineHeight: '1.6' }}>
              We have recorded your deletion request for <strong>{email}</strong>. Our data compliance team will verify and permanently purge your account records within 30 days in accordance with Google Play data safety policies.
            </p>
            <button
              onClick={() => navigate('/')}
              style={{
                backgroundColor: '#0f766e',
                color: '#fff',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Return to Homepage
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {errorMsg && (
              <div style={{ padding: '0.75rem 1rem', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '8px', fontSize: '0.875rem' }}>
                {errorMsg}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                Registered Account Email <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@exampleclinic.com"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                Clinic Name (Optional)
              </label>
              <input
                type="text"
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                placeholder="City Vet Clinic"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                Reason for Leaving (Optional)
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Let us know why you wish to delete your account..."
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                backgroundColor: '#dc2626',
                color: '#ffffff',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: submitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '0.5rem',
                transition: 'background-color 0.2s'
              }}
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Submitting Request...
                </>
              ) : (
                'Submit Account Deletion Request'
              )}
            </button>
          </form>
        )}

        {/* Footer Support */}
        <div style={{ marginTop: '2.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', fontSize: '0.85rem', color: '#64748b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            Support: <a href="mailto:contact@kiaantechnology.com" style={{ color: '#0f766e', fontWeight: 600, textDecoration: 'none' }}>contact@kiaantechnology.com</a>
          </div>
          <div>
            &copy; {new Date().getFullYear()} Kiaan Technology. All Rights Reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
