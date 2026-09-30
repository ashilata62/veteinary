import React from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Dog, 
  CreditCard, 
  Settings,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { pathForTab } from '../../utils/routes';

export default function BottomNav({ currentTab, setCurrentTab, onOpenQuickAction }) {
  const navigate = useNavigate();

  const handleTabClick = (tabKey) => {
    if (setCurrentTab) setCurrentTab(tabKey);
    const targetPath = pathForTab(tabKey);
    if (targetPath) navigate(targetPath);
  };

  const navItems = [
    { key: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { key: 'appointments', label: 'Visits', icon: CalendarDays },
    { key: 'patients', label: 'Patients', icon: Dog },
    { key: 'billing', label: 'Billing', icon: CreditCard },
    { key: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="pwa-mobile-bottom-nav">
      {/* Home */}
      <button 
        type="button"
        onClick={() => handleTabClick('dashboard')}
        className={`pwa-nav-btn ${currentTab === 'dashboard' ? 'active' : ''}`}
      >
        <LayoutDashboard size={20} />
        <span>Home</span>
      </button>

      {/* Visits */}
      <button 
        type="button"
        onClick={() => handleTabClick('appointments')}
        className={`pwa-nav-btn ${currentTab === 'appointments' ? 'active' : ''}`}
      >
        <CalendarDays size={20} />
        <span>Visits</span>
      </button>

      {/* Center Floating Action Button (FAB) */}
      <div className="pwa-nav-fab-wrap">
        <button 
          type="button"
          className="pwa-nav-fab-btn" 
          onClick={onOpenQuickAction}
          aria-label="Quick Action"
          title="Quick Action"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Patients */}
      <button 
        type="button"
        onClick={() => handleTabClick('patients')}
        className={`pwa-nav-btn ${currentTab === 'patients' ? 'active' : ''}`}
      >
        <Dog size={20} />
        <span>Patients</span>
      </button>

      {/* Billing */}
      <button 
        type="button"
        onClick={() => handleTabClick('billing')}
        className={`pwa-nav-btn ${currentTab === 'billing' ? 'active' : ''}`}
      >
        <CreditCard size={20} />
        <span>Billing</span>
      </button>
    </nav>
  );
}
