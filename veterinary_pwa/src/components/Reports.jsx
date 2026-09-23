import { apiFetch } from '../utils/api';
import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Award, Star, ZoomIn, ZoomOut, X, Maximize2, Users, DollarSign, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatCurrency } from '../utils/formatters';

// Reusable "Power BI" Chart Card with zoom/fullscreen
function ChartCard({ title, subtitle, children, style }) {
  const [zoomed, setZoomed] = useState(false);
  const [scale, setScale] = useState(1);

  return (
    <>
      <div className="card animate-fade-in-up"
        style={{
          display: 'flex', flexDirection: 'column', gap: '1rem',
          transition: 'all 0.25s ease', ...style
        }}
      >
        {/* Chart Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ flex: '1 1 180px', minWidth: 0 }}>
            <h4 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '2px' }}>{title}</h4>
            {subtitle && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{subtitle}</p>}
          </div>
          {/* Chart toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
            <button
              onClick={() => setScale(s => Math.max(0.6, +(s - 0.2).toFixed(1)))}
              title="Zoom Out"
              style={{ border: '1px solid var(--border)', background: '#fff', borderRadius: '6px', padding: '3px 5px', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', transition: 'all 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--primary-teal-light)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
            ><ZoomOut size={13} /></button>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', minWidth: '28px', textAlign: 'center', fontWeight: 600 }}>{Math.round(scale * 100)}%</span>
            <button
              onClick={() => setScale(s => Math.min(2, +(s + 0.2).toFixed(1)))}
              title="Zoom In"
              style={{ border: '1px solid var(--border)', background: '#fff', borderRadius: '6px', padding: '3px 5px', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', transition: 'all 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--primary-teal-light)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
            ><ZoomIn size={13} /></button>
            <button
              onClick={() => setZoomed(true)}
              title="Fullscreen"
              style={{ border: '1px solid var(--border)', background: '#fff', borderRadius: '6px', padding: '3px 5px', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', transition: 'all 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--primary-teal-light)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
            ><Maximize2 size={13} /></button>
          </div>
        </div>

        {/* Chart body with scale transform */}
        <div style={{ overflow: 'hidden', borderRadius: 'var(--radius-md)' }}>
          <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', transition: 'transform 0.3s ease', width: `${100 / scale}%` }}>
            {children}
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {zoomed && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
          onClick={() => setZoomed(false)}>
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '2rem', width: '90vw', maxWidth: '900px', maxHeight: '85vh', overflow: 'auto', boxShadow: '0 32px 64px rgba(0,0,0,0.4)' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-primary)' }}>{title}</h3>
                {subtitle && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{subtitle}</p>}
              </div>
              <button onClick={() => setZoomed(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={22} />
              </button>
            </div>
            {children}
          </div>
        </div>
      )}
    </>
  );
}

// Revenue Bar Chart
function RevenueChart({ data = [] }) {
  const maxVal = Math.max(...data.map(d => d.revenue), 1);
  const [hovered, setHovered] = useState(null);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '200px', padding: '0 0.25rem 0.5rem', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
      {data.map((item, i) => {
        const barH = (item.revenue / maxVal) * 170;
        const isHovered = hovered === i;
        const isLast = i === data.length - 1;
        return (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1, minWidth: '22px', cursor: 'pointer' }}
            onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
            {isHovered && (
              <div style={{ backgroundColor: 'var(--text-primary)', color: '#fff', fontSize: '0.7rem', padding: '4px 8px', borderRadius: '6px', whiteSpace: 'nowrap', fontWeight: 600, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                Rs {(item.revenue / 1000).toFixed(0)}k
              </div>
            )}
            <div style={{
              height: `${barH}px`, width: '100%', maxWidth: '48px',
              background: isLast ? 'linear-gradient(180deg,#14b8a6,#0f766e)' : isHovered ? 'linear-gradient(180deg,#60a5fa,#3b82f6)' : 'linear-gradient(180deg,#93c5fd,#3b82f6)',
              borderRadius: '6px 6px 0 0',
              transition: 'all 0.25s ease',
              boxShadow: isHovered ? '0 4px 16px rgba(59,130,246,0.4)' : 'none',
              transform: isHovered ? 'scaleY(1.03)' : 'scaleY(1)',
              transformOrigin: 'bottom'
            }} />
            <span style={{ fontSize: '0.75rem', color: isLast ? 'var(--primary-teal)' : 'var(--text-secondary)', fontWeight: isLast ? 700 : 400 }}>{item.month}</span>
          </div>
        );
      })}
      {data.length === 0 && (
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem', height: '100%' }}>
          No revenue logs recorded.
        </div>
      )}
    </div>
  );
}

