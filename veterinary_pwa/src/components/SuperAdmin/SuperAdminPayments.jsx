import React, { useState, useEffect } from 'react';
import { Search, Download, CreditCard, Filter, X, CheckCircle, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import { apiFetch } from '../../utils/api';

export default function SuperAdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedTx, setSelectedTx] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await apiFetch('/api/super-admin/payments');
        const data = await response.json();
        if (data.status === 'success' && Array.isArray(data.data)) {
          setPayments(data.data);
        } else {
          setPayments([]);
        }
      } catch (error) {
        console.error('Failed to fetch payments', error);
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter(p => {
    const matchesSearch = (p.id || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.clinic || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.orderId || '').toLowerCase().includes(search.toLowerCase());
    
    if (statusFilter === 'All') return matchesSearch;
    return matchesSearch && p.status === statusFilter;
  });

  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Order ID', 'Clinic', 'Date', 'Amount', 'Method', 'Status', 'Invoice'];
    const rows = filteredPayments.map(p => [p.id, p.orderId, p.clinic, p.date, p.amount, p.method, p.status, p.invoice]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `veterinary_payments_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="sa-dash-wrapper">
      <div className="sa-page-header">
        <div>
          <h1 className="sa-dash-title">Payments & Ledger</h1>
          <p className="sa-dash-subtitle">Track SaaS transaction history, Razorpay orders and invoices.</p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <div className="sa-search-bar">
            <Search size={16} className="sa-search-icon" />
            <input type="text" placeholder="Search TX ID or clinic..." value={search} onChange={(e) => setSearch(e.target.value)} className="sa-search-input" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="sa-filter-select">
            <option value="All">All Statuses</option>
            <option value="Successful">Successful</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
          <button onClick={handleExportCSV} className="sa-export-btn">
            <Download size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="sa-renewals-card">
        <div className="sa-table-responsive">
          <table className="sa-renewals-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Clinic Name</th>
                <th>Date & Time</th>
                <th>Payment Method</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length === 0 ? (
                <tr><td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No transactions found matching query.</td></tr>
              ) : (
                filteredPayments.map((tx) => (
                  <tr key={tx.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a', fontFamily: 'monospace' }}>{tx.id}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Order: {tx.orderId}</div>
                    </td>

                    <td className="sa-td-bold">{tx.clinic}</td>
                    <td>{tx.date}</td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#475569' }}>
                        <CreditCard size={15} color="#14b8a6" />
                        <span style={{ fontSize: '0.85rem' }}>{tx.method}</span>
                      </div>
                    </td>

                    <td>
                      <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>{tx.amount}</span>
                    </td>

                    <td>
                      <span style={{
                        padding: '0.3rem 0.75rem', borderRadius: '999px', fontSize: '0.775rem', fontWeight: 700,
                        backgroundColor: tx.status === 'Successful' ? '#dcfce7' : tx.status === 'Pending' ? '#fef3c7' : '#fee2e2',
                        color: tx.status === 'Successful' ? '#15803d' : tx.status === 'Pending' ? '#b45309' : '#b91c1c'
                      }}>
                        {tx.status}
                      </span>
                    </td>

                    <td>
                      <button 
                        onClick={() => setSelectedTx(tx)}
                        style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '0.35rem 0.75rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, color: '#0f172a' }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTx && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(15,23,42,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.75rem', width: '100%', maxWidth: '480px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Transaction Details</h3>
              <button onClick={() => setSelectedTx(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Transaction ID:</span>
                <span style={{ fontWeight: 700, color: '#0f172a', fontFamily: 'monospace' }}>{selectedTx.id}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Order ID:</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{selectedTx.orderId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Clinic Name:</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{selectedTx.clinic}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Payment Method:</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{selectedTx.method}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Amount Paid:</span>
                <span style={{ fontWeight: 800, color: '#14b8a6', fontSize: '1.1rem' }}>{selectedTx.amount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Invoice Number:</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{selectedTx.invoice}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button onClick={() => setSelectedTx(null)} style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: 'none', background: '#14b8a6', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
