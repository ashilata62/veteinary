import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import toast from 'react-hot-toast';
import {
  Shield, Check, X, RotateCcw, Save, Search, Lock,
  Stethoscope, Users, HeartHandshake, UserCog, CheckCircle2,
  AlertCircle, Sparkles, SlidersHorizontal, Info, Eye, EyeOff
} from 'lucide-react';

const ROLES = [
  { id: 'Doctor', label: 'Doctor', color: '#3b82f6', bg: '#eff6ff', icon: Stethoscope, desc: 'Full clinical access, EMR, prescriptions, treatment notes' },
  { id: 'Manager', label: 'Manager', color: '#10b981', bg: '#ecfdf5', icon: Shield, desc: 'Clinic operations, inventory, financial reports & staff logs' },
  { id: 'Receptionist', label: 'Receptionist', color: '#d946ef', bg: '#fdf4ff', icon: Users, desc: 'Front-desk appointments, client billing, pet records' },
  { id: 'Vet Assistant', label: 'Vet Assistant', color: '#f59e0b', bg: '#fffbeb', icon: HeartHandshake, desc: 'Assigned assistance tasks, patient vitals & medical records' },
];

export default function RolePermissionsManager() {
  const [activeRole, setActiveRole] = useState('Doctor');
  const [menus, setMenus] = useState([]);
  const [matrix, setMatrix] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // Load Permissions Matrix from Backend
  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/api/v1/permissions');
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setMenus(data.data.menus || []);
        setMatrix(data.data.matrix || {});
        // Cache to localStorage for instant sidebar sync
        localStorage.setItem('petcare_role_matrix', JSON.stringify(data.data.matrix || {}));
      } else {
        toast.error(data.message || 'Failed to load permissions');
      }
    } catch (err) {
      console.error('Error fetching permissions:', err);
      toast.error('Could not connect to permissions service');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  // Toggle permission for active role
  const handleToggle = (menuId) => {
    if (activeRole === 'Admin') return; // Admin is always full access
    setMatrix(prev => {
      const rolePerms = { ...(prev[activeRole] || {}) };
      rolePerms[menuId] = !rolePerms[menuId];
      return { ...prev, [activeRole]: rolePerms };
    });
  };

  // Toggle all in category for active role
  const handleToggleCategory = (category, enable) => {
    if (activeRole === 'Admin') return;
    const catMenus = menus.filter(m => m.category === category);
    setMatrix(prev => {
      const rolePerms = { ...(prev[activeRole] || {}) };
      catMenus.forEach(m => {
        rolePerms[m.id] = enable;
      });
      return { ...prev, [activeRole]: rolePerms };
    });
  };

  // Save permissions to Backend
  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await apiFetch('/api/v1/permissions/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: activeRole,
          permissions: matrix[activeRole] || {}
        })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Access permissions for ${activeRole} saved!`);
        // Broadcast custom event so Sidebar immediately refreshes
        localStorage.setItem('petcare_role_matrix', JSON.stringify(matrix));
        window.dispatchEvent(new CustomEvent('petcare_permissions_updated', { detail: matrix }));
      } else {
        toast.error(data.message || 'Failed to save permissions');
      }
    } catch (err) {
      console.error('Save error:', err);
      toast.error('Failed to save permissions to server');
    } finally {
      setSaving(false);
    }
  };

  // Reset to default
  const handleReset = async () => {
    if (!window.confirm(`Are you sure you want to reset ${activeRole} permissions to default?`)) return;
    try {
      setLoading(true);
      const res = await apiFetch('/api/v1/permissions/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: activeRole })
      });
      if (res.ok) {
        toast.success(`Reset ${activeRole} permissions to factory default`);
        await fetchPermissions();
        window.dispatchEvent(new CustomEvent('petcare_permissions_updated'));
      }
    } catch (err) {
      toast.error('Failed to reset permissions');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(menus.map(m => m.category))];

  const filteredMenus = menus.filter(m => {
    const matchesSearch = m.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (m.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = filterCategory === 'All' || m.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  const activeRoleObj = ROLES.find(r => r.id === activeRole) || ROLES[0];
  const activeRolePerms = matrix[activeRole] || {};
  const enabledCount = menus.filter(m => activeRolePerms[m.id]).length;

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <div style={{ display: 'inline-block', width: 36, height: 36, border: '3px solid #14b8a6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ marginTop: '1rem', fontWeight: 600 }}>Loading Role Permissions Matrix...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Role Selection Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {ROLES.map(role => {
          const isSelected = activeRole === role.id;
          const RoleIcon = role.icon;
          const allowedCount = menus.filter(m => matrix[role.id]?.[m.id]).length;

          return (
            <div
              key={role.id}
              onClick={() => setActiveRole(role.id)}
              style={{
                backgroundColor: isSelected ? '#ffffff' : 'var(--card-bg, #ffffff)',
                border: isSelected ? `2px solid ${role.color}` : '1px solid var(--border)',
                borderRadius: '12px',
                padding: '1.25rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? `0 8px 20px -4px ${role.color}30` : '0 1px 3px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: '10px',
                    backgroundColor: role.bg, color: role.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <RoleIcon size={20} />
                  </div>
                  <span style={{
                    fontSize: '0.75rem', fontWeight: 700,
                    padding: '3px 8px', borderRadius: '20px',
                    backgroundColor: isSelected ? role.bg : '#f1f5f9',
                    color: isSelected ? role.color : '#64748b'
                  }}>
                    {allowedCount} / {menus.length} Menus
                  </span>
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                  {role.label}
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                  {role.desc}
                </p>
              </div>

              {isSelected && (
                <div style={{
                  marginTop: '1rem', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9',
                  display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem',
                  fontWeight: 700, color: role.color
                }}>
                  <CheckCircle2 size={14} /> Active Role Editor
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Permissions Editor Card */}
      <div className="card" style={{ padding: '1.5rem' }}>
        
        {/* Header with Search and Actions */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Menu Access for <span style={{ color: activeRoleObj.color }}>{activeRoleObj.label}</span>
              </h2>
              <span style={{ fontSize: '0.8rem', padding: '2px 8px', borderRadius: '6px', backgroundColor: '#f0fdfa', color: '#0f766e', fontWeight: 700 }}>
                {enabledCount} Accessible Modules
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
              Toggle which sidebar items and clinical routes are visible and accessible to employees with the <strong>{activeRole}</strong> role.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.5rem 0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              title="Reset this role to default"
            >
              <RotateCcw size={14} /> Reset Defaults
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="btn btn-primary"
              style={{ fontSize: '0.8rem', padding: '0.5rem 1.25rem', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#14b8a6', borderColor: '#14b8a6' }}
            >
              {saving ? <div style={{ width: 14, height: 14, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : <Save size={15} />}
              Save Permissions
            </button>
          </div>
        </div>

        {/* Filters and Category Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
          
          {/* Category Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  border: filterCategory === cat ? '1px solid #14b8a6' : '1px solid var(--border)',
                  backgroundColor: filterCategory === cat ? '#f0fdfa' : 'transparent',
                  color: filterCategory === cat ? '#0f766e' : 'var(--text-secondary)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat} {cat !== 'All' && `(${menus.filter(m => m.category === cat).length})`}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '220px' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search module name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px 6px 32px',
                fontSize: '0.8rem',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--background)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
        </div>

        {/* Modules Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {filteredMenus.map(menu => {
            const isAllowed = Boolean(activeRolePerms[menu.id]);

            return (
              <div
                key={menu.id}
                onClick={() => handleToggle(menu.id)}
                style={{
                  border: isAllowed ? '1px solid #99f6e4' : '1px solid var(--border)',
                  backgroundColor: isAllowed ? '#f0fdfa' : 'var(--background)',
                  borderRadius: '10px',
                  padding: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '12px',
                  transition: 'all 0.15s ease',
                  boxShadow: isAllowed ? '0 2px 6px rgba(20, 184, 166, 0.08)' : 'none'
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: isAllowed ? '#0f766e' : 'var(--text-primary)' }}>
                      {menu.label}
                    </span>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '1px 6px', borderRadius: '4px', backgroundColor: '#e2e8f0', color: '#475569', textTransform: 'uppercase' }}>
                      {menu.category}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.35 }}>
                    {menu.description}
                  </p>
                </div>

                {/* Switch Toggle */}
                <div style={{
                  width: 44,
                  height: 24,
                  borderRadius: 20,
                  backgroundColor: isAllowed ? '#14b8a6' : '#cbd5e1',
                  position: 'relative',
                  flexShrink: 0,
                  transition: 'background-color 0.2s ease'
                }}>
                  <div style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    position: 'absolute',
                    top: 3,
                    left: isAllowed ? 22 : 4,
                    transition: 'left 0.2s ease',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {isAllowed ? (
                      <Check size={11} style={{ color: '#14b8a6', strokeWidth: 3 }} />
                    ) : (
                      <X size={11} style={{ color: '#94a3b8', strokeWidth: 3 }} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info box */}
        <div style={{ marginTop: '1.5rem', padding: '0.85rem 1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.78rem', color: '#64748b' }}>
          <Info size={16} style={{ color: '#3b82f6', flexShrink: 0 }} />
          <span>
            <strong>Note:</strong> <strong>Admin</strong> always retains full platform privileges. Changes to <strong>{activeRole}</strong> menu permissions take effect immediately for all employees assigned to this role.
          </span>
        </div>

      </div>
    </div>
  );
}
