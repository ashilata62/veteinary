import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, FileText, CheckCircle, Mail, Phone, MapPin } from 'lucide-react';

export default function TermsConditions() {
  const navigate = useNavigate();

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
        maxWidth: '900px',
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 10px 40px -10px rgba(15, 23, 42, 0.08)',
        border: '1px solid #e2e8f0',
        padding: '2.5rem 2rem',
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginBottom: '2rem', 
          borderBottom: '1px solid #e2e8f0', 
          paddingBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ 
              width: 48, 
              height: 48, 
              borderRadius: '14px', 
              background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: '#fff',
              boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)'
            }}>
              <FileText size={28} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Terms & Conditions</h1>
              <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '3px 0 0 0' }}>
                PetCare Pro — Veterinary Clinic Management Platform by Kiaan Technology
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 18px',
              backgroundColor: '#f1f5f9',
              color: '#334155',
              border: '1px solid #cbd5e1',
              borderRadius: '10px',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        <div style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '2rem' }}>
          Last Updated & Effective: <strong>September 29, 2026</strong>
        </div>

        {/* Content */}
        <div style={{ lineHeight: '1.75', fontSize: '0.95rem', color: '#334155' }}>
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0d9488', marginBottom: '0.75rem' }}>
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using <strong>PetCare Pro</strong> (available on Web and Mobile PWA), operated by <strong>Kiaan Technology</strong> ("we," "us," or "our"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use the service.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0d9488', marginBottom: '0.75rem' }}>
              2. Description of Service
            </h2>
            <p>
              PetCare Pro provides cloud-based software-as-a-service (SaaS) and progressive web application solutions for veterinary clinics, animal hospitals, veterinarians, and clinical staff to manage pet medical records, appointments, inventory, pharmacy billing, patient queue, and administrative workflows.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0d9488', marginBottom: '0.75rem' }}>
              3. User Accounts and Clinic Security
            </h2>
            <p>
              Clinic administrators and authorized staff are responsible for maintaining the confidentiality of their credentials and all activities occurring under their accounts. You agree to notify us immediately of any unauthorized use or security breaches.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0d9488', marginBottom: '0.75rem' }}>
              4. Subscription & Payment Terms
            </h2>
            <p>
              Access to premium features is provided on a subscription basis. Subscriptions are billed in advance on a recurring monthly or annual schedule as selected. Payment processing is facilitated through PCI-compliant gateways.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0d9488', marginBottom: '0.75rem' }}>
              5. Intellectual Property & License
            </h2>
            <p>
              All software, source code, designs, trademarks, and documentation associated with PetCare Pro remain the exclusive property of Kiaan Technology. Users are granted a revocable, non-exclusive, non-transferable license to access the platform.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0d9488', marginBottom: '0.75rem' }}>
              6. Limitation of Liability
            </h2>
            <p>
              PetCare Pro is a practice management tool and does not provide veterinary medical advice. Clinical diagnoses and medical decisions remain solely the responsibility of licensed veterinarians.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0d9488', marginBottom: '0.75rem' }}>
              7. Contact Information
            </h2>
            <div style={{ backgroundColor: '#f1f5f9', padding: '1.25rem', borderRadius: '12px', fontSize: '0.9rem', color: '#0f172a', border: '1px solid #e2e8f0', lineHeight: '1.7' }}>
              <strong>Kiaan Technology</strong><br />
              <strong>General Inquiries:</strong> <a href="mailto:info@kiaantechnology.com" style={{ color: '#0d9488', fontWeight: 600 }}>info@kiaantechnology.com</a><br />
              <strong>Customer Support:</strong> <a href="mailto:support@kiaantechnology.com" style={{ color: '#0d9488', fontWeight: 600 }}>support@kiaantechnology.com</a><br />
              <strong>Address:</strong> 2341, Sector E, Sudama Nagar, Indore, Madhya Pradesh 452009<br />
              <strong>Phone:</strong> +91 97521 00980<br />
              <strong>Website:</strong> <a href="https://kiaantechnology.com" target="_blank" rel="noopener noreferrer" style={{ color: '#0d9488', fontWeight: 600 }}>https://kiaantechnology.com</a>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div style={{ 
          marginTop: '2.5rem', 
          borderTop: '1px solid #e2e8f0', 
          paddingTop: '1.5rem', 
          textAlign: 'center', 
          fontSize: '0.85rem', 
          color: '#94a3b8',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>&copy; {new Date().getFullYear()} PetCare Pro by Kiaan Technology. All Rights Reserved.</span>
          <span>&bull;</span>
          <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} style={{ color: '#0d9488', textDecoration: 'none', fontWeight: 600 }}>Home</a>
          <span>&bull;</span>
          <a href="/privacy-policy" onClick={(e) => { e.preventDefault(); navigate('/privacy-policy'); }} style={{ color: '#0d9488', textDecoration: 'none', fontWeight: 600 }}>Privacy Policy</a>
          <span>&bull;</span>
          <a href="/contact" onClick={(e) => { e.preventDefault(); navigate('/contact'); }} style={{ color: '#0d9488', textDecoration: 'none', fontWeight: 600 }}>Contact & Support</a>
          <span>&bull;</span>
          <a href="/brochure" onClick={(e) => { e.preventDefault(); navigate('/brochure'); }} style={{ color: '#0d9488', textDecoration: 'none', fontWeight: 600 }}>Brochure</a>
        </div>
      </div>
    </div>
  );
}
