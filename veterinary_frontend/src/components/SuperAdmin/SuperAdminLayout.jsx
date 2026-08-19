import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, User, Settings, LogOut, MessageSquare, X, CheckCircle } from 'lucide-react';
import SuperAdminSidebar from './SuperAdminSidebar';
import SuperAdminDashboard from './SuperAdminDashboard';
import ClinicManagement from './ClinicManagement';
import SuperAdminPayments from './SuperAdminPayments';
import SuperAdminTickets from './SuperAdminTickets';
import SuperAdminSettings from './SuperAdminSettings';
import './SuperAdmin.css';

export default function SuperAdminLayout({ setIsSuperAdmin }) {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Password Form State
  const [passForm, setPassForm] = useState({ current: '', newPass: '', confirm: '' });

  const navigate = useNavigate();

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('sa_token');
    localStorage.removeItem('sa_user');
    setIsSuperAdmin(false);
    navigate('/super-admin/login', { replace: true });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if(passForm.newPass !== passForm.confirm) {
      alert("New passwords do not match!");
      return;
    }
    // API Call goes here...
    setToastMessage('Password updated successfully!');
    setTimeout(() => setToastMessage(''), 3000);
    setShowProfileModal(false);
    setPassForm({ current: '', newPass: '', confirm: '' });
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard': return <SuperAdminDashboard />;
      case 'admins': return <ClinicManagement />;
      case 'payments': return <SuperAdminPayments />;
      case 'settings': return <SuperAdminSettings />;
      case 'tickets': return <SuperAdminTickets />;
      default: return <SuperAdminDashboard />;
    }
  };

  return (
    <div className="sa-app-root">
      {/* Top Navbar */}
      <header className="sa-topbar">
        <div className="sa-topbar-left">
          <button 
            className="sa-hamburger-btn" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Sidebar"
          >
            <Menu size={20} />
          </button>
          
          <div className="sa-brand-container">
            <img 
              src="/kt-logo.png" 
              alt="PetCare Logo" 
              className="sa-brand-logo" 
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="sa-brand-text">
              <span className="sa-brand-title">VETERINARY</span>
              <span className="sa-brand-highlight">MANAGEMENT</span>
            </div>
          </div>
        </div>

        <div className="sa-topbar-right">
          
          {/* Notifications */}
          <div className="sa-topbar-dropdown" ref={notifRef}>
            <button 
              className="sa-bell-btn" 
              title="Notifications"
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            >
              <Bell size={18} />
              <span className="sa-bell-badge">3</span>
            </button>
            
            {showNotifDropdown && (
              <div className="sa-dropdown-menu">
                <div className="sa-dropdown-header">Notifications (3)</div>
                <div className="sa-dropdown-item" onClick={() => { setCurrentTab('tickets'); setShowNotifDropdown(false); }}>
                  <MessageSquare size={14} /> New support ticket from Paws Clinic
                </div>
                <div className="sa-dropdown-item" onClick={() => { setCurrentTab('payments'); setShowNotifDropdown(false); }}>
                  <Bell size={14} /> Payment failed for City Vet
                </div>
                <div className="sa-dropdown-item" onClick={() => { setCurrentTab('admins'); setShowNotifDropdown(false); }}>
                  <User size={14} /> New clinic registration
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="sa-topbar-dropdown" ref={profileRef}>
            <div 
              className="sa-profile-widget" 
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              style={{ cursor: 'pointer' }}
            >
              <div className="sa-profile-avatar">
                <span>SA</span>
              </div>
              <div className="sa-profile-text">
                <span className="sa-profile-name">Superadmin</span>
                <span className="sa-profile-role">Super Admin</span>
              </div>
            </div>

            {showProfileDropdown && (
              <div className="sa-dropdown-menu">
                <div className="sa-dropdown-header">My Account</div>
                <button className="sa-dropdown-item" onClick={() => { setShowProfileModal(true); setShowProfileDropdown(false); }}>
                  <User size={15} /> Profile &amp; Password
                </button>
                <button className="sa-dropdown-item" onClick={() => { setCurrentTab('settings'); setShowProfileDropdown(false); }}>
                  <Settings size={15} /> Settings
                </button>
                <div className="sa-dropdown-divider"></div>
                <button className="sa-dropdown-item danger" onClick={handleLogout}>
                  <LogOut size={15} /> Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Main Body Layout */}
      <div className="sa-body-wrapper">
        <SuperAdminSidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onLogout={handleLogout}
        />

        <main className={`sa-main-body ${sidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
          {renderContent()}
        </main>
      </div>

      {/* Global Toast */}
      {toastMessage && (
        <div className="sa-toast">
          <CheckCircle size={16} color="#0d9488" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Profile & Password Modal */}
      {showProfileModal && (
        <div className="sa-modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="sa-modal-content" onClick={e => e.stopPropagation()}>
            <div className="sa-modal-header">
              <h2 className="sa-modal-title">Profile &amp; Security</h2>
              <button className="sa-modal-close" onClick={() => setShowProfileModal(false)}><X size={20} /></button>
            </div>
            <div className="sa-modal-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                <div className="sa-profile-avatar" style={{ width: '48px', height: '48px', fontSize: '1.2rem' }}>SA</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0f172a' }}>Superadmin User</div>
                  <div style={{ color: '#64748b', fontSize: '0.85rem' }}>superadmin@vetcarepro.com</div>
                </div>
              </div>
              
              <form id="sa-password-form" onSubmit={handlePasswordSubmit} className="sa-form-group">
                <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', margin: '0 0 0.5rem 0' }}>Change Password</h3>
                <div style={{ marginBottom: '0.75rem' }}>
                  <label className="sa-label">Current Password</label>
                  <input type="password" required className="sa-input" value={passForm.current} onChange={e => setPassForm({...passForm, current: e.target.value})} placeholder="Enter current password" />
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <label className="sa-label">New Password</label>
                  <input type="password" required className="sa-input" value={passForm.newPass} onChange={e => setPassForm({...passForm, newPass: e.target.value})} placeholder="Enter new password" />
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <label className="sa-label">Confirm New Password</label>
                  <input type="password" required className="sa-input" value={passForm.confirm} onChange={e => setPassForm({...passForm, confirm: e.target.value})} placeholder="Confirm new password" />
                </div>
              </form>
            </div>
            <div className="sa-modal-footer">
              <button className="sa-btn sa-btn-outline" onClick={() => setShowProfileModal(false)}>Cancel</button>
              <button type="submit" form="sa-password-form" className="sa-btn sa-btn-primary">Update Password</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
