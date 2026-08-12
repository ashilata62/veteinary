import { apiFetch } from '../utils/api';
import React, { useState, useEffect } from 'react';
import { Users, DollarSign, Calendar, AlertTriangle, TrendingUp, Clock, ArrowRight, Eye, ZoomIn, ZoomOut, Maximize2, X, Navigation, CheckCircle2, TrendingDown, Bell, Briefcase } from 'lucide-react';

// Reusable chart card with zoom + fullscreen (only for charts)
function ChartCard({ title, badge, badgeClass, children }) {
  const [scale, setScale] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);

  const toolbar = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
      <button onClick={() => setScale(s => Math.max(0.6, +(s - 0.2).toFixed(1)))} title="Zoom Out"
        style={{ border: '1px solid var(--border)', background: '#fff', borderRadius: '6px', padding: '3px 6px', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', transition: 'all 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--primary-teal-light)'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}>
        <ZoomOut size={13} />
      </button>
      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', minWidth: '28px', textAlign: 'center', fontWeight: 600 }}>{Math.round(scale * 100)}%</span>
      <button onClick={() => setScale(s => Math.min(2, +(s + 0.2).toFixed(1)))} title="Zoom In"
        style={{ border: '1px solid var(--border)', background: '#fff', borderRadius: '6px', padding: '3px 6px', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', transition: 'all 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--primary-teal-light)'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}>
        <ZoomIn size={13} />
      </button>
      <button onClick={() => setFullscreen(true)} title="Fullscreen"
        style={{ border: '1px solid var(--border)', background: '#fff', borderRadius: '6px', padding: '3px 6px', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', transition: 'all 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--primary-teal-light)'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}>
        <Maximize2 size={13} />
      </button>
    </div>
  );

  return (
    <>
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', flex: 1 }}>
            <h4 className="font-bold text-sm" style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: '1.3' }}>{title}</h4>
            {badge && <span className={`badge ${badgeClass}`} style={{ whiteSpace: 'nowrap', fontSize: '0.65rem', padding: '0.2rem 0.5rem' }}>{badge}</span>}
          </div>
          <div style={{ flexShrink: 0 }}>
            {toolbar}
          </div>
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', transition: 'transform 0.3s ease', width: `${100 / scale}%` }}>
            {children}
          </div>
        </div>
      </div>

      {fullscreen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
          onClick={() => setFullscreen(false)}>
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '2rem', width: '90vw', maxWidth: '820px', maxHeight: '85vh', overflow: 'auto', boxShadow: '0 32px 64px rgba(0,0,0,0.4)' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{title}</h3>
              <button onClick={() => setFullscreen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={20} /></button>
            </div>
            {children}
          </div>
        </div>
      )}
    </>
  );
}

