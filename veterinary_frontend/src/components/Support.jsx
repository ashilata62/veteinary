import React, { useState } from 'react';
import { ArrowLeft, MessageSquare, Plus, Send, HelpCircle, Tag, Clock, AlertTriangle } from 'lucide-react';

export default function Support() {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  
  // New ticket state
  const [newSubject, setNewSubject] = useState('');
  const [newPriority, setNewPriority] = useState('Medium');
  const [newCategory, setNewCategory] = useState('Technical');
  const [newDescription, setNewDescription] = useState('');

  // Admin's tickets matching screenshot data
  const [tickets, setTickets] = useState([
    {
      id: 'TKT-1786006334931-390',
      subject: 'Payment',
      priority: 'Medium',
      category: 'Technical',
      status: 'Replied',
      updated: '06/08/26',
      messages: [
        { sender: 'Admin', text: 'this issee', time: '06/08/26, 2:22 pm', isUser: true },
        { sender: 'Superadmin', text: 'hyyy', time: '06/08/26, 2:27 pm', isUser: false }
      ]
    },
    {
      id: 'TKT-1658392102910-441',
      subject: 'Account Limits Extension',
      priority: 'Low',
      category: 'Billing',
      status: 'Open',
      updated: '07/08/26',
      messages: [
        { sender: 'Admin', text: 'Can we add 2 more staff seats on this basic trial plan?', time: '07/08/26, 09:30 am', isUser: true }
      ]
    }
  ]);

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    const now = new Date();
    const formattedTime = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getFullYear()).substring(2)}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase()}`;

    const newMsg = {
      sender: 'Admin',
      text: replyText.trim(),
      time: formattedTime,
      isUser: true
    };

    const updated = {
      ...selectedTicket,
      status: 'Open', // Changes back to open when admin replies
      messages: [...selectedTicket.messages, newMsg]
    };

    setTickets(prev => prev.map(t => t.id === selectedTicket.id ? updated : t));
    setSelectedTicket(updated);
    setReplyText('');
  };

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!newSubject.trim() || !newDescription.trim()) return;

    const randomId = `TKT-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getFullYear()).substring(2)}`;
    const formattedTime = `${formattedDate}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase()}`;

    const newTicket = {
      id: randomId,
      subject: newSubject,
      priority: newPriority,
      category: newCategory,
      status: 'Open',
      updated: formattedDate,
      messages: [
        { sender: 'Admin', text: newDescription, time: formattedTime, isUser: true }
      ]
    };

    setTickets([newTicket, ...tickets]);
    setSelectedTicket(newTicket);
    setShowCreateForm(false);
    
    // Clear inputs
    setNewSubject('');
    setNewDescription('');
    setNewPriority('Medium');
    setNewCategory('Technical');
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem 0' }}>
      
      {/* Header Panel */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            🎫 Support Tickets
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
            Raise an issue or track existing tickets
          </p>
        </div>
        {selectedTicket && (
          <button 
            onClick={() => setSelectedTicket(null)}
            style={{
              padding: '0.45rem 1.1rem',
              backgroundColor: '#fff',
              border: '1.5px solid #6366f1',
              color: '#6366f1',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            ← Back
          </button>
        )}
        {!selectedTicket && !showCreateForm && (
          <button 
            onClick={() => setShowCreateForm(true)}
            style={{
              padding: '0.6rem 1.25rem',
              backgroundColor: '#6366f1',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
            }}
          >
            <Plus size={16} /> New Support Ticket
          </button>
        )}
        {showCreateForm && (
          <button 
            onClick={() => setShowCreateForm(false)}
            style={{
              padding: '0.45rem 1.1rem',
              backgroundColor: '#fff',
              border: '1.5px solid #64748b',
              color: '#64748b',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            Cancel
          </button>
        )}
      </div>

      {/* Main View Area */}
      {selectedTicket ? (
        /* 💬 TICKET CHAT FLOW - MATCHES SCREENSHOT EXACTLY */
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Header Strip */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.25rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, fontFamily: 'monospace' }}>{selectedTicket.id}</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', margin: '0.25rem 0 0 0', letterSpacing: '-0.5px' }}>{selectedTicket.subject}</h2>
            </div>
            
            {/* Status tags */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={{ padding: '0.35rem 0.85rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#faf5ff', color: '#9333ea' }}>{selectedTicket.status}</span>
              <span style={{ padding: '0.35rem 0.85rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#fffbeb', color: '#d97706' }}>{selectedTicket.priority}</span>
              <span style={{ padding: '0.35rem 0.85rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#f0fdfa', color: '#0d9488' }}>{selectedTicket.category}</span>
            </div>
          </div>

          {/* Messages Flow */}
          <div style={{ minHeight: '260px', display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1rem 0' }}>
            {selectedTicket.messages.map((msg, idx) => {
              const isUser = msg.isUser;
              return (
                <div 
                  key={idx}
                  style={{
                    alignSelf: isUser ? 'flex-end' : 'flex-start',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start',
                    maxWidth: '80%'
                  }}
                >
                  <div 
                    style={{
                      backgroundColor: isUser ? '#3b82f6' : '#f1f5f9',
                      color: isUser ? '#fff' : '#0f172a',
                      padding: '0.85rem 1.25rem',
                      borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      fontSize: '0.9rem',
                      lineHeight: 1.45,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                    }}
                  >
                    {msg.text}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.35rem', fontWeight: 600 }}>
                    {msg.sender} · {msg.time}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Reply Form */}
          <form onSubmit={handleSendReply} style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
            <input 
              type="text"
              placeholder="Type your reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                outline: 'none',
                fontSize: '0.9rem'
              }}
              onFocus={(e) => e.target.style.borderColor = '#6366f1'}
              onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
            />
            <button 
              type="submit"
              style={{
                padding: '0.75rem 1.75rem',
                backgroundColor: '#6366f1',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#4f46e5'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#6366f1'}
            >
              Send
            </button>
          </form>

        </div>
      ) : showCreateForm ? (
        /* 📝 CREATE NEW TICKET FORM */
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.75rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', marginBottom: '1.25rem' }}>Submit a Support Ticket</h2>
          <form onSubmit={handleCreateTicket} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem' }}>Category</label>
                <select 
                  value={newCategory} 
                  onChange={(e) => setNewCategory(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                >
                  <option value="Technical">Technical Support</option>
                  <option value="Billing">Billing & Subscription</option>
                  <option value="Feature Request">Feature Request</option>
                  <option value="Account">Account Access</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem' }}>Priority</label>
                <select 
                  value={newPriority} 
                  onChange={(e) => setNewPriority(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem' }}>Subject</label>
              <input 
                type="text" 
                placeholder="Briefly state the issue..."
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem' }}>Problem Description</label>
              <textarea 
                rows="5"
                placeholder="Explain the problem in detail. Include screenshots link if any..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', resize: 'vertical' }}
                required
              />
            </div>

            <button 
              type="submit"
              style={{
                alignSelf: 'flex-start',
                padding: '0.65rem 1.75rem',
                backgroundColor: '#6366f1',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(99,102,241,0.2)'
              }}
            >
              Submit Ticket
            </button>
          </form>
        </div>
      ) : (
        /* 📂 TICKETS LIST */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {tickets.length === 0 ? (
            <div style={{ textAlign: 'center', backgroundColor: '#fff', padding: '3rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <HelpCircle size={48} style={{ color: '#94a3b8', marginBottom: '0.75rem' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#334155' }}>No tickets raised yet</h3>
              <p style={{ color: '#64748b', fontSize: '0.85rem' }}>If you face any issues with VetCare Pro, feel free to raise a support request.</p>
            </div>
          ) : (
            tickets.map((t) => (
              <div 
                key={t.id}
                onClick={() => setSelectedTicket(t)}
                style={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, fontFamily: 'monospace' }}>{t.id}</span>
                    <span style={{
                      padding: '0.15rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      backgroundColor: t.status === 'Open' ? '#fee2e2' : '#faf5ff',
                      color: t.status === 'Open' ? '#ef4444' : '#a855f7'
                    }}>
                      {t.status}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>{t.subject}</h3>
                  <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem' }}>
                    <span>Category: <strong>{t.category}</strong></span>
                    <span>Priority: <strong>{t.priority}</strong></span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Clock size={12} /> {t.updated}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#6366f1', fontWeight: 700 }}>View Details →</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
}
