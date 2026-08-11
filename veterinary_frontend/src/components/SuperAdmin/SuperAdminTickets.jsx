import React, { useState } from "react";
import { Search, ArrowLeft, Send, MessageSquare, Clipboard, User, Mail, Filter, RotateCcw, CheckCircle2 } from "lucide-react";

export default function SuperAdminTickets() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [appliedFilters, setAppliedFilters] = useState({ status: "All", priority: "All" });
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState("");

  const [tickets, setTickets] = useState([
    {
      id: "TKT-1786006334931-390",
      subject: "Payment Issue",
      clinic: "Anytime Fitness Vet",
      adminName: "Rahul Sharma",
      email: "anytimefitness@gmail.com",
      priority: "Medium",
      category: "Billing",
      status: "Replied",
      updated: "8 Aug 2026",
      messages: [
        { sender: "Admin", text: "There is an issue with the payment gateway. It shows error on checkout.", time: "06/08/26, 2:22 pm", isUser: true },
        { sender: "Superadmin", text: "We have identified the issue. It will be resolved within 24 hours.", time: "06/08/26, 2:27 pm", isUser: false }
      ]
    },
    {
      id: "TKT-1892017382103-512",
      subject: "Login Issue",
      clinic: "Paws & Claws Care",
      adminName: "Dr. John Doe",
      email: "john.doe@pawsclaws.com",
      priority: "High",
      category: "Technical",
      status: "Open",
      updated: "7 Aug 2026",
      messages: [
        { sender: "Admin", text: "Dashboard is loading slow today and showing connection timeout errors repeatedly.", time: "07/08/26, 10:15 am", isUser: true }
      ]
    },
    {
      id: "TKT-1634891290342-108",
      subject: "Invoice Download",
      clinic: "Happy Pets Clinic",
      adminName: "Dr. Sarah Connor",
      email: "sarah.connor@happypets.com",
      priority: "Low",
      category: "Billing",
      status: "Closed",
      updated: "5 Aug 2026",
      messages: [
        { sender: "Admin", text: "How do I download duplicate copies of receipts from the billing section?", time: "05/08/26, 11:30 am", isUser: true },
        { sender: "Superadmin", text: "You can go to Billing & POS and click the download icon next to any invoice.", time: "05/08/26, 11:45 am", isUser: false }
      ]
    }
  ]);

  const totalTickets = tickets.length;
  const openCount    = tickets.filter(t => t.status === "Open").length;
  const repliedCount = tickets.filter(t => t.status === "Replied").length;
  const closedCount  = tickets.filter(t => t.status === "Closed").length;

  const handleApplyFilters = () => setAppliedFilters({ status: statusFilter, priority: priorityFilter });
  const handleResetFilters = () => {
    setStatusFilter("All"); setPriorityFilter("All");
    setAppliedFilters({ status: "All", priority: "All" }); setSearch("");
  };
  const handleStatusChange = (ticketId, newStatus) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const updated = { ...t, status: newStatus, updated: "Just now" };
        if (selectedTicket?.id === ticketId) setSelectedTicket(updated);
        return updated;
      }
      return t;
    }));
  };
  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;
    const now = new Date();
    const time = `${String(now.getDate()).padStart(2,"0")}/${String(now.getMonth()+1).padStart(2,"0")}/${String(now.getFullYear()).substring(2)}, ${now.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}).toLowerCase()}`;
    const newMsg = { sender: "Superadmin", text: replyText.trim(), time, isUser: false };
    setTickets(prev => prev.map(t => {
      if (t.id === selectedTicket.id) {
        const updated = { ...t, status: "Replied", updated: "Just now", messages: [...t.messages, newMsg] };
        setSelectedTicket(updated); return updated;
      }
      return t;
    }));
    setReplyText("");
  };

  const filteredTickets = tickets.filter(t => {
    const s = `${t.subject} ${t.clinic} ${t.id}`.toLowerCase();
    return s.includes(search.toLowerCase()) &&
      (appliedFilters.status === "All" || t.status === appliedFilters.status) &&
      (appliedFilters.priority === "All" || t.priority === appliedFilters.priority);
  });

  const priorityBadge = (p) => ({ High: "sa-badge sa-badge-red", Medium: "sa-badge sa-badge-amber", Low: "sa-badge sa-badge-green" }[p] || "sa-badge sa-badge-gray");
  const statusBadge   = (s) => ({ Open: "sa-badge sa-badge-red", Replied: "sa-badge sa-badge-purple", Closed: "sa-badge sa-badge-green" }[s] || "sa-badge sa-badge-gray");

  return (
    <div className="sa-dash-wrapper">
      {/* Page Header */}
      <div className="sa-page-header">
        <div>
          <h1 className="sa-dash-title">Support Tickets</h1>
          <p className="sa-dash-subtitle">Manage all clinic admin support requests</p>
        </div>
        {selectedTicket && (
          <button className="sa-btn sa-btn-outline" onClick={() => setSelectedTicket(null)}>
            <ArrowLeft size={15} /> Back to List
          </button>
        )}
      </div>

      {!selectedTicket ? (
        <>
          {/* Stat Cards */}
          <div className="sa-cards-grid">
            {[
              { label: "Total", value: totalTickets, cls: "border-blue", wcls: "blue" },
              { label: "Open", value: openCount, cls: "border-red", wcls: "red" },
              { label: "Replied", value: repliedCount, cls: "border-purple", wcls: "purple" },
              { label: "Closed", value: closedCount, cls: "border-emerald", wcls: "emerald" },
            ].map(c => (
              <div key={c.label} className={`sa-card ${c.cls}`}>
                <div className="sa-card-top">
                  <div><span className="sa-card-label">{c.label}</span><div className="sa-card-value">{c.value}</div></div>
                  <div className={`sa-card-watermark ${c.wcls}`}><MessageSquare size={28}/></div>
                </div>
                <div className="sa-card-bottom"><span className="sa-trend-sub">tickets</span></div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="sa-section-card">
            <div className="sa-section-header">
              <div className="sa-section-title"><Filter size={15}/> Filters</div>
              <button className="sa-btn sa-btn-outline" onClick={handleResetFilters}><RotateCcw size={13}/> Reset</button>
            </div>
            <div style={{ padding: "1rem 1.25rem", display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
              <div className="sa-search-bar" style={{ flex: 1, minWidth: "200px" }}>
                <Search size={16} className="sa-search-icon" />
                <input type="text" placeholder="Search ticket, clinic..." value={search} onChange={e => setSearch(e.target.value)} className="sa-search-input" style={{ width: "100%" }} />
              </div>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="sa-filter-select">
                <option value="All">All Statuses</option>
                <option value="Open">Open</option>
                <option value="Replied">Replied</option>
                <option value="Closed">Closed</option>
              </select>
              <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="sa-filter-select">
                <option value="All">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <button className="sa-btn sa-btn-primary" onClick={handleApplyFilters}>Apply Filters</button>
            </div>
          </div>

          {/* Table */}
          <div className="sa-section-card">
            <div className="sa-section-header">
              <div className="sa-section-title"><MessageSquare size={15}/> Tickets ({filteredTickets.length})</div>
            </div>
            <div className="sa-table-responsive">
              <table className="sa-renewals-table">
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Clinic / Admin</th>
                    <th>Subject</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Updated</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.length === 0 ? (
                    <tr><td colSpan="7" style={{ padding: "2.5rem", textAlign: "center", color: "#64748b" }}>No tickets found.</td></tr>
                  ) : filteredTickets.map(t => (
                    <tr key={t.id}>
                      <td style={{ fontFamily: "monospace", fontSize: "0.78rem", color: "#64748b" }}>{t.id.substring(0,20)}…</td>
                      <td>
                        <div style={{ fontWeight: 700, color: "#0f172a" }}>{t.clinic}</div>
                        <div style={{ fontSize: "0.775rem", color: "#64748b", marginTop: "2px" }}>{t.adminName}</div>
                      </td>
                      <td style={{ fontWeight: 600, color: "#1e293b" }}>{t.subject}</td>
                      <td><span className={priorityBadge(t.priority)}>{t.priority}</span></td>
                      <td><span className={statusBadge(t.status)}>{t.status}</span></td>
                      <td style={{ color: "#64748b", fontSize: "0.82rem" }}>{t.updated}</td>
                      <td>
                        <button className="sa-btn sa-btn-outline" style={{ fontSize: "0.78rem", padding: "0.3rem 0.75rem" }} onClick={() => setSelectedTicket(t)}>
                          View →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* TICKET DETAIL */
        <div className="sa-section-card">
          <div className="sa-section-header" style={{ flexDirection: "column", alignItems: "flex-start", gap: "0.85rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", flexWrap: "wrap", gap: "0.5rem", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: "0.72rem", color: "#94a3b8", fontFamily: "monospace", fontWeight: 600, marginBottom: "0.25rem" }}>{selectedTicket.id}</div>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.5rem 0" }}>{selectedTicket.subject}</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", fontSize: "0.82rem", color: "#64748b" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Clipboard size={13}/> {selectedTicket.clinic}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><User size={13}/> {selectedTicket.adminName}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Mail size={13}/> {selectedTicket.email}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                <span className={statusBadge(selectedTicket.status)} style={{ padding: "0.3rem 0.8rem" }}>{selectedTicket.status}</span>
                <span className={priorityBadge(selectedTicket.priority)} style={{ padding: "0.3rem 0.8rem" }}>{selectedTicket.priority}</span>
                <span className="sa-badge sa-badge-teal" style={{ padding: "0.3rem 0.8rem" }}>{selectedTicket.category}</span>
              </div>
            </div>
            {/* Status Toggle */}
            <div className="sa-status-toggle">
              <button className={`sa-status-pill ${selectedTicket.status === "Open" ? "active-open" : ""}`} onClick={() => handleStatusChange(selectedTicket.id, "Open")}>Open</button>
              <button className={`sa-status-pill ${selectedTicket.status === "Replied" ? "active-replied" : ""}`} onClick={() => handleStatusChange(selectedTicket.id, "Replied")}>Replied</button>
              <button className={`sa-status-pill ${selectedTicket.status === "Closed" ? "active-closed" : ""}`} onClick={() => handleStatusChange(selectedTicket.id, "Closed")}>Closed</button>
            </div>
          </div>

          {/* Chat + Reply */}
          <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            <div className="sa-ticket-chat-box">
              {selectedTicket.messages.map((msg, idx) => {
                const isSelf = !msg.isUser;
                return (
                  <div key={idx} className={`sa-chat-bubble-wrap ${isSelf ? "self" : "other"}`}>
                    <div className={`sa-chat-bubble ${isSelf ? "self" : "other"}`}>{msg.text}</div>
                    <span className="sa-chat-meta">{msg.sender} · {msg.time}</span>
                  </div>
                );
              })}
            </div>
            <form className="sa-chat-reply-form" onSubmit={handleSendReply}>
              <input type="text" placeholder="Type your reply to the admin..." value={replyText} onChange={e => setReplyText(e.target.value)} className="sa-chat-input" />
              <button type="submit" className="sa-btn sa-btn-primary"><Send size={15}/> Send</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
