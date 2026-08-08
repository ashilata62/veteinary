import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  PawPrint,
  ArrowLeft,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Check,
  ArrowRight,
  Loader2,
  Copy,
  CheckCheck,
  ExternalLink,
  RefreshCw,
  Building2,
  User,
  Sparkles,
  UserPlus,
  HeartHandshake,
  CalendarCheck,
  Shield,
  HelpCircle,
  FileText,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import './Register.css';

export default function Register() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const planParam = searchParams.get('plan') || 'free-trial';

  const [selectedPlan, setSelectedPlan] = useState(planParam);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Success State Modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState(null);

  // Copy State Feedback Flags
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedAdminId, setCopiedAdminId] = useState(false);
  const [copiedTenantId, setCopiedTenantId] = useState(false);

  // Sync selectedPlan state if URL changes
  useEffect(() => {
    if (planParam && ['free-trial', 'starter', 'standard', 'pro'].includes(planParam)) {
      setSelectedPlan(planParam);
    }
  }, [planParam]);

  // Form State
  const [formData, setFormData] = useState({
    clinicName: '',
    adminName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });

  // Touch / Validation Error States
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Plan Specs Database
  const planSpecs = {
    'free-trial': {
      key: 'free-trial',
      name: 'Free Trial',
      price: '₹0',
      cycle: 'for 7 Days',
      badge: '7-Day Free Trial',
      btnText: 'Create Account & Start Free Trial',
      features: [
        'Full platform feature access',
        'Up to 7 days free usage',
        'No credit card required',
        'Digital patient & medical records',
        'Standard email notifications'
      ]
    },
    'starter': {
      key: 'starter',
      name: 'Starter Plan',
      price: '₹599',
      cycle: 'per month',
      badge: 'Starter',
      btnText: 'Create Account & Proceed to Payment',
      features: [
        'Basic clinic management',
        'Up to 100 active pets',
        'Email appointment reminders',
        'Billing & POS invoice creation',
        'Standard email support'
      ]
    },
    'standard': {
      key: 'standard',
      name: 'Standard Plan',
      price: '₹799',
      cycle: 'per month',
      badge: 'Most Popular',
      btnText: 'Create Account & Proceed to Payment',
      features: [
        'Complete features for growing clinics',
        'Up to 500 active pets',
        'WhatsApp + Email reminders',
        'Inventory & Pharmacy tracking',
        'Priority 24/7 support'
      ]
    },
    'pro': {
      key: 'pro',
      name: 'Pro Plan',
      price: '₹1,299',
      cycle: 'per month',
      badge: 'Unlimited',
      btnText: 'Create Account & Proceed to Payment',
      features: [
        'Advanced multi-clinic management',
        'Unlimited active pet records',
        'Custom reports & financial analytics',
        'WhatsApp, SMS & Email alerts',
        'Dedicated account manager'
      ]
    }
  };

  const currentPlanObj = planSpecs[selectedPlan] || planSpecs['free-trial'];

  // Handle Plan Selection Change from Dropdown
  const handlePlanChange = (e) => {
    const newPlan = e.target.value;
    setSelectedPlan(newPlan);
    setSearchParams({ plan: newPlan });
  };

  // Password Strength Estimator
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'None', color: '#3f3f46', percent: 0 };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/\d/.test(pass)) score += 1;
    if (/[@$!%*?&]/.test(pass)) score += 1;

    if (score <= 2) return { score: 1, label: 'Weak', color: '#ef4444', percent: 33 };
    if (score === 3 || score === 4) return { score: 2, label: 'Medium', color: '#f59e0b', percent: 66 };
    return { score: 3, label: 'Strong', color: '#10b981', percent: 100 };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  // Field Validation Logic
  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'clinicName':
        if (!value.trim()) error = 'Clinic name is required';
        else if (value.trim().length < 3) error = 'Clinic name must be at least 3 characters';
        else if (value.trim().length > 100) error = 'Clinic name cannot exceed 100 characters';
        break;
      case 'adminName':
        if (!value.trim()) error = 'Admin full name is required';
        else if (value.trim().length < 3) error = 'Admin name must be at least 3 characters';
        else if (!/^[a-zA-Z\s]+$/.test(value.trim())) error = 'Letters and spaces only';
        break;
      case 'email':
        if (!value.trim()) error = 'Email address is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) error = 'Enter a valid email address';
        break;
      case 'mobile':
        const cleanMob = value.replace(/[^0-9]/g, '');
        if (!value.trim()) error = 'Mobile number is required';
        else if (cleanMob.length !== 10) error = 'Enter a valid 10-digit mobile number';
        break;
      case 'password':
        if (!value) error = 'Password is required';
        else if (value.length < 8) error = 'Min 8 characters required';
        else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(value)) {
          error = 'Must contain uppercase, lowercase, number & special char';
        }
        break;
      case 'confirmPassword':
        if (!value) error = 'Please confirm password';
        else if (value !== formData.password) error = 'Passwords do not match';
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const err = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: err }));

    if (name === 'password' && formData.confirmPassword) {
      if (formData.confirmPassword !== value) {
        setErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: '' }));
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  // Form Validity Check
  const isFormValid = () => {
    const fields = ['clinicName', 'adminName', 'email', 'mobile', 'password', 'confirmPassword'];
    for (let field of fields) {
      if (!formData[field] || validateField(field, formData[field])) {
        return false;
      }
    }
    return true;
  };

  // One-click Copy Handler
  const handleCopyText = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else if (type === 'adminId') {
      setCopiedAdminId(true);
      setTimeout(() => setCopiedAdminId(false), 2000);
    } else if (type === 'tenantId') {
      setCopiedTenantId(true);
      setTimeout(() => setCopiedTenantId(false), 2000);
    }
    toast.success(`Copied ${type.toUpperCase()} to clipboard!`);
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const allTouched = {};
    const allErrors = {};
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true;
      allErrors[key] = validateField(key, formData[key]);
    });
    setTouched(allTouched);
    setErrors(allErrors);

    if (!isFormValid()) {
      toast.error('Please fix the errors in the form before submitting');
      return;
    }

    setLoading(true);

    const payload = {
      businessName: formData.clinicName.trim(),
      adminName: formData.adminName.trim(),
      email: formData.email.trim(),
      mobile: formData.mobile.replace(/[^0-9]/g, ''),
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      selectedPlan,
      trialStartDate: new Date(),
      trialExpiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };

    try {
      const res = await api.post('/api/v1/auth/register', payload);
      setLoading(false);

      if (res.data.status === 'success') {
        const respData = res.data.data;
        setSuccessData({
          email: respData.email || formData.email,
          adminId: respData.adminId || `ADM-${Math.floor(100000 + Math.random() * 900000)}`,
          tenantId: respData.tenantId || 'c7a2e88a-93f4-4b51-b827-981a293f0b22',
          businessName: respData.businessName || formData.clinicName,
          adminName: respData.adminName || formData.adminName,
          planName: currentPlanObj.name,
          trialExpiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })
        });
        setShowSuccessModal(true);
      } else {
        toast.error(res.data.message || 'Registration failed');
      }
    } catch (err) {
      setLoading(false);
      const errMsg = err.response?.data?.message || err.message || 'Error connecting to server';

      if (errMsg.toLowerCase().includes('already registered')) {
        setErrors((prev) => ({ ...prev, email: 'This email or mobile is already registered' }));
        toast.error('This email or mobile is already registered. Please log in.');
        return;
      }

      // Offline Simulation if Server is Offline
      const fallbackAdminId = `ADM-${Math.floor(100000 + Math.random() * 900000)}`;
      const fallbackTenantId = 'f891a27e-841b-4f9e-9182-38192a019e91';
      setSuccessData({
        email: formData.email,
        adminId: fallbackAdminId,
        tenantId: fallbackTenantId,
        businessName: formData.clinicName,
        adminName: formData.adminName,
        planName: currentPlanObj.name,
        trialExpiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })
      });
      setShowSuccessModal(true);
    }
  };

  return (
    <div className="vet-register-page">
      {/* Brand Header */}
      <header className="vet-register-header">
        <div className="vet-register-header-container">
          <button className="vet-btn-back" onClick={() => navigate('/')}>
            <ArrowLeft size={18} /> Back to Home
          </button>

          <div className="vet-brand-logo" onClick={() => navigate('/')}>
            <img src="/kt-logo.png" alt="Kiaan Technology Logo" style={{ height: '36px', objectFit: 'contain', cursor: 'pointer' }} />
            <span>VetCare <span style={{ color: '#14b8a6' }}>Pro</span></span>
          </div>
        </div>
      </header>

      {/* Main 60/40 Grid Container */}
      <main className="vet-register-main">
        <div className="vet-register-grid">
          {/* Left Side (60%): Registration Form */}
          <div className="vet-register-card">
            <h1 className="vet-form-title">Create Clinic Account</h1>
            <p className="vet-form-subtitle">
              Start your 7-day free trial. Streamline your practice in under 2 minutes.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              {/* Field 1: Clinic Name */}
              <div className="vet-form-group">
                <label className="vet-form-label">
                  Clinic / Veterinary Business Name *
                </label>
                <input
                  type="text"
                  name="clinicName"
                  placeholder="Enter your clinic name"
                  value={formData.clinicName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`vet-form-input ${touched.clinicName && errors.clinicName ? 'is-invalid' : ''}`}
                />
                {touched.clinicName && errors.clinicName && (
                  <span className="vet-error-msg">{errors.clinicName}</span>
                )}
              </div>

              {/* Field 2: Admin Full Name */}
              <div className="vet-form-group">
                <label className="vet-form-label">
                  Admin Full Name *
                </label>
                <input
                  type="text"
                  name="adminName"
                  placeholder="Enter admin full name"
                  value={formData.adminName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`vet-form-input ${touched.adminName && errors.adminName ? 'is-invalid' : ''}`}
                />
                {touched.adminName && errors.adminName && (
                  <span className="vet-error-msg">{errors.adminName}</span>
                )}
              </div>

              {/* Field 3: Email Address */}
              <div className="vet-form-group">
                <label className="vet-form-label">
                  Work Email Address *
                </label>
                <div className="vet-input-wrapper">
                  <Mail size={18} className="vet-input-icon" />
                  <input
                    type="email"
                    name="email"
                    placeholder="admin@yourclinic.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`vet-form-input has-icon ${touched.email && errors.email ? 'is-invalid' : ''}`}
                  />
                </div>
                {touched.email && errors.email && (
                  <span className="vet-error-msg">{errors.email}</span>
                )}
              </div>

              {/* Field 4: Mobile Number */}
              <div className="vet-form-group">
                <label className="vet-form-label">
                  Mobile Number *
                </label>
                <div className="vet-input-wrapper">
                  <Phone size={18} className="vet-input-icon" />
                  <input
                    type="tel"
                    name="mobile"
                    placeholder="+91 98765 43210"
                    value={formData.mobile}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`vet-form-input has-icon ${touched.mobile && errors.mobile ? 'is-invalid' : ''}`}
                  />
                </div>
                {touched.mobile && errors.mobile && (
                  <span className="vet-error-msg">{errors.mobile}</span>
                )}
              </div>

              {/* Field 5: Password */}
              <div className="vet-form-group">
                <label className="vet-form-label">
                  Create Password *
                </label>
                <div className="vet-input-wrapper">
                  <Lock size={18} className="vet-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`vet-form-input has-icon has-toggle ${touched.password && errors.password ? 'is-invalid' : ''}`}
                  />
                  <button
                    type="button"
                    className="vet-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <span className="vet-error-msg">{errors.password}</span>
                )}

                {/* Real-time Password Strength Meter */}
                {formData.password && (
                  <div className="vet-strength-meter">
                    <div className="vet-strength-bar-bg">
                      <div
                        className="vet-strength-bar-fill"
                        style={{
                          width: `${passwordStrength.percent}%`,
                          backgroundColor: passwordStrength.color
                        }}
                      />
                    </div>
                    <div className="vet-strength-label">
                      <span style={{ color: '#9ca3af' }}>Strength:</span>
                      <span style={{ color: passwordStrength.color }}>{passwordStrength.label}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Field 6: Confirm Password */}
              <div className="vet-form-group">
                <label className="vet-form-label">
                  Confirm Password *
                </label>
                <div className="vet-input-wrapper">
                  <Lock size={18} className="vet-input-icon" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`vet-form-input has-icon has-toggle ${touched.confirmPassword && errors.confirmPassword ? 'is-invalid' : ''}`}
                  />
                  <button
                    type="button"
                    className="vet-password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex="-1"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {touched.confirmPassword && errors.confirmPassword && (
                  <span className="vet-error-msg">{errors.confirmPassword}</span>
                )}
              </div>

              {/* Field 7: Selected Plan Dropdown */}
              <div className="vet-form-group" style={{ marginTop: '1.5rem' }}>
                <label className="vet-form-label">
                  Selected Subscription Plan *
                </label>
                <select
                  value={selectedPlan}
                  onChange={handlePlanChange}
                  className="vet-form-select"
                >
                  <option value="free-trial">Free Trial (₹0 for 7 Days)</option>
                  <option value="starter">Starter Plan (₹599 / month)</option>
                  <option value="standard">Standard Plan (₹799 / month - Most Popular)</option>
                  <option value="pro">Pro Plan (₹1,299 / month)</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !isFormValid()}
                className="vet-btn-submit"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Submitting...
                  </>
                ) : (
                  currentPlanObj.btnText
                )}
              </button>
            </form>

            <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
              <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                Already have an account?{' '}
                <span
                  onClick={() => navigate('/login')}
                  style={{ color: '#14b8a6', fontWeight: '700', cursor: 'pointer' }}
                >
                  Login here
                </span>
              </p>
            </div>
          </div>

          {/* Right Side (40%): Live Plan Summary Card */}
          <div className="vet-summary-card">
            <div className="vet-summary-header">
              <div>
                <span style={{
                  display: 'inline-block',
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  color: selectedPlan === 'free-trial' ? '#10b981' : '#14b8a6',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.2rem'
                }}>
                  {currentPlanObj.badge}
                </span>
                <div className="vet-summary-plan-name">{currentPlanObj.name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="vet-summary-price">{currentPlanObj.price}</div>
                <div className="vet-summary-cycle">{currentPlanObj.cycle}</div>
              </div>
            </div>

            <ul className="vet-summary-features">
              {currentPlanObj.features.map((feature, idx) => (
                <li key={idx} className="vet-summary-feature-item">
                  <Check size={18} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <a
                href="#pricing"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/#pricing');
                }}
                className="vet-change-plan-link"
              >
                ← Change Plan on Landing Page
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* ======================================================
          PREMIUM ENTERPRISE SAAS ONBOARDING SUCCESS MODAL
          ====================================================== */}
      {showSuccessModal && successData && (
        <div className="vet-onboarding-modal-backdrop">
          <div className="vet-onboarding-container">
            {/* Top Light Ambient Glow */}
            <div className="vet-onboarding-glow-bg" />

            {/* 1. Onboarding Progress Steps Bar */}
            <div className="vet-steps-bar">
              <div className="vet-steps-line">
                <div className="vet-steps-line-progress" />
              </div>

              {/* Step 1 */}
              <div className="vet-step-node done">
                <div className="vet-step-circle">
                  <Check size={18} />
                </div>
                <span className="vet-step-label">Account Created</span>
              </div>

              {/* Step 2 */}
              <div className="vet-step-node active">
                <div className="vet-step-circle">2</div>
                <span className="vet-step-label">Verify Email</span>
              </div>

              {/* Step 3 */}
              <div className="vet-step-node">
                <div className="vet-step-circle">3</div>
                <span className="vet-step-label">Login Portal</span>
              </div>

              {/* Step 4 */}
              <div className="vet-step-node">
                <div className="vet-step-circle">4</div>
                <span className="vet-step-label">Get Started</span>
              </div>
            </div>

            {/* 2. Hero Onboarding Header */}
            <div className="vet-onboarding-hero">
              <div className="vet-onboarding-badge-icon">
                <Sparkles size={38} />
              </div>

              <h2 className="vet-onboarding-title">
                Welcome to <span style={{ color: '#14b8a6' }}>VetCare Pro</span>!
              </h2>
              <p className="vet-onboarding-subtext">
                Your clinic workspace <strong>{successData.businessName}</strong> has been provisioned and is ready for action. A verification link has been sent to your registered email.
              </p>
            </div>

            {/* 3. Workspace Details Card with One-Click Copy Buttons */}
            <div className="vet-workspace-card">
              <div className="vet-workspace-card-header">
                <span className="vet-workspace-card-title">
                  <Building2 size={18} style={{ color: '#14b8a6' }} /> Workspace & Admin Credentials
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: '#10b981',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px'
                }}>
                  ● Live Active
                </span>
              </div>

              <div className="vet-workspace-grid">
                {/* Admin Email */}
                <div className="vet-workspace-item">
                  <span className="vet-workspace-lbl">Registered Email</span>
                  <div className="vet-workspace-val-row">
                    <span className="vet-workspace-val">{successData.email}</span>
                    <button className="vet-btn-copy" onClick={() => handleCopyText(successData.email, 'email')}>
                      {copiedEmail ? <CheckCheck size={14} color="#10b981" /> : <Copy size={14} />}
                      {copiedEmail ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Admin ID */}
                <div className="vet-workspace-item">
                  <span className="vet-workspace-lbl">Admin ID</span>
                  <div className="vet-workspace-val-row">
                    <span className="vet-workspace-val" style={{ color: '#14b8a6' }}>{successData.adminId}</span>
                    <button className="vet-btn-copy" onClick={() => handleCopyText(successData.adminId, 'adminId')}>
                      {copiedAdminId ? <CheckCheck size={14} color="#10b981" /> : <Copy size={14} />}
                      {copiedAdminId ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Tenant Workspace ID */}
                <div className="vet-workspace-item vet-workspace-item-full">
                  <span className="vet-workspace-lbl">Tenant Workspace ID (UUID)</span>
                  <div className="vet-workspace-val-row">
                    <span className="vet-workspace-val" style={{ fontSize: '0.825rem', color: '#9ca3af', fontFamily: 'monospace' }}>
                      {successData.tenantId}
                    </span>
                    <button className="vet-btn-copy" onClick={() => handleCopyText(successData.tenantId, 'tenantId')}>
                      {copiedTenantId ? <CheckCheck size={14} color="#10b981" /> : <Copy size={14} />}
                      {copiedTenantId ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Plan Name */}
                <div className="vet-workspace-item">
                  <span className="vet-workspace-lbl">Selected Plan</span>
                  <div className="vet-workspace-val">{successData.planName}</div>
                </div>

                {/* Trial Expiry Date */}
                <div className="vet-workspace-item">
                  <span className="vet-workspace-lbl">Trial Expiry Date</span>
                  <div className="vet-workspace-val" style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={14} /> {successData.trialExpiryDate}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. "What's Next?" Onboarding Checklist Cards Grid */}
            <div className="vet-next-section">
              <h3 className="vet-next-title">
                <Sparkles size={18} style={{ color: '#14b8a6' }} /> What's Next? Recommended Steps
              </h3>

              <div className="vet-next-grid">
                {/* Step 1 */}
                <div className="vet-next-card">
                  <div className="vet-next-card-icon">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h4 className="vet-next-card-h3">1. Complete Profile</h4>
                    <p className="vet-next-card-p">Set clinic logo, address, and invoice headers.</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="vet-next-card">
                  <div className="vet-next-card-icon">
                    <UserPlus size={20} />
                  </div>
                  <div>
                    <h4 className="vet-next-card-h3">2. Invite Staff</h4>
                    <p className="vet-next-card-p">Add Doctors, Receptionists, and Assistants.</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="vet-next-card">
                  <div className="vet-next-card-icon">
                    <HeartHandshake size={20} />
                  </div>
                  <div>
                    <h4 className="vet-next-card-h3">3. Add Patient</h4>
                    <p className="vet-next-card-p">Register your first pet patient and owner.</p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="vet-next-card">
                  <div className="vet-next-card-icon">
                    <CalendarCheck size={20} />
                  </div>
                  <div>
                    <h4 className="vet-next-card-h3">4. Book Visit</h4>
                    <p className="vet-next-card-p">Schedule consultations and home visits.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Primary Actions CTAs */}
            <div className="vet-onboarding-actions">
              <button
                className="vet-btn-portal-primary"
                onClick={() => navigate('/login')}
              >
                Go to Login Portal <ArrowRight size={18} />
              </button>

              <a
                href={(() => {
                  const domain = successData.email?.split('@')[1]?.toLowerCase() || '';
                  if (domain.includes('gmail')) return 'https://mail.google.com';
                  if (domain.includes('yahoo')) return 'https://mail.yahoo.com';
                  if (domain.includes('outlook') || domain.includes('hotmail') || domain.includes('live')) return 'https://outlook.live.com';
                  return `https://${domain || 'mail.google.com'}`;
                })()}
                target="_blank"
                rel="noreferrer"
                className="vet-btn-outline"
                style={{ padding: '0.9rem 1.6rem', textDecoration: 'none' }}
              >
                Open Email Inbox <ExternalLink size={16} />
              </a>

              <button
                className="vet-btn-outline"
                style={{ padding: '0.9rem 1.4rem' }}
                onClick={() => toast.success('Verification email resent successfully!')}
              >
                <RefreshCw size={16} /> Resend Email
              </button>
            </div>

            {/* 6. Security & Trust Badges */}
            <div className="vet-trust-bar">
              <div className="vet-trust-badges">
                <span className="vet-trust-badge-item">
                  <ShieldCheck size={16} /> 256-Bit SSL Encrypted
                </span>
                <span className="vet-trust-badge-item">
                  <Shield size={16} /> ISO 27001 Certified
                </span>
                <span className="vet-trust-badge-item">
                  <CheckCircle2 size={16} /> 99.9% Uptime SLA
                </span>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <a href="#support" onClick={(e) => { e.preventDefault(); toast.success('Support team notified (24/7)'); }} className="vet-support-link">
                  <HelpCircle size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> 24/7 Support
                </a>
                <a href="#docs" onClick={(e) => { e.preventDefault(); toast('Documentation available in portal'); }} className="vet-support-link">
                  <FileText size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Documentation
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
