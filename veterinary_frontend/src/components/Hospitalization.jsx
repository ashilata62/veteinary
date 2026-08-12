import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import { Shield, Plus, HeartPulse, CheckSquare, Trash2, Calendar, Clipboard, Loader, Users, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Hospitalization() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdmitModal, setShowAdmitModal] = useState(false);
  const [selectedCage, setSelectedCage] = useState(null);

  // Form states
  const [selectedPetId, setSelectedPetId] = useState('');
  const [admissionReason, setAdmissionReason] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Main board cages state
  const [cages, setCages] = useState([
    {
      id: 'ICU-01',
      name: 'ICU Unit 1',
      type: 'ICU',
      status: 'Occupied',
      petName: 'Bella',
      breed: 'Persian Cat',
      photo: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=200',
      reason: 'Severe Dehydration & IV Fluids',
      checkIn: '2026-08-08 10:20 AM',
      flowsheet: { fed: true, meds: true, walk: false, eveningFed: false }
    },
    {
      id: 'ICU-02',
      name: 'ICU Unit 2',
      type: 'ICU',
      status: 'Vacant',
      petName: '',
      breed: '',
      photo: '',
      reason: '',
      checkIn: '',
      flowsheet: null
    },
    {
      id: 'CAGE-A1',
      name: 'Cage A-1 (Large)',
      type: 'Standard Large',
      status: 'Occupied',
      petName: 'Rocky',
      breed: 'German Shepherd',
      photo: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&q=80&w=200',
      reason: 'Post-Op Fracture Recovery',
      checkIn: '2026-08-09 08:30 AM',
      flowsheet: { fed: true, meds: false, walk: true, eveningFed: false }
    },
    {
      id: 'CAGE-B2',
      name: 'Cage B-2 (Medium)',
      type: 'Standard Medium',
      status: 'Cleaning Needed',
      petName: '',
      breed: '',
      photo: '',
      reason: '',
      checkIn: '',
      flowsheet: null
    },
    {
      id: 'CAGE-C3',
      name: 'Cage C-3 (Small)',
      type: 'Standard Small',
      status: 'Vacant',
      petName: '',
      breed: '',
      photo: '',
      reason: '',
      checkIn: '',
      flowsheet: null
    },
    {
      id: 'CAGE-D4',
      name: 'Cage D-4 (Small)',
      type: 'Standard Small',
      status: 'Vacant',
      petName: '',
      breed: '',
      photo: '',
      reason: '',
      checkIn: '',
      flowsheet: null
    }
  ]);

  useEffect(() => {
    const loadPets = async () => {
      try {
        const res = await apiFetch('/api/v1/pets');
        const data = await res.json();
        if (data.status === 'success') {
          setPets(data.data);
        }
      } catch (err) {
        console.error('Failed to load pets registry for hospitalization:', err);
      } finally {
        setLoading(false);
      }
    };
    loadPets();
  }, []);

  const handleAdmitClick = (cage) => {
    setSelectedCage(cage);
    setSelectedPetId('');
    setAdmissionReason('');
    setSpecialInstructions('');
    setShowAdmitModal(true);
  };

  const handleAdmitSubmit = (e) => {
    e.preventDefault();
    if (!selectedPetId || !admissionReason) {
      toast.error('Please choose a pet and provide a reason for hospitalization');
      return;
    }

    const chosenPet = pets.find(p => p.id === selectedPetId);
    if (!chosenPet) return;

    // Update cage
    setCages(prev => prev.map(c => {
      if (c.id === selectedCage.id) {
        return {
          ...c,
          status: 'Occupied',
          petName: chosenPet.name,
          breed: chosenPet.breed,
          photo: chosenPet.photo_url || chosenPet.photo || '',
          reason: admissionReason,
          checkIn: new Date().toLocaleString(),
          flowsheet: { fed: false, meds: false, walk: false, eveningFed: false }
        };
      }
      return c;
    }));

    toast.success(`${chosenPet.name} admitted to ${selectedCage.name} successfully.`);
    setShowAdmitModal(false);
  };

  const handleDischarge = (cageId) => {
    if (window.confirm('Are you sure you want to discharge this patient?')) {
      setCages(prev => prev.map(c => {
        if (c.id === cageId) {
          return {
            ...c,
            status: 'Cleaning Needed',
            petName: '',
            breed: '',
            photo: '',
            reason: '',
            checkIn: '',
            flowsheet: null
          };
        }
        return c;
      }));
      toast.success('Patient discharged. Cage status marked as: Cleaning Needed.');
    }
  };

  const toggleFlowsheetItem = (cageId, task) => {
    setCages(prev => prev.map(c => {
      if (c.id === cageId && c.flowsheet) {
        return {
          ...c,
          flowsheet: {
            ...c.flowsheet,
            [task]: !c.flowsheet[task]
          }
        };
      }
      return c;
    }));
    toast.success('Flowsheet task checklist updated');
  };

  const markCleaned = (cageId) => {
    setCages(prev => prev.map(c => {
      if (c.id === cageId) {
        return { ...c, status: 'Vacant' };
      }
      return c;
    }));
    toast.success('Cage sanitized & marked vacant.');
  };

  const totalOccupied = cages.filter(c => c.status === 'Occupied').length;
  const totalVacant = cages.filter(c => c.status === 'Vacant').length;
  const totalCleaning = cages.filter(c => c.status === 'Cleaning Needed').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
            Hospitalization & Boarding Cage Board
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '4px 0 0 0' }}>
            Live clinical view of ICU units, recovery cages, daily flowsheets, and cleaning statuses.
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="kpi-grid-responsive">
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', border: '1px solid var(--border)' }}>
          <div style={{ padding: '0.75rem', borderRadius: '12px', backgroundColor: 'var(--danger-light)', color: 'var(--danger)' }}>
            <HeartPulse size={20} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', margin: 0 }}>Occupied Units</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '2px 0 0 0', color: 'var(--text-primary)' }}>{totalOccupied}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', border: '1px solid var(--border)' }}>
          <div style={{ padding: '0.75rem', borderRadius: '12px', backgroundColor: 'var(--primary-teal-light)', color: 'var(--primary-teal)' }}>
            <Shield size={20} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', margin: 0 }}>Sanitized & Vacant</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '2px 0 0 0', color: 'var(--text-primary)' }}>{totalVacant}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', border: '1px solid var(--border)' }}>
          <div style={{ padding: '0.75rem', borderRadius: '12px', backgroundColor: '#fef3c7', color: '#d97706' }}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', margin: 0 }}>Sanitation Required</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '2px 0 0 0', color: 'var(--text-primary)' }}>{totalCleaning}</h3>
          </div>
        </div>
      </div>

      {/* Cages Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {cages.map((cage) => {
          const isOccupied = cage.status === 'Occupied';
          const isCleaning = cage.status === 'Cleaning Needed';

          return (
            <div 
              key={cage.id} 
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                borderLeft: `5px solid ${isOccupied ? 'var(--danger)' : isCleaning ? '#f59e0b' : 'var(--primary-teal)'}`,
                boxShadow: 'var(--shadow-sm)',
                padding: '1.5rem',
                transition: 'transform 0.2s',
                position: 'relative'
              }}
            >
              {/* Cage Title Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontWeight: 800, fontSize: '1.05rem', margin: 0, color: 'var(--text-primary)' }}>{cage.name}</h4>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Type: {cage.type}</span>
                </div>
                <span 
                  className={`badge ${isOccupied ? 'badge-danger' : isCleaning ? 'badge-warning' : 'badge-success'}`}
                  style={{ fontSize: '0.7rem', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}
                >
                  {cage.status}
                </span>
              </div>

              {/* Occupied State */}
              {isOccupied && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: 'var(--background)', padding: '0.75rem', borderRadius: '8px' }}>
                    {cage.photo ? (
                      <img 
                        src={cage.photo} 
                        alt={cage.petName} 
                        style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} 
                      />
                    ) : (
                      <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--primary-teal-light)',
                        color: 'var(--primary-teal)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '1.15rem',
                        border: '1px solid var(--primary-teal-light)'
                      }}>
                        {cage.petName ? cage.petName.charAt(0).toUpperCase() : 'P'}
                      </div>
                    )}
                    <div>
                      <span className="font-bold" style={{ display: 'block', color: 'var(--text-primary)' }}>{cage.petName}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{cage.breed}</span>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                    <div><b>Reason:</b> {cage.reason}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                      <Calendar size={12} /> Admitted: {cage.checkIn}
                    </div>
                  </div>

                  {/* Flowsheet Task Board */}
                  {cage.flowsheet && (
                    <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '0.75rem', backgroundColor: '#fcfcfc' }}>
                      <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.02em' }}>
                        📋 Daily Flowsheet Checklists
                      </span>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', cursor: 'pointer', color: 'var(--text-primary)' }}>
                          <input 
                            type="checkbox" 
                            checked={cage.flowsheet.fed} 
                            onChange={() => toggleFlowsheetItem(cage.id, 'fed')} 
                          />
                          <span>Morning Feed</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', cursor: 'pointer', color: 'var(--text-primary)' }}>
                          <input 
                            type="checkbox" 
                            checked={cage.flowsheet.meds} 
                            onChange={() => toggleFlowsheetItem(cage.id, 'meds')} 
                          />
                          <span>Medicine Given</span>
                        </label>
                        {cage.type.includes('ICU') ? null : (
                          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', cursor: 'pointer', color: 'var(--text-primary)' }}>
                            <input 
                              type="checkbox" 
                              checked={cage.flowsheet.walk} 
                              onChange={() => toggleFlowsheetItem(cage.id, 'walk')} 
                            />
                            <span>Walking / Walked</span>
                          </label>
                        )}
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', cursor: 'pointer', color: 'var(--text-primary)' }}>
                          <input 
                            type="checkbox" 
                            checked={cage.flowsheet.eveningFed} 
                            onChange={() => toggleFlowsheetItem(cage.id, 'eveningFed')} 
                          />
                          <span>Evening Feed</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                    <button 
                      onClick={() => handleDischarge(cage.id)} 
                      className="btn" 
                      style={{ fontSize: '0.75rem', padding: '6px 12px', backgroundColor: 'var(--danger-light)', color: 'var(--danger)', border: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Trash2 size={12} /> Discharge Patient
                    </button>
                  </div>
                </div>
              )}

              {/* Vacant State */}
              {!isOccupied && !isCleaning && (
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '1.5rem 0' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem', marginBottom: '1rem', textAlign: 'center' }}>
                    Cage is empty and ready for admissions.
                  </p>
                  <button 
                    onClick={() => handleAdmitClick(cage)} 
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
                  >
                    <Plus size={14} /> Admit Patient
                  </button>
                </div>
              )}

              {/* Cleaning Needed State */}
              {isCleaning && (
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '1.5rem 0' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem', marginBottom: '1rem', textAlign: 'center' }}>
                    Requires disinfection & sanitizing prior to next check-in.
                  </p>
                  <button 
                    onClick={() => markCleaned(cage.id)} 
                    className="btn btn-primary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
                  >
                    <CheckSquare size={14} /> Mark Cleaned & Sanitized
                  </button>
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Admittance Form Modal */}
      {showAdmitModal && selectedCage && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(3px)' }}>
          <div className="card animate-fade-in-up" style={{ backgroundColor: '#fff', borderRadius: 'var(--radius-xl)', padding: '2rem', width: '100%', maxWidth: '480px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <h3 className="font-bold text-lg mb-4" style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', margin: 0 }}>
              Admit Patient to {selectedCage.name}
            </h3>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <Loader className="animate-spin text-primary" style={{ margin: '0 auto' }} />
              </div>
            ) : (
              <form onSubmit={handleAdmitSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Select Patient Record *</label>
                  <select 
                    className="form-control" 
                    value={selectedPetId} 
                    onChange={(e) => setSelectedPetId(e.target.value)}
                    required
                  >
                    <option value="">-- Choose Registered Pet --</option>
                    {pets.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.breed || p.species})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Reason for Hospitalization *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={admissionReason} 
                    onChange={(e) => setAdmissionReason(e.target.value)} 
                    placeholder="e.g. Post-Op surgical monitoring, severe infection" 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Care Instructions</label>
                  <textarea 
                    className="form-control" 
                    rows="3" 
                    value={specialInstructions} 
                    onChange={(e) => setSpecialInstructions(e.target.value)} 
                    placeholder="e.g. Check temperature every 4 hours, restrict movement."
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                  <button type="button" onClick={() => setShowAdmitModal(false)} className="btn btn-secondary">Cancel</button>
                  <button type="submit" className="btn btn-primary">Admit Patient</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
