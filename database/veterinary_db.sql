-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: veterinary_db
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `appointments`
--

DROP TABLE IF EXISTS `appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointments` (
  `id` varchar(36) NOT NULL,
  `pet_id` varchar(36) DEFAULT NULL,
  `doctor_id` varchar(36) DEFAULT NULL,
  `appointment_date` date NOT NULL,
  `appointment_time` time NOT NULL,
  `appointment_type` enum('Clinic Visit','Home Visit') NOT NULL,
  `status` enum('Pending','Confirmed','Completed','Cancelled') DEFAULT 'Pending',
  `notes` text DEFAULT NULL,
  `reminder_sent` tinyint(1) DEFAULT 0,
  `next_reminder_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `pet_id` (`pet_id`),
  KEY `doctor_id` (`doctor_id`),
  CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointments`
--

LOCK TABLES `appointments` WRITE;
/*!40000 ALTER TABLE `appointments` DISABLE KEYS */;
/*!40000 ALTER TABLE `appointments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assistance_tasks`
--

DROP TABLE IF EXISTS `assistance_tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assistance_tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `doctor_id` varchar(100) DEFAULT NULL,
  `doctor_name` varchar(100) NOT NULL,
  `patient_id` varchar(100) DEFAULT NULL,
  `patient_name` varchar(100) NOT NULL,
  `task_type` enum('Surgery Prep','Lab Test','Treatment','Emergency') DEFAULT 'Treatment',
  `priority` enum('Critical','High','Medium','Low') DEFAULT 'Medium',
  `scheduled_time` varchar(50) DEFAULT 'ASAP',
  `status` enum('Pending','In Progress','Completed') DEFAULT 'Pending',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assistance_tasks`
--

LOCK TABLES `assistance_tasks` WRITE;
/*!40000 ALTER TABLE `assistance_tasks` DISABLE KEYS */;
/*!40000 ALTER TABLE `assistance_tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) DEFAULT NULL,
  `attendance_date` date NOT NULL,
  `check_in` time DEFAULT NULL,
  `check_out` time DEFAULT NULL,
  `working_hours` decimal(5,2) DEFAULT NULL,
  `status` enum('Present','Absent','Leave','Half Day') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
INSERT INTO `attendance` VALUES ('att-1','u3-doctor1','2026-06-03','08:45:00','17:15:00',8.50,'Present'),('att-2','u4-doctor2','2026-06-03','09:00:00','17:00:00',8.00,'Present'),('att-3','u5-recept','2026-06-03','08:30:00','17:30:00',9.00,'Present'),('att-b9c248c8','u1-admin','2026-08-06','23:30:54','23:31:01',0.02,'Present');
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clinical_encounters`
--

DROP TABLE IF EXISTS `clinical_encounters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clinical_encounters` (
  `id` varchar(36) NOT NULL,
  `pet_id` varchar(36) DEFAULT NULL,
  `doctor_id` varchar(36) DEFAULT NULL,
  `encounter_date` date NOT NULL,
  `complaint` varchar(255) DEFAULT NULL,
  `duration` varchar(100) DEFAULT NULL,
  `symptoms` text DEFAULT NULL,
  `diagnosis` text DEFAULT NULL,
  `treatment` text DEFAULT NULL,
  `follow_up` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pet_id` (`pet_id`),
  KEY `doctor_id` (`doctor_id`),
  CONSTRAINT `clinical_encounters_ibfk_1` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `clinical_encounters_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clinical_encounters`
--

LOCK TABLES `clinical_encounters` WRITE;
/*!40000 ALTER TABLE `clinical_encounters` DISABLE KEYS */;
/*!40000 ALTER TABLE `clinical_encounters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `diagnostic_reports`
--

DROP TABLE IF EXISTS `diagnostic_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `diagnostic_reports` (
  `id` varchar(36) NOT NULL,
  `encounter_id` varchar(36) DEFAULT NULL,
  `report_type` enum('Blood Test','X-Ray','Ultrasound','PDF Report') NOT NULL,
  `file_url` varchar(255) NOT NULL,
  `uploaded_by` varchar(36) DEFAULT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `encounter_id` (`encounter_id`),
  KEY `uploaded_by` (`uploaded_by`),
  CONSTRAINT `diagnostic_reports_ibfk_1` FOREIGN KEY (`encounter_id`) REFERENCES `clinical_encounters` (`id`) ON DELETE CASCADE,
  CONSTRAINT `diagnostic_reports_ibfk_2` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `diagnostic_reports`
--

LOCK TABLES `diagnostic_reports` WRITE;
/*!40000 ALTER TABLE `diagnostic_reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `diagnostic_reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_reminders`
--

DROP TABLE IF EXISTS `email_reminders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_reminders` (
  `id` varchar(36) NOT NULL,
  `appointment_id` varchar(36) DEFAULT NULL,
  `recipient_email` varchar(255) NOT NULL,
  `scheduled_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `sent_at` timestamp NULL DEFAULT NULL,
  `status` enum('Pending','Sent','Failed') DEFAULT 'Pending',
  PRIMARY KEY (`id`),
  KEY `appointment_id` (`appointment_id`),
  CONSTRAINT `email_reminders_ibfk_1` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_reminders`
--

LOCK TABLES `email_reminders` WRITE;
/*!40000 ALTER TABLE `email_reminders` DISABLE KEYS */;
/*!40000 ALTER TABLE `email_reminders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `home_visits`
--

DROP TABLE IF EXISTS `home_visits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `home_visits` (
  `id` varchar(36) NOT NULL,
  `appointment_id` varchar(36) DEFAULT NULL,
  `pet_id` varchar(36) DEFAULT NULL,
  `owner_id` varchar(36) DEFAULT NULL,
  `doctor_id` varchar(36) DEFAULT NULL,
  `address` text NOT NULL,
  `travel_fee` decimal(10,2) DEFAULT 0.00,
  `visit_status` enum('Scheduled','In Progress','Completed','Cancelled') DEFAULT 'Scheduled',
  `notes` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `appointment_id` (`appointment_id`),
  KEY `pet_id` (`pet_id`),
  KEY `owner_id` (`owner_id`),
  KEY `doctor_id` (`doctor_id`),
  CONSTRAINT `home_visits_ibfk_1` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `home_visits_ibfk_2` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `home_visits_ibfk_3` FOREIGN KEY (`owner_id`) REFERENCES `pet_owners` (`id`) ON DELETE CASCADE,
  CONSTRAINT `home_visits_ibfk_4` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `home_visits`
--

LOCK TABLES `home_visits` WRITE;
/*!40000 ALTER TABLE `home_visits` DISABLE KEYS */;
/*!40000 ALTER TABLE `home_visits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory` (
  `id` varchar(36) NOT NULL,
  `sku` varchar(100) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` enum('Accessories & Toys','Hygiene Items','Food & Snacks','Vitamins & Supplements','Medicine','Service') NOT NULL,
  `supplier` varchar(255) DEFAULT NULL,
  `quantity` int(11) DEFAULT 0,
  `low_stock_threshold` int(11) DEFAULT 5,
  `cost_price` decimal(10,2) DEFAULT NULL,
  `selling_price` decimal(10,2) NOT NULL,
  `is_taxable` tinyint(1) DEFAULT 1,
  `expiry_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `sku` (`sku`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory`
--

LOCK TABLES `inventory` WRITE;
/*!40000 ALTER TABLE `inventory` DISABLE KEYS */;
/*!40000 ALTER TABLE `inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoice_line_items`
--

DROP TABLE IF EXISTS `invoice_line_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoice_line_items` (
  `id` varchar(36) NOT NULL,
  `invoice_id` varchar(36) DEFAULT NULL,
  `inventory_id` varchar(36) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `invoice_id` (`invoice_id`),
  KEY `inventory_id` (`inventory_id`),
  CONSTRAINT `invoice_line_items_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE,
  CONSTRAINT `invoice_line_items_ibfk_2` FOREIGN KEY (`inventory_id`) REFERENCES `inventory` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoice_line_items`
--

LOCK TABLES `invoice_line_items` WRITE;
/*!40000 ALTER TABLE `invoice_line_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `invoice_line_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoices`
--

DROP TABLE IF EXISTS `invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoices` (
  `id` varchar(36) NOT NULL,
  `owner_id` varchar(36) DEFAULT NULL,
  `pet_id` varchar(36) DEFAULT NULL,
  `doctor_id` varchar(36) DEFAULT NULL,
  `encounter_id` varchar(36) DEFAULT NULL,
  `home_visit_id` varchar(36) DEFAULT NULL,
  `invoice_date` date NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `tax_amount` decimal(10,2) DEFAULT 0.00,
  `discount_amount` decimal(10,2) DEFAULT 0.00,
  `grand_total` decimal(10,2) NOT NULL,
  `status` enum('Paid','Pending','Cancelled') DEFAULT 'Pending',
  PRIMARY KEY (`id`),
  KEY `owner_id` (`owner_id`),
  KEY `pet_id` (`pet_id`),
  KEY `doctor_id` (`doctor_id`),
  KEY `encounter_id` (`encounter_id`),
  KEY `home_visit_id` (`home_visit_id`),
  CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `pet_owners` (`id`) ON DELETE SET NULL,
  CONSTRAINT `invoices_ibfk_2` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`id`) ON DELETE SET NULL,
  CONSTRAINT `invoices_ibfk_3` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `invoices_ibfk_4` FOREIGN KEY (`encounter_id`) REFERENCES `clinical_encounters` (`id`) ON DELETE SET NULL,
  CONSTRAINT `invoices_ibfk_5` FOREIGN KEY (`home_visit_id`) REFERENCES `home_visits` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoices`
--

LOCK TABLES `invoices` WRITE;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` enum('Inventory','Appointment','Attendance','System') NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES ('notif-1','u1-admin','Low Stock Alert','Royal Canin Gastrointestinal 2kg is running low (Current: 12, Threshold: 5).','Inventory',0,'2026-08-06 17:29:24');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pet_owners`
--

DROP TABLE IF EXISTS `pet_owners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pet_owners` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `nic` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `mobile` varchar(20) NOT NULL,
  `address` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `nic` (`nic`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pet_owners`
--

LOCK TABLES `pet_owners` WRITE;
/*!40000 ALTER TABLE `pet_owners` DISABLE KEYS */;
/*!40000 ALTER TABLE `pet_owners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pets`
--

DROP TABLE IF EXISTS `pets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pets` (
  `id` varchar(36) NOT NULL,
  `owner_id` varchar(36) DEFAULT NULL,
  `microchip_number` varchar(100) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `species` varchar(100) DEFAULT NULL,
  `breed` varchar(100) DEFAULT NULL,
  `gender` enum('Male','Female') DEFAULT NULL,
  `age` varchar(50) DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `previous_medical_history` text DEFAULT NULL,
  `last_vaccination` date DEFAULT NULL,
  `last_deworming` date DEFAULT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `owner_id` (`owner_id`),
  CONSTRAINT `pets_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `pet_owners` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pets`
--

LOCK TABLES `pets` WRITE;
/*!40000 ALTER TABLE `pets` DISABLE KEYS */;
/*!40000 ALTER TABLE `pets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prescriptions`
--

DROP TABLE IF EXISTS `prescriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prescriptions` (
  `id` varchar(36) NOT NULL,
  `encounter_id` varchar(36) DEFAULT NULL,
  `medicine_name` varchar(255) NOT NULL,
  `dosage` varchar(100) DEFAULT NULL,
  `frequency` varchar(100) DEFAULT NULL,
  `duration` varchar(100) DEFAULT NULL,
  `instructions` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `encounter_id` (`encounter_id`),
  CONSTRAINT `prescriptions_ibfk_1` FOREIGN KEY (`encounter_id`) REFERENCES `clinical_encounters` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prescriptions`
--

LOCK TABLES `prescriptions` WRITE;
/*!40000 ALTER TABLE `prescriptions` DISABLE KEYS */;
/*!40000 ALTER TABLE `prescriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `saas_payments`
--

DROP TABLE IF EXISTS `saas_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `saas_payments` (
  `id` varchar(36) NOT NULL,
  `clinic_admin_id` varchar(36) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('Successful','Pending','Failed','Refunded') DEFAULT 'Pending',
  `payment_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `razorpay_order_id` varchar(255) DEFAULT NULL,
  `razorpay_payment_id` varchar(255) DEFAULT NULL,
  `razorpay_signature` varchar(255) DEFAULT NULL,
  `currency` varchar(10) DEFAULT 'INR',
  `invoice_number` varchar(100) DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `plan_id` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `clinic_admin_id` (`clinic_admin_id`),
  CONSTRAINT `saas_payments_ibfk_1` FOREIGN KEY (`clinic_admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saas_payments`
--

LOCK TABLES `saas_payments` WRITE;
/*!40000 ALTER TABLE `saas_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `saas_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `saas_plans`
--

DROP TABLE IF EXISTS `saas_plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `saas_plans` (
  `id` varchar(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `duration_days` int(11) NOT NULL,
  `features` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saas_plans`
--

LOCK TABLES `saas_plans` WRITE;
/*!40000 ALTER TABLE `saas_plans` DISABLE KEYS */;
/*!40000 ALTER TABLE `saas_plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `saas_subscriptions`
--

DROP TABLE IF EXISTS `saas_subscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `saas_subscriptions` (
  `id` varchar(36) NOT NULL,
  `clinic_admin_id` varchar(36) DEFAULT NULL,
  `plan_id` varchar(36) DEFAULT NULL,
  `status` enum('Active','Expired','Cancelled','Trial') DEFAULT 'Trial',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `razorpay_payment_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `clinic_admin_id` (`clinic_admin_id`),
  KEY `plan_id` (`plan_id`),
  CONSTRAINT `saas_subscriptions_ibfk_1` FOREIGN KEY (`clinic_admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `saas_subscriptions_ibfk_2` FOREIGN KEY (`plan_id`) REFERENCES `saas_plans` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saas_subscriptions`
--

LOCK TABLES `saas_subscriptions` WRITE;
/*!40000 ALTER TABLE `saas_subscriptions` DISABLE KEYS */;
/*!40000 ALTER TABLE `saas_subscriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `saas_support_tickets`
--

DROP TABLE IF EXISTS `saas_support_tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `saas_support_tickets` (
  `id` varchar(36) NOT NULL,
  `clinic_admin_id` varchar(36) DEFAULT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `status` enum('Open','In Progress','Closed') DEFAULT 'Open',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `clinic_admin_id` (`clinic_admin_id`),
  CONSTRAINT `saas_support_tickets_ibfk_1` FOREIGN KEY (`clinic_admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saas_support_tickets`
--

LOCK TABLES `saas_support_tickets` WRITE;
/*!40000 ALTER TABLE `saas_support_tickets` DISABLE KEYS */;
/*!40000 ALTER TABLE `saas_support_tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `saas_system_settings`
--

DROP TABLE IF EXISTS `saas_system_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `saas_system_settings` (
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text NOT NULL,
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saas_system_settings`
--

LOCK TABLES `saas_system_settings` WRITE;
/*!40000 ALTER TABLE `saas_system_settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `saas_system_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `super_admins`
--

DROP TABLE IF EXISTS `super_admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `super_admins` (
  `id` varchar(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` varchar(50) DEFAULT 'SUPER_ADMIN',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `super_admins`
--

LOCK TABLES `super_admins` WRITE;
/*!40000 ALTER TABLE `super_admins` DISABLE KEYS */;
INSERT INTO `super_admins` VALUES ('sa-1','superadmin@vetcarepro.com','$2b$10$5uk009IgwBrONcwj.0Sjt.vTDRkJpLRvcinB136TTVlYobX1sTfbW','SUPER_ADMIN','2026-08-06 18:15:52','2026-08-06 18:15:52');
/*!40000 ALTER TABLE `super_admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `treatment_notes`
--

DROP TABLE IF EXISTS `treatment_notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `treatment_notes` (
  `id` varchar(36) NOT NULL,
  `encounter_id` varchar(36) DEFAULT NULL,
  `user_id` varchar(36) DEFAULT NULL,
  `note_type` enum('observation','medication','vitals') NOT NULL,
  `note_text` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `encounter_id` (`encounter_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `treatment_notes_ibfk_1` FOREIGN KEY (`encounter_id`) REFERENCES `clinical_encounters` (`id`) ON DELETE CASCADE,
  CONSTRAINT `treatment_notes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `treatment_notes`
--

LOCK TABLES `treatment_notes` WRITE;
/*!40000 ALTER TABLE `treatment_notes` DISABLE KEYS */;
/*!40000 ALTER TABLE `treatment_notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('Admin','Manager','Doctor','Receptionist','Vet Assistant') NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `status` enum('Active','Inactive','On Leave','Terminated') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('u1-admin','Dr. Sarah Jenkins','admin@vetcarepro.com','$2b$10$l4lSVlr8arXCtyQgVTNMKehWkjIrJNQfzN3NFAx4bMVdVzt/cWi2y','Admin','555-0100',NULL,NULL,NULL,'Active','2026-08-06 17:29:24','2026-08-06 17:42:33'),('u2-manager','Michael Ross','manager@vetcarepro.com','$2b$10$l4lSVlr8arXCtyQgVTNMKehWkjIrJNQfzN3NFAx4bMVdVzt/cWi2y','Manager','555-0101',NULL,NULL,NULL,'Active','2026-08-06 17:29:24','2026-08-06 17:42:33'),('u3-doctor1','Dr. Alan Grant','demodoctor@gmail.com','$2b$10$l4lSVlr8arXCtyQgVTNMKehWkjIrJNQfzN3NFAx4bMVdVzt/cWi2y','Doctor','555-0102',NULL,NULL,NULL,'Active','2026-08-06 17:29:24','2026-08-06 17:43:14'),('u4-doctor2','Dr. Ellie Sattler','esattler@veterinary.com','$2b$10$l4lSVlr8arXCtyQgVTNMKehWkjIrJNQfzN3NFAx4bMVdVzt/cWi2y','Doctor','555-0103',NULL,NULL,NULL,'Active','2026-08-06 17:29:24','2026-08-06 17:42:33'),('u5-recept','Jessica Day','demoR@gmail.com','$2b$10$l4lSVlr8arXCtyQgVTNMKehWkjIrJNQfzN3NFAx4bMVdVzt/cWi2y','Receptionist','555-0104',NULL,NULL,NULL,'Active','2026-08-06 17:29:24','2026-08-06 17:43:14'),('u6-vetasst','Todd Chavez','assistant@vetcarepro.com','$2b$10$l4lSVlr8arXCtyQgVTNMKehWkjIrJNQfzN3NFAx4bMVdVzt/cWi2y','Vet Assistant','555-0105',NULL,NULL,NULL,'Active','2026-08-06 17:29:24','2026-08-06 17:43:14');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-07 10:56:24
