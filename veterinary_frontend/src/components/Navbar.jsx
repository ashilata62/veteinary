import { apiFetch } from '../utils/api';
import React, { useState, useEffect } from 'react';
import { Bell, Search, Menu, ShieldCheck, AlertTriangle, CheckCircle, Info, X, LogOut, User, Settings } from 'lucide-react';
import { USERS } from '../data/mockData';

export default function Navbar({
  sidebarOpen,
  setSidebarOpen,
  currentRole,
  searchQuery,
  setSearchQuery,
  notifications,
  setNotifications,
  setCurrentTab,
  handleLogout,
  attendanceStatus,
  fetchAttendanceStatus,
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const isCheckedIn = attendanceStatus?.isCheckedIn || false;
  const checkInTime = attendanceStatus?.checkInTime || null;
  const checkOutTime = attendanceStatus?.checkOutTime || null;
  const workingHoursToday = attendanceStatus?.workingHoursToday || '--';

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showProfileMenu) {
        const dropdown = document.querySelector('.app-navbar__profile-dropdown');
        const button = document.querySelector('.app-navbar__profile');
        if (dropdown && button && !dropdown.contains(e.target) && !button.contains(e.target)) {
          setShowProfileMenu(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

  const toggleCheckIn = async () => {
    try {
      const token = localStorage.getItem('token');
      if (isCheckedIn) {
        // Check Out
        const res = await apiFetch('/api/v1/attendance/checkout', {
          method: 'POST',
          
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        
        if (fetchAttendanceStatus) await fetchAttendanceStatus();
        if (setNotifications) {
          setNotifications([{
            id: `notif-${Date.now()}`, type: 'system', title: 'Checked Out Successfully', message: `You have checked out at ${new Date().toLocaleTimeString()}.`, time: 'Just now', read: false, severity: 'success'
          }, ...notifications]);
        }
      } else {
        // Check In
        const res = await apiFetch('/api/v1/attendance/checkin', {
          method: 'POST',
          
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        
        if (fetchAttendanceStatus) await fetchAttendanceStatus();
        if (setNotifications) {
          setNotifications([{
            id: `notif-${Date.now()}`, type: 'system', title: 'Checked In Successfully', message: `You have logged your attendance.`, time: 'Just now', read: false, severity: 'success'
          }, ...notifications]);
        }
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const activeUser = (() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        let avatarUrl = parsed.profile_image || '';
        if (avatarUrl) {
          if (avatarUrl.startsWith('uploads') || avatarUrl.startsWith('/uploads')) {
            avatarUrl = `/${avatarUrl.startsWith('/') ? avatarUrl.substring(1) : avatarUrl}`;
          }
        } else {
          avatarUrl = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150';
        }
        return {
          name: parsed.name || parsed.fullName || '',
          role: parsed.role || '',
          avatar: avatarUrl
        };
      }
    } catch (e) {
      console.error('Error parsing user session in Navbar:', e);
    }
    return USERS.find((u) => u.role === currentRole) || USERS[0];
  })();
  const unreadCount = notifications ? notifications.filter((n) => !n.read).length : 0;

  const getNotifIcon = (severity) => {
    switch (severity) {
      case 'danger':
        return <AlertTriangle size={14} style={{ color: 'var(--danger)', flexShrink: 0 }} />;
      case 'warning':
        return <AlertTriangle size={14} style={{ color: 'var(--warning)', flexShrink: 0 }} />;
      case 'success':
        return <CheckCircle size={14} style={{ color: 'var(--success)', flexShrink: 0 }} />;
      default:
        return <Info size={14} style={{ color: 'var(--secondary-blue)', flexShrink: 0 }} />;
    }
  };

  return (
    <header className="app-navbar" style={{ padding: '0 1rem' }}>
      <div className="app-navbar__left" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          type="button"
          className="app-navbar__menu-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle Sidebar"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '6px',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)',
            borderRadius: '50%'
          }}
        >
          <Menu size={20} />
        </button>
        <div className="navbar-search app-navbar__search-desktop">
          <Search size={16} className="app-navbar__search-icon" />
          <input
            type="text"
            placeholder="Search owners, pets, microchips..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="app-navbar__search-input"
            style={{ maxWidth: '250px' }}
          />
        </div>
      </div>

      <div className="app-navbar__right">
        <button
          type="button"
          className="app-navbar__icon-btn app-navbar__search-mobile"
          onClick={() => setShowSearch(!showSearch)}
          aria-label="Search"
        >
          <Search size={18} />
        </button>

        <div className="app-navbar__attendance hidden-mobile" style={{ display: 'flex', alignItems: 'center', marginRight: '1rem' }}>
          {isCheckedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: 8, height: 8, backgroundColor: 'var(--success)', borderRadius: '50%', display: 'inline-block' }}></span>
                Checked In at {checkInTime}
              </span>
              <button onClick={toggleCheckIn} style={{ padding: '0.35rem 0.75rem', fontSize: '0.7rem', backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #f87171', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}>
                Check Out
              </button>
            </div>
          ) : checkInTime && checkOutTime ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: 8, height: 8, backgroundColor: 'var(--text-muted)', borderRadius: '50%', display: 'inline-block' }}></span>
                Checked Out Today ({workingHoursToday}h)
              </span>
            </div>
          ) : (
            <button onClick={toggleCheckIn} style={{ padding: '0.4rem 1rem', fontSize: '0.75rem', backgroundColor: 'var(--success)', color: '#fff', border: 'none', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 600, boxShadow: '0 2px 4px rgba(34,197,94,0.3)', transition: 'all 0.2s' }}>
              <CheckCircle size={14} /> Check In
            </button>
          )}
        </div>

        <div className="app-navbar__notif-wrap">
          <button
            type="button"
            className="app-navbar__icon-btn app-navbar__icon-btn--round"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className="app-navbar__notif-dot" />}
          </button>
        </div>

        {showNotifications && (
          <>
            <div className="app-navbar__backdrop" onClick={() => setShowNotifications(false)} />
            <div className="app-navbar__dropdown">
              <div className="app-navbar__dropdown-head">
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Notifications</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {unreadCount > 0 && (
                    <span className="badge badge-danger" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                      {unreadCount} new
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowNotifications(false)}
                    className="app-navbar__icon-btn"
                    style={{ width: 32, height: 32 }}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
              <div className="app-navbar__dropdown-body">
                {(notifications || []).slice(0, 6).map((n) => (
                  <div
                    key={n.id}
                    className="app-navbar__notif-item"
                    style={{
                      backgroundColor: n.read
                        ? '#fafafa'
                        : n.severity === 'danger'
                          ? 'var(--danger-light)'
                          : n.severity === 'warning'
                            ? 'var(--warning-light)'
                            : '#f0fdfa',
                      borderLeftColor:
                        n.severity === 'danger'
                          ? 'var(--danger)'
                          : n.severity === 'warning'
                            ? 'var(--warning)'
                            : n.severity === 'success'
                              ? 'var(--success)'
                              : 'var(--secondary-blue)',
                      opacity: n.read ? 0.7 : 1,
                    }}
                  >
                    {getNotifIcon(n.severity)}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 600, fontSize: '0.78rem', margin: '0 0 2px 0' }}>{n.title}</p>
                      <p style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', margin: '0 0 2px 0', lineHeight: 1.4 }}>
                        {n.message}
                      </p>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="app-navbar__dropdown-foot">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentTab('notifications');
                    setShowNotifications(false);
                  }}
                  className="app-navbar__link-btn"
                >
                  View all notifications →
                </button>
              </div>
            </div>
          </>
        )}

        <button
          type="button"
          className="app-navbar__profile"
          aria-label={`${activeUser.name}, ${activeUser.role}`}
          onClick={() => setShowProfileMenu(!showProfileMenu)}
        >
          <img 
            src={activeUser.avatar} 
            alt="" 
            className="app-navbar__avatar" 
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150'; }}
          />
          <div className="navbar-user-name app-navbar__user-text">
            <span className="app-navbar__user-name">{activeUser.name}</span>
            <span className="app-navbar__user-role">{activeUser.role}</span>
          </div>
        </button>
        {showProfileMenu && (
          <div className="app-navbar__profile-dropdown animate-fade-in" style={{ position: 'absolute', right: '1rem', top: 'calc(var(--navbar-height) + 8px)', backgroundColor: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 20, minWidth: '200px', overflow: 'hidden' }}>
            <div className="app-navbar__dropdown-head" style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', backgroundColor: '#f8fafc' }}>
              <span style={{ fontWeight: 600, fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>MY ACCOUNT</span>
            </div>
            <div className="app-navbar__dropdown-body" style={{ padding: '0.35rem' }}>
              <button 
                className="app-navbar__dropdown-item" 
                onClick={() => { 
                  if (setCurrentTab) setCurrentTab('settings');
                  setShowProfileMenu(false); 
                }}
              >
                <Settings size={16} style={{ color: 'var(--primary-teal)' }} /> Profile Settings
              </button>
              <div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '0.35rem 0' }}></div>
              <button 
                className="app-navbar__dropdown-item" 
                onClick={() => { 
                  if (handleLogout) handleLogout();
                  setShowProfileMenu(false); 
                }}
              >
                <LogOut size={16} style={{ color: 'var(--danger)' }} /> <span style={{ color: 'var(--danger)' }}>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {showSearch && (
        <div className="app-navbar__search-panel">
          <div className="app-navbar__search-panel-inner">
            <Search size={16} className="app-navbar__search-icon" style={{ left: '0.75rem' }} />
            <input
              type="text"
              placeholder="Search owners, pets, microchips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="app-navbar__search-input app-navbar__search-input--panel"
            />
            <button
              type="button"
              className="app-navbar__icon-btn"
              onClick={() => setShowSearch(false)}
              aria-label="Close search"
              style={{ flexShrink: 0 }}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
