import axios from 'axios';

// Change baseURL to your API URL if needed
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || localStorage.getItem('clientToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const dbService = {
  // Master Admin: Backups & Recovery
  getBackups: async () => {
    const res = await apiClient.get('/master-admin/backups');
    return res.data;
  },
  createBackup: async (data = { type: 'database', tenantId: null }) => {
    const res = await apiClient.post('/master-admin/backups/create', data);
    return res.data;
  },
  deleteBackup: async (filename) => {
    const res = await apiClient.delete(`/master-admin/backups/${encodeURIComponent(filename)}`);
    return res.data;
  },
  restoreBackup: async (filename) => {
    const res = await apiClient.post('/master-admin/backups/restore', { filename });
    return res.data;
  },
  uploadBackup: async (file, restoreImmediately = false) => {
    const formData = new FormData();
    formData.append('backupFile', file);
    formData.append('restoreImmediately', restoreImmediately);
    const res = await apiClient.post('/master-admin/backups/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  getDownloadBackupUrl: (filename) => {
    return `${API_URL}/master-admin/backups/download/${encodeURIComponent(filename)}`;
  },
  getMasterTenants: async (params = {}) => {
    const res = await apiClient.get('/master-admin/tenants', { params });
    return res.data;
  },
  getTenants: async (params = {}) => {
    const res = await apiClient.get('/master-admin/tenants', { params });
    return res.data;
  }
};
