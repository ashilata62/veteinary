import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, 
  Search, 
  Plus, 
  Clock, 
  User, 
  Dog, 
  CheckCircle2, 
  X, 
  RefreshCw,
  Phone,
  FileText
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Appointment Form State
  const [form, setForm] = useState({
    pet_name: '',
    species: 'Dog',
    owner_name: '',
    owner_phone: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:30',
    reason: 'Health Checkup'
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/v1/appointments');
      setAppointments(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load appointments:', err);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/api/v1/appointments', form);
      toast.success('Appointment booked successfully!');
      setShowAddModal(false);
      setForm({
        pet_name: '',
        species: 'Dog',
        owner_name: '',
        owner_phone: '',
        date: new Date().toISOString().split('T')[0],
        time: '10:30',
        reason: 'Health Checkup'
      });
      fetchAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/api/v1/appointments/${id}`, { status });
      toast.success(`Marked as ${status}`);
      fetchAppointments();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const filtered = appointments.filter((a) => {
    const matchesSearch = 
      (a.pet_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (a.owner_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (a.reason || '').toLowerCase().includes(search.toLowerCase());

    const matchesStatus = filterStatus === 'ALL' || (a.status || 'Confirmed').toUpperCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="pwa-page-content animate-fade-up">
      {/* Page Title & Add Button */}
      <div className="pwa-page-header">
        <div>
          <h2>Appointments</h2>
          <p>Schedule & Patient Consultations</p>
        </div>
        <button 
          className="pwa-primary-icon-btn"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={18} />
          <span>Book</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="pwa-search-card">
        <div className="search-input-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search pet, owner, symptom..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear-btn" onClick={() => setSearch('')}>
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="filter-pill-row">
          {['ALL', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              className={`filter-pill ${filterStatus === st ? 'active' : ''}`}
              onClick={() => setFilterStatus(st)}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div className="pwa-card-list">
        {loading ? (
          <div className="pwa-loading-state">
            <RefreshCw size={24} className="animate-spin text-teal" />
            <p>Loading appointments...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="pwa-card empty-schedule">
            <CalendarDays size={36} className="text-muted" />
            <h4>No Appointments Found</h4>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          filtered.map((appt) => (
            <div key={appt.id} className="pwa-card appointment-card">
              <div className="appt-card-top">
                <div className="appt-avatar">
                  {appt.species === 'Cat' ? '🐱' : appt.species === 'Bird' ? '🦜' : '🐶'}
                </div>
                <div className="appt-details">
                  <h4>{appt.pet_name || 'Patient'} <span className="pet-species">({appt.species || 'Dog'})</span></h4>
                  <div className="appt-meta-line">
                    <User size={13} />
                    <span>{appt.owner_name || 'Client'}</span>
                    {appt.owner_phone && (
                      <a href={`tel:${appt.owner_phone}`} className="appt-phone-link">
                        <Phone size={12} />
                      </a>
                    )}
                  </div>
                </div>
                <span className={`status-badge-mini ${(appt.status || 'confirmed').toLowerCase()}`}>
                  {appt.status || 'Confirmed'}
                </span>
              </div>

              <div className="appt-card-mid">
                <div className="appt-time-chip">
                  <Clock size={13} />
                  <span>{appt.date || 'Today'} &bull; {appt.time || '10:00 AM'}</span>
                </div>
                <div className="appt-reason-chip">
                  <FileText size={13} />
                  <span>{appt.reason || 'General Health Consultation'}</span>
                </div>
              </div>

              <div className="appt-card-actions">
                {appt.status !== 'Completed' && (
                  <button 
                    className="appt-action-btn complete"
                    onClick={() => handleStatusChange(appt.id, 'Completed')}
                  >
                    <CheckCircle2 size={14} />
                    <span>Mark Done</span>
                  </button>
                )}
                {appt.status !== 'Cancelled' && appt.status !== 'Completed' && (
                  <button 
                    className="appt-action-btn cancel"
                    onClick={() => handleStatusChange(appt.id, 'Cancelled')}
                  >
                    <X size={14} />
                    <span>Cancel</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Appointment Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-sheet animate-fade-up" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Book New Appointment</h3>
              <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Pet Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bruno"
                    value={form.pet_name}
                    onChange={(e) => setForm({ ...form, pet_name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Species</label>
                  <select
                    value={form.species}
                    onChange={(e) => setForm({ ...form, species: e.target.value })}
                  >
                    <option value="Dog">Dog 🐶</option>
                    <option value="Cat">Cat 🐱</option>
                    <option value="Bird">Bird 🦜</option>
                    <option value="Rabbit">Rabbit 🐰</option>
                    <option value="Exotic">Exotic 🦎</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Owner Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Owner Full Name"
                    value={form.owner_name}
                    onChange={(e) => setForm({ ...form, owner_name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={form.owner_phone}
                    onChange={(e) => setForm({ ...form, owner_phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="time"
                    required
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Reason / Symptoms</label>
                <input
                  type="text"
                  placeholder="e.g. Vaccination, Fever, Deworming"
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                />
              </div>

              <button type="submit" className="modal-submit-btn" disabled={submitting}>
                {submitting ? 'Scheduling...' : 'Confirm Appointment'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
