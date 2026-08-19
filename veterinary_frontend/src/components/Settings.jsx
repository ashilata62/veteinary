import { apiFetch } from '../utils/api';
import React, { useState, useEffect } from 'react';
import { Settings, ShieldCheck, Heart, Palette, Save, Bell, Mail, User, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
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

    fetchProfile();
    fetchClinicSettings();
  }, []);

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
    { id: 'branding', label: 'Visual Branding & Themes', icon: Palette },
    { id: 'notifications', label: 'Notification Preferences', icon: Bell }
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
