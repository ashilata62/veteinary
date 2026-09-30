import React from 'react';
import { X } from 'lucide-react';


export default function LegalModal({ type, onClose }) {
  const isPrivacy = type === 'privacy';
  
  const title = isPrivacy ? "Privacy Policy" : "Terms & Conditions";
  
  return (
    <div 
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px', animation: 'fadeOverlay 0.2s ease'
      }} 
      onClick={onClose}
    >
      <div 
        style={{
          background: 'linear-gradient(145deg, #111113, #0d0d0f)',
          border: '1px solid rgba(20,184,166,0.2)',
          borderRadius: '20px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(20,184,166,0.1)',
          width: '100%', maxWidth: '700px', maxHeight: '85vh',
          display: 'flex', flexDirection: 'column',
          position: 'relative',
          animation: 'slideUp 0.3s ease',
          fontFamily: "'Inter', system-ui, sans-serif",
          color: '#f3f4f6',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="vet-modal-header" style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '1.5rem' }}>{title}</h2>
          <button className="vet-modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Modal Body with scroll */}
        <div className="vet-modal-body" style={{ padding: '2rem 1.5rem', overflowY: 'auto', color: '#d1d5db', lineHeight: '1.7', fontSize: '0.95rem' }}>
          {isPrivacy ? (
            <div>
              <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>
              <br/>
              <h3>1. Information We Collect</h3>
              <p>We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with us. This may include your name, email address, phone number, and clinic details.</p>
              <br/>
              <h3>2. How We Use Your Information</h3>
              <p>We use the information we collect to provide, maintain, and improve our PetCare Pro services, to process transactions, and to send you related information, including confirmations and receipts.</p>
              <br/>
              <h3>3. Data Security</h3>
              <p>We implement appropriate technical and organizational measures designed to protect the security of any personal information we process. However, please note that no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure.</p>
              <br/>
              <h3>4. Sharing of Information</h3>
              <p>We may share your information with third-party vendors and service providers that perform services on our behalf. We do not sell your personal information to third parties.</p>
              <br/>
              <h3>5. Contact Us</h3>
              <p>If you have any questions about this Privacy Policy, please contact us at info@kiaantechnology.com.</p>
            </div>
          ) : (
            <div>
              <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>
              <br/>
              <h3>1. Acceptance of Terms</h3>
              <p>By accessing and using PetCare Pro, you accept and agree to be bound by the terms and provision of this agreement.</p>
              <br/>
              <h3>2. Use License</h3>
              <p>Permission is granted to temporarily download one copy of the materials (information or software) on Kiaan Technology's website for personal, non-commercial transitory viewing only.</p>
              <br/>
              <h3>3. Disclaimer</h3>
              <p>The materials on Kiaan Technology's website are provided on an 'as is' basis. Kiaan Technology makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
              <br/>
              <h3>4. Limitations</h3>
              <p>In no event shall Kiaan Technology or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Kiaan Technology's website.</p>
              <br/>
              <h3>5. Governing Law</h3>
              <p>These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
