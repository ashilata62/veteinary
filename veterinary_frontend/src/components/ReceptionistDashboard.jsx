import { apiFetch } from '../utils/api';
import React, { useState, useEffect } from 'react';
import { Calendar, Users, CreditCard, AlertCircle, ArrowRight, UserPlus, FilePlus, PackageSearch, LayoutDashboard, Clock, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PET_OWNERS } from '../data/mockData';

export default function ReceptionistDashboard({ setCurrentTab, attendanceStatus }) {
  const [appointments, setAppointments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        const [aptsRes, invsRes, stockRes, ownersRes] = await Promise.all([
          apiFetch('http://localhost:5000/api/v1/appointments', { headers }),
          apiFetch('http://localhost:5000/api/v1/invoices', { headers }),
          apiFetch('http://localhost:5000/api/v1/inventory', { headers }),
          apiFetch('http://localhost:5000/api/v1/owners', { headers })
        ]);

        if (aptsRes.ok) {
          const res = await aptsRes.json();
          if (res.status === 'success') setAppointments(res.data || []);
        }
        if (invsRes.ok) {
          const res = await invsRes.json();
          setInvoices(res || []);
        }
        if (stockRes.ok) {
          const res = await stockRes.json();
          if (res.status === 'success') setInventory(res.data || []);
        }
        if (ownersRes.ok) {
          const res = await ownersRes.json();
          if (res.status === 'success') setOwners(res.data || []);
        }
      } catch (err) {
        console.error('Error fetching receptionist dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const d = new Date();
  const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const todaysApts = appointments.filter(a => {
    const datePart = a.date || a.appointment_date || '';
    return datePart.split('T')[0] === todayStr && ['Upcoming', 'Pending'].includes(a.status);
  }).length;

  const homeVisits = appointments.filter(a => 
    (a.isHomeVisit || a.appointment_type === 'Home Visit') && ['Upcoming', 'Pending', 'Scheduled'].includes(a.status)
  ).length;

  const walkInPatients = appointments.filter(a => {
    const datePart = a.date || a.appointment_date || '';
    return datePart.split('T')[0] === todayStr && a.appointment_type === 'Walk-In';
  }).length;

  const pendingBills = invoices.filter(inv => inv.status !== 'Paid' && inv.status !== 'Cancelled').length;

  const lowStockItems = inventory.filter(inv => 
    inv.status === 'Low Stock' || 
    inv.status === 'Out of Stock' || 
    (inv.quantity !== null && inv.quantity <= (inv.low_stock_threshold || 5))
  ).length;

  const dailyRevenue = invoices.filter(inv => {
    const invDate = inv.invoice_date || '';
    return invDate.split('T')[0] === todayStr && inv.status === 'Paid';
  }).reduce((sum, inv) => sum + parseFloat(inv.grand_total || 0), 0);

  const kpis = [
    { label: "Today's Appointments", value: todaysApts, sub: 'Scheduled visits', subColor: 'var(--text-secondary)', icon: Calendar, iconBg: 'var(--primary-teal-light)', iconColor: 'var(--primary-teal)' },
    { label: 'Home Visits', value: homeVisits, sub: 'Assigned today', subColor: 'var(--secondary-blue)', icon: Calendar, iconBg: 'var(--secondary-blue-light)', iconColor: 'var(--secondary-blue)' },
    { label: 'Walk-In Patients', value: walkInPatients, sub: 'Waiting in lobby', subColor: 'var(--warning)', icon: Users, iconBg: 'var(--warning-light)', iconColor: 'var(--warning)' },
    { label: 'Daily Revenue', value: `LKR ${dailyRevenue.toLocaleString()}`, sub: 'Today only', subColor: 'var(--success)', icon: CreditCard, iconBg: 'rgba(34, 197, 94, 0.15)', iconColor: 'var(--success)' },
    { label: 'Pending Bills', value: pendingBills, sub: 'Needs clearance', subColor: 'var(--danger)', icon: CreditCard, iconBg: 'var(--danger-light)', iconColor: 'var(--danger)' },
    { label: 'Low Stock Alerts', value: lowStockItems, sub: 'Action required', subColor: 'var(--warning)', icon: AlertCircle, iconBg: '#fef3c7', iconColor: '#d97706' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* Hero Banner — purple/teal receptionist gradient */}
      <div
        className="animate-fade-in-up"
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '2.5rem 2.5rem',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #3730a3 55%, #0369a1 100%)',
          boxShadow: '0 8px 32px -8px rgba(55,48,163,0.35)',
        }}
      >
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(99,102,241,0.18)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-40px', right: '100px', width: '140px', height: '140px', borderRadius: '50%', background: 'rgba(14,116,144,0.14)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '10px', left: '38%', opacity: 0.07 }}>
          <LayoutDashboard size={110} color="#fff" />
        </div>

        <div style={{ position: 'relative', zIndex: 2 }}>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 6px 0' }}>
            Receptionist Portal
          </p>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>
            Front Desk Workspace
          </h1>
          <p style={{ color: 'rgba(203,213,225,0.85)', fontSize: '0.9rem', margin: '0.5rem 0 0 0', fontWeight: 400 }}>
            Manage check-ins, registrations, and clinic workflow efficiently.
          </p>
        </div>

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setCurrentTab('appointments')}
            className="btn"
            style={{ backgroundColor: '#fff', color: '#3730a3', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.25rem', borderRadius: 'var(--radius-md)', boxShadow: '0 4px 14px rgba(0,0,0,0.15)', transition: 'transform 0.15s ease' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Calendar size={16} /> Book Visit
          </button>
          <button
            onClick={() => setCurrentTab('owners')}
            className="btn"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.25rem', borderRadius: 'var(--radius-md)', backdropFilter: 'blur(4px)', transition: 'transform 0.15s ease' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <UserPlus size={16} /> Register Client
          </button>
        </div>
      </div>

      {/* KPI Cards with stagger */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        {kpis.map(({ label, value, sub, subColor, icon: Icon, iconBg, iconColor }, i) => (
          <div
            key={label}
            className={`card animate-fade-in-up hover-lift stagger-${i + 1}`}
            style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}
          >
            <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-lg)', backgroundColor: iconBg, color: iconColor, flexShrink: 0 }}>
              <Icon size={24} />
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
              <h3 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '2px 0 0 0' }}>{value}</h3>
              <span style={{ color: subColor, fontSize: '0.75rem', fontWeight: 600 }}>{sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Personal Attendance Summary Card */}
      <div className="card animate-fade-in-up hover-lift" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: '4px solid var(--primary-teal)', padding: '1.5rem', animationDelay: '150ms' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={16} /> My Attendance & Performance
          </h4>
          <button onClick={() => setCurrentTab('attendance')} className="btn btn-secondary btn-sm" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>View Monthly Summary</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={14} style={{ color: 'var(--success)' }}/> Checked In</span>
            <p style={{ fontWeight: 700, fontSize: '1.1rem', margin: 0, color: 'var(--text-primary)' }}>{attendanceStatus?.checkInTime || '--'}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>⏳ Working Hours (Today)</span>
            <p style={{ fontWeight: 700, fontSize: '1.1rem', margin: 0, color: 'var(--text-primary)' }}>{attendanceStatus?.workingHoursToday === '--' ? '--' : `${attendanceStatus?.workingHoursToday}h`}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>📅 Leaves This Month</span>
            <p style={{ fontWeight: 700, fontSize: '1.1rem', margin: 0, color: 'var(--warning)' }}>0 Days</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>📈 Attendance</span>
            <p style={{ fontWeight: 700, fontSize: '1.1rem', margin: 0, color: 'var(--success)' }}>{attendanceStatus?.statusToday || 'Absent'}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid-2col">

        {/* Notifications Panel */}
        <div className="card animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animationDelay: '200ms', maxHeight: '420px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 10, paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
            <h4 style={{ color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
              Recent Notifications
            </h4>
            <button onClick={() => setCurrentTab('notifications')} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: '0.7rem' }}>
              View All
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--danger-light)', borderLeft: '3px solid var(--danger)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--danger)' }}>Low Stock Alert</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>10 mins ago</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-main)' }}>Deworming Tablets are completely out of stock.</p>
            </div>
            
            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: '#fef3c7', borderLeft: '3px solid #d97706' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#d97706' }}>Expiring Soon</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>1 hr ago</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-main)' }}>Pain Relief Injection stock is expiring soon.</p>
            </div>

            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-teal-light)', borderLeft: '3px solid var(--primary-teal)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-teal)' }}>New Home Visit</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>2 hrs ago</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-main)' }}>New home visit requested for Bella (Persian Cat) at 3:00 PM.</p>
            </div>
            
            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--secondary-blue-light)', borderLeft: '3px solid var(--secondary-blue)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--secondary-blue)' }}>Pending Bill</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Yesterday</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-main)' }}>Invoice INV-8805 requires clearance.</p>
            </div>
          </div>
        </div>

        {/* Right column: Quick Actions + Recent Registrations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Quick Actions */}
          <div
            className="card animate-fade-in-up"
            style={{ padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderLeft: '4px solid var(--primary-teal)', animationDelay: '250ms', transition: 'all 0.2s ease' }}
            onClick={() => setCurrentTab('billing')}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.backgroundColor = '#f0fdfa'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.backgroundColor = '#fff'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.6rem', backgroundColor: 'var(--primary-teal-light)', color: 'var(--primary-teal)', borderRadius: '50%' }}><FilePlus size={20} /></div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '0.9rem', margin: 0 }}>Generate Invoice</h4>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Process payments and billing</p>
              </div>
            </div>
            <ArrowRight size={18} style={{ color: 'var(--text-muted)' }} />
          </div>

          <div
            className="card animate-fade-in-up"
            style={{ padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderLeft: '4px solid var(--secondary-blue)', animationDelay: '300ms', transition: 'all 0.2s ease' }}
            onClick={() => setCurrentTab('inventory')}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.backgroundColor = '#eff6ff'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.backgroundColor = '#fff'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.6rem', backgroundColor: 'var(--secondary-blue-light)', color: 'var(--secondary-blue)', borderRadius: '50%' }}><PackageSearch size={20} /></div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '0.9rem', margin: 0 }}>Check Inventory</h4>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Review stock and pharmacies</p>
              </div>
            </div>
            <ArrowRight size={18} style={{ color: 'var(--text-muted)' }} />
          </div>

          {/* Recent Registrations */}
          <div className="card animate-fade-in-up" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', animationDelay: '350ms' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recent Registrations</h4>
              <button onClick={() => setCurrentTab('owners')} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                View All <ArrowRight size={14} />
              </button>
            </div>
            <div className="table-responsive">
              <table className="custom-table" style={{ fontSize: '0.8rem' }}>
                <thead>
                  <tr><th>Client Name</th><th>Pets</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {(owners.length > 0 ? owners : PET_OWNERS).slice(0, 3).map(owner => (
                    <tr key={owner.id}>
                      <td style={{ fontWeight: 600 }}>{owner.name}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{owner.petsCount || 0} Enrolled</td>
                      <td><span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Active</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
