-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 31, 2026 at 12:10 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hrms-pro`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `action` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data`)),
  `ip_address` varchar(255) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `method` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `description`, `data`, `ip_address`, `user_agent`, `url`, `method`, `created_at`, `updated_at`) VALUES
(1, 1, 'profile_update', 'Updated profile information', '{\"name\":\"Super Admin\",\"email\":\"super.admin@hrms.com\",\"phone\":\"09843884994\",\"department\":\"Operations\",\"position\":\"HR Assistant\",\"join_date\":null,\"address\":\"No. 45, Bogyoke Aung San Road, Yangon, Myanmar update\",\"bio\":\"Experienced HRMS administrator with a strong background in operations, employee management, and system security. Passionate about streamlining workflows and ensuring smooth HR processes.\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'http://localhost:8000/api/v1/auth/profile', 'PUT', '2026-07-24 03:50:23', '2026-07-24 03:50:23'),
(2, 1, 'profile_update', 'Updated profile information', '{\"name\":\"Super Admin\",\"email\":\"super.admin@hrms.com\",\"phone\":\"09843884994\",\"department\":\"Operations\",\"position\":\"HR Assistant\",\"join_date\":null,\"address\":\"No. 45, Bogyoke Aung San Road, Yangon, Myanmar update\",\"bio\":\"Experienced HRMS administrator with a strong background in operations, employee management, and system security. Passionate about streamlining workflows and ensuring smooth HR processes.\",\"years_experience\":3,\"total_projects\":10}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'http://localhost:8000/api/v1/auth/profile', 'PUT', '2026-07-24 08:41:38', '2026-07-24 08:41:38'),
(3, 1, 'profile_update', 'Updated profile information', '{\"name\":\"Super Admin\",\"email\":\"super.admin@hrms.com\",\"phone\":\"09843884994\",\"department\":\"Operations\",\"position\":\"HR Assistant\",\"join_date\":null,\"address\":\"No. 45, Bogyoke Aung San Road, Yangon, Myanmar update\",\"bio\":\"Experienced HRMS administrator with a strong background in operations, employee management, and system security. Passionate about streamlining workflows and ensuring smooth HR processes.\",\"years_experience\":3,\"total_projects\":10}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'http://localhost:8000/api/v1/auth/profile', 'PUT', '2026-07-24 08:50:40', '2026-07-24 08:50:40'),
(4, 1, 'profile_update', 'Updated profile information', '{\"name\":\"Super Admin\",\"email\":\"super.admin@hrms.com\",\"phone\":\"09843884994\",\"department\":\"Operations\",\"position\":\"HR Assistant\",\"join_date\":null,\"address\":\"No. 45, Bogyoke Aung San Road, Yangon, Myanmar update\",\"bio\":\"Experienced HRMS administrator with a strong background in operations, employee management, and system security. Passionate about streamlining workflows and ensuring smooth HR processes.\",\"years_experience\":3,\"total_projects\":10}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'http://localhost:8000/api/v1/auth/profile', 'PUT', '2026-07-24 08:50:57', '2026-07-24 08:50:57'),
(5, 1, 'profile_update', 'Updated profile information', '{\"name\":\"Super Admin\",\"email\":\"super.admin@hrms.com\",\"phone\":\"09843884994\",\"department\":\"Operations\",\"position\":\"HR Assistant\",\"join_date\":null,\"address\":\"No. 45, Bogyoke Aung San Road, Yangon, Myanmar update\",\"bio\":\"Experienced HRMS administrator with a strong background in operations, employee management, and system security. Passionate about streamlining workflows and ensuring smooth HR processes.\",\"years_experience\":3,\"total_projects\":10}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'http://localhost:8000/api/v1/auth/profile', 'PUT', '2026-07-24 08:52:26', '2026-07-24 08:52:26'),
(6, 1, 'password_change', 'Changed password', '{\"current_password\":\"123123123\",\"new_password\":\"asd123!@#\",\"new_password_confirmation\":\"asd123!@#\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'http://localhost:8000/api/v1/auth/change-password', 'PUT', '2026-07-24 09:02:06', '2026-07-24 09:02:06'),
(7, 1, 'password_change', 'Changed password', '{\"current_password\":\"123123123\",\"new_password\":\"asd123!@#\",\"new_password_confirmation\":\"asd123!@#\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'http://localhost:8000/api/v1/auth/change-password', 'PUT', '2026-07-24 09:02:12', '2026-07-24 09:02:12'),
(8, 1, 'password_change', 'Changed password', '{\"current_password\":\"123123123\",\"new_password\":\"asd123!@#\",\"new_password_confirmation\":\"asd123!@#\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'http://localhost:8000/api/v1/auth/change-password', 'PUT', '2026-07-24 09:02:22', '2026-07-24 09:02:22'),
(9, 1, 'password_change', 'Changed password', '{\"current_password\":\"123123123\",\"new_password\":\"asd123!@#\",\"new_password_confirmation\":\"asd123!@#\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'http://localhost:8000/api/v1/auth/change-password', 'PUT', '2026-07-24 09:05:04', '2026-07-24 09:05:04'),
(10, 1, 'password_change', 'Changed password', '{\"current_password\":\"123123123\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'http://localhost:8000/api/v1/auth/change-password', 'PUT', '2026-07-24 09:06:26', '2026-07-24 09:06:26');

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `summary` varchar(255) DEFAULT NULL,
  `type` enum('general','hr','payroll','event','policy','emergency') NOT NULL DEFAULT 'general',
  `priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
  `status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
  `is_pinned` tinyint(1) NOT NULL DEFAULT 0,
  `is_important` tinyint(1) NOT NULL DEFAULT 0,
  `target_type` enum('all','department','role','specific') NOT NULL DEFAULT 'all',
  `target_id` bigint(20) UNSIGNED DEFAULT NULL,
  `start_date` timestamp NULL DEFAULT NULL,
  `end_date` timestamp NULL DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED NOT NULL,
  `published_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `announcements`
--

INSERT INTO `announcements` (`id`, `title`, `content`, `summary`, `type`, `priority`, `status`, `is_pinned`, `is_important`, `target_type`, `target_id`, `start_date`, `end_date`, `created_by`, `published_at`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 'Welcome to HRMS Pro!', 'We are excited to announce the launch of our new HRMS Pro system. This system will help us manage our human resources more efficiently.', 'HRMS Pro system launch announcement', 'general', 'high', 'published', 1, 1, 'all', NULL, '2026-07-28 03:11:46', '2026-08-27 03:11:46', 1, '2026-07-28 03:11:46', NULL, '2026-07-28 03:11:46', '2026-07-28 03:11:46'),
(2, 'Important: Upcoming HR Policy Changes', 'Please review the updated HR policies regarding work from home arrangements and flexible working hours.', 'HR policy updates effective next month', 'hr', 'high', 'published', 0, 1, 'all', NULL, '2026-07-28 03:11:46', '2026-08-12 03:11:46', 1, '2026-07-26 03:11:46', NULL, '2026-07-28 03:11:46', '2026-07-28 03:11:46'),
(3, 'Payroll Schedule Change for December', 'Due to the upcoming holiday season, payroll for December will be processed earlier than usual.', 'Early payroll processing for December', 'payroll', 'medium', 'draft', 0, 0, 'all', NULL, NULL, NULL, 1, NULL, NULL, '2026-07-28 03:11:46', '2026-07-28 03:11:46'),
(4, 'Welcome to HRMS Pro!', 'We are excited to announce the launch of our new HRMS Pro system. This system will help us manage our human resources more efficiently.', 'HRMS Pro system launch announcement', 'general', 'high', 'published', 1, 1, 'all', NULL, '2026-07-28 03:11:46', '2026-08-27 03:11:46', 3, '2026-07-28 03:11:46', NULL, '2026-07-28 03:11:46', '2026-07-28 03:11:46'),
(5, 'Important: Upcoming HR Policy Changes', 'Please review the updated HR policies regarding work from home arrangements and flexible working hours.', 'HR policy updates effective next month', 'hr', 'high', 'published', 0, 1, 'all', NULL, '2026-07-28 03:11:46', '2026-08-12 03:11:46', 3, '2026-07-26 03:11:46', NULL, '2026-07-28 03:11:46', '2026-07-28 03:11:46'),
(6, 'Payroll Schedule Change for December', 'Due to the upcoming holiday season, payroll for December will be processed earlier than usual.', 'Early payroll processing for December', 'payroll', 'medium', 'draft', 0, 0, 'all', NULL, NULL, NULL, 3, NULL, NULL, '2026-07-28 03:11:46', '2026-07-28 03:11:46'),
(7, 'Welcome to HRMS Pro!', 'We are excited to announce the launch of our new HRMS Pro system. This system will help us manage our human resources more efficiently.', 'HRMS Pro system launch announcement', 'general', 'high', 'published', 1, 1, 'all', NULL, '2026-07-28 03:11:46', '2026-08-27 03:11:46', 4, '2026-07-28 03:11:46', NULL, '2026-07-28 03:11:46', '2026-07-28 03:11:46'),
(8, 'Important: Upcoming HR Policy Changes', 'Please review the updated HR policies regarding work from home arrangements and flexible working hours.', 'HR policy updates effective next month', 'hr', 'high', 'published', 0, 1, 'all', NULL, '2026-07-28 03:11:46', '2026-08-12 03:11:46', 4, '2026-07-26 03:11:46', NULL, '2026-07-28 03:11:46', '2026-07-28 03:11:46'),
(9, 'Payroll Schedule Change for December', 'Due to the upcoming holiday season, payroll for December will be processed earlier than usual.', 'Early payroll processing for December', 'payroll', 'medium', 'draft', 0, 0, 'all', NULL, NULL, NULL, 4, NULL, NULL, '2026-07-28 03:11:46', '2026-07-28 03:11:46');

-- --------------------------------------------------------

--
-- Table structure for table `announcement_attachments`
--

CREATE TABLE `announcement_attachments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `announcement_id` bigint(20) UNSIGNED NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_size` bigint(20) UNSIGNED NOT NULL,
  `mime_type` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `announcement_notifications`
--

CREATE TABLE `announcement_notifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `announcement_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `sent_at` timestamp NULL DEFAULT NULL,
  `channel` enum('email','in_app','both') NOT NULL DEFAULT 'both',
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `announcement_views`
--

CREATE TABLE `announcement_views` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `announcement_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `viewed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `announcement_views`
--

INSERT INTO `announcement_views` (`id`, `announcement_id`, `user_id`, `viewed_at`, `created_at`, `updated_at`) VALUES
(1, 7, 1, '2026-07-28 07:44:52', '2026-07-28 07:44:52', '2026-07-28 07:44:52'),
(2, 4, 1, '2026-07-28 07:45:09', '2026-07-28 07:45:09', '2026-07-28 07:45:09'),
(3, 8, 1, '2026-07-28 07:45:33', '2026-07-28 07:45:33', '2026-07-28 07:45:33'),
(4, 7, 5, '2026-07-28 07:50:06', '2026-07-28 07:50:06', '2026-07-28 07:50:06'),
(5, 4, 5, '2026-07-28 07:50:26', '2026-07-28 07:50:26', '2026-07-28 07:50:26'),
(6, 8, 5, '2026-07-28 07:50:30', '2026-07-28 07:50:30', '2026-07-28 07:50:30'),
(7, 1, 6, '2026-07-28 08:27:57', '2026-07-28 08:27:57', '2026-07-28 08:27:57'),
(8, 1, 23, '2026-07-29 02:15:24', '2026-07-29 02:15:24', '2026-07-29 02:15:24'),
(9, 2, 1, '2026-07-29 19:27:48', '2026-07-29 19:27:48', '2026-07-29 19:27:48');

-- --------------------------------------------------------

--
-- Table structure for table `attendances`
--

CREATE TABLE `attendances` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED NOT NULL,
  `check_in` timestamp NULL DEFAULT NULL,
  `check_out` timestamp NULL DEFAULT NULL,
  `status` enum('present','absent','late','half_day') NOT NULL DEFAULT 'present',
  `note` text DEFAULT NULL,
  `location_in` varchar(255) DEFAULT NULL,
  `location_out` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `attendances`
--

INSERT INTO `attendances` (`id`, `employee_id`, `check_in`, `check_out`, `status`, `note`, `location_in`, `location_out`, `created_at`, `updated_at`) VALUES
(1, 2, '2023-07-21 01:30:00', '2026-07-21 10:30:00', 'present', 'Prepared for office meeting', NULL, NULL, '2026-07-21 21:14:23', '2026-07-21 21:15:43'),
(2, 3, '2023-07-20 01:30:00', '2026-07-20 11:30:00', 'present', 'ready to join team', NULL, NULL, '2026-07-21 22:08:17', '2026-07-21 22:08:38'),
(3, 29, '2026-07-25 10:39:04', NULL, 'late', NULL, 'Remote', NULL, '2026-07-25 10:39:04', '2026-07-25 10:39:04'),
(4, 2, '2026-07-24 04:19:00', '2026-07-24 09:37:00', 'late', NULL, NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(5, 3, '2026-07-24 01:33:00', '2026-07-24 10:37:00', 'present', NULL, NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(6, 7, '2026-07-24 01:44:00', '2026-07-24 10:08:00', 'present', NULL, NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(7, 10, '2026-07-24 01:58:00', '2026-07-24 11:09:00', 'present', 'Doctor appointment', NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(8, 11, '2026-07-24 02:32:00', '2026-07-24 10:25:00', 'present', NULL, NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(9, 15, '2026-07-24 04:13:00', '2026-07-24 12:52:00', 'late', 'Traffic delay', NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(10, 16, '2026-07-24 02:47:00', '2026-07-24 10:32:00', 'late', 'Traffic delay', NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(11, 17, '2026-07-24 01:56:00', '2026-07-24 09:50:00', 'present', NULL, NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(12, 19, '2026-07-24 02:30:00', '2026-07-24 11:46:00', 'present', NULL, NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(13, 20, '2026-07-24 02:58:00', '2026-07-24 10:26:00', 'late', NULL, NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(14, 21, '2026-07-24 03:10:00', '2026-07-24 11:29:00', 'late', 'Personal errand', NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(15, 22, '2026-07-24 04:20:00', '2026-07-24 10:34:00', 'late', 'Traffic delay', NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(16, 23, '2026-07-24 03:43:00', '2026-07-24 10:58:00', 'late', 'Traffic delay', NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(17, 24, '2026-07-24 03:59:00', '2026-07-24 12:31:00', 'late', NULL, NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(18, 25, '2026-07-24 01:46:00', '2026-07-24 10:57:00', 'present', NULL, NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(19, 26, '2026-07-24 02:07:00', '2026-07-24 09:39:00', 'present', 'Family emergency', NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(20, 27, '2026-07-24 03:00:00', '2026-07-24 10:07:00', 'late', NULL, NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(21, 28, '2026-07-24 03:35:00', '2026-07-24 12:16:00', 'late', NULL, NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(22, 1, '2026-07-23 03:47:00', '2026-07-23 10:10:00', 'late', NULL, NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(23, 2, '2026-07-23 03:57:00', '2026-07-23 11:10:00', 'late', 'Weather delay', NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(24, 3, '2026-07-23 01:34:00', '2026-07-23 10:07:00', 'present', NULL, NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(25, 7, '2026-07-23 03:00:00', '2026-07-23 12:58:00', 'late', 'Car trouble', NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(26, 10, '2026-07-23 02:56:00', '2026-07-23 11:37:00', 'late', 'Traffic delay', NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(27, 11, '2026-07-23 01:57:00', '2026-07-23 10:43:00', 'present', 'Traffic delay', NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(28, 15, '2026-07-23 04:11:00', '2026-07-23 11:15:00', 'late', NULL, NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(29, 16, '2026-07-23 02:25:00', '2026-07-23 07:08:00', 'half_day', 'Weather delay', NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(30, 17, '2026-07-23 03:50:00', '2026-07-23 09:44:00', 'late', 'Traffic delay', NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(31, 18, '2026-07-23 01:54:00', '2026-07-23 13:02:00', 'present', 'Personal errand', NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(32, 20, '2026-07-23 02:23:00', '2026-07-23 12:50:00', 'late', NULL, NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(33, 21, '2026-07-23 03:24:00', '2026-07-23 11:40:00', 'late', 'Car trouble', NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(34, 23, '2026-07-23 02:02:00', '2026-07-23 10:30:00', 'present', 'Family emergency', NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(35, 25, '2026-07-23 03:06:00', '2026-07-23 13:07:00', 'late', 'Doctor appointment', NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(36, 26, '2026-07-23 02:20:00', '2026-07-23 09:30:00', 'present', NULL, NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(37, 27, '2026-07-23 02:37:00', '2026-07-23 10:50:00', 'present', 'Weather delay', NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(38, 28, '2026-07-23 02:52:00', '2026-07-23 10:37:00', 'late', NULL, NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(39, 1, '2026-07-22 01:54:00', '2026-07-22 12:50:00', 'present', NULL, NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(40, 3, '2026-07-22 02:09:00', '2026-07-22 11:59:00', 'present', NULL, NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(41, 7, '2026-07-22 01:47:00', '2026-07-22 05:44:00', 'half_day', NULL, NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(42, 10, '2026-07-22 01:45:00', '2026-07-22 11:31:00', 'present', 'Doctor appointment', NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(43, 11, '2026-07-22 02:31:00', '2026-07-22 10:36:00', 'present', NULL, NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(44, 16, '2026-07-22 04:25:00', '2026-07-22 13:16:00', 'late', NULL, NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(45, 17, '2026-07-22 02:13:00', '2026-07-22 12:13:00', 'late', NULL, NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(46, 18, '2026-07-22 03:34:00', '2026-07-22 12:15:00', 'late', 'Personal errand', NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(47, 19, '2026-07-22 02:17:00', '2026-07-22 09:52:00', 'present', 'Weather delay', NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(48, 21, '2026-07-22 01:48:00', '2026-07-22 05:38:00', 'half_day', NULL, NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(49, 22, '2026-07-22 03:51:00', '2026-07-22 11:56:00', 'late', NULL, NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(50, 24, '2026-07-22 02:38:00', '2026-07-22 10:51:00', 'present', 'Weather delay', NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(51, 25, '2026-07-22 02:54:00', '2026-07-22 11:46:00', 'late', 'Car trouble', NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(52, 26, '2026-07-22 03:46:00', '2026-07-22 09:49:00', 'late', NULL, NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(53, 27, '2026-07-22 02:55:00', '2026-07-22 11:32:00', 'late', NULL, NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(54, 28, '2026-07-22 02:42:00', '2026-07-22 06:28:00', 'half_day', 'Personal errand', NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(55, 1, '2026-07-21 03:36:00', '2026-07-21 13:07:00', 'late', 'Traffic delay', NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(56, 2, '2026-07-21 01:39:00', '2026-07-21 09:30:00', 'present', NULL, NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(57, 3, '2026-07-21 01:54:00', '2026-07-21 12:23:00', 'present', NULL, NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(58, 7, '2026-07-21 03:16:00', '2026-07-21 10:05:00', 'late', 'Car trouble', NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(59, 10, '2026-07-21 03:18:00', '2026-07-21 10:51:00', 'late', 'Personal errand', NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(60, 11, '2026-07-21 04:19:00', '2026-07-21 11:22:00', 'late', NULL, NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(61, 15, '2026-07-21 03:41:00', '2026-07-21 12:27:00', 'late', 'Traffic delay', NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(62, 16, '2026-07-21 03:03:00', '2026-07-21 11:37:00', 'late', 'Personal errand', NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(63, 17, '2026-07-21 04:13:00', '2026-07-21 11:54:00', 'late', NULL, NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(64, 19, '2026-07-21 02:14:00', '2026-07-21 10:45:00', 'present', 'Personal errand', NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(65, 20, '2026-07-21 01:36:00', '2026-07-21 12:44:00', 'present', 'Family emergency', NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(66, 22, '2026-07-21 04:25:00', '2026-07-21 11:29:00', 'late', 'Traffic delay', NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(67, 24, '2026-07-21 04:01:00', '2026-07-21 11:06:00', 'late', 'Doctor appointment', NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(68, 25, '2026-07-21 02:34:00', '2026-07-21 11:11:00', 'present', 'Personal errand', NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(69, 26, '2026-07-21 02:14:00', '2026-07-21 10:43:00', 'present', NULL, NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(70, 27, '2026-07-21 01:57:00', '2026-07-21 13:20:00', 'present', NULL, NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(71, 28, '2026-07-21 01:46:00', '2026-07-21 07:18:00', 'half_day', NULL, NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(72, 1, '2026-07-20 02:07:00', '2026-07-20 12:34:00', 'present', 'Personal errand', NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(73, 2, '2026-07-20 02:32:00', '2026-07-20 10:24:00', 'late', NULL, NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(74, 3, '2026-07-20 03:31:00', '2026-07-20 13:16:00', 'late', 'Doctor appointment', NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(75, 10, '2026-07-20 03:57:00', '2026-07-20 12:41:00', 'late', NULL, NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(76, 11, '2026-07-20 02:56:00', '2026-07-20 13:21:00', 'late', NULL, NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(77, 15, '2026-07-20 02:18:00', '2026-07-20 10:12:00', 'present', 'Personal errand', NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(78, 16, '2026-07-20 04:06:00', '2026-07-20 13:20:00', 'late', NULL, NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(79, 17, '2026-07-20 03:45:00', '2026-07-20 11:53:00', 'late', NULL, NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(80, 19, '2026-07-20 03:35:00', '2026-07-20 11:48:00', 'late', 'Personal errand', NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(81, 20, '2026-07-20 02:21:00', '2026-07-20 12:49:00', 'present', NULL, NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(82, 22, '2026-07-20 03:54:00', '2026-07-20 09:42:00', 'late', 'Family emergency', NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(83, 23, '2026-07-20 01:42:00', '2026-07-20 10:15:00', 'late', NULL, NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(84, 25, '2026-07-20 02:16:00', '2026-07-20 12:22:00', 'late', NULL, NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(85, 26, '2026-07-20 02:28:00', '2026-07-20 13:19:00', 'present', 'Car trouble', NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(86, 27, '2026-07-20 03:00:00', '2026-07-20 12:57:00', 'late', NULL, NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58'),
(87, 28, '2026-07-20 03:53:00', '2026-07-20 09:40:00', 'late', 'Family emergency', NULL, NULL, '2026-07-25 10:56:58', '2026-07-25 10:56:58');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `company_settings`
--

CREATE TABLE `company_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `company_code` varchar(50) DEFAULT NULL,
  `company_email` varchar(255) DEFAULT NULL,
  `company_phone` varchar(50) DEFAULT NULL,
  `company_address` text DEFAULT NULL,
  `company_city` varchar(100) DEFAULT NULL,
  `company_state` varchar(100) DEFAULT NULL,
  `company_country` varchar(100) DEFAULT NULL,
  `company_zip` varchar(20) DEFAULT NULL,
  `company_website` varchar(255) DEFAULT NULL,
  `company_logo` varchar(255) DEFAULT NULL,
  `tax_id` varchar(50) DEFAULT NULL,
  `registration_number` varchar(50) DEFAULT NULL,
  `timezone` varchar(50) NOT NULL DEFAULT 'UTC',
  `date_format` varchar(20) NOT NULL DEFAULT 'YYYY-MM-DD',
  `time_format` varchar(20) NOT NULL DEFAULT 'HH:mm',
  `currency` varchar(10) NOT NULL DEFAULT 'USD',
  `currency_symbol` varchar(10) NOT NULL DEFAULT '$',
  `fiscal_year_start` date DEFAULT NULL,
  `fiscal_year_end` date DEFAULT NULL,
  `week_start_day` varchar(20) NOT NULL DEFAULT 'Monday',
  `logo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `company_settings`
--

INSERT INTO `company_settings` (`id`, `company_name`, `company_code`, `company_email`, `company_phone`, `company_address`, `company_city`, `company_state`, `company_country`, `company_zip`, `company_website`, `company_logo`, `tax_id`, `registration_number`, `timezone`, `date_format`, `time_format`, `currency`, `currency_symbol`, `fiscal_year_start`, `fiscal_year_end`, `week_start_day`, `logo`, `created_at`, `updated_at`) VALUES
(1, 'HRMS Pro Inc.', NULL, 'info@hrmspro.com', '+95 9 123 456 789', 'No. 123, Main Street, Yangon', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'UTC', 'YYYY-MM-DD', 'HH:mm', 'USD', '$', NULL, NULL, 'Monday', NULL, '2026-07-28 02:35:12', '2026-07-28 02:35:12');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `manager_id` bigint(20) UNSIGNED DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `name`, `code`, `description`, `created_at`, `updated_at`, `manager_id`, `status`) VALUES
(1, 'Human Resources', 'HR', 'Human Resources management, employee relations, recruitment and training', NULL, '2026-07-25 09:54:45', NULL, 'active'),
(2, 'Sales & Marketing', 'SALES', 'Sales, marketing, brand management and customer acquisition', NULL, '2026-07-25 09:54:45', NULL, 'active'),
(3, 'Software Development', 'DEV', 'Software development, engineering and technical operations', NULL, '2026-07-25 09:54:45', NULL, 'active'),
(4, 'Executive', 'EXEC', 'Executive leadership and strategic management', '2026-07-24 09:29:34', '2026-07-25 09:54:45', 1, 'active'),
(8, 'Finance', 'FIN', 'Customer service and support management', '2026-07-24 09:29:34', '2026-07-25 09:54:45', 7, 'active'),
(9, 'Operations', 'OPS', 'Product development and management', '2026-07-24 09:29:34', '2026-07-25 09:54:45', 3, 'active'),
(10, 'IT', 'IT', 'Design and creative services updated', '2026-07-24 09:29:34', '2026-07-25 10:23:14', 28, 'active'),
(11, 'Customer Service', 'CS', 'Administrative and office management', '2026-07-24 09:29:34', '2026-07-25 09:54:45', 3, 'active'),
(12, 'Product', 'PROD', 'Quality assurance and testing', '2026-07-24 09:29:34', '2026-07-25 09:54:45', 3, 'active'),
(13, 'Design', 'DESIGN', 'Research and development of new products', '2026-07-24 09:29:34', '2026-07-25 09:54:45', 3, 'active'),
(14, 'Administration', 'ADMIN', 'Supply chain and procurement management', '2026-07-24 09:29:34', '2026-07-25 09:54:45', 3, 'active'),
(15, 'Quality Assurance', 'QA', 'Legal services and compliance', '2026-07-24 09:29:34', '2026-07-25 09:54:45', 3, 'active'),
(16, 'Research & Development', 'RND', NULL, '2026-07-24 09:29:34', '2026-07-25 09:42:06', 3, 'active'),
(17, 'Supply Chain', 'SC', NULL, '2026-07-24 09:29:34', '2026-07-25 09:42:06', 3, 'active'),
(18, 'Legal', 'LEGAL', NULL, '2026-07-24 09:29:34', '2026-07-25 09:42:06', 3, 'active'),
(24, 'Test Department', 'TEST', 'Test description', '2026-07-25 10:24:26', '2026-07-25 10:24:26', 17, 'active'),
(25, 'Sales', 'SAL', 'Sales Department - Responsible for all sales activities', '2026-07-28 09:13:10', '2026-07-28 09:13:10', NULL, 'active');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `employee_code` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `department_id` bigint(20) UNSIGNED NOT NULL,
  `position_id` bigint(20) UNSIGNED NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `hire_date` date DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `user_id`, `employee_code`, `name`, `department_id`, `position_id`, `phone`, `email`, `date_of_birth`, `gender`, `hire_date`, `status`, `photo`, `created_at`, `updated_at`) VALUES
(1, 3, 'EMP001', 'Aung Kyaw', 1, 1, '09450012345', 'aungkyaw.hr@hrms.com', '1990-05-15', 'male', '2024-01-15', 'active', 'https://randomuser.me/api/portraits/men/1.jpg', NULL, '2026-07-24 13:20:40'),
(2, 5, 'EMP002', 'Mya Mya', 2, 2, '09510067890', 'myamya.sales@hrms.com', '1992-08-22', 'female', '2025-03-10', 'active', 'https://randomuser.me/api/portraits/women/1.jpg', NULL, '2026-07-24 13:20:40'),
(3, 4, 'EMP003', 'Ko Ko', 3, 3, '09790045678', 'koko.dev@hrms.com', '1988-08-08', 'male', '2023-05-20', 'inactive', 'https://randomuser.me/api/portraits/men/3.jpg', NULL, '2026-07-24 13:21:42'),
(7, 6, 'EMP004', 'Su Su', 2, 3, '09790045234', 'susu.sales@hrms.com', '1995-03-07', 'female', '2026-03-20', 'active', 'https://randomuser.me/api/portraits/women/2.jpg', '2026-07-22 01:38:05', '2026-07-24 13:20:40'),
(10, 7, 'EMP005', 'Min Min', 3, 4, '09451234567', 'minmin.dev@hrms.com', '1985-06-25', 'male', '2022-06-10', 'active', 'https://randomuser.me/api/portraits/men/4.jpg', '2026-07-24 09:43:43', '2026-07-24 13:20:40'),
(11, 8, 'EMP006', 'Thida', 1, 2, '09561234567', 'thida.hr@hrms.com', '1993-09-18', 'female', '2023-08-15', 'active', 'https://randomuser.me/api/portraits/women/3.jpg', '2026-07-24 09:43:43', '2026-07-24 13:20:40'),
(15, 9, 'EMP007', 'Kyaw Kyaw', 4, 6, '09781234567', 'kyawkyaw.finance@hrms.com', '1987-12-03', 'male', '2024-02-20', 'active', 'https://randomuser.me/api/portraits/men/5.jpg', '2026-07-24 09:47:17', '2026-07-24 13:20:40'),
(16, 10, 'EMP008', 'Nandar', 4, 6, '09451234876', 'nandar.finance@hrms.com', '1991-07-14', 'female', '2023-11-01', 'active', 'https://randomuser.me/api/portraits/women/4.jpg', '2026-07-24 09:47:17', '2026-07-24 13:20:40'),
(17, 11, 'EMP009', 'Zaw Zaw', 3, 13, '09561234876', 'zawzaw.dev@hrms.com', '1994-04-28', 'male', '2024-07-05', 'active', 'https://randomuser.me/api/portraits/men/6.jpg', '2026-07-24 09:47:17', '2026-07-24 13:20:40'),
(18, 12, 'EMP010', 'Hla Hla', 2, 9, '09781234876', 'hlahla.marketing@hrms.com', '1996-10-09', 'female', '2024-09-12', 'active', 'https://randomuser.me/api/portraits/women/5.jpg', '2026-07-24 09:47:17', '2026-07-24 13:20:40'),
(19, 13, 'EMP011', 'Tun Tun', 1, 1, '09451234987', 'tuntun.ops@hrms.com', '1989-02-11', 'male', '2024-04-18', 'active', 'https://randomuser.me/api/portraits/men/7.jpg', '2026-07-24 09:47:17', '2026-07-25 09:27:23'),
(20, 14, 'EMP012', 'Moe Moe', 2, 1, '09561234987', 'moemoe.it@hrms.com', '1992-05-19', 'female', '2024-06-25', 'active', 'https://randomuser.me/api/portraits/women/6.jpg', '2026-07-24 09:47:17', '2026-07-25 09:27:30'),
(21, 15, 'EMP013', 'Thet Thet', 1, 8, '09781234987', 'thetthet.hr@hrms.com', '1986-08-30', 'female', '2022-01-10', 'active', 'https://randomuser.me/api/portraits/women/7.jpg', '2026-07-24 09:47:17', '2026-07-24 13:20:40'),
(22, 16, 'EMP014', 'Win Win', 2, 10, '09451234098', 'winwin.sales@hrms.com', '1994-12-15', 'female', '2024-08-30', 'active', 'https://randomuser.me/api/portraits/women/8.jpg', '2026-07-24 09:47:17', '2026-07-24 13:20:40'),
(23, 17, 'EMP015', 'Soe Soe', 3, 14, '09561234098', 'soesoe.dev@hrms.com', '1991-03-22', 'male', '2024-10-15', 'inactive', 'https://randomuser.me/api/portraits/men/8.jpg', '2026-07-24 09:47:17', '2026-07-24 13:20:40'),
(24, 18, 'EMP016', 'Aye Aye', 3, 2, '09781234098', 'ayeaye.cs@hrms.com', '1993-07-08', 'female', '2024-12-01', 'active', 'https://randomuser.me/api/portraits/women/9.jpg', '2026-07-24 09:47:17', '2026-07-25 09:27:35'),
(25, 19, 'EMP017', 'Pyae Pyae', 8, 1, '09451234012', 'pyaepyae.product@hrms.com', '1990-11-25', 'male', '2025-01-20', 'active', 'https://randomuser.me/api/portraits/men/9.jpg', '2026-07-24 09:47:17', '2026-07-24 13:20:40'),
(26, 20, 'EMP018', 'Nyi Nyi', 9, 1, '09561234012', 'nyinyi.design@hrms.com', '1988-09-12', 'male', '2025-02-14', 'active', 'https://randomuser.me/api/portraits/men/10.jpg', '2026-07-24 09:47:17', '2026-07-24 13:20:40'),
(27, 21, 'EMP019', 'Khin Khin', 10, 1, '09781234012', 'khinkhin.admin@hrms.com', '1995-06-18', 'female', '2025-03-25', 'active', 'https://randomuser.me/api/portraits/women/10.jpg', '2026-07-24 09:47:17', '2026-07-24 13:20:40'),
(28, 22, 'EMP020', 'Maung Maung', 3, 15, '09451234123', 'maungmaung.dev@hrms.com', '1987-04-05', 'male', '2025-04-10', 'active', 'https://randomuser.me/api/portraits/men/11.jpg', '2026-07-24 09:47:17', '2026-07-24 13:20:40'),
(29, NULL, 'EMP021', 'Ei Mon', 2, 9, '09598765432', 'eimon.marketing@hrms.com', '1997-07-23', 'female', '2026-07-24', 'active', 'employees/Pote0xofjjpTSPba0iFhjo3mO2cXyW0HsbKbWMrf.jpg', '2026-07-24 12:15:12', '2026-07-25 09:27:30'),
(32, NULL, 'EMP022', 'Thandar Aung', 25, 20, '+95912345678', 'thandar.aung@hrms.com', '1988-03-15', 'female', '2021-06-01', 'active', 'https://randomuser.me/api/portraits/women/11.jpg', '2026-07-28 09:18:15', '2026-07-28 09:18:15');

-- --------------------------------------------------------

--
-- Table structure for table `employee_salaries`
--

CREATE TABLE `employee_salaries` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED NOT NULL,
  `base_salary` decimal(15,2) NOT NULL,
  `hourly_rate` decimal(10,2) DEFAULT NULL,
  `weekly_rate` decimal(10,2) DEFAULT NULL,
  `monthly_rate` decimal(15,2) DEFAULT NULL,
  `allowances` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`allowances`)),
  `deductions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`deductions`)),
  `bank_name` varchar(100) DEFAULT NULL,
  `bank_account` varchar(50) DEFAULT NULL,
  `bank_branch` varchar(100) DEFAULT NULL,
  `account_type` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `effective_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `leave_requests`
--

CREATE TABLE `leave_requests` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `employee_id` bigint(20) UNSIGNED NOT NULL,
  `leave_type_id` bigint(20) UNSIGNED DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `total_days` int(11) NOT NULL DEFAULT 0,
  `reason` text DEFAULT NULL,
  `rejection_reason` text DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `approved_by` bigint(20) UNSIGNED DEFAULT NULL,
  `status` enum('pending','approved','rejected','cancelled') NOT NULL DEFAULT 'pending',
  `attachment` varchar(255) DEFAULT NULL,
  `attachment_original_name` varchar(255) DEFAULT NULL,
  `attachment_mime_type` varchar(255) DEFAULT NULL,
  `attachment_size` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `leave_requests`
--

INSERT INTO `leave_requests` (`id`, `created_at`, `updated_at`, `employee_id`, `leave_type_id`, `start_date`, `end_date`, `total_days`, `reason`, `rejection_reason`, `approved_at`, `approved_by`, `status`, `attachment`, `attachment_original_name`, `attachment_mime_type`, `attachment_size`) VALUES
(1, '2026-07-20 00:31:58', '2026-07-20 00:48:43', 1, NULL, '2026-07-01', '2026-07-05', 0, 'Family trip to Mandalay', NULL, NULL, NULL, 'approved', NULL, NULL, NULL, NULL),
(2, '2026-07-21 21:18:51', '2026-07-21 21:18:51', 2, NULL, '2026-07-10', '2026-07-11', 0, 'Personal errands', NULL, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(3, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 1, 4, '2026-06-25', '2026-06-29', 5, 'Medical checkup', NULL, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(4, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 1, 4, '2026-07-08', '2026-07-11', 4, 'Vacation', NULL, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(5, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 1, 5, '2026-06-12', '2026-06-13', 2, 'Religious holiday', NULL, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(6, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 11, 5, '2026-07-09', '2026-07-12', 4, 'Wedding attendance', NULL, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(7, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 11, 3, '2026-05-16', '2026-05-20', 5, 'Travel', NULL, '2026-05-18 10:22:57', 1, 'approved', NULL, NULL, NULL, NULL),
(8, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 11, 4, '2026-07-08', '2026-07-11', 4, 'Family emergency', NULL, '2026-07-10 10:22:57', 1, 'approved', NULL, NULL, NULL, NULL),
(9, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 11, 3, '2026-05-05', '2026-05-08', 4, 'Personal errands', NULL, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(10, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 19, 1, '2026-06-30', '2026-07-05', 6, 'Study leave', NULL, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(11, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 19, 5, '2026-06-29', '2026-07-04', 6, 'Family emergency', NULL, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(12, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 19, 1, '2026-07-07', '2026-07-11', 5, 'Religious holiday', 'Insufficient leave balance or manager discretion', NULL, NULL, 'rejected', NULL, NULL, NULL, NULL),
(13, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 19, 1, '2026-06-07', '2026-06-09', 3, 'Personal errands', NULL, '2026-06-08 10:22:57', 1, 'approved', NULL, NULL, NULL, NULL),
(14, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 21, 7, '2026-04-30', '2026-05-02', 3, 'Mental health day', 'Insufficient leave balance or manager discretion', NULL, NULL, 'rejected', NULL, NULL, NULL, NULL),
(15, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 21, 3, '2026-04-27', '2026-04-30', 4, 'Study leave', 'Insufficient leave balance or manager discretion', NULL, NULL, 'rejected', NULL, NULL, NULL, NULL),
(16, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 21, 2, '2026-06-21', '2026-06-26', 6, 'Home renovation', NULL, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(17, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 2, 5, '2026-07-15', '2026-07-17', 3, 'Medical checkup', NULL, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(18, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 2, 5, '2026-07-25', '2026-07-26', 2, 'Doctor appointment', NULL, '2026-07-26 10:22:57', 1, 'approved', NULL, NULL, NULL, NULL),
(19, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 7, 1, '2026-05-17', '2026-05-19', 3, 'Doctor appointment', NULL, '2026-05-20 10:22:57', 1, 'approved', NULL, NULL, NULL, NULL),
(20, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 7, 5, '2026-05-13', '2026-05-15', 3, 'Wedding attendance', NULL, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(21, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 7, 7, '2026-06-24', '2026-06-26', 3, 'Childcare', NULL, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(22, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 18, 3, '2026-06-03', '2026-06-07', 5, 'Childcare', NULL, '2026-06-05 10:22:57', 1, 'approved', NULL, NULL, NULL, NULL),
(23, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 18, 6, '2026-06-16', '2026-06-20', 5, 'Religious holiday', NULL, '2026-06-19 10:22:57', 1, 'approved', NULL, NULL, NULL, NULL),
(24, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 20, 3, '2026-06-14', '2026-06-18', 5, 'Sick leave', NULL, '2026-06-16 10:22:57', 1, 'approved', NULL, NULL, NULL, NULL),
(25, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 20, 6, '2026-07-21', '2026-07-22', 2, 'Childcare', NULL, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(26, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 20, 6, '2026-05-30', '2026-05-31', 2, 'Family emergency', NULL, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(27, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 22, 4, '2026-05-27', '2026-05-31', 5, 'Wedding attendance', NULL, '2026-05-29 10:22:57', 1, 'approved', NULL, NULL, NULL, NULL),
(28, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 22, 7, '2026-06-10', '2026-06-14', 5, 'Sick leave', 'Insufficient leave balance or manager discretion', NULL, NULL, 'rejected', NULL, NULL, NULL, NULL),
(29, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 29, 2, '2026-06-06', '2026-06-07', 2, 'Religious holiday', NULL, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(30, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 29, 2, '2026-05-16', '2026-05-18', 3, 'Eye checkup', NULL, '2026-05-18 10:22:57', 1, 'approved', NULL, NULL, NULL, NULL),
(31, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 29, 5, '2026-06-05', '2026-06-08', 4, 'Vacation', NULL, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(32, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 3, 1, '2026-05-06', '2026-05-09', 4, 'Family emergency', NULL, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(33, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 3, 5, '2026-05-23', '2026-05-27', 5, 'Doctor appointment', NULL, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(34, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 10, 5, '2026-06-17', '2026-06-22', 6, 'House moving', NULL, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(35, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 10, 5, '2026-06-24', '2026-06-27', 4, 'Medical checkup', NULL, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(36, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 10, 3, '2026-05-20', '2026-05-21', 2, 'Travel', NULL, '2026-05-23 10:22:57', 1, 'approved', NULL, NULL, NULL, NULL),
(37, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 17, 7, '2026-06-20', '2026-06-21', 2, 'Vacation', NULL, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(38, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 17, 1, '2026-05-04', '2026-05-09', 6, 'Wedding attendance', NULL, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(39, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 23, 1, '2026-07-03', '2026-07-04', 2, 'Dental appointment', NULL, '2026-07-05 10:22:57', 1, 'approved', NULL, NULL, NULL, NULL),
(40, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 23, 1, '2026-06-16', '2026-06-21', 6, 'Wedding attendance', 'Insufficient leave balance or manager discretion', NULL, NULL, 'rejected', NULL, NULL, NULL, NULL),
(41, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 24, 1, '2026-07-05', '2026-07-06', 2, 'Personal errands', NULL, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(42, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 24, 7, '2026-07-17', '2026-07-18', 2, 'Doctor appointment', NULL, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(43, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 24, 6, '2026-06-25', '2026-06-26', 2, 'Personal errands', NULL, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(44, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 24, 1, '2026-07-04', '2026-07-07', 4, 'Childcare', NULL, '2026-07-07 10:22:57', 1, 'approved', NULL, NULL, NULL, NULL),
(45, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 28, 4, '2026-06-04', '2026-06-09', 6, 'Wedding attendance', 'Insufficient leave balance or manager discretion', NULL, NULL, 'rejected', NULL, NULL, NULL, NULL),
(46, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 28, 5, '2026-05-11', '2026-05-15', 5, 'Religious holiday', NULL, '2026-05-12 10:22:57', 1, 'approved', NULL, NULL, NULL, NULL),
(47, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 28, 7, '2026-06-25', '2026-06-27', 3, 'Wedding attendance', NULL, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(48, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 15, 6, '2026-05-25', '2026-05-30', 6, 'Eye checkup', NULL, '2026-05-28 10:22:57', 1, 'approved', NULL, NULL, NULL, NULL),
(49, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 15, 7, '2026-06-11', '2026-06-13', 3, 'Travel', NULL, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(50, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 16, 3, '2026-06-19', '2026-06-21', 3, 'Doctor appointment', NULL, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(51, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 16, 6, '2026-05-23', '2026-05-24', 2, 'Family vacation', NULL, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(52, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 25, 4, '2026-06-06', '2026-06-07', 2, 'Travel', NULL, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(53, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 25, 4, '2026-06-09', '2026-06-13', 5, 'Religious holiday', NULL, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(54, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 26, 1, '2026-07-02', '2026-07-06', 5, 'Family event', NULL, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(55, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 26, 6, '2026-07-11', '2026-07-16', 6, 'Wedding attendance', 'Insufficient leave balance or manager discretion', NULL, NULL, 'rejected', NULL, NULL, NULL, NULL),
(56, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 26, 3, '2026-05-01', '2026-05-02', 2, 'Sick leave', NULL, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(57, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 27, 7, '2026-06-12', '2026-06-15', 4, 'Personal leave', NULL, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(58, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 27, 4, '2026-07-17', '2026-07-22', 6, 'Childcare', NULL, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(59, '2026-07-26 10:22:57', '2026-07-26 10:22:57', 27, 3, '2026-07-15', '2026-07-18', 4, 'Family event', 'Insufficient leave balance or manager discretion', NULL, NULL, 'rejected', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `leave_types`
--

CREATE TABLE `leave_types` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `days_per_year` int(11) NOT NULL DEFAULT 0,
  `is_paid` tinyint(1) NOT NULL DEFAULT 1,
  `requires_approval` tinyint(1) NOT NULL DEFAULT 1,
  `max_consecutive_days` int(11) DEFAULT NULL,
  `carry_forward` tinyint(1) NOT NULL DEFAULT 0,
  `carry_forward_limit` int(11) DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `leave_types`
--

INSERT INTO `leave_types` (`id`, `name`, `code`, `description`, `days_per_year`, `is_paid`, `requires_approval`, `max_consecutive_days`, `carry_forward`, `carry_forward_limit`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Annual Leave', 'ANNUAL', 'Annual paid leave', 12, 1, 1, NULL, 0, NULL, 'active', '2026-07-26 10:08:31', '2026-07-26 10:08:31'),
(2, 'Sick Leave', 'SICK', 'Sick leave with pay', 10, 1, 1, NULL, 0, NULL, 'active', '2026-07-26 10:08:31', '2026-07-26 10:08:31'),
(3, 'Casual Leave', 'CASUAL', 'Casual leave', 7, 1, 1, NULL, 0, NULL, 'active', '2026-07-26 10:08:32', '2026-07-26 10:08:32'),
(4, 'Unpaid Leave', 'UNPAID', 'Unpaid leave', 0, 0, 1, NULL, 0, NULL, 'active', '2026-07-26 10:08:32', '2026-07-26 10:08:32'),
(5, 'Maternity Leave', 'MATERNITY', 'Maternity leave', 90, 1, 1, NULL, 0, NULL, 'active', '2026-07-26 10:08:32', '2026-07-26 10:08:32'),
(6, 'Paternity Leave', 'PATERNITY', 'Paternity leave', 7, 1, 1, NULL, 0, NULL, 'active', '2026-07-26 10:08:32', '2026-07-26 10:08:32'),
(7, 'Public Holiday', 'PUBLIC', 'Public holiday', 0, 1, 0, NULL, 0, NULL, 'active', '2026-07-26 10:08:32', '2026-07-26 10:08:32');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(5, '2026_07_16_101246_create_departments_table', 1),
(6, '2026_07_16_101259_create_positions_table', 1),
(7, '2026_07_16_101301_create_employees_table', 1),
(8, '2026_07_16_101306_create_attendances_table', 1),
(10, '2026_07_16_101348_create_payrolls_table', 1),
(11, '2026_07_16_101357_create_permissions_table', 1),
(12, '2026_07_16_101405_create_role_user_table', 1),
(13, '2026_07_19_064610_create_roles_table', 1),
(14, '2026_07_19_075842_add_role_id_to_users_table', 1),
(15, '2026_07_19_085847_create_role_permissions_table', 1),
(16, '2026_07_19_140442_add_photo_to_employees_table', 1),
(17, '2026_07_19_143100_create_payroll_items_table', 1),
(18, '2026_07_19_143150_create_company_settings_table', 1),
(19, '2026_07_19_143200_create_payroll_settings_table', 1),
(20, '2026_07_19_143300_create_employee_salaries_table', 1),
(21, '2026_07_19_152753_fix_payrolls_columns', 1),
(22, '2026_07_19_160744_add_missing_payroll_permissions', 1),
(23, '2026_07_19_161000_add_name_slug_to_permissions_table', 1),
(24, '2026_07_19_173500_fix_tables_for_employees', 1),
(30, '2026_07_20_070921_add_attachment_columns_to_leave_requests_table', 2),
(31, '2026_07_20_073029_create_attendances_table', 2),
(32, '2026_07_21_032517_update_payrolls_table_add_columns', 3),
(33, '2026_07_22_035702_add_user_id_to_employees_table', 4),
(35, '2026_07_22_045309_add_employee_id_to_users_table', 5),
(36, '2026_07_22_052040_create_positions_table', 6),
(38, '2026_07_22_052539_create_positions_table', 7),
(39, '2026_07_16_101338_create_leave_requests_table', 8),
(40, '2026_07_24_090000_add_profile_fields_to_users_table', 9),
(41, '2026_07_24_093948_create_activity_logs_table', 10),
(42, '2026_07_24_145757_add_experience_and_project_to_users_table', 11),
(43, '2026_07_24_185036_add_date_of_birth_and_gender_to_employees_table', 12),
(44, '2026_07_25_161106_add_missing_columns_to_departments_table', 13),
(45, '2026_07_25_164026_add_missing_columns_to_positions_table', 14),
(46, '2026_07_25_170546_add_location_fields_to_attendances_table', 15),
(47, '2026_07_26_163721_create_leave_types_table', 16),
(48, '2026_07_26_163753_add_leave_type_id_to_leave_requests_table', 17),
(49, '2026_07_26_165155_drop_leave_type_column_from_leave_requests', 18),
(50, '2026_07_27_161644_update_payroll_currency_to_mmk', 19),
(51, '2026_07_28_081609_add_missing_columns_to_roles_table', 20),
(52, '2026_07_28_081900_add_missing_columns_to_permissions_table', 20),
(53, '2026_07_28_090429_add_missing_columns_to_company_settings_table', 21),
(54, '2026_07_28_093006_create_announcements_table', 22),
(55, '2026_07_28_093032_create_announcement_attachments_table', 22),
(56, '2026_07_28_093048_create_announcement_views_table', 22),
(57, '2026_07_28_093105_create_announcement_notifications_table', 22),
(58, '2026_07_31_090410_add_fulltext_to_employees_table', 23),
(59, '2026_07_31_093124_create_search_demo_table', 24);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payrolls`
--

CREATE TABLE `payrolls` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED NOT NULL,
  `payroll_month` date NOT NULL,
  `basic_salary` decimal(15,2) NOT NULL DEFAULT 0.00,
  `daily_salary` decimal(15,2) NOT NULL DEFAULT 0.00,
  `hourly_salary` decimal(15,2) NOT NULL DEFAULT 0.00,
  `total_allowances` decimal(15,2) NOT NULL DEFAULT 0.00,
  `total_overtime` decimal(15,2) NOT NULL DEFAULT 0.00,
  `total_bonus` decimal(15,2) NOT NULL DEFAULT 0.00,
  `gross_salary` decimal(15,2) NOT NULL DEFAULT 0.00,
  `total_deductions` decimal(15,2) NOT NULL DEFAULT 0.00,
  `tax_amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `loan_deduction` decimal(15,2) NOT NULL DEFAULT 0.00,
  `advance_salary` decimal(15,2) NOT NULL DEFAULT 0.00,
  `late_deduction` decimal(15,2) NOT NULL DEFAULT 0.00,
  `absent_deduction` decimal(15,2) NOT NULL DEFAULT 0.00,
  `unpaid_leave_deduction` decimal(15,2) NOT NULL DEFAULT 0.00,
  `other_deductions` decimal(15,2) NOT NULL DEFAULT 0.00,
  `net_salary` decimal(15,2) NOT NULL DEFAULT 0.00,
  `currency` varchar(10) NOT NULL DEFAULT 'MMK',
  `status` enum('draft','calculated','pending_approval','approved','paid','cancelled') NOT NULL DEFAULT 'draft',
  `payment_date` date DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `bank_name` varchar(100) DEFAULT NULL,
  `bank_account` varchar(50) DEFAULT NULL,
  `transaction_number` varchar(100) DEFAULT NULL,
  `general_notes` text DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `paid_by` bigint(20) UNSIGNED DEFAULT NULL,
  `hr_notes` text DEFAULT NULL,
  `finance_notes` text DEFAULT NULL,
  `employee_notes` text DEFAULT NULL,
  `approved_by` bigint(20) UNSIGNED DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payrolls`
--

INSERT INTO `payrolls` (`id`, `employee_id`, `payroll_month`, `basic_salary`, `daily_salary`, `hourly_salary`, `total_allowances`, `total_overtime`, `total_bonus`, `gross_salary`, `total_deductions`, `tax_amount`, `loan_deduction`, `advance_salary`, `late_deduction`, `absent_deduction`, `unpaid_leave_deduction`, `other_deductions`, `net_salary`, `currency`, `status`, `payment_date`, `payment_method`, `bank_name`, `bank_account`, `transaction_number`, `general_notes`, `created_by`, `created_at`, `updated_at`, `paid_by`, `hr_notes`, `finance_notes`, `employee_notes`, `approved_by`, `approved_at`, `paid_at`) VALUES
(1, 1, '2026-07-01', 500000.00, 21739.13, 2717.39, 0.00, 0.00, 0.00, 500000.00, 12500.00, 12500.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 487500.00, 'MMK', 'pending_approval', '2026-07-20', NULL, NULL, NULL, NULL, 'Updated payroll for Aung Kyaw', 1, '2026-07-19 22:51:32', '2026-07-20 23:04:50', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 2, '2026-07-01', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 'MMK', 'paid', '2026-07-15', 'bank_transfer', 'Myanmar National Bank', 'ACC1234567890', 'TXN-20260715-001', NULL, 1, '2026-07-20 21:31:56', '2026-07-21 00:10:19', 1, NULL, NULL, NULL, 1, '2026-07-21 00:09:56', '2026-07-21 00:10:19'),
(5, 3, '2026-07-01', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 'MMK', 'cancelled', NULL, NULL, NULL, NULL, NULL, 'Cancellation: \'Customer requested cancellation due to duplicate payment', 1, '2026-07-20 21:31:56', '2026-07-21 00:13:09', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(6, 2, '2026-01-01', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 'MMK', 'paid', '2026-07-15', 'bank_transfer', 'Myanmar National Bank', 'ACC1234567890', 'TXN-20260715-001', NULL, 5, '2026-07-22 01:16:29', '2026-07-22 01:22:45', 1, NULL, NULL, NULL, 1, '2026-07-22 01:21:52', '2026-07-22 01:22:45'),
(7, 1, '2026-05-01', 48653.00, 2211.50, 276.44, 7813.00, 507.00, 2414.00, 59387.00, 8064.00, 3656.00, 413.00, 1816.00, 353.00, 297.00, 396.00, 424.00, 47667.00, 'MMK', 'paid', '2026-07-13', 'check', NULL, NULL, 'TXN-UDTXRHGV', NULL, 1, '2026-07-27 09:42:32', '2026-07-27 09:42:32', 1, NULL, NULL, NULL, 1, '2026-07-23 09:42:32', '2026-07-22 09:42:32'),
(8, 11, '2026-05-01', 62893.00, 2858.77, 357.35, 10685.00, 2922.00, 768.00, 77268.00, 14517.00, 4771.00, 310.00, 320.00, 469.00, 704.00, 145.00, 326.00, 57980.00, 'MMK', 'paid', '2026-07-24', 'bank_transfer', 'First Bank', '4865084313', 'TXN-5SKMZANL', NULL, 1, '2026-07-27 09:42:32', '2026-07-27 09:42:32', 1, NULL, NULL, NULL, 1, '2026-07-22 09:42:32', '2026-07-23 09:42:32'),
(9, 21, '2026-05-01', 47830.00, 2174.09, 271.76, 11356.00, 1170.00, 4356.00, 64712.00, 10106.00, 5070.00, 843.00, 1396.00, 441.00, 862.00, 305.00, 277.00, 49536.00, 'MMK', 'approved', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-07-27 09:42:32', '2026-07-27 09:42:32', NULL, NULL, NULL, NULL, 1, '2026-07-17 09:42:32', NULL),
(10, 2, '2026-05-01', 56445.00, 2565.68, 320.71, 14222.00, 1534.00, 3016.00, 75217.00, 7812.00, 6186.00, 635.00, 1048.00, 476.00, 648.00, 477.00, 101.00, 61219.00, 'MMK', 'paid', '2026-07-24', 'bank_transfer', 'Global Bank', '4040790612', 'TXN-X1C0FDDA', NULL, 1, '2026-07-27 09:42:32', '2026-07-27 09:42:32', 1, NULL, NULL, NULL, 1, '2026-07-19 09:42:32', '2026-07-24 09:42:32'),
(11, 7, '2026-05-01', 56027.00, 2546.68, 318.34, 14479.00, 2350.00, 4794.00, 77650.00, 9946.00, 5212.00, 212.00, 1523.00, 248.00, 576.00, 87.00, 302.00, 62492.00, 'MMK', 'paid', '2026-07-25', 'check', NULL, NULL, 'TXN-FLCX9L0W', NULL, 1, '2026-07-27 09:42:32', '2026-07-27 09:42:32', 1, NULL, NULL, NULL, 1, '2026-07-26 09:42:32', '2026-07-23 09:42:32'),
(12, 20, '2026-05-01', 59275.00, 2694.32, 336.79, 13150.00, 1898.00, 3423.00, 77746.00, 13654.00, 3916.00, 628.00, 591.00, 433.00, 798.00, 276.00, 484.00, 60176.00, 'MMK', 'paid', '2026-07-13', 'cash', NULL, NULL, 'TXN-IJWN3LLC', NULL, 1, '2026-07-27 09:42:32', '2026-07-27 09:42:32', 1, NULL, NULL, NULL, 1, '2026-07-24 09:42:32', '2026-07-26 09:42:32'),
(13, 22, '2026-05-01', 56004.00, 2545.64, 318.20, 5493.00, 1279.00, 4968.00, 67744.00, 9690.00, 3458.00, 830.00, 8.00, 380.00, 898.00, 473.00, 327.00, 54596.00, 'MMK', 'approved', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-07-27 09:42:32', '2026-07-27 09:42:32', NULL, NULL, NULL, NULL, 1, '2026-07-18 09:42:32', NULL),
(14, 29, '2026-05-01', 79960.00, 3634.55, 454.32, 10847.00, 53.00, 8.00, 90868.00, 16186.00, 8305.00, 309.00, 1221.00, 433.00, 276.00, 370.00, 125.00, 66377.00, 'MMK', 'approved', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-07-27 09:42:32', '2026-07-27 09:42:32', NULL, NULL, NULL, NULL, 1, '2026-07-26 09:42:32', NULL),
(15, 10, '2026-05-01', 45668.00, 2075.82, 259.48, 12223.00, 1544.00, 3430.00, 62865.00, 11205.00, 5800.00, 489.00, 1153.00, 314.00, 979.00, 365.00, 216.00, 45860.00, 'MMK', 'paid', '2026-07-20', 'check', NULL, NULL, 'TXN-3RIQZICV', NULL, 1, '2026-07-27 09:42:32', '2026-07-27 09:42:32', 1, NULL, NULL, NULL, 1, '2026-07-19 09:42:32', '2026-07-24 09:42:32'),
(16, 23, '2026-05-01', 62049.00, 2820.41, 352.55, 14153.00, 2532.00, 4175.00, 82909.00, 11407.00, 5235.00, 286.00, 728.00, 335.00, 754.00, 1.00, 191.00, 66267.00, 'MMK', 'paid', '2026-07-16', 'cash', NULL, NULL, 'TXN-TLVHVUTM', NULL, 1, '2026-07-27 09:42:32', '2026-07-27 09:42:32', 1, NULL, NULL, NULL, 1, '2026-07-23 09:42:32', '2026-07-26 09:42:32'),
(17, 28, '2026-05-01', 79420.00, 3610.00, 451.25, 10443.00, 2561.00, 876.00, 93300.00, 14435.00, 5640.00, 938.00, 1823.00, 172.00, 620.00, 389.00, 468.00, 73225.00, 'MMK', 'approved', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-07-27 09:42:32', '2026-07-27 09:42:32', NULL, NULL, NULL, NULL, 1, '2026-07-22 09:42:32', NULL),
(18, 15, '2026-05-01', 39791.00, 1808.68, 226.09, 5388.00, 2462.00, 3242.00, 50883.00, 8888.00, 4666.00, 720.00, 1008.00, 154.00, 520.00, 408.00, 153.00, 37329.00, 'MMK', 'paid', '2026-07-20', 'bank_transfer', 'Global Bank', '2010413148', 'TXN-TBHYEOVS', NULL, 1, '2026-07-27 09:42:32', '2026-07-27 09:42:32', 1, NULL, NULL, NULL, 1, '2026-07-23 09:42:32', '2026-07-23 09:42:32'),
(19, 16, '2026-05-01', 32784.00, 1490.18, 186.27, 6979.00, 624.00, 429.00, 40816.00, 4813.00, 2277.00, 90.00, 1548.00, 281.00, 105.00, 302.00, 430.00, 33726.00, 'MMK', 'approved', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-07-27 09:42:32', '2026-07-27 09:42:32', NULL, NULL, NULL, NULL, 1, '2026-07-24 09:42:32', NULL),
(20, 25, '2026-05-01', 49128.00, 2233.09, 279.14, 14476.00, 1791.00, 4174.00, 69569.00, 9048.00, 4314.00, 346.00, 112.00, 47.00, 741.00, 402.00, 203.00, 56207.00, 'MMK', 'paid', '2026-07-26', 'check', NULL, NULL, 'TXN-A9ORHB0X', NULL, 1, '2026-07-27 09:42:32', '2026-07-27 09:42:32', 1, NULL, NULL, NULL, 1, '2026-07-17 09:42:32', '2026-07-23 09:42:32'),
(21, 26, '2026-05-01', 71791.00, 3263.23, 407.90, 13385.00, 745.00, 4454.00, 90375.00, 10040.00, 7184.00, 624.00, 1209.00, 363.00, 253.00, 286.00, 110.00, 73151.00, 'MMK', 'approved', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-07-27 09:42:32', '2026-07-27 09:42:32', NULL, NULL, NULL, NULL, 1, '2026-07-23 09:42:32', NULL),
(22, 27, '2026-05-01', 63506.00, 2886.64, 360.83, 12710.00, 2309.00, 4748.00, 83273.00, 14184.00, 5742.00, 627.00, 820.00, 135.00, 90.00, 328.00, 109.00, 63347.00, 'MMK', 'paid', '2026-07-16', 'check', NULL, NULL, 'TXN-UC9OX0ZB', NULL, 1, '2026-07-27 09:42:32', '2026-07-27 09:42:32', 1, NULL, NULL, NULL, 1, '2026-07-17 09:42:32', '2026-07-26 09:42:32'),
(23, 11, '2026-06-01', 68951.00, 3134.14, 391.77, 13971.00, 1747.00, 4924.00, 89593.00, 11351.00, 8599.00, 283.00, 322.00, 182.00, 615.00, 254.00, 425.00, 69643.00, 'MMK', 'paid', '2026-07-13', 'bank_transfer', 'ABC Bank', '1265267091', 'TXN-BW55JZIP', NULL, 1, '2026-07-27 09:42:32', '2026-07-27 09:42:32', 1, NULL, NULL, NULL, 1, '2026-07-19 09:42:32', '2026-07-26 09:42:32'),
(24, 19, '2026-06-01', 39309.00, 1786.77, 223.35, 10135.00, 211.00, 1413.00, 51068.00, 7870.00, 3534.00, 807.00, 1861.00, 26.00, 840.00, 215.00, 461.00, 39664.00, 'MMK', 'approved', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-07-27 09:42:32', '2026-07-27 09:42:32', NULL, NULL, NULL, NULL, 1, '2026-07-20 09:42:32', NULL),
(25, 21, '2026-06-01', 60301.00, 2740.95, 342.62, 6209.00, 1854.00, 4983.00, 73347.00, 13657.00, 4540.00, 914.00, 1786.00, 374.00, 553.00, 443.00, 157.00, 55150.00, 'MMK', 'approved', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-07-27 09:42:32', '2026-07-27 09:42:32', NULL, NULL, NULL, NULL, 1, '2026-07-22 09:42:32', NULL),
(26, 7, '2026-06-01', 66128.00, 3005.82, 375.73, 12715.00, 2183.00, 3418.00, 84444.00, 10343.00, 6618.00, 301.00, 84.00, 286.00, 180.00, 362.00, 48.00, 67483.00, 'MMK', 'paid', '2026-07-13', 'check', NULL, NULL, 'TXN-BWGCP5IS', NULL, 1, '2026-07-27 09:42:32', '2026-07-27 09:42:32', 1, NULL, NULL, NULL, 1, '2026-07-24 09:42:32', '2026-07-23 09:42:32'),
(27, 18, '2026-06-01', 42090.00, 1913.18, 239.15, 7548.00, 2666.00, 4881.00, 57185.00, 10538.00, 3884.00, 127.00, 109.00, 391.00, 812.00, 376.00, 377.00, 42763.00, 'MMK', 'pending_approval', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-07-27 09:42:32', '2026-07-27 09:42:32', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(28, 20, '2026-06-01', 44924.00, 2042.00, 255.25, 11341.00, 351.00, 3055.00, 59671.00, 6435.00, 4020.00, 45.00, 1101.00, 107.00, 979.00, 149.00, 97.00, 49216.00, 'MMK', 'paid', '2026-07-16', 'check', NULL, NULL, 'TXN-3BI008VH', NULL, 1, '2026-07-27 09:42:32', '2026-07-27 09:42:32', 1, NULL, NULL, NULL, 1, '2026-07-21 09:42:32', '2026-07-27 09:42:32'),
(29, 22, '2026-06-01', 76123.00, 3460.14, 432.52, 11362.00, 342.00, 69.00, 87896.00, 15434.00, 8471.00, 991.00, 1669.00, 469.00, 562.00, 496.00, 82.00, 63991.00, 'MMK', 'pending_approval', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-07-27 09:42:32', '2026-07-27 09:42:32', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(30, 29, '2026-06-01', 74654.00, 3393.36, 424.17, 7309.00, 722.00, 1200.00, 83885.00, 8955.00, 5925.00, 246.00, 1440.00, 24.00, 473.00, 187.00, 5.00, 69005.00, 'MMK', 'paid', '2026-07-25', 'cash', NULL, NULL, 'TXN-W6V8N1BB', NULL, 1, '2026-07-27 09:42:32', '2026-07-27 09:42:32', 1, NULL, NULL, NULL, 1, '2026-07-21 09:42:32', '2026-07-25 09:42:32'),
(31, 10, '2026-06-01', 30298.00, 1377.18, 172.15, 14661.00, 2532.00, 224.00, 47715.00, 9335.00, 4498.00, 302.00, 157.00, 295.00, 229.00, 141.00, 235.00, 33882.00, 'MMK', 'pending_approval', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-07-27 09:42:32', '2026-07-27 09:42:32', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(32, 24, '2026-06-01', 73857.00, 3357.14, 419.64, 8590.00, 105.00, 4493.00, 87045.00, 12274.00, 6601.00, 671.00, 801.00, 293.00, 442.00, 332.00, 243.00, 68170.00, 'MMK', 'paid', '2026-07-13', 'bank_transfer', 'ABC Bank', '6986786602', 'TXN-7XBSABDH', NULL, 1, '2026-07-27 09:42:32', '2026-07-27 09:42:32', 1, NULL, NULL, NULL, 1, '2026-07-26 09:42:32', '2026-07-27 09:42:32'),
(33, 15, '2026-06-01', 40484.00, 1840.18, 230.02, 10229.00, 984.00, 3606.00, 55303.00, 7342.00, 4197.00, 186.00, 354.00, 374.00, 78.00, 129.00, 426.00, 43764.00, 'MMK', 'approved', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-07-27 09:42:32', '2026-07-27 09:42:32', NULL, NULL, NULL, NULL, 1, '2026-07-20 09:42:32', NULL),
(34, 16, '2026-06-01', 49681.00, 2258.23, 282.28, 5232.00, 1849.00, 2714.00, 59476.00, 6767.00, 3786.00, 881.00, 884.00, 377.00, 813.00, 231.00, 284.00, 48923.00, 'MMK', 'pending_approval', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-07-27 09:42:32', '2026-07-27 09:42:32', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(35, 11, '2026-07-01', 55180.00, 2508.18, 313.52, 11839.00, 799.00, 2046.00, 69864.00, 13017.00, 5635.00, 540.00, 1219.00, 208.00, 242.00, 284.00, 216.00, 51212.00, 'MMK', 'draft', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-07-27 09:42:32', '2026-07-27 09:42:32', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(36, 19, '2026-07-01', 34128.00, 1551.27, 193.91, 13286.00, 1766.00, 3030.00, 52210.00, 6530.00, 5085.00, 518.00, 1261.00, 33.00, 155.00, 101.00, 313.00, 40595.00, 'MMK', 'calculated', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-07-27 09:42:32', '2026-07-27 09:42:32', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(37, 7, '2026-07-01', 48298.00, 2195.36, 274.42, 8072.00, 504.00, 2395.00, 59269.00, 6832.00, 4858.00, 862.00, 1910.00, 162.00, 55.00, 325.00, 219.00, 47579.00, 'MMK', 'calculated', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-07-27 09:42:32', '2026-07-27 09:42:32', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(38, 29, '2026-07-01', 64709.00, 2941.32, 367.66, 6693.00, 2620.00, 3952.00, 77974.00, 9513.00, 5694.00, 354.00, 652.00, 300.00, 724.00, 97.00, 255.00, 62767.00, 'MMK', 'draft', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-07-27 09:42:32', '2026-07-27 09:42:32', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(39, 10, '2026-07-01', 36993.00, 1681.50, 210.19, 11932.00, 2757.00, 3626.00, 55308.00, 9016.00, 4128.00, 577.00, 265.00, 195.00, 375.00, 18.00, 64.00, 42164.00, 'MMK', 'draft', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-07-27 09:42:32', '2026-07-27 09:42:32', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(40, 23, '2026-07-01', 52469.00, 2384.95, 298.12, 11672.00, 1610.00, 4493.00, 70244.00, 10233.00, 6010.00, 54.00, 895.00, 305.00, 268.00, 107.00, 107.00, 54001.00, 'MMK', 'calculated', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-07-27 09:42:32', '2026-07-27 09:42:32', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(41, 24, '2026-07-01', 59219.00, 2691.77, 336.47, 5436.00, 1489.00, 1030.00, 67174.00, 8602.00, 6354.00, 347.00, 1320.00, 444.00, 313.00, 163.00, 209.00, 52218.00, 'MMK', 'calculated', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-07-27 09:42:32', '2026-07-27 09:42:32', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(42, 28, '2026-07-01', 68539.00, 3115.41, 389.43, 11022.00, 1795.00, 4068.00, 85424.00, 15339.00, 6966.00, 524.00, 1392.00, 242.00, 781.00, 266.00, 26.00, 63119.00, 'MMK', 'draft', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-07-27 09:42:32', '2026-07-27 09:42:32', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(43, 16, '2026-07-01', 61754.00, 2807.00, 350.88, 12494.00, 1747.00, 3843.00, 79838.00, 15186.00, 6115.00, 449.00, 1517.00, 89.00, 204.00, 274.00, 371.00, 58537.00, 'MMK', 'draft', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-07-27 09:42:32', '2026-07-27 09:42:32', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(44, 26, '2026-07-01', 51665.00, 2348.41, 293.55, 11256.00, 2549.00, 4185.00, 69655.00, 10499.00, 4903.00, 764.00, 1214.00, 30.00, 754.00, 220.00, 361.00, 54253.00, 'MMK', 'pending_approval', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-07-27 09:42:32', '2026-07-27 09:42:32', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(45, 27, '2026-07-01', 48372.00, 2198.73, 274.84, 11722.00, 1080.00, 2816.00, 63990.00, 8212.00, 4317.00, 392.00, 1823.00, 409.00, 540.00, 213.00, 145.00, 51461.00, 'MMK', 'pending_approval', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-07-27 09:42:32', '2026-07-27 09:42:32', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `payroll_items`
--

CREATE TABLE `payroll_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `payroll_id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED NOT NULL,
  `item_type` enum('allowance','deduction','earning','tax','insurance','loan') NOT NULL,
  `category` varchar(50) NOT NULL,
  `description` varchar(255) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `is_percentage` tinyint(1) NOT NULL DEFAULT 0,
  `percentage_value` decimal(5,2) DEFAULT NULL,
  `reference_id` bigint(20) DEFAULT NULL,
  `reference_type` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payroll_settings`
--

CREATE TABLE `payroll_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `payroll_cycle` enum('monthly','bi_weekly','weekly') NOT NULL DEFAULT 'monthly',
  `payroll_day` int(11) NOT NULL DEFAULT 25,
  `pay_day` int(11) NOT NULL DEFAULT 30,
  `tax_regime` varchar(50) NOT NULL DEFAULT 'standard',
  `tax_tables` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tax_tables`)),
  `insurance_employee_rate` decimal(5,2) NOT NULL DEFAULT 0.00,
  `insurance_employer_rate` decimal(5,2) NOT NULL DEFAULT 0.00,
  `overtime_rate_multiplier` decimal(3,2) NOT NULL DEFAULT 1.50,
  `holiday_rate_multiplier` decimal(3,2) NOT NULL DEFAULT 2.00,
  `night_shift_rate_multiplier` decimal(3,2) NOT NULL DEFAULT 1.25,
  `max_loan_percentage` decimal(5,2) NOT NULL DEFAULT 30.00,
  `min_loan_amount` decimal(15,2) NOT NULL DEFAULT 1000.00,
  `default_allowances` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`default_allowances`)),
  `default_deductions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`default_deductions`)),
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `module` varchar(255) NOT NULL DEFAULT 'general',
  `description` text DEFAULT NULL,
  `guard_name` varchar(255) NOT NULL DEFAULT 'api',
  `slug` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `module`, `description`, `guard_name`, `slug`, `created_at`, `updated_at`) VALUES
(1, 'View Employees', 'general', NULL, 'api', 'employee.view', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(2, 'Create Employees', 'general', NULL, 'api', 'employee.create', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(3, 'Update Employees', 'general', NULL, 'api', 'employee.update', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(4, 'Delete Employees', 'general', NULL, 'api', 'employee.delete', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(5, 'View Departments', 'general', NULL, 'api', 'department.view', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(6, 'Create Departments', 'general', NULL, 'api', 'department.create', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(7, 'Update Departments', 'general', NULL, 'api', 'department.update', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(8, 'Delete Departments', 'general', NULL, 'api', 'department.delete', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(9, 'View Positions', 'general', NULL, 'api', 'position.view', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(10, 'Create Positions', 'general', NULL, 'api', 'position.create', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(11, 'Update Positions', 'general', NULL, 'api', 'position.update', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(12, 'Delete Positions', 'general', NULL, 'api', 'position.delete', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(13, 'View Attendance', 'general', NULL, 'api', 'attendance.view', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(14, 'Create Attendance', 'general', NULL, 'api', 'attendance.create', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(15, 'Update Attendance', 'general', NULL, 'api', 'attendance.update', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(16, 'View Leave', 'general', NULL, 'api', 'leave.view', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(17, 'Create Leave', 'general', NULL, 'api', 'leave.create', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(18, 'Approve Leave', 'general', NULL, 'api', 'leave.approve', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(19, 'Reject Leave', 'general', NULL, 'api', 'leave.reject', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(20, 'View Payroll', 'general', NULL, 'api', 'payroll.view', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(21, 'Generate Payroll', 'general', NULL, 'api', 'payroll.generate', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(22, 'View Reports', 'general', NULL, 'api', 'report.view', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(23, 'View Users', 'general', NULL, 'api', 'user.view', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(24, 'Create Users', 'general', NULL, 'api', 'user.create', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(25, 'Update Users', 'general', NULL, 'api', 'user.update', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(26, 'Delete Users', 'general', NULL, 'api', 'user.delete', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(27, 'View Roles', 'general', NULL, 'api', 'role.view', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(28, 'Create Roles', 'general', NULL, 'api', 'role.create', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(29, 'Update Roles', 'general', NULL, 'api', 'role.update', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(30, 'Delete Roles', 'general', NULL, 'api', 'role.delete', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(31, 'Update Settings', 'general', NULL, 'api', 'setting.update', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(32, 'Update Payroll', 'general', NULL, 'api', 'payroll.update', '2026-07-19 23:00:04', '2026-07-19 23:00:04'),
(33, 'Approve Payroll', 'general', NULL, 'api', 'payroll.approve', '2026-07-19 23:00:04', '2026-07-19 23:00:04'),
(34, 'Pay Payroll', 'general', NULL, 'api', 'payroll.pay', '2026-07-19 23:00:04', '2026-07-19 23:00:04'),
(35, 'View Salary', 'general', NULL, 'api', 'salary.view', '2026-07-19 23:00:04', '2026-07-19 23:00:04'),
(36, 'Update Salary', 'general', NULL, 'api', 'salary.update', '2026-07-19 23:00:04', '2026-07-19 23:00:04'),
(38, 'dashboard.view', 'general', NULL, 'api', 'dashboard.view', '2026-07-28 01:39:11', '2026-07-28 01:39:11'),
(40, 'employee.export', 'general', NULL, 'api', 'employee.export', '2026-07-28 01:57:49', '2026-07-28 01:57:49'),
(41, 'attendance.delete', 'general', NULL, 'api', 'attendance.delete', '2026-07-28 01:57:49', '2026-07-28 01:57:49'),
(42, 'attendance.report', 'general', NULL, 'api', 'attendance.report', '2026-07-28 01:57:49', '2026-07-28 01:57:49'),
(43, 'leave.update', 'general', NULL, 'api', 'leave.update', '2026-07-28 01:57:49', '2026-07-28 01:57:49'),
(44, 'leave.delete', 'general', NULL, 'api', 'leave.delete', '2026-07-28 01:57:49', '2026-07-28 01:57:49'),
(45, 'leave.report', 'general', NULL, 'api', 'leave.report', '2026-07-28 01:57:49', '2026-07-28 01:57:49'),
(46, 'payroll.create', 'general', NULL, 'api', 'payroll.create', '2026-07-28 01:57:49', '2026-07-28 01:57:49'),
(47, 'payroll.delete', 'general', NULL, 'api', 'payroll.delete', '2026-07-28 01:57:49', '2026-07-28 01:57:49'),
(48, 'payroll.export', 'general', NULL, 'api', 'payroll.export', '2026-07-28 01:57:49', '2026-07-28 01:57:49'),
(49, 'report.export', 'general', NULL, 'api', 'report.export', '2026-07-28 01:57:49', '2026-07-28 01:57:49'),
(50, 'permission.view', 'general', NULL, 'api', 'permission.view', '2026-07-28 01:57:49', '2026-07-28 01:57:49'),
(51, 'permission.create', 'general', NULL, 'api', 'permission.create', '2026-07-28 01:57:49', '2026-07-28 01:57:49'),
(52, 'permission.update', 'general', NULL, 'api', 'permission.update', '2026-07-28 01:57:49', '2026-07-28 01:57:49'),
(53, 'permission.delete', 'general', NULL, 'api', 'permission.delete', '2026-07-28 01:57:49', '2026-07-28 01:57:49'),
(54, 'profile.view', 'general', NULL, 'api', 'profile.view', '2026-07-28 01:57:49', '2026-07-28 01:57:49'),
(55, 'profile.update', 'general', NULL, 'api', 'profile.update', '2026-07-28 01:57:49', '2026-07-28 01:57:49'),
(56, 'profile.avatar', 'general', NULL, 'api', 'profile.avatar', '2026-07-28 01:57:49', '2026-07-28 01:57:49'),
(57, 'setting.view', 'general', NULL, 'api', 'setting.view', '2026-07-28 01:57:49', '2026-07-28 01:57:49');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 1, 'hrms-pro', '67c1ef125226e94aba8571ffde106acd82669a412b3a69247eeae503e1ef2c38', '[\"*\"]', '2026-07-24 03:55:58', NULL, '2026-07-20 07:38:33', '2026-07-24 03:55:58'),
(2, 'App\\Models\\User', 1, 'hrms-pro', '7b3efe472a96193426d577b347645035ee211258fffff00635e2211b6d293384', '[\"*\"]', '2026-07-20 01:40:38', NULL, '2026-07-19 23:46:19', '2026-07-20 01:40:38'),
(3, 'App\\Models\\User', 1, 'hrms-pro', '652a137d6846922681e6f33b48d17f92c3fe9eb1366b9bfba2f341c5efeb249e', '[\"*\"]', '2026-07-21 00:17:14', NULL, '2026-07-20 20:19:30', '2026-07-21 00:17:14'),
(4, 'App\\Models\\User', 1, 'hrms-pro', '5f33c54cb24edec6607d44373da3e273691fad677888218b7ff87b0a764039ea', '[\"*\"]', '2026-07-21 20:19:04', NULL, '2026-07-21 19:16:03', '2026-07-21 20:19:04'),
(5, 'App\\Models\\User', 3, 'hrms-pro', 'e616360593e36954982f090e42e26976ba7c5e06de61fc6c5fcecbb2a249670a', '[\"*\"]', NULL, NULL, '2026-07-21 19:57:42', '2026-07-21 19:57:42'),
(6, 'App\\Models\\User', 4, 'hrms-pro', '4ede88b427619eef416ecedf31db7f6f88d0307f19672fb904635565d79f3bf1', '[\"*\"]', NULL, NULL, '2026-07-21 19:58:16', '2026-07-21 19:58:16'),
(7, 'App\\Models\\User', 1, 'hrms-pro', '1fda7d3e10d8bf7b79fc9d6f831e4411295084c6d5025b3918e4a03b696e7677', '[\"*\"]', NULL, NULL, '2026-07-21 19:58:28', '2026-07-21 19:58:28'),
(8, 'App\\Models\\User', 5, 'hrms-pro', 'c84958a3d0b2337c6d49b94ffc9c2e8a9f51a2d224fbca272eeae49fa7f72709', '[\"*\"]', NULL, NULL, '2026-07-21 20:14:30', '2026-07-21 20:14:30'),
(9, 'App\\Models\\User', 3, 'hrms-pro', '342da94601ba6028618f4d2f3b9f1a61688b722620bd8b22bd4fa78d861c5d9d', '[\"*\"]', '2026-07-21 20:20:10', NULL, '2026-07-21 20:19:34', '2026-07-21 20:20:10'),
(10, 'App\\Models\\User', 1, 'hrms-pro', '87e3e268d672bad3d71907a9078312754a5f7daa869e816aa86e65b66d393aad', '[\"*\"]', '2026-07-21 20:33:29', NULL, '2026-07-21 20:22:54', '2026-07-21 20:33:29'),
(11, 'App\\Models\\User', 3, 'hrms-pro', '26bee6866cbc9f172ed2c0ea2f2cecba6e58f60546997b2d53305605264af955', '[\"*\"]', '2026-07-21 21:21:02', NULL, '2026-07-21 20:34:20', '2026-07-21 21:21:02'),
(12, 'App\\Models\\User', 3, 'hrms-pro', '55ad1f52292a7733c8d4ef88d0806e7d05fff5182a685cd540740b4bde9a43e4', '[\"*\"]', '2026-07-21 23:56:31', NULL, '2026-07-21 22:00:57', '2026-07-21 23:56:31'),
(13, 'App\\Models\\User', 1, 'hrms-pro', '580c37213e203feb3fe690e5bfd00d70b8aeaef35423e40c564bcb90256a424b', '[\"*\"]', '2026-07-22 00:19:11', NULL, '2026-07-21 23:59:12', '2026-07-22 00:19:11'),
(14, 'App\\Models\\User', 3, 'hrms-pro', '9d64ea11fcb14c1b579bafc8d17fe8261ffae7f898dfb3005e0ee2e8a717ab47', '[\"*\"]', '2026-07-22 00:20:09', NULL, '2026-07-22 00:19:57', '2026-07-22 00:20:09'),
(15, 'App\\Models\\User', 5, 'hrms-pro', '94f89b80f42c2d988d969679d1664680561d0517fef44ef2782a49017bc2d300', '[\"*\"]', '2026-07-22 00:57:23', NULL, '2026-07-22 00:20:25', '2026-07-22 00:57:23'),
(16, 'App\\Models\\User', 1, 'hrms-pro', 'd4e1f2170b85a34b5567a37c99efcc99dd597d9348036ca79068fd977cc238b5', '[\"*\"]', '2026-07-22 00:59:15', NULL, '2026-07-22 00:58:33', '2026-07-22 00:59:15'),
(17, 'App\\Models\\User', 5, 'hrms-pro', '0319ba18f2b8aecdc67938aadb983a80787e8572786da3fb6f9061f00e6a23b6', '[\"*\"]', '2026-07-22 01:16:42', NULL, '2026-07-22 01:00:01', '2026-07-22 01:16:42'),
(18, 'App\\Models\\User', 1, 'hrms-pro', '44f96867b627d09b5cf4de1d977256873baad6bbd753a8c2dacbdbdc4991096d', '[\"*\"]', '2026-07-22 01:28:40', NULL, '2026-07-22 01:17:15', '2026-07-22 01:28:40'),
(19, 'App\\Models\\User', 5, 'hrms-pro', 'e7ab20441104fe41e48265a5605c2ea555be06fb89dcafb5a85f2f0026548733', '[\"*\"]', NULL, NULL, '2026-07-22 01:28:59', '2026-07-22 01:28:59'),
(20, 'App\\Models\\User', 5, 'hrms-pro', '210724f97f3c267811535364cdda3859177044b45b6d055e7fde59a6b5ddeefb', '[\"*\"]', '2026-07-22 01:30:22', NULL, '2026-07-22 01:29:10', '2026-07-22 01:30:22'),
(21, 'App\\Models\\User', 6, 'hrms-pro', '3075bbcda5ad59eba0f2b8ead04e31c417512dd2aaa881a10c1eb945e5841d96', '[\"*\"]', NULL, NULL, '2026-07-22 01:33:23', '2026-07-22 01:33:23'),
(22, 'App\\Models\\User', 1, 'hrms-pro', 'c59f65f8514e6d4e61de25053762ce25d2861c33816a25f7f02e8c53e7f270a0', '[\"*\"]', '2026-07-22 01:38:18', NULL, '2026-07-22 01:34:16', '2026-07-22 01:38:18'),
(23, 'App\\Models\\User', 6, 'hrms-pro', 'ea9dc4cbe1d522010cf5363e6723f5bcfcf8c7df1787f4d13d6dacf2c5f29728', '[\"*\"]', '2026-07-22 01:50:01', NULL, '2026-07-22 01:38:53', '2026-07-22 01:50:01'),
(24, 'App\\Models\\User', 5, 'hrms-pro', '4a053926f3d761d05a98db984e317ca9e2db5513d0dda85f92e8a2c71d05f5b5', '[\"*\"]', '2026-07-22 01:51:49', NULL, '2026-07-22 01:51:16', '2026-07-22 01:51:49'),
(25, 'App\\Models\\User', 3, 'hrms-pro', 'dcfeb46834a066f11ffe1c39ad4b9aeb06c7d33134f5a0c1d964bf90a6778c01', '[\"*\"]', '2026-07-23 01:55:21', NULL, '2026-07-22 01:52:52', '2026-07-23 01:55:21'),
(26, 'App\\Models\\User', 1, 'hrms-pro', 'e7e02e7b6a17690f82d6025c57e74578db11ea15e29814c7649da143c56457f6', '[\"*\"]', NULL, NULL, '2026-07-22 22:46:34', '2026-07-22 22:46:34'),
(28, 'App\\Models\\User', 1, 'hrms-pro', 'fed8ed1f48af1863f17e434a8bb0d7628d2d8916e36eeeb6f3272e65139e4f73', '[\"*\"]', NULL, NULL, '2026-07-23 01:38:58', '2026-07-23 01:38:58'),
(37, 'App\\Models\\User', 1, 'hrms-pro', '98d9470a229b99b5b32f6b9b75b5ebafe159d5d6f08562340dfd1a0e9427d9a4', '[\"*\"]', '2026-07-24 22:31:32', NULL, '2026-07-24 09:59:00', '2026-07-24 22:31:32'),
(38, 'App\\Models\\User', 1, 'hrms-pro', 'b014baa557f1262ea38e9e720e9e9ed780a1305d94065086b02b1122dcd77792', '[\"*\"]', NULL, NULL, '2026-07-25 08:34:02', '2026-07-25 08:34:02'),
(44, 'App\\Models\\User', 5, 'hrms-pro', 'f91214db7dd4ebde37dd074a781aa8b927b5f22899c780f574294ff6fb5de0ea', '[\"*\"]', '2026-07-28 07:50:34', NULL, '2026-07-28 07:47:41', '2026-07-28 07:50:34'),
(45, 'App\\Models\\User', 6, 'hrms-pro', '58d53c1d4844d0ce70235bc06270fa8f612fc1dcc1fd8cd5884636dc4f37c793', '[\"*\"]', NULL, NULL, '2026-07-28 08:15:09', '2026-07-28 08:15:09'),
(46, 'App\\Models\\User', 6, 'hrms-pro', '0c72ad4d86cff9f2093608cb37eac14b1fcb5876eee32a34230dbc7c4e56c2e9', '[\"*\"]', NULL, NULL, '2026-07-28 08:15:11', '2026-07-28 08:15:11'),
(47, 'App\\Models\\User', 6, 'hrms-pro', 'd94cabf6bce0acd40c5739c50f11b4ed092b43861d669497d9f6aec2f954fd2b', '[\"*\"]', NULL, NULL, '2026-07-28 08:15:17', '2026-07-28 08:15:17'),
(48, 'App\\Models\\User', 6, 'hrms-pro', 'b352657783bff4a7375948985360293f411f2df1d7681385264c51391899646b', '[\"*\"]', NULL, NULL, '2026-07-28 08:18:00', '2026-07-28 08:18:00'),
(49, 'App\\Models\\User', 6, 'hrms-pro', 'e2e9eb5299e6d53684f67d482b22b49a9f3feafa767540dcda3bdfd954362260', '[\"*\"]', NULL, NULL, '2026-07-28 08:18:05', '2026-07-28 08:18:05'),
(50, 'App\\Models\\User', 6, 'hrms-pro', 'e176eb8cb870cabfef385d30e0dbbbc853edc8933fe76519f321f246029d4abc', '[\"*\"]', NULL, NULL, '2026-07-28 08:18:06', '2026-07-28 08:18:06'),
(51, 'App\\Models\\User', 6, 'hrms-pro', '0093e9202b23c6d1f0e192ea1cacf2bc4b2a171a780c42a5a578aa0995a67573', '[\"*\"]', NULL, NULL, '2026-07-28 08:18:20', '2026-07-28 08:18:20'),
(52, 'App\\Models\\User', 1, 'hrms-pro', '1a5d8d3d2ff2e819ebecaf7d69e03d9307606542cf936180b09b0de5ef1a870c', '[\"*\"]', NULL, NULL, '2026-07-28 08:18:46', '2026-07-28 08:18:46'),
(53, 'App\\Models\\User', 1, 'hrms-pro', '1a0fee9745bab2bbd8eed255d99250ab603e095e7d412c1061b0df6cd76dc0fe', '[\"*\"]', NULL, NULL, '2026-07-28 08:18:48', '2026-07-28 08:18:48'),
(54, 'App\\Models\\User', 1, 'hrms-pro', 'b54e307bb86eb2bc2bbdc9d6df3c18379f48995b530ce07337f8f25b47e8f5f5', '[\"*\"]', NULL, NULL, '2026-07-28 08:18:54', '2026-07-28 08:18:54'),
(56, 'App\\Models\\User', 1, 'hrms-pro', 'a7b0bfdd15c7336cf1715f1177ec64e6090adb3aa34d514df7596c6d3c41ad63', '[\"*\"]', NULL, NULL, '2026-07-28 08:25:34', '2026-07-28 08:25:34'),
(58, 'App\\Models\\User', 6, 'hrms-pro', 'd2dca0776805b83d6fec241d722b3163e3d33746ac77f2cc4280cd5b9ea959fb', '[\"*\"]', NULL, NULL, '2026-07-28 08:26:18', '2026-07-28 08:26:18'),
(60, 'App\\Models\\User', 3, 'hrms-pro', 'e53d6f0dfc80b2056124535add52d33f246f1e0783c3950ddabf4fddf96de575', '[\"*\"]', NULL, NULL, '2026-07-28 09:05:05', '2026-07-28 09:05:05'),
(62, 'App\\Models\\User', 6, 'hrms-pro', 'e0304db49744f3f6eeadef8ea69effefa6228311024b33abe52d4a118f75abc2', '[\"*\"]', NULL, NULL, '2026-07-28 09:05:57', '2026-07-28 09:05:57'),
(64, 'App\\Models\\User', 3, 'hrms-pro', '9a31871adee155318cf99ea28393918635878c9534a2be75ce992eb896f2e1d2', '[\"*\"]', NULL, NULL, '2026-07-28 09:06:20', '2026-07-28 09:06:20'),
(66, 'App\\Models\\User', 6, 'hrms-pro', '0d1ab105f1a006c7b28b6675523e2c7ff1d4e04c2e9efc5d178c438a3f7f16d7', '[\"*\"]', NULL, NULL, '2026-07-29 02:03:55', '2026-07-29 02:03:55'),
(68, 'App\\Models\\User', 6, 'hrms-pro', '5909ae5a24ef794e6c10b43994f79bbaf62f845eb96c974568ce0856715ab8a3', '[\"*\"]', NULL, NULL, '2026-07-29 02:04:16', '2026-07-29 02:04:16'),
(70, 'App\\Models\\User', 23, 'hrms-pro', 'a64c268c710d6cdaccc605acc8ea5fc8bd8158a7c1ae8e6e50f866c4f133acda', '[\"*\"]', NULL, NULL, '2026-07-29 02:05:33', '2026-07-29 02:05:33'),
(72, 'App\\Models\\User', 23, 'hrms-pro', '400539de7cea48c94ed1067452f390fd3a9bd1f1490e0b4388e4836b686ad2bd', '[\"*\"]', NULL, NULL, '2026-07-29 02:17:25', '2026-07-29 02:17:25'),
(74, 'App\\Models\\User', 7, 'hrms-pro', '6862a00471e388cdaf9426f580f4d0d655b1f8d7f8af69c3750428716a773d38', '[\"*\"]', NULL, NULL, '2026-07-29 02:23:27', '2026-07-29 02:23:27'),
(76, 'App\\Models\\User', 7, 'hrms-pro', 'efeefa0341fcf62e5db918e73ec2a7bf0da755972a344f27adbc1b54279879f7', '[\"*\"]', NULL, NULL, '2026-07-29 04:11:20', '2026-07-29 04:11:20'),
(78, 'App\\Models\\User', 23, 'hrms-pro', 'f0772652559436dd8e33c09a239eda8de2d19f00290e54675e74e197c3331ae2', '[\"*\"]', NULL, NULL, '2026-07-29 04:11:39', '2026-07-29 04:11:39'),
(80, 'App\\Models\\User', 1, 'hrms-pro', '1c460857961ac7635866aa00c5d0e6d5b7de37976ef05b0358547fbbb69ca4ad', '[\"*\"]', NULL, NULL, '2026-07-29 04:11:53', '2026-07-29 04:11:53'),
(82, 'App\\Models\\User', 7, 'hrms-pro', '384e5e6eff1c7f1a08a29ff34f76d22d47dbc844025e4d853920de2bc90bf74d', '[\"*\"]', NULL, NULL, '2026-07-29 04:19:28', '2026-07-29 04:19:28'),
(84, 'App\\Models\\User', 23, 'hrms-pro', 'c092ded0115514924538f3eb9755c7afff24f710b5edccdb20c9a5b17e771a2c', '[\"*\"]', NULL, NULL, '2026-07-29 04:19:45', '2026-07-29 04:19:45'),
(86, 'App\\Models\\User', 1, 'hrms-pro', 'f6250899cbb37f9132c5b013e7b6d2eb5d84a48a2128e20ffeeb860d49b07dba', '[\"*\"]', NULL, NULL, '2026-07-29 04:19:56', '2026-07-29 04:19:56'),
(88, 'App\\Models\\User', 7, 'hrms-pro', '52baa53cdbb7ae8824bb1308faaf2683e23bda31577a1ae84586f193536fb7ce', '[\"*\"]', NULL, NULL, '2026-07-29 04:20:09', '2026-07-29 04:20:09'),
(90, 'App\\Models\\User', 1, 'hrms-pro', '337471d8451df6021270279ffb00dd2bdbda98bd66f75ada7a0a37e4b724c172', '[\"*\"]', NULL, NULL, '2026-07-29 04:36:08', '2026-07-29 04:36:08'),
(92, 'App\\Models\\User', 7, 'hrms-pro', '5c9c9ade4f789a45a84eeb4c268e731b8680682971e18d002e54d94743627fc1', '[\"*\"]', NULL, NULL, '2026-07-29 04:36:47', '2026-07-29 04:36:47'),
(94, 'App\\Models\\User', 7, 'hrms-pro', 'a1b195d00992ff1fe9508954b185d4412204f0209447cd67598fecf2e7c49726', '[\"*\"]', NULL, NULL, '2026-07-29 04:59:01', '2026-07-29 04:59:01'),
(96, 'App\\Models\\User', 7, 'test-token', '12cb24cc34d924accce67ff4b12eabe0869e5e9fdc0aa071976846236fd44923', '[\"*\"]', NULL, NULL, '2026-07-29 05:01:24', '2026-07-29 05:01:24'),
(97, 'App\\Models\\User', 7, 'test-token', '00dd825abeb792793216783caa8d8de27fbc3a7415fcd878599ad052fb2a8e26', '[\"*\"]', '2026-07-29 05:02:08', NULL, '2026-07-29 05:02:07', '2026-07-29 05:02:08'),
(98, 'App\\Models\\User', 7, 'test-token', 'eff2847939916b5042bbfb3d01efbaf96821a621583eb478e6571f6e8d2cd941', '[\"*\"]', '2026-07-29 05:05:56', NULL, '2026-07-29 05:05:55', '2026-07-29 05:05:56'),
(99, 'App\\Models\\User', 7, 'test-token', '73c4102a6431f4e6d7630f9b441f7341c8a2301010533d63760ff65c02e8ec19', '[\"*\"]', '2026-07-29 05:07:50', NULL, '2026-07-29 05:07:49', '2026-07-29 05:07:50'),
(100, 'App\\Models\\User', 7, 'test-token', 'c37d67c26061ab507329296fb8dbd6fdb721bfc22a9c7cdcb823bab17fab50d7', '[\"*\"]', '2026-07-29 05:09:54', NULL, '2026-07-29 05:09:54', '2026-07-29 05:09:54'),
(101, 'App\\Models\\User', 23, 'hrms-pro', '704feb3aa78fe9211e9ee360937ead026e16176dff23852939b03cf287cb2eeb', '[\"*\"]', NULL, NULL, '2026-07-29 07:54:15', '2026-07-29 07:54:15'),
(103, 'App\\Models\\User', 1, 'hrms-pro', '056048bce832516632363958ac788a9943db0ce8b5988e23ba02cec1c5bd7b45', '[\"*\"]', NULL, NULL, '2026-07-29 07:54:55', '2026-07-29 07:54:55'),
(104, 'App\\Models\\User', 1, 'hrms-pro', '642a68d97f79760d8ddd0de75cf19f5ed94b9eacd08a2ffde12b7f415ad9ea1e', '[\"*\"]', '2026-07-29 07:55:23', NULL, '2026-07-29 07:54:59', '2026-07-29 07:55:23'),
(105, 'App\\Models\\User', 1, 'hrms-pro', 'b106951ed2930d2aa93daba893fa442966ffe41422f2f9297044fb2948b4c230', '[\"*\"]', NULL, NULL, '2026-07-29 19:24:14', '2026-07-29 19:24:14'),
(107, 'App\\Models\\User', 7, 'hrms-pro', 'b7f95af44aa2b21d24e473b82d4c59e1d94207888d70d4bc9152bd7409a74463', '[\"*\"]', NULL, NULL, '2026-07-29 19:28:44', '2026-07-29 19:28:44'),
(109, 'App\\Models\\User', 1, 'hrms-pro', '036f89fa60ae1d6d891f4e94debc42411bfeeb08fd8128b13609d5bc14e2bff5', '[\"*\"]', NULL, NULL, '2026-07-29 19:29:04', '2026-07-29 19:29:04'),
(118, 'App\\Models\\User', 7, 'hrms-pro', '2ecd6f8b9b08641083580eb0c866e584872464d17ac4f63469de4e1cff91224c', '[\"*\"]', '2026-07-29 20:07:03', NULL, '2026-07-29 20:06:57', '2026-07-29 20:07:03'),
(119, 'App\\Models\\User', 1, 'hrms-pro', '5ae5684cbb4862cbba6220e5980b8530dabe2bd6a8df2f3a5ca415dc73cd00a5', '[\"*\"]', '2026-07-29 20:07:26', NULL, '2026-07-29 20:07:07', '2026-07-29 20:07:26'),
(120, 'App\\Models\\User', 1, 'hrms-pro', 'bfecf8ab951aa9aeeafbb0a959aeb22d3e51b696b6ffd9e1def6227e1daeb837', '[\"*\"]', '2026-07-29 20:18:25', NULL, '2026-07-29 20:07:29', '2026-07-29 20:18:25'),
(121, 'App\\Models\\User', 7, 'hrms-pro', 'd3c623ed2b9b4dace080f6c7072553a4d4edd0c501ba46e64725511ec95310d7', '[\"*\"]', NULL, NULL, '2026-07-29 20:28:33', '2026-07-29 20:28:33'),
(122, 'App\\Models\\User', 1, 'hrms-pro', '81a7c0de44f8974a51f4cde70651a713d501dbc088e1e070d9f1fa9333cfa44d', '[\"*\"]', NULL, NULL, '2026-07-29 20:28:41', '2026-07-29 20:28:41'),
(123, 'App\\Models\\User', 7, 'hrms-pro', '765e7c78705559f4010f9ef4a222aa6552746d4649dbd546b816128ab5415f11', '[\"*\"]', NULL, NULL, '2026-07-29 20:28:55', '2026-07-29 20:28:55'),
(124, 'App\\Models\\User', 23, 'hrms-pro', '24467500d34fcf05c64402fa6369e84e6de476564e4e070c3281bc4c895b4a9e', '[\"*\"]', NULL, NULL, '2026-07-29 20:28:57', '2026-07-29 20:28:57'),
(125, 'App\\Models\\User', 23, 'hrms-pro', 'aaa11c0bd1e0d07d01cd09a2f175a0b636d1c05b2f4f17df85ca82425991970e', '[\"*\"]', '2026-07-29 20:37:35', NULL, '2026-07-29 20:37:11', '2026-07-29 20:37:35'),
(126, 'App\\Models\\User', 7, 'hrms-pro', '6519b2ba12e6d5842b8debc3f2f21e8492564a305a9c6011c357d6f1ac06e476', '[\"*\"]', '2026-07-29 20:40:14', NULL, '2026-07-29 20:37:36', '2026-07-29 20:40:14'),
(127, 'App\\Models\\User', 7, 'hrms-pro', '9795ff0d22e5be351c67871d9574ccf5c2b2f16181e386d5e972780bc21f95c4', '[\"*\"]', '2026-07-29 20:41:11', NULL, '2026-07-29 20:41:06', '2026-07-29 20:41:11'),
(128, 'App\\Models\\User', 23, 'hrms-pro', '5252df27eb867e8fa0a3da35b02b4f3eb27d92dc862d59304bf3a10e34d8b374', '[\"*\"]', '2026-07-29 20:44:33', NULL, '2026-07-29 20:44:23', '2026-07-29 20:44:33'),
(129, 'App\\Models\\User', 1, 'hrms-pro', '093a6e053faf9aeae0a63d6a5eab95834cc4208df6f07eb1cd1724375178cabc', '[\"*\"]', '2026-07-29 20:45:00', NULL, '2026-07-29 20:44:50', '2026-07-29 20:45:00'),
(130, 'App\\Models\\User', 7, 'hrms-pro', '4c4e89e3437cbfe9a00cc6134f99ec97393de39900b0c7697f7ecdb25b2c9612', '[\"*\"]', '2026-07-29 20:45:31', NULL, '2026-07-29 20:45:12', '2026-07-29 20:45:31'),
(131, 'App\\Models\\User', 1, 'hrms-pro', 'ba3483ade9e88de9016ded67e39b837439eba0eb62959523797e3d51002d2885', '[\"*\"]', '2026-07-29 21:30:34', NULL, '2026-07-29 20:45:34', '2026-07-29 21:30:34'),
(132, 'App\\Models\\User', 23, 'hrms-pro', '445d6a3f5358d77b9d4651437877ec353a63ee45c1f48d0e6ec061dcad6fafbf', '[\"*\"]', '2026-07-29 21:33:59', NULL, '2026-07-29 21:33:51', '2026-07-29 21:33:59'),
(133, 'App\\Models\\User', 7, 'hrms-pro', 'faf31e3e3abb44c8ab20ef6d952aeb06eb21870c0ddc631402e636c499a0b340', '[\"*\"]', '2026-07-29 21:40:06', NULL, '2026-07-29 21:34:00', '2026-07-29 21:40:06'),
(134, 'App\\Models\\User', 1, 'hrms-pro', 'dc1f584bdd8735efbc138763d651e542fff125cc274b9760ebd57baf8b7fc012', '[\"*\"]', '2026-07-29 21:41:56', NULL, '2026-07-29 21:40:09', '2026-07-29 21:41:56'),
(135, 'App\\Models\\User', 7, 'hrms-pro', '7b4d858649f6a1cf9c2b1fcaaf1e642fee9db5291bb43d47270faff45a2c8e23', '[\"*\"]', '2026-07-29 21:55:16', NULL, '2026-07-29 21:41:57', '2026-07-29 21:55:16'),
(136, 'App\\Models\\User', 1, 'hrms-pro', '751f819ba2bfb75de354ee7f22ee07a757fc1bab5e7beacaed37e26de0240d05', '[\"*\"]', '2026-07-31 03:38:09', NULL, '2026-07-30 00:43:46', '2026-07-31 03:38:09');

-- --------------------------------------------------------

--
-- Table structure for table `positions`
--

CREATE TABLE `positions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `code` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `min_salary` decimal(15,2) DEFAULT NULL,
  `max_salary` decimal(15,2) DEFAULT NULL,
  `department_id` bigint(20) UNSIGNED DEFAULT NULL,
  `salary_range` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `positions`
--

INSERT INTO `positions` (`id`, `title`, `code`, `description`, `min_salary`, `max_salary`, `department_id`, `salary_range`, `status`, `created_at`, `updated_at`) VALUES
(1, 'HR Assistant', NULL, 'Staff recruitment, employee relations, and HR policies implementation. Assists with onboarding, maintaining employee records, and supporting HR operations.', 400000.00, 600000.00, 1, '400,000 - 600,000 MMK', 'active', NULL, '2026-07-25 10:19:56'),
(2, 'Sales & Marketing Assistant', NULL, 'Supports the manager with client outreach, prepares marketing materials, manages social media, and assists with sales campaigns and lead generation.', 600000.00, 900000.00, 2, '600,000 - 900,000 MMK', 'active', NULL, '2026-07-25 10:19:56'),
(3, 'Sales & Marketing Manager', NULL, 'Handles client acquisition, branding campaigns, and team coordination. Develops marketing strategies and leads sales initiatives to achieve revenue targets.', 1500000.00, 2000000.00, 2, '1,500,000 - 2,000,000 MMK', 'active', NULL, '2026-07-25 10:19:56'),
(4, 'Software Engineer', NULL, 'Develops and maintains software applications and systems. Writes clean code, debugs issues, and collaborates with cross-functional teams on technical projects.', 100000.00, 1500000.00, 3, '100,000 - 1,500,000 MMK', 'active', NULL, '2026-07-25 10:19:56'),
(6, 'HR Officer', NULL, 'Manages recruitment processes, employee engagement initiatives, and HR compliance.', 600000.00, 900000.00, 1, '600,000 - 900,000 MMK', 'active', '2026-07-24 09:32:59', '2026-07-25 10:19:56'),
(7, 'Recruitment Specialist', NULL, 'Manages end-to-end recruitment process, talent acquisition strategies, and employer branding. Conducts interviews and coordinates with hiring managers.', 700000.00, 1000000.00, 1, '700,000 - 1,000,000 MMK', 'active', '2026-07-24 09:32:59', '2026-07-25 10:19:56'),
(8, 'HR Manager', NULL, 'Leads HR operations, develops HR strategies, manages employee relations, and ensures compliance with labor laws. Oversees recruitment and talent management.', 1200000.00, 1800000.00, 1, '1,200,000 - 1,800,000 MMK', 'active', '2026-07-24 09:32:59', '2026-07-25 10:19:56'),
(9, 'Marketing Specialist', NULL, 'Develops and executes marketing campaigns, manages digital marketing channels.', 800000.00, 1200000.00, 2, '800,000 - 1,200,000 MMK', 'active', '2026-07-24 09:32:59', '2026-07-25 10:19:56'),
(10, 'Sales Representative', NULL, 'Builds client relationships, generates leads, conducts product presentations, and closes sales deals to meet revenue goals.', 500000.00, 800000.00, 2, '500,000 - 800,000 MMK', 'active', '2026-07-24 09:32:59', '2026-07-25 10:19:56'),
(11, 'Digital Marketing Executive', NULL, 'Manages online advertising campaigns, SEO strategies, social media marketing, and email marketing to drive brand awareness and lead generation.', 700000.00, 1100000.00, 2, '700,000 - 1,100,000 MMK', 'active', '2026-07-24 09:32:59', '2026-07-25 10:19:56'),
(12, 'Senior Software Engineer', NULL, 'Leads software development projects, mentors junior developers, architects scalable solutions, and ensures code quality and best practices.', 1500000.00, 2500000.00, 3, '1,500,000 - 2,500,000 MMK', 'active', '2026-07-24 09:32:59', '2026-07-25 10:19:56'),
(13, 'Frontend Developer', NULL, 'Builds responsive web applications, implements UI/UX designs, ensures cross-browser compatibility, and optimizes frontend performance.', 800000.00, 1500000.00, 3, '800,000 - 1,500,000 MMK', 'active', '2026-07-24 09:32:59', '2026-07-25 10:19:56'),
(14, 'Backend Developer', NULL, 'Develops server-side logic, builds APIs, manages databases, and ensures high-performance and responsiveness of web applications.', 900000.00, 1600000.00, 3, '900,000 - 1,600,000 MMK', 'active', '2026-07-24 09:32:59', '2026-07-25 10:19:56'),
(15, 'DevOps Engineer', NULL, 'Manages infrastructure, CI/CD pipelines, cloud services, and deployment processes. Ensures system reliability and scalability.', 1200000.00, 2000000.00, 3, '1,200,000 - 2,000,000 MMK', 'active', '2026-07-24 09:32:59', '2026-07-25 10:19:56'),
(16, 'QA Engineer', NULL, 'Designs and executes test plans, identifies bugs, automates testing processes, and ensures software quality before deployment.', 700000.00, 1200000.00, 3, '700,000 - 1,200,000 MMK', 'active', '2026-07-24 09:32:59', '2026-07-25 10:19:56'),
(17, 'Engineering Manager', NULL, 'Leads engineering teams, manages projects, oversees technical decisions, and ensures timely delivery of software solutions.', 2000000.00, 3000000.00, 3, '2,000,000 - 3,000,000 MMK', 'active', '2026-07-24 09:32:59', '2026-07-25 10:19:56'),
(20, 'Sales Manager', 'SAL_MGR', 'Manage sales team and operations', 1500000.00, 3000000.00, 25, '1.5M - 3M MMK', 'active', '2026-07-28 09:13:20', '2026-07-28 09:13:20');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `display_name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `guard_name` varchar(255) NOT NULL DEFAULT 'api',
  `slug` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `display_name`, `description`, `guard_name`, `slug`, `created_at`, `updated_at`) VALUES
(1, 'Super Admin', 'Super Administrator', 'Full system access with all permissions. Can manage users, roles, settings, and all modules.', 'api', 'super-admin', '2026-07-19 22:27:29', '2026-07-28 01:56:58'),
(2, 'HR Manager', 'HR Manager', 'Human Resources Manager with access to employee management, attendance tracking, leave approval, payroll processing, and HR reports.', 'api', 'hr-manager', '2026-07-19 22:27:29', '2026-07-28 01:56:58'),
(3, 'Department Manager', 'Department Manager', 'Department manager with team management capabilities. Can view team members, approve leave, view attendance, and generate team reports.', 'api', 'dept-manager', '2026-07-19 22:27:29', '2026-07-28 01:56:58'),
(4, 'Employee', 'Employee', 'Standard employee access with self-service capabilities. Can view own profile, apply for leave, check in/out, and view personal attendance records.', 'api', 'employee', '2026-07-19 22:27:29', '2026-07-28 01:55:42'),
(6, 'Chief Executive Officer', 'Chief Executive Officer', 'Executive leadership with full oversight of all operations. Can view all reports and strategic data.', 'api', 'ceo', '2026-07-24 09:25:36', '2026-07-28 01:56:58'),
(7, 'Chief Technology Officer', 'Chief Technology Officer', 'Executive technology leadership. Can manage IT strategy, technology stack, and engineering teams.', 'api', 'cto', '2026-07-24 09:25:36', '2026-07-28 01:56:58'),
(8, 'Chief Financial Officer', 'Chief Financial Officer', 'Executive financial leadership. Can manage financial operations, budgets, and payroll approvals.', 'api', 'cfo', '2026-07-24 09:25:36', '2026-07-28 01:56:58'),
(9, 'Chief Operating Officer', 'Chief Operating Officer', 'Executive operations leadership. Can manage daily operations, processes, and cross-departmental coordination.', 'api', 'coo', '2026-07-24 09:25:36', '2026-07-28 01:56:58'),
(10, 'HR Director', 'HR Director', 'HR leadership with strategic oversight. Can manage HR policies, employee relations, and organizational development.', 'api', 'hr-director', '2026-07-24 09:25:36', '2026-07-28 01:56:58'),
(11, 'HR Business Partner', 'HR Business Partner', 'Strategic HR partner supporting business units. Can advise on workforce planning and talent management.', 'api', 'hr-business-partner', '2026-07-24 09:25:36', '2026-07-28 01:56:58'),
(12, 'Recruitment Manager', 'Recruitment Manager', 'Manages recruitment processes, talent acquisition, and hiring strategies.', 'api', 'recruitment-manager', '2026-07-24 09:25:36', '2026-07-28 01:56:58'),
(13, 'Training & Development Manager', 'Training & Development Manager', 'Manages employee training programs, development plans, and learning initiatives.', 'api', 'training-manager', '2026-07-24 09:25:36', '2026-07-28 01:56:58'),
(14, 'Compensation & Benefits Manager', 'Compensation & Benefits Manager', 'Manages compensation structures, benefits programs, and salary reviews.', 'api', 'compensation-manager', '2026-07-24 09:25:36', '2026-07-28 01:56:58'),
(15, 'HR Operations Manager', 'HR Operations Manager', 'Manages HR operations, processes, and employee lifecycle management.', 'api', 'hr-operations-manager', '2026-07-24 09:25:36', '2026-07-28 01:56:58'),
(16, 'Engineering Manager', 'Engineering Manager', 'Leads engineering teams, manages technical projects, and ensures code quality.', 'api', 'engineering-manager', '2026-07-24 09:25:36', '2026-07-28 01:56:58'),
(17, 'Software Development Manager', 'Software Development Manager', 'Manages software development teams, agile processes, and delivery schedules.', 'api', 'dev-manager', '2026-07-24 09:25:36', '2026-07-28 01:56:58'),
(18, 'QA Manager', 'QA Manager', 'Manages quality assurance processes, testing strategies, and quality standards.', 'api', 'qa-manager', '2026-07-24 09:25:36', '2026-07-28 01:56:58'),
(19, 'DevOps Manager', 'DevOps Manager', 'Manages DevOps practices, CI/CD pipelines, and infrastructure automation.', 'api', 'devops-manager', '2026-07-24 09:25:36', '2026-07-28 01:56:58'),
(20, 'Product Manager', 'Product Manager', 'Manages product strategy, roadmap, and feature development.', 'api', 'product-manager', '2026-07-24 09:25:36', '2026-07-28 01:56:58'),
(21, 'Project Manager', 'Project Manager', 'Manages projects, timelines, resources, and stakeholder communication.', 'api', 'project-manager', '2026-07-24 09:25:36', '2026-07-28 01:56:58'),
(22, 'Marketing Manager', 'Marketing Manager', 'Manages marketing campaigns, brand strategy, and market positioning.', 'api', 'marketing-manager', '2026-07-24 09:25:36', '2026-07-28 01:56:58'),
(23, 'Sales Manager', 'Sales Manager', 'Manages sales teams, revenue targets, and client relationships.', 'api', 'sales-manager', '2026-07-24 09:25:36', '2026-07-28 01:56:58'),
(24, 'Finance Manager', 'Finance Manager', 'Manages financial operations, budgeting, reporting, and compliance.', 'api', 'finance-manager', '2026-07-24 09:25:36', '2026-07-28 01:56:58'),
(25, 'Operations Manager', 'Operations Manager', 'Manages daily operations, processes, and operational efficiency.', 'api', 'operations-manager', '2026-07-24 09:25:36', '2026-07-28 01:56:58'),
(26, 'IT Manager', 'IT Manager', 'Manages IT infrastructure, systems, and technology support.', 'api', 'it-manager', '2026-07-24 09:25:36', '2026-07-28 01:56:58'),
(27, 'Customer Service Manager', 'Customer Service Manager', 'Manages customer service teams, support processes, and client satisfaction.', 'api', 'cs-manager', '2026-07-24 09:25:36', '2026-07-28 01:56:58'),
(28, 'Senior Software Engineer', 'Senior Software Engineer', 'Leads technical development, mentors junior engineers, and contributes to architecture.', 'api', 'senior-software-engineer', '2026-07-24 09:25:36', '2026-07-28 01:56:58'),
(29, 'Software Engineer', 'Software Engineer', 'Develops software solutions, writes code, and collaborates with team members.', 'api', 'software-engineer', '2026-07-24 09:25:36', '2026-07-28 01:56:59'),
(30, 'Junior Software Engineer', 'Junior Software Engineer', 'Entry-level software development, learning and contributing to codebase.', 'api', 'junior-software-engineer', '2026-07-24 09:25:36', '2026-07-28 01:56:59'),
(31, 'Frontend Developer', 'Frontend Developer', 'Develops user interfaces and frontend applications using modern frameworks.', 'api', 'frontend-developer', '2026-07-24 09:25:36', '2026-07-28 01:56:59'),
(32, 'Backend Developer', 'Backend Developer', 'Develops server-side applications, APIs, and database solutions.', 'api', 'backend-developer', '2026-07-24 09:25:36', '2026-07-28 01:56:59'),
(33, 'Full Stack Developer', 'Full Stack Developer', 'Develops both frontend and backend components of applications.', 'api', 'fullstack-developer', '2026-07-24 09:25:36', '2026-07-28 01:56:59'),
(34, 'DevOps Engineer', 'DevOps Engineer', 'Manages infrastructure, CI/CD pipelines, and cloud deployments.', 'api', 'devops-engineer', '2026-07-24 09:25:36', '2026-07-28 01:56:59'),
(35, 'QA Engineer', 'QA Engineer', 'Ensures software quality through testing, automation, and quality processes.', 'api', 'qa-engineer', '2026-07-24 09:25:36', '2026-07-28 01:56:59'),
(36, 'Data Analyst', 'Data Analyst', 'Analyzes data, creates reports, and provides insights for decision-making.', 'api', 'data-analyst', '2026-07-24 09:25:36', '2026-07-28 01:56:59'),
(37, 'Data Scientist', 'Data Scientist', 'Develops machine learning models, performs advanced analytics, and provides data-driven solutions.', 'api', 'data-scientist', '2026-07-24 09:25:36', '2026-07-28 01:56:59'),
(38, 'Business Analyst', 'Business Analyst', 'Analyzes business requirements, processes, and recommends solutions.', 'api', 'business-analyst', '2026-07-24 09:25:36', '2026-07-28 01:56:59'),
(39, 'UX/UI Designer', 'UX/UI Designer', 'Designs user experiences and interfaces for applications and websites.', 'api', 'ux-designer', '2026-07-24 09:25:36', '2026-07-28 01:56:59'),
(40, 'Graphic Designer', 'Graphic Designer', 'Creates visual designs, graphics, and branding materials.', 'api', 'graphic-designer', '2026-07-24 09:25:36', '2026-07-28 01:56:59'),
(41, 'Marketing Specialist', 'Marketing Specialist', 'Executes marketing campaigns, content creation, and market research.', 'api', 'marketing-specialist', '2026-07-24 09:25:36', '2026-07-28 01:56:59'),
(42, 'SEO Specialist', 'SEO Specialist', 'Optimizes content for search engines and manages SEO strategies.', 'api', 'seo-specialist', '2026-07-24 09:25:36', '2026-07-28 01:56:59'),
(43, 'Content Writer', 'Content Writer', 'Creates content for websites, blogs, and marketing materials.', 'api', 'content-writer', '2026-07-24 09:25:36', '2026-07-28 01:56:59'),
(44, 'Sales Representative', 'Sales Representative', 'Sells products/services, manages client relationships, and achieves sales targets.', 'api', 'sales-representative', '2026-07-24 09:25:36', '2026-07-28 01:56:59'),
(45, 'Account Manager', 'Account Manager', 'Manages client accounts, builds relationships, and ensures customer satisfaction.', 'api', 'account-manager', '2026-07-24 09:25:36', '2026-07-28 01:56:59'),
(46, 'Customer Support', 'Customer Support', 'Provides customer support, resolves issues, and ensures satisfaction.', 'api', 'customer-support', '2026-07-24 09:25:36', '2026-07-28 01:56:59'),
(47, 'Finance Officer', 'Finance Officer', 'Manages financial transactions, records, and compliance.', 'api', 'finance-officer', '2026-07-24 09:25:36', '2026-07-28 01:56:59'),
(48, 'Accountant', 'Accountant', 'Manages financial records, statements, and accounting processes.', 'api', 'accountant', '2026-07-24 09:25:36', '2026-07-28 01:56:59'),
(49, 'HR Officer', 'HR Officer', 'Supports HR operations, employee records, and HR processes.', 'api', 'hr-officer', '2026-07-24 09:25:36', '2026-07-28 01:56:59'),
(50, 'Recruitment Officer', 'Recruitment Officer', 'Supports recruitment processes, candidate screening, and hiring.', 'api', 'recruitment-officer', '2026-07-24 09:25:36', '2026-07-28 01:56:59'),
(51, 'Office Administrator', 'Office Administrator', 'Manages office operations, supplies, and administrative support.', 'api', 'office-administrator', '2026-07-24 09:25:36', '2026-07-28 01:56:59'),
(52, 'Receptionist', 'Receptionist', 'Welcomes visitors, manages calls, and provides front desk support.', 'api', 'receptionist', '2026-07-24 09:25:36', '2026-07-28 01:56:59'),
(53, 'Intern', 'Intern', 'Entry-level learning position, gaining experience in the field.', 'api', 'intern', '2026-07-24 09:25:36', '2026-07-28 01:56:59'),
(54, 'Super Administrator', 'Super Administrator', 'Full system access with all permissions. Can manage users, roles, settings, and all modules.', 'api', 'super_admin', '2026-07-28 01:49:42', '2026-07-28 01:56:59'),
(55, 'Administrator', 'Administrator', 'Administrative access with full control over HR operations. Can manage employees, attendance, leave, payroll, and reports.', 'api', 'admin', '2026-07-28 01:49:42', '2026-07-28 01:56:59'),
(56, 'HR Manager', 'HR Manager', 'Human Resources Manager with access to employee management, attendance, leave approval, and payroll.', 'api', 'hr_manager', '2026-07-28 01:49:42', '2026-07-28 01:56:59'),
(57, 'Department Manager', 'Department Manager', 'Department manager with team management capabilities. Can view team members, approve leave, and view attendance.', 'api', 'department_manager', '2026-07-28 01:49:42', '2026-07-28 01:56:59');

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_permissions`
--

INSERT INTO `role_permissions` (`id`, `role_id`, `permission_id`, `created_at`, `updated_at`) VALUES
(1, 1, 1, NULL, NULL),
(2, 1, 2, NULL, NULL),
(3, 1, 3, NULL, NULL),
(4, 1, 4, NULL, NULL),
(5, 1, 5, NULL, NULL),
(6, 1, 6, NULL, NULL),
(7, 1, 7, NULL, NULL),
(8, 1, 8, NULL, NULL),
(9, 1, 9, NULL, NULL),
(10, 1, 10, NULL, NULL),
(11, 1, 11, NULL, NULL),
(12, 1, 12, NULL, NULL),
(13, 1, 13, NULL, NULL),
(14, 1, 14, NULL, NULL),
(15, 1, 15, NULL, NULL),
(16, 1, 16, NULL, NULL),
(17, 1, 17, NULL, NULL),
(18, 1, 18, NULL, NULL),
(19, 1, 19, NULL, NULL),
(20, 1, 20, NULL, NULL),
(21, 1, 21, NULL, NULL),
(22, 1, 22, NULL, NULL),
(23, 1, 23, NULL, NULL),
(24, 1, 24, NULL, NULL),
(25, 1, 25, NULL, NULL),
(26, 1, 26, NULL, NULL),
(27, 1, 27, NULL, NULL),
(28, 1, 28, NULL, NULL),
(29, 1, 29, NULL, NULL),
(30, 1, 30, NULL, NULL),
(31, 1, 31, NULL, NULL),
(32, 1, 32, NULL, NULL),
(33, 1, 33, NULL, NULL),
(34, 1, 34, NULL, NULL),
(35, 1, 35, NULL, NULL),
(36, 1, 36, NULL, NULL),
(37, 1, 1, NULL, NULL),
(38, 1, 2, NULL, NULL),
(39, 1, 3, NULL, NULL),
(40, 1, 4, NULL, NULL),
(41, 1, 5, NULL, NULL),
(42, 1, 6, NULL, NULL),
(43, 1, 7, NULL, NULL),
(44, 1, 8, NULL, NULL),
(45, 1, 9, NULL, NULL),
(46, 1, 10, NULL, NULL),
(47, 1, 11, NULL, NULL),
(48, 1, 12, NULL, NULL),
(49, 1, 13, NULL, NULL),
(50, 1, 14, NULL, NULL),
(51, 1, 15, NULL, NULL),
(52, 1, 16, NULL, NULL),
(53, 1, 17, NULL, NULL),
(54, 1, 18, NULL, NULL),
(55, 1, 19, NULL, NULL),
(56, 1, 20, NULL, NULL),
(57, 1, 21, NULL, NULL),
(58, 1, 22, NULL, NULL),
(59, 1, 23, NULL, NULL),
(60, 1, 24, NULL, NULL),
(61, 1, 25, NULL, NULL),
(62, 1, 26, NULL, NULL),
(63, 1, 27, NULL, NULL),
(64, 1, 28, NULL, NULL),
(65, 1, 29, NULL, NULL),
(66, 1, 30, NULL, NULL),
(67, 1, 31, NULL, NULL),
(68, 1, 32, NULL, NULL),
(69, 1, 33, NULL, NULL),
(70, 1, 34, NULL, NULL),
(71, 1, 35, NULL, NULL),
(72, 1, 36, NULL, NULL),
(73, 2, 1, NULL, NULL),
(74, 2, 2, NULL, NULL),
(75, 2, 3, NULL, NULL),
(76, 2, 5, NULL, NULL),
(77, 2, 9, NULL, NULL),
(78, 2, 13, NULL, NULL),
(79, 2, 14, NULL, NULL),
(80, 2, 16, NULL, NULL),
(81, 2, 17, NULL, NULL),
(82, 2, 18, NULL, NULL),
(83, 2, 19, NULL, NULL),
(84, 2, 20, NULL, NULL),
(85, 2, 21, NULL, NULL),
(86, 2, 22, NULL, NULL),
(87, 2, 23, NULL, NULL),
(88, 2, 27, NULL, NULL),
(89, 3, 1, NULL, NULL),
(90, 3, 13, NULL, NULL),
(91, 3, 16, NULL, NULL),
(92, 3, 17, NULL, NULL),
(93, 3, 18, NULL, NULL),
(94, 3, 22, NULL, NULL),
(97, 4, 14, NULL, NULL),
(98, 4, 16, NULL, NULL),
(99, 4, 17, NULL, NULL),
(103, 2, 15, NULL, NULL),
(104, 2, 4, NULL, NULL),
(105, 2, 35, NULL, NULL),
(106, 3, 14, NULL, NULL),
(107, 3, 15, NULL, NULL),
(108, 3, 5, NULL, NULL),
(109, 3, 2, NULL, NULL),
(110, 3, 3, NULL, NULL),
(111, 3, 19, NULL, NULL),
(112, 3, 21, NULL, NULL),
(113, 3, 20, NULL, NULL),
(114, 3, 9, NULL, NULL),
(115, 3, 23, NULL, NULL),
(116, 54, 14, NULL, NULL),
(117, 54, 15, NULL, NULL),
(118, 54, 13, NULL, NULL),
(119, 54, 38, NULL, NULL),
(120, 54, 6, NULL, NULL),
(121, 54, 8, NULL, NULL),
(122, 54, 7, NULL, NULL),
(123, 54, 5, NULL, NULL),
(124, 54, 2, NULL, NULL),
(125, 54, 4, NULL, NULL),
(126, 54, 3, NULL, NULL),
(127, 54, 1, NULL, NULL),
(128, 54, 18, NULL, NULL),
(129, 54, 17, NULL, NULL),
(130, 54, 19, NULL, NULL),
(131, 54, 16, NULL, NULL),
(132, 54, 33, NULL, NULL),
(133, 54, 21, NULL, NULL),
(134, 54, 34, NULL, NULL),
(135, 54, 32, NULL, NULL),
(136, 54, 20, NULL, NULL),
(137, 54, 10, NULL, NULL),
(138, 54, 12, NULL, NULL),
(139, 54, 11, NULL, NULL),
(140, 54, 9, NULL, NULL),
(141, 54, 22, NULL, NULL),
(142, 54, 28, NULL, NULL),
(143, 54, 30, NULL, NULL),
(144, 54, 29, NULL, NULL),
(145, 54, 27, NULL, NULL),
(146, 54, 36, NULL, NULL),
(147, 54, 35, NULL, NULL),
(148, 54, 31, NULL, NULL),
(149, 54, 24, NULL, NULL),
(150, 54, 26, NULL, NULL),
(151, 54, 25, NULL, NULL),
(152, 54, 23, NULL, NULL),
(153, 57, 14, NULL, NULL),
(154, 57, 13, NULL, NULL),
(155, 57, 38, NULL, NULL),
(156, 57, 1, NULL, NULL),
(157, 57, 18, NULL, NULL),
(158, 57, 17, NULL, NULL),
(159, 57, 19, NULL, NULL),
(160, 57, 16, NULL, NULL),
(161, 57, 22, NULL, NULL),
(162, 4, 38, NULL, NULL),
(163, 54, 41, NULL, NULL),
(164, 54, 42, NULL, NULL),
(165, 54, 40, NULL, NULL),
(166, 54, 44, NULL, NULL),
(167, 54, 45, NULL, NULL),
(168, 54, 43, NULL, NULL),
(169, 54, 46, NULL, NULL),
(170, 54, 47, NULL, NULL),
(171, 54, 48, NULL, NULL),
(172, 54, 51, NULL, NULL),
(173, 54, 53, NULL, NULL),
(174, 54, 52, NULL, NULL),
(175, 54, 50, NULL, NULL),
(176, 54, 56, NULL, NULL),
(177, 54, 55, NULL, NULL),
(178, 54, 54, NULL, NULL),
(179, 54, 49, NULL, NULL),
(180, 54, 57, NULL, NULL),
(181, 57, 55, NULL, NULL),
(182, 57, 54, NULL, NULL),
(183, 4, 56, NULL, NULL),
(184, 4, 55, NULL, NULL),
(185, 4, 54, NULL, NULL),
(186, 12, 38, NULL, NULL),
(187, 12, 2, NULL, NULL),
(188, 12, 3, NULL, NULL),
(189, 12, 1, NULL, NULL),
(190, 12, 55, NULL, NULL),
(191, 12, 54, NULL, NULL),
(192, 12, 22, NULL, NULL),
(193, 13, 38, NULL, NULL),
(194, 13, 1, NULL, NULL),
(195, 13, 55, NULL, NULL),
(196, 13, 54, NULL, NULL),
(197, 13, 22, NULL, NULL),
(198, 14, 38, NULL, NULL),
(199, 14, 1, NULL, NULL),
(200, 14, 20, NULL, NULL),
(201, 14, 55, NULL, NULL),
(202, 14, 54, NULL, NULL),
(203, 14, 22, NULL, NULL),
(204, 16, 13, NULL, NULL),
(205, 16, 38, NULL, NULL),
(206, 16, 1, NULL, NULL),
(207, 16, 18, NULL, NULL),
(208, 16, 17, NULL, NULL),
(209, 16, 16, NULL, NULL),
(210, 16, 55, NULL, NULL),
(211, 16, 54, NULL, NULL),
(212, 16, 22, NULL, NULL),
(213, 17, 13, NULL, NULL),
(214, 17, 38, NULL, NULL),
(215, 17, 1, NULL, NULL),
(216, 17, 18, NULL, NULL),
(217, 17, 17, NULL, NULL),
(218, 17, 16, NULL, NULL),
(219, 17, 55, NULL, NULL),
(220, 17, 54, NULL, NULL),
(221, 17, 22, NULL, NULL),
(222, 18, 13, NULL, NULL),
(223, 18, 38, NULL, NULL),
(224, 18, 1, NULL, NULL),
(225, 18, 18, NULL, NULL),
(226, 18, 17, NULL, NULL),
(227, 18, 16, NULL, NULL),
(228, 18, 55, NULL, NULL),
(229, 18, 54, NULL, NULL),
(230, 18, 22, NULL, NULL),
(231, 19, 13, NULL, NULL),
(232, 19, 38, NULL, NULL),
(233, 19, 1, NULL, NULL),
(234, 19, 18, NULL, NULL),
(235, 19, 17, NULL, NULL),
(236, 19, 16, NULL, NULL),
(237, 19, 55, NULL, NULL),
(238, 19, 54, NULL, NULL),
(239, 19, 22, NULL, NULL),
(240, 20, 13, NULL, NULL),
(241, 20, 38, NULL, NULL),
(242, 20, 1, NULL, NULL),
(243, 20, 18, NULL, NULL),
(244, 20, 17, NULL, NULL),
(245, 20, 16, NULL, NULL),
(246, 20, 55, NULL, NULL),
(247, 20, 54, NULL, NULL),
(248, 20, 22, NULL, NULL),
(249, 21, 13, NULL, NULL),
(250, 21, 38, NULL, NULL),
(251, 21, 1, NULL, NULL),
(252, 21, 18, NULL, NULL),
(253, 21, 17, NULL, NULL),
(254, 21, 16, NULL, NULL),
(255, 21, 55, NULL, NULL),
(256, 21, 54, NULL, NULL),
(257, 21, 22, NULL, NULL),
(258, 22, 13, NULL, NULL),
(259, 22, 38, NULL, NULL),
(260, 22, 1, NULL, NULL),
(261, 22, 18, NULL, NULL),
(262, 22, 17, NULL, NULL),
(263, 22, 16, NULL, NULL),
(264, 22, 55, NULL, NULL),
(265, 22, 54, NULL, NULL),
(266, 22, 22, NULL, NULL),
(267, 23, 13, NULL, NULL),
(268, 23, 38, NULL, NULL),
(269, 23, 1, NULL, NULL),
(270, 23, 18, NULL, NULL),
(271, 23, 17, NULL, NULL),
(272, 23, 16, NULL, NULL),
(273, 23, 55, NULL, NULL),
(274, 23, 54, NULL, NULL),
(275, 23, 22, NULL, NULL),
(276, 27, 13, NULL, NULL),
(277, 27, 38, NULL, NULL),
(278, 27, 1, NULL, NULL),
(279, 27, 18, NULL, NULL),
(280, 27, 17, NULL, NULL),
(281, 27, 16, NULL, NULL),
(282, 27, 55, NULL, NULL),
(283, 27, 54, NULL, NULL),
(284, 27, 22, NULL, NULL),
(285, 4, 41, NULL, NULL),
(286, 4, 42, NULL, NULL),
(287, 4, 15, NULL, NULL),
(288, 4, 13, NULL, NULL),
(289, 3, 41, NULL, NULL),
(290, 3, 42, NULL, NULL),
(291, 2, 41, NULL, NULL),
(292, 2, 42, NULL, NULL),
(293, 1, 41, NULL, NULL),
(294, 1, 42, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `role_user`
--

CREATE TABLE `role_user` (
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `search_demo_records`
--

CREATE TABLE `search_demo_records` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `search_demo_records`
--

INSERT INTO `search_demo_records` (`id`, `title`, `content`, `category`, `created_at`, `updated_at`) VALUES
(1, 'Laravel Framework Guide', 'Laravel is a PHP framework for web artisans. Additional content.', 'Laravel', '2026-07-31 03:09:38', '2026-07-31 03:09:38'),
(2, 'MySQL Full-Text Index', 'MySQL InnoDB supports full-text indexing. Additional content.', 'Database', '2026-07-31 03:09:38', '2026-07-31 03:09:38'),
(3, 'Full-Text Search Benefits', 'Full-text search provides better performance than LIKE. Additional content.', 'Search', '2026-07-31 03:09:38', '2026-07-31 03:09:38'),
(4, 'LIKE vs Full-Text Performance', 'Full-text is 10-100x faster on large datasets. Additional content.', 'Performance', '2026-07-31 03:09:38', '2026-07-31 03:09:38'),
(5, 'Employee Search in HRMS', 'HRMS Pro uses full-text indexes for employee search. Additional content.', 'HRMS', '2026-07-31 03:09:38', '2026-07-31 03:09:38'),
(6, 'Laravel Framework Guide - Example 1', 'Laravel is a PHP framework for web artisans. Additional content.', 'Laravel', '2026-07-31 03:09:38', '2026-07-31 03:09:38'),
(7, 'MySQL Full-Text Index - Example 1', 'MySQL InnoDB supports full-text indexing. Additional content.', 'Database', '2026-07-31 03:09:38', '2026-07-31 03:09:38'),
(8, 'Full-Text Search Benefits - Example 1', 'Full-text search provides better performance than LIKE. Additional content.', 'Search', '2026-07-31 03:09:38', '2026-07-31 03:09:38'),
(9, 'LIKE vs Full-Text Performance - Example 1', 'Full-text is 10-100x faster on large datasets. Additional content.', 'Performance', '2026-07-31 03:09:38', '2026-07-31 03:09:38'),
(10, 'Employee Search in HRMS - Example 1', 'HRMS Pro uses full-text indexes for employee search. Additional content.', 'HRMS', '2026-07-31 03:09:38', '2026-07-31 03:09:38'),
(11, 'Laravel Framework Guide - Example 2', 'Laravel is a PHP framework for web artisans. Additional content.', 'Laravel', '2026-07-31 03:09:38', '2026-07-31 03:09:38'),
(12, 'MySQL Full-Text Index - Example 2', 'MySQL InnoDB supports full-text indexing. Additional content.', 'Database', '2026-07-31 03:09:38', '2026-07-31 03:09:38'),
(13, 'Full-Text Search Benefits - Example 2', 'Full-text search provides better performance than LIKE. Additional content.', 'Search', '2026-07-31 03:09:38', '2026-07-31 03:09:38'),
(14, 'LIKE vs Full-Text Performance - Example 2', 'Full-text is 10-100x faster on large datasets. Additional content.', 'Performance', '2026-07-31 03:09:38', '2026-07-31 03:09:38'),
(15, 'Employee Search in HRMS - Example 2', 'HRMS Pro uses full-text indexes for employee search. Additional content.', 'HRMS', '2026-07-31 03:09:38', '2026-07-31 03:09:38'),
(16, 'Laravel Framework Guide - Example 3', 'Laravel is a PHP framework for web artisans. Additional content.', 'Laravel', '2026-07-31 03:09:38', '2026-07-31 03:09:38'),
(17, 'MySQL Full-Text Index - Example 3', 'MySQL InnoDB supports full-text indexing. Additional content.', 'Database', '2026-07-31 03:09:38', '2026-07-31 03:09:38'),
(18, 'Full-Text Search Benefits - Example 3', 'Full-text search provides better performance than LIKE. Additional content.', 'Search', '2026-07-31 03:09:38', '2026-07-31 03:09:38'),
(19, 'LIKE vs Full-Text Performance - Example 3', 'Full-text is 10-100x faster on large datasets. Additional content.', 'Performance', '2026-07-31 03:09:38', '2026-07-31 03:09:38'),
(20, 'Employee Search in HRMS - Example 3', 'HRMS Pro uses full-text indexes for employee search. Additional content.', 'HRMS', '2026-07-31 03:09:38', '2026-07-31 03:09:38'),
(21, 'Laravel Framework Guide - Example 4', 'Laravel is a PHP framework for web artisans. Additional content.', 'Laravel', '2026-07-31 03:09:38', '2026-07-31 03:09:38'),
(22, 'MySQL Full-Text Index - Example 4', 'MySQL InnoDB supports full-text indexing. Additional content.', 'Database', '2026-07-31 03:09:38', '2026-07-31 03:09:38'),
(23, 'Full-Text Search Benefits - Example 4', 'Full-text search provides better performance than LIKE. Additional content.', 'Search', '2026-07-31 03:09:38', '2026-07-31 03:09:38'),
(24, 'LIKE vs Full-Text Performance - Example 4', 'Full-text is 10-100x faster on large datasets. Additional content.', 'Performance', '2026-07-31 03:09:38', '2026-07-31 03:09:38'),
(25, 'Employee Search in HRMS - Example 4', 'HRMS Pro uses full-text indexes for employee search. Additional content.', 'HRMS', '2026-07-31 03:09:38', '2026-07-31 03:09:38'),
(26, 'Laravel Framework Guide - Example 5', 'Laravel is a PHP framework for web artisans. Additional content.', 'Laravel', '2026-07-31 03:09:38', '2026-07-31 03:09:38'),
(27, 'MySQL Full-Text Index - Example 5', 'MySQL InnoDB supports full-text indexing. Additional content.', 'Database', '2026-07-31 03:09:38', '2026-07-31 03:09:38'),
(28, 'Full-Text Search Benefits - Example 5', 'Full-text search provides better performance than LIKE. Additional content.', 'Search', '2026-07-31 03:09:38', '2026-07-31 03:09:38'),
(29, 'LIKE vs Full-Text Performance - Example 5', 'Full-text is 10-100x faster on large datasets. Additional content.', 'Performance', '2026-07-31 03:09:38', '2026-07-31 03:09:38'),
(30, 'Employee Search in HRMS - Example 5', 'HRMS Pro uses full-text indexes for employee search. Additional content.', 'HRMS', '2026-07-31 03:09:38', '2026-07-31 03:09:38'),
(31, 'Laravel Framework Guide - Example 6', 'Laravel is a PHP framework for web artisans. Additional content.', 'Laravel', '2026-07-31 03:09:38', '2026-07-31 03:09:38'),
(32, 'MySQL Full-Text Index - Example 6', 'MySQL InnoDB supports full-text indexing. Additional content.', 'Database', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(33, 'Full-Text Search Benefits - Example 6', 'Full-text search provides better performance than LIKE. Additional content.', 'Search', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(34, 'LIKE vs Full-Text Performance - Example 6', 'Full-text is 10-100x faster on large datasets. Additional content.', 'Performance', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(35, 'Employee Search in HRMS - Example 6', 'HRMS Pro uses full-text indexes for employee search. Additional content.', 'HRMS', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(36, 'Laravel Framework Guide - Example 7', 'Laravel is a PHP framework for web artisans. Additional content.', 'Laravel', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(37, 'MySQL Full-Text Index - Example 7', 'MySQL InnoDB supports full-text indexing. Additional content.', 'Database', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(38, 'Full-Text Search Benefits - Example 7', 'Full-text search provides better performance than LIKE. Additional content.', 'Search', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(39, 'LIKE vs Full-Text Performance - Example 7', 'Full-text is 10-100x faster on large datasets. Additional content.', 'Performance', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(40, 'Employee Search in HRMS - Example 7', 'HRMS Pro uses full-text indexes for employee search. Additional content.', 'HRMS', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(41, 'Laravel Framework Guide - Example 8', 'Laravel is a PHP framework for web artisans. Additional content.', 'Laravel', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(42, 'MySQL Full-Text Index - Example 8', 'MySQL InnoDB supports full-text indexing. Additional content.', 'Database', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(43, 'Full-Text Search Benefits - Example 8', 'Full-text search provides better performance than LIKE. Additional content.', 'Search', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(44, 'LIKE vs Full-Text Performance - Example 8', 'Full-text is 10-100x faster on large datasets. Additional content.', 'Performance', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(45, 'Employee Search in HRMS - Example 8', 'HRMS Pro uses full-text indexes for employee search. Additional content.', 'HRMS', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(46, 'Laravel Framework Guide - Example 9', 'Laravel is a PHP framework for web artisans. Additional content.', 'Laravel', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(47, 'MySQL Full-Text Index - Example 9', 'MySQL InnoDB supports full-text indexing. Additional content.', 'Database', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(48, 'Full-Text Search Benefits - Example 9', 'Full-text search provides better performance than LIKE. Additional content.', 'Search', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(49, 'LIKE vs Full-Text Performance - Example 9', 'Full-text is 10-100x faster on large datasets. Additional content.', 'Performance', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(50, 'Employee Search in HRMS - Example 9', 'HRMS Pro uses full-text indexes for employee search. Additional content.', 'HRMS', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(51, 'Laravel Framework Guide - Example 10', 'Laravel is a PHP framework for web artisans. Additional content.', 'Laravel', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(52, 'MySQL Full-Text Index - Example 10', 'MySQL InnoDB supports full-text indexing. Additional content.', 'Database', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(53, 'Full-Text Search Benefits - Example 10', 'Full-text search provides better performance than LIKE. Additional content.', 'Search', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(54, 'LIKE vs Full-Text Performance - Example 10', 'Full-text is 10-100x faster on large datasets. Additional content.', 'Performance', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(55, 'Employee Search in HRMS - Example 10', 'HRMS Pro uses full-text indexes for employee search. Additional content.', 'HRMS', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(56, 'Laravel Framework Guide - Example 11', 'Laravel is a PHP framework for web artisans. Additional content.', 'Laravel', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(57, 'MySQL Full-Text Index - Example 11', 'MySQL InnoDB supports full-text indexing. Additional content.', 'Database', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(58, 'Full-Text Search Benefits - Example 11', 'Full-text search provides better performance than LIKE. Additional content.', 'Search', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(59, 'LIKE vs Full-Text Performance - Example 11', 'Full-text is 10-100x faster on large datasets. Additional content.', 'Performance', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(60, 'Employee Search in HRMS - Example 11', 'HRMS Pro uses full-text indexes for employee search. Additional content.', 'HRMS', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(61, 'Laravel Framework Guide - Example 12', 'Laravel is a PHP framework for web artisans. Additional content.', 'Laravel', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(62, 'MySQL Full-Text Index - Example 12', 'MySQL InnoDB supports full-text indexing. Additional content.', 'Database', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(63, 'Full-Text Search Benefits - Example 12', 'Full-text search provides better performance than LIKE. Additional content.', 'Search', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(64, 'LIKE vs Full-Text Performance - Example 12', 'Full-text is 10-100x faster on large datasets. Additional content.', 'Performance', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(65, 'Employee Search in HRMS - Example 12', 'HRMS Pro uses full-text indexes for employee search. Additional content.', 'HRMS', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(66, 'Laravel Framework Guide - Example 13', 'Laravel is a PHP framework for web artisans. Additional content.', 'Laravel', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(67, 'MySQL Full-Text Index - Example 13', 'MySQL InnoDB supports full-text indexing. Additional content.', 'Database', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(68, 'Full-Text Search Benefits - Example 13', 'Full-text search provides better performance than LIKE. Additional content.', 'Search', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(69, 'LIKE vs Full-Text Performance - Example 13', 'Full-text is 10-100x faster on large datasets. Additional content.', 'Performance', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(70, 'Employee Search in HRMS - Example 13', 'HRMS Pro uses full-text indexes for employee search. Additional content.', 'HRMS', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(71, 'Laravel Framework Guide - Example 14', 'Laravel is a PHP framework for web artisans. Additional content.', 'Laravel', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(72, 'MySQL Full-Text Index - Example 14', 'MySQL InnoDB supports full-text indexing. Additional content.', 'Database', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(73, 'Full-Text Search Benefits - Example 14', 'Full-text search provides better performance than LIKE. Additional content.', 'Search', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(74, 'LIKE vs Full-Text Performance - Example 14', 'Full-text is 10-100x faster on large datasets. Additional content.', 'Performance', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(75, 'Employee Search in HRMS - Example 14', 'HRMS Pro uses full-text indexes for employee search. Additional content.', 'HRMS', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(76, 'Laravel Framework Guide - Example 15', 'Laravel is a PHP framework for web artisans. Additional content.', 'Laravel', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(77, 'MySQL Full-Text Index - Example 15', 'MySQL InnoDB supports full-text indexing. Additional content.', 'Database', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(78, 'Full-Text Search Benefits - Example 15', 'Full-text search provides better performance than LIKE. Additional content.', 'Search', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(79, 'LIKE vs Full-Text Performance - Example 15', 'Full-text is 10-100x faster on large datasets. Additional content.', 'Performance', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(80, 'Employee Search in HRMS - Example 15', 'HRMS Pro uses full-text indexes for employee search. Additional content.', 'HRMS', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(81, 'Laravel Framework Guide - Example 16', 'Laravel is a PHP framework for web artisans. Additional content.', 'Laravel', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(82, 'MySQL Full-Text Index - Example 16', 'MySQL InnoDB supports full-text indexing. Additional content.', 'Database', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(83, 'Full-Text Search Benefits - Example 16', 'Full-text search provides better performance than LIKE. Additional content.', 'Search', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(84, 'LIKE vs Full-Text Performance - Example 16', 'Full-text is 10-100x faster on large datasets. Additional content.', 'Performance', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(85, 'Employee Search in HRMS - Example 16', 'HRMS Pro uses full-text indexes for employee search. Additional content.', 'HRMS', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(86, 'Laravel Framework Guide - Example 17', 'Laravel is a PHP framework for web artisans. Additional content.', 'Laravel', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(87, 'MySQL Full-Text Index - Example 17', 'MySQL InnoDB supports full-text indexing. Additional content.', 'Database', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(88, 'Full-Text Search Benefits - Example 17', 'Full-text search provides better performance than LIKE. Additional content.', 'Search', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(89, 'LIKE vs Full-Text Performance - Example 17', 'Full-text is 10-100x faster on large datasets. Additional content.', 'Performance', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(90, 'Employee Search in HRMS - Example 17', 'HRMS Pro uses full-text indexes for employee search. Additional content.', 'HRMS', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(91, 'Laravel Framework Guide - Example 18', 'Laravel is a PHP framework for web artisans. Additional content.', 'Laravel', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(92, 'MySQL Full-Text Index - Example 18', 'MySQL InnoDB supports full-text indexing. Additional content.', 'Database', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(93, 'Full-Text Search Benefits - Example 18', 'Full-text search provides better performance than LIKE. Additional content.', 'Search', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(94, 'LIKE vs Full-Text Performance - Example 18', 'Full-text is 10-100x faster on large datasets. Additional content.', 'Performance', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(95, 'Employee Search in HRMS - Example 18', 'HRMS Pro uses full-text indexes for employee search. Additional content.', 'HRMS', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(96, 'Laravel Framework Guide - Example 19', 'Laravel is a PHP framework for web artisans. Additional content.', 'Laravel', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(97, 'MySQL Full-Text Index - Example 19', 'MySQL InnoDB supports full-text indexing. Additional content.', 'Database', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(98, 'Full-Text Search Benefits - Example 19', 'Full-text search provides better performance than LIKE. Additional content.', 'Search', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(99, 'LIKE vs Full-Text Performance - Example 19', 'Full-text is 10-100x faster on large datasets. Additional content.', 'Performance', '2026-07-31 03:09:39', '2026-07-31 03:09:39'),
(100, 'Employee Search in HRMS - Example 19', 'HRMS Pro uses full-text indexes for employee search. Additional content.', 'HRMS', '2026-07-31 03:09:39', '2026-07-31 03:09:39');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('6xffNLU0A9g3p3zDYM63LaZqNbozH1IzjUFSmz8U', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQklhMGpmMjduRU55VnNKU0l6WGVBbjVUZ2w1TzR4R1RnRldrNktTSiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1784904489),
('oktVlgfhTh7mC20bAIDemBV44503vJkFtCHVrCa0', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiamlzUXByNjhNanU4dFpOUkNOeHgyV3Z4bnFlZ2llZ3RnWHhuQzFOciI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1785382232),
('sFUKOuvnB1hw3IpENqqqbdnuuQXV2uMx320eCPhe', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZFFYWVVUbDlrRnlZVWYzRnZjMU9HQU91NlNId3E4OWcxRkl2NjJQWCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6ODM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC8vc3RvcmFnZS9hdmF0YXJzL3BNV1B2cHVqb09xSXJ3UjVZMmMxYjk2WTBhT1RMUURZaWJtcFRlRjMuanBnIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1784885393);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `years_experience` int(11) NOT NULL DEFAULT 0,
  `total_projects` int(11) NOT NULL DEFAULT 0,
  `last_login_at` timestamp NULL DEFAULT NULL,
  `last_login_ip` varchar(255) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `join_date` date DEFAULT NULL,
  `address` text DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `role_id` bigint(20) UNSIGNED DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `employee_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `email_verified_at`, `password`, `avatar`, `years_experience`, `total_projects`, `last_login_at`, `last_login_ip`, `department`, `position`, `join_date`, `address`, `bio`, `role_id`, `remember_token`, `created_at`, `updated_at`, `employee_id`) VALUES
(1, 'Super Admin', 'super.admin@hrms.com', '09843884994', NULL, '$2y$12$3dd8R6fiGBrqe998l9W1leBthZo0TwKwStCDJw.5TdzX.U9RUqv22', '/storage/avatars/aISz5bi6IOkLUpkw2wdCpwOUPRuZYT7qrK6p70UU.jpg', 3, 10, NULL, NULL, 'Operations', 'HR Assistant', NULL, 'No. 45, Bogyoke Aung San Road, Yangon, Myanmar update', 'Experienced HRMS administrator with a strong background in operations, employee management, and system security. Passionate about streamlining workflows and ensuring smooth HR processes.', 1, NULL, '2026-07-19 22:47:14', '2026-07-24 09:59:18', NULL),
(3, 'Aung Kyaw', 'aungkyaw.hr@hrms.com', NULL, NULL, '$2y$12$idUjRPl5QA6tklTdxlGxGOffDQC7t81cnKD1PNSHb/wvnCV/xPovq', 'https://randomuser.me/api/portraits/men/2.jpg', 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, NULL, '2026-07-21 19:57:42', '2026-07-22 00:04:50', 1),
(4, 'Ko Ko', 'koko.dev@hrms.com', NULL, NULL, '$2y$12$M.3AwyYbhze96g2/Ibt4W.JuAIdSJw9ekZ1kepjCIPSHQAQxf/Gra', 'https://randomuser.me/api/portraits/men/3.jpg', 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 4, NULL, '2026-07-21 19:58:16', '2026-07-22 00:02:18', 3),
(5, 'Mya Mya', 'myamya.sales@hrms.com', NULL, NULL, '$2y$12$yyCgdRjDdns5lF4eS..wb.ota0NjNO/8K7OQvqCRxpPHv71RAVQ1m', 'https://randomuser.me/api/portraits/women/1.jpg', 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 4, NULL, '2026-07-21 20:14:30', '2026-07-22 00:19:11', 2),
(6, 'Su Su', 'susu.sales@hrms.com', NULL, NULL, '$2y$12$u28Rp.ANrDRHJAEQq8ruXexWSI6p4vEPdwBWYYIRXF4RjOB4Ttu3i', 'https://randomuser.me/api/portraits/women/2.jpg', 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3, NULL, '2026-07-22 01:33:23', '2026-07-22 01:36:36', 7),
(7, 'Min Min', 'minmin@hrms.com', '09451234567', '2026-07-24 09:42:17', '$2y$12$HQPeFxKbIhoznRluUyNXtu0WozMRDAORZ1qCJRU2RrgcC2XOIoV42', 'https://randomuser.me/api/portraits/men/4.jpg', 0, 0, NULL, NULL, 'Software Development', 'Senior Software Engineer', '2022-06-10', 'No. 25, Kabar Aye Pagoda Road, Yangon, Myanmar', 'Senior software engineer with 5+ years of experience in full-stack development.', 4, NULL, '2026-07-24 09:42:17', '2026-07-24 09:42:17', 10),
(8, 'Thida', 'thida@hrms.com', '09561234567', '2026-07-24 09:42:17', '$2y$12$qxpKv8pLLvmIogrePTRnkOuvrPZ5HGCaxlnuVApaw6NmyUp7TvqpW', 'https://randomuser.me/api/portraits/women/3.jpg', 0, 0, NULL, NULL, 'Human Resources', 'HR Officer', '2023-08-15', 'No. 12, Inya Road, Yangon, Myanmar', 'HR professional specializing in recruitment and employee relations.', 4, NULL, '2026-07-24 09:42:17', '2026-07-24 09:42:17', 11),
(9, 'Kyaw Kyaw', 'kyawkyaw@hrms.com', '09781234567', '2026-07-24 09:42:18', '$2y$12$4r9yk8WfCykw.24/7g0tCONsuUoO2K5hPuA427IMIDmg.4FKhZ74O', 'https://randomuser.me/api/portraits/men/5.jpg', 0, 0, NULL, NULL, 'Finance', 'Finance Officer', '2024-02-20', 'No. 8, Sule Pagoda Road, Yangon, Myanmar', 'Finance professional with expertise in financial reporting and analysis.', 4, NULL, '2026-07-24 09:42:18', '2026-07-24 09:42:18', 15),
(10, 'Nandar', 'nandar@hrms.com', '09451234876', '2026-07-24 09:42:18', '$2y$12$kAjKOQRlKUU7IT7rdIM4OekhIEjAtA/bdTSp0HyQiqLbifUSFpXzC', 'https://randomuser.me/api/portraits/women/4.jpg', 0, 0, NULL, NULL, 'Finance', 'Accountant', '2023-11-01', 'No. 30, Merchant Street, Yangon, Myanmar', 'Certified accountant with experience in auditing and tax compliance.', 4, NULL, '2026-07-24 09:42:18', '2026-07-24 09:42:18', 16),
(11, 'Zaw Zaw', 'zawzaw@hrms.com', '09561234876', '2026-07-24 09:42:18', '$2y$12$ZudBdZngXeudBehuT.5vDeh27QYi6d5ru5po4XCS.RORUh8.5ONYO', 'https://randomuser.me/api/portraits/men/6.jpg', 0, 0, NULL, NULL, 'Software Development', 'Frontend Developer', '2024-07-05', 'No. 15, Pyay Road, Yangon, Myanmar', 'Frontend developer specializing in React and modern JavaScript frameworks.', 4, NULL, '2026-07-24 09:42:18', '2026-07-24 09:42:18', 17),
(12, 'Hla Hla', 'hlahla@hrms.com', '09781234876', '2026-07-24 09:42:18', '$2y$12$ygdHG69HyCtpE7u7l20h.OcmAdpvapZn.8ODFwKguxtlcjM8IGCba', 'https://randomuser.me/api/portraits/women/5.jpg', 0, 0, NULL, NULL, 'Sales & Marketing', 'Marketing Specialist', '2024-09-12', 'No. 22, Bogyoke Aung San Road, Yangon, Myanmar', 'Marketing specialist with expertise in digital marketing and branding.', 4, NULL, '2026-07-24 09:42:18', '2026-07-24 09:42:18', 18),
(13, 'Tun Tun', 'tuntun@hrms.com', '09451234987', '2026-07-24 09:42:18', '$2y$12$PbotOtvRxVL0YYW4Dsn.Beqc7MpFrL8nMYg64ZPW8oCaVlbM2b2dy', 'https://randomuser.me/api/portraits/men/7.jpg', 0, 0, NULL, NULL, 'Operations', 'Operations Assistant', '2024-04-18', 'No. 5, University Avenue, Yangon, Myanmar', 'Operations professional with experience in process improvement.', 4, NULL, '2026-07-24 09:42:18', '2026-07-24 09:42:18', 19),
(14, 'Moe Moe', 'moemoe@hrms.com', '09561234987', '2026-07-24 09:42:19', '$2y$12$t7bYEyGNiS7i3JKQXL2OU.VjabbUQNpxTVlVX33Wci2kH/ds.n4Pq', 'https://randomuser.me/api/portraits/women/6.jpg', 0, 0, NULL, NULL, 'IT', 'IT Support Specialist', '2024-06-25', 'No. 10, Strand Road, Yangon, Myanmar', 'IT support specialist with expertise in hardware and software troubleshooting.', 4, NULL, '2026-07-24 09:42:19', '2026-07-24 09:42:19', 20),
(15, 'Thet Thet', 'thetthet@hrms.com', '09781234987', '2026-07-24 09:42:19', '$2y$12$B5FIlZswML861WgMcRMlj.9YUCQDX0exoQz7rNjcbNy4wLIoyJ6HK', 'https://randomuser.me/api/portraits/women/7.jpg', 0, 0, NULL, NULL, 'Human Resources', 'HR Manager', '2022-01-10', 'No. 45, Kaba Aye Pagoda Road, Yangon, Myanmar', 'HR manager with 8+ years of experience in talent management and development.', 4, NULL, '2026-07-24 09:42:19', '2026-07-24 09:42:19', 21),
(16, 'Win Win', 'winwin@hrms.com', '09451234098', '2026-07-24 09:42:19', '$2y$12$myZaUZRIj7jc3W7s.wE7NOBIerUzqSUHhNlywhyVPEwGseprhoJrW', 'https://randomuser.me/api/portraits/women/8.jpg', 0, 0, NULL, NULL, 'Sales & Marketing', 'Sales Representative', '2024-08-30', 'No. 18, Anawrahta Road, Yangon, Myanmar', 'Sales professional with experience in B2B sales and client relationship management.', 4, NULL, '2026-07-24 09:42:19', '2026-07-24 09:42:19', 22),
(17, 'Soe Soe', 'soesoe@hrms.com', '09561234098', '2026-07-24 09:42:19', '$2y$12$pAnw6sla6hSvW23yap10weacew7mJkyqnyO8wYKbAXhHpzV0stPNK', 'https://randomuser.me/api/portraits/men/8.jpg', 0, 0, NULL, NULL, 'Software Development', 'Backend Developer', '2024-10-15', 'No. 25, Kanbe Road, Yangon, Myanmar', 'Backend developer specializing in API development and database management.', 4, NULL, '2026-07-24 09:42:19', '2026-07-24 09:42:19', 23),
(18, 'Aye Aye', 'ayeaye@hrms.com', '09781234098', '2026-07-24 09:42:20', '$2y$12$uStlt8brWUvjgy822juy2e6RYPIdvgEuF4eH9kArVVM/2RNv5RhEC', 'https://randomuser.me/api/portraits/women/9.jpg', 0, 0, NULL, NULL, 'Customer Service', 'Customer Service Representative', '2024-12-01', 'No. 8, Maha Bandula Road, Yangon, Myanmar', 'Customer service professional with excellent communication skills.', 4, NULL, '2026-07-24 09:42:20', '2026-07-24 09:42:20', 24),
(19, 'Pyae Pyae', 'pyaepyae@hrms.com', '09451234012', '2026-07-24 09:42:20', '$2y$12$b5GemJFvS/H1XZDvN1776OdYTLYzdOkR0rRPGXR6kULFvS1p71fE.', 'https://randomuser.me/api/portraits/men/9.jpg', 0, 0, NULL, NULL, 'Product', 'Product Assistant', '2025-01-20', 'No. 12, Thiri Mingala Street, Yangon, Myanmar', 'Product management professional with focus on market research and development.', 4, NULL, '2026-07-24 09:42:20', '2026-07-24 09:42:20', 25),
(20, 'Nyi Nyi', 'nyinyi@hrms.com', '09561234012', '2026-07-24 09:42:20', '$2y$12$o82Z1spDWYOGkyAS2zOmje.FYOnzYQlx08WDgv8S0VtJvvM8DtLsm', 'https://randomuser.me/api/portraits/men/10.jpg', 0, 0, NULL, NULL, 'Design', 'Graphic Designer', '2025-02-14', 'No. 7, Shwe Dagon Pagoda Road, Yangon, Myanmar', 'Creative graphic designer with expertise in branding and visual communication.', 4, NULL, '2026-07-24 09:42:20', '2026-07-24 09:42:20', 26),
(21, 'Khin Khin', 'khinkhin@hrms.com', '09781234012', '2026-07-24 09:42:20', '$2y$12$FczxiItqlgrZgMF16tFol.PboOqGUcFmmKFP703YKeFbYdWoDXRou', 'https://randomuser.me/api/portraits/women/10.jpg', 0, 0, NULL, NULL, 'Administration', 'Office Administrator', '2025-03-25', 'No. 30, Independence Monument Road, Yangon, Myanmar', 'Experienced office administrator with skills in office management and coordination.', 4, NULL, '2026-07-24 09:42:20', '2026-07-24 09:42:20', 27),
(22, 'Maung Maung', 'maungmaung@hrms.com', '09451234123', '2026-07-24 09:42:20', '$2y$12$RVZ3eBoo97akMr4CeAZQPuBWOEp3nQCrQMdZl00f/8Op9OyeEnP7q', 'https://randomuser.me/api/portraits/men/11.jpg', 0, 0, NULL, NULL, 'Software Development', 'DevOps Engineer', '2025-04-10', 'No. 14, Bayint Naung Road, Yangon, Myanmar', 'DevOps engineer with expertise in cloud infrastructure and CI/CD pipelines.', 4, NULL, '2026-07-24 09:42:20', '2026-07-24 09:42:20', 28),
(23, 'Thandar Aung', 'thandar.aung@hrms.com', '+95912345678', NULL, '$2y$12$LMhMuy58aPTodWYYpPjeoettZZy9JyISCl2nsreJxzsKwScSPpe7.', 'https://randomuser.me/api/portraits/women/11.jpg', 8, 25, NULL, NULL, 'Sales', 'Sales Manager', '2021-06-01', 'No. 45, Bogyoke Aung San Road, Yangon, Myanmar', 'Experienced Sales Manager with 8+ years in driving sales growth and team leadership. Proven track record in B2B sales, client relationship management, and strategic planning. Passionate about developing high-performing sales teams and achieving revenue targets.', 3, NULL, '2026-07-28 09:13:44', '2026-07-28 09:13:44', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `activity_logs_user_id_created_at_index` (`user_id`,`created_at`),
  ADD KEY `activity_logs_action_index` (`action`);

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `announcements_created_by_foreign` (`created_by`),
  ADD KEY `announcements_status_published_at_index` (`status`,`published_at`),
  ADD KEY `announcements_target_type_target_id_index` (`target_type`,`target_id`),
  ADD KEY `announcements_is_pinned_index` (`is_pinned`),
  ADD KEY `announcements_is_important_index` (`is_important`);

--
-- Indexes for table `announcement_attachments`
--
ALTER TABLE `announcement_attachments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `announcement_attachments_announcement_id_index` (`announcement_id`);

--
-- Indexes for table `announcement_notifications`
--
ALTER TABLE `announcement_notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `announcement_notifications_user_id_foreign` (`user_id`),
  ADD KEY `announcement_notifications_announcement_id_user_id_index` (`announcement_id`,`user_id`),
  ADD KEY `announcement_notifications_is_read_index` (`is_read`);

--
-- Indexes for table `announcement_views`
--
ALTER TABLE `announcement_views`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `announcement_views_announcement_id_user_id_unique` (`announcement_id`,`user_id`),
  ADD KEY `announcement_views_user_id_foreign` (`user_id`),
  ADD KEY `announcement_views_announcement_id_user_id_index` (`announcement_id`,`user_id`);

--
-- Indexes for table `attendances`
--
ALTER TABLE `attendances`
  ADD PRIMARY KEY (`id`),
  ADD KEY `attendances_employee_id_check_in_index` (`employee_id`,`check_in`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `company_settings`
--
ALTER TABLE `company_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `departments_code_unique` (`code`),
  ADD KEY `departments_manager_id_foreign` (`manager_id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `employees_employee_code_unique` (`employee_code`),
  ADD UNIQUE KEY `employees_email_unique` (`email`),
  ADD KEY `employees_department_id_foreign` (`department_id`),
  ADD KEY `employees_position_id_foreign` (`position_id`),
  ADD KEY `employees_user_id_foreign` (`user_id`);
ALTER TABLE `employees` ADD FULLTEXT KEY `employees_fulltext` (`name`,`employee_code`,`email`);

--
-- Indexes for table `employee_salaries`
--
ALTER TABLE `employee_salaries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_salaries_employee_id_is_active_index` (`employee_id`,`is_active`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `leave_requests`
--
ALTER TABLE `leave_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `leave_requests_employee_id_foreign` (`employee_id`),
  ADD KEY `leave_requests_leave_type_id_foreign` (`leave_type_id`),
  ADD KEY `leave_requests_approved_by_foreign` (`approved_by`);

--
-- Indexes for table `leave_types`
--
ALTER TABLE `leave_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `leave_types_code_unique` (`code`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `payrolls`
--
ALTER TABLE `payrolls`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payrolls_employee_id_payroll_month_unique` (`employee_id`,`payroll_month`),
  ADD KEY `payrolls_created_by_foreign` (`created_by`),
  ADD KEY `payrolls_paid_by_foreign` (`paid_by`),
  ADD KEY `payrolls_approved_by_foreign` (`approved_by`),
  ADD KEY `payrolls_status_payroll_month_index` (`status`,`payroll_month`),
  ADD KEY `payrolls_status_index` (`status`);

--
-- Indexes for table `payroll_items`
--
ALTER TABLE `payroll_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payroll_items_employee_id_foreign` (`employee_id`),
  ADD KEY `payroll_items_payroll_id_item_type_index` (`payroll_id`,`item_type`);

--
-- Indexes for table `payroll_settings`
--
ALTER TABLE `payroll_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payroll_settings_company_id_unique` (`company_id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissions_slug_unique` (`slug`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `positions`
--
ALTER TABLE `positions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `positions_title_unique` (`title`),
  ADD UNIQUE KEY `positions_code_unique` (`code`),
  ADD KEY `positions_department_id_foreign` (`department_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_slug_unique` (`slug`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `role_permissions_role_id_foreign` (`role_id`),
  ADD KEY `role_permissions_permission_id_foreign` (`permission_id`);

--
-- Indexes for table `role_user`
--
ALTER TABLE `role_user`
  ADD PRIMARY KEY (`user_id`,`role_id`);

--
-- Indexes for table `search_demo_records`
--
ALTER TABLE `search_demo_records`
  ADD PRIMARY KEY (`id`);
ALTER TABLE `search_demo_records` ADD FULLTEXT KEY `search_demo_fulltext` (`title`,`content`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `users_employee_id_foreign` (`employee_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `announcement_attachments`
--
ALTER TABLE `announcement_attachments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `announcement_notifications`
--
ALTER TABLE `announcement_notifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `announcement_views`
--
ALTER TABLE `announcement_views`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `attendances`
--
ALTER TABLE `attendances`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=88;

--
-- AUTO_INCREMENT for table `company_settings`
--
ALTER TABLE `company_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `employee_salaries`
--
ALTER TABLE `employee_salaries`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `leave_requests`
--
ALTER TABLE `leave_requests`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT for table `leave_types`
--
ALTER TABLE `leave_types`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT for table `payrolls`
--
ALTER TABLE `payrolls`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `payroll_items`
--
ALTER TABLE `payroll_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payroll_settings`
--
ALTER TABLE `payroll_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=137;

--
-- AUTO_INCREMENT for table `positions`
--
ALTER TABLE `positions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `role_permissions`
--
ALTER TABLE `role_permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=295;

--
-- AUTO_INCREMENT for table `search_demo_records`
--
ALTER TABLE `search_demo_records`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `announcements`
--
ALTER TABLE `announcements`
  ADD CONSTRAINT `announcements_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `announcement_attachments`
--
ALTER TABLE `announcement_attachments`
  ADD CONSTRAINT `announcement_attachments_announcement_id_foreign` FOREIGN KEY (`announcement_id`) REFERENCES `announcements` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `announcement_notifications`
--
ALTER TABLE `announcement_notifications`
  ADD CONSTRAINT `announcement_notifications_announcement_id_foreign` FOREIGN KEY (`announcement_id`) REFERENCES `announcements` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `announcement_notifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `announcement_views`
--
ALTER TABLE `announcement_views`
  ADD CONSTRAINT `announcement_views_announcement_id_foreign` FOREIGN KEY (`announcement_id`) REFERENCES `announcements` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `announcement_views_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `attendances`
--
ALTER TABLE `attendances`
  ADD CONSTRAINT `attendances_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `departments`
--
ALTER TABLE `departments`
  ADD CONSTRAINT `departments_manager_id_foreign` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `employees_position_id_foreign` FOREIGN KEY (`position_id`) REFERENCES `positions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `employees_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `employee_salaries`
--
ALTER TABLE `employee_salaries`
  ADD CONSTRAINT `employee_salaries_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `leave_requests`
--
ALTER TABLE `leave_requests`
  ADD CONSTRAINT `leave_requests_approved_by_foreign` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `leave_requests_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `leave_requests_leave_type_id_foreign` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_types` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `payrolls`
--
ALTER TABLE `payrolls`
  ADD CONSTRAINT `payrolls_approved_by_foreign` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `payrolls_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `payrolls_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `payrolls_paid_by_foreign` FOREIGN KEY (`paid_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `payroll_items`
--
ALTER TABLE `payroll_items`
  ADD CONSTRAINT `payroll_items_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `payroll_items_payroll_id_foreign` FOREIGN KEY (`payroll_id`) REFERENCES `payrolls` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payroll_settings`
--
ALTER TABLE `payroll_settings`
  ADD CONSTRAINT `payroll_settings_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `company_settings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `positions`
--
ALTER TABLE `positions`
  ADD CONSTRAINT `positions_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `role_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
