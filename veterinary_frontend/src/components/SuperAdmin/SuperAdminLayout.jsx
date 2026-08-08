import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell } from 'lucide-react';
import SuperAdminSidebar from './SuperAdminSidebar';
import SuperAdminDashboard from './SuperAdminDashboard';
import ClinicManagement from './ClinicManagement';
import SuperAdminPlans from './SuperAdminPlans';
import SuperAdminPayments from './SuperAdminPayments';
import SuperAdminTickets from './SuperAdminTickets';
import SuperAdminSettings from './SuperAdminSettings';
import './SuperAdmin.css';

export default function SuperAdminLayout({ setIsSuperAdmin }) {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024);
  const navigate = useNavigate();

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

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard': return <SuperAdminDashboard />;
      case 'admins': return <ClinicManagement />;
      case 'plans': return <SuperAdminPlans />;
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
              alt="VetCare Logo" 
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
          <button className="sa-bell-btn" title="Notifications">
            <Bell size={18} />
            <span className="sa-bell-badge">3</span>
          </button>

          <div className="sa-profile-widget">
            <div className="sa-profile-avatar">
              <span>SA</span>
            </div>
            <div className="sa-profile-text">
              <span className="sa-profile-name">Superadmin</span>
              <span className="sa-profile-role">Super Admin</span>
            </div>
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
    </div>
  );
}
