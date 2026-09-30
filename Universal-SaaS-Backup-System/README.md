# Universal SaaS Backup & Recovery System

Zero-hardcoding, dynamic database snapshots (Full + Tenant-Scoped) and file uploads archiving module for any Express/Node.js & React SaaS application.

## 🚀 Features:
1. **Full Database Snapshots (`.json.gz` / `.json`)**: Auto-inspects `INFORMATION_SCHEMA` and dumps all tables dynamically with gzip compression and BigInt support.
2. **Company-Scoped Backups**: Exports isolated data of a single tenant/company without touching other tenants.
3. **Upload & 1-Click Restore**: Upload any `.json.gz` or `.json` file and restore it into the database with atomic integrity and `REPLACE INTO`.
4. **File Uploads Archiving (`.zip`)**: Archives the entire uploads folder into a zip.

## 🛠️ Quick Installation:

### 1. Backend:
```bash
npm install archiver multer
```
Copy the files in `backend/` to your backend project.
In `server.js` / `app.js`:
```javascript
const backupRoutes = require('./src/routes/backupRoutes');
app.use('/api/v1/master-admin', backupRoutes);
```

### 2. Frontend:
```bash
npm install @mui/material @mui/icons-material @tanstack/react-query axios
```
Copy `SystemBackup.jsx` into your pages directory and register the route:
```jsx
import SystemBackup from './pages/masterAdmin/SystemBackup';

<Route path="/master-admin/backups" element={<SystemBackup />} />
```
