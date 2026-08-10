# Project Baseline

## 1. Current Architecture
* **Frontend**: React.js (Vite), React Router DOM, Axios, Lucide React, Recharts. Styled with vanilla CSS. Capacitor configuration present for mobile wrapper.
* **Backend**: Node.js, Express.js. RESTful API following MVC architecture (Routes -> Controllers). Middleware used for auth.
* **Database**: MySQL. Relational mapping for a single clinic setup.
* **Storage**: Local filesystem uploads (`uploads/` folder).

## 2. Frontend Modules
* **App Shell**: `Sidebar.jsx`, `Navbar.jsx`, `DashboardHome.jsx`
* **Authentication**: `Login.jsx`, `Register.jsx`, `TrialExpired.jsx`
* **Dashboards**: `DoctorDashboard.jsx`, `ReceptionistDashboard.jsx`, `AssistantDashboard.jsx`, `SuperAdmin/`
* **Clinic Operations**: `Appointments.jsx`, `HomeVisits.jsx`, `ReminderQueue.jsx`
* **Patient Management**: `PatientRecords.jsx`, `PetManagement.jsx`, `PetOwnerManagement.jsx`
* **Medical**: `TreatmentNotes.jsx`, `AssistanceTasks.jsx`
* **Billing & Finance**: `Billing.jsx`, `Checkout/PaymentPage.jsx`, `Inventory.jsx`, `DoctorRevenue.jsx`
* **Management**: `StaffManagement.jsx`, `Attendance.jsx`, `Reports.jsx`, `Settings.jsx`, `Notifications.jsx`

## 3. Backend Modules
* **Server**: `server.js`, `config/`
* **Authentication**: `authRoutes.js` -> `authController.js`
* **User Management**: `userRoutes.js` -> `userController.js`
* **Clinic Operations**: `appointmentRoutes.js`, `homeVisitRoutes.js`, `notificationRoutes.js`, `attendanceRoutes.js`
* **Patient Management**: `petRoutes.js`, `petOwnerRoutes.js`
* **Medical**: `treatmentNoteRoutes.js`, `encounterRoutes.js`, `assistanceTaskRoutes.js`
* **Billing & Finance**: `invoiceRoutes.js`, `inventoryRoutes.js`, `paymentRoutes.js`
* **SuperAdmin**: `superAdminRoutes.js` -> `superAdminController.js`
* **Analytics**: `reportRoutes.js` -> `reportController.js`

## 4. Database Structure
* **Core Tables**: `users`, `pets`, `pet_owners`, `appointments`, `inventory`, `invoices`, `invoice_line_items`, `clinical_encounters`, `treatment_notes`, `prescriptions`, `attendance`, `home_visits`, `assistance_tasks`, `notifications`, `diagnostic_reports`.
* **SaaS/SuperAdmin Tables**: `super_admins`, `saas_plans`, `saas_subscriptions`, `saas_payments`, `saas_support_tickets`, `saas_system_settings`.
* **Database Keys**: Standard UUID/Auto-increment primary keys. Foreign keys defined with `CASCADE` or `SET NULL`.
* **SaaS Gap**: No central `clinics` table exists. `clinic_id` is missing across all core operational tables.

## 5. Authentication
* **Method**: JWT (JSON Web Tokens) with `bcrypt` for password hashing.
* **Storage**: Tokens are stored on the client side (likely `localStorage`).
* **Protected Routes**: Handled via backend auth middleware checking bearer token.
* **SuperAdmin**: Distinct table (`super_admins`) and middleware (`superAdminAuth.js`).

## 6. Roles & Permissions
* **Existing Roles (Enum)**: Admin, Manager, Doctor, Receptionist, Vet Assistant.
* **Super Admin**: Treated as a separate entity (`super_admins` table).
* **Permissions**: Access is generally role-checked in middleware/controllers, but currently operates under a single-tenant assumption (any Admin can see all data in the system).

## 7. SuperAdmin Status
* **Login**: Completed.
* **Dashboard/UI**: Partially Completed (UI components exist in `SuperAdmin/` folder).
* **Clinic Management**: Pending (No DB structure to support it).
* **Subscription Management**: Partially Completed (DB tables exist, limited APIs).
* **Revenue/Reports**: Pending (Requires tenant-based segregation to calculate properly).

## 8. Razorpay Status
* **Order Creation**: Completed in `paymentController.js`.
* **Payment Verification**: Completed using crypto signature verification.
* **Database**: Completed (Records stored in `saas_payments`).
* **Subscription (Recurring)**: Pending. Currently processes one-time orders rather than native Razorpay Subscriptions.
* **Webhooks**: Pending. Essential for automated subscription renewals.

## 9. Subscription Status
* **Database**: `saas_plans` and `saas_subscriptions` exist.
* **Logic**: Basic trial assignment exists in `authController.js` during registration.
* **Limits & Expiry**: Pending. The backend does not globally intercept or block API requests if a subscription has expired.

## 10. SaaS Readiness
* **Tenant Isolation**: PENDING. (The biggest blocker).
* **Multi-clinic support**: PENDING.
* **Clinic ID**: PENDING.
* **Onboarding**: PARTIALLY COMPLETED.

## 11. Existing Bugs
* **Security Risk**: No tenant isolation means cross-clinic data leakage if deployed as-is.
* **Architecture Gap**: The `saas_subscriptions` table links to `clinic_admin_id` (users table) rather than a central `clinics` table.
* **Unused Code**: Potential disconnected frontend routes for SuperAdmin that lack full backend support.
* **Storage**: Local filesystem uploads (`uploads/`) will break in a scaled/cloud-hosted SaaS environment.

## 12. Completed Features
* Authentication (Login/Register)
* Role-based UI Dashboards
* Appointments & Reminders
* Pet & Pet Owner Management
* Treatment Notes & Encounters
* Inventory Management
* Billing & Invoices
* Staff Management & Attendance
* Razorpay basic integration

## 13. Partially Completed Features
* SuperAdmin Portal (UI and schema exist, logic incomplete)
* SaaS Subscription System (Tables exist, enforcement missing)
* File Uploads (Works locally, not cloud-ready)

## 14. Pending Features
* Clinic Management (CRUD for Clinics)
* Tenant Authorization Middleware (Checking if User belongs to Clinic X)
* Razorpay Webhooks
* Subscription Expiry Enforcement

## 15. Phase 2 Requirements
* **Goal**: Establish the fundamental SaaS multi-tenant architecture.
* **Step 1**: Design and create the `clinics` table.
* **Step 2**: Add `clinic_id` as a foreign key to ALL operational tables (`users`, `pets`, `appointments`, `invoices`, etc.).
* **Step 3**: Migrate existing single-tenant data to a default `clinic_id`.
* **Step 4**: Update backend controllers to always filter queries by `clinic_id`.
* **Step 5**: Update backend insertion logic to attach the user's `clinic_id` to new records.
