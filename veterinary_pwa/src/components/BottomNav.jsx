import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Dog, 
  CreditCard, 
  User,
  Plus
} from 'lucide-react';

export default function BottomNav({ onOpenQuickAction }) {
  return (
    <nav className="pwa-bottom-nav">
      <NavLink 
        to="/dashboard" 
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <LayoutDashboard size={22} />
        <span>Home</span>
      </NavLink>

      <NavLink 
        to="/appointments" 
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <CalendarDays size={22} />
        <span>Visits</span>
      </NavLink>

      {/* Center Quick Action Floating Action Button */}
      <div className="nav-fab-wrap">
        <button 
          className="nav-fab-btn" 
          onClick={onOpenQuickAction}
          aria-label="Quick Action"
        >
          <Plus size={24} />
        </button>
      </div>

      <NavLink 
        to="/patients" 
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <Dog size={22} />
        <span>Patients</span>
      </NavLink>

      <NavLink 
        to="/profile" 
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <User size={22} />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
}
