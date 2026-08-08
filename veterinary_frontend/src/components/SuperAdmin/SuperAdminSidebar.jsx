import React from 'react';
import { 
  LayoutDashboard, Users, Tag, CreditCard, 
  Settings, Ticket, LogOut
} from 'lucide-react';
import './SuperAdmin.css';

export default function SuperAdminSidebar({ 
  currentTab, setCurrentTab,
  sidebarOpen, setSidebarOpen,
  onLogout
}) {

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admins',    label: 'Admins',    icon: Users },
    { id: 'plans',     label: 'Plans & Pricing', icon: Tag },
    { id: 'payments',  label: 'Payments',  icon: CreditCard },
    { id: 'settings',  label: 'Setting',   icon: Settings },
    { id: 'tickets',   label: 'Support Tickets', icon: Ticket },
  ];

  return (
    <>
      {sidebarOpen && (
        <div
          className="sa-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}


      <aside className={`sa-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <nav className="sa-sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = currentTab === item.id;
            return (
              <button 
                key={item.id}
                className={`sa-nav-item ${active ? 'active' : ''}`}
                onClick={() => { 
                  setCurrentTab(item.id); 
                  if (window.innerWidth < 1024) setSidebarOpen(false); 
                }}
                title={item.label}
              >
                <Icon size={18} className="sa-nav-icon" />
                {sidebarOpen && <span className="sa-nav-label">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {onLogout && (
          <div className="sa-sidebar-footer">
            <button onClick={onLogout} className="sa-logout-btn" title="Logout">
              <LogOut size={18} />
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
