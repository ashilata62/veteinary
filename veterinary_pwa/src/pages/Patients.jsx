import React, { useState, useEffect } from 'react';
import { 
  Dog, 
  Search, 
  Plus, 
  User, 
  Phone, 
  FileHeart, 
  ShieldCheck, 
  Calendar, 
  RefreshCw,
  X,
  Sparkles
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Patients() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);

  // Form State
  const [form, setForm] = useState({
    name: '',
    species: 'Dog',
    breed: 'Golden Retriever',
    gender: 'Male',
    age_years: 2,
    weight_kg: 18,
    owner_name: '',
    owner_phone: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchPets = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/v1/pets');
      setPets(res.data?.data || []);
    } catch (err) {
      console.error('Error fetching pets:', err);
      toast.error('Failed to load patient records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handleCreatePet = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/api/v1/pets', form);
      toast.success('Patient registered successfully!');
      setShowAddModal(false);
      setForm({
        name: '',
        species: 'Dog',
        breed: '',
        gender: 'Male',
        age_years: 1,
        weight_kg: 5,
        owner_name: '',
        owner_phone: ''
      });
      fetchPets();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add pet record');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = pets.filter((pet) => {
    const q = search.toLowerCase();
    const matchesSearch = 
      (pet.name || '').toLowerCase().includes(q) ||
      (pet.breed || '').toLowerCase().includes(q) ||
      (pet.owner_name || '').toLowerCase().includes(q) ||
      (pet.microchip || '').toLowerCase().includes(q);

    const matchesSpecies = speciesFilter === 'ALL' || (pet.species || '').toUpperCase() === speciesFilter;
    return matchesSearch && matchesSpecies;
  });

  const getSpeciesEmoji = (sp) => {
    const s = (sp || '').toLowerCase();
    if (s.includes('cat')) return '🐱';
    if (s.includes('bird')) return '🦜';
    if (s.includes('rabbit')) return '🐰';
    if (s.includes('cow') || s.includes('cattle')) return '🐄';
    if (s.includes('horse')) return '🐎';
    return '🐶';
  };

  return (
    <div className="pwa-page-content animate-fade-up">
      {/* Page Header */}
      <div className="pwa-page-header">
        <div>
          <h2>Pet Patients</h2>
          <p>Electronic Health Records & Profiles</p>
        </div>
        <button 
          className="pwa-primary-icon-btn"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={18} />
          <span>Add Pet</span>
        </button>
      </div>

      {/* Search & Species Filter */}
      <div className="pwa-search-card">
        <div className="search-input-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search by pet, breed, owner, chip..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear-btn" onClick={() => setSearch('')}>
              <X size={14} />
            </button>
          )}
        </div>

        <div className="filter-pill-row">
          {['ALL', 'DOG', 'CAT', 'BIRD', 'RABBIT'].map((sp) => (
            <button
              key={sp}
              className={`filter-pill ${speciesFilter === sp ? 'active' : ''}`}
              onClick={() => setSpeciesFilter(sp)}
            >
              {sp === 'ALL' ? 'All' : sp.charAt(0) + sp.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Patients Grid / List */}
      <div className="pwa-card-list">
        {loading ? (
          <div className="pwa-loading-state">
            <RefreshCw size={24} className="animate-spin text-teal" />
            <p>Loading patient records...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="pwa-card empty-schedule">
            <Dog size={36} className="text-muted" />
            <h4>No Patients Found</h4>
            <p>Tap + to register a new pet patient.</p>
          </div>
        ) : (
          filtered.map((pet) => (
            <div 
              key={pet.id} 
              className="pwa-card patient-card"
              onClick={() => setSelectedPet(pet)}
            >
              <div className="patient-card-top">
                <div className="patient-avatar">
                  {getSpeciesEmoji(pet.species)}
                </div>
                <div className="patient-info">
                  <h4>{pet.name} <span className="pet-species">({pet.breed || pet.species || 'Canine'})</span></h4>
                  <p className="patient-owner">
                    <User size={12} /> {pet.owner_name || 'Registered Owner'}
                  </p>
                </div>
                <span className="patient-gender-badge">
                  {pet.gender === 'Female' ? '♀ Female' : '♂ Male'}
                </span>
              </div>

              <div className="patient-details-grid">
                <div className="patient-detail-chip">
                  <span className="chip-label">Age</span>
                  <span className="chip-val">{pet.age_years ? `${pet.age_years} yrs` : '1.5 yrs'}</span>
                </div>
                <div className="patient-detail-chip">
                  <span className="chip-label">Weight</span>
                  <span className="chip-val">{pet.weight_kg ? `${pet.weight_kg} kg` : '12 kg'}</span>
                </div>
                <div className="patient-detail-chip">
                  <span className="chip-label">Vaccine</span>
                  <span className="chip-val text-teal">Up to date</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Pet Patient Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-sheet animate-fade-up" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Register New Patient</h3>
              <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreatePet} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Pet Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Max"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Breed</label>
                  <input
                    type="text"
                    placeholder="e.g. Labrador / Persian"
                    value={form.breed}
                    onChange={(e) => setForm({ ...form, breed: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Age (Years)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={form.age_years}
                    onChange={(e) => setForm({ ...form, age_years: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.weight_kg}
                    onChange={(e) => setForm({ ...form, weight_kg: e.target.value })}
                  />
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
                  <label>Owner Phone</label>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={form.owner_phone}
                    onChange={(e) => setForm({ ...form, owner_phone: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="modal-submit-btn" disabled={submitting}>
                {submitting ? 'Registering...' : 'Save Patient Profile'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Pet Detail Modal */}
      {selectedPet && (
        <div className="modal-backdrop" onClick={() => setSelectedPet(null)}>
          <div className="modal-sheet animate-fade-up" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '24px' }}>{getSpeciesEmoji(selectedPet.species)}</span>
                <h3>{selectedPet.name}'s Medical Chart</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedPet(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="patient-chart-content">
              <div className="chart-stat-row">
                <div className="chart-box">
                  <span className="chart-lbl">Species & Breed</span>
                  <span className="chart-val">{selectedPet.species} &bull; {selectedPet.breed || 'Standard'}</span>
                </div>
                <div className="chart-box">
                  <span className="chart-lbl">Age / Gender</span>
                  <span className="chart-val">{selectedPet.age_years || '2'} Yrs &bull; {selectedPet.gender || 'Male'}</span>
                </div>
              </div>

              <div className="chart-owner-card">
                <h4>Owner Information</h4>
                <p><strong>Name:</strong> {selectedPet.owner_name || 'Client'}</p>
                <p><strong>Phone:</strong> {selectedPet.owner_phone || '+91 98765 43210'}</p>
              </div>

              <div className="chart-vax-card">
                <h4>Health & Immunization</h4>
                <div className="vax-item">
                  <span>✓ Rabies Vaccine</span>
                  <span className="vax-date">Valid till 2027</span>
                </div>
                <div className="vax-item">
                  <span>✓ DHPP / FVRCP Core</span>
                  <span className="vax-date">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
