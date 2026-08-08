import React, { useState } from 'react';
import { Search, Download, CreditCard, Filter, X, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export default function SuperAdminPayments() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedTx, setSelectedTx] = useState(null);

  const payments = [
    { id: 'PAY-982341', orderId: 'order_M1k298x', clinic: 'Downtown Vet Clinic', date: '2026-08-07 10:14 AM', amount: '₹1,999.00', method: 'Razorpay UPI (gpay@upi)', status: 'Successful', invoice: 'INV-2026-0801' },
    { id: 'PAY-982340', orderId: 'order_K88129y', clinic: 'Paws & Claws Care', date: '2026-08-06 04:30 PM', amount: '₹18,999.00', method: 'Razorpay NetBanking (HDFC)', status: 'Successful', invoice: 'INV-2026-0802' },
    { id: 'PAY-982339', orderId: 'order_L99210z', clinic: 'Happy Pets Hospital', date: '2026-08-05 09:22 AM', amount: '₹1,999.00', method: 'Razorpay Card (**** 4242)', status: 'Failed', invoice: '-' },
    { id: 'PAY-982338', orderId: 'order_P77123a', clinic: 'PetCare Central', date: '2026-08-05 02:15 PM', amount: '₹1,999.00', method: 'Razorpay UPI (paytm@upi)', status: 'Pending', invoice: '-' },
    { id: 'PAY-982337', orderId: 'order_Q66542b', clinic: 'City Animal Hospital', date: '2026-08-04 11:45 AM', amount: '₹1,999.00', method: 'Razorpay Card (**** 8888)', status: 'Successful', invoice: 'INV-2026-0803' },
  ];

  const filteredPayments = payments.filter(p => {
    const matchesSearch = p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.clinic.toLowerCase().includes(search.toLowerCase()) ||
      p.orderId.toLowerCase().includes(search.toLowerCase());
    
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
      <div className="sa-renewals-header">
        <div>
          <h1 className="sa-dash-title">Payments & Ledger</h1>
          <p className="sa-dash-subtitle">Track SaaS transaction history, Razorpay orders and invoices.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div className="sa-search-bar">
            <Search size={18} className="sa-search-icon" />
            <input
              type="text"
              placeholder="Search TX ID or clinic..."
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
              <option value="Successful">Successful</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

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
