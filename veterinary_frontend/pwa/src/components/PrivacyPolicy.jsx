import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Lock, Eye, FileText, Smartphone, Mail, RefreshCw } from 'lucide-react';

export default function PrivacyPolicy() {
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
        maxWidth: '850px',
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.05)',
        border: '1px solid #e2e8f0',
        padding: '2.5rem 2rem',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 44, height: 44, borderRadius: '12px', background: '#0f766e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <ShieldCheck size={26} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Privacy Policy</h1>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '2px 0 0 0' }}>PetCare Clinic Veterinary Management System</p>
            </div>
          </div>
          <button
            onClick={() => navigate(-1)}
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
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '2rem', fontStyle: 'italic' }}>
          Last Updated: September 28, 2026
        </div>

        {/* Content */}
        <div style={{ lineHeight: '1.7', fontSize: '0.975rem', color: '#334155' }}>
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f766e', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Eye size={20} /> 1. Introduction
            </h2>
            <p>
              Welcome to <strong>PetCare Clinic</strong> ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of personal, patient, and clinical data processed through our Veterinary SaaS Application and Mobile PWA.
            </p>
            <p>
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application on Desktop, Mobile Web, or Android native app versions.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f766e', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={20} /> 2. Information We Collect
            </h2>
            <ul style={{ paddingLeft: '1.25rem' }}>
              <li><strong>Account & Profile Information:</strong> Name, email address, phone number, clinic name, role (Doctor, Receptionist, Staff), and login credentials.</li>
              <li><strong>Pet & Owner Records:</strong> Pet owner names, contact numbers, pet details (name, breed, age, species), medical history, vaccination records, and prescriptions.</li>
              <li><strong>Billing & Transaction Details:</strong> Invoices, payment transaction IDs, and subscription records for clinic operations.</li>
              <li><strong>Device & Usage Data:</strong> IP address, device type, operating system version, and app performance logs for technical troubleshooting and security audits.</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f766e', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Smartphone size={20} /> 3. App Permissions & Data Usage
            </h2>
            <p>Our Android Application / PWA may request the following device permissions to provide core features:</p>
            <ul style={{ paddingLeft: '1.25rem' }}>
              <li><strong>Internet & Network Access:</strong> Required to sync clinic data, medical records, and appointment updates with secure cloud servers.</li>
              <li><strong>Notifications:</strong> Used to send timely appointment reminders, treatment schedules, and clinic alerts.</li>
              <li><strong>Storage / Camera:</strong> (If applicable) Used when uploading pet medical documents, diagnostic reports, or pet profile pictures.</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f766e', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={20} /> 4. Data Protection & Security
            </h2>
            <p>
              We implement industry-standard security measures including SSL/TLS encryption for data transmission, encrypted JWT token authentication, and strict role-based access control (RBAC). Your medical records and private user data are never sold or shared with unauthorized third parties.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f766e', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RefreshCw size={20} /> 5. Third-Party Services & Integrations
            </h2>
            <p>
              To deliver mission-critical veterinary clinic functionality, our platform securely interfaces with select trusted third-party service providers under strict data confidentiality:
            </p>
            <ul style={{ paddingLeft: '1.25rem' }}>
              <li><strong>Payment Processors:</strong> We use authorized, PCI-DSS compliant payment gateways (such as Razorpay / Stripe) to process clinic subscription transactions. Financial credit card numbers and bank details are handled directly by the payment provider and never stored on our servers.</li>
              <li><strong>SMS & Email Communication:</strong> Services such as Twilio, Fast2SMS, and transactional email relays are utilized strictly to transmit appointment alerts, vaccination reminders, and verification OTPs to pet owners and clinic personnel.</li>
              <li><strong>Cloud Storage:</strong> Encrypted cloud storage systems are utilized for secure persistence of pet diagnostic attachments, invoices, and clinic backups.</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f766e', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={20} /> 6. Data Retention & Account Deletion (Google Play Compliance)
            </h2>
            <p>
              We retain account data for as long as your clinic account remains active. As required by Google Play policy, users have full rights to request permanent deletion of their account and associated personal data:
            </p>
            <ul style={{ paddingLeft: '1.25rem' }}>
              <li><strong>In-App Deletion:</strong> Authenticated users can permanently delete their profile and personal data at any time via <strong>Settings &rarr; Profile &rarr; Delete Account</strong>.</li>
              <li><strong>Public Web Deletion:</strong> If you cannot access the application, you can submit a public deletion request at <a href="/delete-account" onClick={(e) => { e.preventDefault(); navigate('/delete-account'); }} style={{ color: '#0f766e', fontWeight: 600 }}>/delete-account</a>.</li>
              <li><strong>Processing Timeframe:</strong> Personal records, credentials, and profile identifiers are permanently purged within 30 days of confirmed deletion. Transactional tax invoices are anonymized and retained solely where mandated by statutory commercial regulations.</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f766e', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={20} /> 7. Children's Privacy
            </h2>
            <p>
              PetCare Pro is a commercial B2B veterinary practice management system intended strictly for veterinary clinic staff, doctors, and adult pet owners (aged 18 or older). We do not knowingly solicit or collect personal information from individuals under 13 years of age.
            </p>
          </section>

          <section style={{ marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f766e', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={20} /> 8. Contact Us
            </h2>
            <p>
              For any inquiries, privacy concerns, or data rights requests, please contact our Data Protection Officer:
            </p>
            <div style={{ backgroundColor: '#f1f5f9', padding: '1.25rem', borderRadius: '12px', fontSize: '0.9rem', color: '#0f172a', lineHeight: '1.7' }}>
              <strong>Kiaan Technology — PetCare Pro Privacy Team</strong><br />
              Email: <a href="mailto:contact@kiaantechnology.com" style={{ color: '#0f766e', textDecoration: 'none', fontWeight: 600 }}>contact@kiaantechnology.com</a><br />
              Website: <a href="https://kiaantechnology.com" target="_blank" rel="noopener noreferrer" style={{ color: '#0f766e', textDecoration: 'none', fontWeight: 600 }}>https://kiaantechnology.com</a><br />
              Address: Kiaan Technology Enterprise Software Division
            </div>
          </section>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '2.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#94a3b8' }}>
          &copy; {new Date().getFullYear()} Kiaan Technology. All Rights Reserved.
        </div>
      </div>
    </div>
  );
}
