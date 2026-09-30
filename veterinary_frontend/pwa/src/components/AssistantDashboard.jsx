import { apiFetch } from '../utils/api';
import React, { useState, useEffect } from 'react';
import { Calendar, Activity, CheckCircle, Clock, Stethoscope, ArrowRight, ClipboardList, UploadCloud, AlertTriangle, Navigation, Bell } from 'lucide-react';

export default function AssistantDashboard({ setCurrentTab, handleViewPet, attendanceStatus }) {
  const [appointments, setAppointments] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };
        const [aptsRes, tasksRes] = await Promise.all([
          apiFetch('/api/v1/appointments', { headers }),
          apiFetch('/api/v1/assistance-tasks', { headers })
        ]);

        if (aptsRes.ok) {
          const res = await aptsRes.json();
          if (res.status === 'success') {
            const formatted = (res.data || []).map(apt => {
              let timeStr = apt.appointment_time || '';
              if (timeStr && timeStr.includes(':')) {
                  const [hour, minute] = timeStr.split(':');
                  const hr = parseInt(hour, 10);
                  const ampm = hr >= 12 ? 'PM' : 'AM';
                  const hr12 = hr % 12 || 12;
                  timeStr = `${hr12.toString().padStart(2, '0')}:${minute} ${ampm}`;
              }
              return {
                id: apt.id,
                petName: apt.petName || 'Unknown',
                doctorName: apt.doctorName || 'Unknown',
                time: timeStr,
                status: apt.status,
                isHomeVisit: apt.appointment_type === 'Home Visit',
                isEmergency: apt.appointment_type === 'Emergency'
              };
            });
            setAppointments(formatted);
          }
        }

        if (tasksRes.ok) {
          const res = await tasksRes.json();
          if (res.status === 'success' && Array.isArray(res.data)) {
            setTasks(res.data);
          }
        }
      } catch (err) {
        console.error('Error fetching vet assistant dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const activeApts = appointments.filter(a => ['Upcoming', 'Pending'].includes(a.status));
  const homeVisits = appointments.filter(a => a.isHomeVisit && ['Upcoming', 'Pending', 'Scheduled'].includes(a.status));
  const pendingTasks = tasks.filter(t => t.status === 'Pending');
  const pendingUploads = tasks.filter(t => t.task_type === 'Lab Test' && t.status === 'Pending').length;
  const emergencyAlerts = appointments.filter(a => a.isEmergency && ['Upcoming', 'Pending'].includes(a.status)).length;

  const kpis = [
    { label: 'Assigned Tasks', value: pendingTasks.length, sub: 'Pending operations', subColor: 'var(--text-secondary)', IconComp: ClipboardList, iconBg: 'var(--primary-teal-light)', iconColor: 'var(--primary-teal)' },
    { label: 'Pending Uploads', value: pendingUploads, sub: 'Needs scanning', subColor: 'var(--warning)', IconComp: UploadCloud, iconBg: 'var(--warning-light)', iconColor: 'var(--warning)' },
    { label: 'Home Visits', value: homeVisits.length, sub: 'Assigned to you', subColor: 'var(--secondary-blue)', IconComp: Navigation, iconBg: 'var(--secondary-blue-light)', iconColor: 'var(--secondary-blue)' },
    { label: 'Emergency Alerts', value: emergencyAlerts, sub: 'Requires action', subColor: 'var(--danger)', IconComp: AlertTriangle, iconBg: 'var(--danger-light)', iconColor: 'var(--danger)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* Hero Banner — emerald/teal assistant gradient */}
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
          background: 'linear-gradient(135deg, #052e16 0%, #065f46 55%, #0e7490 100%)',
          boxShadow: '0 8px 32px -8px rgba(6,95,70,0.35)',
        }}
      >
        <div style={{ position: 'absolute', top: '-35px', right: '-35px', width: '210px', height: '210px', borderRadius: '50%', background: 'rgba(16,185,129,0.14)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-45px', right: '110px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(14,116,144,0.14)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '8px', left: '40%', opacity: 0.07 }}>
          <Stethoscope size={110} color="#fff" />
        </div>

        <div style={{ position: 'relative', zIndex: 2 }}>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 6px 0' }}>
            Vet Assistant Portal
          </p>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>
            Clinical Assistant Workspace
          </h1>
          <p style={{ color: 'rgba(203,213,225,0.85)', fontSize: '0.9rem', margin: '0.5rem 0 0 0', fontWeight: 400 }}>
            Track operational tasks, upload reports, and support emergency workflows.
          </p>
        </div>

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setCurrentTab('assistance-tasks')}
            className="btn"
            style={{ backgroundColor: '#fff', color: '#065f46', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.5rem', borderRadius: 'var(--radius-md)', boxShadow: '0 4px 14px rgba(0,0,0,0.15)', transition: 'transform 0.15s ease' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <ClipboardList size={16} /> Assistance Tasks
          </button>
          <button
            onClick={() => setCurrentTab('reports-uploads')}
            className="btn"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.25rem', borderRadius: 'var(--radius-md)', backdropFilter: 'blur(4px)', transition: 'transform 0.15s ease' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <UploadCloud size={16} /> Medical Uploads
          </button>
        </div>
      </div>

      {/* KPI Cards with stagger */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        {kpis.map(({ label, value, sub, subColor, IconComp, iconBg, iconColor }, i) => (
          <div
            key={label}
            className={`card animate-fade-in-up hover-lift stagger-${i + 1}`}
            style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}
          >
            <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-lg)', backgroundColor: iconBg, color: iconColor, flexShrink: 0 }}>
              <IconComp size={24} />
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

      {/* Main Grid */}
      <div className="dashboard-grid-2col">

        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Emergency Assistance */}
          <div className="card animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', borderTop: '4px solid var(--danger)', animationDelay: '200ms' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={16} style={{ color: 'var(--danger)' }} /> Emergency Assistance Requests
              </h4>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.85rem', backgroundColor: 'var(--danger-light)', borderRadius: 'var(--radius-md)' }}>
              <AlertTriangle size={18} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--danger)', margin: '0 0 4px 0' }}>Immediate: Surgery Prep Required</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0 0 4px 0' }}>Dr. Alex Mercer needs assistance in Room 2 for an emergency gastric surgery.</p>
                <button onClick={() => setCurrentTab('assistance-tasks')} className="btn btn-sm" style={{ backgroundColor: 'var(--danger)', color: '#fff', fontSize: '0.7rem', padding: '4px 10px', marginTop: '4px' }}>Acknowledge Task</button>
              </div>
            </div>
          </div>

          {/* Pending Uploads */}
          <div className="card animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', animationDelay: '250ms' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pending Medical Uploads</h4>
              <button onClick={() => setCurrentTab('reports-uploads')} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                Upload Portal <ArrowRight size={14} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ padding: '0.5rem', backgroundColor: 'var(--secondary-blue-light)', color: 'var(--secondary-blue)', borderRadius: '50%' }}><UploadCloud size={14} /></div>
                  <div>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, margin: 0 }}>Max's Blood Report (CBC)</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>Pending scan from Dr. Smith</p>
                  </div>
                </div>
                <button onClick={() => setCurrentTab('reports-uploads')} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }}>Upload</button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ padding: '0.5rem', backgroundColor: 'var(--primary-teal-light)', color: 'var(--primary-teal)', borderRadius: '50%' }}><UploadCloud size={14} /></div>
                  <div>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, margin: 0 }}>Luna's X-Ray Scan</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>Pending upload for review</p>
                  </div>
                </div>
                <button onClick={() => setCurrentTab('reports-uploads')} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }}>Upload</button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Notifications Panel */}
          <div className="card animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animationDelay: '300ms' }}>
            <h4 style={{ color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recent Notifications</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: '#fafafa', border: '1px solid var(--border)' }}>
                <Bell size={16} style={{ color: 'var(--primary-teal)', marginTop: '2px' }} />
                <div>
                  <p style={{ margin: '0 0 2px 0', fontSize: '0.8rem', fontWeight: 600 }}>New Home Visit Assigned</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>You have been assigned to assist Dr. John for a Home Visit at 4:00 PM.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: '#fafafa', border: '1px solid var(--border)' }}>
                <Calendar size={16} style={{ color: 'var(--secondary-blue)', marginTop: '2px' }} />
                <div>
                  <p style={{ margin: '0 0 2px 0', fontSize: '0.8rem', fontWeight: 600 }}>Appointment Reminder</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Consultation with Bella starts in 15 minutes.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Home Visits */}
          <div className="card animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', animationDelay: '350ms' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assigned Home Visits</h4>
              <button onClick={() => setCurrentTab('home-visits')} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                View All <ArrowRight size={14} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {homeVisits.length > 0 ? (
                homeVisits.slice(0, 3).map((visit, index) => (
                  <div key={visit.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', backgroundColor: '#fafafa' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ padding: '0.5rem', borderRadius: '50%', backgroundColor: index % 2 === 0 ? '#e0e7ff' : '#fae8ff', color: index % 2 === 0 ? '#4f46e5' : '#c026d3' }}><Navigation size={18} /></div>
                      <div>
                        <h5 style={{ fontWeight: 700, fontSize: '0.85rem', margin: 0 }}>{visit.petName} <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>({visit.doctorName})</span></h5>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', margin: '2px 0 0 0' }}>{visit.time}</p>
                      </div>
                    </div>
                    <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>{visit.status}</span>
                  </div>
                ))
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', backgroundColor: '#fafafa' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ padding: '0.5rem', borderRadius: '50%', backgroundColor: '#e0e7ff', color: '#4f46e5' }}><Navigation size={18} /></div>
                      <div>
                        <h5 style={{ fontWeight: 700, fontSize: '0.85rem', margin: 0 }}>Max <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(Dr. John)</span></h5>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', margin: '2px 0 0 0' }}>4:00 PM • Beagle</p>
                      </div>
                    </div>
                    <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>Upcoming</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', backgroundColor: '#fafafa' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ padding: '0.5rem', borderRadius: '50%', backgroundColor: '#fae8ff', color: '#c026d3' }}><Navigation size={18} /></div>
                      <div>
                        <h5 style={{ fontWeight: 700, fontSize: '0.85rem', margin: 0 }}>Luna <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(Dr. Wilson)</span></h5>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', margin: '2px 0 0 0' }}>6:00 PM • Persian Cat</p>
                      </div>
                    </div>
                    <span className="badge badge-secondary" style={{ fontSize: '0.65rem' }}>Scheduled</span>
                  </div>
                </>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