// Pet Type Donut Chart (CSS-based)
function PetDonutChart({ data = [] }) {
  const [hovered, setHovered] = useState(null);
  const total = data.reduce((s, d) => s + d.value, 0) || 100;
  let cumulative = 0;

  const segments = data.map(d => {
    const pct = total > 0 ? (d.value / total) * 100 : 0;
    const seg = { ...d, pct, offset: cumulative };
    cumulative += pct;
    return seg;
  });

  const circumference = 2 * Math.PI * 60;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
      <svg width="160" height="160" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r="60" fill="none" stroke="#f1f5f9" strokeWidth="22" />
        {segments.map((seg, i) => {
          const dashLen = (seg.pct / 100) * circumference;
          const dashOffset = circumference - (seg.offset / 100) * circumference;
          const isHov = hovered === i;
          return (
            <circle key={i} cx="80" cy="80" r="60" fill="none"
              stroke={seg.color} strokeWidth={isHov ? 28 : 22}
              strokeDasharray={`${dashLen} ${circumference - dashLen}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-width 0.2s ease', cursor: 'pointer', transformOrigin: '80px 80px', transform: 'rotate(-90deg)' }}
              onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
            />
          );
        })}
        <text x="80" y="75" textAnchor="middle" style={{ fontSize: '1.5rem', fontWeight: 800, fill: '#0f172a' }}>
          {hovered !== null ? segments[hovered].value + '%' : '100%'}
        </text>
        <text x="80" y="95" textAnchor="middle" style={{ fontSize: '0.6rem', fill: '#64748b' }}>
          {hovered !== null ? segments[hovered].name : 'Total'}
        </text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {segments.map((seg, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', opacity: hovered === null || hovered === i ? 1 : 0.4, transition: 'opacity 0.2s' }}
            onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: seg.color, flexShrink: 0 }} />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{seg.name}</span>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginLeft: 'auto' }}>{seg.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Appointment trend (area-like bar chart)
function AppointmentChart({ data = [] }) {
  const [hov, setHov] = useState(null);
  const max = Math.max(...data.map(d => Math.max(d.completed, d.upcoming)), 10);
  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '180px', padding: '0.5rem 0.5rem 0.5rem 0' }}>
      {data.map((item, i) => (
        <div key={item.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1, cursor: 'pointer' }}
          onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}>
          {hov === i && (
            <div style={{ backgroundColor: 'var(--text-primary)', color: '#fff', fontSize: '0.65rem', padding: '3px 7px', borderRadius: '5px', whiteSpace: 'nowrap', fontWeight: 600 }}>
              ✅{item.completed} 📅{item.upcoming}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '150px' }}>
            <div style={{ width: '14px', height: `${(item.completed / max) * 130}px`, background: 'linear-gradient(180deg,#22c55e,#16a34a)', borderRadius: '4px 4px 0 0', transition: 'all 0.25s', transform: hov === i ? 'scaleY(1.05)' : 'scaleY(1)', transformOrigin: 'bottom' }} />
            <div style={{ width: '14px', height: `${(item.upcoming / max) * 130}px`, background: 'linear-gradient(180deg,#60a5fa,#3b82f6)', borderRadius: '4px 4px 0 0', transition: 'all 0.25s', transform: hov === i ? 'scaleY(1.05)' : 'scaleY(1)', transformOrigin: 'bottom' }} />
          </div>
          <span style={{ fontSize: '0.7rem', color: hov === i ? 'var(--primary-teal)' : 'var(--text-secondary)', fontWeight: hov === i ? 700 : 400 }}>{item.day}</span>
        </div>
      ))}
      <div style={{ position: 'absolute', right: '1.5rem', top: '1rem', display: 'flex', gap: '0.75rem' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--text-secondary)' }}><span style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#22c55e', display: 'inline-block' }} />Completed</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--text-secondary)' }}><span style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#3b82f6', display: 'inline-block' }} />Upcoming</span>
      </div>
    </div>
  );
}

export default function Reports() {
  const [revenueData, setRevenueData] = useState([]);
  const [kpiStats, setKpiStats] = useState({ grossYield: 0, averageTicket: 0, activePatients: 0 });
  const [appointmentData, setAppointmentData] = useState([]);
  const [demographicsData, setDemographicsData] = useState([]);
  const [doctorsData, setDoctorsData] = useState([]);
  const [inventoryAlerts, setInventoryAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [revRes, aptRes, docRes, petRes, invRes] = await Promise.all([
        apiFetch('http://localhost:5000/api/v1/reports/revenue', { headers }),
        apiFetch('http://localhost:5000/api/v1/reports/appointments', { headers }),
        apiFetch('http://localhost:5000/api/v1/reports/doctors', { headers }),
        apiFetch('http://localhost:5000/api/v1/reports/patients', { headers }),
        apiFetch('http://localhost:5000/api/v1/reports/inventory', { headers })
      ]);

      const revJson = await revRes.json();
      const aptJson = await aptRes.json();
      const docJson = await docRes.json();
      const petJson = await petRes.json();
      const invJson = await invRes.json();

      if (revJson.status === 'success') {
        setRevenueData(revJson.data.revenueTrend);
        setKpiStats({
          grossYield: revJson.data.grossYield,
          averageTicket: revJson.data.averageTicket,
          activePatients: revJson.data.activePatients
        });
      }
      if (aptJson.status === 'success') {
        setAppointmentData(aptJson.data);
      }
      if (docJson.status === 'success') {
        setDoctorsData(docJson.data);
      }
      if (petJson.status === 'success') {
        setDemographicsData(petJson.data);
      }
      if (invJson.status === 'success') {
        setInventoryAlerts(invJson.data);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      toast.error('Network error loading reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const totalCompleted = appointmentData.reduce((s, d) => s + d.completed, 0);
  const totalUpcoming = appointmentData.reduce((s, d) => s + d.upcoming, 0);
  const totalApts = totalCompleted + totalUpcoming;
  const conversionRate = totalApts > 0 ? ((totalCompleted / totalApts) * 100).toFixed(1) + '%' : '100%';

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1rem', color: 'var(--text-secondary)' }}>
        <Loader className="animate-spin" size={32} style={{ color: 'var(--primary-teal)' }} />
        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Assembling dynamic dashboard analytics...</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Reports & Analytics
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Power BI–inspired clinic intelligence. Hover charts for details, zoom in/out, or expand to fullscreen.
        </p>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        {[
          { label: 'Annual Gross Yield',       value: formatCurrency(kpiStats.grossYield), sub: 'Actual real-time revenue',  color: 'var(--primary-teal)',   icon: DollarSign },
          { label: 'Average Ticket Value',     value: formatCurrency(kpiStats.averageTicket), sub: 'Gross revenue per invoice',  color: 'var(--secondary-blue)', icon: TrendingUp  },
          { label: 'Consultation Conversions', value: conversionRate,                              sub: 'Completed vs total bookings', color: '#d946ef',               icon: BarChart3   },
          { label: 'Active Patients',          value: kpiStats.activePatients.toString(),           sub: 'Registered pets in system',   color: 'var(--warning)',        icon: Users       },
        ].map(({ label, value, sub, color, icon: Icon }) => (
          <div key={label} className="card animate-fade-in-up"
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: `3px solid ${color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
                <Icon size={16} />
              </div>
            </div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>{value}</h3>
            <span style={{ color: 'var(--success)', fontSize: '0.75rem', fontWeight: 600 }}>{sub}</span>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '1.25rem' }}>
        <ChartCard title="Revenue Analytics Trend" subtitle="Monthly gross revenue — current year (Rs)">
          <RevenueChart data={revenueData} />
        </ChartCard>

        <ChartCard title="Daily Appointment Analytics" subtitle="Completed vs upcoming appointments by weekday">
          <div style={{ position: 'relative' }}>
            <AppointmentChart data={appointmentData} />
          </div>
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '1.25rem' }}>
        <ChartCard title="Patient Demographics Distribution" subtitle="Species breakdown — registered patients">
          <PetDonutChart data={demographicsData} />
        </ChartCard>

        {/* Doctor Performance */}
        <ChartCard title="Practitioner Performance Audit" subtitle="Caseload, ratings, and clinical hours">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {doctorsData.map((doc, idx) => (
              <div key={idx} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', transition: 'all 0.2s ease' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = 'var(--primary-teal)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Award size={16} style={{ color: 'var(--primary-teal)' }} /> {doc.name}
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--warning)' }}>
                    <Star size={14} fill="var(--warning)" /> {doc.rating}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  <div>Patients: <b style={{ color: 'var(--text-primary)' }}>{doc.patients}</b></div>
                  <div>Hours: <b style={{ color: 'var(--text-primary)' }}>{doc.hours} hrs</b></div>
                </div>
                {/* Mini progress bar */}
                <div style={{ marginTop: '8px', height: '4px', backgroundColor: '#f1f5f9', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(100, doc.patients > 0 ? (doc.patients / 160) * 100 : 0)}%`, background: 'linear-gradient(to right,var(--primary-teal),var(--secondary-blue))', borderRadius: '2px', transition: 'width 0.5s ease' }} />
                </div>
              </div>
            ))}
            {doctorsData.length === 0 && (
              <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem', fontSize: '0.8rem' }}>
                No active practitioners found.
              </div>
            )}
          </div>
        </ChartCard>
      </div>

      {/* Critical Resource Table */}
      <ChartCard title="Critical Resource Depletion Alerts" subtitle="Low stock and expiring inventory items">
        <div className="table-responsive" style={{ marginTop: '0.5rem' }}>
          <table className="custom-table" style={{ fontSize: '0.8rem' }}>
            <thead>
              <tr>
                <th>SKU</th><th>Medicine</th><th>Category</th>
                <th>Qty</th><th>Unit Price</th><th>Expiry</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {inventoryAlerts.map(item => (
                <tr key={item.sku}>
                  <td className="font-semibold" style={{ color: 'var(--text-muted)' }}>{item.sku}</td>
                  <td className="font-bold">{item.name}</td>
                  <td>{item.category}</td>
                  <td className="font-semibold" style={{ color: 'var(--danger)' }}>{item.qty}</td>
                  <td>{formatCurrency(item.price)}</td>
                  <td>{item.expiry || '--'}</td>
                  <td>
                    <span 
                      style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '4px', 
                        whiteSpace: 'nowrap', 
                        fontSize: '0.72rem', 
                        fontWeight: 700, 
                        padding: '3px 10px', 
                        borderRadius: '9999px', 
                        textTransform: 'none', 
                        backgroundColor: item.status === 'Low Stock' ? '#fefce8' : '#fef2f2', 
                        color: item.status === 'Low Stock' ? '#ca8a04' : '#dc2626', 
                        border: item.status === 'Low Stock' ? '1px solid #fef08a' : '1px solid #fecaca' 
                      }}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
              {inventoryAlerts.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    No critical resource alerts. All stock is stable.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </ChartCard>

    </div>
  );
}