// Interactive Revenue Line Chart (Connected to live data)
function RevenueChart({ data = [] }) {
  const [hov, setHov] = useState(null);

  if (data.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '170px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
        No billing logs recorded yet.
      </div>
    );
  }

  const maxVal = Math.max(...data.map(d => d.revenue), 1000);
  const points = data.map((d, i) => {
    const x = 50 + (i / Math.max(data.length - 1, 1)) * 400;
    const y = 130 - (d.revenue / maxVal) * 90; // height goes from 40 to 130
    return { x, y, month: d.month, val: d.revenue };
  });

  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
  const area = points.length > 0 ? `${path} L ${points[points.length - 1].x},150 L ${points[0].x},150 Z` : '';

  return (
    <div style={{ position: 'relative' }}>
      <svg style={{ width: '100%', height: '170px', overflow: 'visible' }} viewBox="0 0 500 150">
        <defs>
          <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="0" y1="30"  x2="500" y2="30"  stroke="#f1f5f9" strokeWidth="1" />
        <line x1="0" y1="75"  x2="500" y2="75"  stroke="#f1f5f9" strokeWidth="1" />
        <line x1="0" y1="120" x2="500" y2="120" stroke="#f1f5f9" strokeWidth="1" />
        {points.length > 0 && <path d={area} fill="url(#rg)" />}
        {points.length > 0 && <path d={path} fill="none" stroke="#14b8a6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
        {points.map((p, i) => (
          <g key={i} style={{ cursor: 'pointer' }}
            onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}
            onTouchStart={() => setHov(i)} onTouchEnd={() => setTimeout(() => setHov(null), 2000)}>
            <circle cx={p.x} cy={p.y} r="15" fill="transparent" />
            <circle cx={p.x} cy={p.y} r={hov === i ? 7 : 5}
              fill={i === points.length - 1 ? '#14b8a6' : '#fff'}
              stroke="#14b8a6" strokeWidth="2.5"
              style={{ transition: 'all 0.2s ease', pointerEvents: 'none' }} />
          </g>
        ))}
      </svg>
      {hov !== null && (
        <div style={{
          position: 'absolute',
          left: `calc(${(points[hov].x / 500) * 100}% - 40px)`,
          top: `calc(${(points[hov].y / 150) * 100}% + 15px)`,
          backgroundColor: '#0f172a',
          color: '#fff',
          padding: '6px 12px',
          borderRadius: '6px',
          fontSize: '0.75rem',
          fontWeight: '700',
          pointerEvents: 'none',
          boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
          zIndex: 20,
          whiteSpace: 'nowrap',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          transform: 'scale(1.05)'
        }}>
          <span>{points[hov].month} Revenue</span>
          <span style={{ color: 'var(--primary-teal)' }}>LKR {(points[hov].val / 1000).toFixed(0)}k</span>
          <div style={{ position: 'absolute', top: '-5px', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderBottom: '6px solid #0f172a' }}></div>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.72rem', marginTop: '0.25rem' }}>
        {points.map((p, i) => (
          <span key={i} style={{ fontWeight: i === points.length - 1 ? 700 : 400, color: i === points.length - 1 ? 'var(--primary-teal)' : 'inherit' }}>
            {p.month} ({(p.val / 1000).toFixed(0)}k)
          </span>
        ))}
      </div>
    </div>
  );
}

// Interactive Appointment Bar Chart (Connected to live data)
function AppointmentChart({ data = [] }) {
  const [hov, setHov] = useState(null);

  if (data.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '170px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
        No appointments recorded this week.
      </div>
    );
  }

  const maxVal = Math.max(...data.map(d => Math.max(d.completed || 0, d.upcoming || 0, d.cancelled || 0)), 5);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '140px', paddingBottom: '0.25rem' }}>
        {data.map((item, i) => {
          const ch = ((item.completed || 0) / maxVal) * 100;
          const uh = ((item.upcoming || 0) / maxVal) * 100;
          const xh = ((item.cancelled || 0) / maxVal) * 100;
          const isHov = hov === i;
          return (
            <div key={i} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
              onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}
              onTouchStart={() => setHov(i)} onTouchEnd={() => setTimeout(() => setHov(null), 2000)}>
              {isHov && (
                <div style={{ position: 'absolute', top: '100%', marginTop: '4px', zIndex: 20, backgroundColor: '#0f172a', color: '#fff', fontSize: '0.75rem', padding: '6px 12px', borderRadius: '6px', whiteSpace: 'nowrap', fontWeight: 600, boxShadow: '0 8px 16px rgba(0,0,0,0.2)', pointerEvents: 'none', transform: 'scale(1.05)' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ color: '#14b8a6' }}>✅ {item.completed}</span>
                    <span style={{ color: '#3b82f6' }}>📅 {item.upcoming}</span>
                    <span style={{ color: '#ef4444' }}>❌ {item.cancelled}</span>
                  </div>
                  <div style={{ position: 'absolute', top: '-5px', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderBottom: '6px solid #0f172a' }}></div>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '100px' }}>
                {ch > 0 && <div style={{ height: `${ch}px`, width: '9px', background: isHov ? '#0f766e' : '#14b8a6', borderRadius: '3px 3px 0 0', transition: 'all 0.2s' }} />}
                {uh > 0 && <div style={{ height: `${uh}px`, width: '9px', background: isHov ? '#1d4ed8' : '#3b82f6', borderRadius: '3px 3px 0 0', transition: 'all 0.2s' }} />}
                {xh > 0 && <div style={{ height: `${xh}px`, width: '9px', background: isHov ? '#dc2626' : '#ef4444', borderRadius: '3px 3px 0 0', transition: 'all 0.2s' }} />}
              </div>
              <span style={{ fontSize: '0.7rem', color: isHov ? 'var(--primary-teal)' : 'var(--text-secondary)', fontWeight: isHov ? 700 : 400 }}>{item.day}</span>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.72rem', marginTop: '0.5rem' }}>
        {[['#14b8a6','Completed'],['#3b82f6','Upcoming'],['#ef4444','Cancelled']].map(([c, l]) => (
          <span key={l} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: 8, height: 8, backgroundColor: c, borderRadius: '50%', display: 'inline-block' }} />{l}
          </span>
        ))}
      </div>
    </div>
  );
}

