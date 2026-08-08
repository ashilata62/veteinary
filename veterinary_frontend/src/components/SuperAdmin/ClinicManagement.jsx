import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import { 
  Building2, Search, Edit, Trash2, Power, 
  Plus, CheckCircle, AlertTriangle, ShieldCheck, Mail, X, UserCheck
} from 'lucide-react';

export default function ClinicManagement() {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const defaultClinics = [
    { id: '1', name: 'Downtown Vet Clinic', adminName: 'Dr. John Doe', email: 'john@downtown.com', phone: '+91 98765 43210', currentPlan: 'Monthly Pro', trialStatus: 'Expired', subStatus: 'Active', createdDate: '2025-01-10', expiryDate: '2026-09-10' },
    { id: '2', name: 'Pet Care Central', adminName: 'Dr. Jane Smith', email: 'jane@petcare.com', phone: '+91 98123 45678', currentPlan: '7-Day Trial', trialStatus: 'Active', subStatus: 'Trial', createdDate: '2026-08-01', expiryDate: '2026-08-15' },
    { id: '3', name: 'Paws & Claws Care', adminName: 'Dr. Vikram Singh', email: 'vikram@pawsclaws.in', phone: '+91 99887 76655', currentPlan: 'Yearly Enterprise', trialStatus: 'Expired', subStatus: 'Active', createdDate: '2025-05-20', expiryDate: '2027-05-20' },
    { id: '4', name: 'City Animal Hospital', adminName: 'Dr. Anjali Sharma', email: 'anjali@cityvet.com', phone: '+91 97654 32109', currentPlan: 'Monthly Pro', trialStatus: 'Expired', subStatus: 'Suspended', createdDate: '2026-02-15', expiryDate: '2026-07-15' },
    { id: '5', name: 'Happy Tails Pet Clinic', adminName: 'Rajesh Kumar', email: 'rajesh@happytails.com', phone: '+91 96543 21098', currentPlan: '7-Day Trial', trialStatus: 'Active', subStatus: 'Trial', createdDate: '2026-08-05', expiryDate: '2026-08-12' },
  ];

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const response = await apiFetch('/api/super-admin/clinics');
        const data = await response.json();
        if (data.status === 'success' && data.data.length > 0) {
          setClinics(data.data);
        } else {
          setClinics(defaultClinics);
        }
      } catch (error) {
        console.error('Failed to fetch clinics', error);
        setClinics(defaultClinics);
      } finally {
        setLoading(false);
      }
    };
    fetchClinics();
  }, []);

  const handleToggleStatus = (id) => {
    setClinics(prev => prev.map(c => {
      if (c.id === id) {
        const newStatus = c.subStatus === 'Active' ? 'Suspended' : 'Active';
        showToast(`Clinic "${c.name}" status updated to ${newStatus}`);
        return { ...c, subStatus: newStatus };
      }
      return c;
    }));
  };

  const handleDeleteClinic = (id, name) => {
    if (window.confirm(`Are you sure you want to delete clinic "${name}"?`)) {
      setClinics(prev => prev.filter(c => c.id !== id));
      showToast(`Clinic "${name}" deleted successfully.`);
    }
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setClinics(prev => prev.map(c => c.id === selectedClinic.id ? selectedClinic : c));
    setIsEditModalOpen(false);
    showToast(`Clinic details updated successfully.`);
  };

  const filteredClinics = clinics.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.adminName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    
    if (statusFilter === 'All') return matchesSearch;
    if (statusFilter === 'Active') return matchesSearch && c.subStatus === 'Active';
    if (statusFilter === 'Trial') return matchesSearch && c.subStatus === 'Trial';
    if (statusFilter === 'Suspended') return matchesSearch && c.subStatus === 'Suspended';
    return matchesSearch;
  });

  return (
    <div className="sa-dash-wrapper">
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed', top: '80px', right: '2rem', zIndex: 1000,
          backgroundColor: '#0f172a', color: '#2dd4bf', padding: '0.85rem 1.5rem',
          borderRadius: '10px', border: '1px solid #2dd4bf', boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
        }}>
          <CheckCircle size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="sa-renewals-header">
        <div>
          <h1 className="sa-dash-title">Admins & Clinic Management</h1>
          <p className="sa-dash-subtitle">View, edit, suspend or upgrade platform clinic administrators.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div className="sa-search-bar">
            <Search size={18} className="sa-search-icon" />
            <input
              type="text"
              placeholder="Search clinic or admin..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="sa-search-input"
            />
          </div>

          <div className="sa-select-wrapper">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="sa-filter-select"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Paid</option>
              <option value="Trial">Free Trial</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="sa-renewals-card">
        <div className="sa-table-responsive">
          <table className="sa-renewals-table">
            <thead>
              <tr>
                <th>Clinic & Admin Details</th>
                <th>Contact</th>
                <th>Current Plan</th>
                <th>Status</th>
                <th>Renewal / Expiry</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading Clinics...</td></tr>
              ) : filteredClinics.length === 0 ? (
                <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No clinics found matching criteria.</td></tr>
              ) : (
                filteredClinics.map((clinic) => (
                  <tr key={clinic.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <div style={{
                          width: '42px', height: '42px', borderRadius: '10px',
                          backgroundColor: '#f0fdfa', border: '1px solid #ccfbf1', color: '#0d9488',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
                        }}>
                          <Building2 size={20} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{clinic.name}</div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Admin: {clinic.adminName}</div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 500 }}>{clinic.email}</div>
                      <div style={{ fontSize: '0.775rem', color: '#94a3b8' }}>{clinic.phone}</div>
                    </td>

                    <td>
                      <span className={`sa-plan-badge ${clinic.currentPlan.toLowerCase().includes('pro') ? 'pro' : clinic.currentPlan.toLowerCase().includes('trial') ? 'trial' : 'enterprise'}`}>
                        {clinic.currentPlan}
                      </span>
                    </td>

                    <td>
                      <span style={{
                        padding: '0.3rem 0.75rem', borderRadius: '999px', fontSize: '0.775rem', fontWeight: 700,
                        backgroundColor: clinic.subStatus === 'Active' ? '#dcfce7' : clinic.subStatus === 'Trial' ? '#fef3c7' : '#fee2e2',
                        color: clinic.subStatus === 'Active' ? '#15803d' : clinic.subStatus === 'Trial' ? '#b45309' : '#b91c1c'
                      }}>
                        {clinic.subStatus}
                      </span>
                    </td>

                    <td className="sa-td-expiry">
                      {clinic.expiryDate}
                    </td>

                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                        <button 
                          onClick={() => { setSelectedClinic(clinic); setIsEditModalOpen(true); }}
                          style={{ background: '#f1f5f9', border: 'none', padding: '0.45rem', borderRadius: '6px', cursor: 'pointer', color: '#0f766e' }} 
                          title="Edit Admin"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(clinic.id)}
                          style={{ 
                            background: clinic.subStatus === 'Active' ? '#fef2f2' : '#f0fdf4', 
                            border: 'none', padding: '0.45rem', borderRadius: '6px', cursor: 'pointer', 
                            color: clinic.subStatus === 'Active' ? '#ef4444' : '#16a34a' 
                          }} 
                          title={clinic.subStatus === 'Active' ? 'Suspend' : 'Activate'}
                        >
                          <Power size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteClinic(clinic.id, clinic.name)}
                          style={{ background: '#fef2f2', border: 'none', padding: '0.45rem', borderRadius: '6px', cursor: 'pointer', color: '#dc2626' }} 
                          title="Delete Admin"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && selectedClinic && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(15,23,42,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.75rem', width: '100%', maxWidth: '520px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Edit Clinic Admin</h3>
              <button onClick={() => setIsEditModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>Clinic Name</label>
                <input 
                  type="text" 
                  value={selectedClinic.name} 
                  onChange={(e) => setSelectedClinic({ ...selectedClinic, name: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>Admin Name</label>
                <input 
                  type="text" 
                  value={selectedClinic.adminName} 
                  onChange={(e) => setSelectedClinic({ ...selectedClinic, adminName: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>Email</label>
                  <input 
                    type="email" 
                    value={selectedClinic.email} 
                    onChange={(e) => setSelectedClinic({ ...selectedClinic, email: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>Plan</label>
                  <select 
                    value={selectedClinic.currentPlan} 
                    onChange={(e) => setSelectedClinic({ ...selectedClinic, currentPlan: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                  >
                    <option value="7-Day Trial">7-Day Trial</option>
                    <option value="Monthly Pro">Monthly Pro</option>
                    <option value="Yearly Enterprise">Yearly Enterprise</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>Subscription Status</label>
                <select 
                  value={selectedClinic.subStatus} 
                  onChange={(e) => setSelectedClinic({ ...selectedClinic, subStatus: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                >
                  <option value="Active">Active Paid</option>
                  <option value="Trial">Trial</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsEditModalOpen(false)} style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: 'none', background: '#14b8a6', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
