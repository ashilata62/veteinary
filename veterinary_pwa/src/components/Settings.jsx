import { apiFetch } from '../utils/api';
import React, { useState, useEffect } from 'react';
import { Settings, ShieldCheck, Heart, Palette, Save, Bell, Mail, User, Eye, EyeOff, CheckCircle2, Database, Cloud, Download, HardDrive, Server, RefreshCw, FileCode, CreditCard, FileText, ExternalLink, Calendar, Receipt, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';
import { CLINIC_SETTINGS } from '../data/mockData';
export default function SettingsPage({ currentRole }) {
  const [activeTab, setActiveTab] = useState('profile');

  const [clinicName, setClinicName] = useState(CLINIC_SETTINGS.name);
  const [email, setEmail] = useState(CLINIC_SETTINGS.email);
  const [phone, setPhone] = useState(CLINIC_SETTINGS.phone);
  const [address, setAddress] = useState(CLINIC_SETTINGS.address);
  const [themeColor, setThemeColor] = useState(CLINIC_SETTINGS.primaryThemeColor);
  const [logo, setLogo] = useState(CLINIC_SETTINGS.logo);
  const [autoEmail, setAutoEmail] = useState(true);
  const [reminderTime, setReminderTime] = useState('24h');

  // Database Backup State
  const [backupLoading, setBackupLoading] = useState(false);
  const [backupHistory, setBackupHistory] = useState([]);
  const [backupSuccessInfo, setBackupSuccessInfo] = useState(null);

  // Cloud Storage Settings State
  const [storageProvider, setStorageProvider] = useState('local');
  const [s3Bucket, setS3Bucket] = useState('');
  const [s3Region, setS3Region] = useState('us-east-1');
  const [s3AccessKey, setS3AccessKey] = useState('');
  const [s3SecretKey, setS3SecretKey] = useState('');
  const [s3Endpoint, setS3Endpoint] = useState('');
  const [storageLoading, setStorageLoading] = useState(false);

  // Subscription & Billing State
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [invoicesHistory, setInvoicesHistory] = useState([]);
  const [plansList, setPlansList] = useState([]);
  const [billingLoading, setBillingLoading] = useState(false);

  // Personal Profile State
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileAddress, setProfileAddress] = useState('Colombo, Sri Lanka'); // Address not in DB schema
  const [staffId, setStaffId] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [successModal, setSuccessModal] = useState({ isOpen: false, message: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const response = await apiFetch('http://localhost:5000/api/v1/users/profile');
        const data = await response.json();
        if (data.status === 'success') {
          setProfileName(data.data.name || '');
          setProfileEmail(data.data.email || '');
          setProfilePhone(data.data.phone || '');
          setStaffId(data.data.id || '');
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
      }
    };

    const fetchClinicSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const response = await apiFetch('http://localhost:5000/api/v1/settings');
        const data = await response.json();
        if (data.status === 'success' && data.data) {
          setClinicName(data.data.name || '');
          setEmail(data.data.email || '');
          setPhone(data.data.phone || '');
          setAddress(data.data.address || '');
          setThemeColor(data.data.primaryThemeColor || '#14b8a6');
          setLogo(data.data.logo || '');
          setAutoEmail(data.data.autoEmail === 1 || data.data.autoEmail === true);
          setReminderTime(data.data.reminderTime || '24h');
        }
      } catch (err) {
        console.error('Failed to fetch clinic settings', err);
      }
    };

    const fetchBackupHistory = async () => {
      try {
        const response = await apiFetch('/api/v1/system/backup/history');
        const data = await response.json();
        if (data.status === 'success') {
          setBackupHistory(data.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch backup history', err);
      }
    };

    const fetchStorageSettings = async () => {
      try {
        const response = await apiFetch('/api/v1/system/storage/settings');
        const data = await response.json();
        if (data.status === 'success' && data.data) {
          setStorageProvider(data.data.storage_provider || 'local');
          setS3Bucket(data.data.s3_bucket_name || '');
          setS3Region(data.data.s3_region || 'us-east-1');
          setS3AccessKey(data.data.s3_access_key || '');
          setS3Endpoint(data.data.s3_endpoint || '');
        }
      } catch (err) {
        console.error('Failed to fetch storage settings', err);
      }
    };

    const fetchBillingData = async () => {
      try {
        setBillingLoading(true);
        const [subRes, plansRes, invRes] = await Promise.all([
          apiFetch('/api/subscriptions/current').catch(() => null),
          apiFetch('/api/subscriptions/plans').catch(() => null),
          apiFetch('/api/payment/my-history').catch(() => null)
        ]);

        if (subRes && subRes.ok) {
          const subData = await subRes.json();
          if (subData.status === 'success') setSubscriptionInfo(subData.data);
        }

        if (plansRes && plansRes.ok) {
          const plansData = await plansRes.json();
          if (plansData.status === 'success') setPlansList(plansData.data);
        }

        if (invRes && invRes.ok) {
          const invData = await invRes.json();
          if (invData.status === 'success') setInvoicesHistory(invData.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch billing data', err);
      } finally {
        setBillingLoading(false);
      }
    };

    fetchProfile();
    fetchClinicSettings();
    fetchBackupHistory();
    fetchStorageSettings();
    fetchBillingData();
  }, []);

  const handleDownloadBackup = async () => {
    try {
      setBackupLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch('/api/v1/system/backup/download', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error('Failed to generate database dump');
      }

      const blob = await res.blob();
      const contentDisp = res.headers.get('Content-Disposition');
      let filename = 'petcare-database-backup.sql';
      if (contentDisp && contentDisp.includes('filename=')) {
        filename = contentDisp.split('filename=')[1].replace(/["']/g, '').trim();
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccessModal({
        isOpen: true,
        message: `Database backup (${filename}) successfully generated and downloaded to your computer!`
      });

      // Refresh backup list
      const histRes = await apiFetch('/api/v1/system/backup/history');
      const histData = await histRes.json();
      if (histData.status === 'success') {
        setBackupHistory(histData.data || []);
      }
    } catch (err) {
      console.error(err);
      alert('Error generating database backup: ' + err.message);
    } finally {
      setBackupLoading(false);
    }
  };

  const handleStorageSave = async (e) => {
    if (e) e.preventDefault();
    try {
      setStorageLoading(true);
      const res = await apiFetch('/api/v1/system/storage/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storage_provider: storageProvider,
          s3_bucket_name: s3Bucket,
          s3_region: s3Region,
          s3_access_key: s3AccessKey,
          s3_secret_key: s3SecretKey,
          s3_endpoint: s3Endpoint
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setSuccessModal({
          isOpen: true,
          message: 'Storage configuration saved successfully! Cloud storage is now active.'
        });
        if (data.data) {
          setS3AccessKey(data.data.s3_access_key || '');
          setS3SecretKey('');
        }
      } else {
        alert(data.message || 'Failed to update storage settings');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating storage settings');
    } finally {
      setStorageLoading(false);
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await apiFetch('http://localhost:5000/api/v1/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: clinicName,
          email,
          phone,
          address,
          primaryThemeColor: themeColor,
          logo,
          autoEmail,
          reminderTime
        })
      });
      const data = await response.json();
      if (response.ok && data.status === 'success') {
        setSuccessModal({ isOpen: true, message: 'Clinic system settings updated successfully in database!' });
      } else {
        alert(data.message || 'Failed to update clinic settings');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating clinic settings');
    }
  };

  const handleBrandingSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await apiFetch('http://localhost:5000/api/v1/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          primaryThemeColor: themeColor,
          logo
        })
      });
      const data = await response.json();
      if (response.ok && data.status === 'success') {
        setSuccessModal({ isOpen: true, message: 'Visual branding variables updated in database successfully!' });
      } else {
        alert(data.message || 'Failed to update visual branding');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating visual branding');
    }
  };

  const handleNotificationSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await apiFetch('http://localhost:5000/api/v1/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          autoEmail,
          reminderTime
        })
      });
      const data = await response.json();
      if (response.ok && data.status === 'success') {
        setSuccessModal({ isOpen: true, message: 'Notification preferences saved in database successfully!' });
      } else {
        alert(data.message || 'Failed to update notification preferences');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating notification preferences');
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await apiFetch('http://localhost:5000/api/v1/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          fullName: profileName,
          email: profileEmail,
          phone: profilePhone
        })
      });
      const data = await response.json();
      if (data.status === 'success') {
        setSuccessModal({ isOpen: true, message: 'Personal profile updated successfully!' });
        
        // Update user session in localStorage to keep Navbar in sync
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userObj = JSON.parse(storedUser);
          userObj.name = profileName;
          userObj.email = profileEmail;
          userObj.phone = profilePhone;
          localStorage.setItem('user', JSON.stringify(userObj));
        }
      } else {
        alert(data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating profile');
    }
  };

  const handlePasswordSave = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await apiFetch('http://localhost:5000/api/v1/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          fullName: profileName,
          email: profileEmail,
          phone: profilePhone,
          password: newPassword
        })
      });
      const data = await response.json();
      if (data.status === 'success') {
        setSuccessModal({ isOpen: true, message: 'Password successfully updated!' });
        
        // Update user session in localStorage to keep Navbar in sync
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userObj = JSON.parse(storedUser);
          userObj.name = profileName;
          userObj.email = profileEmail;
          userObj.phone = profilePhone;
          localStorage.setItem('user', JSON.stringify(userObj));
        }
        
        setIsChangingPassword(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        alert(data.message || 'Failed to update password');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating password');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Personal Profile', icon: User },
    { id: 'clinic', label: 'Hospital Information', icon: Settings },
    { id: 'billing', label: 'Subscription & Invoices', icon: CreditCard },
    { id: 'branding', label: 'Visual Branding & Themes', icon: Palette },
    { id: 'notifications', label: 'Notification Preferences', icon: Bell },
    { id: 'backup', label: 'Database Backup', icon: Database },
    { id: 'storage', label: 'Storage & S3 Cloud', icon: Cloud }
  ];

  const renderProfileForm = () => (
    <div className="responsive-grid">
      
      {/* Personal Profile Details Card */}
      <div className="card animate-fade-in" style={{ margin: 0, padding: '1.25rem' }}>
        <h3 className="font-bold text-base mb-4" style={{ display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
          <User size={18} className="text-secondary" style={{ color: 'var(--primary-teal)' }} />
          Personal Profile
        </h3>
        <form onSubmit={handleProfileSave}>
          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <label className="form-label" style={{ marginBottom: '0.25rem', fontSize: '0.8rem' }}>Full Name</label>
            <input type="text" className="form-control" style={{ padding: '0.4rem 0.75rem' }} value={profileName} onChange={(e) => setProfileName(e.target.value)} required />
          </div>
          <div className="form-row" style={{ gap: '0.75rem' }}>
            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label className="form-label" style={{ marginBottom: '0.25rem', fontSize: '0.8rem' }}>Staff Role</label>
              <input type="text" className="form-control" style={{ padding: '0.4rem 0.75rem', backgroundColor: '#f1f5f9' }} value={currentRole} readOnly />
            </div>
            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label className="form-label" style={{ marginBottom: '0.25rem', fontSize: '0.8rem' }}>Staff ID</label>
              <input type="text" className="form-control" style={{ padding: '0.4rem 0.75rem', backgroundColor: '#f1f5f9' }} value={staffId} readOnly />
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <label className="form-label" style={{ marginBottom: '0.25rem', fontSize: '0.8rem' }}>Email Address</label>
            <input type="email" className="form-control" style={{ padding: '0.4rem 0.75rem' }} value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} required />
          </div>
          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <label className="form-label" style={{ marginBottom: '0.25rem', fontSize: '0.8rem' }}>Mobile Number</label>
            <input type="text" className="form-control" style={{ padding: '0.4rem 0.75rem' }} value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} required />
          </div>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label" style={{ marginBottom: '0.25rem', fontSize: '0.8rem' }}>Home Address</label>
            <input type="text" className="form-control" style={{ padding: '0.4rem 0.75rem' }} value={profileAddress} onChange={(e) => setProfileAddress(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', display: 'flex', gap: '6px', padding: '0.5rem' }}>
            <Save size={16} /> Save Profile Updates
          </button>
        </form>
      </div>

      {/* Account Security Card */}
      <div className="card animate-fade-in" style={{ margin: 0, padding: '1.25rem' }}>
        <h3 className="font-bold text-base mb-4" style={{ display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
          <ShieldCheck size={18} className="text-secondary" style={{ color: 'var(--primary-teal)' }} />
          Account Security
        </h3>
        
        {!isChangingPassword ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', backgroundColor: '#fafafa', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>Password</span>
              <span style={{ fontWeight: 600, letterSpacing: '2px', fontSize: '0.875rem' }}>••••••••</span>
            </div>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsChangingPassword(true)}>
              Change
            </button>
          </div>
        ) : (
          <div style={{ padding: '1rem', backgroundColor: '#fafafa', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ marginBottom: '0.25rem', fontSize: '0.8rem' }}>Current Password</label>
              <input type={showPassword ? "text" : "password"} className="form-control" style={{ padding: '0.4rem 0.75rem' }} value={currentPassword} onChange={(e)=>setCurrentPassword(e.target.value)} />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ marginBottom: '0.25rem', fontSize: '0.8rem' }}>New Password</label>
              <input type={showPassword ? "text" : "password"} className="form-control" style={{ padding: '0.4rem 0.75rem' }} value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ marginBottom: '0.25rem', fontSize: '0.8rem' }}>Confirm New Password</label>
              <input type={showPassword ? "text" : "password"} className="form-control" style={{ padding: '0.4rem 0.75rem' }} value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} />
                Show Passwords
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsChangingPassword(false)}>Cancel</button>
                <button type="button" className="btn btn-primary btn-sm" onClick={handlePasswordSave}>Save</button>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* Header Container */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {currentRole === 'Admin' ? 'Clinic Settings & System Configurations' : 'My Profile Settings'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            {currentRole === 'Admin' 
              ? 'Adjust hospital details, invoice receipts, branding theme variables, and clinic profiles.' 
              : 'Manage your personal account details and preferences.'}
          </p>
        </div>

        {/* Read-Only Email Banner (Top Right for Non-Admins) */}
        {currentRole !== 'Admin' && (
          <div className="animate-fade-in" style={{ padding: '0.75rem 1.25rem', backgroundColor: '#f0fdfa', borderRadius: 'var(--radius-md)', border: '1px solid #ccfbf1', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#ccfbf1', color: '#0f766e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShieldCheck size={18} />
            </div>
            <div>
              <p style={{ color: '#0f766e', fontWeight: 600, fontSize: '0.875rem', marginBottom: '2px', lineHeight: 1 }}>Email Automation Active</p>
              <p style={{ color: '#0f766e', fontSize: '0.75rem', margin: 0 }}>Reminders sent <strong>{reminderTime}</strong> before appointments.</p>
            </div>
          </div>
        )}
      </div>

      {currentRole === 'Admin' ? (
        <div className="settings-admin-layout">
          
          {/* Inner Sidebar Menu (Admin Only) */}
          <div className="settings-admin-sidebar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem',
                  backgroundColor: activeTab === tab.id ? 'var(--primary-teal)' : 'transparent',
                  color: activeTab === tab.id ? '#fff' : 'var(--text-secondary)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer', textAlign: 'left', fontWeight: activeTab === tab.id ? 600 : 500,
                  transition: 'all 0.2s ease',
                }}
              >
                <tab.icon size={18} style={{ color: activeTab === tab.id ? '#fff' : 'var(--text-muted)' }} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Area (Admin Only) */}
          <div style={{ flex: 1, minWidth: 0, width: '100%' }}>
            
            {/* PERSONAL PROFILE */}
            {activeTab === 'profile' && renderProfileForm()}

            {/* HOSPITAL INFORMATION */}
            {activeTab === 'clinic' && (
              <div className="card animate-fade-in" style={{ margin: 0 }}>
                <h3 className="font-bold text-lg mb-6" style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                  <Settings size={20} className="text-secondary" style={{ color: 'var(--primary-teal)' }} />
                  Hospital Information
                </h3>
                <form onSubmit={handleSave}>
                  <div className="form-group">
                    <label className="form-label">Clinic / Animal Hospital Name</label>
                    <input type="text" className="form-control" value={clinicName} onChange={(e) => setClinicName(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Contact Email Address</label>
                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Contact Phone Number</label>
                    <input type="text" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Clinic Complete Address</label>
                    <textarea className="form-control" rows="3" value={address} onChange={(e) => setAddress(e.target.value)} required />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%', display: 'flex', gap: '6px' }}>
                    <Save size={16} /> Save Clinic Profile
                  </button>
                </form>
              </div>
            )}

            {/* VISUAL BRANDING */}
            {activeTab === 'branding' && (
              <div className="card animate-fade-in" style={{ margin: 0 }}>
                <h3 className="font-bold text-lg mb-6" style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                  <Palette size={20} className="text-secondary" style={{ color: 'var(--primary-teal)' }} />
                  Visual Branding & Themes
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

                  {/* ── Theme Color ── */}
                  <div>
                    <label className="form-label" style={{ marginBottom: '0.75rem', display: 'block' }}>Primary UI Theme Color</label>
                    
                    {/* Preset swatches */}
                    <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                      {[
                        { color: '#14b8a6', name: 'PetCare Teal (Default)' },
                        { color: '#3b82f6', name: 'Ocean Blue' },
                        { color: '#8b5cf6', name: 'Royal Purple' },
                        { color: '#f59e0b', name: 'Amber Gold' },
                        { color: '#ef4444', name: 'Medical Red' },
                        { color: '#10b981', name: 'Emerald Green' },
                        { color: '#ec4899', name: 'Rose Pink' },
                        { color: '#0ea5e9', name: 'Sky Blue' },
                      ].map(preset => (
                        <button
                          key={preset.color}
                          type="button"
                          title={preset.name}
                          onClick={() => {
                            setThemeColor(preset.color);
                            document.documentElement.style.setProperty('--primary-teal', preset.color);
                          }}
                          style={{
                            width: '36px', height: '36px', borderRadius: '50%',
                            backgroundColor: preset.color, border: 'none',
                            cursor: 'pointer',
                            outline: themeColor === preset.color ? `3px solid ${preset.color}` : '3px solid transparent',
                            outlineOffset: '2px',
                            transition: 'transform 0.15s ease',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                          }}
                          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
                          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        />
                      ))}
                    </div>

                    {/* Custom color picker row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', backgroundColor: '#fafafa' }}>
                      <input
                        type="color"
                        value={themeColor}
                        onChange={(e) => {
                          setThemeColor(e.target.value);
                          document.documentElement.style.setProperty('--primary-teal', e.target.value);
                        }}
                        style={{ border: 'none', width: '48px', height: '48px', borderRadius: 'var(--radius-md)', cursor: 'pointer', padding: 0, background: 'none' }}
                        title="Pick a custom color"
                      />
                      <div>
                        <span className="font-bold text-sm" style={{ display: 'block' }}>{themeColor}</span>
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Custom Color — click to change</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setThemeColor('#14b8a6');
                          document.documentElement.style.setProperty('--primary-teal', '#14b8a6');
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ marginLeft: 'auto', whiteSpace: 'nowrap' }}
                      >
                        ↩ Reset to Default
                      </button>
                    </div>
                  </div>

                  {/* ── Clinic Logo ── */}
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                    <label className="form-label" style={{ marginBottom: '0.75rem', display: 'block' }}>Clinic Logo</label>
                    
                    {/* Current logo preview */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', padding: '0.75rem', border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)', backgroundColor: '#fafafa' }}>
                      <img
                        src={logo || 'https://placehold.co/60x60?text=Logo'}
                        alt="Clinic Logo"
                        style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-md)', objectFit: 'cover', border: '1px solid var(--border)' }}
                        onError={(e) => { e.target.src = 'https://placehold.co/60x60?text=Logo'; }}
                      />
                      <div>
                        <span className="font-bold text-sm" style={{ display: 'block' }}>Current Logo</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Used in headers & invoice receipts</span>
                      </div>
                    </div>

                    {/* Upload from device */}
                    <div>
                      <p className="text-sm font-semibold" style={{ marginBottom: '0.5rem' }}>Upload from Device</p>
                      <label
                        htmlFor="logoFileUpload"
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.75rem',
                          padding: '0.85rem 1.25rem', border: '2px dashed var(--primary-teal)',
                          borderRadius: 'var(--radius-md)', cursor: 'pointer',
                          backgroundColor: 'var(--primary-teal-light)', transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#ccfbf1'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--primary-teal-light)'}
                      >
                        <Palette size={20} style={{ color: 'var(--primary-teal)', flexShrink: 0 }} />
                        <div>
                          <span className="font-semibold text-sm" style={{ color: 'var(--primary-teal)', display: 'block' }}>Choose logo from your library</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>PNG, JPG, WEBP — recommended 200×200px</span>
                        </div>
                      </label>
                      <input
                        id="logoFileUpload"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = async (evt) => {
                            try {
                              const token = localStorage.getItem('token');
                              const res = await apiFetch('http://localhost:5000/api/v1/pets/upload-photo', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                body: JSON.stringify({ base64Data: evt.target.result, fileName: file.name })
                              });
                              const data = await res.json();
                              if (data.status === 'success') {
                                setLogo(data.data.url);
                                alert('Logo uploaded successfully! Click "Apply Branding" to save.');
                              } else {
                                alert('Upload failed: ' + (data.message || 'Unknown error'));
                              }
                            } catch (err) {
                              alert('Upload error: ' + err.message);
                            }
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </div>

                    {/* Or paste URL */}
                    <div style={{ marginTop: '1rem' }}>
                      <p className="text-sm font-semibold" style={{ marginBottom: '0.5rem' }}>Or paste an image URL</p>
                      <input
                        type="text"
                        className="form-control"
                        value={logo}
                        onChange={(e) => setLogo(e.target.value)}
                        placeholder="https://example.com/your-logo.png"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleBrandingSave}
                    className="btn btn-primary"
                    style={{ display: 'flex', gap: '6px' }}
                  >
                    <Save size={16} /> Apply Branding Settings
                  </button>
                </div>
              </div>
            )}

            {/* NOTIFICATION PREFERENCES */}
            {activeTab === 'notifications' && (
              <div className="card animate-fade-in" style={{ margin: 0 }}>
                <h3 className="font-bold text-lg mb-6" style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                  <Bell size={20} className="text-secondary" style={{ color: 'var(--primary-teal)' }} />
                  Notification Preferences
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem', backgroundColor: '#fafafa', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                    <input
                      type="checkbox"
                      id="autoEmailAdmin"
                      checked={autoEmail}
                      onChange={(e) => setAutoEmail(e.target.checked)}
                      style={{ marginTop: '4px', width: '18px', height: '18px', accentColor: 'var(--primary-teal)' }}
                    />
                    <div>
                      <label htmlFor="autoEmailAdmin" className="font-bold" style={{ cursor: 'pointer', display: 'block', marginBottom: '4px' }}>
                        Enable Automatic Appointment Reminders
                      </label>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        Automatically send an email to pet owners before their scheduled appointment.
                      </span>
                    </div>
                  </div>
                  {autoEmail && (
                    <div className="form-group" style={{ paddingLeft: '1rem', borderLeft: '2px solid var(--primary-teal)' }}>
                      <label className="form-label">Send Email Reminder</label>
                      <select
                        className="form-control"
                        value={reminderTime}
                        onChange={(e) => setReminderTime(e.target.value)}
                      >
                        <option value="12h">12 Hours before appointment</option>
                        <option value="24h">24 Hours before appointment</option>
                        <option value="48h">48 Hours before appointment</option>
                      </select>
                    </div>
                  )}
                  <button
                    onClick={handleNotificationSave}
                    className="btn btn-primary"
                    style={{ display: 'flex', gap: '6px' }}
                  >
                    <Mail size={16} /> Save Email Settings
                  </button>
                </div>
              </div>
            )}

            {/* DATABASE BACKUP & EXPORT */}
            {activeTab === 'backup' && (
              <div className="card animate-fade-in" style={{ margin: 0 }}>
                <h3 className="font-bold text-lg mb-6" style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                  <Database size={20} className="text-secondary" style={{ color: 'var(--primary-teal)' }} />
                  Database Backup & Recovery
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Backup Banner */}
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%)',
                    border: '1px solid rgba(20, 184, 166, 0.25)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        Instant Full SQL Database Backup
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Export complete clinic records (Pets, Appointments, Invoices, Staff, Medical Logs) in standard .sql format.
                      </p>
                    </div>

                    <button
                      onClick={handleDownloadBackup}
                      disabled={backupLoading}
                      className="btn btn-primary"
                      style={{
                        padding: '0.75rem 1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.9rem',
                        fontWeight: 700
                      }}
                    >
                      {backupLoading ? (
                        <>
                          <div className="animate-spin" style={{ width: 16, height: 16, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%' }} />
                          Generating SQL Dump...
                        </>
                      ) : (
                        <>
                          <Download size={18} /> Download SQL Backup (.sql)
                        </>
                      )}
                    </button>
                  </div>

                  {/* Auto-Backup Status Info */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Database Engine</span>
                      <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '4px 0 0 0' }}>MySQL 8.0</p>
                    </div>
                    <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Total Tables</span>
                      <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-teal)', margin: '4px 0 0 0' }}>29 System Tables</p>
                    </div>
                    <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Automated Daily Backups</span>
                      <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--success)', margin: '4px 0 0 0' }}>Active (02:00 AM UTC)</p>
                    </div>
                  </div>

                  {/* Backup History Table */}
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                      Recent Backup Logs
                    </h4>
                    {backupHistory.length === 0 ? (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No previous backup logs recorded.</p>
                    ) : (
                      <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '10px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                          <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                              <th style={{ padding: '0.65rem 1rem', color: 'var(--text-secondary)' }}>Filename</th>
                              <th style={{ padding: '0.65rem 1rem', color: 'var(--text-secondary)' }}>Size</th>
                              <th style={{ padding: '0.65rem 1rem', color: 'var(--text-secondary)' }}>Tables / Rows</th>
                              <th style={{ padding: '0.65rem 1rem', color: 'var(--text-secondary)' }}>Type</th>
                              <th style={{ padding: '0.65rem 1rem', color: 'var(--text-secondary)' }}>Status</th>
                              <th style={{ padding: '0.65rem 1rem', color: 'var(--text-secondary)' }}>Timestamp</th>
                            </tr>
                          </thead>
                          <tbody>
                            {backupHistory.map((b) => (
                              <tr key={b.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '0.65rem 1rem', fontWeight: 600 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <FileCode size={16} color="#14b8a6" />
                                    {b.filename}
                                  </div>
                                </td>
                                <td style={{ padding: '0.65rem 1rem' }}>{b.file_size_kb} KB</td>
                                <td style={{ padding: '0.65rem 1rem' }}>{b.tables_count} Tables / {b.total_rows} Rows</td>
                                <td style={{ padding: '0.65rem 1rem' }}>
                                  <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>{b.backup_type}</span>
                                </td>
                                <td style={{ padding: '0.65rem 1rem' }}>
                                  <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>{b.status}</span>
                                </td>
                                <td style={{ padding: '0.65rem 1rem', color: 'var(--text-muted)' }}>
                                  {new Date(b.created_at).toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STORAGE & AWS S3 CLOUD SETTINGS */}
            {activeTab === 'storage' && (
              <div className="card animate-fade-in" style={{ margin: 0 }}>
                <h3 className="font-bold text-lg mb-6" style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                  <Cloud size={20} className="text-secondary" style={{ color: 'var(--primary-teal)' }} />
                  Storage & Cloud S3 Settings
                </h3>

                <form onSubmit={handleStorageSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Provider Selection */}
                  <div>
                    <label className="form-label" style={{ fontWeight: 700, marginBottom: '0.6rem', display: 'block' }}>
                      Active Storage Provider
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div
                        onClick={() => setStorageProvider('local')}
                        style={{
                          padding: '1.25rem',
                          borderRadius: '12px',
                          border: storageProvider === 'local' ? '2px solid var(--primary-teal)' : '1px solid var(--border)',
                          backgroundColor: storageProvider === 'local' ? 'rgba(20, 184, 166, 0.05)' : '#fff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.75rem',
                          transition: 'all 0.2s'
                        }}
                      >
                        <HardDrive size={24} style={{ color: storageProvider === 'local' ? 'var(--primary-teal)' : 'var(--text-muted)' }} />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Local Server Storage</div>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Stores files in server /uploads directory. Free & default for single servers.</span>
                        </div>
                      </div>

                      <div
                        onClick={() => setStorageProvider('s3')}
                        style={{
                          padding: '1.25rem',
                          borderRadius: '12px',
                          border: storageProvider === 's3' ? '2px solid var(--primary-teal)' : '1px solid var(--border)',
                          backgroundColor: storageProvider === 's3' ? 'rgba(20, 184, 166, 0.05)' : '#fff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.75rem',
                          transition: 'all 0.2s'
                        }}
                      >
                        <Cloud size={24} style={{ color: storageProvider === 's3' ? 'var(--primary-teal)' : 'var(--text-muted)' }} />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Amazon S3 / Cloud Bucket</div>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Highly scalable & persistent cloud storage (Recommended for Railway/Render).</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* S3 Credentials Form (Visible when S3 selected) */}
                  {storageProvider === 's3' && (
                    <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                      <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        AWS S3 / Compatible Object Storage Credentials
                      </h4>

                      <div className="form-row">
                        <div className="form-group" style={{ flex: 1 }}>
                          <label className="form-label">S3 Bucket Name</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="my-petcare-assets"
                            value={s3Bucket}
                            onChange={(e) => setS3Bucket(e.target.value)}
                            required={storageProvider === 's3'}
                          />
                        </div>

                        <div className="form-group" style={{ flex: 1 }}>
                          <label className="form-label">AWS Region</label>
                          <select
                            className="form-control"
                            value={s3Region}
                            onChange={(e) => setS3Region(e.target.value)}
                          >
                            <option value="us-east-1">US East (N. Virginia)</option>
                            <option value="us-west-2">US West (Oregon)</option>
                            <option value="ap-south-1">Asia Pacific (Mumbai)</option>
                            <option value="me-central-1">Middle East (UAE)</option>
                            <option value="eu-west-1">Europe (Ireland)</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-row" style={{ marginTop: '0.75rem' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                          <label className="form-label">Access Key ID</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="AKIAIOSFODNN7EXAMPLE"
                            value={s3AccessKey}
                            onChange={(e) => setS3AccessKey(e.target.value)}
                            required={storageProvider === 's3'}
                          />
                        </div>

                        <div className="form-group" style={{ flex: 1 }}>
                          <label className="form-label">Secret Access Key</label>
                          <input
                            type="password"
                            className="form-control"
                            placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                            value={s3SecretKey}
                            onChange={(e) => setS3SecretKey(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-group" style={{ marginTop: '0.75rem' }}>
                        <label className="form-label">Custom Endpoint URL (Optional - For DigitalOcean Spaces / MinIO)</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="https://nyc3.digitaloceanspaces.com"
                          value={s3Endpoint}
                          onChange={(e) => setS3Endpoint(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={storageLoading}
                    className="btn btn-primary"
                    style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Save size={16} /> {storageLoading ? 'Saving...' : 'Save Storage Configuration'}
                  </button>
                </form>
              </div>
            )}

            {/* SUBSCRIPTION & INVOICES TAB */}
            {activeTab === 'billing' && (
              <div className="card animate-fade-in" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
                  <h3 className="font-bold text-lg" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                    <CreditCard size={20} style={{ color: 'var(--primary-teal)' }} />
                    Clinic Subscription & Tax Invoices
                  </h3>
                  <button
                    onClick={() => {
                      setBillingLoading(true);
                      Promise.all([
                        apiFetch('/api/subscriptions/current').then(r => r.json()).then(d => d.status === 'success' && setSubscriptionInfo(d.data)),
                        apiFetch('/api/payment/my-history').then(r => r.json()).then(d => d.status === 'success' && setInvoicesHistory(d.data || []))
                      ]).finally(() => setBillingLoading(false));
                    }}
                    style={{ background: 'none', border: 'none', color: 'var(--primary-teal)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}
                  >
                    <RefreshCw size={14} className={billingLoading ? 'spin' : ''} /> Refresh Status
                  </button>
                </div>

                {/* Current Subscription Card */}
                <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: '12px', padding: '1.5rem', color: '#ffffff', marginBottom: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: subscriptionInfo?.isExpired ? '#ef4444' : '#10b981', color: '#fff', fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: '9999px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                        <Sparkles size={12} /> {subscriptionInfo?.subStatus || 'Active Plan'}
                      </div>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.25rem 0' }}>{subscriptionInfo?.planName || 'Enterprise Cloud SaaS'}</h2>
                      <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
                        {subscriptionInfo?.endDate ? `Valid until ${new Date(subscriptionInfo.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}` : 'Unlimited 24/7 Access'}
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2dd4bf' }}>
                        {subscriptionInfo?.daysLeft !== undefined ? `${subscriptionInfo.daysLeft} Days` : 'Active'}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Remaining in billing cycle</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ marginTop: '1.25rem' }}>
                    <div style={{ height: '6px', width: '100%', background: 'rgba(255,255,255,0.15)', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${Math.min(100, Math.max(5, ((subscriptionInfo?.daysLeft || 30) / 30) * 100))}%`,
                          background: 'linear-gradient(90deg, #2dd4bf, #14b8a6)',
                          borderRadius: '9999px',
                          transition: 'width 0.4s ease'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                    <a
                      href="/checkout/plan-pro"
                      style={{
                        background: 'linear-gradient(135deg, #0d9488, #0f766e)',
                        color: '#ffffff',
                        padding: '0.5rem 1.25rem',
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      Upgrade / Renew Plan <ArrowRight size={14} />
                    </a>
                  </div>
                </div>

                {/* Invoices & Transaction History Table */}
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Receipt size={16} style={{ color: 'var(--primary-teal)' }} />
                  Billing & Tax Invoice Receipts
                </h4>

                {invoicesHistory.length === 0 ? (
                  <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '1.5rem', textAlign: 'center', color: '#64748b' }}>
                    <Receipt size={32} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>No payment invoices found for this clinic yet.</p>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                          <th style={{ padding: '10px 14px' }}>Invoice No</th>
                          <th style={{ padding: '10px 14px' }}>Date</th>
                          <th style={{ padding: '10px 14px' }}>Plan</th>
                          <th style={{ padding: '10px 14px' }}>Amount</th>
                          <th style={{ padding: '10px 14px' }}>Gateway</th>
                          <th style={{ padding: '10px 14px' }}>Status</th>
                          <th style={{ padding: '10px 14px', textAlign: 'right' }}>Tax Receipt</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoicesHistory.map((inv) => (
                          <tr key={inv.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontWeight: 600, color: '#0f766e' }}>
                              {inv.invoice_number || inv.id?.substring(0, 12)}
                            </td>
                            <td style={{ padding: '10px 14px', color: '#475569' }}>
                              {inv.payment_date ? new Date(inv.payment_date).toLocaleDateString('en-IN') : 'N/A'}
                            </td>
                            <td style={{ padding: '10px 14px', fontWeight: 600 }}>{inv.plan_name || 'Standard Plan'}</td>
                            <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0f172a' }}>
                              {inv.currency === 'USD' ? '$' : '₹'}{parseFloat(inv.amount).toFixed(2)}
                            </td>
                            <td style={{ padding: '10px 14px', color: '#64748b' }}>{inv.payment_method || 'Razorpay'}</td>
                            <td style={{ padding: '10px 14px' }}>
                              <span style={{
                                display: 'inline-block',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                background: inv.status === 'Successful' ? '#dcfce7' : '#fee2e2',
                                color: inv.status === 'Successful' ? '#15803d' : '#b91c1c'
                              }}>
                                {inv.status}
                              </span>
                            </td>
                            <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                              <a
                                href={`http://localhost:5002/api/payment/invoice/${inv.invoice_number || inv.id}/html`}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  background: '#f1f5f9',
                                  border: '1px solid #cbd5e1',
                                  color: '#0f766e',
                                  padding: '4px 10px',
                                  borderRadius: '6px',
                                  fontSize: '0.78rem',
                                  fontWeight: 600,
                                  textDecoration: 'none'
                                }}
                              >
                                <FileText size={13} /> View Invoice
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      ) : (
        /* Non-Admin Layout (Profile Form Only) */
        <div style={{ width: '100%' }}>
          {renderProfileForm()}
        </div>
      )}

      {/* Professional Success Modal */}
      {successModal.isOpen && (
        <div className="modal-overlay" onClick={() => setSuccessModal({ isOpen: false, message: '' })}>
          <div className="card animate-fade-in modal-content" style={{ maxWidth: '400px', width: '100%', textAlign: 'center', padding: '2rem' }} onClick={e => e.stopPropagation()}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
              <CheckCircle2 size={32} />
            </div>
            <h3 className="font-bold text-xl mb-3">Success!</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>{successModal.message}</p>
            <button 
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.75rem' }}
              onClick={() => setSuccessModal({ isOpen: false, message: '' })}
            >
              Okay, Continue
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
