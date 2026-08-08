import React, { useState } from 'react';
import { Check, Edit, Plus, X, Trash2, Tag, ShieldCheck } from 'lucide-react';

export default function SuperAdminPlans() {
  const [plans, setPlans] = useState([
    {
      id: '1',
      name: '7-Day Free Trial',
      price: '₹0',
      interval: '7 days trial',
      features: ['Up to 1 Doctor', 'Basic Medical Records', 'Standard Appointments', 'Self-service Helpdesk'],
      color: '#f59e0b',
      badgeText: 'Trial Plan',
      isPopular: false
    },
    {
      id: '2',
      name: 'Monthly Pro',
      price: '₹1,999',
      interval: 'per month',
      features: ['Up to 5 Doctors', 'Full Medical Records', 'Razorpay Payment Integration', 'Billing & POS Invoicing', 'WhatsApp & Email Reminders', 'Priority Email Support'],
      color: '#14b8a6',
      badgeText: 'Most Popular',
      isPopular: true
    },
    {
      id: '3',
      name: 'Yearly Enterprise',
      price: '₹18,999',
      interval: 'per year (save 20%)',
      features: ['Unlimited Doctors', 'Custom Workflows', 'Multi-Clinic Franchises', 'Dedicated DB & Backup', '24/7 VIP Phone Support', 'Dedicated Account Manager'],
      color: '#8b5cf6',
      badgeText: 'Enterprise',
      isPopular: false
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [newPlan, setNewPlan] = useState({ name: '', price: '', interval: 'per month', features: '', isPopular: false });

  const handleOpenEdit = (plan) => {
    setEditingPlan({ ...plan, featuresStr: plan.features.join('\n') });
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingPlan(null);
    setNewPlan({ name: '', price: '', interval: 'per month', features: '', isPopular: false });
    setIsModalOpen(true);
  };

  const handleSavePlan = (e) => {
    e.preventDefault();
    if (editingPlan) {
      const updatedFeatures = editingPlan.featuresStr.split('\n').filter(f => f.trim() !== '');
      setPlans(prev => prev.map(p => p.id === editingPlan.id ? { ...editingPlan, features: updatedFeatures } : p));
    } else {
      const featuresArr = newPlan.features.split('\n').filter(f => f.trim() !== '');
      const created = {
        id: Date.now().toString(),
        name: newPlan.name,
        price: newPlan.price,
        interval: newPlan.interval,
        features: featuresArr.length > 0 ? featuresArr : ['Standard Access'],
        color: '#14b8a6',
        badgeText: 'Custom Plan',
        isPopular: newPlan.isPopular
      };
      setPlans(prev => [...prev, created]);
    }
    setIsModalOpen(false);
  };

  const handleDeletePlan = (id) => {
    if (window.confirm('Are you sure you want to remove this plan?')) {
      setPlans(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="sa-dash-wrapper">
      <div className="sa-renewals-header">
        <div>
          <h1 className="sa-dash-title">Plans & Pricing</h1>
          <p className="sa-dash-subtitle">Configure SaaS subscription tiers and features for clinics.</p>
        </div>

        <button 
          onClick={handleOpenCreate}
          style={{
            backgroundColor: '#14b8a6', color: '#ffffff', border: 'none',
            padding: '0.6rem 1.25rem', borderRadius: '10px', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(20, 184, 166, 0.25)'
          }}
        >
          <Plus size={18} /> Create New Plan
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem', marginTop: '1rem' }}>
        {plans.map((plan) => (
          <div key={plan.id} style={{
            backgroundColor: '#ffffff',
            border: plan.isPopular ? `2px solid ${plan.color}` : '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '2rem',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: plan.isPopular ? '0 10px 25px -5px rgba(20, 184, 166, 0.15)' : '0 1px 3px rgba(0,0,0,0.05)',
            transition: 'transform 0.2s ease'
          }}>
            {plan.isPopular && (
              <div style={{
                position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                backgroundColor: plan.color, color: '#ffffff', padding: '4px 14px', borderRadius: '99px',
                fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em'
              }}>{plan.badgeText || 'Most Popular'}</div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h3 style={{ color: '#0f172a', fontSize: '1.35rem', fontWeight: 700, margin: 0 }}>{plan.name}</h3>
              <button 
                onClick={() => handleDeletePlan(plan.id)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                title="Delete Plan"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', margin: '1rem 0 1.5rem 0' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a' }}>{plan.price}</span>
              <span style={{ color: '#64748b', fontSize: '0.875rem' }}>{plan.interval}</span>
            </div>

            <div style={{ flex: 1 }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {plan.features.map((feature, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: '#334155', fontSize: '0.875rem' }}>
                    <Check size={16} color={plan.color} style={{ marginTop: '3px', flexShrink: 0 }} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button 
              onClick={() => handleOpenEdit(plan)}
              style={{
                marginTop: '2rem', width: '100%', padding: '0.75rem', borderRadius: '10px',
                backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              <Edit size={16} /> Edit Plan Config
            </button>
          </div>
        ))}
      </div>

      {/* Plan Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(15,23,42,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.75rem', width: '100%', maxWidth: '500px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                {editingPlan ? 'Edit Plan' : 'Create New Plan'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSavePlan} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>Plan Name</label>
                <input 
                  type="text" 
                  required
                  value={editingPlan ? editingPlan.name : newPlan.name} 
                  onChange={(e) => editingPlan ? setEditingPlan({ ...editingPlan, name: e.target.value }) : setNewPlan({ ...newPlan, name: e.target.value })}
                  placeholder="e.g. Pro Monthly"
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>Price</label>
                  <input 
                    type="text" 
                    required
                    value={editingPlan ? editingPlan.price : newPlan.price} 
                    onChange={(e) => editingPlan ? setEditingPlan({ ...editingPlan, price: e.target.value }) : setNewPlan({ ...newPlan, price: e.target.value })}
                    placeholder="e.g. ₹1,999"
                    style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>Billing Interval</label>
                  <input 
                    type="text" 
                    required
                    value={editingPlan ? editingPlan.interval : newPlan.interval} 
                    onChange={(e) => editingPlan ? setEditingPlan({ ...editingPlan, interval: e.target.value }) : setNewPlan({ ...newPlan, interval: e.target.value })}
                    placeholder="per month"
                    style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>Features (One per line)</label>
                <textarea 
                  rows={4}
                  value={editingPlan ? editingPlan.featuresStr : newPlan.features} 
                  onChange={(e) => editingPlan ? setEditingPlan({ ...editingPlan, featuresStr: e.target.value }) : setNewPlan({ ...newPlan, features: e.target.value })}
                  placeholder="Up to 5 Doctors&#10;Razorpay POS Integration&#10;Email Support"
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input 
                  type="checkbox"
                  id="popularCheck"
                  checked={editingPlan ? editingPlan.isPopular : newPlan.isPopular}
                  onChange={(e) => editingPlan ? setEditingPlan({ ...editingPlan, isPopular: e.target.checked }) : setNewPlan({ ...newPlan, isPopular: e.target.checked })}
                />
                <label htmlFor="popularCheck" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>Highlight as "Most Popular"</label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: 'none', background: '#14b8a6', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Save Plan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
