import React from 'react';
import { BarChart, LineChart, PieChart, Download } from 'lucide-react';
import './SuperAdmin.css';

export default function SuperAdminReports({ type }) {
  const isRevenue = type === 'revenue';

  return (
    <div className="sa-dashboard-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="sa-page-title">{isRevenue ? 'Revenue Analytics' : 'Platform Reports'}</h1>
          <p className="sa-page-subtitle">
            {isRevenue ? 'Financial performance and MRR growth.' : 'Comprehensive platform usage statistics.'}
          </p>
        </div>
        <button className="btn btn-secondary" style={{ backgroundColor: '#1e293b', borderColor: '#334155', color: 'white' }}>
          <Download size={16} /> Export Report
        </button>
      </div>

      <div className="sa-stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="sa-stat-card">
          <p className="sa-stat-label">{isRevenue ? 'MRR Growth' : 'Total Data Stored'}</p>
          <h3 className="sa-stat-value" style={{ color: '#3b82f6' }}>{isRevenue ? '+14.5%' : '142 TB'}</h3>
        </div>
        <div className="sa-stat-card">
          <p className="sa-stat-label">{isRevenue ? 'Avg. Revenue Per User' : 'Daily Active Users'}</p>
          <h3 className="sa-stat-value" style={{ color: '#10b981' }}>{isRevenue ? '$84' : '4,210'}</h3>
        </div>
        <div className="sa-stat-card">
          <p className="sa-stat-label">{isRevenue ? 'Failed Transactions' : 'API Requests'}</p>
          <h3 className="sa-stat-value" style={{ color: '#f59e0b' }}>{isRevenue ? '2.1%' : '1.2M/day'}</h3>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '1rem', padding: '2rem', minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <LineChart size={64} color="#334155" style={{ marginBottom: '1rem' }} />
          <h3 style={{ color: '#cbd5e1', marginBottom: '0.5rem' }}>{isRevenue ? 'Monthly Recurring Revenue' : 'User Growth Over Time'}</h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Chart visualization will be implemented with real backend data.</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '1rem', padding: '2rem', minHeight: '250px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <BarChart size={48} color="#334155" style={{ marginBottom: '1rem' }} />
            <h3 style={{ color: '#cbd5e1', marginBottom: '0.5rem', fontSize: '1rem' }}>{isRevenue ? 'Revenue by Plan' : 'Activity by Module'}</h3>
          </div>
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '1rem', padding: '2rem', minHeight: '250px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <PieChart size={48} color="#334155" style={{ marginBottom: '1rem' }} />
            <h3 style={{ color: '#cbd5e1', marginBottom: '0.5rem', fontSize: '1rem' }}>{isRevenue ? 'Churn Reasons' : 'Storage Distribution'}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
