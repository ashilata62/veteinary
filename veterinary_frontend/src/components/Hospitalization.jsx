import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import { Shield, Plus, HeartPulse, CheckSquare, Trash2, Calendar, Clipboard, Loader, Users, AlertTriangle, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Hospitalization() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cagesLoading, setCagesLoading] = useState(true);
  const [showAdmitModal, setShowAdmitModal] = useState(false);
  const [selectedCage, setSelectedCage] = useState(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');

  const cageTemplates = [
    { id: 'ICU-01', name: 'ICU Unit 1', type: 'ICU' },
    { id: 'ICU-02', name: 'ICU Unit 2', type: 'ICU' },
    { id: 'CAGE-A1', name: 'Cage A-1 (Large)', type: 'Standard Large' },
    { id: 'CAGE-B2', name: 'Cage B-2 (Medium)', type: 'Standard Medium' },
    { id: 'CAGE-C3', name: 'Cage C-3 (Small)', type: 'Standard Small' },
    { id: 'CAGE-D4', name: 'Cage D-4 (Small)', type: 'Standard Small' }
  ];

  // Form states
  const [selectedPetId, setSelectedPetId] = useState('');
  const [admissionReason, setAdmissionReason] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Main board cages state - synced with backend
  const [cages, setCages] = useState([]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load Pets
        const petsRes = await apiFetch('/api/v1/pets');
        const petsData = await petsRes.json();
        if (petsData.status === 'success') {
          setPets(petsData.data);
        }

        // Load Cages
        const cagesRes = await apiFetch('/api/v1/hospitalization/cages');
        const cagesData = await cagesRes.json();
        if (cagesData.status === 'success') {
          setCages(cagesData.data);
        }
      } catch (err) {
        console.error('Failed to load initial hospitalization data:', err);
        toast.error('Failed to sync board with backend.');
      } finally {
        setLoading(false);
        setCagesLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const handleAdmitClick = (cage) => {
    setSelectedCage(cage);
    setSelectedPetId('');
    setAdmissionReason('');
    setSpecialInstructions('');
    setShowAdmitModal(true);
  };

  const handleAdmitSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPetId || !admissionReason) {
      toast.error('Please choose a pet and provide a reason for hospitalization');
      return;
    }

    const chosenPet = pets.find(p => p.id === selectedPetId);
    if (!chosenPet) return;

    try {
      const res = await apiFetch(`/api/v1/hospitalization/cages/${selectedCage.id}/admit`, {
        method: 'POST',
        body: JSON.stringify({ petId: selectedPetId, reason: admissionReason })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setCages(prev => prev.map(c => {
          if (c.id === selectedCage.id) {
            return {
              ...c,
              status: 'Occupied',
              pet_id: selectedPetId,
              petName: chosenPet.name,
              breed: chosenPet.breed,
              photo: chosenPet.photo_url || chosenPet.photo || '',
              reason: admissionReason,
              checkIn: data.data.checkIn,
              flowsheet: data.data.flowsheet
            };
          }
          return c;
        }));
        toast.success(`${chosenPet.name} admitted to ${selectedCage.name} successfully.`);
        setShowAdmitModal(false);
      } else {
        toast.error(data.message || 'Failed to admit patient.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error admitting patient.');
    }
  };

  const handleDischarge = async (cageId) => {
    if (window.confirm('Are you sure you want to discharge this patient?')) {
      try {
        const res = await apiFetch(`/api/v1/hospitalization/cages/${cageId}/discharge`, {
          method: 'POST'
        });
        const data = await res.json();
        if (data.status === 'success') {
          setCages(prev => prev.map(c => {
            if (c.id === cageId) {
              return {
                ...c,
                status: 'Cleaning Needed',
                pet_id: null,
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
        } else {
          toast.error(data.message || 'Failed to discharge patient.');
        }
      } catch (err) {
        console.error(err);
        toast.error('Network error discharging patient.');
      }
    }
  };

  const toggleFlowsheetItem = async (cageId, task) => {
    const cage = cages.find(c => c.id === cageId);
    if (!cage || !cage.flowsheet) return;

    const updatedFlowsheet = {
      ...cage.flowsheet,
      [task]: !cage.flowsheet[task]
    };

    try {
      const res = await apiFetch(`/api/v1/hospitalization/cages/${cageId}/flowsheet`, {
        method: 'PUT',
        body: JSON.stringify({ flowsheet: updatedFlowsheet })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setCages(prev => prev.map(c => {
          if (c.id === cageId) {
            return {
              ...c,
              flowsheet: updatedFlowsheet
            };
          }
          return c;
        }));
        toast.success('Flowsheet task checklist updated');
      } else {
        toast.error(data.message || 'Failed to update flowsheet.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error updating flowsheet.');
    }
  };

  const markCleaned = async (cageId) => {
    try {
      const res = await apiFetch(`/api/v1/hospitalization/cages/${cageId}/clean`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.status === 'success') {
        setCages(prev => prev.map(c => {
          if (c.id === cageId) {
            return { ...c, status: 'Vacant' };
          }
          return c;
        }));
        toast.success('Cage sanitized & marked vacant.');
      } else {
        toast.error(data.message || 'Failed to clean cage.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error cleaning cage.');
    }
  };

  const handleAddCage = async () => {
    if (!selectedTemplateId) {
      toast.error('Please select a cage from the dropdown');
      return;
    }
    const template = cageTemplates.find(t => t.id === selectedTemplateId);
    if (!template) return;
    
    // Check if already on the board
    const exists = cages.some(c => c.id === template.id);
    if (exists) {
      toast.error(`${template.name} is already added to the board.`);
      return;
    }
    
    const newCage = {
      id: template.id,
      name: template.name,
      type: template.type,
      status: 'Vacant'
    };
    
    try {
      const res = await apiFetch('/api/v1/hospitalization/cages', {
        method: 'POST',
        body: JSON.stringify(newCage)
      });
      const data = await res.json();
      if (data.status === 'success') {
        setCages(prev => [...prev, { 
          ...newCage, 
          petName: '', 
          breed: '', 
          photo: '', 
          reason: '', 
          checkIn: '', 
          flowsheet: null 
        }]);
        toast.success(`${template.name} added to the board.`);
        setSelectedTemplateId('');
      } else {
        toast.error(data.message || 'Failed to add cage.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error adding cage.');
    }
  };

  const handleRemoveCage = async (cageId) => {
    const cage = cages.find(c => c.id === cageId);
    if (!cage) return;
    if (cage.status === 'Occupied') {
      toast.error('Cannot remove cage while it is occupied. Please discharge the patient first.');
      return;
    }
    
    if (window.confirm(`Are you sure you want to remove ${cage.name} from the board?`)) {
      try {
        const res = await apiFetch(`/api/v1/hospitalization/cages/${cageId}`, {
          method: 'DELETE'
        });
        const data = await res.json();
        if (data.status === 'success') {
          setCages(prev => prev.filter(c => c.id !== cageId));
          toast.success(`${cage.name} removed from the board.`);
        } else {
          toast.error(data.message || 'Failed to remove cage.');
        }
      } catch (err) {
        console.error(err);
        toast.error('Network error removing cage.');
      }
    }
  };

  const totalOccupied = cages.filter(c => c.status === 'Occupied').length;
  const totalVacant = cages.filter(c => c.status === 'Vacant').length;
  const totalCleaning = cages.filter(c => c.status === 'Cleaning Needed').length;

  if (cagesLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <Loader className="animate-spin text-primary" size={36} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
            Hospitalization & Boarding Cage Board
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '4px 0 0 0' }}>
            Live clinical view of ICU units, recovery cages, daily flowsheets, and cleaning statuses.
          </p>
        </div>
        
        {/* Add Cage Dropdown & Button */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <select 
            value={selectedTemplateId} 
            onChange={(e) => setSelectedTemplateId(e.target.value)}
            className="form-control"
            style={{ width: '220px', height: '38px', fontSize: '0.85rem', borderRadius: '8px', border: '1px solid var(--border)' }}
          >
            <option value="">-- Select Cage to Add --</option>
            {cageTemplates.map(t => (
              <option key={t.id} value={t.id}>{t.name} ({t.type})</option>
            ))}
          </select>
          <button 
            type="button" 
            onClick={handleAddCage} 
            className="btn btn-primary"
            style={{ height: '38px', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '4px', borderRadius: '8px', fontSize: '0.85rem' }}
          >
            <Plus size={16} /> Add Cage
          </button>
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
      {cages.length === 0 ? (
        <div className="card text-center" style={{ padding: '4rem 2rem', border: '2px dashed var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', borderRadius: '16px' }}>
          <HeartPulse size={48} style={{ color: 'var(--text-muted)' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>No active cages on board</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0, maxWidth: '400px' }}>
            Choose a cage or ICU unit from the dropdown at the top right, and click "Add Cage" to start monitoring patients.
          </p>
        </div>
      ) : (
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
                    <h4 style={{ fontWeight: 800, fontSize: '1.05rem', margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {cage.name}
                      {cage.status !== 'Occupied' && (
                        <button 
                          type="button"
                          onClick={() => handleRemoveCage(cage.id)} 
                          style={{ border: 'none', backgroundColor: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                          title="Remove Cage from Board"
                        >
                          <X size={14} style={{ color: 'var(--danger)' }} />
                        </button>
                      )}
                    </h4>
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
      )}

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
