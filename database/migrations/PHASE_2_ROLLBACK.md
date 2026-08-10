# Phase 2 Rollback Strategy

If Phase 2 migration needs to be reversed, the following SQL commands can be executed to safely drop the foreign keys, drop the `clinic_id` columns, and drop the `clinics` table, reverting the schema exactly to its original Phase 1 state without deleting any operational veterinary data.

## Execution

To rollback, run the following SQL script:

```sql
-- 1. Drop constraints and columns from SaaS tables
ALTER TABLE `saas_support_tickets` DROP FOREIGN KEY `fk_ticket_clinic`;
ALTER TABLE `saas_support_tickets` DROP COLUMN `clinic_id`;

ALTER TABLE `saas_payments` DROP FOREIGN KEY `fk_pay_clinic`;
ALTER TABLE `saas_payments` DROP COLUMN `clinic_id`;

ALTER TABLE `saas_subscriptions` DROP FOREIGN KEY `fk_sub_clinic`;
ALTER TABLE `saas_subscriptions` DROP COLUMN `clinic_id`;

-- 2. Drop constraints and columns from operational tables
ALTER TABLE `diagnostic_reports` DROP FOREIGN KEY `fk_reports_clinic`;
ALTER TABLE `diagnostic_reports` DROP COLUMN `clinic_id`;

ALTER TABLE `notifications` DROP FOREIGN KEY `fk_notifications_clinic`;
ALTER TABLE `notifications` DROP COLUMN `clinic_id`;

ALTER TABLE `assistance_tasks` DROP FOREIGN KEY `fk_tasks_clinic`;
ALTER TABLE `assistance_tasks` DROP COLUMN `clinic_id`;

ALTER TABLE `home_visits` DROP FOREIGN KEY `fk_home_visits_clinic`;
ALTER TABLE `home_visits` DROP COLUMN `clinic_id`;

ALTER TABLE `attendance` DROP FOREIGN KEY `fk_attendance_clinic`;
ALTER TABLE `attendance` DROP COLUMN `clinic_id`;

ALTER TABLE `prescriptions` DROP FOREIGN KEY `fk_prescriptions_clinic`;
ALTER TABLE `prescriptions` DROP COLUMN `clinic_id`;

ALTER TABLE `treatment_notes` DROP FOREIGN KEY `fk_treatment_clinic`;
ALTER TABLE `treatment_notes` DROP COLUMN `clinic_id`;

ALTER TABLE `clinical_encounters` DROP FOREIGN KEY `fk_encounters_clinic`;
ALTER TABLE `clinical_encounters` DROP COLUMN `clinic_id`;

ALTER TABLE `invoice_line_items` DROP FOREIGN KEY `fk_invoice_items_clinic`;
ALTER TABLE `invoice_line_items` DROP COLUMN `clinic_id`;

ALTER TABLE `invoices` DROP FOREIGN KEY `fk_invoices_clinic`;
ALTER TABLE `invoices` DROP COLUMN `clinic_id`;

ALTER TABLE `inventory` DROP FOREIGN KEY `fk_inventory_clinic`;
ALTER TABLE `inventory` DROP COLUMN `clinic_id`;

ALTER TABLE `appointments` DROP FOREIGN KEY `fk_appointments_clinic`;
ALTER TABLE `appointments` DROP COLUMN `clinic_id`;

ALTER TABLE `pets` DROP FOREIGN KEY `fk_pets_clinic`;
ALTER TABLE `pets` DROP COLUMN `clinic_id`;

ALTER TABLE `pet_owners` DROP FOREIGN KEY `fk_owners_clinic`;
ALTER TABLE `pet_owners` DROP COLUMN `clinic_id`;

ALTER TABLE `users` DROP FOREIGN KEY `fk_users_clinic`;
ALTER TABLE `users` DROP COLUMN `clinic_id`;

-- 3. Finally, drop the clinics table
DROP TABLE IF EXISTS `clinics`;
```

## Validation

After running the rollback script, confirm that:
1. `clinics` table no longer exists.
2. `clinic_id` is removed from `users`, `pets`, etc.
3. Existing records remain intact.
