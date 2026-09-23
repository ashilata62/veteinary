import { apiFetch } from '../utils/api';
import React, { useState, useRef } from 'react';
import {
  UserCog, Stethoscope, Users, HeartHandshake, Shield, Plus, Search,
  Mail, Phone, CheckCircle, XCircle, ArrowLeft, Save, Pencil, Trash2,
  User, Lock, Building2, Camera, Upload, AlertTriangle, MoreVertical
} from 'lucide-react';
import FormSelect from './FormSelect';

const ROLE_OPTIONS = ['Doctor', 'Receptionist', 'Vet Assistant'];

const DEPARTMENTS = {
  Doctor: ['General Practice', 'Surgery', 'Dermatology', 'Emergency Care', 'Internal Medicine'],
  Receptionist: ['Front Desk', 'Client Services'],
  'Vet Assistant': ['Clinical Support', 'Lab & Diagnostics', 'Surgical Assistance'],
};

const DEFAULT_PERMISSIONS = {
  Doctor: ['Medical Records', 'Prescriptions', 'Appointments', 'Billing'],
  Receptionist: ['Appointments', 'Pet Owners', 'Billing', 'Inventory'],
  'Vet Assistant': ['Medical Records', 'Appointments'],
};

const INITIAL_STAFF = [
  { id: 's1', fullName: 'Dr. Sarah Connor',  role: 'Doctor',       email: 'sarah.connor@vetcare.com',  phone: '+94 77 123 4567', username: 'sconnor',  department: 'General Practice', status: 'Active',   permissions: DEFAULT_PERMISSIONS.Doctor,       avatar: 'SC', photoUrl: null },
  { id: 's2', fullName: 'Dr. Alex Mercer',   role: 'Doctor',       email: 'alex.mercer@vetcare.com',   phone: '+94 77 234 5678', username: 'amercer',  department: 'Surgery',          status: 'Active',   permissions: DEFAULT_PERMISSIONS.Doctor,       avatar: 'AM', photoUrl: null },
  { id: 's3', fullName: 'Diana Prince',      role: 'Admin',        email: 'diana.prince@vetcare.com',  phone: '+94 77 345 6789', username: 'dprince',  department: 'Administration',   status: 'Active',   permissions: ['All Modules', 'Staff Management', 'Settings', 'Reports'], avatar: 'DP', photoUrl: null },
  { id: 's4', fullName: 'Barry Allen',     role: 'Receptionist', email: 'barry.allen@vetcare.com',   phone: '+94 77 456 7890', username: 'ballen',   department: 'Front Desk',       status: 'Active',   permissions: DEFAULT_PERMISSIONS.Receptionist, avatar: 'BA', photoUrl: null },
  { id: 's5', fullName: 'Kara Danvers',    role: 'Vet Assistant',email: 'kara.danvers@vetcare.com',  phone: '+94 77 567 8901', username: 'kdanvers', department: 'Clinical Support', status: 'On Leave', permissions: DEFAULT_PERMISSIONS['Vet Assistant'], avatar: 'KD', photoUrl: null },
];

const roleConfig = {
  Doctor:        { color: '#3b82f6', bg: '#eff6ff',  icon: Stethoscope    },
  Admin:         { color: '#14b8a6', bg: '#f0fdfa',  icon: Shield         },
  Receptionist:  { color: '#d946ef', bg: '#fdf4ff',  icon: Users          },
  'Vet Assistant': { color: '#f59e0b', bg: '#fffbeb', icon: HeartHandshake },
};

const emptyForm = {
  fullName: '',
  email: '',
  phone: '',
  username: '',
  password: '',
  role: 'Doctor',
  department: 'General Practice',
  status: 'Active',
  photoUrl: null,
};

function getInitials(name) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

