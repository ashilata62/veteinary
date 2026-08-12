import { apiFetch } from '../utils/api';
import React, { useState } from 'react';
import { Activity, Thermometer, Droplets, CheckCircle, Clock, Plus, ClipboardList, Loader } from 'lucide-react';
import FormSelect from './FormSelect';
import toast from 'react-hot-toast';

export default function TreatmentNotes() {
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState('');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingNotes, setFetchingNotes] = useState(false);
  
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState('observation');

  const fetchPets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await apiFetch('/api/v1/pets');
      const data = await res.json();
      if (data.status === 'success') {
        setPets(data.data);
        if (data.data.length > 0) {
          setSelectedPetId(data.data[0].id);
        }
      } else {
        toast.error('Failed to load pets registry');
      }
    } catch (err) {
      toast.error('Failed to load pets registry');
    } finally {
      setLoading(false);
    }
  };

  const fetchNotes = async (petId) => {
    try {
      setFetchingNotes(true);
      const token = localStorage.getItem('token');
      const res = await apiFetch(`/api/v1/treatment-notes?petId=${petId}`);
      const data = await res.json();
      if (res.ok) {
        setNotes(data);
      } else {
        toast.error(data.message || 'Failed to load progress logs');
      }
    } catch (err) {
      toast.error('Failed to load progress logs');
    } finally {
      setFetchingNotes(false);
    }
  };

  React.useEffect(() => {
    fetchPets();
  }, []);

  React.useEffect(() => {
    if (selectedPetId) {
      fetchNotes(selectedPetId);
    }
  }, [selectedPetId]);

  const activePet = pets.find(p => p.id === selectedPetId);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote) return;

    const payload = {
      pet_id: selectedPetId,
      note_type: noteType,
      note_text: newNote
    };

    try {
      const token = localStorage.getItem('token');
      const res = await apiFetch('/api/v1/treatment-notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Clinical log entry appended successfully.');
        setNewNote('');
        fetchNotes(selectedPetId);
      } else {
        toast.error(data.message || 'Failed to append log entry');
      }
    } catch (err) {
      toast.error('Network error while saving progress log');
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'vitals': return <Thermometer size={16} />;
      case 'medication': return <Droplets size={16} />;
      default: return <Activity size={16} />;
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'vitals': return 'var(--danger)';
      case 'medication': return 'var(--primary-teal)';
      default: return 'var(--secondary-blue)';
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', flexDirection: 'column', gap: '1rem' }}>
        <Loader className="animate-spin" style={{ color: 'var(--primary-teal)', animation: 'spin 1s linear infinite' }} size={32} />
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading treatment progress panel...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Treatment Progress & Notes
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Log observation charts, track medication administration, and record patient vitals.
          </p>
        </div>
        <div className="treatment-pet-select">
          <FormSelect
            value={selectedPetId}
            onChange={setSelectedPetId}
            options={pets.map((p) => ({
              value: p.id,
              label: `${p.name} (${p.breed || p.species || ''})`,
            }))}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        
        {/* Form Column */}
        <div className="card" style={{ height: 'fit-content' }}>
          <h3 className="font-bold text-lg mb-4" style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
            <ClipboardList size={20} style={{ color: 'var(--primary-teal)' }} />
            Add Clinical Log
          </h3>
          
          <div style={{ backgroundColor: 'var(--primary-teal-light)', color: 'var(--primary-teal)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', fontWeight: '600', marginBottom: '1.25rem' }}>
            Currently Logging For: <strong>{activePet?.name || 'Unknown Pet'}</strong>
          </div>

          <form onSubmit={handleAddNote} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Log Type</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="button" onClick={() => setNoteType('observation')} className={`btn ${noteType === 'observation' ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem' }}>Observation</button>
                <button type="button" onClick={() => setNoteType('medication')} className={`btn ${noteType === 'medication' ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem' }}>Medication</button>
                <button type="button" onClick={() => setNoteType('vitals')} className={`btn ${noteType === 'vitals' ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem' }}>Vitals</button>
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Clinical Details</label>
              <textarea 
                className="form-control" 
                rows="4" 
                value={newNote} 
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="E.g. Fever improving, appetite normal, resting comfortably..."
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '0.5rem' }}>
              <Plus size={16} /> Append Log Entry
            </button>
          </form>
        </div>

        {/* Timeline Column */}
        <div className="card">
          <h3 className="font-bold text-lg mb-4" style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
            <Clock size={20} style={{ color: 'var(--text-secondary)' }} />
            Active Progress Log
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', paddingLeft: '1.5rem', marginTop: '1rem' }}>
            {fetchingNotes ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                <Loader className="animate-spin" style={{ color: 'var(--primary-teal)', animation: 'spin 1s linear infinite' }} size={24} />
              </div>
            ) : notes.length > 0 ? (
              <>
                <div style={{ position: 'absolute', top: '10px', bottom: '10px', left: '7px', width: '2px', backgroundColor: 'var(--border)' }} />
                
                {notes.map(note => (
                  <div key={note.id} style={{ position: 'relative', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                    <div style={{ 
                        position: 'absolute', top: '15px', left: '-30px', 
                        width: '24px', height: '24px', borderRadius: '50%', 
                        backgroundColor: '#fff', border: `2px solid ${getTypeColor(note.note_type)}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: getTypeColor(note.note_type)
                      }}>
                      {getTypeIcon(note.note_type)}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '4px' }}>
                      <span className="font-semibold" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                        {note.note_type} {note.user_name ? `• ${note.user_name}` : ''}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{note.time}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                      {note.note_text}
                    </p>
                  </div>
                ))}
              </>
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No active treatment logs found for this patient.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
