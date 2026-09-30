import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Lock, 
  Eye, 
  FileText, 
  Smartphone, 
  Mail, 
  Trash2, 
  CreditCard, 
  UserCheck, 
  Layers, 
  Calendar,
  AlertCircle
} from 'lucide-react';

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
              <ShieldCheck size={28} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Privacy Policy</h1>
              <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '3px 0 0 0' }}>
                PetCare Pro — Veterinary Clinic Management System (SaaS & PWA)
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

        {/* Play Store Compliance Notice Banner */}
        <div style={{ 
          backgroundColor: '#f0fdfa', 
          border: '1px solid #ccfbf1', 
          borderRadius: '12px', 
          padding: '1rem 1.25rem', 
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          color: '#0f766e',
          fontSize: '0.85rem'
        }}>
          <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Google Play Store & User Data Compliance Statement:</strong>
            <p style={{ margin: '4px 0 0 0', color: '#115e59', lineHeight: '1.5' }}>
              This policy discloses all data collection, permissions, data handling, encryption, third-party services, and user data deletion mechanisms in accordance with Google Play Developer Policy and global data protection standards.
            </p>
          </div>
        </div>

        <div style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Calendar size={15} /> Last Updated & Effective Date: <strong>September 29, 2026</strong>
        </div>

        {/* Policy Body */}
        <div style={{ lineHeight: '1.75', fontSize: '0.95rem', color: '#334155' }}>
          
          {/* Section 1 */}
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0d9488', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
              <Eye size={20} /> 1. Introduction & Developer Identity
            </h2>
            <p>
              Welcome to <strong>PetCare Pro</strong> ("we," "our," "us," or "the Application"), a comprehensive veterinary clinic management SaaS and Progressive Web Application (PWA). The platform is developed and maintained by <strong>Kiaan Technology</strong>.
            </p>
            <p>
              We are committed to maintaining the confidentiality, integrity, and security of all personal data, clinical records, and pet health information. This Privacy Policy outlines what information we collect when you use our website, Progressive Web App (PWA), or Android app, why we collect it, how it is protected, and your rights regarding your data.
            </p>
          </section>

          {/* Section 2 */}
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0d9488', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
              <FileText size={20} /> 2. Information We Collect (Play Store Data Safety)
            </h2>
            <p>We collect and process the following categories of information strictly to provide veterinary practice management services:</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <strong style={{ color: '#0f172a' }}>A. Personal Information:</strong>
                <ul style={{ paddingLeft: '1.25rem', marginTop: '0.4rem', marginBottom: 0 }}>
                  <li><strong>Clinic Staff:</strong> Name, professional email address, phone number, clinic address, assigned role (Doctor, Receptionist, Assistant, Clinic Admin), and login credentials.</li>
                  <li><strong>Pet Owners:</strong> Full name, phone number, email address, physical address, and emergency contact details.</li>
                </ul>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <strong style={{ color: '#0f172a' }}>B. Pet Health & Clinical Records:</strong>
                <ul style={{ paddingLeft: '1.25rem', marginTop: '0.4rem', marginBottom: 0 }}>
                  <li>Pet name, species, breed, gender, date of birth / age, weight, microchip identification number.</li>
                  <li>Medical history, diagnostic notes, examination findings, prescribed medications, vaccination records, surgical/hospitalization logs, and scheduled appointments.</li>
                </ul>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <strong style={{ color: '#0f172a' }}>C. Financial & Transaction Data:</strong>
                <ul style={{ paddingLeft: '1.25rem', marginTop: '0.4rem', marginBottom: 0 }}>
                  <li>Clinic billing receipts, invoice numbers, breakdown of consultation fees, and subscription plan transactions.</li>
                  <li><em>Payment Security Notice:</em> All online payments are handled directly by certified, PCI-DSS compliant third-party payment gateways (such as Razorpay or Stripe). <strong>We never collect, store, or process credit/debit card numbers or CVV codes on our servers.</strong></li>
                </ul>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <strong style={{ color: '#0f172a' }}>D. Photos & Document Uploads:</strong>
                <ul style={{ paddingLeft: '1.25rem', marginTop: '0.4rem', marginBottom: 0 }}>
                  <li>Pet profile pictures, uploaded diagnostic X-ray/lab reports, and prescription scans uploaded by clinic doctors or staff.</li>
                </ul>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <strong style={{ color: '#0f172a' }}>E. Device & Usage Information:</strong>
                <ul style={{ paddingLeft: '1.25rem', marginTop: '0.4rem', marginBottom: 0 }}>
                  <li>IP address, device model, operating system version, browser type, network status (online/offline), error logs, and session activity logs for system security and audit trails.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0d9488', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
              <Smartphone size={20} /> 3. Device Permissions & Purpose
            </h2>
            <p>Our Android App / PWA requires specific device permissions solely to support core operational features:</p>
            <ul style={{ paddingLeft: '1.25rem' }}>
              <li><strong>INTERNET & ACCESS_NETWORK_STATE:</strong> Enables continuous, secure synchronization between the clinic application and cloud servers, and provides offline caching when internet connection is unavailable.</li>
              <li><strong>POST_NOTIFICATIONS:</strong> Sends critical clinic alerts, appointment reminders, vaccination schedules, and staff assignment notifications. (Users can disable notifications in device settings at any time).</li>
              <li><strong>CAMERA / STORAGE (READ_MEDIA_IMAGES):</strong> Used only when the user voluntarily takes a photo of a pet, uploads an X-ray report, or scans a medical document.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0d9488', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
              <UserCheck size={20} /> 4. How We Use Your Information
            </h2>
            <p>All collected data is utilized exclusively for genuine clinic management purposes:</p>
            <ul style={{ paddingLeft: '1.25rem' }}>
              <li>Scheduling, managing, and confirming veterinary appointments and home visits.</li>
              <li>Maintaining electronic health records (EHR) and vaccination histories for pets.</li>
              <li>Generating POS billing receipts, tax invoices, and tracking clinic inventory.</li>
              <li>Enforcing strict Role-Based Access Control (RBAC) so staff only access authorized records.</li>
              <li>Providing automated service worker offline access for uninterrupted clinic workflows.</li>
              <li><strong>No Data Commercialization:</strong> We do NOT sell, rent, trade, or share user personal data or clinical records with third-party advertisers or data brokers under any circumstances.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0d9488', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
              <Lock size={20} /> 5. Data Security & Storage
            </h2>
            <p>We deploy robust, enterprise-grade security protocols to protect your information:</p>
            <ul style={{ paddingLeft: '1.25rem' }}>
              <li><strong>Encryption in Transit:</strong> All data transmitted between your device and our servers is encrypted using industry-standard Transport Layer Security (TLS 1.2 / 1.3 / HTTPS).</li>
              <li><strong>Authentication Security:</strong> Secure JSON Web Token (JWT) authentication with hashed passwords using bcrypt cryptographic algorithms.</li>
              <li><strong>Role-Based Access:</strong> Multi-tenant isolation ensuring each clinic’s database is strictly segregated and inaccessible to other organizations.</li>
              <li><strong>Automated Backups:</strong> Secure, encrypted cloud backups with redundancy to prevent data loss.</li>
            </ul>
          </section>

          {/* Section 6 - CRITICAL FOR GOOGLE PLAY */}
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0d9488', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
              <Trash2 size={20} /> 6. Data Retention & Account Deletion Policy (Play Store Requirement)
            </h2>
            <div style={{ backgroundColor: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '12px', padding: '1.25rem', color: '#9f1239' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 700, color: '#be123c' }}>
                Your Right to Request Account and Data Deletion
              </h3>
              <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.6' }}>
                In compliance with Google Play's Account Deletion policy, users and clinic administrators have full rights to request the deletion of their account and all associated personal and clinical data:
              </p>
              <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem', marginBottom: '0.75rem', fontSize: '0.88rem' }}>
                <li><strong>How to request:</strong> Send an email to <a href="mailto:support@kiaantechnology.com" style={{ color: '#be123c', fontWeight: 700, textDecoration: 'underline' }}>support@kiaantechnology.com</a> or <a href="mailto:info@kiaantechnology.com" style={{ color: '#be123c', fontWeight: 700, textDecoration: 'underline' }}>info@kiaantechnology.com</a> with the subject line <em>"Account & Data Deletion Request"</em>.</li>
                <li><strong>Verification:</strong> Please provide your registered clinic email, clinic name, and admin phone number for identity verification.</li>
                <li><strong>Execution Timeline:</strong> Once verified, your account, user credentials, patient records, staff logs, and media uploads will be permanently removed from active databases within <strong>30 days</strong>.</li>
              </ul>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#9f1239', fontStyle: 'italic' }}>
                *Note: Certain transaction and financial records may be retained in encrypted archive logs for a legally required statutory period in accordance with local taxation laws.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0d9488', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
              <Layers size={20} /> 7. Third-Party Service Providers
            </h2>
            <p>We work with trusted third-party cloud infrastructure partners who adhere to rigorous data protection standards:</p>
            <ul style={{ paddingLeft: '1.25rem' }}>
              <li><strong>Cloud Hosting & Database:</strong> Secure cloud servers with 99.9% uptime and physical security.</li>
              <li><strong>Payment Processing:</strong> Razorpay / Stripe (PCI-DSS Level 1 certified gateways).</li>
              <li><strong>Push Notifications:</strong> Firebase Cloud Messaging (FCM) by Google for delivering appointment alerts.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0d9488', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
              <CreditCard size={20} /> 8. Children’s Privacy
            </h2>
            <p>
              PetCare Pro is a specialized B2B and practice management tool intended for adult veterinary professionals, clinic staff, and pet owners. We do not knowingly collect, solicit, or maintain personal information from individuals under the age of 13 (or under 16 where applicable). If we learn that personal data of a minor has been collected inadvertently, we will immediately delete that information.
            </p>
          </section>

          {/* Section 9 */}
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0d9488', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
              <Mail size={20} /> 9. Contact Us & Legal Inquiries
            </h2>
            <p>
              If you have any questions, comments, or requests regarding this Privacy Policy or our data handling practices, please contact our Data Protection Officer:
            </p>
            <div style={{ backgroundColor: '#f1f5f9', padding: '1.25rem', borderRadius: '12px', fontSize: '0.9rem', color: '#0f172a', border: '1px solid #e2e8f0', lineHeight: '1.7' }}>
              <strong>PetCare Pro Support & Privacy Office</strong><br />
              <strong>Company:</strong> Kiaan Technology<br />
              <strong>General & Privacy Inquiries:</strong> <a href="mailto:info@kiaantechnology.com" style={{ color: '#0d9488', fontWeight: 600 }}>info@kiaantechnology.com</a><br />
              <strong>Customer Support & Data Deletion:</strong> <a href="mailto:support@kiaantechnology.com" style={{ color: '#0d9488', fontWeight: 600 }}>support@kiaantechnology.com</a><br />
              <strong>Official Website:</strong> <a href="https://kiaantechnology.com" target="_blank" rel="noopener noreferrer" style={{ color: '#0d9488', fontWeight: 600 }}>https://kiaantechnology.com</a><br />
              <strong>Application Portal:</strong> <a href="https://veterinary-saas.kiaantechnology.com" target="_blank" rel="noopener noreferrer" style={{ color: '#0d9488', fontWeight: 600 }}>https://veterinary-saas.kiaantechnology.com</a>
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
          <a href="/terms" onClick={(e) => { e.preventDefault(); navigate('/terms'); }} style={{ color: '#0d9488', textDecoration: 'none', fontWeight: 600 }}>Terms & Conditions</a>
          <span>&bull;</span>
          <a href="/contact" onClick={(e) => { e.preventDefault(); navigate('/contact'); }} style={{ color: '#0d9488', textDecoration: 'none', fontWeight: 600 }}>Contact & Support</a>
          <span>&bull;</span>
          <a href="/brochure" onClick={(e) => { e.preventDefault(); navigate('/brochure'); }} style={{ color: '#0d9488', textDecoration: 'none', fontWeight: 600 }}>Brochure</a>
        </div>
      </div>
    </div>
  );
}
