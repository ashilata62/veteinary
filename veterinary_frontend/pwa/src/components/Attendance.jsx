import { apiFetch } from '../utils/api';
import React, { useState } from 'react';
import { Clock, UserCheck, Calendar, UserX, AlertTriangle, TrendingUp, Users, Activity, BarChart3, Stethoscope, Briefcase, HeartHandshake, FileText } from 'lucide-react';

export default function Attendance({ currentRole }) {
  const isAdminOrManager = currentRole === 'Admin' || currentRole === 'Manager';
  const [filterRole, setFilterRole] = useState('All');
  const [viewMode, setViewMode] = useState(isAdminOrManager ? 'hub' : 'personal');
  const [dailyAttendance, setDailyAttendance] = useState([]);
  const [personalHistory, setPersonalHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (viewMode === 'hub') {
        const res = await apiFetch('http://localhost:5000/api/v1/attendance');
        const json = await res.json();
        if (json.status === 'success') {
          setDailyAttendance(json.data);
        }
      } else {
        const res = await apiFetch('http://localhost:5000/api/v1/attendance/me');
        const json = await res.json();
        if (json.status === 'success') {
          setPersonalHistory(json.data);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    setLoading(true);
    fetchData();
  }, [viewMode]);

  const handleCheckIn = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await apiFetch('http://localhost:5000/api/v1/attendance/checkin', {
        method: 'POST',
        
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert('Checked in successfully!');
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCheckOut = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await apiFetch('http://localhost:5000/api/v1/attendance/checkout', {
        method: 'POST',
        
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert(`Checked out successfully! Total hours: ${data.data.workingHours}`);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredAttendance = filterRole === 'All' 
    ? dailyAttendance 
    : dailyAttendance.filter(s => s.role === filterRole);

  const filterOptions = ['All', 'Doctor', 'Receptionist', 'Vet Assistant', 'Manager', 'Admin'];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Present': return 'badge-success';
      case 'Absent': return 'badge-danger';
      case 'Late': return 'badge-warning';
      case 'Half Day': return 'badge-warning';
      case 'On Leave': return 'badge-info';
      default: return 'badge-secondary';
    }
  };

  const presentToday = dailyAttendance.filter(s => s.status === 'Present').length;
  const absentToday = dailyAttendance.filter(s => s.status === 'Absent' || s.status === 'On Leave').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .attendance-card-hover {
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease !important;
        }
        .attendance-card-hover:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.05), 0 8px 16px -8px rgba(0, 0, 0, 0.05) !important;
        }
        .attendance-row-hover {
          transition: background-color 0.15s ease;
        }
        .attendance-row-hover:hover {
          background-color: var(--primary-teal-light) !important;
        }
      `}</style>
      
      {/* 1. Page Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Clock size={28} style={{ color: 'var(--primary-teal)' }} /> {isAdminOrManager ? 'Clinic Attendance Hub' : 'My Attendance & Performance'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            {viewMode === 'hub' ? 'Monitor staff check-ins, working hours, and operational productivity.' : 'Track your personal check-ins, working hours, and performance metrics.'}
          </p>
        </div>
        {isAdminOrManager && (
          <div style={{ display: 'flex', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: 'var(--radius-lg)' }}>
            <button
              onClick={() => setViewMode('hub')}
              style={{ padding: '6px 12px', fontSize: '0.8rem', fontWeight: viewMode === 'hub' ? 700 : 500, backgroundColor: viewMode === 'hub' ? '#fff' : 'transparent', color: viewMode === 'hub' ? 'var(--primary-teal)' : 'var(--text-secondary)', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: viewMode === 'hub' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}
            >
              Clinic Hub
            </button>
            <button
              onClick={() => setViewMode('personal')}
              style={{ padding: '6px 12px', fontSize: '0.8rem', fontWeight: viewMode === 'personal' ? 700 : 500, backgroundColor: viewMode === 'personal' ? '#fff' : 'transparent', color: viewMode === 'personal' ? 'var(--primary-teal)' : 'var(--text-secondary)', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: viewMode === 'personal' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}
            >
              My Attendance
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading attendance data...</div>
      ) : viewMode === 'hub' ? (
        <>
          {/* KPI Cards */}
          <div className="kpi-grid-responsive" style={{ marginBottom: '0.5rem' }}>
            <div className="card hover-lift attendance-card-hover" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid var(--success)', padding: '1.25rem', transition: 'all 0.2s ease', cursor: 'pointer' }}>
              <div style={{ padding: '0.75rem', borderRadius: '50%', backgroundColor: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><UserCheck size={24} /></div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', margin: 0 }}>Present Today</p>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '2px 0 0 0' }}>{presentToday} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ {dailyAttendance.length}</span></h3>
              </div>
            </div>
            <div className="card hover-lift attendance-card-hover" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid var(--danger)', padding: '1.25rem', transition: 'all 0.2s ease', cursor: 'pointer' }}>
              <div style={{ padding: '0.75rem', borderRadius: '50%', backgroundColor: 'var(--danger-light)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><UserX size={24} /></div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', margin: 0 }}>Absent / Leave</p>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '2px 0 0 0' }}>{absentToday}</h3>
              </div>
            </div>
          </div>

          {/* Daily Attendance Table */}
          <div className="card" style={{ border: '1px solid var(--border)', borderRadius: '12px', boxShadow: 'var(--shadow-md)', padding: '1.5rem', backgroundColor: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
              <h3 className="font-bold text-lg" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                <Users size={20} style={{ color: 'var(--primary-teal)' }} /> Today's Staff Attendance & Productivity
              </h3>
              <div>
                <select 
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="form-control"
                  style={{ width: '180px', height: '36px', fontSize: '0.85rem', borderRadius: '8px', border: '1px solid var(--border)', padding: '0 8px', backgroundColor: 'var(--background)', cursor: 'pointer', fontWeight: 600, color: 'var(--text-secondary)' }}
                >
                  <option value="All">All Roles</option>
                  <option value="Doctor">Doctor ({dailyAttendance.filter(s => s.role === 'Doctor').length})</option>
                  <option value="Receptionist">Receptionist ({dailyAttendance.filter(s => s.role === 'Receptionist').length})</option>
                  <option value="Vet Assistant">Vet Assistant ({dailyAttendance.filter(s => s.role === 'Vet Assistant').length})</option>
                  <option value="Manager">Manager ({dailyAttendance.filter(s => s.role === 'Manager').length})</option>
                  <option value="Admin">Admin ({dailyAttendance.filter(s => s.role === 'Admin').length})</option>
                </select>
              </div>
            </div>
            
            <div className="table-responsive">
              <table className="custom-table" style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)' }}>
                    <th style={{ textAlign: 'left', padding: '0.85rem' }}>Staff Name</th>
                    <th style={{ textAlign: 'left', padding: '0.85rem' }}>Role</th>
                    <th style={{ textAlign: 'left', padding: '0.85rem' }}>Check In</th>
                    <th style={{ textAlign: 'left', padding: '0.85rem' }}>Check Out</th>
                    <th style={{ textAlign: 'center', padding: '0.85rem' }}>Total Hrs</th>
                    <th style={{ textAlign: 'center', padding: '0.85rem' }}>Status</th>
                    <th style={{ textAlign: 'left', padding: '0.85rem' }}>Activity Summary</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendance.map(staff => (
                    <tr key={staff.id} className="attendance-row-hover" style={{ borderBottom: '1px solid var(--border)' }}>
                      <td className="font-bold" style={{ padding: '0.85rem' }}>{staff.name}</td>
                      <td style={{ padding: '0.85rem' }}><span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{staff.role}</span></td>
                      <td className="font-semibold" style={{ fontSize: '0.85rem', padding: '0.85rem' }}>{staff.checkIn}</td>
                      <td className="font-semibold" style={{ fontSize: '0.85rem', padding: '0.85rem' }}>{staff.checkOut}</td>
                      <td style={{ textAlign: 'center', fontWeight: 600, padding: '0.85rem' }}>{staff.hours}h</td>
                      <td style={{ textAlign: 'center', padding: '0.85rem' }}><span className={`badge ${getStatusBadge(staff.status)}`} style={{ fontSize: '0.7rem' }}>{staff.status}</span></td>
                      <td style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', padding: '0.85rem' }}>{staff.activity}</td>
                    </tr>
                  ))}
                  {filteredAttendance.length === 0 && (
                    <tr><td colSpan={7} style={{textAlign: 'center', padding: '2rem'}}>No staff found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
             <button onClick={handleCheckIn} className="btn" style={{ padding: '0.75rem 1.5rem' }}>
                <Clock size={18} /> Check In Now
             </button>
             <button onClick={handleCheckOut} className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem', color: 'var(--danger)' }}>
                <Clock size={18} /> Check Out
             </button>
          </div>

          <div className="card">
            <h3 className="font-bold text-lg" style={{ marginBottom: '1rem' }}>My Attendance History</h3>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th style={{ textAlign: 'center' }}>Hours Logged</th>
                    <th style={{ textAlign: 'center' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {personalHistory.map((log, i) => (
                    <tr key={i}>
                      <td className="font-bold">{log.date}</td>
                      <td className="font-semibold" style={{ fontSize: '0.85rem' }}>{log.checkIn}</td>
                      <td className="font-semibold" style={{ fontSize: '0.85rem' }}>{log.checkOut}</td>
                      <td style={{ textAlign: 'center', fontWeight: 600 }}>{log.hours}h</td>
                      <td style={{ textAlign: 'center' }}><span className={`badge ${getStatusBadge(log.status)}`} style={{ fontSize: '0.7rem' }}>{log.status}</span></td>
                    </tr>
                  ))}
                  {personalHistory.length === 0 && (
                    <tr><td colSpan={5} style={{textAlign: 'center', padding: '2rem'}}>No history found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
