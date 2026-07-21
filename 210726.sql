-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 21, 2026 at 12:15 PM
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
-- Database: `hmrs-pro`
--

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
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `company_email` varchar(255) DEFAULT NULL,
  `company_phone` varchar(50) DEFAULT NULL,
  `company_address` text DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `manager_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `name`, `created_at`, `updated_at`, `manager_id`) VALUES
(1, 'Human Resources', NULL, NULL, NULL),
(2, 'Sales & Marketing', NULL, NULL, NULL),
(3, 'Software Development', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `employee_code` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `department_id` bigint(20) UNSIGNED NOT NULL,
  `position_id` bigint(20) UNSIGNED NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `hire_date` date DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `employee_code`, `name`, `department_id`, `position_id`, `phone`, `email`, `hire_date`, `status`, `photo`, `created_at`, `updated_at`) VALUES
(1, 'EMP001', 'Aung Kyaw', 1, 1, '09450012345', 'aungkyaw.hr@hrms.com', '2024-01-15', 'active', NULL, NULL, NULL),
(2, 'EMP002', 'Mya Mya', 2, 2, '09510067890', 'myamya.sales@hrms.com', '2025-03-10', 'active', NULL, NULL, NULL),
(3, 'EMP003', 'Ko Ko', 3, 3, '09790045678', 'koko.dev@hrms.com', '2023-05-20', 'inactive', NULL, NULL, NULL);

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
  `leave_type` varchar(100) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `reason` text DEFAULT NULL,
  `status` enum('pending','approved','rejected','cancelled') NOT NULL DEFAULT 'pending',
  `attachment` varchar(255) DEFAULT NULL,
  `attachment_original_name` varchar(255) DEFAULT NULL,
  `attachment_mime_type` varchar(255) DEFAULT NULL,
  `attachment_size` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `leave_requests`
--

INSERT INTO `leave_requests` (`id`, `created_at`, `updated_at`, `employee_id`, `leave_type`, `start_date`, `end_date`, `reason`, `status`, `attachment`, `attachment_original_name`, `attachment_mime_type`, `attachment_size`) VALUES
(1, '2026-07-20 00:31:58', '2026-07-20 00:48:43', 1, 'Anual Leave', '2026-07-01', '2026-07-05', 'Family trip to Mandalay', 'approved', NULL, NULL, NULL, NULL);

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
(9, '2026_07_16_101338_create_leave_requests_table', 1),
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
(29, '2026_07_20_065514_add_columns_to_leave_requests_table', 2),
(30, '2026_07_20_070921_add_attachment_columns_to_leave_requests_table', 2),
(31, '2026_07_20_073029_create_attendances_table', 2),
(32, '2026_07_21_032517_update_payrolls_table_add_columns', 3);

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

INSERT INTO `payrolls` (`id`, `employee_id`, `payroll_month`, `basic_salary`, `daily_salary`, `hourly_salary`, `total_allowances`, `total_overtime`, `total_bonus`, `gross_salary`, `total_deductions`, `tax_amount`, `loan_deduction`, `advance_salary`, `late_deduction`, `absent_deduction`, `unpaid_leave_deduction`, `other_deductions`, `net_salary`, `status`, `payment_date`, `payment_method`, `bank_name`, `bank_account`, `transaction_number`, `general_notes`, `created_by`, `created_at`, `updated_at`, `paid_by`, `hr_notes`, `finance_notes`, `employee_notes`, `approved_by`, `approved_at`, `paid_at`) VALUES
(1, 1, '2026-07-01', 500000.00, 21739.13, 2717.39, 0.00, 0.00, 0.00, 500000.00, 12500.00, 12500.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 487500.00, 'pending_approval', '2026-07-20', NULL, NULL, NULL, NULL, 'Updated payroll for Aung Kyaw', 1, '2026-07-19 22:51:32', '2026-07-20 23:04:50', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 2, '2026-07-01', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 'paid', '2026-07-15', 'bank_transfer', 'Myanmar National Bank', 'ACC1234567890', 'TXN-20260715-001', NULL, 1, '2026-07-20 21:31:56', '2026-07-21 00:10:19', 1, NULL, NULL, NULL, 1, '2026-07-21 00:09:56', '2026-07-21 00:10:19'),
(5, 3, '2026-07-01', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 'cancelled', NULL, NULL, NULL, NULL, NULL, 'Cancellation: \'Customer requested cancellation due to duplicate payment', 1, '2026-07-20 21:31:56', '2026-07-21 00:13:09', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

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
  `slug` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `slug`, `created_at`, `updated_at`) VALUES
(1, 'View Employees', 'employee.view', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(2, 'Create Employees', 'employee.create', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(3, 'Update Employees', 'employee.update', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(4, 'Delete Employees', 'employee.delete', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(5, 'View Departments', 'department.view', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(6, 'Create Departments', 'department.create', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(7, 'Update Departments', 'department.update', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(8, 'Delete Departments', 'department.delete', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(9, 'View Positions', 'position.view', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(10, 'Create Positions', 'position.create', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(11, 'Update Positions', 'position.update', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(12, 'Delete Positions', 'position.delete', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(13, 'View Attendance', 'attendance.view', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(14, 'Create Attendance', 'attendance.create', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(15, 'Update Attendance', 'attendance.update', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(16, 'View Leave', 'leave.view', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(17, 'Create Leave', 'leave.create', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(18, 'Approve Leave', 'leave.approve', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(19, 'Reject Leave', 'leave.reject', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(20, 'View Payroll', 'payroll.view', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(21, 'Generate Payroll', 'payroll.generate', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(22, 'View Reports', 'report.view', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(23, 'View Users', 'user.view', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(24, 'Create Users', 'user.create', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(25, 'Update Users', 'user.update', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(26, 'Delete Users', 'user.delete', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(27, 'View Roles', 'role.view', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(28, 'Create Roles', 'role.create', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(29, 'Update Roles', 'role.update', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(30, 'Delete Roles', 'role.delete', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(31, 'Update Settings', 'setting.update', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(32, 'Update Payroll', 'payroll.update', '2026-07-19 23:00:04', '2026-07-19 23:00:04'),
(33, 'Approve Payroll', 'payroll.approve', '2026-07-19 23:00:04', '2026-07-19 23:00:04'),
(34, 'Pay Payroll', 'payroll.pay', '2026-07-19 23:00:04', '2026-07-19 23:00:04'),
(35, 'View Salary', 'salary.view', '2026-07-19 23:00:04', '2026-07-19 23:00:04'),
(36, 'Update Salary', 'salary.update', '2026-07-19 23:00:04', '2026-07-19 23:00:04');

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
(1, 'App\\Models\\User', 1, 'hrms-pro', '67c1ef125226e94aba8571ffde106acd82669a412b3a69247eeae503e1ef2c38', '[\"*\"]', '2026-07-20 08:24:03', NULL, '2026-07-20 07:38:33', '2026-07-20 08:24:03'),
(2, 'App\\Models\\User', 1, 'hrms-pro', '7b3efe472a96193426d577b347645035ee211258fffff00635e2211b6d293384', '[\"*\"]', '2026-07-20 01:40:38', NULL, '2026-07-19 23:46:19', '2026-07-20 01:40:38'),
(3, 'App\\Models\\User', 1, 'hrms-pro', '652a137d6846922681e6f33b48d17f92c3fe9eb1366b9bfba2f341c5efeb249e', '[\"*\"]', '2026-07-21 00:17:14', NULL, '2026-07-20 20:19:30', '2026-07-21 00:17:14');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `slug`, `created_at`, `updated_at`) VALUES
(1, 'Super Admin', 'super-admin', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(2, 'HR Manager', 'hr-manager', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(3, 'Department Manager', 'dept-manager', '2026-07-19 22:27:29', '2026-07-19 22:27:29'),
(4, 'Employee', 'employee', '2026-07-19 22:27:29', '2026-07-19 22:27:29');

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
(36, 1, 36, NULL, NULL);

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

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` bigint(20) UNSIGNED DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `role_id`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Super Admin', 'name1@hrms.com', NULL, '$2y$12$tVG7uT6dwD.cHfLQpR32TePcOLJi4R7w9a.AAh9uVEiDVwy65tEf2', 1, NULL, '2026-07-19 22:47:14', '2026-07-19 22:47:14');

--
-- Indexes for dumped tables
--

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
  ADD KEY `departments_manager_id_foreign` (`manager_id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `employees_employee_code_unique` (`employee_code`),
  ADD UNIQUE KEY `employees_email_unique` (`email`),
  ADD KEY `employees_department_id_foreign` (`department_id`),
  ADD KEY `employees_position_id_foreign` (`position_id`);

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
  ADD KEY `leave_requests_employee_id_foreign` (`employee_id`);

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
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendances`
--
ALTER TABLE `attendances`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `company_settings`
--
ALTER TABLE `company_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `payrolls`
--
ALTER TABLE `payrolls`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `role_permissions`
--
ALTER TABLE `role_permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

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
  ADD CONSTRAINT `employees_position_id_foreign` FOREIGN KEY (`position_id`) REFERENCES `positions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `employee_salaries`
--
ALTER TABLE `employee_salaries`
  ADD CONSTRAINT `employee_salaries_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `leave_requests`
--
ALTER TABLE `leave_requests`
  ADD CONSTRAINT `leave_requests_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

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
-- Constraints for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `role_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
