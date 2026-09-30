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
import { pathForTab } from '../utils/routes';

export default function BottomNav({ currentTab, setCurrentTab, onOpenQuickAction, currentRole }) {
  const navigate = useNavigate();

  const handleTabClick = (tabKey) => {
    if (setCurrentTab) {
      setCurrentTab(tabKey);
    } else {
      const targetPath = pathForTab(tabKey, currentRole);
      if (targetPath) navigate(targetPath);
    }
  };

  return (
    <nav className="pwa-mobile-bottom-nav">
      {/* Home / Dashboard */}
      <button 
        type="button"
        onClick={() => handleTabClick('dashboard')}
        className={`pwa-nav-btn ${currentTab === 'dashboard' ? 'active' : ''}`}
        aria-label="Home"
      >
        <LayoutDashboard size={20} />
        <span>Home</span>
      </button>

      {/* Visits / Appointments */}
      <button 
        type="button"
        onClick={() => handleTabClick('appointments')}
        className={`pwa-nav-btn ${currentTab === 'appointments' ? 'active' : ''}`}
        aria-label="Visits"
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
        onClick={() => handleTabClick('pets')}
        className={`pwa-nav-btn ${currentTab === 'pets' || currentTab === 'medical' ? 'active' : ''}`}
        aria-label="Patients"
      >
        <Dog size={20} />
        <span>Pets</span>
      </button>

      {/* Billing */}
      <button 
        type="button"
        onClick={() => handleTabClick('billing')}
        className={`pwa-nav-btn ${currentTab === 'billing' ? 'active' : ''}`}
        aria-label="Billing"
      >
        <CreditCard size={20} />
        <span>Billing</span>
      </button>
    </nav>
  );
}
