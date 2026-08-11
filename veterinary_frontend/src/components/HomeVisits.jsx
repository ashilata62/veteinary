import { apiFetch } from '../utils/api';
import React, { useState, useEffect } from 'react';
import { Home, Plus, Check, XCircle, MapPin, User, Clock, AlertCircle, FileText, Calendar, Navigation, Navigation2, Loader, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import FormSelect from './FormSelect';

export default function HomeVisits({ currentRole }) {
  const [appointments, setAppointments] = useState([]);
  const [petOwners, setPetOwners] = useState([]);
  const [pets, setPets] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [visitsRes, ownersRes, petsRes, usersRes] = await Promise.all([
        apiFetch('http://localhost:5000/api/v1/home-visits', { headers }),
        apiFetch('http://localhost:5000/api/v1/owners', { headers }),
        apiFetch('http://localhost:5000/api/v1/pets', { headers }),
        apiFetch('http://localhost:5000/api/v1/users', { headers })
      ]);
      
      const visitsData = await visitsRes.json();
      const ownersData = await ownersRes.json();
      const petsData = await petsRes.json();
      const usersData = await usersRes.json();

      if (visitsData.success) {
        const formattedVisits = visitsData.data.map(apt => {
          const dateStr = apt.appointment_date ? apt.appointment_date.split('T')[0] : '';
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
            ownerId: apt.owner_id,
            ownerName: apt.ownerName || 'Unknown',
            petId: apt.pet_id,
            petName: apt.petName || 'Unknown',
            doctorId: apt.doctor_id,
            doctorName: apt.doctorName || 'Unassigned',
            date: dateStr,
            time: timeStr,
            address: apt.address,
            travelFee: parseFloat(apt.travel_fee) || 0,
            status: apt.visit_status,
            notes: apt.notes
          };
        });
        setAppointments(formattedVisits);
      }
      
      if (ownersData.status === 'success') setPetOwners(ownersData.data);
      if (petsData.status === 'success') setPets(petsData.data);
      if (usersData.status === 'success') setDoctors(usersData.data.filter(u => u.role === 'Doctor'));

    } catch (err) {
      console.error(err);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentRole]);

  // Apply Role-Based Access Control (RBAC)
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserName = user?.name;
  const filteredAppointments = currentRole === 'Doctor' && currentUserName
    ? appointments.filter(a => a.doctorName === currentUserName) 
    : appointments;

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showTravelModal, setShowTravelModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Modal States
  const [assignAptId, setAssignAptId] = useState('');
  const [assignDoctorId, setAssignDoctorId] = useState('');
  const [travelAptId, setTravelAptId] = useState('');
  const [newTravelFee, setNewTravelFee] = useState('');

  // Form State
  const [ownerId, setOwnerId] = useState('');
  const [petId, setPetId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [travelFee, setTravelFee] = useState('');
  const [notes, setNotes] = useState('');

  const formatDbTime = (inputTime) => {
    let dbTime = inputTime;
    if (inputTime.includes(' ')) {
      let [t, ampm] = inputTime.split(' ');
      let [h, m] = t.split(':');
      let hNum = parseInt(h, 10);
      if (ampm && ampm.toUpperCase() === 'PM' && hNum < 12) hNum += 12;
      if (ampm && ampm.toUpperCase() === 'AM' && hNum === 12) hNum = 0;
      dbTime = `${hNum.toString().padStart(2, '0')}:${m}:00`;
    } else if (inputTime.length === 5) {
      dbTime = `${inputTime}:00`;
    }
    return dbTime;
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!ownerId || !petId || !date || !time || !address) {
      toast.error('Please fill out all required fields.');
      return;
    }

    const payload = {
      petId, ownerId, doctorId: doctorId || null,
      appointmentDate: date,
      appointmentTime: formatDbTime(time),
      address,
      travelFee: travelFee || 0,
      notes
    };

    try {
      const token = localStorage.getItem('token');
      const response = await apiFetch('http://localhost:5000/api/v1/home-visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success('Home Visit booked successfully!');
        fetchData();
        setShowBookingModal(false);
        setOwnerId(''); setPetId(''); setDoctorId(''); setDate(''); setTime('');
        setAddress(''); setContact(''); setTravelFee(''); setNotes('');
      } else {
        toast.error(data.message || 'Failed to schedule home visit');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error booking home visit');
    }
  };

  const handleAssignDoctor = async (e) => {
    e.preventDefault();
    if (!assignAptId || !assignDoctorId) return toast.error('Please select a visit and a doctor.');
    
    try {
      const token = localStorage.getItem('token');
      const response = await apiFetch(`http://localhost:5000/api/v1/home-visits/${assignAptId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ doctorId: assignDoctorId })
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success('Doctor assigned successfully!');
        fetchData();
        setShowAssignModal(false);
        setAssignAptId(''); setAssignDoctorId('');
      } else {
        toast.error(data.message || 'Failed to assign doctor');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error assigning doctor');
    }
  };

  const handleUpdateTravelFee = async (e) => {
    e.preventDefault();
    if (!travelAptId || !newTravelFee) return toast.error('Please select a visit and enter a fee.');
    
    try {
      const token = localStorage.getItem('token');
      const response = await apiFetch(`http://localhost:5000/api/v1/home-visits/${travelAptId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ travelFee: newTravelFee })
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success('Travel fee updated successfully!');
        fetchData();
        setShowTravelModal(false);
        setTravelAptId(''); setNewTravelFee('');
      } else {
        toast.error(data.message || 'Failed to update travel fee');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error updating travel fee');
    }
  };

  const handleUpdateStatus = async (aptId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (newStatus === 'Cancelled') {
        const res = await apiFetch(`http://localhost:5000/api/v1/home-visits/${aptId}`, {
          method: 'DELETE',
          
        });
        const data = await res.json();
        if (data.success) {
          toast.success('Home visit cancelled.');
          fetchData();
        } else {
          toast.error(data.message || 'Failed to cancel');
        }
      } else {
        const res = await apiFetch(`http://localhost:5000/api/v1/home-visits/${aptId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ visitStatus: newStatus })
        });
        const data = await res.json();
        if (data.success) {
          toast.success(`Home visit marked ${newStatus.toLowerCase()}.`);
          fetchData();
        } else {
          toast.error(data.message || 'Failed to update status');
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Error updating status');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Completed': return 'badge-success';
      case 'In Progress': return 'badge-warning';
      case 'Emergency': return 'badge-danger';
      case 'Cancelled': return 'badge-danger';
      default: return 'badge-info';
    }
  };

  const todaysVisits = filteredAppointments.filter(a => ['Scheduled', 'In Progress', 'Upcoming'].includes(a.status));
  const pastVisits = filteredAppointments.filter(a => ['Completed', 'Cancelled'].includes(a.status));

  const todaysCount = todaysVisits.length;
  const upcomingCount = todaysVisits.filter(a => a.status === 'Scheduled' || a.status === 'Upcoming').length;
  const inProgressCount = todaysVisits.filter(a => a.status === 'In Progress').length;
  const completedCount = pastVisits.filter(a => a.status === 'Completed').length;

  return (
    <div className="home-visits-page" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {loading && <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm"><Loader className="animate-spin text-primary" size={32} /></div>}
      
      {/* 1. Page Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Home size={28} style={{ color: 'var(--primary-teal)' }} /> Home Visits
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Manage your scheduled off-site home visit appointments and consultations.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right', marginRight: '1rem' }}>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Fleet Status</span>
            <span style={{ display: 'block', fontSize: '0.9rem', color: 'var(--success)', fontWeight: 700 }}>Active</span>
          </div>
          {currentRole !== 'Doctor' && currentRole !== 'Vet Assistant' && (
            <button type="button" onClick={() => setShowBookingModal(true)} className="btn btn-primary" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '8px', padding: '0.6rem 1.25rem' }}>
              <Plus size={18} /> Schedule Home Visit
            </button>
          )}
        </div>
      </div>

      {/* 2. KPI Cards Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '3px solid var(--primary-teal)', padding: '1.25rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--primary-teal-light)', color: 'var(--primary-teal)' }}><Calendar size={24} /></div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Today's Home Visits</p>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '2px 0 0 0' }}>{todaysCount}</h3>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '3px solid var(--secondary-blue)', padding: '1.25rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-lg)', backgroundColor: '#e0f2fe', color: 'var(--secondary-blue)' }}><Clock size={24} /></div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Upcoming / Scheduled</p>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '2px 0 0 0' }}>{upcomingCount}</h3>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '3px solid var(--warning)', padding: '1.25rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--warning-light)', color: 'var(--warning)' }}><Activity size={24} /></div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>In Progress</p>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '2px 0 0 0' }}>{inProgressCount}</h3>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '3px solid var(--success)', padding: '1.25rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--success-light)', color: 'var(--success)' }}><Check size={24} /></div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Completed Visits</p>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '2px 0 0 0' }}>{completedCount}</h3>
          </div>
        </div>
      </div>

      {/* 3. Quick Actions Section */}
      {currentRole !== 'Doctor' && currentRole !== 'Vet Assistant' && (
        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          <button onClick={() => setShowBookingModal(true)} className="card hoverable" style={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', cursor: 'pointer', border: '1px solid var(--border)' }}>
            <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-light)', color: 'var(--text-primary)' }}><Calendar size={20} /></div>
            <div style={{ textAlign: 'left' }}><span style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem' }}>Schedule Visit</span><span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Book new visit</span></div>
          </button>
          <button onClick={() => setShowAssignModal(true)} className="card hoverable" style={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', cursor: 'pointer', border: '1px solid var(--border)' }}>
            <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-light)', color: 'var(--text-primary)' }}><User size={20} /></div>
            <div style={{ textAlign: 'left' }}><span style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem' }}>Assign Doctor</span><span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Manage field staff</span></div>
          </button>
          <button onClick={() => setShowTravelModal(true)} className="card hoverable" style={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', cursor: 'pointer', border: '1px solid var(--border)' }}>
            <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-light)', color: 'var(--text-primary)' }}><MapPin size={20} /></div>
            <div style={{ textAlign: 'left' }}><span style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem' }}>Travel Charges</span><span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Update location fees</span></div>
          </button>
          <button onClick={() => setShowHistoryModal(true)} className="card hoverable" style={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', cursor: 'pointer', border: '1px solid var(--border)' }}>
            <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-light)', color: 'var(--text-primary)' }}><FileText size={20} /></div>
            <div style={{ textAlign: 'left' }}><span style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem' }}>Visit History</span><span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>View past logs</span></div>
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: '1.5rem' }}>
        
        {/* 4. Today's Home Visits Table */}
        <div className="card" style={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 className="font-bold text-lg" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Navigation size={20} style={{ color: 'var(--primary-teal)' }}/> Active Home Visits
            </h3>
          </div>
          
          {todaysVisits.length === 0 ? (
             <div style={{ padding: '3rem 1rem', textAlign: 'center', backgroundColor: 'var(--bg-light)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border)' }}>
                <Home size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem auto', opacity: 0.5 }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>No Active Visits Scheduled</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem', maxWidth: '300px', margin: '0 auto 1.5rem auto' }}>{(currentRole === 'Doctor' || currentRole === 'Vet Assistant') ? 'You have no home visits scheduled currently.' : 'Start by scheduling a new home consultation appointment for your field doctors.'}</p>
                {currentRole !== 'Doctor' && currentRole !== 'Vet Assistant' && (
                  <button type="button" onClick={() => setShowBookingModal(true)} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={16} /> Schedule Home Visit
                  </button>
                )}
             </div>
          ) : (
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Patient & Owner</th>
                    <th>Address / Route</th>
                    <th>Date & Time</th>
                    <th>Doctor</th>
                    <th style={{ textAlign: 'right' }}>Travel Fee</th>
                    <th style={{ textAlign: 'center' }}>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {todaysVisits.map(apt => (
                    <tr key={apt.id}>
                      <td>
                        <span className="font-bold" style={{ display: 'block' }}>{apt.petName}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{apt.ownerName}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', maxWidth: '200px' }}>
                          <MapPin size={12} style={{ color: 'var(--text-muted)', marginTop: '2px', flexShrink: 0 }} />
                          <span style={{ fontSize: '0.8rem', lineHeight: 1.2 }}>{apt.address}</span>
                        </div>
                      </td>
                      <td>
                        <span className="font-semibold" style={{ display: 'block', fontSize: '0.85rem' }}>{apt.time}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{apt.date}</span>
                      </td>
                      <td>{apt.doctorName}</td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>
                        LKR {apt.travelFee.toLocaleString()}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`badge ${getStatusBadgeClass(apt.status)}`} style={{ fontSize: '0.7rem' }}>{apt.status}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          {apt.status === 'Scheduled' && <button onClick={() => handleUpdateStatus(apt.id, 'In Progress')} className="btn btn-secondary btn-sm" style={{ color: 'var(--warning)' }} title="Mark In Progress"><Activity size={14} /></button>}
                          <button onClick={() => handleUpdateStatus(apt.id, 'Completed')} className="btn btn-secondary btn-sm" style={{ color: 'var(--success)' }} title="Mark Completed"><Check size={14} /></button>
                          <button onClick={() => handleUpdateStatus(apt.id, 'Cancelled')} className="btn btn-secondary btn-sm" style={{ color: 'var(--danger)' }} title="Cancel Visit"><XCircle size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 8. Completed Visits Section */}
      <div className="card">
         <h4 className="font-bold text-sm mb-4" style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Past & Completed Home Visits</h4>
         {pastVisits.length === 0 ? (
             <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No past records found in the system.</p>
          ) : (
            <div className="table-responsive">
              <table className="custom-table" style={{ fontSize: '0.85rem' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '0.75rem 1rem' }}>Pet / Owner</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Visit Address</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Date & Doctor</th>
                    <th style={{ textAlign: 'right', padding: '0.75rem 1rem' }}>Amount Paid</th>
                    <th style={{ textAlign: 'center', padding: '0.75rem 1rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pastVisits.map(apt => (
                    <tr key={apt.id} style={{ transition: 'background-color 0.15s ease' }}>
                      <td style={{ padding: '1rem' }}>
                        <div>
                          <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{apt.petName}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{apt.ownerName}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', maxWidth: '280px' }}>
                          <MapPin size={12} style={{ color: 'var(--text-muted)', marginTop: '2px', flexShrink: 0 }} />
                          <span style={{ fontSize: '0.8rem', lineHeight: 1.2 }}>{apt.address || 'Address on file'}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div>
                          <span className="font-semibold" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-primary)' }}>{apt.date}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{apt.doctorName}</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--success)', padding: '1rem' }}>
                        LKR {(apt.travelFee || 0).toLocaleString()}
                      </td>
                      <td style={{ textAlign: 'center', padding: '1rem' }}>
                        <span className={`badge ${getStatusBadgeClass(apt.status)}`} style={{ fontSize: '0.7rem' }}>{apt.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>

      {showBookingModal && (
        <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="card animate-fade-in modal-content" style={{ maxWidth: '650px', width: '100%' }} onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Home size={22} style={{ color: 'var(--primary-teal)' }} /> Schedule Home Visit
            </h3>
            
            <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Client Name *</label>
                  <FormSelect value={ownerId} onChange={setOwnerId} required options={[{ value: '', label: '-- Choose Owner --' }, ...petOwners.map(o => ({ value: o.id, label: o.name }))] } />
                </div>
                <div className="form-group">
                  <label className="form-label">Patient Pet *</label>
                  <FormSelect value={petId} onChange={setPetId} required options={[{ value: '', label: '-- Select Pet --' }, ...pets.map(p => ({ value: p.id, label: `${p.name} (${p.breed})` }))] } />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group" style={{ flex: 2 }}>
                  <label className="form-label">Visit Address *</label>
                  <input type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full street address and city" required />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Contact No.</label>
                  <input type="text" className="form-control" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="e.g. +94 77 123 4567" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Assigned Doctor</label>
                  <FormSelect value={doctorId} onChange={setDoctorId} options={[{ value: '', label: '-- Select Doctor --' }, ...doctors.map(doc => ({ value: doc.id, label: doc.name }))] } />
                </div>
                <div className="form-group">
                  <label className="form-label">Travel Charges (LKR)</label>
                  <input type="number" className="form-control" value={travelFee} onChange={(e) => setTravelFee(e.target.value)} placeholder="e.g. 1500" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Visit Date *</label>
                  <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Estimated Time *</label>
                  <input type="text" className="form-control" value={time} onChange={(e) => setTime(e.target.value)} placeholder="e.g. 02:00 PM" required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Visit Notes / Reason</label>
                <textarea className="form-control" rows="2" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Reason for home visit, specific instructions, gate codes..." />
              </div>

              <div className="modal-actions" style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowBookingModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Schedule Visit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAssignModal && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="card animate-fade-in modal-content" style={{ maxWidth: '500px', width: '100%' }} onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={22} style={{ color: 'var(--primary-teal)' }} /> Assign Doctor to Route
            </h3>
            <form onSubmit={handleAssignDoctor} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Select Active Dispatch *</label>
                <FormSelect value={assignAptId} onChange={setAssignAptId} required options={[{ value: '', label: '-- Choose Visit --' }, ...todaysVisits.filter(v => v.status === 'Scheduled').map(v => ({ value: v.id, label: `${v.petName} (${v.address}) - ${v.time}` }))] } />
              </div>
              <div className="form-group">
                <label className="form-label">Select Field Doctor *</label>
                <FormSelect value={assignDoctorId} onChange={setAssignDoctorId} required options={[{ value: '', label: '-- Choose Doctor --' }, ...doctors.map(doc => ({ value: doc.id, label: doc.name }))] } />
              </div>
              <div className="modal-actions" style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowAssignModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Assignment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showTravelModal && (
        <div className="modal-overlay" onClick={() => setShowTravelModal(false)}>
          <div className="card animate-fade-in modal-content" style={{ maxWidth: '500px', width: '100%' }} onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={22} style={{ color: 'var(--primary-teal)' }} /> Update Travel Charges
            </h3>
            <form onSubmit={handleUpdateTravelFee} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Select Active Visit *</label>
                <FormSelect value={travelAptId} onChange={setTravelAptId} required options={[{ value: '', label: '-- Choose Visit --' }, ...todaysVisits.map(v => ({ value: v.id, label: `${v.petName} (${v.address})` }))] } />
              </div>
              <div className="form-group">
                <label className="form-label">New Travel Fee (LKR) *</label>
                <input type="number" className="form-control" value={newTravelFee} onChange={(e) => setNewTravelFee(e.target.value)} placeholder="e.g. 2000" required />
              </div>
              <div className="modal-actions" style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowTravelModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Update Fee</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showHistoryModal && (
        <div className="modal-overlay" onClick={() => setShowHistoryModal(false)}>
          <div className="card animate-fade-in modal-content" style={{ maxWidth: '800px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
              <FileText size={22} style={{ color: 'var(--primary-teal)' }} /> Detailed Visit History
            </h3>
            {pastVisits.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No historical data found.</p>
            ) : (
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Patient</th>
                      <th>Doctor</th>
                      <th>Address</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pastVisits.map(apt => (
                      <tr key={apt.id}>
                        <td>{apt.date}</td>
                        <td className="font-bold">{apt.petName}</td>
                        <td>{apt.doctorName}</td>
                        <td style={{ fontSize: '0.8rem' }}>{apt.address}</td>
                        <td><span className={`badge ${getStatusBadgeClass(apt.status)}`}>{apt.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="modal-actions" style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem' }}>
              <button type="button" onClick={() => setShowHistoryModal(false)} className="btn btn-secondary">Close History</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