function StatusBadge({ status }) {
  const isActive = status === 'Active';
  return (
    <span
      className="badge"
      style={{
        backgroundColor: isActive ? 'var(--success-light)' : 'var(--warning-light)',
        color: isActive ? 'var(--success)' : 'var(--warning)',
      }}
    >
      {isActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
      {status}
    </span>
  );
}

function StaffForm({ form, setForm, onSubmit, onCancel, isEdit, photoPreview, onPhotoChange }) {
  const fileRef = useRef(null);
  const departments = DEPARTMENTS[form.role] || DEPARTMENTS.Doctor;

  const handleRoleChange = (role) => {
    const dept = (DEPARTMENTS[role] || [])[0] || '';
    setForm({ ...form, role, department: dept });
  };

  return (
    <div className="card" style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <button type="button" onClick={onCancel} className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} /> Back
        </button>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
          {isEdit ? 'Edit Staff Member' : 'Register New Staff'}
        </h2>
      </div>

      <form onSubmit={onSubmit}>
        <div className="staff-form-grid staff-form-grid--full" style={{ marginBottom: '1.5rem' }}>
          <div
            className="staff-photo-upload"
            onClick={() => fileRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
          >
            {photoPreview ? (
              <img src={photoPreview} alt="Profile" className="staff-photo-preview" />
            ) : (
              <div className="staff-photo-placeholder">
                {form.fullName ? getInitials(form.fullName) : <Camera size={32} />}
              </div>
            )}
            <div style={{ textAlign: 'center' }}>
              <p className="font-semibold text-sm" style={{ color: 'var(--primary-teal)', display: 'flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'center' }}>
                <Upload size={14} /> Upload Profile Photo
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)', marginTop: '4px' }}>JPG, PNG — max 2MB</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onPhotoChange} />
          </div>
        </div>

        <div className="staff-form-grid">
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '2.25rem' }}
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="e.g. Dr. Sarah Connor"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                className="form-control"
                style={{ paddingLeft: '2.25rem' }}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="name@vetcare.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number *</label>
            <div style={{ position: 'relative' }}>
              <Phone size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="tel"
                className="form-control"
                style={{ paddingLeft: '2.25rem' }}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+94 77 XXX XXXX"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Username *</label>
            <div style={{ position: 'relative' }}>
              <UserCog size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '2.25rem' }}
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="username"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{isEdit ? 'New Password (optional)' : 'Password *'}</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                className="form-control"
                style={{ paddingLeft: '2.25rem' }}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder={isEdit ? 'Leave blank to keep current' : 'Min. 8 characters'}
                required={!isEdit}
                minLength={isEdit ? 0 : 8}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Role *</label>
            <FormSelect
              value={form.role}
              onChange={handleRoleChange}
              required
              options={ROLE_OPTIONS.map((r) => ({ value: r, label: r }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Department / Specialization *</label>
            <FormSelect
              value={form.department}
              onChange={(dept) => setForm({ ...form, department: dept })}
              required
              options={departments.map((d) => ({ value: d, label: d }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Account Status</label>
            <div className="status-toggle" style={{ marginTop: '0.5rem' }}>
              <button
                type="button"
                className={`status-toggle-track ${form.status === 'Active' ? 'active' : ''}`}
                onClick={() => setForm({ ...form, status: form.status === 'Active' ? 'On Leave' : 'Active' })}
                aria-label="Toggle status"
              >
                <span className="status-toggle-thumb" />
              </button>
              <div>
                <span className="font-semibold text-sm" style={{ color: form.status === 'Active' ? 'var(--success)' : 'var(--warning)' }}>
                  {form.status}
                </span>
                <p className="text-xs" style={{ color: 'var(--text-muted)', marginTop: '2px' }}>
                  {form.status === 'Active' ? 'Staff can access the portal' : 'Access temporarily disabled'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', padding: '1.25rem', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
          <p className="font-semibold text-xs" style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
            Role Permissions (auto-assigned)
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {(DEFAULT_PERMISSIONS[form.role] || []).map((p) => (
              <span key={p} style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', borderRadius: '9999px', backgroundColor: 'var(--primary-teal-light)', color: 'var(--primary-teal)', fontWeight: 600 }}>
                <CheckCircle size={10} style={{ display: 'inline', marginRight: '4px' }} />{p}
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem', flexWrap: 'wrap' }}>
          <button type="button" onClick={onCancel} className="btn btn-secondary">Cancel</button>
          <button type="submit" className="btn btn-primary">
            <Save size={16} /> {isEdit ? 'Save Changes' : 'Register Staff'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function StaffManagement() {
  const [staffList, setStaffList] = useState([]);
  const [view, setView] = useState('list');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await apiFetch('/api/v1/users');
      const json = await res.json();
      if (json.status === 'success') {
        const mapped = json.data.map(u => ({
          id: u.id,
          fullName: u.name,
          email: u.email,
          phone: u.phone,
          username: u.username || '',
          role: u.role,
          department: u.department || '',
          status: u.status,
          photoUrl: u.profile_image || null,
          avatar: getInitials(u.name)
        }));
        setStaffList(mapped);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchStaff();
  }, []);

  const filtered = staffList.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch =
      (s.fullName || '').toLowerCase().includes(q) ||
      (s.email || '').toLowerCase().includes(q) ||
      (s.username || '').toLowerCase().includes(q);
    const matchRole = roleFilter === 'All' || s.role === roleFilter;
    const matchStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result);
      setForm({ ...form, photoUrl: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const openAdd = () => {
    setForm({ ...emptyForm, department: DEPARTMENTS.Doctor[0] });
    setPhotoPreview(null);
    setEditingId(null);
    setView('add');
  };

  const openEdit = (member) => {
    setForm({
      fullName: member.fullName,
      email: member.email,
      phone: member.phone,
      username: member.username,
      password: '',
      role: member.role === 'Admin' ? 'Doctor' : member.role,
      department: member.department,
      status: member.status,
      photoUrl: member.photoUrl,
    });
    setPhotoPreview(member.photoUrl);
    setEditingId(member.id);
    setView('edit');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingId 
        ? `/api/v1/users/${editingId}`
        : '/api/v1/users';
      const method = editingId ? 'PUT' : 'POST';
      
      const res = await apiFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error saving staff');
      
      alert(`Staff member ${editingId ? 'updated' : 'registered'} successfully.`);
      fetchStaff();
      setView('list');
      setForm(emptyForm);
      setPhotoPreview(null);
      setEditingId(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = (id) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (deleteConfirmId) {
      try {
        const token = localStorage.getItem('token');
        const res = await apiFetch(`/api/v1/users/${deleteConfirmId}`, {
          method: 'DELETE',
          
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Error removing staff');
        fetchStaff();
      } catch (err) {
        alert(err.message);
      }
      setDeleteConfirmId(null);
    }
  };

  if (view === 'add' || view === 'edit') {
    return (
      <div className="staff-page">
        <StaffForm
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          onCancel={() => { setView('list'); setForm(emptyForm); setPhotoPreview(null); }}
          isEdit={view === 'edit'}
          photoPreview={photoPreview}
          onPhotoChange={handlePhotoChange}
        />
      </div>
    );
  }

  return (
    <div className="staff-page" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .staff-card-hover {
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease !important;
        }
        .staff-card-hover:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.05), 0 8px 16px -8px rgba(0, 0, 0, 0.05) !important;
        }
        .staff-row-hover {
          transition: background-color 0.15s ease;
        }
        .staff-row-hover:hover {
          background-color: var(--primary-teal-light) !important;
        }
        .dropdown-item {
          transition: background-color 0.15s ease, color 0.15s ease;
        }
        .dropdown-item:hover {
          background-color: var(--background) !important;
          color: var(--primary-teal) !important;
        }
      `}</style>

      <div className="page-header">
        <div>
          <h1>Staff Management</h1>
          <p>Manage clinic staff, roles, permissions, and registration. Admin-only module.</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={16} /> Add Staff Member
        </button>
      </div>

      <div className="kpi-grid-responsive" style={{ marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Staff',   count: staffList.length,                                              color: 'var(--primary-teal)',   icon: UserCog },
          { label: 'Doctors',       count: staffList.filter((s) => s.role === 'Doctor').length,         color: 'var(--secondary-blue)', icon: Stethoscope },
          { label: 'Receptionists', count: staffList.filter((s) => s.role === 'Receptionist').length,   color: '#d946ef',               icon: Users },
          { label: 'Assistants',    count: staffList.filter((s) => s.role === 'Vet Assistant').length,  color: 'var(--warning)',        icon: HeartHandshake },
          { label: 'Active Now',    count: staffList.filter((s) => s.status === 'Active').length,       color: 'var(--success)',        icon: CheckCircle },
          { label: 'On Leave',      count: staffList.filter((s) => s.status === 'On Leave').length,     color: '#f59e0b',               icon: Users },
        ].map(({ label, count, color, icon: Icon }) => (
          <div key={label} className="card kpi-stat-card staff-card-hover" style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}>
            <div className="kpi-icon" style={{ backgroundColor: `${color}18`, color }}>
              <Icon size={18} />
            </div>
            <div>
              <p className="kpi-value">{count}</p>
              <p className="kpi-label">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Unified Search & Filters Toolbar */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '0.75rem',
          padding: '1rem',
          backgroundColor: '#fff',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '1.25rem'
        }}
      >
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', width: '100%' }}>
          {/* Search Input */}
          <div style={{ position: 'relative', width: '280px', minWidth: '200px' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search name, email, or username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2.25rem', height: '36px', fontSize: '0.85rem', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--background)' }}
            />
          </div>

          {/* Role Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="form-control"
              style={{ width: '180px', height: '36px', fontSize: '0.85rem', borderRadius: '8px', border: '1px solid var(--border)', padding: '0 8px', backgroundColor: 'var(--background)', cursor: 'pointer', fontWeight: 600, color: 'var(--text-secondary)' }}
            >
              <option value="All">All Roles</option>
              <option value="Doctor">Doctor ({staffList.filter(s => s.role === 'Doctor').length})</option>
              <option value="Receptionist">Receptionist ({staffList.filter(s => s.role === 'Receptionist').length})</option>
              <option value="Vet Assistant">Vet Assistant ({staffList.filter(s => s.role === 'Vet Assistant').length})</option>
              <option value="Admin">Admin ({staffList.filter(s => s.role === 'Admin').length})</option>
            </select>
          </div>

          {/* Status Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-control"
              style={{ width: '180px', height: '36px', fontSize: '0.85rem', borderRadius: '8px', border: '1px solid var(--border)', padding: '0 8px', backgroundColor: 'var(--background)', cursor: 'pointer', fontWeight: 600, color: 'var(--text-secondary)' }}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active ({staffList.filter(s => s.status === 'Active').length})</option>
              <option value="On Leave">On Leave ({staffList.filter(s => s.status === 'On Leave').length})</option>
              <option value="Terminated">Terminated ({staffList.filter(s => s.status === 'Terminated').length})</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {(roleFilter !== 'All' || statusFilter !== 'All' || search !== '') && (
            <button
              type="button"
              onClick={() => {
                setRoleFilter('All');
                setStatusFilter('All');
                setSearch('');
              }}
              className="btn btn-secondary"
              style={{ height: '36px', padding: '0 12px', fontSize: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--danger)', backgroundColor: '#fef2f2', fontWeight: 600, cursor: 'pointer' }}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive ledger-desktop-table">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Staff Member</th>
                <th>Role</th>
                <th>Department</th>
                <th>Contact</th>
                <th>Username</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    No staff members match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((staff) => {
                  const cfg = roleConfig[staff.role] || { color: '#64748b', bg: '#f8fafc', icon: UserCog };
                  const RoleIcon = cfg.icon;
                  return (
                    <tr key={staff.id} className="staff-row-hover">
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: 40, height: 40, borderRadius: '50%',
                            backgroundColor: cfg.bg, border: `2px solid ${cfg.color}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 700, fontSize: '0.8rem', color: cfg.color, flexShrink: 0,
                            overflow: 'hidden',
                          }}>
                            {staff.photoUrl ? (
                              <img src={staff.photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : staff.avatar}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <span className="font-semibold" style={{ display: 'block' }}>{staff.fullName}</span>
                            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{staff.email}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: cfg.color, fontWeight: 600, fontSize: '0.85rem' }}>
                          <RoleIcon size={14} /> {staff.role}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>{staff.department}</td>
                      <td style={{ fontSize: '0.85rem' }}>{staff.phone}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{staff.username}</td>
                      <td><StatusBadge status={staff.status} /></td>
                      <td style={{ position: 'relative', textAlign: 'right', padding: '1rem' }}>
                        <div style={{ display: 'inline-block', position: 'relative' }}>
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(activeMenuId === staff.id ? null : staff.id);
                            }} 
                            className="btn btn-secondary btn-sm" 
                            style={{ padding: '6px', borderRadius: '6px', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            title="Actions"
                          >
                            <MoreVertical size={16} />
                          </button>
                          
                          {activeMenuId === staff.id && (
                            <>
                              {/* Overlay click catcher to close the dropdown */}
                              <div 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenuId(null);
                                }}
                                style={{ position: 'fixed', inset: 0, zIndex: 99, background: 'transparent' }} 
                              />
                              <div style={{
                                position: 'absolute',
                                right: 0,
                                top: '100%',
                                marginTop: '4px',
                                backgroundColor: '#fff',
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                                boxShadow: 'var(--shadow-lg)',
                                zIndex: 100,
                                minWidth: '140px',
                                display: 'flex',
                                flexDirection: 'column',
                                padding: '4px',
                                boxSizing: 'border-box',
                                textAlign: 'left'
                              }}>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openEdit(staff);
                                    setActiveMenuId(null);
                                  }}
                                  className="dropdown-item"
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    width: '100%',
                                    padding: '8px 12px',
                                    fontSize: '0.825rem',
                                    color: 'var(--text-primary)',
                                    border: 'none',
                                    backgroundColor: 'transparent',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    borderRadius: '6px',
                                  }}
                                >
                                  <Pencil size={12} style={{ color: 'var(--secondary-blue)' }} /> Edit Staff
                                </button>
                                
                                {staff.role !== 'Admin' && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(staff.id);
                                      setActiveMenuId(null);
                                    }}
                                    className="dropdown-item"
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '8px',
                                      width: '100%',
                                      padding: '8px 12px',
                                      fontSize: '0.825rem',
                                      color: 'var(--danger)',
                                      border: 'none',
                                      backgroundColor: 'transparent',
                                      cursor: 'pointer',
                                      textAlign: 'left',
                                      borderRadius: '6px',
                                    }}
                                  >
                                    <Trash2 size={12} style={{ color: 'var(--danger)' }} /> Remove
                                  </button>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="ledger-mobile-list" style={{ padding: '1rem' }}>
          {filtered.map((staff) => {
            const cfg = roleConfig[staff.role] || { color: '#64748b', bg: '#f8fafc', icon: UserCog };
            const RoleIcon = cfg.icon;
            return (
              <div key={staff.id} className="ledger-mobile-card">
                <div className="ledger-mobile-card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%',
                      backgroundColor: cfg.bg, border: `2px solid ${cfg.color}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, color: cfg.color,
                    }}>
                      {staff.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{staff.fullName}</p>
                      <span style={{ fontSize: '0.75rem', color: cfg.color, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <RoleIcon size={12} /> {staff.role}
                      </span>
                    </div>
                  </div>
                  <StatusBadge status={staff.status} />
                </div>
                <p className="text-xs" style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>{staff.department}</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>{staff.email} · {staff.phone}</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => openEdit(staff)} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                    <Pencil size={14} /> Edit
                  </button>
                  {staff.role !== 'Admin' && (
                    <button onClick={() => handleDelete(staff.id)} className="btn btn-secondary btn-sm" style={{ color: 'var(--danger)' }}>
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(4px)' }}>
          <div className="animate-fade-in-up" style={{ backgroundColor: '#fff', borderRadius: 'var(--radius-xl)', padding: '2rem', width: '100%', maxWidth: '400px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--danger-light)', borderRadius: '50%', color: 'var(--danger)' }}>
                <AlertTriangle size={32} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>Remove Staff</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                  Are you sure you want to remove this staff member from the system? This action cannot be undone.
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
                  Yes, Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
