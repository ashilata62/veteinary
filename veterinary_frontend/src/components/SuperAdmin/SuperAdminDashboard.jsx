import React, { useState, useEffect } from 'react';
import { 
  IndianRupee, Users, UserCheck, Clock, 
  AlertTriangle, Ticket, ChevronDown, BarChart2, TrendingUp
} from 'lucide-react';
import { apiFetch } from '../../utils/api';

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('Next 7 Days');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiFetch('/api/super-admin/stats');
        const data = await response.json();
        if (data.status === 'success') {
          setStats(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatRevenue = (value) => {
    if (value === undefined || value === null) return '₹0';
    if (typeof value === 'string' && value.includes('₹')) return value;
    const num = Number(value);
    if (isNaN(num)) return `₹${value}`;
    if (num >= 100000) {
      return `₹${(num / 100000).toFixed(1)}L`;
    }
    if (num >= 1000) {
      return `₹${(num / 1000).toFixed(1)}K`;
    }
    return `₹${num}`;
  };

  const formatRawRevenue = (value) => {
    if (value === undefined || value === null) return '₹0';
    if (typeof value === 'string' && value.includes('₹')) return value;
    const num = Number(value);
    if (isNaN(num)) return `₹${value}`;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  const statsData = {
    totalRevenue: stats?.totalRevenue ?? 0,
    totalRevenueRaw: stats?.totalRevenue ?? 0,
    monthlyRevenue: stats?.monthlyRevenue ?? 0,
    totalAdmins: stats?.totalClinics ?? 0,
    activePaidAdmins: stats?.activeClinics ?? 0,
    freeTrialAdmins: stats?.trialClinics ?? 0,
    expiredBlocked: stats?.expiredClinics ?? 0,
    openTickets: stats?.openSupportTickets ?? 0
  };

  const renewalsList = stats?.upcomingRenewals || [];

  return (
    <div className="sa-dash-wrapper">
      {/* Title Header */}
      <div className="sa-page-header">
        <div>
          <h1 className="sa-dash-title">Analytics Dashboard</h1>
          <p className="sa-dash-subtitle">Super Admin · Business Overview</p>
        </div>
      </div>

      {/* Top 7 Stat Cards Grid */}
      <div className="sa-cards-grid">
        
        {/* Card 1: Total Revenue */}
        <div className="sa-card border-cyan">
          <div className="sa-card-top">
            <div>
              <span className="sa-card-label">TOTAL REVENUE</span>
              <div className="sa-card-value">{formatRevenue(statsData.totalRevenue)}</div>
            </div>
            <div className="sa-card-watermark cyan">
              <IndianRupee size={28} />
            </div>
          </div>
          <div className="sa-card-bottom">
            <span className="sa-trend-sub">All-time revenue ({formatRawRevenue(statsData.totalRevenueRaw)})</span>
          </div>
        </div>

        {/* Card 2: Monthly Revenue */}
        <div className="sa-card border-emerald">
          <div className="sa-card-top">
            <div>
              <span className="sa-card-label">MONTHLY REVENUE</span>
              <div className="sa-card-value">{formatRevenue(statsData.monthlyRevenue)}</div>
            </div>
            <div className="sa-card-watermark emerald">
              <BarChart2 size={28} />
            </div>
          </div>
          <div className="sa-card-bottom">
            <span className="sa-trend-sub">Current month</span>
          </div>
        </div>

        {/* Card 3: Total Admins / Clinics */}
        <div className="sa-card border-purple">
          <div className="sa-card-top">
            <div>
              <span className="sa-card-label">TOTAL ADMINS / CLINICS</span>
              <div className="sa-card-value">{statsData.totalAdmins ?? 0}</div>
            </div>
            <div className="sa-card-watermark purple">
              <Users size={28} />
            </div>
          </div>
          <div className="sa-card-bottom">
            <span className="sa-trend-sub">Registered clinics</span>
          </div>
        </div>

        {/* Card 4: Active Paid Admins */}
        <div className="sa-card border-green">
          <div className="sa-card-top">
            <div>
              <span className="sa-card-label">ACTIVE PAID ADMINS</span>
              <div className="sa-card-value">{statsData.activePaidAdmins ?? 0}</div>
            </div>
            <div className="sa-card-watermark green">
              <UserCheck size={28} />
            </div>
          </div>
          <div className="sa-card-bottom">
            <span className="sa-trend-sub">Subscribed clinics</span>
          </div>
        </div>

        {/* Card 5: Free Trial Admins */}
        <div className="sa-card border-amber">
          <div className="sa-card-top">
            <div>
              <span className="sa-card-label">FREE TRIAL ADMINS</span>
              <div className="sa-card-value">{statsData.freeTrialAdmins ?? 0}</div>
            </div>
            <div className="sa-card-watermark amber">
              <Clock size={28} />
            </div>
          </div>
          <div className="sa-card-bottom">
            <span className="sa-trend-sub">Active trial clinics</span>
          </div>
        </div>

        {/* Card 6: Expired / Blocked */}
        <div className="sa-card border-red">
          <div className="sa-card-top">
            <div>
              <span className="sa-card-label">EXPIRED / SUSPENDED</span>
              <div className="sa-card-value">{statsData.expiredBlocked ?? 0}</div>
            </div>
            <div className="sa-card-watermark red">
              <AlertTriangle size={28} />
            </div>
          </div>
          <div className="sa-card-bottom">
            <span className="sa-trend-sub">Needs renewal</span>
          </div>
        </div>

        {/* Card 7: Open Tickets */}
        <div className="sa-card border-blue">
          <div className="sa-card-top">
            <div>
              <span className="sa-card-label">OPEN TICKETS</span>
              <div className="sa-card-value">{statsData.openTickets ?? 0}</div>
            </div>
            <div className="sa-card-watermark blue">
              <Ticket size={28} />
            </div>
          </div>
          <div className="sa-card-bottom">
            <span className="sa-trend-sub">Pending support requests</span>
          </div>
        </div>

      </div>

      {/* Upcoming Renewals Table Container */}
      <div className="sa-section-card">
        <div className="sa-section-header">
          <div className="sa-section-title">
            <Clock size={16} />
            <span>Upcoming Renewals</span>
          </div>
          <div className="sa-section-actions">
            <div className="sa-select-wrapper">
              <select 
                value={timeFilter} 
                onChange={(e) => setTimeFilter(e.target.value)}
                className="sa-select"
              >
                <option value="Next 7 Days">Next 7 Days</option>
                <option value="Next 15 Days">Next 15 Days</option>
                <option value="Next 30 Days">Next 30 Days</option>
              </select>
            </div>

            <button className="sa-btn sa-btn-outline">
              <span>Export</span>
              <ChevronDown size={14} />
            </button>
          </div>
        </div>

        {/* Renewals Table */}
        <div className="sa-table-responsive">
          <table className="sa-renewals-table">
            <thead>
              <tr>
                <th>Clinic / Hospital</th>
                <th>Owner / Doctor</th>
                <th>Expiry</th>
                <th>Plan</th>
              </tr>
            </thead>
            <tbody>
              {renewalsList.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                    No upcoming renewals found.
                  </td>
                </tr>
              ) : (
                renewalsList.map((item) => (
                  <tr key={item.id}>
                    <td className="sa-td-bold">{item.clinic}</td>
                    <td>{item.owner}</td>
                    <td className="sa-td-expiry">{item.expiry}</td>
                    <td>
                      <span className={`sa-plan-badge ${item.planType}`}>
                        {item.plan}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
