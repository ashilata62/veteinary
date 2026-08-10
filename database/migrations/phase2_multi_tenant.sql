-- PHASE 2: Multi-Tenant Database Migration
-- Safe Migration Script

-- 1. Create clinics table
CREATE TABLE IF NOT EXISTS `clinics` (
  `id` varchar(36) NOT NULL,
  `clinic_name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `status` enum('TRIAL','ACTIVE','SUSPENDED','EXPIRED','INACTIVE') DEFAULT 'ACTIVE',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 2. Insert the baseline default clinic
INSERT IGNORE INTO `clinics` (`id`, `clinic_name`, `status`) 
VALUES ('clinic-1', 'Default Clinic', 'ACTIVE');

-- 3. Add clinic_id to tenant-specific tables and establish foreign keys.
-- We use DEFAULT 'clinic-1' so that the existing application (which doesn't know about clinic_id yet) 
-- can continue inserting records without throwing a NOT NULL violation until Phase 3 is complete.

-- USERS
ALTER TABLE `users` ADD COLUMN `clinic_id` varchar(36) DEFAULT 'clinic-1';
UPDATE `users` SET `clinic_id` = 'clinic-1' WHERE `clinic_id` IS NULL;
ALTER TABLE `users` ADD CONSTRAINT `fk_users_clinic` FOREIGN KEY (`clinic_id`) REFERENCES `clinics`(`id`) ON DELETE CASCADE;

-- PET_OWNERS
ALTER TABLE `pet_owners` ADD COLUMN `clinic_id` varchar(36) DEFAULT 'clinic-1';
UPDATE `pet_owners` SET `clinic_id` = 'clinic-1' WHERE `clinic_id` IS NULL;
ALTER TABLE `pet_owners` ADD CONSTRAINT `fk_owners_clinic` FOREIGN KEY (`clinic_id`) REFERENCES `clinics`(`id`) ON DELETE CASCADE;

-- PETS
ALTER TABLE `pets` ADD COLUMN `clinic_id` varchar(36) DEFAULT 'clinic-1';
UPDATE `pets` SET `clinic_id` = 'clinic-1' WHERE `clinic_id` IS NULL;
ALTER TABLE `pets` ADD CONSTRAINT `fk_pets_clinic` FOREIGN KEY (`clinic_id`) REFERENCES `clinics`(`id`) ON DELETE CASCADE;

-- APPOINTMENTS
ALTER TABLE `appointments` ADD COLUMN `clinic_id` varchar(36) DEFAULT 'clinic-1';
UPDATE `appointments` SET `clinic_id` = 'clinic-1' WHERE `clinic_id` IS NULL;
ALTER TABLE `appointments` ADD CONSTRAINT `fk_appointments_clinic` FOREIGN KEY (`clinic_id`) REFERENCES `clinics`(`id`) ON DELETE CASCADE;

-- INVENTORY
ALTER TABLE `inventory` ADD COLUMN `clinic_id` varchar(36) DEFAULT 'clinic-1';
UPDATE `inventory` SET `clinic_id` = 'clinic-1' WHERE `clinic_id` IS NULL;
ALTER TABLE `inventory` ADD CONSTRAINT `fk_inventory_clinic` FOREIGN KEY (`clinic_id`) REFERENCES `clinics`(`id`) ON DELETE CASCADE;

-- INVOICES
ALTER TABLE `invoices` ADD COLUMN `clinic_id` varchar(36) DEFAULT 'clinic-1';
UPDATE `invoices` SET `clinic_id` = 'clinic-1' WHERE `clinic_id` IS NULL;
ALTER TABLE `invoices` ADD CONSTRAINT `fk_invoices_clinic` FOREIGN KEY (`clinic_id`) REFERENCES `clinics`(`id`) ON DELETE CASCADE;

-- INVOICE LINE ITEMS
ALTER TABLE `invoice_line_items` ADD COLUMN `clinic_id` varchar(36) DEFAULT 'clinic-1';
UPDATE `invoice_line_items` SET `clinic_id` = 'clinic-1' WHERE `clinic_id` IS NULL;
ALTER TABLE `invoice_line_items` ADD CONSTRAINT `fk_invoice_items_clinic` FOREIGN KEY (`clinic_id`) REFERENCES `clinics`(`id`) ON DELETE CASCADE;

-- CLINICAL ENCOUNTERS
ALTER TABLE `clinical_encounters` ADD COLUMN `clinic_id` varchar(36) DEFAULT 'clinic-1';
UPDATE `clinical_encounters` SET `clinic_id` = 'clinic-1' WHERE `clinic_id` IS NULL;
ALTER TABLE `clinical_encounters` ADD CONSTRAINT `fk_encounters_clinic` FOREIGN KEY (`clinic_id`) REFERENCES `clinics`(`id`) ON DELETE CASCADE;

-- TREATMENT NOTES
ALTER TABLE `treatment_notes` ADD COLUMN `clinic_id` varchar(36) DEFAULT 'clinic-1';
UPDATE `treatment_notes` SET `clinic_id` = 'clinic-1' WHERE `clinic_id` IS NULL;
ALTER TABLE `treatment_notes` ADD CONSTRAINT `fk_treatment_clinic` FOREIGN KEY (`clinic_id`) REFERENCES `clinics`(`id`) ON DELETE CASCADE;

-- PRESCRIPTIONS
ALTER TABLE `prescriptions` ADD COLUMN `clinic_id` varchar(36) DEFAULT 'clinic-1';
UPDATE `prescriptions` SET `clinic_id` = 'clinic-1' WHERE `clinic_id` IS NULL;
ALTER TABLE `prescriptions` ADD CONSTRAINT `fk_prescriptions_clinic` FOREIGN KEY (`clinic_id`) REFERENCES `clinics`(`id`) ON DELETE CASCADE;

-- ATTENDANCE
ALTER TABLE `attendance` ADD COLUMN `clinic_id` varchar(36) DEFAULT 'clinic-1';
UPDATE `attendance` SET `clinic_id` = 'clinic-1' WHERE `clinic_id` IS NULL;
ALTER TABLE `attendance` ADD CONSTRAINT `fk_attendance_clinic` FOREIGN KEY (`clinic_id`) REFERENCES `clinics`(`id`) ON DELETE CASCADE;

-- HOME VISITS
ALTER TABLE `home_visits` ADD COLUMN `clinic_id` varchar(36) DEFAULT 'clinic-1';
UPDATE `home_visits` SET `clinic_id` = 'clinic-1' WHERE `clinic_id` IS NULL;
ALTER TABLE `home_visits` ADD CONSTRAINT `fk_home_visits_clinic` FOREIGN KEY (`clinic_id`) REFERENCES `clinics`(`id`) ON DELETE CASCADE;

-- ASSISTANCE TASKS
ALTER TABLE `assistance_tasks` ADD COLUMN `clinic_id` varchar(36) DEFAULT 'clinic-1';
UPDATE `assistance_tasks` SET `clinic_id` = 'clinic-1' WHERE `clinic_id` IS NULL;
ALTER TABLE `assistance_tasks` ADD CONSTRAINT `fk_tasks_clinic` FOREIGN KEY (`clinic_id`) REFERENCES `clinics`(`id`) ON DELETE CASCADE;

-- NOTIFICATIONS
ALTER TABLE `notifications` ADD COLUMN `clinic_id` varchar(36) DEFAULT 'clinic-1';
UPDATE `notifications` SET `clinic_id` = 'clinic-1' WHERE `clinic_id` IS NULL;
ALTER TABLE `notifications` ADD CONSTRAINT `fk_notifications_clinic` FOREIGN KEY (`clinic_id`) REFERENCES `clinics`(`id`) ON DELETE CASCADE;

-- DIAGNOSTIC REPORTS
ALTER TABLE `diagnostic_reports` ADD COLUMN `clinic_id` varchar(36) DEFAULT 'clinic-1';
UPDATE `diagnostic_reports` SET `clinic_id` = 'clinic-1' WHERE `clinic_id` IS NULL;
ALTER TABLE `diagnostic_reports` ADD CONSTRAINT `fk_reports_clinic` FOREIGN KEY (`clinic_id`) REFERENCES `clinics`(`id`) ON DELETE CASCADE;


-- 4. SAAS Subscription, Payment & Tickets 
-- We add clinic_id so subscriptions belong to the clinic rather than strictly an admin user.
ALTER TABLE `saas_subscriptions` ADD COLUMN `clinic_id` varchar(36) DEFAULT 'clinic-1';
UPDATE `saas_subscriptions` SET `clinic_id` = 'clinic-1' WHERE `clinic_id` IS NULL;
ALTER TABLE `saas_subscriptions` ADD CONSTRAINT `fk_sub_clinic` FOREIGN KEY (`clinic_id`) REFERENCES `clinics`(`id`) ON DELETE CASCADE;

ALTER TABLE `saas_payments` ADD COLUMN `clinic_id` varchar(36) DEFAULT 'clinic-1';
UPDATE `saas_payments` SET `clinic_id` = 'clinic-1' WHERE `clinic_id` IS NULL;
ALTER TABLE `saas_payments` ADD CONSTRAINT `fk_pay_clinic` FOREIGN KEY (`clinic_id`) REFERENCES `clinics`(`id`) ON DELETE CASCADE;

ALTER TABLE `saas_support_tickets` ADD COLUMN `clinic_id` varchar(36) DEFAULT 'clinic-1';
UPDATE `saas_support_tickets` SET `clinic_id` = 'clinic-1' WHERE `clinic_id` IS NULL;
ALTER TABLE `saas_support_tickets` ADD CONSTRAINT `fk_ticket_clinic` FOREIGN KEY (`clinic_id`) REFERENCES `clinics`(`id`) ON DELETE CASCADE;
