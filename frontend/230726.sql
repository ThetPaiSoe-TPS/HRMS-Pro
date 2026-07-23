-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 23, 2026 at 12:12 PM
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

--
-- Dumping data for table `attendances`
--

INSERT INTO `attendances` (`id`, `employee_id`, `check_in`, `check_out`, `status`, `note`, `created_at`, `updated_at`) VALUES
(1, 2, '2023-07-21 01:30:00', '2026-07-21 10:30:00', 'present', 'Prepared for office meeting', '2026-07-21 21:14:23', '2026-07-21 21:15:43'),
(2, 3, '2023-07-20 01:30:00', '2026-07-20 11:30:00', 'present', 'ready to join team', '2026-07-21 22:08:17', '2026-07-21 22:08:38');

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
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
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

INSERT INTO `employees` (`id`, `user_id`, `employee_code`, `name`, `department_id`, `position_id`, `phone`, `email`, `hire_date`, `status`, `photo`, `created_at`, `updated_at`) VALUES
(1, NULL, 'EMP001', 'Aung Kyaw', 1, 1, '09450012345', 'aungkyaw.hr@hrms.com', '2024-01-15', 'active', NULL, NULL, NULL),
(2, NULL, 'EMP002', 'Mya Mya', 2, 2, '09510067890', 'myamya.sales@hrms.com', '2025-03-10', 'active', NULL, NULL, NULL),
(3, NULL, 'EMP003', 'Ko Ko', 3, 3, '09790045678', 'koko.dev@hrms.com', '2023-05-20', 'inactive', NULL, NULL, NULL),
(7, 6, 'EMP004', 'Su Su', 2, 3, '09790045234', 'susu.sales@hrms.com', '2026-03-20', 'active', NULL, '2026-07-22 01:38:05', '2026-07-22 01:38:05');

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
(1, '2026-07-20 00:31:58', '2026-07-20 00:48:43', 1, 'Anual Leave', '2026-07-01', '2026-07-05', 'Family trip to Mandalay', 'approved', NULL, NULL, NULL, NULL),
(2, '2026-07-21 21:18:51', '2026-07-21 21:18:51', 2, 'Casual Leave', '2026-07-10', '2026-07-11', 'Personal errands', 'pending', NULL, NULL, NULL, NULL);

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
(38, '2026_07_22_052539_create_positions_table', 7);

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
(5, 3, '2026-07-01', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 'cancelled', NULL, NULL, NULL, NULL, NULL, 'Cancellation: \'Customer requested cancellation due to duplicate payment', 1, '2026-07-20 21:31:56', '2026-07-21 00:13:09', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(6, 2, '2026-01-01', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 'paid', '2026-07-15', 'bank_transfer', 'Myanmar National Bank', 'ACC1234567890', 'TXN-20260715-001', NULL, 5, '2026-07-22 01:16:29', '2026-07-22 01:22:45', 1, NULL, NULL, NULL, 1, '2026-07-22 01:21:52', '2026-07-22 01:22:45');

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
(28, 'App\\Models\\User', 1, 'hrms-pro', 'fed8ed1f48af1863f17e434a8bb0d7628d2d8916e36eeeb6f3272e65139e4f73', '[\"*\"]', NULL, NULL, '2026-07-23 01:38:58', '2026-07-23 01:38:58');

-- --------------------------------------------------------

--
-- Table structure for table `positions`
--

CREATE TABLE `positions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `department_id` bigint(20) UNSIGNED DEFAULT NULL,
  `salary_range` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `positions`
--

INSERT INTO `positions` (`id`, `title`, `description`, `department_id`, `salary_range`, `status`, `created_at`, `updated_at`) VALUES
(1, 'HR Assistant', 'Staff recruitment, employee relations, and HR policies.', 1, '400000-500000 MMK', 'active', NULL, NULL),
(2, 'Sales & Marketing Assistant', 'Supports the manager with client outreach, prepares promotional materials, and assists in organizing campaigns.', 2, '600,000 - 900,000 MMK', 'active', NULL, NULL),
(3, 'Sales & Marketing Manager', 'Handles client acquisition, branding campaigns, and promotions.', 2, '1500000- 200000 MMK', 'active', NULL, NULL),
(4, 'Software Engineer', 'Develops and maintains software applications and systems.', 3, '100000- 1500000 MMK', 'active', NULL, NULL);

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
(96, 4, 13, NULL, NULL),
(97, 4, 14, NULL, NULL),
(98, 4, 16, NULL, NULL),
(99, 4, 17, NULL, NULL),
(100, 4, 20, NULL, NULL),
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
(115, 3, 23, NULL, NULL);

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
  `updated_at` timestamp NULL DEFAULT NULL,
  `employee_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `role_id`, `remember_token`, `created_at`, `updated_at`, `employee_id`) VALUES
(1, 'Super Admin', 'super.admin@hrms.com', NULL, '$2y$12$tVG7uT6dwD.cHfLQpR32TePcOLJi4R7w9a.AAh9uVEiDVwy65tEf2', 1, NULL, '2026-07-19 22:47:14', '2026-07-22 00:05:53', NULL),
(3, 'Aung Kyaw', 'aungkyaw.hr@hrms.com', NULL, '$2y$12$idUjRPl5QA6tklTdxlGxGOffDQC7t81cnKD1PNSHb/wvnCV/xPovq', 2, NULL, '2026-07-21 19:57:42', '2026-07-22 00:04:50', 1),
(4, 'Ko Ko', 'koko.dev@hrms.com', NULL, '$2y$12$M.3AwyYbhze96g2/Ibt4W.JuAIdSJw9ekZ1kepjCIPSHQAQxf/Gra', 4, NULL, '2026-07-21 19:58:16', '2026-07-22 00:02:18', 3),
(5, 'Mya Mya', 'myamya.sales@hrms.com', NULL, '$2y$12$yyCgdRjDdns5lF4eS..wb.ota0NjNO/8K7OQvqCRxpPHv71RAVQ1m', 4, NULL, '2026-07-21 20:14:30', '2026-07-22 00:19:11', 2),
(6, 'Su Su', 'susu.sales@hrms.com', NULL, '$2y$12$u28Rp.ANrDRHJAEQq8ruXexWSI6p4vEPdwBWYYIRXF4RjOB4Ttu3i', 3, NULL, '2026-07-22 01:33:23', '2026-07-22 01:36:36', 7);

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
  ADD KEY `employees_position_id_foreign` (`position_id`),
  ADD KEY `employees_user_id_foreign` (`user_id`);

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
-- Indexes for table `positions`
--
ALTER TABLE `positions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `positions_title_unique` (`title`),
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
-- AUTO_INCREMENT for table `attendances`
--
ALTER TABLE `attendances`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `payrolls`
--
ALTER TABLE `payrolls`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `positions`
--
ALTER TABLE `positions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `role_permissions`
--
ALTER TABLE `role_permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=116;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

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
