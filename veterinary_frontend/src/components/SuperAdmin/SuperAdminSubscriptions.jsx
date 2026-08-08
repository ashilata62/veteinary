import React, { useState } from 'react';
import { Search, Filter, ShieldCheck, Power, RefreshCw } from 'lucide-react';
import './SuperAdmin.css';

export default function SuperAdminSubscriptions() {
  const [search, setSearch] = useState('');

  // Dummy data for subscriptions
  const dummySubscriptions = [
    { id: 1, clinicName: 'City Vet Clinic', email: 'contact@cityvet.com', plan: 'Enterprise', status: 'Active', billingCycle: 'Annual', nextBilling: '2027-01-15', amount: '$1,999' },
    { id: 2, clinicName: 'Paws & Claws Care', email: 'admin@pawsclaws.com', plan: 'Pro', status: 'Active', billingCycle: 'Monthly', nextBilling: '2026-09-01', amount: '$199' },
    { id: 3, clinicName: 'Happy Pets Hospital', email: 'hello@happypets.net', plan: 'Basic', status: 'Past Due', billingCycle: 'Monthly', nextBilling: '2026-08-01', amount: '$99' },
    { id: 4, clinicName: 'Downtown Animal ER', email: 'er@downtownvet.org', plan: 'Enterprise', status: 'Active', billingCycle: 'Annual', nextBilling: '2027-03-10', amount: '$1,999' },
    { id: 5, clinicName: 'Green Valley Vet', email: 'support@greenvalley.com', plan: 'Basic', status: 'Cancelled', billingCycle: 'Monthly', nextBilling: '-', amount: '$0' },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active': return 'sa-badge emerald';
      case 'Past Due': return 'sa-badge yellow';
      case 'Cancelled': return 'sa-badge red';
      default: return 'sa-badge slate';
    }
  };

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
          <button className="btn btn-secondary" style={{ backgroundColor: '#1e293b', borderColor: '#334155', color: 'white' }}>
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      <div className="sa-stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="sa-stat-card">
          <p className="sa-stat-label">Total MRR</p>
          <h3 className="sa-stat-value" style={{ color: '#34d399' }}>$42,500</h3>
        </div>
        <div className="sa-stat-card">
          <p className="sa-stat-label">Active Subscriptions</p>
          <h3 className="sa-stat-value">342</h3>
        </div>
        <div className="sa-stat-card">
          <p className="sa-stat-label">Churn Rate</p>
          <h3 className="sa-stat-value" style={{ color: '#f87171' }}>1.2%</h3>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dummySubscriptions.map((sub) => (
                <tr key={sub.id}>
                  <td>
                    <p style={{ color: 'white', fontWeight: 500, margin: 0 }}>{sub.clinicName}</p>
                    <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>{sub.email}</p>
                  </td>
                  <td>
                    <span style={{ color: '#cbd5e1', fontWeight: 500 }}>{sub.plan}</span>
                  </td>
                  <td>
                    <span className={getStatusBadge(sub.status)}>
                      {sub.status}
                    </span>
                  </td>
                  <td><span style={{ color: '#94a3b8' }}>{sub.billingCycle}</span></td>
                  <td><span style={{ color: '#cbd5e1' }}>{sub.nextBilling}</span></td>
                  <td><span style={{ color: 'white', fontWeight: 600 }}>{sub.amount}</span></td>
                  <td>
                    <div className="sa-flex-center">
                      <button className="sa-action-btn edit" title="Update Plan"><RefreshCw size={16} /></button>
                      <button className="sa-action-btn suspend" title="Suspend Subscription"><Power size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
