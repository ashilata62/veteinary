import React, { useState, useEffect, useCallback } from 'react';
import { Bell, Package, CalendarDays, AlertTriangle, CheckCircle, X, Info, Clock, Loader, RefreshCw, Dog } from 'lucide-react';
import { apiFetch } from '../utils/api';
import toast from 'react-hot-toast';

const severityConfig = {
  danger:  { bg: 'var(--danger-light)',  border: 'var(--danger)',  icon: AlertTriangle, iconColor: 'var(--danger)'  },
  warning: { bg: 'var(--warning-light)', border: 'var(--warning)', icon: Clock,         iconColor: 'var(--warning)' },
  info:    { bg: 'var(--secondary-blue-light)', border: 'var(--secondary-blue)', icon: Info, iconColor: 'var(--secondary-blue)' },
  success: { bg: 'var(--success-light)', border: 'var(--success)', icon: CheckCircle,   iconColor: 'var(--success)'  },
};

// Map notification type → severity & icon
const typeToConfig = {
  appointment:    { severity: 'info',    icon: CalendarDays },
  pet_registered: { severity: 'success', icon: Dog },
  low_stock:      { severity: 'danger',  icon: Package },
  expiry:         { severity: 'warning', icon: AlertTriangle },
  system:         { severity: 'info',    icon: Info },
};

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60)  return `${Math.floor(diff)}s ago`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function Notifications({ notifications: propNotifs, setNotifications: setPropNotifs }) {
  const [notifs, setNotifs] = useState(propNotifs || []);
  const [loading, setLoading] = useState(!propNotifs || propNotifs.length === 0);
  const [filter, setFilter] = useState('all');

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/api/v1/notifications');
      const data = await res.json();
      if (data.status === 'success') {
        setNotifs(data.data || []);
        if (setPropNotifs) setPropNotifs(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setLoading(false);
    }
  }, [setPropNotifs]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markRead = async (id) => {
    try {
      await apiFetch(`/api/v1/notifications/${id}/read`, { method: 'PUT' });
      const updated = notifs.map(n => n.id === id ? { ...n, is_read: true } : n);
      setNotifs(updated);
      if (setPropNotifs) setPropNotifs(updated);
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  const dismiss = async (id) => {
    try {
      await apiFetch(`/api/v1/notifications/${id}`, { method: 'DELETE' });
      const updated = notifs.filter(n => n.id !== id);
      setNotifs(updated);
      if (setPropNotifs) setPropNotifs(updated);
      toast.success('Notification dismissed');
    } catch (err) {
      console.error('Failed to dismiss notification', err);
      toast.error('Failed to dismiss');
    }
  };

  const markAllRead = async () => {
    try {
      await apiFetch('/api/v1/notifications/read-all', { method: 'PUT' });
      const updated = notifs.map(n => ({ ...n, is_read: true }));
      setNotifs(updated);
      if (setPropNotifs) setPropNotifs(updated);
      toast.success('All marked as read');
    } catch (err) {
      console.error('Failed to mark all as read', err);
    }
  };

  const unread = notifs.filter(n => !n.is_read).length;

  const filtered = filter === 'all'    ? notifs
                 : filter === 'unread' ? notifs.filter(n => !n.is_read)
                 : notifs.filter(n => n.type === filter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', width: '100%' }}>

      <div className="page-header">
        <div>
          <h1>Notifications</h1>
          <p>System alerts, appointment reminders, and activity feed.</p>
        </div>
        <div className="page-header-actions" style={{ alignItems: "center" }}>
          <button onClick={fetchNotifications} className="btn btn-secondary btn-sm" title="Refresh">
            <RefreshCw size={14} />
          </button>
          {unread > 0 && (
            <button onClick={markAllRead} className="btn btn-secondary btn-sm" style={{ whiteSpace: 'nowrap' }}>
              <CheckCircle size={14} /> Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="kpi-grid-responsive">
        {[
          { label: 'Unread',       count: notifs.filter(n => !n.is_read).length,             color: 'var(--danger)',         icon: Bell         },
          { label: 'Appointments', count: notifs.filter(n => n.type === 'appointment').length, color: 'var(--secondary-blue)', icon: CalendarDays },
          { label: 'Low Stock',    count: notifs.filter(n => n.type === 'low_stock').length,   color: 'var(--warning)',        icon: Package      },
          { label: 'System',       count: notifs.filter(n => n.type === 'system').length,      color: 'var(--primary-teal)',   icon: Info         },
        ].map(({ label, count, color, icon: Icon }) => (
          <div key={label} className="card kpi-stat-card">
            <div className="kpi-icon" style={{ backgroundColor: `${color}18`, color }}>
              <Icon size={20} />
            </div>
            <div>
              <p className="kpi-value">{count}</p>
              <p className="kpi-label">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Dropdown */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Filter Category:</span>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="form-control"
          style={{ 
            width: '220px', 
            height: '38px', 
            fontSize: '0.85rem', 
            fontWeight: '600',
            borderRadius: '8px', 
            border: '1px solid var(--border)',
            padding: '0 10px',
            backgroundColor: '#ffffff',
            color: 'var(--text-primary)',
            outline: 'none',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <option value="all">All Notifications</option>
          <option value="unread">Unread ({unread})</option>
          <option value="appointment">Appointments</option>
          <option value="low_stock">Low Stock</option>
          <option value="system">System Alerts</option>
        </select>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <Loader size={32} className="animate-spin" style={{ margin: '0 auto 1rem', display: 'block' }} />
          <p>Loading notifications...</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              <CheckCircle size={40} style={{ margin: '0 auto 1rem', color: 'var(--success)' }} />
              <p className="font-semibold">All clear! No notifications in this category.</p>
            </div>
          ) : (
            filtered.map(notif => {
              const typeConf = typeToConfig[notif.type] || typeToConfig.system;
              const cfg = severityConfig[typeConf.severity];
              const TypeIcon = typeConf.icon;
              const isRead = notif.is_read;
              return (
                <div
                  key={notif.id}
                  className="animate-fade-in-up"
                  onClick={() => !isRead && markRead(notif.id)}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '1rem',
                    padding: '1rem 1.25rem',
                    backgroundColor: isRead ? '#ffffff' : cfg.bg,
                    border: `1px solid ${isRead ? 'var(--border)' : cfg.border}`,
                    borderLeft: `4px solid ${cfg.border}`,
                    borderRadius: 'var(--radius-xl)',
                    cursor: isRead ? 'default' : 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isRead ? 'none' : 'var(--shadow-sm)',
                    opacity: isRead ? 0.75 : 1
                  }}
                >
                  {/* Icon */}
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: `${cfg.border}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: cfg.iconColor, flexShrink: 0 }}>
                    <TypeIcon size={18} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                        {notif.title}
                        {!isRead && (
                          <span style={{ marginLeft: '0.5rem', display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', backgroundColor: cfg.border, verticalAlign: 'middle' }} />
                        )}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', marginLeft: '1rem' }}>
                        {timeAgo(notif.created_at)}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{notif.message}</p>
                  </div>

                  {/* Dismiss */}
                  <button
                    onClick={(e) => { e.stopPropagation(); dismiss(notif.id); }}
                    style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#cbd5e1', padding: '0.25rem', flexShrink: 0, borderRadius: '4px', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
                    onMouseLeave={e => e.currentTarget.style.color = '#cbd5e1'}
                    title="Dismiss"
                  >
                    <X size={16} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
