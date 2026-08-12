import { apiFetch } from '../utils/api';
import React, { useState, useMemo, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Loader } from 'lucide-react';
import { Calendar, Plus, Check, XCircle, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { APPOINTMENTS, PET_OWNERS, PETS, USERS } from '../data/mockData';
import FormSelect from './FormSelect';

const _today = new Date();
const CALENDAR_YEAR = _today.getFullYear();
const CALENDAR_MONTH = _today.getMonth();
const _pad = n => n.toString().padStart(2, '0');
const TODAY_DATE = `${CALENDAR_YEAR}-${_pad(CALENDAR_MONTH + 1)}-${_pad(_today.getDate())}`;

const TIME_SLOTS = ['08:00 AM', '09:00 AM', '09:30 AM', '10:00 AM', '11:00 AM', '11:15 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '04:30 PM', '05:00 PM'];

const STATUS_DOT = {
  Upcoming: 'calendar-dot--upcoming',
  Pending: 'calendar-dot--pending',
  Completed: 'calendar-dot--completed',
  Cancelled: 'calendar-dot--cancelled',
};

const STATUS_BORDER = {
  Upcoming: '',
  Pending: 'day-schedule-item--pending',
  Completed: 'day-schedule-item--completed',
  Cancelled: 'day-schedule-item--cancelled',
};

function formatDateKey(year, month, day) {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

function parseDateKey(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
}

function getWeekStart(dateKey) {
  const d = parseDateKey(dateKey);
  const start = new Date(d);
  start.setDate(d.getDate() - d.getDay());
  return start;
}

function EncounterCard({ apt, onComplete, onCancel, getStatusBadgeClass }) {
  return (
    <div className="encounter-card">
      <div className="encounter-card-header">
        <span className="encounter-card-time">{apt.time}</span>
        <span className={`badge ${getStatusBadgeClass(apt.status)}`} style={{ fontSize: '0.65rem', padding: '3px 8px' }}>
          {apt.status}
        </span>
      </div>
      <h5 className="encounter-card-title">
        {apt.petName} ({apt.breed})
        {apt.isHomeVisit && <span className="badge badge-info" style={{ marginLeft: '8px', fontSize: '0.55rem', verticalAlign: 'middle' }}>Home Visit</span>}
      </h5>
      <p className="encounter-card-meta">Owner: {apt.ownerName}</p>
      {apt.reason && <p className="encounter-card-meta" style={{ fontStyle: 'italic' }}>{apt.reason}</p>}
      <p className="encounter-card-doctor">Doctor: {apt.doctorName}</p>
      {apt.status === 'Upcoming' && (
        <div className="encounter-card-actions">
          <button type="button" onClick={() => onComplete(apt.id)} className="btn btn-secondary btn-sm">
            <Check size={12} style={{ color: 'var(--success)' }} /> Done
          </button>
          <button type="button" onClick={() => onCancel(apt.id)} className="btn btn-secondary btn-sm">
            <XCircle size={12} style={{ color: 'var(--danger)' }} /> Cancel
          </button>
        </div>
      )}
    </div>
  );
}

function DayScheduleList({ appointments, getStatusBadgeClass, emptyMessage = 'No consultations scheduled.', onComplete, onCancel }) {
  if (!appointments.length) {
    return <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>{emptyMessage}</p>;
  }
  return (
    <div className="day-schedule-list">
      {appointments.map((apt) => (
        <div key={apt.id} className={`day-schedule-item ${STATUS_BORDER[apt.status] || ''}`}>
          <span className="day-schedule-time">{apt.time}</span>
          <div className="day-schedule-info">
            <strong>
              {apt.petName} ({apt.breed}) 
              {apt.isHomeVisit && <span className="badge badge-info" style={{ marginLeft: '8px', fontSize: '0.55rem' }}>Home Visit</span>}
            </strong>
            <span>Owner: {apt.ownerName}</span>
            <span>Doctor: {apt.doctorName}</span>
            {apt.reason && <span style={{ display: 'block', marginTop: '2px' }}>{apt.reason}</span>}
            <span className={`badge ${getStatusBadgeClass(apt.status)}`} style={{ fontSize: '0.6rem', marginTop: '4px', display: 'inline-flex' }}>
              {apt.status}
            </span>
          </div>
          {(apt.status === 'Pending' || apt.status === 'Upcoming') && onComplete && onCancel && (
            <div className="day-schedule-actions" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginLeft: 'auto' }}>
              <button type="button" onClick={() => onComplete(apt.id)} className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                <Check size={14} style={{ color: 'var(--success)' }} /> Done
              </button>
              <button type="button" onClick={() => onCancel(apt.id)} className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                <XCircle size={14} style={{ color: 'var(--danger)' }} /> Cancel
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function CellDots({ appointments }) {
  const statusCounts = {};
  appointments.forEach((a) => {
    statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
  });
  if (!appointments.length) return null;
  return (
    <>
      <div className="calendar-cell-dots" aria-hidden="true">
        {Object.entries(statusCounts).flatMap(([status, count]) =>
          Array.from({ length: Math.min(count, 3) }).map((_, i) => (
            <span key={`${status}-${i}`} className={`calendar-dot ${STATUS_DOT[status] || 'calendar-dot--upcoming'}`} />
          ))
        )}
      </div>
      <span className="calendar-cell-badge-desktop">
        {appointments.length} consult{appointments.length > 1 ? 's' : ''}
      </span>
    </>
  );
}

export default function Appointments({ currentRole }) {
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
      
      const [aptsRes, ownersRes, petsRes, usersRes] = await Promise.all([
        apiFetch('http://localhost:5000/api/v1/appointments', { headers }),
        apiFetch('http://localhost:5000/api/v1/owners', { headers }),
        apiFetch('http://localhost:5000/api/v1/pets', { headers }),
        apiFetch('http://localhost:5000/api/v1/users', { headers })
      ]);
      
      const aptsData = await aptsRes.json();
      const ownersData = await ownersRes.json();
      const petsData = await petsRes.json();
      const usersData = await usersRes.json();

      if (aptsData.status === 'success') {
        const formattedApts = aptsData.data.map(apt => {
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
            ownerId: apt.ownerId,
            ownerName: apt.ownerName || 'Unknown',
            petId: apt.pet_id,
            petName: apt.petName || 'Unknown',
            breed: apt.petName || 'Unknown', // Using petName as fallback if breed is null
            doctorId: apt.doctor_id,
            doctorName: apt.doctorName || 'Unknown',
            date: dateStr,
            time: timeStr,
            reason: apt.notes,
            status: apt.status,
            isHomeVisit: apt.appointment_type === 'Home Visit'
          };
        });
        setAppointments(currentRole === 'Doctor' ? formattedApts : formattedApts);
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
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [viewMode, setViewMode] = useState('Month');
  const [selectedDate, setSelectedDate] = useState(TODAY_DATE);
  const [currentMonth, setCurrentMonth] = useState(CALENDAR_MONTH);
  const [currentYear, setCurrentYear] = useState(CALENDAR_YEAR);

  const [ownerId, setOwnerId] = useState('');
  const [petId, setPetId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');          // final combined string e.g. "09:30 AM"
  const [timeHour, setTimeHour] = useState('');  // "01"–"12"
  const [timeMinute, setTimeMinute] = useState(''); // "00" "15" "30" "45"
  const [timeAmPm, setTimeAmPm] = useState('AM');   // "AM" | "PM"
  const [reason, setReason] = useState('');
  const [isHomeVisit, setIsHomeVisit] = useState(false);
  const [address, setAddress] = useState('');

  const appointmentsByDate = useMemo(() => {
    const map = {};
    appointments.forEach((apt) => {
      if (!map[apt.date]) map[apt.date] = [];
      map[apt.date].push(apt);
    });
    Object.keys(map).forEach((key) => {
      map[key].sort((a, b) => a.time.localeCompare(b.time));
    });
    return map;
  }, [appointments]);

  const selectedDayAppointments = appointmentsByDate[selectedDate] || [];
  const todayAppointments = appointments.filter((a) => a.date === TODAY_DATE);

  const weekDays = useMemo(() => {
    const start = getWeekStart(selectedDate);
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      const dateKey = formatDateKey(day.getFullYear(), day.getMonth(), day.getDate());
      return {
        dateKey,
        dayNum: day.getDate(),
        weekday: day.toLocaleDateString('en-US', { weekday: 'short' }),
        appointments: appointmentsByDate[dateKey] || [],
        isToday: dateKey === TODAY_DATE,
        isSelected: dateKey === selectedDate,
      };
    });
  }, [selectedDate, appointmentsByDate]);

  const weekAllAppointments = useMemo(
    () => weekDays.flatMap((d) => d.appointments).sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)),
    [weekDays]
  );

  const calendarCells = useMemo(() => {
    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      cells.push({ empty: true, key: `empty-${i}` });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = formatDateKey(currentYear, currentMonth, day);
      cells.push({
        empty: false,
        day,
        dateKey,
        appointments: appointmentsByDate[dateKey] || [],
        isToday: dateKey === TODAY_DATE,
        isSelected: dateKey === selectedDate,
        key: dateKey,
      });
    }
    return cells;
  }, [appointmentsByDate, selectedDate, currentMonth, currentYear]);

  const shiftSelectedDate = (days) => {
    const d = parseDateKey(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(formatDateKey(d.getFullYear(), d.getMonth(), d.getDate()));
  };

  const selectedDayLabel = useMemo(() => {
    const d = parseDateKey(selectedDate);
    if (selectedDate === TODAY_DATE) return "Today's Schedule";
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }, [selectedDate]);

  const monthLabel = useMemo(() => {
    return new Date(currentYear, currentMonth, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [currentMonth, currentYear]);

  const shiftMonth = (offset) => {
    let newMonth = currentMonth + offset;
    let newYear = currentYear;
    if (newMonth > 11) { newMonth = 0; newYear++; }
    else if (newMonth < 0) { newMonth = 11; newYear--; }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const weekRangeLabel = useMemo(() => {
    const start = weekDays[0];
    const end = weekDays[6];
    const s = parseDateKey(start.dateKey);
    const e = parseDateKey(end.dateKey);
    return `${s.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${e.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  }, [weekDays]);

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    
    if (isHomeVisit && !address) {
      toast.error('Please provide an address for the home visit.');
      return;
    }

    // Build combined time string from the 3 separate pickers
    const combinedTime = (timeHour && timeMinute) ? `${timeHour}:${timeMinute} ${timeAmPm}` : time;

    if (!ownerId || !petId || !doctorId || !date || !combinedTime) {
      toast.error('Please fill out all booking fields.');
      return;
    }
    
    const combinedTime2 = (timeHour && timeMinute) ? `${timeHour}:${timeMinute} ${timeAmPm}` : time;
    let dbTime = combinedTime2;
    if (combinedTime2.includes(' ')) {
      let [t, ampm] = combinedTime2.split(' ');
      let [h, m] = t.split(':');
      let hNum = parseInt(h, 10);
      if (ampm && ampm.toUpperCase() === 'PM' && hNum < 12) hNum += 12;
      if (ampm && ampm.toUpperCase() === 'AM' && hNum === 12) hNum = 0;
      dbTime = `${hNum.toString().padStart(2, '0')}:${m}:00`;
    } else if (combinedTime2.length === 5) {
      dbTime = `${combinedTime2}:00`;
    }

    try {
      const token = localStorage.getItem('token');
      
      let endpoint = 'http://localhost:5000/api/v1/appointments';
      let payload = {
        petId, doctorId,
        appointmentDate: date,
        appointmentTime: dbTime,
        appointmentType: isHomeVisit ? 'Home Visit' : 'Clinic Visit',
        notes: reason
      };

      if (isHomeVisit) {
        endpoint = 'http://localhost:5000/api/v1/home-visits';
        payload = {
          ownerId,
          petId, 
          doctorId,
          appointmentDate: date,
          appointmentTime: dbTime,
          address: address || 'Address on file',
          travelFee: 0,
          notes: reason
        };
      }

      const response = await apiFetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      
      if (data.status === 'success' || data.success) {
        toast.success(isHomeVisit ? 'Home visit booked successfully!' : 'Appointment booked successfully!');
        fetchData();
        setSelectedDate(date);
        setViewMode('Day');
        setOwnerId(''); setPetId(''); setDoctorId(''); setDate(''); setTime(''); setTimeHour(''); setTimeMinute(''); setTimeAmPm('AM'); setReason(''); setIsHomeVisit(false); setAddress('');
        setShowBookingModal(false);
      } else {
        toast.error(data.message || 'Failed to book appointment');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error booking appointment');
    }
  };

  const handleUpdateStatus = async (aptId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (newStatus === 'Cancelled') {
        const res = await apiFetch(`http://localhost:5000/api/v1/appointments/${aptId}`, {
          method: 'DELETE',
          
        });
        const data = await res.json();
        if (data.status === 'success') {
          toast.success('Appointment cancelled successfully');
          fetchData();
        }
      } else {
        const res = await apiFetch(`http://localhost:5000/api/v1/appointments/${aptId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ status: newStatus })
        });
        const data = await res.json();
        if (data.status === 'success') {
          toast.success(`Consultation marked ${newStatus.toLowerCase()}.`);
          fetchData();
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
      case 'Pending': return 'badge-warning';
      case 'Cancelled': return 'badge-danger';
      default: return 'badge-info';
    }
  };

  const getAptsAtSlot = (slot) =>
    selectedDayAppointments.filter((a) => a.time === slot);

  const unmappedDayApts = useMemo(
    () => selectedDayAppointments.filter((a) => !TIME_SLOTS.includes(a.time)),
    [selectedDayAppointments]
  );

  return (
    <div className="appointments-page">
      {loading && <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm"><Loader className="animate-spin text-primary" size={32} /></div>}
      <div className="page-header">
        <div>
          <h1>{currentRole === 'Doctor' ? 'My Appointments' : 'Appointments Scheduler'}</h1>
          <p>
            {currentRole === 'Doctor'
              ? 'Track your daily patient consultations and schedule.'
              : 'Book vet consultations, manage timetables, and auto-dispatch digital reminders.'}
          </p>
        </div>
        {currentRole !== 'Doctor' && currentRole !== 'Vet Assistant' && (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button type="button" onClick={() => { setIsHomeVisit(true); setShowBookingModal(true); }} className="btn btn-secondary" style={{ flexShrink: 0 }}>
              <Plus size={16} /> Home Visit
            </button>
            <button type="button" onClick={() => setShowBookingModal(true)} className="btn btn-primary" style={{ flexShrink: 0 }}>
              <Plus size={16} /> Book Consultation
            </button>
          </div>
        )}
      </div>

      <div className="appointments-layout">
        <div className="appointments-calendar-section">
          <div className="card appointments-calendar-card" style={{ width: '100%' }}>
            <div className="appointments-calendar-toolbar">
              <h4 className="font-bold text-sm" style={{ color: 'var(--text-secondary)', margin: 0 }}>
                Clinic Calendar Matrix
              </h4>
              <div className="calendar-view-toggle">
                {['Day', 'Week', 'Month'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    className={viewMode === mode ? 'active' : ''}
                    onClick={() => setViewMode(mode)}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="calendar-nav-row">
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => {
                if (viewMode === 'Month') shiftMonth(-1);
                else shiftSelectedDate(viewMode === 'Week' ? -7 : -1);
              }} aria-label="Previous">
                <ChevronLeft size={16} />
              </button>
              <span className="calendar-nav-label">
                {viewMode === 'Month' ? monthLabel : viewMode === 'Week' ? weekRangeLabel : selectedDayLabel}
              </span>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => {
                if (viewMode === 'Month') shiftMonth(1);
                else shiftSelectedDate(viewMode === 'Week' ? 7 : 1);
              }} aria-label="Next">
                <ChevronRight size={16} />
              </button>
            </div>

            {viewMode === 'Month' && (
              <>
                <div className="calendar-month-wrap">
                  <div className="calendar-weekdays">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                      <span key={d}>{d}</span>
                    ))}
                  </div>
                  <div className="calendar-month-grid">
                    {calendarCells.map((cell) => {
                      if (cell.empty) {
                        return <div key={cell.key} className="calendar-day-cell calendar-day-cell--empty" />;
                      }
                      return (
                        <button
                          key={cell.key}
                          type="button"
                          className={`calendar-day-cell ${cell.isToday ? 'calendar-day-cell--today' : ''} ${cell.isSelected ? 'calendar-day-cell--selected' : ''}`}
                          onClick={() => { setSelectedDate(cell.dateKey); setViewMode('Day'); }}
                        >
                          <span className="calendar-day-num">{cell.day}</span>
                          <CellDots appointments={cell.appointments} />
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="calendar-legend">
                  <span className="calendar-legend-item"><span className="calendar-dot calendar-dot--upcoming" /> Upcoming</span>
                  <span className="calendar-legend-item"><span className="calendar-dot calendar-dot--pending" /> Pending</span>
                  <span className="calendar-legend-item"><span className="calendar-dot calendar-dot--completed" /> Completed</span>
                  <span className="calendar-legend-item"><span className="calendar-dot calendar-dot--cancelled" /> Cancelled</span>
                </div>
              </>
            )}

            {viewMode === 'Week' && (
              <div className="calendar-week-wrap">
                <div className="calendar-week-grid">
                  {weekDays.map((day) => (
                    <button
                      key={day.dateKey}
                      type="button"
                      className={`calendar-week-day ${day.isToday ? 'calendar-day-cell--today' : ''} ${day.isSelected ? 'calendar-day-cell--selected' : ''}`}
                      onClick={() => setSelectedDate(day.dateKey)}
                    >
                      <span className="calendar-week-day-name">{day.weekday}</span>
                      <span className="calendar-week-day-num">{day.dayNum}</span>
                      <CellDots appointments={day.appointments} />
                    </button>
                  ))}
                </div>
                <div className="calendar-week-events">
                  {weekDays.map((day) =>
                    day.appointments.length > 0 ? (
                      <div key={day.dateKey} className="calendar-week-day-block">
                        <p className="calendar-week-day-block-title">
                          {day.weekday} {day.dayNum}
                          {day.isToday && <span className="badge badge-info" style={{ marginLeft: '6px', fontSize: '0.6rem' }}>Today</span>}
                        </p>
                        <DayScheduleList appointments={day.appointments} getStatusBadgeClass={getStatusBadgeClass} emptyMessage="" />
                      </div>
                    ) : null
                  )}
                  {weekAllAppointments.length === 0 && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', padding: '1rem 0' }}>
                      No appointments this week.
                    </p>
                  )}
                </div>
              </div>
            )}

            {viewMode === 'Day' && (
              <div className="calendar-day-view">
                <div className="calendar-day-timeline">
                  {TIME_SLOTS.map((slot) => {
                    const apts = getAptsAtSlot(slot);
                    return (
                      <div key={slot} className={`calendar-time-row ${apts.length > 0 ? 'calendar-time-row--booked' : ''}`}>
                        <span className="calendar-time-label">{slot}</span>
                        <div className="calendar-time-slot" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                          {apts.length > 0 ? (
                            apts.map(apt => (
                              <button
                                key={apt.id}
                                type="button"
                                className={`calendar-time-event calendar-time-event--${apt.status.toLowerCase().replace(' ', '-')}`}
                                onClick={() => setSelectedDate(apt.date)}
                                style={{ width: '100%', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '2px' }}
                              >
                                <strong>
                                  {apt.petName}
                                  {apt.isHomeVisit && <span style={{ marginLeft: '4px', color: 'var(--primary-teal)', fontSize: '0.7rem' }}>[Home]</span>}
                                </strong>
                                <span>{apt.time} · {apt.ownerName}</span>
                                <span className={`badge ${getStatusBadgeClass(apt.status)}`} style={{ fontSize: '0.58rem', marginTop: '2px', alignSelf: 'flex-start' }}>
                                  {apt.status}
                                </span>
                              </button>
                            ))
                          ) : (
                            <span className="calendar-time-empty">Available</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {unmappedDayApts.length > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Other times</p>
                    <DayScheduleList appointments={unmappedDayApts} getStatusBadgeClass={getStatusBadgeClass} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="appointments-schedule-section">
          <div className="card day-schedule-panel" style={{ height: '100%', position: 'sticky', top: '1rem' }}>
            <h4 className="font-bold text-sm" style={{ color: 'var(--text-secondary)', margin: '0 0 1rem 0', textTransform: 'uppercase' }}>
              {viewMode === 'Week' ? `Week Summary · ${weekRangeLabel}` : selectedDayLabel}
            </h4>
            <DayScheduleList
              appointments={viewMode === 'Week' ? weekAllAppointments : selectedDayAppointments}
              getStatusBadgeClass={getStatusBadgeClass}
              emptyMessage={viewMode === 'Week' ? 'No appointments this week.' : 'No consultations on this date.'}
              onComplete={(id) => handleUpdateStatus(id, 'Completed')}
              onCancel={(id) => handleUpdateStatus(id, 'Cancelled')}
            />
          </div>
        </div>
      </div>

      {showBookingModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowBookingModal(false)}
        >
          <div className="card animate-fade-in modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
              <h3 className="font-bold text-lg modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <Calendar size={22} style={{ color: 'var(--primary-teal)' }} />
                Schedule Veterinary Consultation
              </h3>
              <button type="button" onClick={() => setShowBookingModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleBookAppointment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Client / Pet Owner *</label>
                  <FormSelect
                    value={ownerId}
                    onChange={(selectedOwnerId) => {
                      setOwnerId(selectedOwnerId);
                      // Auto-select first pet belonging to this owner if available
                      const ownerPets = pets.filter(p => String(p.owner_id) === String(selectedOwnerId));
                      if (ownerPets.length > 0) {
                        setPetId(ownerPets[0].id);
                      } else {
                        setPetId('');
                      }
                    }}
                    placeholder="-- Choose Owner --"
                    required
                    options={[
                      { value: '', label: '-- Choose Owner --' },
                      ...petOwners.map((o) => ({ value: o.id, label: o.name })),
                    ]}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Patient Pet *</label>
                  <FormSelect
                    value={petId}
                    onChange={setPetId}
                    placeholder="-- Select Pet --"
                    required
                    options={[
                      { value: '', label: '-- Select Pet --' },
                      // Filter pets based on selected owner
                      ...pets
                        .filter(p => ownerId ? p.owner_id === ownerId : true)
                        .map((p) => ({ value: p.id, label: `${p.name} (${p.breed})` })),
                    ]}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Consulting Doctor *</label>
                  <FormSelect
                    value={doctorId}
                    onChange={setDoctorId}
                    placeholder="-- Select Doctor --"
                    required
                    options={[
                      { value: '', label: '-- Select Doctor --' },
                      ...doctors.map((doc) => ({ value: doc.id, label: doc.name })),
                    ]}
                  />
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-light)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    <input 
                      type="checkbox" 
                      id="homeVisitToggle" 
                      checked={isHomeVisit} 
                      onChange={(e) => setIsHomeVisit(e.target.checked)} 
                      style={{ width: '18px', height: '18px', accentColor: 'var(--primary-teal)' }}
                    />
                    <label htmlFor="homeVisitToggle" style={{ marginBottom: 0, fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer' }}>
                      Schedule as Home Visit
                    </label>
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Consultation Date *</label>
                  <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Time Slot *</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {/* Hour */}
                    <select
                      className="form-control"
                      value={timeHour}
                      onChange={(e) => setTimeHour(e.target.value)}
                      required
                      style={{ flex: 2 }}
                    >
                      <option value="">HH</option>
                      {['01','02','03','04','05','06','07','08','09','10','11','12'].map(h => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                    {/* Minute */}
                    <select
                      className="form-control"
                      value={timeMinute}
                      onChange={(e) => setTimeMinute(e.target.value)}
                      required
                      style={{ flex: 2 }}
                    >
                      <option value="">MM</option>
                      {['00','15','30','45'].map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    {/* AM / PM */}
                    <select
                      className="form-control"
                      value={timeAmPm}
                      onChange={(e) => setTimeAmPm(e.target.value)}
                      style={{ flex: 1.5 }}
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {isHomeVisit && (
                <div className="form-group">
                  <label className="form-label">Home Visit Address *</label>
                  <input type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full street address..." required={isHomeVisit} />
                </div>
              )}
              
              <div className="form-group">
                <label className="form-label">Consultation Reason notes</label>
                <textarea className="form-control" rows="2" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Describe symptoms or reasons for visit..." />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowBookingModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Book & Send Reminders</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
