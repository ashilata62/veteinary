import React, { useState, useEffect } from 'react';
import { Search, Filter, ShieldCheck, Power, RefreshCw } from 'lucide-react';
import { apiFetch } from '../../utils/api';
import './SuperAdmin.css';

export default function SuperAdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await apiFetch('/api/super-admin/subscriptions');
        const data = await response.json();
        if (data.status === 'success' && Array.isArray(data.data)) {
          setSubscriptions(data.data);
        } else {
          setSubscriptions([]);
        }
      } catch (error) {
        console.error('Failed to fetch subscriptions', error);
        setSubscriptions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriptions();
  }, []);

  const getStatusBadge = (status) => {
    switch ((status || '').toUpperCase()) {
      case 'ACTIVE': return 'sa-badge emerald';
      case 'TRIAL': return 'sa-badge yellow';
      case 'EXPIRED':
      case 'CANCELLED': return 'sa-badge red';
      default: return 'sa-badge slate';
    }
  };

  const filteredSubs = subscriptions.filter(sub => {
    return (sub.clinicName || '').toLowerCase().includes(search.toLowerCase()) ||
      (sub.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (sub.plan || '').toLowerCase().includes(search.toLowerCase());
  });

  const totalMRR = subscriptions.reduce((acc, curr) => {
    return acc + (Number(curr.amount) || 0);
  }, 0);

  const activeCount = subscriptions.filter(s => (s.status || '').toUpperCase() === 'ACTIVE').length;

  return (
    <div className="sa-dashboard-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="sa-page-title">Subscriptions</h1>
          <p className="sa-page-subtitle">Manage SaaS billing and active subscriptions.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="sa-search-bar">
            <Search size={18} className="sa-search-icon" />
            <input
              type="text"
              placeholder="Search subscriptions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="sa-search-input"
            />
          </div>
        </div>
      </div>

      <div className="sa-stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="sa-stat-card">
          <p className="sa-stat-label">Total MRR</p>
          <h3 className="sa-stat-value" style={{ color: '#34d399' }}>₹{totalMRR.toLocaleString('en-IN')}</h3>
        </div>
        <div className="sa-stat-card">
          <p className="sa-stat-label">Active Subscriptions</p>
          <h3 className="sa-stat-value">{activeCount}</h3>
        </div>
        <div className="sa-stat-card">
          <p className="sa-stat-label">Total Subscriptions</p>
          <h3 className="sa-stat-value">{subscriptions.length}</h3>
        </div>
      </div>

      <div className="sa-table-container">
        <div style={{ overflowX: 'auto' }}>
          <table className="sa-table">
            <thead>
              <tr>
                <th>Clinic / Email</th>
                <th>Current Plan</th>
                <th>Status</th>
                <th>Billing Cycle</th>
                <th>Next Billing Date</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubs.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                    No subscriptions found.
                  </td>
                </tr>
              ) : (
                filteredSubs.map((sub) => (
                  <tr key={sub.id}>
                    <td>
                      <p style={{ color: 'white', fontWeight: 500, margin: 0 }}>{sub.clinicName}</p>
                      <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>{sub.email}</p>
                    </td>
                    <td>
                      <span style={{ color: '#cbd5e1', fontWeight: 500 }}>{sub.plan || 'Free Trial'}</span>
                    </td>
                    <td>
                      <span className={getStatusBadge(sub.status)}>
                        {sub.status}
                      </span>
                    </td>
                    <td><span style={{ color: '#94a3b8' }}>{sub.billingCycle || 'Monthly'}</span></td>
                    <td><span style={{ color: '#cbd5e1' }}>{sub.nextBilling || '-'}</span></td>
                    <td><span style={{ color: 'white', fontWeight: 600 }}>₹{sub.amount || '0'}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
