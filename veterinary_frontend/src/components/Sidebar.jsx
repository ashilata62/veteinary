import React from 'react';
import { 
  LayoutDashboard, CalendarDays, Users, Dog, FileHeart,
  CreditCard, Package, BarChart3, Settings, LogOut,
  UserCog, Bell, Pill, Microscope, ClipboardPen, Clock, ClipboardList, Mail,
  ChevronRight, ChevronLeft, Map, CheckCircle2, UserCircle, Car, Headphones
} from 'lucide-react';
import './Sidebar.css';

export default function Sidebar({ 
  currentTab, setCurrentTab,
  sidebarOpen, setSidebarOpen,
  currentRole, setCurrentRole,
  onLogout,
  notifications
}) {
  const menuItems = [
    { id: 'dashboard',    label: 'Dashboard',             icon: LayoutDashboard, roles: ['Admin','Manager','Doctor','Receptionist','Vet Assistant'] },
    { id: 'appointments', label: currentRole === 'Doctor' || currentRole === 'Vet Assistant' ? 'My Appointments' : 'Appointments', icon: CalendarDays, roles: ['Admin','Manager','Doctor','Receptionist', 'Vet Assistant'] },
    { id: 'home-visits',  label: currentRole === 'Doctor' ? 'Home Visits' : 'Home Visit Appointments', icon: Map,  roles: ['Admin','Manager','Receptionist','Doctor', 'Vet Assistant'] },
    { id: 'owners',       label: 'Pet Owners',            icon: Users,           roles: ['Admin','Manager','Receptionist'] },
    { id: 'pets',         label: currentRole === 'Doctor' || currentRole === 'Vet Assistant' ? 'Patients' : 'Pets', icon: Dog, roles: ['Admin','Manager','Doctor','Receptionist', 'Vet Assistant'] },
    { id: 'medical',      label: 'Medical Records',       icon: FileHeart,       roles: ['Admin','Manager','Doctor','Vet Assistant'] },
    { id: 'treatment',    label: 'Treatment Notes',       icon: ClipboardPen,    roles: ['Doctor'] },
    { id: 'assistance-tasks', label: 'Assistance Tasks',  icon: CheckCircle2,    roles: ['Vet Assistant'] },
    { id: 'prescriptions',label: 'Prescriptions',         icon: Pill,            roles: ['Doctor'] },
    { id: 'my-revenue',   label: 'My Revenue',            icon: BarChart3,       roles: ['Doctor'] },
    { id: 'billing',      label: 'Billing & POS',         icon: CreditCard,      roles: ['Admin','Manager','Receptionist','Doctor'] },
    { id: 'inventory',    label: 'Inventory',             icon: Package,         roles: ['Admin','Manager','Receptionist'] },
    { id: 'reminders',    label: 'Email Reminders',       icon: Mail,            roles: ['Admin','Manager','Receptionist'] },
    { id: 'staff',        label: 'Staff Management',      icon: UserCog,         roles: ['Admin'] },
    { id: 'attendance',   label: 'Attendance',            icon: Clock,           roles: ['Admin','Manager'] },
    { id: 'reports',      label: 'Reports & Analytics',   icon: BarChart3,       roles: ['Admin','Manager'] },
    { id: 'settings',     label: currentRole !== 'Admin' ? 'Profile Settings' : 'Settings', icon: Settings, roles: ['Admin', 'Manager', 'Doctor', 'Receptionist', 'Vet Assistant'] },
    { id: 'support',      label: 'Support',               icon: Headphones,      roles: ['Admin'] },
  ];

  const unreadCount = notifications ? notifications.filter(n => !n.read).length : 0;
  const filteredItems = menuItems.filter(item => item.roles.includes(currentRole));

  const staffName = {
    Admin: 'Diana Prince',
    Manager: 'Bruce Wayne',
    Doctor: 'Dr. Sarah Connor',
    Receptionist: 'Barry Allen',
    'Vet Assistant': 'Kara Danvers'
  }[currentRole] || currentRole;

  const isActive = (id) => currentTab === id || (id === 'medical' && (currentTab === 'reports-uploads' || currentTab === 'prescriptions'));

  // Custom multi-color logic based on item id to mimic the screenshot
  const getIconColor = (id, active) => {
    if (active) return '#2dd4bf'; // Active is always teal
    
    // Assign some colorful defaults mimicking the screenshot
    const colors = {
      'dashboard': '#f59e0b',
      'appointments': '#3b82f6',
      'home-visits': '#ef4444',
      'owners': '#a855f7',
      'pets': '#ec4899',
      'medical': '#ef4444',
      'treatment': '#f59e0b',
      'assistance-tasks': '#10b981',
      'prescriptions': '#3b82f6',
      'billing': '#8b5cf6',
      'inventory': '#ef4444',
      'staff': '#a855f7',
      'reports': '#10b981',
      'settings': '#94a3b8',
      'support': '#f97316'
    };
    return colors[id] || '#94a3b8';
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside 
        className="sidebar-premium"
        style={{ width: sidebarOpen ? '280px' : '80px' }}
      >
        <div className="sidebar-brand-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
            {/* KT Image Logo */}
            <img 
              src="/kt-logo.png" 
              alt="KT Logo" 
              style={{
                width: '40px',
                height: 'auto',
                flexShrink: 0,
                objectFit: 'contain'
              }}
            />

            {sidebarOpen && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 600, color: '#f8fafc', whiteSpace: 'nowrap' }}>
                  VetCare <span style={{ color: '#2dd4bf' }}>Pro</span>
                </span>
                <span style={{ fontSize: '0.65rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                  Clinic Management System
                </span>
              </div>
            )}
          </div>

          <button 
            className="sidebar-collapse-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>
        </div>

        <nav className="sidebar-nav-menu">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.id);
            return (
              <button 
                key={item.id}
                className={`sidebar-menu-btn ${active ? 'active' : ''}`}
                onClick={() => { setCurrentTab(item.id); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                title={item.label}
              >
                <div className="sidebar-menu-icon" style={{ color: getIconColor(item.id, active) }}>
                  <Icon size={20} />
                </div>
                {sidebarOpen && (
                  <>
                    <span className="sidebar-menu-label">{item.label}</span>
                    <ChevronRight size={16} className="chevron" />
                  </>
                )}
              </button>
            );
          })}

          <button 
            className={`sidebar-menu-btn ${isActive('notifications') ? 'active' : ''}`}
            onClick={() => { setCurrentTab('notifications'); if (window.innerWidth < 1024) setSidebarOpen(false); }}
            title="Notifications"
          >
            <div className="sidebar-menu-icon" style={{ position: 'relative', color: getIconColor('notifications', isActive('notifications')) }}>
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </div>
            {sidebarOpen && (
              <>
                <span className="sidebar-menu-label">Notifications</span>
                <ChevronRight size={16} className="chevron" />
              </>
            )}
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user-avatar">
            <UserCircle size={24} color="#94a3b8" />
            <div className="online-dot"></div>
          </div>
          {sidebarOpen && (
            <>
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">{staffName}</div>
                <div className="sidebar-user-role">{currentRole}</div>
              </div>
              <button onClick={onLogout} className="logout-btn">
                <LogOut size={16} />
              </button>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
