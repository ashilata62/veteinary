import React, { useState, useEffect } from 'react';
import { ArrowLeft, MessageSquare, Plus, Send, HelpCircle, Tag, Clock, AlertTriangle } from 'lucide-react';
import { apiFetch } from '../utils/api';
import toast from 'react-hot-toast';

export default function Support({ isDarkTheme = false }) {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  
  // New ticket state
  const [newSubject, setNewSubject] = useState('');
  const [newPriority, setNewPriority] = useState('Medium');
  const [newCategory, setNewCategory] = useState('Technical');
  const [newDescription, setNewDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Admin's tickets matching database
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/api/v1/support-tickets');
      if (res.ok) {
        const json = await res.json();
        if (json.status === 'success' && Array.isArray(json.data)) {
          setTickets(json.data);
        }
      }
    } catch (err) {
      console.error('Error fetching support tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    try {
      const res = await apiFetch(`/api/v1/support-tickets/${selectedTicket.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: replyText })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.status === 'success') {
          const updated = json.data;
          setTickets(prev => prev.map(t => t.id === selectedTicket.id ? updated : t));
          setSelectedTicket(updated);
          setReplyText('');
        }
      }
    } catch (err) {
      console.error('Error replying to ticket:', err);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!newSubject.trim()) {
      toast.error('Please enter a ticket subject.');
      return;
    }
    if (!newDescription.trim()) {
      toast.error('Please enter a problem description.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiFetch('/api/v1/support-tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: newSubject.trim(),
          description: newDescription.trim(),
          priority: newPriority,
          category: newCategory
        })
      });
      const json = await res.json();
      if (res.ok && json.status === 'success') {
        toast.success('Support ticket submitted successfully!');
        const newTicket = json.data;
        setTickets(prev => [newTicket, ...prev]);
        setSelectedTicket(newTicket);
        setShowCreateForm(false);
        setNewSubject('');
        setNewDescription('');
        setNewPriority('Medium');
        setNewCategory('Technical');
      } else {
        toast.error(json.message || 'Failed to submit ticket. Please try again.');
      }
    } catch (err) {
      console.error('Error creating ticket:', err);
      toast.error('Failed to submit ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const isDark = isDarkTheme || (typeof document !== 'undefined' && !!document.querySelector('.trial-expired-page'));

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem 0' }}>
      
      {/* Header Panel */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: isDark ? '#f8fafc' : '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            🎫 Support Tickets
          </h1>
          <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
            Raise an issue or track existing tickets
          </p>
        </div>
        {selectedTicket && (
          <button 
            onClick={() => setSelectedTicket(null)}
            style={{
              padding: '0.45rem 1.1rem',
              backgroundColor: isDark ? 'rgba(99, 102, 241, 0.15)' : '#fff',
              border: '1.5px solid #6366f1',
              color: isDark ? '#a5b4fc' : '#6366f1',
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
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
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
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#fff',
              border: isDark ? '1.5px solid rgba(255, 255, 255, 0.2)' : '1.5px solid #64748b',
              color: isDark ? '#f8fafc' : '#64748b',
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
        /* 💬 TICKET CHAT FLOW */
        <div style={{
          backgroundColor: isDark ? '#0f172a' : '#fff',
          borderRadius: '16px',
          border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
          boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.03)',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          
          {/* Header Strip */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '1rem',
            borderBottom: isDark ? '1px solid #334155' : '1px solid #f1f5f9',
            paddingBottom: '1.25rem'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: isDark ? '#94a3b8' : '#64748b', fontWeight: 600, fontFamily: 'monospace' }}>{selectedTicket.id}</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', margin: '0.25rem 0 0 0', letterSpacing: '-0.5px' }}>{selectedTicket.subject}</h2>
            </div>
            
            {/* Status tags */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={{ padding: '0.35rem 0.85rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: isDark ? 'rgba(147, 51, 234, 0.2)' : '#faf5ff', color: isDark ? '#c084fc' : '#9333ea' }}>{selectedTicket.status}</span>
              <span style={{ padding: '0.35rem 0.85rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: isDark ? 'rgba(217, 119, 6, 0.2)' : '#fffbeb', color: isDark ? '#fbbf24' : '#d97706' }}>{selectedTicket.priority}</span>
              <span style={{ padding: '0.35rem 0.85rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: isDark ? 'rgba(13, 148, 136, 0.2)' : '#f0fdfa', color: isDark ? '#2dd4bf' : '#0d9488' }}>{selectedTicket.category}</span>
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
                      backgroundColor: isUser ? '#3b82f6' : (isDark ? '#1e293b' : '#f1f5f9'),
                      color: isUser ? '#fff' : (isDark ? '#f8fafc' : '#0f172a'),
                      padding: '0.85rem 1.25rem',
                      borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      fontSize: '0.9rem',
                      lineHeight: 1.45,
                      border: !isUser && isDark ? '1px solid #334155' : 'none'
                    }}
                  >
                    {msg.text}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: isDark ? '#64748b' : '#94a3b8', marginTop: '0.35rem', fontWeight: 600 }}>
                    {msg.sender} · {msg.time}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Reply Form */}
          <form onSubmit={handleSendReply} style={{ display: 'flex', gap: '0.75rem', borderTop: isDark ? '1px solid #334155' : '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
            <input 
              type="text"
              placeholder="Type your reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: isDark ? '1.5px solid #334155' : '1.5px solid #cbd5e1',
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                color: isDark ? '#f8fafc' : '#0f172a',
                outline: 'none',
                fontSize: '0.9rem'
              }}
              onFocus={(e) => e.target.style.borderColor = '#6366f1'}
              onBlur={(e) => e.target.style.borderColor = isDark ? '#334155' : '#cbd5e1'}
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
        <div style={{
          backgroundColor: isDark ? '#0f172a' : '#fff',
          borderRadius: '16px',
          border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
          padding: '1.75rem',
          boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.02)'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: isDark ? '#f8fafc' : '#1e293b', marginBottom: '1.25rem' }}>Submit a Support Ticket</h2>
          <form onSubmit={handleCreateTicket} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: isDark ? '#cbd5e1' : '#475569', marginBottom: '0.35rem' }}>Category</label>
                <select 
                  value={newCategory} 
                  onChange={(e) => setNewCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    color: isDark ? '#f8fafc' : '#0f172a',
                    outline: 'none',
                    fontSize: '0.9rem'
                  }}
                >
                  <option value="Technical" style={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', color: isDark ? '#f8fafc' : '#0f172a' }}>Technical Support</option>
                  <option value="Billing" style={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', color: isDark ? '#f8fafc' : '#0f172a' }}>Billing & Subscription</option>
                  <option value="Feature Request" style={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', color: isDark ? '#f8fafc' : '#0f172a' }}>Feature Request</option>
                  <option value="Account" style={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', color: isDark ? '#f8fafc' : '#0f172a' }}>Account Access</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: isDark ? '#cbd5e1' : '#475569', marginBottom: '0.35rem' }}>Priority</label>
                <select 
                  value={newPriority} 
                  onChange={(e) => setNewPriority(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    color: isDark ? '#f8fafc' : '#0f172a',
                    outline: 'none',
                    fontSize: '0.9rem'
                  }}
                >
                  <option value="Low" style={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', color: isDark ? '#f8fafc' : '#0f172a' }}>Low</option>
                  <option value="Medium" style={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', color: isDark ? '#f8fafc' : '#0f172a' }}>Medium</option>
                  <option value="High" style={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', color: isDark ? '#f8fafc' : '#0f172a' }}>High</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: isDark ? '#cbd5e1' : '#475569', marginBottom: '0.35rem' }}>Subject</label>
              <input 
                type="text" 
                placeholder="Briefly state the issue..."
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  color: isDark ? '#f8fafc' : '#0f172a',
                  outline: 'none',
                  fontSize: '0.9rem'
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: isDark ? '#cbd5e1' : '#475569', marginBottom: '0.35rem' }}>Problem Description</label>
              <textarea 
                rows="5"
                placeholder="Explain the problem in detail. Include screenshots link if any..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  color: isDark ? '#f8fafc' : '#0f172a',
                  outline: 'none',
                  resize: 'vertical',
                  fontSize: '0.9rem'
                }}
                required
              />
            </div>

            <button 
              type="submit"
              disabled={submitting}
              style={{
                alignSelf: 'flex-start',
                padding: '0.75rem 2rem',
                backgroundColor: submitting ? '#818cf8' : '#6366f1',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: submitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {submitting ? 'Submitting Ticket...' : 'Submit Ticket'}
            </button>
          </form>
        </div>
      ) : (
        /* 📂 TICKETS LIST */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {tickets.length === 0 ? (
            <div style={{
              textAlign: 'center',
              backgroundColor: isDark ? '#0f172a' : '#fff',
              padding: '3rem',
              borderRadius: '16px',
              border: isDark ? '1px solid #334155' : '1px solid #e2e8f0'
            }}>
              <HelpCircle size={48} style={{ color: isDark ? '#64748b' : '#94a3b8', marginBottom: '0.75rem' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: isDark ? '#f8fafc' : '#334155' }}>No tickets raised yet</h3>
              <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.85rem' }}>If you face any issues with PetCare Pro, feel free to raise a support request.</p>
            </div>
          ) : (
            tickets.map((t) => (
              <div 
                key={t.id}
                onClick={() => setSelectedTicket(t)}
                style={{
                  backgroundColor: isDark ? '#0f172a' : '#fff',
                  border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.2s',
                  boxShadow: isDark ? '0 2px 10px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.02)'
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = isDark ? '#6366f1' : '#cbd5e1'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = isDark ? '#334155' : '#e2e8f0'}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.72rem', color: isDark ? '#94a3b8' : '#64748b', fontWeight: 700, fontFamily: 'monospace' }}>{t.id}</span>
                    <span style={{
                      padding: '0.15rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      backgroundColor: t.status === 'Open' ? (isDark ? 'rgba(239, 68, 68, 0.2)' : '#fee2e2') : (isDark ? 'rgba(168, 85, 247, 0.2)' : '#faf5ff'),
                      color: t.status === 'Open' ? '#ef4444' : '#a855f7'
                    }}>
                      {t.status}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: isDark ? '#f8fafc' : '#1e293b', margin: 0 }}>{t.subject}</h3>
                  <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.78rem', color: isDark ? '#94a3b8' : '#64748b', marginTop: '0.2rem' }}>
                    <span>Category: <strong style={{ color: isDark ? '#e2e8f0' : '#475569' }}>{t.category}</strong></span>
                    <span>Priority: <strong style={{ color: isDark ? '#e2e8f0' : '#475569' }}>{t.priority}</strong></span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
                  <span style={{ fontSize: '0.78rem', color: isDark ? '#94a3b8' : '#64748b', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Clock size={12} /> {t.updated}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 700 }}>View Details →</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
}
