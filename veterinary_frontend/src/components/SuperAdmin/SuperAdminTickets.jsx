import React, { useState } from 'react';
import { Search, ArrowLeft, Send, CheckCircle2, AlertCircle, MessageSquare, Clipboard, User, Mail, ShieldAlert } from 'lucide-react';

export default function SuperAdminTickets() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  
  // Active selected filters applied to table
  const [appliedFilters, setAppliedFilters] = useState({ status: 'All', priority: 'All' });
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Initial mock tickets matching user's screens
  const [tickets, setTickets] = useState([
    {
      id: 'TKT-1786006334931-390',
      subject: 'Payment',
      clinic: 'anytime',
      adminName: 'anytime',
      email: 'anytimefitness@gmail.com',
      priority: 'Medium',
      category: 'Technical',
      status: 'Replied',
      updated: '6/8/2026',
      messages: [
        { sender: 'Admin', text: 'this issee', time: '06/08/26, 2:22 pm', isUser: true },
        { sender: 'Superadmin', text: 'hyyy', time: '06/08/26, 2:27 pm', isUser: false }
      ]
    },
    {
      id: 'TKT-1892017382103-512',
      subject: 'Login Issue',
      clinic: 'Paws & Claws Care',
      adminName: 'Dr. John Doe',
      email: 'john.doe@pawsclaws.com',
      priority: 'High',
      category: 'Technical',
      status: 'Open',
      updated: '7/8/2026',
      messages: [
        { sender: 'Admin', text: 'Dashboard is loading slow today and showing connection timeout errors.', time: '07/08/26, 10:15 am', isUser: true }
      ]
    },
    {
      id: 'TKT-1634891290342-108',
      subject: 'Invoice Generation',
      clinic: 'Happy Pets Clinic',
      adminName: 'Dr. Sarah Connor',
      email: 'sarah.connor@happypets.com',
      priority: 'Low',
      category: 'Billing',
      status: 'Closed',
      updated: '5/8/2026',
      messages: [
        { sender: 'Admin', text: 'How do I download duplicate copies of receipts?', time: '05/08/26, 11:30 am', isUser: true },
        { sender: 'Superadmin', text: 'You can go to Billing & POS and click download icon next to any invoice.', time: '05/08/26, 11:45 am', isUser: false }
      ]
    }
  ]);

  // Statistics
  const totalTickets = tickets.length;
  const openCount = tickets.filter(t => t.status === 'Open').length;
  const repliedCount = tickets.filter(t => t.status === 'Replied').length;
  const closedCount = tickets.filter(t => t.status === 'Closed').length;

  const handleApplyFilters = () => {
    setAppliedFilters({ status: statusFilter, priority: priorityFilter });
  };

  const handleResetFilters = () => {
    setStatusFilter('All');
    setPriorityFilter('All');
    setAppliedFilters({ status: 'All', priority: 'All' });
    setSearch('');
  };

  const handleStatusChange = (ticketId, newStatus) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const updated = { ...t, status: newStatus, updated: 'Today' };
        if (selectedTicket?.id === ticketId) {
          setSelectedTicket(updated);
        }
        return updated;
      }
      return t;
    }));
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    const now = new Date();
    const formattedTime = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getFullYear()).substring(2)}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase()}`;

    const newMsg = {
      sender: 'Superadmin',
      text: replyText.trim(),
      time: formattedTime,
      isUser: false
    };

    setTickets(prev => prev.map(t => {
      if (t.id === selectedTicket.id) {
        const updatedTicket = {
          ...t,
          status: 'Replied',
          updated: 'Just now',
          messages: [...t.messages, newMsg]
        };
        setSelectedTicket(updatedTicket);
        return updatedTicket;
      }
      return t;
    }));

    setReplyText('');
  };

  // Filtered list
  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.clinic.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = appliedFilters.status === 'All' || t.status === appliedFilters.status;
    const matchesPriority = appliedFilters.priority === 'All' || t.priority === appliedFilters.priority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="sa-dash-wrapper">
      {/* Back to List Header / Page Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="sa-dash-title">Support Tickets</h1>
          <p className="sa-dash-subtitle">Manage all clinic owner support requests</p>
        </div>
        {selectedTicket && (
          <button 
            onClick={() => setSelectedTicket(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#fff',
              border: '1.5px solid #3b82f6',
              color: '#3b82f6',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            <ArrowLeft size={16} /> Back to List
          </button>
        )}
      </div>

      {!selectedTicket ? (
        <>
          {/* 4 Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            {/* Card 1: Total */}
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.25rem', border: '1px solid #e2e8f0', borderLeft: '5px solid #3b82f6', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b' }}>{totalTickets}</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginTop: '0.25rem' }}>Total</div>
            </div>
            
            {/* Card 2: Open */}
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.25rem', border: '1px solid #e2e8f0', borderLeft: '5px solid #06b6d4', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b' }}>{openCount}</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginTop: '0.25rem' }}>Open</div>
            </div>

            {/* Card 3: Replied */}
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.25rem', border: '1px solid #e2e8f0', borderLeft: '5px solid #a855f7', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b' }}>{repliedCount}</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginTop: '0.25rem' }}>Replied</div>
            </div>

            {/* Card 4: Closed */}
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.25rem', border: '1px solid #e2e8f0', borderLeft: '5px solid #10b981', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b' }}>{closedCount}</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginTop: '0.25rem' }}>Closed</div>
            </div>
          </div>

          {/* Filter Panel */}
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-end' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '150px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Status</span>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                >
                  <option value="All">All</option>
                  <option value="Open">Open</option>
                  <option value="Replied">Replied</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '150px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Priority</span>
                <select 
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                >
                  <option value="All">All</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, minWidth: '220px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Search Clinic/Subject</span>
                <input 
                  type="text"
                  placeholder="Type to search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button 
                  onClick={handleApplyFilters}
                  style={{ padding: '0.5rem 1.25rem', backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: 'background-color 0.2s' }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#4f46e5'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#6366f1'}
                >
                  Apply Filters
                </button>
                <button 
                  onClick={handleResetFilters}
                  style={{ padding: '0.5rem 1.25rem', backgroundColor: '#fff', border: '1.5px solid #cbd5e1', color: '#475569', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Tickets Table */}
          <div className="sa-renewals-card">
            <div className="sa-table-responsive">
              <table className="sa-renewals-table">
                <thead>
                  <tr style={{ backgroundColor: '#fff7ed', borderBottom: '2px solid #ffedd5' }}>
                    <th style={{ color: '#c2410c', fontWeight: 700 }}>TICKET #</th>
                    <th style={{ color: '#c2410c', fontWeight: 700 }}>CLINIC / ADMIN</th>
                    <th style={{ color: '#c2410c', fontWeight: 700 }}>SUBJECT</th>
                    <th style={{ color: '#c2410c', fontWeight: 700 }}>PRIORITY</th>
                    <th style={{ color: '#c2410c', fontWeight: 700 }}>STATUS</th>
                    <th style={{ color: '#c2410c', fontWeight: 700 }}>UPDATED</th>
                    <th style={{ color: '#c2410c', fontWeight: 700 }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                        No tickets found matching your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredTickets.map((t) => (
                      <tr key={t.id}>
                        <td style={{ fontFamily: 'monospace', color: '#64748b', fontSize: '0.8rem' }}>{t.id}</td>
                        <td>
                          <div style={{ fontWeight: 700, color: '#334155' }}>{t.clinic}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{t.adminName}</div>
                        </td>
                        <td style={{ fontWeight: 600, color: '#1e293b' }}>{t.subject}</td>
                        <td>
                          <span style={{
                            padding: '0.25rem 0.65rem',
                            borderRadius: '20px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            backgroundColor: t.priority === 'High' ? '#fff7ed' : t.priority === 'Medium' ? '#fef3c7' : '#f0fdf4',
                            color: t.priority === 'High' ? '#ea580c' : t.priority === 'Medium' ? '#d97706' : '#16a34a'
                          }}>
                            {t.priority}
                          </span>
                        </td>
                        <td>
                          <span style={{
                            padding: '0.25rem 0.65rem',
                            borderRadius: '20px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            backgroundColor: t.status === 'Open' ? '#fef2f2' : t.status === 'Replied' ? '#faf5ff' : '#ecfdf5',
                            color: t.status === 'Open' ? '#ef4444' : t.status === 'Replied' ? '#a855f7' : '#10b981'
                          }}>
                            {t.status}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.85rem', color: '#475569' }}>{t.updated}</td>
                        <td>
                          <button 
                            onClick={() => setSelectedTicket(t)}
                            style={{
                              padding: '0.35rem 0.85rem',
                              backgroundColor: '#fff',
                              border: '1.5px solid #cbd5e1',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              color: '#334155',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            Open <span style={{ fontSize: '0.9rem' }}>→</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Full screen Chat Flow - matches image exactly */
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Header Info */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.25rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, fontFamily: 'monospace' }}>{selectedTicket.id}</span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0.25rem 0 0.5rem 0', letterSpacing: '-0.5px' }}>{selectedTicket.subject}</h2>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: '#64748b', fontSize: '0.82rem', marginTop: '0.5rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clipboard size={14} /> {selectedTicket.clinic}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><User size={14} /> {selectedTicket.adminName}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={14} /> {selectedTicket.email}</span>
              </div>
            </div>

            {/* Badges */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={{ padding: '0.35rem 0.85rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#faf5ff', color: '#9333ea' }}>{selectedTicket.status}</span>
              <span style={{ padding: '0.35rem 0.85rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#fffbeb', color: '#d97706' }}>{selectedTicket.priority}</span>
              <span style={{ padding: '0.35rem 0.85rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#f0fdfa', color: '#0d9488' }}>{selectedTicket.category}</span>
            </div>
          </div>

          {/* Quick status change buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', background: '#f8fafc', padding: '0.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', width: 'fit-content' }}>
            <button 
              onClick={() => handleStatusChange(selectedTicket.id, 'Open')}
              style={{ padding: '0.4rem 1rem', border: 'none', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', backgroundColor: selectedTicket.status === 'Open' ? '#ef4444' : 'transparent', color: selectedTicket.status === 'Open' ? '#fff' : '#64748b' }}
            >
              Open
            </button>
            <button 
              onClick={() => handleStatusChange(selectedTicket.id, 'Replied')}
              style={{ padding: '0.4rem 1rem', border: 'none', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', backgroundColor: selectedTicket.status === 'Replied' ? '#a855f7' : 'transparent', color: selectedTicket.status === 'Replied' ? '#fff' : '#64748b' }}
            >
              Replied
            </button>
            <button 
              onClick={() => handleStatusChange(selectedTicket.id, 'Closed')}
              style={{ padding: '0.4rem 1rem', border: 'none', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', backgroundColor: selectedTicket.status === 'Closed' ? '#10b981' : 'transparent', color: selectedTicket.status === 'Closed' ? '#fff' : '#64748b' }}
            >
              Closed
            </button>
          </div>

          {/* Chat box container */}
          <div style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 0', overflowY: 'auto' }}>
            {selectedTicket.messages.map((msg, idx) => {
              const isSelf = !msg.isUser;
              return (
                <div 
                  key={idx} 
                  style={{
                    alignSelf: isSelf ? 'flex-end' : 'flex-start',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isSelf ? 'flex-end' : 'flex-start',
                    maxWidth: '75%'
                  }}
                >
                  <div style={{
                    backgroundColor: isSelf ? '#3b82f6' : '#f1f5f9',
                    color: isSelf ? '#ffffff' : '#0f172a',
                    padding: '0.85rem 1.25rem',
                    borderRadius: isSelf ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    fontSize: '0.9rem',
                    lineHeight: 1.4
                  }}>
                    {msg.text}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.35rem', fontWeight: 600 }}>
                    {msg.sender} · {msg.time}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Send Reply box */}
          <form onSubmit={handleSendReply} style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
            <input 
              type="text"
              placeholder="Type your reply to the admin..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'border-color 0.2s'
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
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#4f46e5'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#6366f1'}
            >
              Send
            </button>
          </form>

        </div>
      )}
    </div>
  );
}
