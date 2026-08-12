-- PHASE 4: SaaS Platform Management & Subscription Seed Data

-- 1. Insert Default Subscription Plans
INSERT IGNORE INTO `saas_plans` (`id`, `name`, `price`, `duration_days`, `features`, `is_active`) VALUES
('plan-free', 'Free Trial', 0.00, 14, '["Core Veterinary Modules", "Up to 3 Users", "Email Reminders"]', 1),
('plan-basic', 'Basic Plan', 1999.00, 30, '["Core Veterinary Modules", "Up to 5 Users", "Email Reminders", "Basic Analytics"]', 1),
('plan-pro', 'Pro Plan', 4999.00, 30, '["All Core Modules", "Unlimited Users", "SMS & Email Reminders", "Advanced Reports", "Inventory Forecasting"]', 1),
('plan-enterprise', 'Enterprise Plan', 9999.00, 30, '["All Pro Features", "Priority Support", "Dedicated Account Manager", "Multi-Clinic Management"]', 1);

-- 2. Ensure SuperAdmin exists (Seed SuperAdmin if none exists)
-- This allows the SuperAdmin login to work using default credentials if not already present.
-- We'll just seed a default if the table is completely empty.
INSERT IGNORE INTO `super_admins` (`id`, `email`, `password_hash`, `role`) VALUES
('sa-1', 'superadmin@kiaanvet.com', '$2b$10$B59kG5bU1s/eW6uS/s/rRe12T4R1g0S9D1U4.N0iR.71oG12wE6Ym', 'SUPER_ADMIN'); -- password: password123
