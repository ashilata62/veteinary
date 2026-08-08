import React from 'react';
import { Bell, ShieldAlert, CreditCard, UserPlus, CheckCircle2 } from 'lucide-react';
import './SuperAdmin.css';

export default function SuperAdminNotifications() {
  const notifications = [
    { id: 1, type: 'alert', title: 'High CPU Usage', desc: 'Database server CPU exceeded 90% threshold for 5 minutes.', time: '10 mins ago', icon: ShieldAlert, color: '#f87171', bg: 'rgba(248,113,113,0.1)' },
    { id: 2, type: 'billing', title: 'Payment Failed', desc: 'Enterprise subscription renewal failed for City Vet Clinic.', time: '1 hour ago', icon: CreditCard, color: '#facc15', bg: 'rgba(250,204,21,0.1)' },
    { id: 3, type: 'user', title: 'New Clinic Registered', desc: 'Paws & Claws Care started a 14-day free trial.', time: '3 hours ago', icon: UserPlus, color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
    { id: 4, type: 'system', title: 'Backup Completed', desc: 'Daily automated database backup completed successfully.', time: '12 hours ago', icon: CheckCircle2, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  ];

  return (
    <div className="sa-dashboard-container" style={{ maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="sa-page-title">Notifications</h1>
          <p className="sa-page-subtitle">System alerts, billing updates, and platform events.</p>
        </div>
        <button className="btn btn-secondary" style={{ backgroundColor: 'transparent', borderColor: '#334155', color: '#cbd5e1' }}>
          Mark all as read
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {notifications.map((notif) => (
          <div key={notif.id} style={{ 
            display: 'flex', gap: '1.25rem', padding: '1.5rem', 
            backgroundColor: '#0f172a', border: '1px solid #1e293b', 
            borderRadius: '1rem', alignItems: 'flex-start' 
          }}>
            <div style={{ 
              padding: '0.75rem', borderRadius: '0.75rem', 
              backgroundColor: notif.bg, color: notif.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <notif.icon size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <h3 style={{ color: 'white', fontSize: '1rem', fontWeight: 600, margin: 0 }}>{notif.title}</h3>
                <span style={{ color: '#64748b', fontSize: '0.75rem' }}>{notif.time}</span>
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '0.875rem', margin: 0 }}>{notif.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
