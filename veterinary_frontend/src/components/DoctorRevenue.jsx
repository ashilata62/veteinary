import React, { useState, useEffect } from 'react';
import { IndianRupee, TrendingUp, Calendar, Home, Activity, CheckCircle, Loader } from 'lucide-react';
import { apiFetch } from '../utils/api';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

export default function DoctorRevenue() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await apiFetch('/api/v1/reports/my-revenue', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const json = await res.json();
        if (json.status === 'success') {
          setData(json.data);
        }
      } catch (err) {
        console.error('Error fetching doctor revenue:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRevenue();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', flexDirection: 'column', gap: '1rem' }}>
        <Loader className="animate-spin" style={{ color: 'var(--primary-teal)', animation: 'spin 1s linear infinite' }} size={32} />
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading your revenue analytics...</p>
      </div>
    );
  }

  const metrics = data ? [
    { 
      label: 'My Revenue (Total)', 
      value: `₹${data.metrics.revenue.toLocaleString('en-IN')}`, 
      sub: 'Paid clinical transactions', 
      icon: IndianRupee, 
      iconBg: 'rgba(20, 184, 166, 0.15)', 
      iconColor: '#14b8a6' 
    },
    { 
      label: 'Consultations Completed', 
      value: String(data.metrics.consultations), 
      sub: 'Visits and charts created', 
      icon: CheckCircle, 
      iconBg: 'rgba(59, 130, 246, 0.15)', 
      iconColor: '#3b82f6' 
    },
    { 
      label: 'Treatments Performed', 
      value: String(data.metrics.treatments), 
      sub: 'Surgeries and procedures logged', 
      icon: Activity, 
      iconBg: 'rgba(245, 158, 11, 0.15)', 
      iconColor: '#f59e0b' 
    },
    { 
      label: 'Home Visits Completed', 
      value: String(data.metrics.homeVisits), 
      sub: 'Completed mobile clinic duty', 
      icon: Home, 
      iconBg: 'rgba(139, 92, 246, 0.15)', 
      iconColor: '#8b5cf6' 
    },
  ] : [];

  const trendData = data && data.trend.length > 0 ? data.trend : [
    { day: 'No Data', revenue: 0, consultations: 0 }
  ];

  const breakdownData = data && data.breakdown.length > 0 ? data.breakdown : [
    { name: 'No Transactions', value: 0 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.4s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>My Revenue Analytics</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>Track your personal clinical performance and earnings.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: '8px', backgroundColor: '#fff', fontWeight: 500 }}>
            <Calendar size={14} /> Realtime Database Mode
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="card hover-lift" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
              <div style={{ width: '54px', height: '54px', borderRadius: '50%', backgroundColor: m.iconBg, color: m.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={24} />
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', margin: 0 }}>{m.label}</p>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '4px 0 0 0' }}>{m.value}</h3>
                <span style={{ color: 'var(--success)', fontSize: '0.7rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px', marginTop: '4px' }}>
                  <TrendingUp size={12} /> {m.sub}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-grid-2col">
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '350px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Revenue Trend (Past 30 Days)</h3>
          <div style={{ flex: 1, minHeight: '300px' }}>
            {data && data.trend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} tickFormatter={(val) => `₹${val}`} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    formatter={(value) => [`₹${value}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                No clinical revenue data found for this doctor.
              </div>
            )}
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '350px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Income Breakdown</h3>
          <div style={{ flex: 1, minHeight: '300px' }}>
            {data && data.breakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={breakdownData} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} tickFormatter={(val) => `₹${val}`} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-primary)', fontWeight: 600 }} width={100} />
                  <RechartsTooltip cursor={{fill: 'var(--background)'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} formatter={(value) => [`₹${value}`, 'Income']} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                No items or service income records found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
