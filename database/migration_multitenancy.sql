-- migration_multitenancy.sql
-- Create clinics table
CREATE TABLE IF NOT EXISTS clinics (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(255) UNIQUE NOT NULL,
    trial_end_date DATETIME,
    subscription_status ENUM('trial', 'active', 'expired', 'suspended') DEFAULT 'trial',
    plan_id VARCHAR(36)
);

-- Insert a default clinic row
INSERT IGNORE INTO clinics (id, name, subdomain, subscription_status)
VALUES ('d0b5e28a-7e18-472a-bf3b-5517f8a7e0f2', 'Default Clinic', 'default', 'active');

-- Add clinic_id to users
ALTER TABLE users ADD COLUMN clinic_id VARCHAR(36);
UPDATE users SET clinic_id = 'd0b5e28a-7e18-472a-bf3b-5517f8a7e0f2' WHERE clinic_id IS NULL;
ALTER TABLE users MODIFY COLUMN clinic_id VARCHAR(36) NOT NULL;
ALTER TABLE users ADD CONSTRAINT fk_users_clinic FOREIGN KEY (clinic_id) REFERENCES clinics(id);

-- Add clinic_id to pet_owners
ALTER TABLE pet_owners ADD COLUMN clinic_id VARCHAR(36);
UPDATE pet_owners SET clinic_id = 'd0b5e28a-7e18-472a-bf3b-5517f8a7e0f2' WHERE clinic_id IS NULL;
ALTER TABLE pet_owners MODIFY COLUMN clinic_id VARCHAR(36) NOT NULL;
ALTER TABLE pet_owners ADD CONSTRAINT fk_pet_owners_clinic FOREIGN KEY (clinic_id) REFERENCES clinics(id);

-- Add clinic_id to pets
ALTER TABLE pets ADD COLUMN clinic_id VARCHAR(36);
UPDATE pets SET clinic_id = 'd0b5e28a-7e18-472a-bf3b-5517f8a7e0f2' WHERE clinic_id IS NULL;
ALTER TABLE pets MODIFY COLUMN clinic_id VARCHAR(36) NOT NULL;
ALTER TABLE pets ADD CONSTRAINT fk_pets_clinic FOREIGN KEY (clinic_id) REFERENCES clinics(id);

-- Add clinic_id to appointments
ALTER TABLE appointments ADD COLUMN clinic_id VARCHAR(36);
UPDATE appointments SET clinic_id = 'd0b5e28a-7e18-472a-bf3b-5517f8a7e0f2' WHERE clinic_id IS NULL;
ALTER TABLE appointments MODIFY COLUMN clinic_id VARCHAR(36) NOT NULL;
ALTER TABLE appointments ADD CONSTRAINT fk_appointments_clinic FOREIGN KEY (clinic_id) REFERENCES clinics(id);

-- Add clinic_id to home_visits
ALTER TABLE home_visits ADD COLUMN clinic_id VARCHAR(36);
UPDATE home_visits SET clinic_id = 'd0b5e28a-7e18-472a-bf3b-5517f8a7e0f2' WHERE clinic_id IS NULL;
ALTER TABLE home_visits MODIFY COLUMN clinic_id VARCHAR(36) NOT NULL;
ALTER TABLE home_visits ADD CONSTRAINT fk_home_visits_clinic FOREIGN KEY (clinic_id) REFERENCES clinics(id);

-- Add clinic_id to clinical_encounters
ALTER TABLE clinical_encounters ADD COLUMN clinic_id VARCHAR(36);
UPDATE clinical_encounters SET clinic_id = 'd0b5e28a-7e18-472a-bf3b-5517f8a7e0f2' WHERE clinic_id IS NULL;
ALTER TABLE clinical_encounters MODIFY COLUMN clinic_id VARCHAR(36) NOT NULL;
ALTER TABLE clinical_encounters ADD CONSTRAINT fk_clinical_encounters_clinic FOREIGN KEY (clinic_id) REFERENCES clinics(id);

-- Add clinic_id to inventory
ALTER TABLE inventory ADD COLUMN clinic_id VARCHAR(36);
UPDATE inventory SET clinic_id = 'd0b5e28a-7e18-472a-bf3b-5517f8a7e0f2' WHERE clinic_id IS NULL;
ALTER TABLE inventory MODIFY COLUMN clinic_id VARCHAR(36) NOT NULL;
ALTER TABLE inventory ADD CONSTRAINT fk_inventory_clinic FOREIGN KEY (clinic_id) REFERENCES clinics(id);

-- Add clinic_id to invoices
ALTER TABLE invoices ADD COLUMN clinic_id VARCHAR(36);
UPDATE invoices SET clinic_id = 'd0b5e28a-7e18-472a-bf3b-5517f8a7e0f2' WHERE clinic_id IS NULL;
ALTER TABLE invoices MODIFY COLUMN clinic_id VARCHAR(36) NOT NULL;
ALTER TABLE invoices ADD CONSTRAINT fk_invoices_clinic FOREIGN KEY (clinic_id) REFERENCES clinics(id);

-- Add clinic_id to attendance
ALTER TABLE attendance ADD COLUMN clinic_id VARCHAR(36);
UPDATE attendance SET clinic_id = 'd0b5e28a-7e18-472a-bf3b-5517f8a7e0f2' WHERE clinic_id IS NULL;
ALTER TABLE attendance MODIFY COLUMN clinic_id VARCHAR(36) NOT NULL;
ALTER TABLE attendance ADD CONSTRAINT fk_attendance_clinic FOREIGN KEY (clinic_id) REFERENCES clinics(id);

-- Add clinic_id to notifications
ALTER TABLE notifications ADD COLUMN clinic_id VARCHAR(36);
UPDATE notifications SET clinic_id = 'd0b5e28a-7e18-472a-bf3b-5517f8a7e0f2' WHERE clinic_id IS NULL;
ALTER TABLE notifications MODIFY COLUMN clinic_id VARCHAR(36) NOT NULL;
ALTER TABLE notifications ADD CONSTRAINT fk_notifications_clinic FOREIGN KEY (clinic_id) REFERENCES clinics(id);

-- Add clinic_id to treatment_notes
ALTER TABLE treatment_notes ADD COLUMN clinic_id VARCHAR(36);
UPDATE treatment_notes SET clinic_id = 'd0b5e28a-7e18-472a-bf3b-5517f8a7e0f2' WHERE clinic_id IS NULL;
ALTER TABLE treatment_notes MODIFY COLUMN clinic_id VARCHAR(36) NOT NULL;
ALTER TABLE treatment_notes ADD CONSTRAINT fk_treatment_notes_clinic FOREIGN KEY (clinic_id) REFERENCES clinics(id);

-- Add clinic_id to assistance_tasks
ALTER TABLE assistance_tasks ADD COLUMN clinic_id VARCHAR(36);
UPDATE assistance_tasks SET clinic_id = 'd0b5e28a-7e18-472a-bf3b-5517f8a7e0f2' WHERE clinic_id IS NULL;
ALTER TABLE assistance_tasks MODIFY COLUMN clinic_id VARCHAR(36) NOT NULL;
ALTER TABLE assistance_tasks ADD CONSTRAINT fk_assistance_tasks_clinic FOREIGN KEY (clinic_id) REFERENCES clinics(id);
