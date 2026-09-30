import { apiFetch } from '../utils/api';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Loader, Mail, Calendar, User, Search, Eye, CheckCircle2, AlertTriangle, Send, X } from 'lucide-react';
import FormSelect from './FormSelect';

export default function ReminderQueue() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState('All'); // 'All', 'Tomorrow', 'Day After', 'Later'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [activeApt, setActiveApt] = useState(null);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [emailText, setEmailText] = useState('');
  const [sending, setSending] = useState(false);

  const getDayStrOffset = (offset) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const todayStr = getDayStrOffset(0);
  const tomorrowStr = getDayStrOffset(1);
  const dayAfterStr = getDayStrOffset(2);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      const res = await apiFetch('http://localhost:5000/api/v1/appointments/upcoming-reminders', { headers });
      const data = await res.json();
      
      if (res.ok && data.status === 'success') {
        setReminders(data.data || []);
      } else {
        toast.error(data.message || 'Failed to load reminders queue');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error loading reminders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const openSendModal = (apt) => {
    let timeStr = apt.appointment_time || '';
    if (timeStr && timeStr.includes(':')) {
        const [hour, minute] = timeStr.split(':');
        const hr = parseInt(hour, 10);
        const ampm = hr >= 12 ? 'PM' : 'AM';
        const hr12 = hr % 12 || 12;
        timeStr = `${hr12.toString().padStart(2, '0')}:${minute} ${ampm}`;
    }

    const defaultMessage = `Dear ${apt.ownerName},

This is a reminder that your pet ${apt.petName} has an appointment for "${apt.notes || 'General Consultation'}" with ${apt.doctorName || 'our Veterinary staff'} at PetCare Pro.

Scheduled Time: ${timeStr} on ${apt.appointment_date}

Please bring your pet on a leash or in a suitable carrier. If you need to reschedule or cancel, please contact us at +94 11 234 5678.

Best regards,
PetCare Pro Animal Hospital
No. 45, Temple Road, Colombo 07`;

    setActiveApt(apt);
    setRecipientEmail(apt.ownerEmail || '');
    setEmailText(defaultMessage);
  };

  const handleSendReminder = async () => {
    if (!activeApt) return;
    if (!recipientEmail || recipientEmail.trim() === '') {
      toast.error('Recipient email address cannot be empty.');
      return;
    }
    setSending(true);
    try {
      const token = localStorage.getItem('token');
      const res = await apiFetch(`http://localhost:5000/api/v1/appointments/${activeApt.id}/send-reminder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          messageBody: emailText,
          customRecipientEmail: recipientEmail
        })
      });
      const data = await res.json();
      
      if (res.ok && data.status === 'success') {
        toast.success(`Reminder email sent successfully!`);
        setActiveApt(null);
        fetchReminders();
      } else {
        toast.error(data.message || 'Failed to dispatch email reminder');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error sending reminder');
    } finally {
      setSending(false);
    }
  };

  const filteredReminders = reminders.filter(r => {
    // Search filter
    const matchesSearch = 
      r.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.ownerEmail && r.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    // Date tabs filter
    const dateStr = r.appointment_date;
    if (filterTab === 'Tomorrow') {
      return dateStr === tomorrowStr;
    } else if (filterTab === 'Day After') {
      return dateStr === dayAfterStr;
    } else if (filterTab === 'Later') {
      return dateStr !== todayStr && dateStr !== tomorrowStr && dateStr !== dayAfterStr;
    }
    return true; // 'All'
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <Mail size={28} style={{ color: 'var(--primary-teal)', marginTop: '4px' }} /> Appointment Reminders Desk
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Review upcoming appointments for tomorrow and beyond, edit compiled notification templates, and dispatch reminder emails.
          </p>
        </div>
      </div>

      {/* Tabs and Search Selector */}
      <div className="page-header-actions" style={{ backgroundColor: "#fff", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div className="page-header-actions" style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap", flex: 1, minWidth: 0 }}>
          {/* Search Input */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Search pet or owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="app-navbar__search-input"
              style={{ width: '100%', paddingLeft: '2.25rem', height: '38px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.85rem' }}
            />
          </div>

          {/* Time Filter Dropdown */}
          <div style={{ width: '100%', maxWidth: '240px' }}>
            <FormSelect
              value={filterTab}
              onChange={(val) => setFilterTab(val)}
              options={[
                { value: 'All', label: 'All Days' },
                { value: 'Tomorrow', label: 'Tomorrow' },
                { value: 'Day After', label: 'Day After Tomorrow' },
                { value: 'Later', label: 'Later' }
              ]}
              placeholder="Filter by time range"
            />
          </div>
        </div>

        {/* Clear Filters Button */}
        {(filterTab !== 'All' || searchQuery !== '') && (
          <button
            type="button"
            onClick={() => {
              setFilterTab('All');
              setSearchQuery('');
            }}
            className="btn btn-secondary"
            style={{ 
              height: '38px', 
              padding: '0 12px', 
              fontSize: '0.8rem', 
              borderRadius: '8px', 
              border: '1px solid var(--border)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px', 
              color: 'var(--danger)', 
              backgroundColor: '#fef2f2', 
              fontWeight: 600, 
              cursor: 'pointer' 
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px', flexDirection: 'column', gap: '1rem' }}>
          <Loader className="animate-spin" style={{ color: 'var(--primary-teal)', animation: 'spin 1s linear infinite' }} size={32} />
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading upcoming reminders queue...</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Desktop view */}
          <div className="table-responsive ledger-desktop-table">
            <table className="custom-table">
              <thead>
                <tr style={{ backgroundColor: '#f8fafc' }}>
                  <th>Date & Time</th>
                  <th>Patient & Owner</th>
                  <th>Contact Email</th>
                  <th>Doctor Assigned</th>
                  <th>Reminder Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReminders.length > 0 ? (
                  filteredReminders.map((apt) => {
                    const isSent = apt.reminder_sent === 1 || apt.reminder_sent === true;
                    
                    let dateBadge = null;
                    if (apt.appointment_date === tomorrowStr) {
                      dateBadge = <span className="badge badge-warning" style={{ fontSize: '0.6rem', padding: '1px 5px', marginLeft: '6px' }}>Tomorrow</span>;
                    } else if (apt.appointment_date === dayAfterStr) {
                      dateBadge = <span className="badge badge-info" style={{ fontSize: '0.6rem', padding: '1px 5px', marginLeft: '6px' }}>Day After</span>;
                    }

                    return (
                      <tr key={apt.id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{apt.appointment_date}{dateBadge}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{apt.appointment_time}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{apt.petName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Owner: {apt.ownerName}</div>
                        </td>
                        <td>
                          {apt.ownerEmail ? (
                            <span style={{ fontSize: '0.85rem' }}>{apt.ownerEmail}</span>
                          ) : (
                            <span style={{ color: 'var(--danger)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <AlertTriangle size={12} /> No Email Registered
                            </span>
                          )}
                        </td>
                        <td>
                          <span style={{ fontSize: '0.85rem' }}>{apt.doctorName || 'None'}</span>
                        </td>
                        <td>
                          {isSent ? (
                            <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem' }}>
                              <CheckCircle2 size={12} /> Sent
                            </span>
                          ) : (
                            <span className="badge" style={{ fontSize: '0.7rem', backgroundColor: '#fff7ed', color: '#ea580c', border: '1px solid #ffedd5', fontWeight: 600 }}>
                              Pending
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            className={`btn btn-sm ${isSent ? 'btn-secondary' : 'btn-primary'}`}
                            onClick={() => openSendModal(apt)}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}
                          >
                            <Send size={12} /> {isSent ? 'Resend Email' : 'Send Email'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                      <Mail size={36} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }} />
                      <p style={{ margin: 0, fontWeight: 600 }}>No upcoming appointments fit the selected filters.</p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem' }}>All appointment reminders may have already been dispatched.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile view */}
          <div className="ledger-mobile-list" style={{ padding: '1rem' }}>
            {filteredReminders.length > 0 ? (
              filteredReminders.map((apt) => {
                const isSent = apt.reminder_sent === 1 || apt.reminder_sent === true;
                let dateBadge = null;
                if (apt.appointment_date === tomorrowStr) {
                  dateBadge = <span className="badge badge-warning" style={{ fontSize: '0.6rem', padding: '1px 5px', marginLeft: '6px' }}>Tomorrow</span>;
                } else if (apt.appointment_date === dayAfterStr) {
                  dateBadge = <span className="badge badge-info" style={{ fontSize: '0.6rem', padding: '1px 5px', marginLeft: '6px' }}>Day After</span>;
                }

                return (
                  <div key={apt.id} className="ledger-mobile-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div className="ledger-mobile-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{apt.appointment_date}{dateBadge}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{apt.appointment_time}</div>
                      </div>
                      <div>
                        {isSent ? (
                          <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem' }}>
                            <CheckCircle2 size={12} /> Sent
                          </span>
                        ) : (
                          <span className="badge" style={{ fontSize: '0.7rem', backgroundColor: '#fff7ed', color: '#ea580c', border: '1px solid #ffedd5', fontWeight: 600 }}>
                            Pending
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <div style={{ fontSize: '0.85rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Patient:</span> <strong style={{ color: 'var(--text-primary)' }}>{apt.petName}</strong>
                      </div>
                      <div style={{ fontSize: '0.85rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Owner:</span> <strong style={{ color: 'var(--text-primary)' }}>{apt.ownerName}</strong>
                      </div>
                      <div style={{ fontSize: '0.85rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Email:</span>{' '}
                        {apt.ownerEmail ? (
                          <span style={{ fontFamily: 'inherit' }}>{apt.ownerEmail}</span>
                        ) : (
                          <span style={{ color: 'var(--danger)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <AlertTriangle size={12} /> No Email Registered
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.85rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Doctor:</span> <span>{apt.doctorName || 'None'}</span>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
                      <button
                        type="button"
                        className={`btn btn-sm ${isSent ? 'btn-secondary' : 'btn-primary'}`}
                        onClick={() => openSendModal(apt)}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.75rem', width: '100%', padding: '0.5rem' }}
                      >
                        <Send size={12} /> {isSent ? 'Resend Email' : 'Send Email'}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                <Mail size={28} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem' }}>No reminders found.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Template Editing Modal */}
      {activeApt && (
        <div className="modal-overlay" onClick={() => setActiveApt(null)}>
          <div className="card animate-fade-in modal-content" style={{ maxWidth: '600px', width: '100%' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              <h3 className="font-bold text-lg" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <Mail size={20} style={{ color: 'var(--primary-teal)' }} /> Compile & Edit Reminder Email
              </h3>
              <button type="button" onClick={() => setActiveApt(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Owner:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{activeApt.ownerName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Patient Pet:</span>
                  <strong>{activeApt.petName} ({activeApt.petBreed || 'Unknown'})</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Appointment Schedule:</span>
                  <strong>{activeApt.appointment_date} at {activeApt.appointment_time}</strong>
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 600 }}>Recipient Email Address *</label>
                <input
                  type="email"
                  className="form-control"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="Enter email address..."
                  style={{
                    fontSize: '0.85rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    width: '100%',
                    backgroundColor: '#fff',
                    color: 'var(--text-primary)'
                  }}
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 600 }}>Message Body (Editable Template) *</label>
                <textarea
                  className="form-control"
                  rows="10"
                  value={emailText}
                  onChange={(e) => setEmailText(e.target.value)}
                  style={{
                    fontFamily: 'inherit',
                    fontSize: '0.85rem',
                    lineHeight: '1.5',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    width: '100%',
                    resize: 'vertical'
                  }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setActiveApt(null)}
                  className="btn btn-secondary"
                  disabled={sending}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendReminder}
                  className="btn btn-primary animate-pulse-subtle"
                  disabled={sending || !emailText.trim()}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  {sending ? (
                    <>
                      <Loader className="animate-spin" size={14} style={{ animation: 'spin 1s linear infinite' }} />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={14} /> Send Email Reminder
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
