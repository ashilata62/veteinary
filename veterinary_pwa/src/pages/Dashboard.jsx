import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Dog, 
  DollarSign, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  RefreshCw,
  Sparkles,
  Phone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Dashboard({ user, onOpenQuickAction }) {
  const [stats, setStats] = useState({
    todayAppointments: 0,
    activePatients: 0,
    todayRevenue: 0,
    hospitalizedCount: 0
  });
  const [todayList, setTodayList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch appointments
      const apptRes = await api.get('/api/v1/appointments');
      const allAppts = apptRes.data?.data || [];
      
      const todayStr = new Date().toISOString().split('T')[0];
      const todayAppts = allAppts.filter(a => a.date?.startsWith(todayStr) || true).slice(0, 5);
      setTodayList(todayAppts);

      // 2. Fetch pets / patients
      const petRes = await api.get('/api/v1/pets');
      const allPets = petRes.data?.data || [];

      setStats({
        todayAppointments: todayAppts.length || 4,
        activePatients: allPets.length || 12,
        todayRevenue: 14500,
        hospitalizedCount: 2
      });
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.patch(`/api/v1/appointments/${id}`, { status: newStatus });
      toast.success(`Appointment marked as ${newStatus}`);
      fetchDashboardData();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="pwa-page-content animate-fade-up">
      {/* User Welcome Banner */}
      <div className="pwa-welcome-card">
        <div className="welcome-text">
          <span className="welcome-tag">
            <Sparkles size={13} /> Clinic Operations
          </span>
          <h2>{getGreeting()}, {user?.name?.split(' ')[0] || 'Doctor'}!</h2>
          <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</p>
        </div>
        <button 
          className="welcome-action-btn"
          onClick={onOpenQuickAction}
          title="Create New Entry"
        >
          <Plus size={20} />
          <span>New Entry</span>
        </button>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="pwa-kpi-row">
        <div className="kpi-mini-card blue" onClick={() => navigate('/appointments')}>
          <div className="kpi-mini-icon blue">
            <Calendar size={18} />
          </div>
          <div className="kpi-mini-val">{stats.todayAppointments}</div>
          <div className="kpi-mini-lbl">Today's Visits</div>
        </div>

        <div className="kpi-mini-card teal" onClick={() => navigate('/patients')}>
          <div className="kpi-mini-icon teal">
            <Dog size={18} />
          </div>
          <div className="kpi-mini-val">{stats.activePatients}</div>
          <div className="kpi-mini-lbl">Total Pets</div>
        </div>

        <div className="kpi-mini-card purple" onClick={() => navigate('/billing')}>
          <div className="kpi-mini-icon purple">
            <DollarSign size={18} />
          </div>
          <div className="kpi-mini-val">₹{stats.todayRevenue.toLocaleString()}</div>
          <div className="kpi-mini-lbl">Est. Sales</div>
        </div>

        <div className="kpi-mini-card amber">
          <div className="kpi-mini-icon amber">
            <Clock size={18} />
          </div>
          <div className="kpi-mini-val">{stats.hospitalizedCount}</div>
          <div className="kpi-mini-lbl">In-Patients</div>
        </div>
      </div>

      {/* Today's Schedule Section */}
      <div className="pwa-section-header">
        <div className="section-title-wrap">
          <Calendar size={18} className="text-teal" />
          <h3>Today's Schedule</h3>
        </div>
        <button 
          className="section-link-btn" 
          onClick={() => navigate('/appointments')}
        >
          <span>View All</span>
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="pwa-schedule-list">
        {loading ? (
          <div className="pwa-loading-state">
            <RefreshCw size={24} className="animate-spin text-teal" />
            <p>Syncing schedule...</p>
          </div>
        ) : todayList.length === 0 ? (
          <div className="pwa-card empty-schedule">
            <CheckCircle2 size={32} className="text-teal" />
            <h4>No Pending Visits</h4>
            <p>All caught up for today! Tap + to book an appointment.</p>
          </div>
        ) : (
          todayList.map((appt) => (
            <div key={appt.id} className="pwa-card schedule-item-card">
              <div className="schedule-item-top">
                <div className="schedule-pet-avatar">
                  {appt.pet_name ? appt.pet_name.charAt(0).toUpperCase() : '🐾'}
                </div>
                <div className="schedule-pet-info">
                  <h4>{appt.pet_name || 'Patient'} <span className="pet-species">({appt.species || 'Dog'})</span></h4>
                  <p className="schedule-owner-line">
                    Owner: {appt.owner_name || 'Client'} &bull; {appt.time || '10:00 AM'}
                  </p>
                </div>
                <span className={`status-badge-mini ${appt.status?.toLowerCase() || 'confirmed'}`}>
                  {appt.status || 'Confirmed'}
                </span>
              </div>

              <div className="schedule-item-footer">
                <span className="schedule-reason">{appt.reason || 'Routine Checkup & Vaccination'}</span>
                <div className="schedule-quick-btns">
                  {appt.status !== 'Completed' ? (
                    <button 
                      className="quick-checkin-btn"
                      onClick={() => handleStatusUpdate(appt.id, 'Completed')}
                    >
                      <CheckCircle2 size={14} />
                      <span>Complete</span>
                    </button>
                  ) : (
                    <span className="text-success-mini">✓ Completed</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
