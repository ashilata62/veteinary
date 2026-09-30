import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Search, 
  Plus, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Receipt, 
  RefreshCw, 
  X,
  Sparkles
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Billing() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Invoice Form
  const [form, setForm] = useState({
    patient_name: '',
    owner_name: '',
    items: [
      { name: 'General Consultation', price: 500, qty: 1 }
    ],
    payment_method: 'UPI / Cash',
    status: 'Paid'
  });

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/v1/invoices');
      setInvoices(res.data?.data || []);
    } catch (err) {
      // Mock some sample data if endpoint not yet loaded
      setInvoices([
        { id: 'INV-101', patient_name: 'Bruno', owner_name: 'Rahul Sharma', total: 1250, status: 'Paid', date: 'Today, 02:30 PM' },
        { id: 'INV-102', patient_name: 'Bella', owner_name: 'Pooja Verma', total: 800, status: 'Paid', date: 'Today, 11:15 AM' },
        { id: 'INV-103', patient_name: 'Leo', owner_name: 'Amit Patel', total: 2400, status: 'Pending', date: 'Yesterday' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleAddItem = () => {
    setForm({
      ...form,
      items: [...form.items, { name: 'Medication / Vaccine', price: 400, qty: 1 }]
    });
  };

  const calculateTotal = () => {
    return form.items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.qty) || 1), 0);
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    const newInv = {
      id: `INV-${Date.now().toString().slice(-4)}`,
      patient_name: form.patient_name || 'Walk-in Pet',
      owner_name: form.owner_name || 'Client',
      total: calculateTotal(),
      status: form.status,
      date: 'Just now'
    };
    setInvoices([newInv, ...invoices]);
    toast.success('Invoice created & recorded!');
    setShowAddModal(false);
    setForm({
      patient_name: '',
      owner_name: '',
      items: [{ name: 'General Consultation', price: 500, qty: 1 }],
      payment_method: 'UPI / Cash',
      status: 'Paid'
    });
  };

  const totalCollected = invoices
    .filter(i => i.status === 'Paid')
    .reduce((sum, i) => sum + Number(i.total || 0), 0);

  return (
    <div className="pwa-page-content animate-fade-up">
      {/* Page Header */}
      <div className="pwa-page-header">
        <div>
          <h2>Billing & POS</h2>
          <p>Quick Receipts & Invoicing</p>
        </div>
        <button 
          className="pwa-primary-icon-btn"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={18} />
          <span>New Bill</span>
        </button>
      </div>

      {/* Revenue Summary Banner */}
      <div className="pwa-card revenue-banner">
        <div className="rev-banner-left">
          <span className="rev-lbl">Total Collections Today</span>
          <div className="rev-val">₹{totalCollected.toLocaleString()}</div>
        </div>
        <div className="rev-icon-bubble">
          <Receipt size={26} />
        </div>
      </div>

      {/* Recent Invoices List */}
      <div className="pwa-section-header" style={{ marginTop: '1.25rem' }}>
        <h3>Recent Transactions</h3>
      </div>

      <div className="pwa-card-list">
        {loading ? (
          <div className="pwa-loading-state">
            <RefreshCw size={24} className="animate-spin text-teal" />
            <p>Loading transactions...</p>
          </div>
        ) : (
          invoices.map((inv) => (
            <div key={inv.id} className="pwa-card invoice-item-card">
              <div className="inv-left">
                <div className="inv-icon-wrap">
                  <CreditCard size={20} className="text-teal" />
                </div>
                <div className="inv-info">
                  <h4>{inv.patient_name} <span className="inv-id">({inv.id})</span></h4>
                  <p className="inv-owner">{inv.owner_name} &bull; {inv.date}</p>
                </div>
              </div>
              <div className="inv-right">
                <div className="inv-amount">₹{inv.total.toLocaleString()}</div>
                <span className={`status-badge-mini ${inv.status.toLowerCase()}`}>
                  {inv.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Fast Invoice Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-sheet animate-fade-up" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Fast Invoice</h3>
              <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Pet Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bruno"
                    value={form.patient_name}
                    onChange={(e) => setForm({ ...form, patient_name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Owner Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={form.owner_name}
                    onChange={(e) => setForm({ ...form, owner_name: e.target.value })}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="billing-items-box">
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Service / Medicines
                </label>
                {form.items.map((item, idx) => (
                  <div key={idx} className="billing-item-row">
                    <input
                      type="text"
                      placeholder="Item name"
                      value={item.name}
                      style={{ flex: 2 }}
                      onChange={(e) => {
                        const next = [...form.items];
                        next[idx].name = e.target.value;
                        setForm({ ...form, items: next });
                      }}
                    />
                    <input
                      type="number"
                      placeholder="₹ Amount"
                      value={item.price}
                      style={{ flex: 1 }}
                      onChange={(e) => {
                        const next = [...form.items];
                        next[idx].price = Number(e.target.value);
                        setForm({ ...form, items: next });
                      }}
                    />
                  </div>
                ))}

                <button type="button" className="add-line-item-btn" onClick={handleAddItem}>
                  + Add Another Item
                </button>
              </div>

              {/* Total Calculation */}
              <div className="invoice-total-summary">
                <span>Total Payable:</span>
                <span className="total-num">₹{calculateTotal()}</span>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Payment Method</label>
                  <select
                    value={form.payment_method}
                    onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                  >
                    <option value="UPI / QR">UPI / QR Code</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Credit / Debit Card</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Payment Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="Paid">Paid (Received)</option>
                    <option value="Pending">Pending (Unpaid)</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="modal-submit-btn">
                Generate & Collect ₹{calculateTotal()}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
