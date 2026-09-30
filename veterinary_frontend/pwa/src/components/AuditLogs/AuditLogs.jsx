import React, { useState, useEffect, useCallback } from 'react';
import {
  Activity,
  Clock,
  ShieldAlert,
  Users,
  Zap,
  Search,
  Download,
  RefreshCw,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  X,
  Server,
  Terminal,
  Calendar,
  Layers,
  ArrowRight,
  Copy,
  Check,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
import api from '../../utils/api';
import './AuditLogs.css';
import toast from 'react-hot-toast';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);
  const [copied, setCopied] = useState(false);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(0); // 0 = off, 5, 10, 30

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [minLatency, setMinLatency] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 15, totalPages: 1 });

  // Fetch Stats
  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const res = await api.get('/api/v1/audit-logs/stats');
      if (res.data?.status === 'success') {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching audit stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Fetch Logs
  const fetchLogs = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      const params = {
        page,
        limit: 15,
        search,
        entity: entityFilter,
        status: statusFilter,
        method: methodFilter,
        minLatency
      };

      const res = await api.get('/api/v1/audit-logs', { params });
      if (res.data?.status === 'success') {
        setLogs(res.data.data.logs || []);
        setPagination(res.data.data.pagination || { total: 0, page: 1, limit: 15, totalPages: 1 });
      }
    } catch (err) {
      console.error('Error fetching audit logs:', err);
      if (!isSilent) toast.error('Failed to load audit logs');
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, [page, search, entityFilter, statusFilter, methodFilter, minLatency]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Auto Refresh Polling
  useEffect(() => {
    if (autoRefreshInterval <= 0) return;
    const interval = setInterval(() => {
      fetchLogs(true);
      fetchStats();
    }, autoRefreshInterval * 1000);
    return () => clearInterval(interval);
  }, [autoRefreshInterval, fetchLogs, fetchStats]);

  // Handle Export CSV
  const handleExportCSV = async () => {
    try {
      toast.loading('Generating Audit CSV...', { id: 'csv-export' });
      const res = await api.get('/api/v1/audit-logs/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `system_audit_logs_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Audit logs exported successfully!', { id: 'csv-export' });
    } catch (err) {
      toast.error('Failed to export CSV', { id: 'csv-export' });
    }
  };

  const resetFilters = () => {
    setSearch('');
    setEntityFilter('');
    setStatusFilter('');
    setMethodFilter('');
    setMinLatency('');
    setPage(1);
  };

  const hasActiveFilters = Boolean(search || entityFilter || statusFilter || methodFilter || minLatency);

  const getLatencyClass = (ms) => {
    if (!ms || ms < 100) return 'fast';
    if (ms < 300) return 'moderate';
    return 'slow';
  };

  const getLatencyLabel = (ms) => {
    if (!ms || ms < 100) return '⚡ Fast (<100ms)';
    if (ms < 300) return '⏱️ Moderate (100-300ms)';
    return '🐢 High Latency (>300ms)';
  };

  const handleCopyJSON = (data) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    toast.success('Trace payload copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Safe percentage calculations
  const fastCount = Number(stats?.latencyDistribution?.fast_count) || 0;
  const modCount = Number(stats?.latencyDistribution?.moderate_count) || 0;
  const slowCount = Number(stats?.latencyDistribution?.slow_count) || 0;
  const totalLatencySamples = fastCount + modCount + slowCount;
  const fastPercent = totalLatencySamples > 0 ? Math.round((fastCount / totalLatencySamples) * 100) : 0;
  const modPercent = totalLatencySamples > 0 ? Math.round((modCount / totalLatencySamples) * 100) : 0;
  const slowPercent = totalLatencySamples > 0 ? Math.max(0, 100 - fastPercent - modPercent) : 0;

  // Max domain count for bar scaling
  const maxDomainCount = stats?.actionBreakdown?.reduce((max, item) => Math.max(max, Number(item.count) || 0), 1) || 1;

  return (
    <div className="audit-logs-page animate-fade-in">
      {/* Header */}
      <div className="audit-header">
        <div>
          <div className="audit-header-title">
            <div className="audit-header-icon-wrap">
              <Activity size={24} />
            </div>
            <div>
              <div className="audit-title-row">
                <h1>Audit & System Performance</h1>
                <span className="audit-badge-live">
                  <span className="live-dot" /> Live Monitoring
                </span>
              </div>
              <p className="audit-header-subtitle">
                Comprehensive security audit trails, API latency analytics, operator activities, and system telemetry.
              </p>
            </div>
          </div>
        </div>

        <div className="audit-header-actions">
          {/* Auto Refresh Selector */}
          <div className="audit-refresh-select-wrap">
            <Clock size={15} className="audit-icon-muted" />
            <select
              className="audit-select-sm"
              value={autoRefreshInterval}
              onChange={(e) => setAutoRefreshInterval(Number(e.target.value))}
            >
              <option value={0}>Auto-refresh: Off</option>
              <option value={5}>Every 5s</option>
              <option value={10}>Every 10s</option>
              <option value={30}>Every 30s</option>
            </select>
          </div>

          <button
            className="audit-btn secondary"
            onClick={() => { fetchLogs(); fetchStats(); toast.success('Telemetry refreshed'); }}
            title="Refresh now"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>

          <button
            className="audit-btn primary"
            onClick={handleExportCSV}
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="audit-kpi-grid">
        <div className="audit-kpi-card blue">
          <div className="audit-kpi-header">
            <div className="audit-kpi-icon blue">
              <Server size={22} />
            </div>
            <span className="audit-kpi-tag blue">All Operations</span>
          </div>
          <div className="audit-kpi-body">
            <div className="audit-kpi-value">{stats?.totalEvents?.toLocaleString() || 0}</div>
            <div className="audit-kpi-label">Total Recorded Events</div>
            <div className="audit-kpi-subtext">Across all platform services</div>
          </div>
        </div>

        <div className="audit-kpi-card teal">
          <div className="audit-kpi-header">
            <div className="audit-kpi-icon teal">
              <Zap size={22} />
            </div>
            <span className="audit-kpi-tag teal">
              {stats?.avgLatencyMs && stats.avgLatencyMs < 150 ? '⚡ Ultra Fast' : '● Normal'}
            </span>
          </div>
          <div className="audit-kpi-body">
            <div className="audit-kpi-value">
              {stats?.avgLatencyMs ? `${stats.avgLatencyMs} ms` : '--'}
            </div>
            <div className="audit-kpi-label">Average API Latency</div>
            <div className="audit-kpi-subtext">Peak: {stats?.maxLatencyMs || 0} ms</div>
          </div>
        </div>

        <div className="audit-kpi-card red">
          <div className="audit-kpi-header">
            <div className="audit-kpi-icon red">
              <ShieldAlert size={22} />
            </div>
            <span className={`audit-kpi-tag ${stats?.errorRate > 5 ? 'red' : 'green'}`}>
              {stats?.errorRate > 5 ? '⚠️ Elevated' : '● 100% Healthy'}
            </span>
          </div>
          <div className="audit-kpi-body">
            <div className="audit-kpi-value">{stats?.errorRate ? `${stats.errorRate}%` : '0.0%'}</div>
            <div className="audit-kpi-label">System Error Rate</div>
            <div className="audit-kpi-subtext">{stats?.totalErrors || 0} Failed Requests (5xx / 4xx)</div>
          </div>
        </div>

        <div className="audit-kpi-card purple">
          <div className="audit-kpi-header">
            <div className="audit-kpi-icon purple">
              <Users size={22} />
            </div>
            <span className="audit-kpi-tag purple">Active Users</span>
          </div>
          <div className="audit-kpi-body">
            <div className="audit-kpi-value">{stats?.activeOperators || 1}</div>
            <div className="audit-kpi-label">Active Operators</div>
            <div className="audit-kpi-subtext">Authorized clinic staff active</div>
          </div>
        </div>
      </div>

      {/* Latency Health & Domain Breakdown Cards */}
      <div className="audit-insights-grid">
        {/* Latency Distribution Card */}
        <div className="audit-card">
          <div className="audit-card-header">
            <div className="audit-card-title">
              <Clock size={18} className="text-teal" />
              <span>Latency Health Distribution</span>
            </div>
            <span className="audit-card-badge">{totalLatencySamples} Samples Analyzed</span>
          </div>

          <div className="audit-card-body">
            {/* Multi-segment Progress Bar */}
            <div className="latency-bar-container">
              <div
                className="latency-bar-segment fast"
                style={{ width: `${Math.max(fastPercent, totalLatencySamples > 0 && fastCount > 0 ? 4 : 0)}%` }}
                title={`Fast: ${fastCount} (${fastPercent}%)`}
              />
              <div
                className="latency-bar-segment moderate"
                style={{ width: `${Math.max(modPercent, totalLatencySamples > 0 && modCount > 0 ? 4 : 0)}%` }}
                title={`Moderate: ${modCount} (${modPercent}%)`}
              />
              <div
                className="latency-bar-segment slow"
                style={{ width: `${Math.max(slowPercent, totalLatencySamples > 0 && slowCount > 0 ? 4 : 0)}%` }}
                title={`Slow: ${slowCount} (${slowPercent}%)`}
              />
            </div>

            {/* Legend Metrics */}
            <div className="latency-legend-grid">
              <div className="latency-stat-box fast">
                <div className="latency-stat-header">
                  <span className="latency-dot fast" />
                  <span className="latency-stat-title">Fast (&lt;100ms)</span>
                </div>
                <div className="latency-stat-count">{fastCount}</div>
                <div className="latency-stat-pct">{fastPercent}% of requests</div>
              </div>

              <div className="latency-stat-box moderate">
                <div className="latency-stat-header">
                  <span className="latency-dot moderate" />
                  <span className="latency-stat-title">Moderate (100-300ms)</span>
                </div>
                <div className="latency-stat-count">{modCount}</div>
                <div className="latency-stat-pct">{modPercent}% of requests</div>
              </div>

              <div className="latency-stat-box slow">
                <div className="latency-stat-header">
                  <span className="latency-dot slow" />
                  <span className="latency-stat-title">Slow (&gt;300ms)</span>
                </div>
                <div className="latency-stat-count">{slowCount}</div>
                <div className="latency-stat-pct">{slowPercent}% of requests</div>
              </div>
            </div>
          </div>
        </div>

        {/* Domain Activity Breakdown Card */}
        <div className="audit-card">
          <div className="audit-card-header">
            <div className="audit-card-title">
              <Layers size={18} className="text-purple" />
              <span>Activity Breakdown by Domain</span>
            </div>
            <span className="audit-card-badge">Top Functional Modules</span>
          </div>

          <div className="audit-card-body">
            {stats?.actionBreakdown && stats.actionBreakdown.length > 0 ? (
              <div className="domain-breakdown-list">
                {stats.actionBreakdown.map((item, idx) => {
                  const count = Number(item.count) || 0;
                  const percent = Math.round((count / (stats.totalEvents || 1)) * 100);
                  const barWidth = Math.max(8, Math.round((count / maxDomainCount) * 100));

                  return (
                    <div key={idx} className="domain-item">
                      <div className="domain-item-header">
                        <span className="domain-name">{item.entity || 'General System'}</span>
                        <div className="domain-item-meta">
                          <span className="domain-count">{count} operations</span>
                          <span className="domain-pct">({percent}%)</span>
                        </div>
                      </div>
                      <div className="domain-progress-track">
                        <div className="domain-progress-fill" style={{ width: `${barWidth}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="audit-empty-state">
                <Layers size={32} className="text-muted" />
                <p>No domain activity recorded yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Filters & Search Bar */}
      <div className="audit-filter-panel">
        <div className="audit-filter-header">
          <div className="audit-filter-title">
            <SlidersHorizontal size={16} />
            <span>Filter Audit Stream</span>
          </div>
          {hasActiveFilters && (
            <button className="audit-reset-btn" onClick={resetFilters}>
              <RotateCcw size={13} />
              <span>Clear Filters</span>
            </button>
          )}
        </div>

        <div className="audit-filter-grid">
          {/* Search Box */}
          <div className="audit-search-field">
            <Search size={16} className="audit-search-icon" />
            <input
              type="text"
              placeholder="Search by action, endpoint, operator name, IP..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="audit-search-input"
            />
            {search && (
              <button className="audit-clear-icon-btn" onClick={() => setSearch('')}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* Entity Dropdown */}
          <select
            className="audit-select"
            value={entityFilter}
            onChange={(e) => { setEntityFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Functional Domains</option>
            <option value="Auth">Auth & Security</option>
            <option value="Appointment">Appointments</option>
            <option value="Billing">Billing & POS</option>
            <option value="Pet">Pets & Patients</option>
            <option value="Owner">Pet Owners</option>
            <option value="Medical">Medical Records</option>
            <option value="Inventory">Inventory</option>
            <option value="Hospitalization">Hospitalization</option>
            <option value="Staff">Staff Management</option>
            <option value="Reports">Reports & Analytics</option>
            <option value="System">System APIs</option>
          </select>

          {/* Method Dropdown */}
          <select
            className="audit-select"
            value={methodFilter}
            onChange={(e) => { setMethodFilter(e.target.value); setPage(1); }}
          >
            <option value="">All HTTP Methods</option>
            <option value="GET">GET (Read)</option>
            <option value="POST">POST (Create)</option>
            <option value="PUT">PUT (Update)</option>
            <option value="DELETE">DELETE (Remove)</option>
          </select>

          {/* Status Dropdown */}
          <select
            className="audit-select"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Statuses</option>
            <option value="SUCCESS">Success (2xx)</option>
            <option value="WARNING">Client Error (4xx)</option>
            <option value="FAILED">Server Error (5xx)</option>
          </select>

          {/* Latency Threshold */}
          <select
            className="audit-select"
            value={minLatency}
            onChange={(e) => { setMinLatency(e.target.value); setPage(1); }}
          >
            <option value="">All Latencies</option>
            <option value="100">&gt; 100ms Latency</option>
            <option value="200">&gt; 200ms Latency</option>
            <option value="300">&gt; 300ms (Slow)</option>
            <option value="500">&gt; 500ms (High Latency)</option>
          </select>
        </div>
      </div>

      {/* Main Audit Records Table Card */}
      <div className="audit-table-card">
        <div className="audit-table-container">
          <table className="audit-data-table">
            <thead>
              <tr>
                <th style={{ width: '140px' }}>TIMESTAMP</th>
                <th style={{ width: '180px' }}>OPERATOR</th>
                <th style={{ width: '220px' }}>ACTION & DOMAIN</th>
                <th>HTTP REQUEST</th>
                <th style={{ width: '120px' }}>LATENCY</th>
                <th style={{ width: '130px' }}>STATUS</th>
                <th style={{ width: '100px', textAlign: 'right' }}>DETAILS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7}>
                    <div className="audit-table-loader">
                      <RefreshCw size={28} className="animate-spin text-teal" />
                      <p>Loading audit stream & telemetry records...</p>
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="audit-table-empty">
                      <Search size={36} className="text-muted" />
                      <h4>No Audit Records Found</h4>
                      <p>Try adjusting your search query or removing active filters.</p>
                      {hasActiveFilters && (
                        <button className="audit-btn secondary sm" onClick={resetFilters}>
                          Reset All Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const dateObj = new Date(log.created_at);
                  const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                  const dateStr = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
                  const initial = (log.user_name || 'S').charAt(0).toUpperCase();
                  const isSuccess = log.status === 'SUCCESS' || (log.status_code && log.status_code < 400);

                  return (
                    <tr key={log.id} className="audit-row">
                      {/* Timestamp */}
                      <td>
                        <div className="audit-cell-time">
                          <span className="audit-time">{timeStr}</span>
                          <span className="audit-date">{dateStr}</span>
                        </div>
                      </td>

                      {/* Operator */}
                      <td>
                        <div className="audit-operator-cell">
                          <div className="audit-operator-avatar" title={log.user_name || 'System'}>
                            {initial}
                          </div>
                          <div className="audit-operator-meta">
                            <span className="audit-operator-name">{log.user_name || 'System Auto'}</span>
                            <span className="audit-operator-role">{log.user_role || 'Background'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Action & Entity */}
                      <td>
                        <div className="audit-action-cell">
                          <span className="audit-action-badge">{log.action || 'API_CALL'}</span>
                          <span className="audit-entity-tag">[{log.entity || 'General'}]</span>
                        </div>
                      </td>

                      {/* HTTP Request */}
                      <td>
                        <div className="audit-request-cell">
                          <span className={`method-pill ${log.method || 'GET'}`}>
                            {log.method || 'GET'}
                          </span>
                          <span className="audit-endpoint-text" title={log.endpoint}>
                            {log.endpoint || '/api'}
                          </span>
                        </div>
                      </td>

                      {/* Latency */}
                      <td>
                        <span className={`latency-pill ${getLatencyClass(log.response_time_ms)}`}>
                          <Zap size={12} />
                          <span>{log.response_time_ms ? `${log.response_time_ms} ms` : '< 5 ms'}</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td>
                        <span className={`status-pill ${isSuccess ? 'success' : 'error'}`}>
                          {isSuccess ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}
                          <span>{log.status_code || 200} {log.status || 'OK'}</span>
                        </span>
                      </td>

                      {/* Action */}
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="audit-inspect-btn"
                          onClick={() => setSelectedLog(log)}
                          title="Inspect trace payload & metadata"
                        >
                          <Eye size={14} />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Modern Pagination Footer */}
        <div className="audit-pagination-footer">
          <div className="audit-pagination-count">
            Showing Page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages || 1}</strong> &bull; Total <strong>{pagination.total}</strong> events
          </div>

          <div className="audit-pagination-controls">
            <button
              className="audit-page-nav-btn"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <div className="audit-page-indicator">
              {page} / {pagination.totalPages || 1}
            </div>
            <button
              className="audit-page-nav-btn"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Inspect Detail Drawer / Modal */}
      {selectedLog && (
        <div className="audit-drawer-backdrop" onClick={() => setSelectedLog(null)}>
          <div className="audit-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="audit-drawer-header">
              <div className="audit-drawer-title-wrap">
                <div className="audit-drawer-icon">
                  <Terminal size={20} />
                </div>
                <div>
                  <h3>Audit Event Inspection</h3>
                  <p className="audit-drawer-sub">Trace ID: <code>{selectedLog.id}</code></p>
                </div>
              </div>
              <button className="audit-drawer-close-btn" onClick={() => setSelectedLog(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="audit-drawer-content">
              {/* Event Overview Grid */}
              <div className="audit-drawer-grid">
                <div className="audit-drawer-metric">
                  <span className="metric-label">Action</span>
                  <span className="metric-value font-bold">{selectedLog.action}</span>
                </div>

                <div className="audit-drawer-metric">
                  <span className="metric-label">Functional Domain</span>
                  <span className="metric-value font-bold text-teal">{selectedLog.entity}</span>
                </div>

                <div className="audit-drawer-metric">
                  <span className="metric-label">Operator</span>
                  <span className="metric-value">
                    {selectedLog.user_name || 'System Auto'} ({selectedLog.user_role || 'Admin'})
                  </span>
                </div>

                <div className="audit-drawer-metric">
                  <span className="metric-label">Response Latency</span>
                  <span className={`metric-value ${selectedLog.response_time_ms < 150 ? 'text-teal' : 'text-amber'}`}>
                    {selectedLog.response_time_ms ? `${selectedLog.response_time_ms} ms` : 'Instant'} ({getLatencyLabel(selectedLog.response_time_ms)})
                  </span>
                </div>

                <div className="audit-drawer-metric full">
                  <span className="metric-label">HTTP Request Target</span>
                  <span className="metric-value code">
                    <span className={`method-pill ${selectedLog.method || 'GET'}`}>{selectedLog.method || 'GET'}</span>
                    <code>{selectedLog.endpoint || '/'}</code>
                  </span>
                </div>

                <div className="audit-drawer-metric">
                  <span className="metric-label">HTTP Status</span>
                  <span className={`metric-value ${selectedLog.status_code < 400 ? 'text-teal' : 'text-red'}`}>
                    {selectedLog.status_code || 200} ({selectedLog.status || 'SUCCESS'})
                  </span>
                </div>

                <div className="audit-drawer-metric">
                  <span className="metric-label">Client IP</span>
                  <span className="metric-value code">
                    {selectedLog.ip_address || '127.0.0.1'}
                  </span>
                </div>

                <div className="audit-drawer-metric full">
                  <span className="metric-label">Timestamp</span>
                  <span className="metric-value">
                    {new Date(selectedLog.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Payload / Context Section */}
              <div className="audit-drawer-payload-section">
                <div className="audit-payload-header">
                  <span className="payload-title">Request & Context Telemetry</span>
                  <button
                    className="audit-copy-btn"
                    onClick={() => handleCopyJSON({
                      traceId: selectedLog.id,
                      action: selectedLog.action,
                      entity: selectedLog.entity,
                      endpoint: selectedLog.endpoint,
                      method: selectedLog.method,
                      latencyMs: selectedLog.response_time_ms,
                      statusCode: selectedLog.status_code,
                      ip: selectedLog.ip_address,
                      userAgent: selectedLog.user_agent,
                      requestContext: selectedLog.old_values ? (typeof selectedLog.old_values === 'string' ? JSON.parse(selectedLog.old_values) : selectedLog.old_values) : null,
                      responseContext: selectedLog.new_values ? (typeof selectedLog.new_values === 'string' ? JSON.parse(selectedLog.new_values) : selectedLog.new_values) : null,
                      timestamp: selectedLog.created_at
                    })}
                  >
                    {copied ? <Check size={14} className="text-teal" /> : <Copy size={14} />}
                    <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                </div>

                <pre className="audit-payload-code">
                  {JSON.stringify({
                    traceId: selectedLog.id,
                    action: selectedLog.action,
                    entity: selectedLog.entity,
                    endpoint: selectedLog.endpoint,
                    method: selectedLog.method,
                    latencyMs: selectedLog.response_time_ms,
                    statusCode: selectedLog.status_code,
                    ip: selectedLog.ip_address,
                    userAgent: selectedLog.user_agent,
                    requestContext: selectedLog.old_values ? (typeof selectedLog.old_values === 'string' ? JSON.parse(selectedLog.old_values) : selectedLog.old_values) : null,
                    responseContext: selectedLog.new_values ? (typeof selectedLog.new_values === 'string' ? JSON.parse(selectedLog.new_values) : selectedLog.new_values) : null,
                    timestamp: selectedLog.created_at
                  }, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
