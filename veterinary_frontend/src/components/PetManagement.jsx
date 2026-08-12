import { apiFetch } from '../utils/api';
import React, { useState, useEffect } from 'react';
import { Dog, Plus, Eye, Edit3, Trash2, Calendar, FileText, BadgeInfo, Info, AlertTriangle, Loader } from 'lucide-react';
import FormSelect from './FormSelect';
import toast from 'react-hot-toast';

export default function PetManagement({ searchQuery, handleViewPet }) {
  const [pets, setPets] = useState([]);
  const [ownersList, setOwnersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form states
  const [petName, setPetName] = useState('');
  const [microchip, setMicrochip] = useState('');
  const [species, setSpecies] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('Male');
  const [neuteredStatus, setNeuteredStatus] = useState('No');
  const [breed, setBreed] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [lastVaccination, setLastVaccination] = useState('');
  const [lastDeworming, setLastDeworming] = useState('');
  const [prevHistory, setPrevHistory] = useState('');
  const [photo, setPhoto] = useState('');
  const [photoUploading, setPhotoUploading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const [petsRes, ownersRes] = await Promise.all([
        apiFetch('http://localhost:5000/api/v1/pets'),
        apiFetch('http://localhost:5000/api/v1/owners')
      ]);
      
      const petsData = await petsRes.json();
      const ownersData = await ownersRes.json();
      
      if (petsData.status === 'success') {
        setPets(petsData.data);
      }
      if (ownersData.status === 'success') {
        setOwnersList(ownersData.data);
      }
    } catch (error) {
      console.error(error);
      toast.error('Network error loading data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddPet = async (e) => {
    e.preventDefault();
    if (!petName || !species || !ownerId) {
      toast.error('Please fill out Pet Name, Species, and select an Owner.');
      return;
    }

    const payload = {
      ownerId,
      microchip,
      name: petName,
      species,
      breed,
      gender,
      neuteredStatus,
      age,
      weight,
      prevHistory,
      lastVaccination,
      lastDeworming,
      photo
    };

    const token = localStorage.getItem('token');

    try {
      if (editingPet) {
        const response = await apiFetch(`http://localhost:5000/api/v1/pets/${editingPet.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (data.status === 'success') {
          toast.success('Pet profile updated successfully.');
          fetchData();
          resetForm();
        } else {
          toast.error(data.message || 'Failed to update pet profile.');
        }
      } else {
        const response = await apiFetch('http://localhost:5000/api/v1/pets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (data.status === 'success') {
          toast.success('New Pet registered and enrolled in system successfully.');
          fetchData();
          resetForm();
        } else {
          toast.error(data.message || 'Failed to register pet.');
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('Network error. Check backend connection.');
    }
  };

  const handleEditClick = (pet) => {
    setEditingPet(pet);
    setPetName(pet.name);
    setMicrochip(pet.microchip_number || '');
    setSpecies(pet.species || '');
    setAge(pet.age || '');
    setWeight(pet.weight || '');
    setGender(pet.gender || 'Male');
    setNeuteredStatus(pet.neutered_status ? 'Yes' : 'No');
    setBreed(pet.breed || '');
    setOwnerId(pet.owner_id);
    setLastVaccination(pet.last_vaccination ? pet.last_vaccination.split('T')[0] : '');
    setLastDeworming(pet.last_deworming ? pet.last_deworming.split('T')[0] : '');
    setPrevHistory(pet.previous_medical_history || '');
    setPhoto(pet.photo_url || '');
    setShowAddForm(true);
  };

  const handleDeleteClick = (petId) => {
    setDeleteConfirmId(petId);
  };

  const confirmDelete = async () => {
    if (deleteConfirmId) {
      const token = localStorage.getItem('token');
      try {
        const response = await apiFetch(`http://localhost:5000/api/v1/pets/${deleteConfirmId}`, {
          method: 'DELETE',
          
        });
        const data = await response.json();
        if (data.status === 'success') {
          toast.success('Pet archived successfully.');
          setDeleteConfirmId(null);
          fetchData();
        } else {
          toast.error(data.message || 'Failed to delete pet.');
          setDeleteConfirmId(null);
        }
      } catch (error) {
        console.error(error);
        toast.error('Network error deleting pet.');
        setDeleteConfirmId(null);
      }
    }
  };

  const resetForm = () => {
    setPetName('');
    setMicrochip('');
    setSpecies('');
    setAge('');
    setWeight('');
    setGender('Male');
    setNeuteredStatus('No');
    setBreed('');
    setOwnerId('');
    setLastVaccination('');
    setLastDeworming('');
    setPrevHistory('');
    setPhoto('');
    setPhotoUploading(false);
    setEditingPet(null);
    setShowAddForm(false);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result;
      
      try {
        setPhotoUploading(true);
        const token = localStorage.getItem('token');
        const res = await apiFetch('http://localhost:5000/api/v1/pets/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ base64Data, fileName: file.name })
        });
        
        const json = await res.json();
        if (json.status === 'success') {
          setPhoto(json.data.url);
          toast.success('Photo uploaded successfully.');
        } else {
          toast.error(json.message || 'Failed to upload photo.');
        }
      } catch (err) {
        console.error(err);
        toast.error('Error uploading file to server.');
      } finally {
        setPhotoUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Filter based on search query
  const filteredPets = pets.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.breed && p.breed.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.species && p.species.toLowerCase().includes(searchQuery.toLowerCase())) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.microchip_number && p.microchip_number.includes(searchQuery))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Pets Registry
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Manage animal profiles, microchip IDs, vaccination records, and clinical logs.
          </p>
        </div>
        <button 
          onClick={() => {
            resetForm();
            setShowAddForm(!showAddForm);
          }} 
          className="btn btn-primary"
        >
          {showAddForm ? 'View Pets Registry' : <><Plus size={16} /> Enroll New Pet</>}
        </button>
      </div>

      {showAddForm ? (
        /* Enroll Pet Form */
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
          <h3 className="font-bold text-lg mb-6" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
            {editingPet ? 'Update Pet Profile' : 'Enroll New Patient Profile'}
          </h3>
          <form onSubmit={handleAddPet}>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Pet Name *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  placeholder="e.g. Max"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Microchip ID (15 digits)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={microchip}
                  onChange={(e) => setMicrochip(e.target.value)}
                  placeholder="e.g. 9810223000..."
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Select Registered Owner *</label>
                <FormSelect
                  value={ownerId}
                  onChange={setOwnerId}
                  placeholder="-- Choose Owner --"
                  required
                  options={[
                    { value: '', label: '-- Choose Owner --' },
                    ...ownersList.map((owner) => ({ value: owner.id, label: `${owner.name} (${owner.nic})` })),
                  ]}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Species *</label>
                <FormSelect
                  value={species}
                  onChange={setSpecies}
                  required
                  options={[
                    { value: '', label: '-- Choose Species --' },
                    { value: 'Dog', label: 'Dog' },
                    { value: 'Cat', label: 'Cat' },
                    { value: 'Bird', label: 'Bird' },
                    { value: 'Exotic', label: 'Exotic' },
                    { value: 'Other', label: 'Other' }
                  ]}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Breed</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  placeholder="e.g. Golden Retriever"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Age Description</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 2 Years 4 Months"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Weight (kg)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g. 15.4 kg"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <FormSelect
                  value={gender}
                  onChange={setGender}
                  options={[
                    { value: 'Male', label: 'Male' },
                    { value: 'Female', label: 'Female' }
                  ]}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Neutered / Spayed?</label>
                <FormSelect
                  value={neuteredStatus}
                  onChange={setNeuteredStatus}
                  options={[
                    { value: 'No', label: 'No' },
                    { value: 'Yes', label: 'Yes' }
                  ]}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Last Vaccination Date</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={lastVaccination}
                  onChange={(e) => setLastVaccination(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last Deworming Date</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={lastDeworming}
                  onChange={(e) => setLastDeworming(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Patient Photo</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <input 
                  type="file" 
                  accept="image/*"
                  className="form-control" 
                  onChange={handleFileChange}
                  style={{ flex: 1, minWidth: '200px' }}
                  disabled={photoUploading}
                />
                {photo && (
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img 
                      src={photo} 
                      alt="Preview" 
                      style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', objectFit: 'cover', border: '1px solid var(--border)' }} 
                      onError={(e) => { e.target.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; }}
                    />
                    <button 
                      type="button" 
                      onClick={() => setPhoto('')}
                      style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'var(--danger)', color: '#fff', border: 'none', borderRadius: '50%', width: '16px', height: '16px', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}
                      title="Remove image"
                    >
                      ✕
                    </button>
                  </div>
                )}
                {photoUploading && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Loader size={12} className="animate-spin" style={{ color: 'var(--primary-teal)' }} /> Uploading...
                  </span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Previous Medical History Notes</label>
              <textarea 
                className="form-control" 
                rows="3"
                value={prevHistory}
                onChange={(e) => setPrevHistory(e.target.value)}
                placeholder="Mention allergies, past surgeries, chronic illnesses..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <button type="button" onClick={resetForm} className="btn btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-primary">
                {editingPet ? 'Update Profile' : 'Enroll Patient'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Pets Table */
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 className="font-bold text-sm" style={{ color: 'var(--text-secondary)' }}>
              Enrolled Animal Database ({filteredPets.length})
            </h4>
          </div>

          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Pet ID / Microchip</th>
                  <th>Patient Details</th>
                  <th>Breed</th>
                  <th>Owner Name</th>
                  <th>Health Status Vitals</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>
                      <Loader size={32} className="animate-spin text-primary" style={{ margin: '0 auto', color: 'var(--primary-teal)' }} />
                      <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading pets...</p>
                    </td>
                  </tr>
                ) : filteredPets.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                      No pets found matching your search.
                    </td>
                  </tr>
                ) : filteredPets.map((pet) => (
                  <tr key={pet.id}>
                    <td>
                      <div>
                        <span className="font-bold" style={{ display: 'block', color: 'var(--primary-teal)', fontSize: '0.9rem' }}>{pet.id}</span>
                        <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>Chip: {pet.microchip_number || 'N/A'}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {pet.photo_url ? (
                          <img 
                            src={pet.photo_url} 
                            alt={pet.name} 
                            style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: 'var(--radius-md)',
                              objectFit: 'cover',
                              border: '1px solid var(--border)'
                            }} 
                          />
                        ) : (
                          <div style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'var(--primary-teal-light)',
                            color: 'var(--primary-teal)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            border: '1px solid var(--primary-teal-light)'
                          }}>
                            {pet.name ? pet.name.charAt(0).toUpperCase() : 'P'}
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-base" style={{ display: 'block' }}>{pet.name}</span>
                          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{pet.gender} | {pet.age} {pet.neutered_status ? '(Neutered/Spayed)' : ''}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="font-medium">{pet.species} - {pet.breed}</span>
                    </td>
                    <td>
                      <span className="font-semibold text-sm">{pet.ownerName}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.75rem' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--primary-teal)', borderRadius: '50%' }} /> Weight: <b>{pet.weight} kg</b>
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--success)', borderRadius: '50%' }} /> Deworm: <b>{pet.last_deworming ? pet.last_deworming.split('T')[0] : 'N/A'}</b>
                        </span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => handleViewPet(pet.id)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '6px', display: 'flex', alignItems: 'center', gap: '2px' }}
                          title="Open Clinical Chart"
                        >
                          <Eye size={14} style={{ color: 'var(--primary-teal)' }} /> Record Chart
                        </button>
                        <button 
                          onClick={() => handleEditClick(pet)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '6px' }}
                          title="Modify Details"
                        >
                          <Edit3 size={14} style={{ color: 'var(--secondary-blue)' }} />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(pet.id)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '6px' }}
                          title="Archive Patient"
                        >
                          <Trash2 size={14} style={{ color: 'var(--danger)' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(4px)' }}>
          <div className="animate-fade-in-up" style={{ backgroundColor: '#fff', borderRadius: 'var(--radius-xl)', padding: '2rem', width: '100%', maxWidth: '400px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--danger-light)', borderRadius: '50%', color: 'var(--danger)' }}>
                <AlertTriangle size={32} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>Archive Patient</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                  Are you sure you want to delete this pet profile? This action cannot be undone.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', width: '100%', marginTop: '1rem' }}>
                <button 
                  onClick={() => setDeleteConfirmId(null)} 
                  className="btn btn-secondary" 
                  style={{ flex: 1, padding: '0.75rem', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete} 
                  className="btn" 
                  style={{ flex: 1, padding: '0.75rem', backgroundColor: 'var(--danger)', color: '#fff', fontWeight: 600, border: 'none' }}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
