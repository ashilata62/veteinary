import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  FileText, 
  CreditCard, 
  BellRing, 
  Hospital, 
  BarChart3, 
  ArrowLeft, 
  CheckCircle, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  PhoneCall
} from 'lucide-react';

const MODULES_DATA = {
  'smart-appointments': {
    title: 'Smart Appointments & Queue Management',
    tag: 'Clinical Workflow',
    icon: Calendar,
    color: '#0d9488',
    bgLight: '#f0fdfa',
    badge: 'Zero Waiting Room Clutter',
    headline: 'Streamline Pet Consultations & Eliminate Clinic Bottlenecks',
    description: 'Transform your clinic reception with an intelligent scheduling system that synchronizes doctor availability, reduces pet parent wait times by 65%, and handles walk-ins and emergencies seamlessly.',
    features: [
      { title: 'Interactive Doctor Calendar', desc: 'Day, week, and month view with color-coded slots for consultations, surgeries, and grooming.' },
      { title: 'Digital Queue & Token Display', desc: 'Real-time patient waiting list with live status: Waiting, In-Consultation, and Completed.' },
      { title: 'Multi-Doctor Time Slotting', desc: 'Custom shift hours, break times, and simultaneous appointment handling across doctors.' },
      { title: 'Automated Reminders', desc: 'Automated SMS and WhatsApp visit reminders to reduce no-shows by up to 80%.' }
    ],
    stats: [
      { value: '65%', label: 'Wait Time Reduction' },
      { value: '80%', label: 'Fewer Missed Visits' },
      { value: '1-Tap', label: 'Fast Check-In' }
    ]
  },
  'electronic-medical-records': {
    title: 'Electronic Medical Records (EMR & EHR)',
    tag: 'Patient Health History',
    icon: FileText,
    color: '#2563eb',
    bgLight: '#eff6ff',
    badge: '100% Paperless Practice',
    headline: 'Instant Access to Comprehensive Pet Health Histories Anywhere',
    description: 'Manage lifelong medical charts, vaccination schedules, diagnostic laboratory reports, and digital Rx prescriptions securely in the cloud. Tailored specifically for multi-species veterinary care.',
    features: [
      { title: 'Multi-Species Health Profiles', desc: 'Custom medical records for Canines, Felines, Avian, Bovine, and exotic animals with age/weight charts.' },
      { title: 'Digital Prescription Generator', desc: '1-click drug dosage calculations, duration rules, and instant printable/WhatsApp PDF prescriptions.' },
      { title: 'Diagnostic File & X-Ray Vault', desc: 'Store high-resolution ultrasounds, blood work results, and surgical photos directly in the patient file.' },
      { title: 'Vaccination Due Tracker', desc: 'Automatic schedule generator for Rabies, DHPP, FVRCP, and booster reminders.' }
    ],
    stats: [
      { value: '100%', label: 'Digital Record Keeping' },
      { value: '3 Sec', label: 'Search by Microchip/Phone' },
      { value: 'HIPAA', label: 'Security & Backup Ready' }
    ]
  },
  'pharmacy-pos-billing': {
    title: 'Pharmacy & POS Invoicing System',
    tag: 'Financial Operations',
    icon: CreditCard,
    color: '#9333ea',
    bgLight: '#faf5ff',
    badge: 'Lightning-Fast Billing',
    headline: 'Accurate Clinic Billing, Itemized Receipts & Stock Sync',
    description: 'Generate professional invoices in under 15 seconds. Seamlessly combine consultation charges, pharmacy medications, surgical procedures, and grooming into a single branded tax invoice.',
    features: [
      { title: 'Instant POS Receipt Printing', desc: 'Supports thermal 3-inch roll printers and standard A4/A5 PDF invoices with clinic branding.' },
      { title: 'Multi-Mode Payment Tracking', desc: 'Record split payments: Cash, UPI, Credit Card, and Insurance with transaction IDs.' },
      { title: 'Real-Time Inventory Depletion', desc: 'Dispensing a medicine automatically deducts stock and warns when approaching safety levels.' },
      { title: 'Custom Discount & Tax Rules', desc: 'Pre-configure GST/VAT rates, clinic staff discounts, and promotional pet welfare packages.' }
    ],
    stats: [
      { value: '15 Sec', label: 'Average Invoicing Time' },
      { value: '0 Error', label: 'Stock Reconciliation' },
      { value: 'Multi-Mode', label: 'UPI / Cash / Card' }
    ]
  },
  'automated-whatsapp-alerts': {
    title: 'Automated WhatsApp & SMS Alerts',
    tag: 'Client Engagement',
    icon: BellRing,
    color: '#16a34a',
    bgLight: '#f0fdf4',
    badge: 'High-Retention Client Alerts',
    headline: 'Engage Pet Parents with Timely Automated Care Notifications',
    description: 'Build long-term clinic loyalty by automatically reminding pet parents when vaccinations are due, appointments are booked, or lab reports are ready to download via WhatsApp.',
    features: [
      { title: 'Vaccination Due Reminders', desc: 'Proactively notify pet parents 7 days, 2 days, and on the morning of scheduled vaccine doses.' },
      { title: 'Direct PDF Prescription Sharing', desc: 'Send treatment notes and itemized invoices directly to the owner’s WhatsApp with one click.' },
      { title: 'Surgery & Discharge Updates', desc: 'Reassure anxious owners with pre-templated recovery updates and discharge instructions.' },
      { title: 'Automated Follow-Up Broadcasts', desc: 'Check in on pet health post-treatment to ensure treatment compliance and satisfaction.' }
    ],
    stats: [
      { value: '98%', label: 'WhatsApp Open Rate' },
      { value: '3.2x', label: 'Higher Repeat Visits' },
      { value: 'Zero Effort', label: 'Auto-Triggered System' }
    ]
  },
  'hospitalization-ipd': {
    title: 'Hospitalization & IPD Ward Management',
    tag: 'Critical & Boarding Care',
    icon: Hospital,
    color: '#e11d48',
    bgLight: '#fff1f2',
    badge: 'Critical Care Monitoring',
    headline: 'Comprehensive In-Patient Care, Kennel Tracking & Vitals Logs',
    description: 'Ensure round-the-clock safety for admitted pet patients. Track cage occupancy, monitor hourly vitals, log IV fluid administrations, and generate itemized daily hospitalization tariffs.',
    features: [
      { title: 'Visual Ward & Cage Layout', desc: 'Real-time interactive dashboard of occupied, vacant, and quarantined kennels and cages.' },
      { title: 'Hourly Clinical Vitals Log', desc: 'Record temperature, heart rate, respiration, capillary refill time, and pain scores.' },
      { title: 'Treatment & Drug Dosing Chart', desc: 'Nurse duty charts with checkboxes for IV injections, wound dressings, and oral medications.' },
      { title: 'Daily IPD Billing Accumulation', desc: 'Automatically accumulates boarding fees, special diets, and doctor rounds onto the final bill.' }
    ],
    stats: [
      { value: '24/7', label: 'Patient Vitals Audit' },
      { value: 'Visual', label: 'Bed & Kennel Occupancy' },
      { value: 'Automated', label: 'Daily Room Tariff Sync' }
    ]
  },
  'multi-branch-reports': {
    title: 'Clinic Analytics & Multi-Branch Reports',
    tag: 'Business Intelligence',
    icon: BarChart3,
    color: '#d97706',
    bgLight: '#fffbeb',
    badge: 'Executive SaaS Insights',
    headline: 'Real-Time Revenue, Doctor Payouts & Practice Growth Insights',
    description: 'Empower clinic owners and management with transparent financial metrics, doctor commission breakdowns, drug consumption summaries, and branch performance comparisons.',
    features: [
      { title: 'Daily Revenue & Profit Tracking', desc: 'Breakdowns by consultation, surgery, diagnostics, pharmacy, and grooming services.' },
      { title: 'Doctor Commission & Payouts', desc: 'Transparent calculation of doctor revenue shares and treatment bonuses without manual spreadsheets.' },
      { title: 'Pharmacy Expiry & Fast-Moving Stock', desc: 'Identify top revenue-generating medicines and receive early warnings for nearing-expiry batches.' },
      { title: 'Export to Excel & PDF', desc: 'Generate 1-click financial audit reports ready for accountants and tax compliance.' }
    ],
    stats: [
      { value: '100%', label: 'Revenue Transparency' },
      { value: '1-Click', label: 'Audit Ready Reports' },
      { value: 'Multi-Branch', label: 'Consolidated View' }
    ]
  }
};

