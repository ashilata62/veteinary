import React, { useState, useEffect } from 'react';
import { 
  IndianRupee, Users, UserCheck, Clock, 
  AlertTriangle, Ticket, ChevronDown, BarChart2
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

  const statsData = stats ? {
    totalRevenue: stats.totalRevenue,
    totalRevenueRaw: stats.totalRevenue,
    monthlyRevenue: stats.monthlyRevenue,
    totalAdmins: stats.totalClinics,
    activePaidAdmins: stats.paidClinics,
    freeTrialAdmins: stats.trialClinics,
    expiredBlocked: stats.expiredTrials,
    openTickets: stats.openSupportTickets
  } : {
    totalRevenue: 520000,
    totalRevenueRaw: 520000,
    monthlyRevenue: 45000,
    totalAdmins: 30,
    activePaidAdmins: 24,
    freeTrialAdmins: 9,
    expiredBlocked: 6,
    openTickets: 12
  };

  const renewalsList = [
    { id: 1, clinic: 'Downtown Vet Care', owner: 'Dr. John Doe', expiry: '8/6/2026', plan: '7-Day Trial', planType: 'trial' },
    { id: 2, clinic: 'PetCare Central', owner: 'Dr. Jane Smith', expiry: '8/10/2026', plan: 'Monthly Pro', planType: 'pro' },
    { id: 3, clinic: 'Paws & Claws Clinic', owner: 'Dr. Vikram Singh', expiry: '8/12/2026', plan: 'Yearly Enterprise', planType: 'enterprise' },
    { id: 4, clinic: 'City Vet Hospital', owner: 'Rajesh Kumar', expiry: '8/14/2026', plan: '7-Day Trial', planType: 'trial' },
    { id: 5, clinic: 'Happy Tails Clinic', owner: 'Dr. Anjali Sharma', expiry: '8/15/2026', plan: 'Monthly Pro', planType: 'pro' },
  ];

  return (
    <div className="sa-dash-wrapper">
      {/* Title Header */}
      <div className="sa-dash-header">
        <h1 className="sa-dash-title">Analytics Dashboard</h1>
        <p className="sa-dash-subtitle">Super Admin · Business Overview</p>
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
            <span className="sa-trend green">↑ 12%</span>
            <span className="sa-trend-sub">{formatRawRevenue(statsData.totalRevenueRaw)}</span>
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
            <span className="sa-trend green">↑ 9%</span>
            <span className="sa-trend-sub">This month</span>
          </div>
        </div>

        {/* Card 3: Total Admins */}
        <div className="sa-card border-purple">
          <div className="sa-card-top">
            <div>
              <span className="sa-card-label">TOTAL ADMINS</span>
              <div className="sa-card-value">{statsData.totalAdmins || 30}</div>
            </div>
            <div className="sa-card-watermark purple">
              <Users size={28} />
            </div>
          </div>
          <div className="sa-card-bottom">
            <span className="sa-trend green">↑ 8%</span>
            <span className="sa-trend-sub">4 new this month</span>
          </div>
        </div>

        {/* Card 4: Active Paid Admins */}
        <div className="sa-card border-green">
          <div className="sa-card-top">
            <div>
              <span className="sa-card-label">ACTIVE PAID ADMINS</span>
              <div className="sa-card-value">{statsData.activePaidAdmins || 24}</div>
            </div>
            <div className="sa-card-watermark green">
              <UserCheck size={28} />
            </div>
          </div>
          <div className="sa-card-bottom">
            <span className="sa-trend green">↑ 5%</span>
            <span className="sa-trend-sub">Subscribed owners</span>
          </div>
        </div>

        {/* Card 5: Free Trial Admins */}
        <div className="sa-card border-amber">
          <div className="sa-card-top">
            <div>
              <span className="sa-card-label">FREE TRIAL ADMINS</span>
              <div className="sa-card-value">{statsData.freeTrialAdmins || 9}</div>
            </div>
            <div className="sa-card-watermark amber">
              <Clock size={28} />
            </div>
          </div>
          <div className="sa-card-bottom">
            <span className="sa-trend green">↑ 3%</span>
            <span className="sa-trend-sub">7-Day Trial active</span>
          </div>
        </div>

        {/* Card 6: Expired / Blocked */}
        <div className="sa-card border-red">
          <div className="sa-card-top">
            <div>
              <span className="sa-card-label">EXPIRED / BLOCKED</span>
              <div className="sa-card-value">{statsData.expiredBlocked || 6}</div>
            </div>
            <div className="sa-card-watermark red">
              <AlertTriangle size={28} />
            </div>
          </div>
          <div className="sa-card-bottom">
            <span className="sa-trend red">↓ 2%</span>
            <span className="sa-trend-sub">Action required</span>
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
            <span className="sa-trend green">↑ 0%</span>
            <span className="sa-trend-sub">Support requests</span>
          </div>
        </div>

      </div>

      {/* Dark Summary Banner */}
      <div className="sa-dark-banner">
        <div className="sa-banner-item">
          <div className="sa-banner-val">{formatRevenue(statsData.totalRevenue)}</div>
          <div className="sa-banner-lbl">Total Revenue</div>
        </div>
        <div className="sa-banner-item">
          <div className="sa-banner-val">{formatRevenue(statsData.monthlyRevenue)}</div>
          <div className="sa-banner-lbl">Monthly</div>
        </div>
        <div className="sa-banner-item">
          <div className="sa-banner-val">{statsData.totalAdmins}</div>
          <div className="sa-banner-lbl">Admins</div>
        </div>
      </div>

      {/* Upcoming Renewals Table Container */}
      <div className="sa-renewals-card">
        <div className="sa-renewals-header">
          <div className="sa-renewals-title">
            <Clock size={20} className="sa-clock-icon" />
            <span>Upcoming Renewals</span>
          </div>
          <div className="sa-renewals-actions">
            <div className="sa-select-wrapper">
              <select 
                value={timeFilter} 
                onChange={(e) => setTimeFilter(e.target.value)}
                className="sa-filter-select"
              >
                <option value="Next 7 Days">Next 7 Days</option>
                <option value="Next 15 Days">Next 15 Days</option>
                <option value="Next 30 Days">Next 30 Days</option>
              </select>
              <ChevronDown size={14} className="sa-select-arrow" />
            </div>

            <button className="sa-export-btn">
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
              {renewalsList.map((item) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
