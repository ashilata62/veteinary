# Clinic Management System - Full Role & API Audit

This document provides a comprehensive analysis of the active user roles, navigation menu panels, and their corresponding backend database API mappings.

---

## 1. Role-Based Navigation Matrix

The system dynamically filters sidebar panels based on the user's logged-in role (`currentRole` in `localStorage`):

| Sidebar Menu Tab | Admin | Manager | Doctor | Receptionist | Vet Assistant | Component Rendered |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Dashboard** | ✅ | ✅ | ✅ | ✅ | ✅ | `DashboardHome` / Specialized dashboards |
| **Appointments** | ✅ | ✅ | ✅ | ✅ | ✅ | `Appointments` |
| **Home Visits** | ✅ | ✅ | ✅ | ✅ | ✅ | `HomeVisits` |
| **Hospitalization** | ✅ | ✅ | ✅ | ✅ | ✅ | `Hospitalization` |
| **Pet Owners** | ✅ | ✅ | ❌ | ✅ | ❌ | `PetOwnerManagement` |
| **Pets (Patients)** | ✅ | ✅ | ✅ | ✅ | ✅ | `PetManagement` |
| **Medical Records** | ✅ | ✅ | ✅ | ❌ | ✅ | `PatientRecords` (Overview subview) |
| **Treatment Notes** | ❌ | ❌ | ✅ | ❌ | ❌ | `TreatmentNotes` |
| **Assistance Tasks**| ❌ | ❌ | ❌ | ❌ | ✅ | `AssistanceTasks` |
| **Prescriptions** | ❌ | ❌ | ✅ | ❌ | ❌ | `PatientRecords` (Prescriptions subview) |
| **My Revenue** | ❌ | ❌ | ✅ | ❌ | ❌ | `DoctorRevenue` |
| **Billing & POS** | ✅ | ✅ | ✅ | ✅ | ❌ | `Billing` |
| **Inventory** | ✅ | ✅ | ❌ | ✅ | ❌ | `Inventory` |
| **Email Reminders** | ✅ | ✅ | ❌ | ✅ | ❌ | `ReminderQueue` |
| **Staff Management**| ✅ | ❌ | ❌ | ❌ | ❌ | `StaffManagement` |
| **Attendance** | ✅ | ✅ | ❌ | ❌ | ❌ | `Attendance` |
| **Reports & Analytics**| ✅ | ✅ | ❌ | ❌ | ❌ | `Reports` |
| **Settings** | ✅ | ✅ | ✅ | ✅ | ✅ | `SettingsPage` |
| **Support** | ✅ | ❌ | ❌ | ❌ | ❌ | `Support` |

---

## 2. Page & API Backend Status

Almost all core features are backed by corresponding **MySQL tables** and **Express endpoints** as shown below:

### 🟢 Dashboard & Analytics
* **Frontend Component**: `DashboardHome.jsx` / `DoctorDashboard.jsx` etc.
* **API Endpoints**: 
  * GET `/api/v1/dashboard/stats`
  * GET `/api/v1/dashboard/recent-activities`
* **Status**: 100% database-backed and active.

### 🟢 Appointments & Home Visits
* **Frontend Component**: `Appointments.jsx` & `HomeVisits.jsx`
* **API Endpoints**:
  * GET/POST/PUT/DELETE `/api/v1/appointments`
  * GET/POST/PATCH/DELETE `/api/v1/home-visits`
* **Status**: Connected to database tables `appointments` and `home_visits`. Fully functional.

### 🟢 Pet Owners & Pets (Patients)
* **Frontend Component**: `PetOwnerManagement.jsx` & `PetManagement.jsx`
* **API Endpoints**:
  * GET/POST/PUT `/api/v1/owners`
  * GET/POST/PUT/DELETE `/api/v1/pets`
* **Status**: Connected to database tables `pet_owners` and `pets`. Fully functional.

### 🟢 Medical Records & Prescriptions
* **Frontend Component**: `PatientRecords.jsx` (Overview, Prescriptions, Reports)
* **API Endpoints**:
  * GET/POST `/api/v1/encounters` (for clinical encounters & diagnoses)
  * GET/POST `/api/v1/encounters/prescription` (for medication lines)
* **Status**: Dynamic SQL queries inside `encounterService.js` store clinical visits.

### 🟢 Treatment Notes
* **Frontend Component**: `TreatmentNotes.jsx`
* **API Endpoints**:
  * GET/POST `/api/v1/treatment-notes`
* **Status**: Connected to `treatment_notes` table in the database.

### 🟢 Assistance Tasks
* **Frontend Component**: `AssistanceTasks.jsx`
* **API Endpoints**:
  * GET/POST/PATCH `/api/v1/assistance-tasks`
* **Status**: Connected to `assistance_tasks` table in database.

### 🟢 Billing & POS (Invoices)
* **Frontend Component**: `Billing.jsx`
* **API Endpoints**:
  * GET/POST/PATCH `/api/v1/invoices`
* **Status**: Writes to `invoices` and `invoice_line_items` tables. Updates inventory levels automatically.

### 🟢 Inventory Management
* **Frontend Component**: `Inventory.jsx`
* **API Endpoints**:
  * GET/POST/PUT/DELETE `/api/v1/inventory`
* **Status**: Connected to `inventory` table in database.

### 🟢 Email Reminders
* **Frontend Component**: `ReminderQueue.jsx`
* **API Endpoints**:
  * GET `/api/v1/appointments/upcoming-reminders`
  * POST `/api/v1/appointments/:id/send-reminder` (sends actual reminder emails via Mailgun/Nodemailer)
* **Status**: Connected to backend scheduler services and active.

### 🟢 Staff Management
* **Frontend Component**: `StaffManagement.jsx`
* **API Endpoints**:
  * GET/POST/PUT/DELETE `/api/v1/users` (with role validation)
* **Status**: Connected to `users` database table.

### 🟢 Attendance Logs
* **Frontend Component**: `Attendance.jsx`
* **API Endpoints**:
  * GET/POST `/api/v1/attendance` (check-in / check-out tracker)
* **Status**: Connected to `attendance` database table.

### 🟢 Doctor Revenue Analytics
* **Frontend Component**: `DoctorRevenue.jsx`
* **API Endpoints**:
  * GET `/api/v1/reports/my-revenue` (doctor specific)
* **Status**: Database-backed and active.

### 🟢 Reports & Analytics
* **Frontend Component**: `Reports.jsx` (For Admin & Manager only)
* **API Endpoints**:
  * GET `/api/v1/reports/revenue`
  * GET `/api/v1/reports/appointments`
  * GET `/api/v1/reports/doctors`
  * GET `/api/v1/reports/patients`
  * GET `/api/v1/reports/inventory`
* **Status**: Returns aggregated financial, stock, and demographic charts from the SQL database.

### 🟢 Support Desk
* **Frontend Component**: `Support.jsx`
* **API Endpoints**:
  * GET/POST `/api/v1/support-tickets`
* **Status**: Fully database-backed and active.

---

## 3. Exceptions & Special Cases

### 🟡 Hospitalization (Cage & Ward Board)
* **Frontend Component**: [Hospitalization.jsx](file:///d:/Kiaan%20Work/veteinary/veterinary_frontend/src/components/Hospitalization.jsx)
* **Status**: **No database storage**.
* **Explanation**: 
  * Hospitalization uses **browser-level memory (`localStorage`)** to save active boarding cages, flowsheets, daily tasks (Fed, Meds, Walk), and cleaning statuses.
  * *Reasoning*: A local cache matches the requirements for immediate clinical status boards without requiring complex background tables, while maintaining data persistence across refreshes.