export default function ModuleDetailPage({ moduleKey }) {
  const navigate = useNavigate();
  const location = useLocation();

  // If moduleKey is not passed as prop, extract from URL
  const currentKey = moduleKey || location.pathname.replace(/^\//, '');
  const data = MODULES_DATA[currentKey] || MODULES_DATA['smart-appointments'];
  const IconComponent = data.icon;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      color: '#0f172a'
    }}>
      {/* Top Navbar */}
      <nav style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '0.85rem 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              backgroundColor: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              color: '#334155'
            }}
          >
            <ArrowLeft size={16} /> Home
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <img src="/kt-logo.png" alt="Logo" style={{ height: '30px' }} />
            <span style={{ fontWeight: 800, fontSize: '1.15rem' }}>PetCare <span style={{ color: '#0d9488' }}>Pro</span></span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '6px 14px',
              backgroundColor: 'transparent',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/register?plan=starter')}
            style={{
              padding: '6px 16px',
              background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(13, 148, 136, 0.3)'
            }}
          >
            Start Free Trial
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2.5rem 1rem' }}>
        
        {/* Hero Section */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          padding: '2.5rem',
          boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.05)',
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: data.bgLight, color: data.color, padding: '4px 12px', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem', border: `1px solid ${data.color}30` }}>
            <Sparkles size={14} /> {data.badge}
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              backgroundColor: data.bgLight,
              color: data.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              border: `1px solid ${data.color}40`
            }}>
              <IconComponent size={32} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem 0', lineHeight: '1.25' }}>
                {data.title}
              </h1>
              <p style={{ fontSize: '1.1rem', fontWeight: 600, color: data.color, margin: 0 }}>
                {data.headline}
              </p>
            </div>
          </div>

          <p style={{ fontSize: '1rem', color: '#475569', lineHeight: '1.7', marginBottom: '2rem' }}>
            {data.description}
          </p>

          {/* Stats Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            backgroundColor: '#f8fafc',
            padding: '1.25rem',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            marginBottom: '2rem'
          }}>
            {data.stats.map((st, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: data.color, lineHeight: '1.2' }}>{st.value}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginTop: '2px' }}>{st.label}</div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/register?plan=starter')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.85rem 1.85rem',
                background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(13, 148, 136, 0.35)'
              }}
            >
              Get Started with this Module <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate('/contact')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.85rem 1.6rem',
                backgroundColor: '#ffffff',
                color: '#334155',
                border: '1px solid #cbd5e1',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer'
              }}
            >
              <PhoneCall size={18} /> Schedule Demo
            </button>
          </div>
        </div>

        {/* Feature Grid */}
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>
          Key Features & Clinical Capabilities
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem'
        }}>
          {data.features.map((feat, idx) => (
            <div key={idx} style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.65rem' }}>
                <CheckCircle size={18} color="#0d9488" />
                <h3 style={{ fontSize: '1.02rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  {feat.title}
                </h3>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: '1.6', margin: 0 }}>
                {feat.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Explore Other Modules */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          padding: '1.75rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
            Explore Other Clinic Modules
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
            {Object.entries(MODULES_DATA).map(([key, item]) => {
              if (key === currentKey) return null;
              return (
                <button
                  key={key}
                  onClick={() => navigate(`/${key}`)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: '#334155',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <item.icon size={15} color={item.color} />
                  <span>{item.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '2.5rem', color: '#94a3b8', fontSize: '0.82rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
          <span>&copy; {new Date().getFullYear()} PetCare Pro SaaS by Kiaan Technology. All rights reserved.</span>
          <span>&bull;</span>
          <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} style={{ color: '#0d9488', textDecoration: 'none', fontWeight: 600 }}>Home</a>
          <span>&bull;</span>
          <a href="/contact" onClick={(e) => { e.preventDefault(); navigate('/contact'); }} style={{ color: '#0d9488', textDecoration: 'none', fontWeight: 600 }}>Contact & Support</a>
          <span>&bull;</span>
          <a href="/brochure" onClick={(e) => { e.preventDefault(); navigate('/brochure'); }} style={{ color: '#0d9488', textDecoration: 'none', fontWeight: 600 }}>Brochure</a>
          <span>&bull;</span>
          <a href="/privacy-policy" onClick={(e) => { e.preventDefault(); navigate('/privacy-policy'); }} style={{ color: '#0d9488', textDecoration: 'none', fontWeight: 600 }}>Privacy Policy</a>
          <span>&bull;</span>
          <a href="/terms" onClick={(e) => { e.preventDefault(); navigate('/terms'); }} style={{ color: '#0d9488', textDecoration: 'none', fontWeight: 600 }}>Terms & Conditions</a>
        </div>
      </div>
    </div>
  );
}
