# Phase 2 Database Migration

## 1. Previous Architecture
The previous architecture functioned solely for a single clinic. All operational tables (users, pets, appointments, invoices, inventory) were global, meaning any user querying the database would have access to all records. The SaaS tables (subscriptions, payments) were loosely tied to an administrative user (`clinic_admin_id`), lacking a central entity to define a clinic's boundary.

## 2. New SaaS Architecture
The database has been migrated to support true multi-tenancy. A central `clinics` table now exists as the core organizational entity. Every piece of operational data (from a receptionist's attendance to a pet's prescription) is now explicitly bound to a specific clinic via a `clinic_id` foreign key.

## 3. Clinics Table
**Table Name**: `clinics`
**Columns**: 
- `id` (VARCHAR 36, Primary Key)
- `clinic_name` (VARCHAR 255)
- `email`, `phone`, `address`, `city`, `state`, `country`
- `status` (ENUM: TRIAL, ACTIVE, SUSPENDED, EXPIRED, INACTIVE)
- `created_at`, `updated_at`

## 4. Tenant-Specific Tables
The following 15 operational tables were identified as tenant-specific because their records belong exclusively to one clinic:
1. `users` (Clinic staff)
2. `pet_owners` (Clients)
3. `pets` (Patients)
4. `appointments` (Bookings)
5. `inventory` (Stock)
6. `invoices` (Billing)
7. `invoice_line_items` (Billing Details)
8. `clinical_encounters` (Medical)
9. `treatment_notes` (Medical)
10. `prescriptions` (Medical)
11. `attendance` (Staff tracking)
12. `home_visits` (Operations)
13. `assistance_tasks` (Operations)
14. `notifications` (System alerts)
15. `diagnostic_reports` (Files)

## 5. Global Tables
- `super_admins`: System-wide administrators managing the platform.
- `saas_plans`: Global pricing tiers (e.g., Basic, Pro, Enterprise).
- `saas_system_settings`: Platform-wide configurations.

## 6. Added clinic_id Columns
A `clinic_id` (VARCHAR 36, DEFAULT 'clinic-1') was added to all 15 tenant-specific tables, plus the 3 clinic-specific SaaS tables (`saas_subscriptions`, `saas_payments`, `saas_support_tickets`), totaling **18 tables updated**.

## 7. Foreign Keys
All newly added `clinic_id` columns now feature a foreign key constraint referencing `clinics(id)` with `ON DELETE CASCADE`. This ensures that if a clinic is permanently deleted from the platform, all its associated data is safely scrubbed to comply with privacy standards.

## 8. Indexes
Foreign key creation automatically generated indexes on the `clinic_id` columns in MySQL, ensuring optimal lookup performance when controllers are rewritten to filter by this ID.

## 9. Existing Data Migration
- A baseline clinic was created: `id = 'clinic-1'`, `clinic_name = 'Default Clinic'`.
- All existing records across the 18 modified tables were successfully assigned to `'clinic-1'`. No existing veterinary data was deleted or orphaned.
- The `DEFAULT 'clinic-1'` constraint allows the current application to continue functioning (inserting new records) without crashing before Phase 3 is implemented.

## 10. User → Clinic Relationship
- `users` now have a direct `clinic_id` linking them to their workplace.
- `super_admins` remain in their isolated table, preventing them from accidentally being bound to a specific clinic's operational constraints.

## 11. Subscription → Clinic Relationship
- `saas_subscriptions` now maps to BOTH `clinic_admin_id` (for user reference) and `clinic_id` (the actual entity being subscribed). 
- This enables a model where multiple admins can manage a clinic without the subscription being tied exclusively to one person's account.

## 12. Payment → Clinic Relationship
- `saas_payments` now also maps directly to `clinic_id`. This allows precise revenue tracking per clinic, rather than per user.

## 13. Validation Results
- SQL execution completed successfully via the Node.js migration script.
- `SELECT * FROM clinics` confirmed the presence of 'Default Clinic'.
- Zero errors regarding foreign key conflicts, proving the schema was intact.

## 14. Potential Risks
- **Application Logic Lag**: Until Phase 3 is complete, the application backend is still querying globally. This is safe currently because there is only one clinic ('clinic-1') populated, but it must be addressed before onboarding a second clinic.
- **Cascade Deletion**: The `ON DELETE CASCADE` rule is powerful. Deleting a clinic will wipe its entire history. A soft-delete mechanism (`status = 'INACTIVE'`) should be heavily favored over hard deletion in the SuperAdmin panel.

## 15. Rollback Strategy
A complete rollback script is saved at `database/migrations/PHASE_2_ROLLBACK.md`. It safely drops all added foreign keys and `clinic_id` columns without touching the underlying veterinary rows, fully restoring the Phase 1 schema.

## 16. Phase 3 Requirements
The next phase must focus on the backend logic to enforce the new database structure:
1. **Tenant Middleware**: Create Express middleware that intercepts API calls, extracts the user's `clinic_id` from their JWT, and injects it into the request.
2. **Controller Overhaul**: Modify every SQL `SELECT`, `UPDATE`, and `DELETE` query to append `WHERE clinic_id = ?`.
3. **Data Integrity Enforcement**: Modify `INSERT` statements to explicitly include the `clinic_id`, moving away from the temporary SQL `DEFAULT 'clinic-1'`.