// Interactive Donut Chart (Connected to live data)
function DonutChart({ data = [] }) {
  const [hov, setHov] = useState(null);
  const r = 15.915;
  const circ = 2 * Math.PI * r;

  const validData = data.filter(d => d.name !== 'No Pets');

  if (validData.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '170px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
        No patient species registered.
      </div>
    );
  }

  let offset = 25;
  const segments = validData.map(t => {
    const dash = t.value;
    const seg = { ...t, dash, offset };
    offset += dash;
    return seg;
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: '170px' }}>
      <div style={{ position: 'relative', width: '130px', height: '130px' }}>
        <svg width="100%" height="100%" viewBox="0 0 42 42">
          <circle cx="21" cy="21" r={r} fill="#fff" />
          <circle cx="21" cy="21" r={r} fill="transparent" stroke="#f1f5f9" strokeWidth="4.5" />
          {segments.map((s, i) => (
            <circle key={i} cx="21" cy="21" r={r} fill="transparent"
              stroke={s.color} strokeWidth={hov === i ? 6 : 4.5}
              strokeDasharray={`${s.dash} ${100 - s.dash}`}
              strokeDashoffset={100 - s.offset + 25}
              style={{ cursor: 'pointer', transition: 'stroke-width 0.2s ease', outline: 'none' }}
              onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}
              onTouchStart={() => setHov(i)}
            />
          ))}
        </svg>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center', pointerEvents: 'none' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: hov !== null ? segments[hov].color : 'var(--text-primary)', transition: 'color 0.2s' }}>
            {hov !== null ? `${segments[hov].value}%` : '100%'}
          </span>
          <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', margin: '2px 0 0 0', fontWeight: 600, textTransform: 'uppercase' }}>
            {hov !== null ? segments[hov].name : 'All Pets'}
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.75rem' }}>
        {segments.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', opacity: hov === null || hov === i ? 1 : 0.4, transition: 'all 0.2s ease', transform: hov === i ? 'translateX(4px)' : 'none' }}
            onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}
            onTouchStart={() => setHov(i)}>
            <span style={{ width: 12, height: 12, backgroundColor: s.color, borderRadius: '4px', display: 'inline-block', flexShrink: 0, boxShadow: hov === i ? `0 2px 6px ${s.color}66` : 'none' }} />
            <span style={{ fontWeight: hov === i ? 700 : 500, color: hov === i ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{s.name}</span>
            <span style={{ color: hov === i ? 'var(--text-primary)' : 'var(--text-secondary)', marginLeft: 'auto', fontWeight: hov === i ? 700 : 500 }}>{s.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Relative time calculator helper
function getRelativeTime(timestamp) {
  if (!timestamp) return 'Just now';
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
  
  return past.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function DashboardHome({ setCurrentTab, setSelectedPetId, currentRole = 'Admin', attendanceStatus }) {
  const [revenueData, setRevenueData] = useState([]);
  const [kpiStats, setKpiStats] = useState({ grossYield: 0, averageTicket: 0, activePatients: 0 });
  const [appointmentData, setAppointmentData] = useState([]);
  const [demographicsData, setDemographicsData] = useState([]);
  const [doctorsData, setDoctorsData] = useState([]);
  const [lowStockAlertsCount, setLowStockAlertsCount] = useState(0);
  const [recentPets, setRecentPets] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [dailyAttendance, setDailyAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        const [
          revRes, 
          aptRes, 
          docRes, 
          petDemoRes, 
          invRes, 
          petsRes, 
          notifRes, 
          attRes
        ] = await Promise.all([
          apiFetch('/api/v1/dashboard/revenue', { headers }),
          apiFetch('/api/v1/dashboard/appointments', { headers }),
          apiFetch('/api/v1/dashboard/doctors', { headers }),
          apiFetch('/api/v1/dashboard/patients', { headers }),
          apiFetch('/api/v1/dashboard/inventory', { headers }),
          apiFetch('/api/v1/dashboard/recent-pets', { headers }),
          apiFetch('/api/v1/dashboard/notifications', { headers }),
          apiFetch('/api/v1/dashboard/attendance', { headers })
        ]);

        const [
          revJson, 
          aptJson, 
          docJson, 
          petDemoJson, 
          invJson, 
          petsJson, 
          notifJson, 
          attJson
        ] = await Promise.all([
          revRes.json(), 
          aptRes.json(), 
          docRes.json(), 
          petDemoRes.json(), 
          invRes.json(), 
          petsRes.json(), 
          notifRes.json(), 
          attRes.json()
        ]);

        if (revJson.status === 'success') {
          setRevenueData(revJson.data.revenueTrend || []);
          setKpiStats({
            grossYield: revJson.data.grossYield || 0,
            averageTicket: revJson.data.averageTicket || 0,
            activePatients: revJson.data.activePatients || 0
          });
        }
        if (aptJson.status === 'success') {
          setAppointmentData(aptJson.data || []);
        }
        if (docJson.status === 'success') {
          setDoctorsData(docJson.data || []);
        }
        if (petDemoJson.status === 'success') {
          setDemographicsData(petDemoJson.data || []);
        }
        if (invJson.status === 'success') {
          setLowStockAlertsCount(invJson.data?.length || 0);
        }
        if (petsJson.status === 'success') {
          setRecentPets(petsJson.data?.slice(0, 3) || []);
        }
        if (notifJson.status === 'success') {
          setNotifications(notifJson.data || []);
        }
        if (attJson.status === 'success') {
          setDailyAttendance(attJson.data || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const latestMonthData = revenueData.length > 0 ? revenueData[revenueData.length - 1] : null;
  const monthlyRevenueVal = latestMonthData ? `LKR ${(latestMonthData.revenue / 1000).toFixed(0)}k` : 'LKR 0';

  let trendText = 'Gross billing logged';
  let isTrendUp = true;
  if (revenueData.length > 1) {
    const prev = revenueData[revenueData.length - 2].revenue;
    const curr = latestMonthData.revenue;
    if (prev > 0) {
      const pct = ((curr - prev) / prev) * 100;
      isTrendUp = pct >= 0;
      trendText = `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}% vs last month`;
    }
  }

  const staffPresent = dailyAttendance.filter(s => s.status === 'Present').length;
  const staffTotal = dailyAttendance.length || 0;

  const handleViewPet = (petId) => { setSelectedPetId(petId); setCurrentTab('medical'); };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1rem', color: 'var(--text-secondary)' }}>
        <div className="animate-spin" style={{ width: 32, height: 32, border: '4px solid var(--border)', borderTopColor: 'var(--primary-teal)', borderRadius: '50%' }} />
        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Loading live dashboard diagnostics...</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* Hero Banner — Admin gradient */}
      <div
        className="animate-fade-in-up"
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          padding: '2.5rem 3rem',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, var(--primary-teal) 0%, #0891b2 100%)',
          color: '#ffffff',
          boxShadow: '0 10px 25px -5px rgba(20, 184, 166, 0.4)',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px 0' }}>
            Admin Control Panel
          </p>
          <h1 style={{ color: '#ffffff', fontSize: '2.5rem', fontWeight: 800, margin: '0 0 0.75rem 0', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
            Clinic Operations Command
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.05rem', margin: 0, fontWeight: 500, maxWidth: '550px', lineHeight: '1.5' }}>
            Real-time overview of patients, revenue, appointments, and stock.
          </p>
        </div>

        {/* Action buttons removed from banner per user request */}
      </div>

      {/* KPI Cards with stagger animations */}
      <div className="kpi-grid-responsive">
        {[
          { label: 'Monthly Revenue',  value: monthlyRevenueVal,      sub: trendText,     subColor: isTrendUp ? 'var(--success)' : 'var(--danger)',  icon: DollarSign,    iconBg: 'var(--secondary-blue-light)', iconColor: 'var(--secondary-blue)' },
          { label: 'Total Patients',   value: kpiStats.activePatients, sub: 'Registered pets',         subColor: 'var(--success)',  icon: Users,         iconBg: 'var(--primary-teal-light)',   iconColor: 'var(--primary-teal)'   },
          { label: 'Inventory Alerts', value: lowStockAlertsCount,  sub: lowStockAlertsCount > 0 ? 'Needs action' : 'Stock level healthy',            subColor: lowStockAlertsCount > 0 ? 'var(--danger)' : 'var(--success)',   icon: AlertTriangle, iconBg: lowStockAlertsCount > 0 ? 'var(--danger-light)' : 'var(--primary-teal-light)',         iconColor: lowStockAlertsCount > 0 ? 'var(--danger)' : 'var(--primary-teal)' },
          { label: 'Staff Attendance', value: `${staffPresent}/${staffTotal}`, sub: 'Present today', subColor: 'var(--success)', icon: CheckCircle2, iconBg: '#dcfce7', iconColor: '#16a34a' },
        ].map(({ label, value, sub, subColor, icon: Icon, iconBg, iconColor }, i) => (
          <div key={label} className={`card animate-fade-in-up hover-lift stagger-${i + 1}`} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ padding: '0.75rem', borderRadius: '12px', backgroundColor: iconBg, color: iconColor }}>
                <Icon size={22} />
              </div>
              <span style={{ color: subColor, fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'var(--background)', padding: '4px 8px', borderRadius: '20px' }}>
                <TrendingUp size={12} />{sub}
              </span>
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px 0' }}>{label}</p>
              <h3 style={{ fontSize: '1.65rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Personal Attendance Summary Card (For Admin/Manager) */}
      <div className="card animate-fade-in-up hover-lift" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: '4px solid var(--primary-teal)', padding: '1.5rem', animationDelay: '150ms' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={16} /> My Attendance & Performance ({currentRole})
          </h4>
          <button onClick={() => setCurrentTab('attendance')} className="btn btn-secondary btn-sm" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>View Hub</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={14} style={{ color: 'var(--success)' }}/> Checked In</span>
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

      {/* 3 Interactive Charts */}
      <div className="dashboard-charts-grid">
        <div className="chart-card-revenue">
          <ChartCard title="Revenue Analytics Trend (LKR)" badge="Live Growth" badgeClass="badge-success">
            <RevenueChart data={revenueData} />
          </ChartCard>
        </div>

        <div className="chart-card-demographics">
          <ChartCard title="Patient Demographics Distribution">
            <DonutChart data={demographicsData} />
          </ChartCard>
        </div>

        <div className="chart-card-appointments">
          <ChartCard title="Daily Appointment Analytics" badge="Capacity Rate" badgeClass="badge-info">
            <AppointmentChart data={appointmentData} />
          </ChartCard>
        </div>
      </div>

      {/* Bottom: Doctor Performance & Notifications & Recent Patients */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', gap: '1.5rem' }}>

        {/* Doctor Performance Overview */}
        <div className="card animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', animationDelay: '200ms' }}>
          <h4 className="font-bold text-sm" style={{ color: 'var(--text-secondary)' }}>Doctor Performance Overview</h4>
          <div className="table-responsive">
            <table className="custom-table" style={{ fontSize: '0.75rem' }}>
              <thead>
                <tr><th>Doctor</th><th>Consultations</th><th>Home Visits</th><th style={{ textAlign: 'right' }}>Revenue</th></tr>
              </thead>
              <tbody>
                {doctorsData.map((doc, idx) => (
                  <tr key={idx}>
                    <td className="font-semibold" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Briefcase size={12} style={{ color: 'var(--primary-teal)' }}/> {doc.name}
                    </td>
                    <td>{doc.consultations}</td>
                    <td>{doc.home_visits}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--success)' }}>
                      LKR {(doc.revenue).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {doctorsData.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '1rem' }}>
                      No doctor records found in database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Patients Table */}
        <div className="card animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', animationDelay: '250ms' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 className="font-bold text-sm" style={{ color: 'var(--text-secondary)' }}>Recent Patients Admitted</h4>
            <button onClick={() => setCurrentTab('pets')} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="table-responsive">
            <table className="custom-table" style={{ fontSize: '0.75rem' }}>
              <thead>
                <tr><th>Pet ID</th><th>Pet Name</th><th>Owner</th><th></th></tr>
              </thead>
              <tbody>
                {recentPets.map(pet => (
                  <tr key={pet.id}>
                    <td className="font-semibold" style={{ color: 'var(--primary-teal)' }}>{pet.id}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {pet.photo_url || pet.photo ? (
                          <img src={pet.photo_url || pet.photo} 
                               alt={pet.name} 
                               style={{ width: 20, height: 20, borderRadius: '50%', objectFit: 'cover' }} 
                               onError={(e) => { e.target.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; }} />
                        ) : (
                          <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: 'var(--primary-teal-light)', color: 'var(--primary-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.6rem' }}>
                            {pet.name ? pet.name.charAt(0).toUpperCase() : 'P'}
                          </div>
                        )}
                        <span className="font-semibold">{pet.name}</span>
                      </div>
                    </td>
                    <td>{pet.ownerName}</td>
                    <td>
                      <button onClick={() => handleViewPet(pet.id)} className="btn btn-secondary btn-sm" style={{ padding: '4px' }} title="View Records">
                        <Eye size={14} style={{ color: 'var(--primary-teal)' }} />
                      </button>
                    </td>
                  </tr>
                ))}
                {recentPets.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '1rem' }}>
                      No patients registered in database yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active System Notifications */}
        <div className="card animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animationDelay: '300ms', gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 className="font-bold text-sm" style={{ color: 'var(--text-secondary)' }}>System Notifications Panel</h4>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {notifications.slice(0, 3).map((n, i) => {
              let badgeType = 'info';
              let Icon = Bell;
              if (n.type === 'Inventory') { badgeType = 'danger'; Icon = AlertTriangle; }
              else if (n.type === 'Attendance') { badgeType = 'warning'; Icon = Clock; }
              else if (n.type === 'System') { badgeType = 'success'; Icon = CheckCircle2; }

              return (
                <div key={n.id || i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: '#fafafa', border: '1px solid var(--border)' }}>
                  <div style={{ padding: '0.4rem', borderRadius: '50%', backgroundColor: `var(--${badgeType}-light)`, color: `var(--${badgeType})` }}>
                    <Icon size={14} />
                  </div>
                  <div>
                    <p style={{ margin: '0 0 2px 0', fontSize: '0.8rem', fontWeight: 600 }}>{n.title}</p>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{n.message}</p>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{getRelativeTime(n.created_at)}</span>
                  </div>
                </div>
              );
            })}
            {notifications.length === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', color: 'var(--text-secondary)', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)' }}>
                <Bell size={24} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>No active notifications.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
