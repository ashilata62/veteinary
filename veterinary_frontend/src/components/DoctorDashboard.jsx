import { apiFetch } from '../utils/api';
import React from 'react';
import { Calendar, CheckCircle, Clock, AlertTriangle, ArrowRight, Eye, TrendingUp, Stethoscope } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
// Removed mock data import

export default function DoctorDashboard({ setCurrentTab, setSelectedPetId, handleViewPet, attendanceStatus }) {
  const [appointments, setAppointments] = React.useState([]);
  const [encounters, setEncounters] = React.useState([]);
  const [homeVisits, setHomeVisits] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };
        const [aptRes, encRes, hvRes] = await Promise.all([
          apiFetch('/api/v1/appointments', { headers }),
          apiFetch('/api/v1/encounters', { headers }),
          apiFetch('/api/v1/home-visits', { headers })
        ]);
        const [apts, encs, hvs] = await Promise.all([aptRes.json(), encRes.json(), hvRes.json()]);
        
        const aptsArray = apts.data ? apts.data : (Array.isArray(apts) ? apts : []);
        setAppointments(aptsArray);
        
        setEncounters(Array.isArray(encs) ? encs : []);
        
        const hvsArray = hvs.data ? hvs.data : (Array.isArray(hvs) ? hvs : []);
        // Count home visits with travel_fee if field exists, else count all
        const hvCount = hvsArray.filter(hv => hv.travel_fee).length || hvsArray.length;
        setHomeVisits(hvCount);
      } catch (err) {
        console.error('Error fetching dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const todayApts = appointments.filter(a => ['Upcoming', 'Pending'].includes(a.status));
  const emergencyCases = appointments.filter(a => a.type === 'Emergency').length;
  const completedVisits = appointments.filter(a => a.status === 'Completed').length;
  // homeVisits state is set from API; fallback to 0 if not loaded
  const pendingFollowUps = appointments.filter(a => a.status === 'Pending').length;

  const chartData = [
    { name: 'Mon', visits: 4 },
    { name: 'Tue', visits: 7 },
    { name: 'Wed', visits: 5 },
    { name: 'Thu', visits: 8 },
    { name: 'Fri', visits: 6 },
    { name: 'Sat', visits: 9 },
    { name: 'Sun', visits: 3 },
  ];

  const kpis = [
    { label: "Clinic Appointments", value: todayApts.length, sub: 'Next at 11:00 AM', subColor: 'var(--text-secondary)', icon: Calendar, iconBg: 'var(--primary-teal-light)', iconColor: 'var(--primary-teal)' },
    { label: 'Home Visits Today', value: homeVisits, sub: 'Route optimized', subColor: 'var(--text-secondary)', icon: Stethoscope, iconBg: 'rgba(139, 92, 246, 0.15)', iconColor: '#8b5cf6' },
    { label: 'Completed Consults', value: completedVisits, sub: '+4% this week', subColor: 'var(--success)', icon: CheckCircle, iconBg: 'var(--success-light)', iconColor: 'var(--success)' },
    { label: 'Revenue Generated', value: '₹8,500', sub: 'Today so far', subColor: 'var(--success)', icon: TrendingUp, iconBg: 'rgba(59, 130, 246, 0.15)', iconColor: '#3b82f6' },
    { label: 'Pending Follow-Ups', value: pendingFollowUps, sub: 'Needs attention', subColor: 'var(--warning)', icon: Clock, iconBg: 'var(--warning-light)', iconColor: 'var(--warning)' },
    { label: 'Emergency Cases', value: emergencyCases, sub: 'Priority attention', subColor: 'var(--danger)', icon: AlertTriangle, iconBg: 'var(--danger-light)', iconColor: 'var(--danger)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* Hero Banner — gradient instead of broken image */}
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
          background: 'linear-gradient(135deg, #0f172a 0%, #134e4a 60%, #0e7490 100%)',
          boxShadow: '0 8px 32px -8px rgba(14,116,144,0.35)',
        }}
      >
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(20,184,166,0.12)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-50px', right: '120px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(59,130,246,0.10)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '10px', left: '40%', opacity: 0.07 }}>
          <Stethoscope size={120} color="#fff" />
        </div>

        <div style={{ position: 'relative', zIndex: 2 }}>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 6px 0' }}>
            Doctor Portal
          </p>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>
            Doctor Workspace
          </h1>
          <p style={{ color: 'rgba(203,213,225,0.85)', fontSize: '0.9rem', margin: '0.5rem 0 0 0', fontWeight: 400 }}>
            Your daily overview of consultations, patients, and clinical tasks.
          </p>
        </div>

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setCurrentTab('appointments')}
            className="btn"
            style={{ backgroundColor: '#fff', color: '#0f766e', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.5rem', borderRadius: 'var(--radius-md)', boxShadow: '0 4px 14px rgba(0,0,0,0.15)', transition: 'transform 0.15s ease' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Calendar size={16} /> My Schedule
          </button>
        </div>
      </div>

      {/* KPI Cards with stagger animations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.5rem' }}>
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
              <span style={{ color: subColor, fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                {label === 'Completed Visits' && <TrendingUp size={12} />} {sub}
              </span>
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

      {/* Two-column layout */}
      <div className="dashboard-grid-2col">

        {/* Upcoming Consultations */}
        <div className="card animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animationDelay: '200ms' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>My Upcoming Consultations</h4>
            <button onClick={() => setCurrentTab('appointments')} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              View Schedule <ArrowRight size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {todayApts.slice(0, 4).map(apt => (
              <div
                key={apt.id}
                className="dashboard-consultation-row"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', backgroundColor: '#fafafa', transition: 'all 0.2s ease', cursor: 'default', width: '100%' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f0fdfa'; e.currentTarget.style.borderColor = 'var(--primary-teal)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#fafafa'; e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0, flex: 1 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: apt.status === 'Upcoming' ? 'var(--secondary-blue-light)' : 'var(--warning-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: apt.status === 'Upcoming' ? 'var(--secondary-blue)' : 'var(--warning)', flexShrink: 0 }}>
                    <Clock size={18} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h5 style={{ fontWeight: 700, fontSize: '0.85rem', margin: 0, wordBreak: 'break-word' }}>{apt.petName} <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 400 }}>({apt.breed})</span></h5>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', margin: 0 }}>Owner: {apt.ownerName}</p>
                  </div>
                </div>
                <div className="consultation-time-block" style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block' }}>{apt.time}</span>
                  <span className={`badge ${apt.status === 'Upcoming' ? 'badge-info' : 'badge-warning'}`} style={{ fontSize: '0.6rem', padding: '2px 6px', marginTop: '4px' }}>{apt.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Doctor Activity Timeline */}
        <div className="card animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', animationDelay: '300ms' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>My Activity Timeline</h4>
            <button type="button" onClick={() => alert('Full activity timeline will open here.')} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', position: 'relative', paddingLeft: '1.5rem' }}>
            {/* Vertical line indicator */}
            <div style={{ position: 'absolute', top: '5px', bottom: '5px', left: '7px', width: '2px', backgroundColor: 'var(--border)' }} />
            {loading ? (
              <p>Loading activity...</p>
            ) : (
              encounters.slice(0, 5).map((enc, idx) => (
                <div key={enc.id || idx} style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', top: '2px', left: '-28px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: idx % 3 === 0 ? 'var(--success)' : idx % 3 === 1 ? 'var(--primary-teal)' : '#8b5cf6', border: '3px solid #ffffff' }} />
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: '0 0 2px 0', fontWeight: 600 }}>{enc.time || (enc.created_at ? enc.created_at.slice(11,16) : '---')}</p>
                  <h5 style={{ fontSize: '0.85rem', fontWeight: 700, margin: '0 0 4px 0' }}>{enc.title || 'Clinical Encounter'}</h5>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>{enc.description || `Encounter for ${enc.pet_name || 'pet'}.`}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Analytics Chart */}
      <div className="card animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animationDelay: '400ms' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Consultations This Week</h4>
        </div>
        <div style={{ width: '100%', height: '250px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
              <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="visits" fill="var(--primary-teal)" radius={[4, 4, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
