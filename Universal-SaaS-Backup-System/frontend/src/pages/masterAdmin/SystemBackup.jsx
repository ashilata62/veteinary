import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dbService, apiClient } from '../../services/dbService';

// Icons
import StorageIcon from '@mui/icons-material/Storage';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RestorePageIcon from '@mui/icons-material/RestorePage';
import ScheduleIcon from '@mui/icons-material/Schedule';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import BusinessIcon from '@mui/icons-material/Business';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export const SystemBackup = () => {
  const queryClient = useQueryClient();
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedBackupForRestore, setSelectedBackupForRestore] = useState(null);
  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFileForUpload, setSelectedFileForUpload] = useState(null);
  const [restoreImmediatelyOnUpload, setRestoreImmediatelyOnUpload] = useState(true);
  const [selectedTenantId, setSelectedTenantId] = useState('');
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  // 1. Fetch Backups List
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['system-backups'],
    queryFn: () => dbService.getBackups(),
    refetchInterval: 30000 // Refresh every 30s
  });

  // 2. Fetch Tenants for Company-wise Backup
  const { data: tenantsResponse } = useQuery({
    queryKey: ['platform-tenants-list'],
    queryFn: () => dbService.getMasterTenants({ limit: 200 }),
    staleTime: 60000
  });

  const tenants = Array.isArray(tenantsResponse?.tenants)
    ? tenantsResponse.tenants
    : Array.isArray(tenantsResponse?.data)
    ? tenantsResponse.data
    : Array.isArray(tenantsResponse)
    ? tenantsResponse
    : [];

  const backups = data?.data || [];

  // Calculate metrics
  const totalBackups = backups.length;
  const dbBackupsCount = backups.filter(b => b.type === 'database').length;
  const filesBackupsCount = backups.filter(b => b.type === 'uploads').length;
  const latestBackupTime = backups.length > 0 ? new Date(backups[0].createdAt).toLocaleString() : 'Never';

  // 3. Create Backup Mutation
  const createBackupMutation = useMutation({
    mutationFn: ({ type, tenantId }) => dbService.createBackup({ type, tenantId }),
    onMutate: () => setActionLoading(true),
    onSuccess: (res) => {
      setActionLoading(false);
      setCompanyModalOpen(false);
      setSelectedTenantId('');
      setToast({ open: true, message: res.message || 'Backup generated successfully!', severity: 'success' });
      queryClient.invalidateQueries(['system-backups']);
    },
    onError: (err) => {
      setActionLoading(false);
      setToast({ open: true, message: err?.response?.data?.message || 'Failed to create backup.', severity: 'error' });
    }
  });

  // 4. Upload & Restore Backup Mutation
  const uploadBackupMutation = useMutation({
    mutationFn: ({ file, restoreImmediately }) => dbService.uploadBackup(file, restoreImmediately),
    onMutate: () => setActionLoading(true),
    onSuccess: (res) => {
      setActionLoading(false);
      setUploadModalOpen(false);
      setSelectedFileForUpload(null);
      setToast({
        open: true,
        message: res.message || (res.restored ? 'Backup uploaded and database restored successfully!' : 'Backup archive uploaded!'),
        severity: 'success'
      });
      queryClient.invalidateQueries();
    },
    onError: (err) => {
      setActionLoading(false);
      setToast({ open: true, message: err?.response?.data?.message || 'Failed to upload backup.', severity: 'error' });
    }
  });

  // 5. Delete Backup Mutation
  const deleteBackupMutation = useMutation({
    mutationFn: (filename) => dbService.deleteBackup(filename),
    onSuccess: (res) => {
      setToast({ open: true, message: res.message || 'Backup deleted successfully.', severity: 'info' });
      queryClient.invalidateQueries(['system-backups']);
    },
    onError: (err) => {
      setToast({ open: true, message: err?.response?.data?.message || 'Delete failed.', severity: 'error' });
    }
  });

  // 6. Restore Mutation
  const restoreMutation = useMutation({
    mutationFn: (filename) => dbService.restoreBackup(filename),
    onMutate: () => setActionLoading(true),
    onSuccess: (res) => {
      setActionLoading(false);
      setSelectedBackupForRestore(null);
      setToast({
        open: true,
        message: res?.message || 'Database successfully restored from snapshot!',
        severity: 'success'
      });
      queryClient.invalidateQueries();
    },
    onError: (err) => {
      setActionLoading(false);
      setSelectedBackupForRestore(null);
      setToast({ open: true, message: err?.response?.data?.message || 'Restore failed.', severity: 'error' });
    }
  });

  // Handle direct authenticated file download
  const handleDownload = async (filename) => {
    try {
      setToast({ open: true, message: 'Downloading backup archive...', severity: 'info' });
      const response = await apiClient.get(`/master-admin/backups/download/${encodeURIComponent(filename)}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      setToast({ open: true, message: 'Download failed. Please try again.', severity: 'error' });
    }
  };

  const handleStartCompanyBackup = () => {
    if (!selectedTenantId) {
      setToast({ open: true, message: 'Please select a company to backup', severity: 'warning' });
      return;
    }
    createBackupMutation.mutate({ type: 'database', tenantId: selectedTenantId });
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <StorageIcon sx={{ fontSize: 36, color: '#4f46e5' }} /> System Backups & Recovery
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            Generate instant full database snapshots, company-wise data backups, and archive uploaded files.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => refetch()}
            disabled={isLoading || actionLoading}
            sx={{ borderColor: '#cbd5e1', color: '#475569', borderRadius: 2 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={actionLoading ? <CircularProgress size={18} color="inherit" /> : <CloudUploadIcon />}
            onClick={() => setUploadModalOpen(true)}
            disabled={actionLoading}
            sx={{ bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' }, borderRadius: 2, fontWeight: 700 }}
          >
            📤 Upload & Restore
          </Button>
          <Button
            variant="contained"
            startIcon={actionLoading ? <CircularProgress size={18} color="inherit" /> : <FolderZipIcon />}
            onClick={() => createBackupMutation.mutate({ type: 'uploads' })}
            disabled={actionLoading}
            sx={{ bgcolor: '#0284c7', '&:hover': { bgcolor: '#0369a1' }, borderRadius: 2, fontWeight: 600 }}
          >
            Backup Files (.zip)
          </Button>
          <Button
            variant="contained"
            startIcon={actionLoading ? <CircularProgress size={18} color="inherit" /> : <BusinessIcon />}
            onClick={() => setCompanyModalOpen(true)}
            disabled={actionLoading}
            sx={{ bgcolor: '#d97706', '&:hover': { bgcolor: '#b45309' }, borderRadius: 2, fontWeight: 600 }}
          >
            🏢 Company Backup
          </Button>
          <Button
            variant="contained"
            startIcon={actionLoading ? <CircularProgress size={18} color="inherit" /> : <StorageIcon />}
            onClick={() => createBackupMutation.mutate({ type: 'database', tenantId: null })}
            disabled={actionLoading}
            sx={{ bgcolor: '#4f46e5', '&:hover': { bgcolor: '#4338ca' }, borderRadius: 2, fontWeight: 600 }}
          >
            🌐 Full DB Snapshot
          </Button>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 2.5, bgcolor: '#eef2ff', color: '#4f46e5' }}>
                <StorageIcon sx={{ fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                  Total Backups
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
                  {totalBackups}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 2.5, bgcolor: '#f0fdf4', color: '#16a34a' }}>
                <CheckCircleIcon sx={{ fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                  Database Snapshots
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
                  {dbBackupsCount}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 2.5, bgcolor: '#e0f2fe', color: '#0284c7' }}>
                <FolderZipIcon sx={{ fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                  File Archives (.zip)
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
                  {filesBackupsCount}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 2.5, bgcolor: '#fef3c7', color: '#d97706' }}>
                <ScheduleIcon sx={{ fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                  Auto-Schedule
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  Daily @ 00:00 (Active)
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Backup Archives Table */}
      <Paper sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <Box sx={{ p: 2.5, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b' }}>
            Available Backup Archives
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            Last Created: {latestBackupTime}
          </Typography>
        </Box>

        {isLoading ? (
          <Box sx={{ p: 6, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : backups.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <StorageIcon sx={{ fontSize: 54, color: '#cbd5e1', mb: 1 }} />
            <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 600 }}>
              No Backups Created Yet
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
              Click "Company Backup", "Full DB Snapshot" or "Backup Files" to generate your first backup archive.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="contained"
                onClick={() => setCompanyModalOpen(true)}
                disabled={actionLoading}
                sx={{ bgcolor: '#d97706', textTransform: 'none', fontWeight: 700 }}
              >
                🏢 Company Backup
              </Button>
              <Button
                variant="contained"
                onClick={() => createBackupMutation.mutate({ type: 'database', tenantId: null })}
                disabled={actionLoading}
                sx={{ bgcolor: '#4f46e5', textTransform: 'none', fontWeight: 700 }}
              >
                🌐 Full DB Snapshot
              </Button>
            </Box>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Archive Name</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Scope / Company</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Size</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Created Date & Time</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {backups.map((backup) => {
                  const isCompanyScoped = backup.scope === 'company' || backup.filename.includes('company_') || backup.filename.includes('tenant_');
                  return (
                    <TableRow key={backup.filename} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell sx={{ fontWeight: 600, color: '#1e293b', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                        {backup.filename}
                      </TableCell>
                      <TableCell>
                        {isCompanyScoped ? (
                          <Chip
                            icon={<CorporateFareIcon sx={{ fontSize: '16px !important' }} />}
                            label={backup.companyName ? `${backup.companyName}` : (backup.scopeLabel || 'Company Backup')}
                            size="small"
                            sx={{ bgcolor: 'rgba(217, 119, 6, 0.1)', color: '#b45309', fontWeight: 800, border: '1px solid rgba(217, 119, 6, 0.3)' }}
                          />
                        ) : backup.type === 'uploads' ? (
                          <Chip
                            icon={<FolderZipIcon sx={{ fontSize: '16px !important' }} />}
                            label="File Uploads"
                            size="small"
                            sx={{ bgcolor: '#e0f2fe', color: '#0284c7', fontWeight: 700 }}
                          />
                        ) : (
                          <Chip
                            icon={<StorageIcon sx={{ fontSize: '16px !important' }} />}
                            label="🌐 Full Platform"
                            size="small"
                            sx={{ bgcolor: '#eef2ff', color: '#4f46e5', fontWeight: 800, border: '1px solid rgba(79, 70, 229, 0.2)' }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {backup.type === 'database' ? (
                          <Chip label="Database (.gz)" size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: '0.75rem' }} />
                        ) : (
                          <Chip label="Zip Archive" size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: '0.75rem' }} />
                        )}
                      </TableCell>
                      <TableCell sx={{ color: '#475569', fontWeight: 600 }}>
                        {backup.sizeFormatted}
                      </TableCell>
                      <TableCell sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                        {new Date(backup.createdAt).toLocaleString()} ({backup.ageInDays}d ago)
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          <Tooltip title="Download Backup Archive">
                            <IconButton
                              size="small"
                              onClick={() => handleDownload(backup.filename)}
                              sx={{ color: '#0284c7', '&:hover': { bgcolor: '#f0f9ff' } }}
                            >
                              <CloudDownloadIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          {backup.type === 'database' && (
                            <Tooltip title="Restore Database from this Snapshot">
                              <IconButton
                                size="small"
                                onClick={() => setSelectedBackupForRestore(backup.filename)}
                                sx={{ color: '#d97706', '&:hover': { bgcolor: '#fffbeb' } }}
                              >
                                <RestorePageIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}

                          <Tooltip title="Delete Backup">
                            <IconButton
                              size="small"
                              onClick={() => deleteBackupMutation.mutate(backup.filename)}
                              sx={{ color: '#ef4444', '&:hover': { bgcolor: '#fef2f2' } }}
                            >
                              <DeleteForeverIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Company-wise Backup Selection Modal */}
      <Dialog
        open={companyModalOpen}
        onClose={() => !actionLoading && setCompanyModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 800, fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', gap: 1.5, color: '#1e293b' }}>
          <BusinessIcon sx={{ color: '#d97706' }} /> Export Company-wise Data Backup
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
            Select an organization/tenant to export all of its isolated data (Leads, Clients, Consultations, Staff Members, Case Cycles, Invoices, Documents metadata & Custom Settings) into a compressed <code>.json.gz</code> backup archive.
          </Typography>

          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel id="select-company-backup-label">Select Registered Company *</InputLabel>
            <Select
              labelId="select-company-backup-label"
              value={selectedTenantId}
              label="Select Registered Company *"
              onChange={(e) => setSelectedTenantId(e.target.value)}
            >
              {tenants.length === 0 ? (
                <MenuItem disabled value="">
                  <em>No registered companies found</em>
                </MenuItem>
              ) : (
                tenants.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {t.name}
                      </Typography>
                      <Chip label={`Slug: ${t.slug}`} size="small" sx={{ height: 20, fontSize: '0.7rem', ml: 1 }} />
                    </Box>
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <Alert severity="info" sx={{ mt: 2, fontSize: '0.825rem' }}>
            ℹ️ Company-scoped backups ensure 100% data isolation and can be restored or migrated independently without impacting other tenants.
          </Alert>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2.5, bgcolor: '#f8fafc', gap: 1 }}>
          <Button onClick={() => setCompanyModalOpen(false)} disabled={actionLoading} sx={{ color: '#64748b', fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleStartCompanyBackup}
            disabled={actionLoading || !selectedTenantId}
            sx={{ bgcolor: '#d97706', '&:hover': { bgcolor: '#b45309' }, fontWeight: 700 }}
            startIcon={actionLoading ? <CircularProgress size={16} color="inherit" /> : <CloudUploadIcon />}
          >
            {actionLoading ? 'Generating Backup...' : 'Generate Company Backup'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upload & Restore Backup Modal */}
      <Dialog
        open={uploadModalOpen}
        onClose={() => !actionLoading && setUploadModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 800, fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', gap: 1.5, color: '#1e293b' }}>
          <CloudUploadIcon sx={{ color: '#10b981' }} /> Upload Backup Archive & Restore
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#64748b', mb: 2.5 }}>
            Upload a previously exported database snapshot (<code>.json.gz</code> or <code>.json</code>) or file archive (<code>.zip</code>).
          </Typography>

          <Box
            sx={{
              border: '2px dashed #cbd5e1',
              borderRadius: 3,
              p: 3,
              textAlign: 'center',
              bgcolor: '#f8fafc',
              cursor: 'pointer',
              '&:hover': { borderColor: '#10b981', bgcolor: '#f0fdf4' },
              transition: 'all 0.2s'
            }}
            onClick={() => document.getElementById('backup-file-upload-input').click()}
          >
            <input
              id="backup-file-upload-input"
              type="file"
              accept=".gz,.json,.zip"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setSelectedFileForUpload(e.target.files[0]);
                }
              }}
            />
            <CloudUploadIcon sx={{ fontSize: 44, color: '#10b981', mb: 1 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b' }}>
              {selectedFileForUpload ? selectedFileForUpload.name : 'Click to select backup file'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              {selectedFileForUpload
                ? `${(selectedFileForUpload.size / (1024 * 1024)).toFixed(2)} MB • Ready for upload`
                : 'Supports .json.gz, .json, and .zip archives (up to 100MB)'}
            </Typography>
          </Box>

          <Box sx={{ mt: 2.5 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={restoreImmediatelyOnUpload}
                  onChange={(e) => setRestoreImmediatelyOnUpload(e.target.checked)}
                  sx={{ color: '#10b981', '&.Mui-checked': { color: '#10b981' } }}
                />
              }
              label={
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  Restore database records immediately upon upload
                </Typography>
              }
            />
          </Box>

          <Alert severity="info" sx={{ mt: 2, fontSize: '0.825rem' }}>
            💡 <strong>Company Data Restoration:</strong> If you upload an isolated company backup, only that specific organization's leads, clients, consultations, staff, and settings will be restored. Other companies' data remains 100% untouched.
          </Alert>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2.5, bgcolor: '#f8fafc', gap: 1 }}>
          <Button onClick={() => setUploadModalOpen(false)} disabled={actionLoading} sx={{ color: '#64748b', fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (!selectedFileForUpload) {
                setToast({ open: true, message: 'Please select a backup file first', severity: 'warning' });
                return;
              }
              uploadBackupMutation.mutate({
                file: selectedFileForUpload,
                restoreImmediately: restoreImmediatelyOnUpload
              });
            }}
            disabled={actionLoading || !selectedFileForUpload}
            sx={{ bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' }, fontWeight: 700 }}
            startIcon={actionLoading ? <CircularProgress size={16} color="inherit" /> : <CloudUploadIcon />}
          >
            {actionLoading ? 'Uploading & Restoring...' : (restoreImmediatelyOnUpload ? 'Upload & Restore Now' : 'Upload Archive Only')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Restore Confirmation Dialog */}
      <Dialog
        open={Boolean(selectedBackupForRestore)}
        onClose={() => !actionLoading && setSelectedBackupForRestore(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#b45309' }}>
          <WarningAmberIcon sx={{ fontSize: 28 }} /> Confirm Database Restoration
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#334155', mb: 2 }}>
            You are about to restore the database from snapshot:
            <Box component="span" sx={{ display: 'block', fontWeight: 700, fontFamily: 'monospace', my: 1, p: 1, bgcolor: '#f8fafc', borderRadius: 1 }}>
              {selectedBackupForRestore}
            </Box>
            ⚠️ <strong>Warning:</strong> Existing database records may be overwritten or merged with the records from this snapshot. Please make sure to create a new backup before proceeding.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, bgcolor: '#f8fafc' }}>
          <Button onClick={() => setSelectedBackupForRestore(null)} disabled={actionLoading} sx={{ color: '#64748b' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={() => restoreMutation.mutate(selectedBackupForRestore)}
            disabled={actionLoading}
            startIcon={actionLoading && <CircularProgress size={16} color="inherit" />}
          >
            Yes, Restore Snapshot
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={toast.severity} onClose={() => setToast(prev => ({ ...prev, open: false }))} sx={{ width: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SystemBackup;
