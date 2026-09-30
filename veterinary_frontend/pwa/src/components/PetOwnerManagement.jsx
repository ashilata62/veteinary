import { apiFetch } from '../utils/api';
import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, UserPlus, Phone, Mail, MapPin, Edit3, Trash2, X, AlertTriangle, Loader, Dog, ShieldCheck, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PetOwnerManagement({ searchQuery }) {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingOwner, setEditingOwner] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [nic, setNic] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');

  const fetchOwners = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await apiFetch('http://localhost:5000/api/v1/owners');
      const data = await response.json();
      if (data.status === 'success') {
        setOwners(data.data);
      } else {
        toast.error('Failed to load pet owners data');
      }
    } catch (error) {
      console.error(error);
      toast.error('Network error loading pet owners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const handleAddOwner = async (e) => {
    e.preventDefault();
    if (!fullName || !nic || !mobile) {
      toast.error('Please fill out Name, NIC, and Mobile number.');
      return;
    }

    const payload = {
      name: fullName,
      nic,
      email,
      telephone,
      mobile,
      address
    };

    const token = localStorage.getItem('token');

    try {
      if (editingOwner) {
        const response = await apiFetch(`http://localhost:5000/api/v1/owners/${editingOwner.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (data.status === 'success') {
          toast.success('Pet Owner record updated successfully.');
          fetchOwners();
          resetForm();
        } else {
          toast.error(data.message || 'Failed to update pet owner.');
        }
      } else {
        const response = await apiFetch('http://localhost:5000/api/v1/owners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (data.status === 'success') {
          toast.success('New Pet Owner registered successfully.');
          fetchOwners();
          resetForm();
        } else {
          toast.error(data.message || 'Failed to register pet owner.');
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('Network error. Check backend connection.');
    }
  };

  const handleEditClick = (owner) => {
    setEditingOwner(owner);
    setFullName(owner.name);
    setNic(owner.nic);
    setEmail(owner.email);
    setTelephone(owner.telephone);
    setMobile(owner.mobile);
    setAddress(owner.address);
    setShowAddForm(true);
  };

  const handleDeleteClick = (ownerId) => {
    setDeleteConfirmId(ownerId);
  };

  const confirmDelete = async () => {
    if (deleteConfirmId) {
      try {
        const response = await apiFetch(`http://localhost:5000/api/v1/owners/${deleteConfirmId}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        if (data.status === 'success') {
          toast.success('Pet owner deleted successfully.');
          setDeleteConfirmId(null);
          fetchOwners();
        } else {
          toast.error(data.message || 'Failed to delete pet owner.');
          setDeleteConfirmId(null);
        }
      } catch (error) {
        console.error(error);
        toast.error('Network error deleting pet owner.');
        setDeleteConfirmId(null);
      }
    }
  };

  const resetForm = () => {
    setFullName('');
    setNic('');
    setEmail('');
    setTelephone('');
    setMobile('');
    setAddress('');
    setEditingOwner(null);
    setShowAddForm(false);
  };

  const filteredOwners = owners.filter(owner => 
    owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    owner.nic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    owner.mobile.includes(searchQuery)
  );

  // Client stats calculations
  const totalClientsCount = owners.length;
  const multiPetClientsCount = owners.filter(o => o.petsCount > 1).length;
  const detailedProfilesCount = owners.filter(o => o.email && o.address).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', width: '100%' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
            Pet Owners Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '4px 0 0 0' }}>
            Register new clients, manage records, and track multi-pet association keys.
          </p>
        </div>
        <button 
          onClick={() => {
            if (showAddForm) {
              resetForm();
            } else {
              setShowAddForm(true);
            }
          }} 
          className={`btn ${showAddForm ? 'btn-secondary' : 'btn-primary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, padding: '0.65rem 1.25rem' }}
        >
          {showAddForm ? (
            <><X size={16} /> View Listing</>
          ) : (
            <><UserPlus size={16} /> Register Pet Owner</>
          )}
        </button>
      </div>

      {/* Stats row (only visible when not displaying form) */}
      {!showAddForm && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ padding: '0.75rem', borderRadius: '12px', backgroundColor: 'var(--primary-teal-light)', color: 'var(--primary-teal)' }}>
              <Users size={20} />
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', margin: 0 }}>Total Clients</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '2px 0 0 0', color: 'var(--text-primary)' }}>{totalClientsCount}</h3>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ padding: '0.75rem', borderRadius: '12px', backgroundColor: 'var(--secondary-blue-light)', color: 'var(--secondary-blue)' }}>
              <Dog size={20} />
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', margin: 0 }}>Multi-Pet Owners</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '2px 0 0 0', color: 'var(--text-primary)' }}>{multiPetClientsCount}</h3>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ padding: '0.75rem', borderRadius: '12px', backgroundColor: 'var(--success-light)', color: 'var(--success)' }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', margin: 0 }}>Complete Profiles</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '2px 0 0 0', color: 'var(--text-primary)' }}>{detailedProfilesCount}</h3>
            </div>
          </div>

        </div>
      )}

      {showAddForm ? (
        /* Registration Form Widget */
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto', width: '100%', padding: '2rem', boxShadow: 'var(--shadow-md)' }}>
          <h3 className="font-bold text-lg mb-6" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', margin: '0 0 1.5rem 0', color: 'var(--text-primary)' }}>
            {editingOwner ? 'Modify Pet Owner Record' : 'Register New Pet Owner'}
          </h3>
          <form onSubmit={handleAddOwner}>
            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Full Name *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. John Doe"
                  required
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }}
                />
              </div>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>NIC / Identity Card Number *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={nic}
                  onChange={(e) => setNic(e.target.value)}
                  placeholder="e.g. 19940381029V"
                  required
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }}
                />
              </div>
            </div>

            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Email Address</label>
                <input 
                  type="email" 
                  className="form-control" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. john.doe@email.com"
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }}
                />
              </div>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Telephone (Landline)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="e.g. +94 11 200 0000"
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }}
                />
              </div>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Mobile Number *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="e.g. +94 77 123 4567"
                  required
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Home Address</label>
              <textarea 
                className="form-control" 
                rows="3"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter complete residential address..."
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <button type="button" onClick={resetForm} className="btn btn-secondary" style={{ padding: '0.5rem 1.25rem', fontWeight: 600 }}>Cancel</button>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1.5rem', fontWeight: 600 }}>
                {editingOwner ? 'Update Record' : 'Register Owner'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Listing Table */
        <div className="card animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
            <h4 className="font-bold text-sm" style={{ color: 'var(--text-secondary)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Registered Clients Listing ({filteredOwners.length})
            </h4>
          </div>

          <div className="table-responsive">
            <table className="custom-table" style={{ fontSize: '0.85rem' }}>
              <thead>
                <tr>
                  <th style={{ padding: '0.75rem 1rem' }}>Client Name / NIC</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Contact Details</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Home Address</th>
                  <th style={{ textAlign: 'center', padding: '0.75rem 1rem' }}>Associated Pets</th>
                  <th style={{ textAlign: 'right', padding: '0.75rem 1rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '4rem' }}>
                      <Loader size={32} className="animate-spin text-primary" style={{ margin: '0 auto', color: 'var(--primary-teal)' }} />
                      <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Loading pet owners...</p>
                    </td>
                  </tr>
                ) : filteredOwners.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                      No pet owners found matching your search.
                    </td>
                  </tr>
                ) : filteredOwners.map((owner) => (
                  <tr key={owner.id} style={{ transition: 'background-color 0.15s ease' }}>
                    <td style={{ padding: '1rem' }}>
                      <div>
                        <span className="font-bold" style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{owner.name}</span>
                        <span className="badge" style={{ fontSize: '0.65rem', marginTop: '4px', backgroundColor: 'var(--background)', color: 'var(--text-secondary)', border: '1px solid var(--border)', fontWeight: 600 }}>NIC: {owner.nic}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)', fontWeight: 600 }}>
                          <Phone size={12} style={{ color: 'var(--primary-teal)', flexShrink: 0 }} /> {owner.mobile}
                        </span>
                        {(owner.telephone || owner.email) && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.75rem', flexWrap: 'wrap' }}>
                            {owner.telephone && <span>Tel: {owner.telephone}</span>}
                            {owner.telephone && owner.email && <span style={{ color: 'var(--text-muted)' }}>•</span>}
                            {owner.email && <span style={{ color: 'var(--text-muted)' }}>{owner.email}</span>}
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '280px' }}>
                        <MapPin size={12} style={{ flexShrink: 0, color: 'var(--text-muted)' }} />
                        <span>{owner.address || 'No address registered'}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center', padding: '1rem' }}>
                      <span 
                        className="badge" 
                        style={{ 
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '0.4rem 0.8rem', 
                          borderRadius: '20px', 
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: 'var(--success-light)',
                          color: 'var(--success)',
                          border: '1px solid #bbf7d0'
                        }}
                      >
                        <Dog size={12} /> {owner.petsCount || 0} Associated
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', padding: '1rem' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => handleEditClick(owner)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '6px', border: '1px solid var(--border)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Edit Profile"
                        >
                          <Edit3 size={14} style={{ color: 'var(--secondary-blue)' }} />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(owner.id)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '6px', border: '1px solid var(--border)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Delete Client"
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
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>Delete Record</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                  Are you sure you want to delete this pet owner record? This action cannot be undone.
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
