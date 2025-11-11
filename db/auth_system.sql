-- Authentication System Database Schema
-- Database: auth_system
-- Version: 1.0.0

-- Create database
CREATE DATABASE IF NOT EXISTS `auth_system` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `auth_system`;

-- Users table
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) UNIQUE NOT NULL,
    `email` VARCHAR(100) UNIQUE NOT NULL,
    `id_number` VARCHAR(9) UNIQUE NULL,
    `password` VARCHAR(255) NOT NULL,
    `security_question` VARCHAR(255) NOT NULL DEFAULT 'pending',
    `security_answer` VARCHAR(255) NOT NULL DEFAULT 'pending',
    `phone_number` VARCHAR(20) NULL,
    `first_name` VARCHAR(100) NULL,
    `last_name` VARCHAR(100) NULL,
    `middle_name` VARCHAR(100) NULL,
    `extension` VARCHAR(10) NULL,
    `birth_date` DATE NULL,
    `age` INT NULL,
    `sex` ENUM('male', 'female', 'other') NULL,
    `purok_street` VARCHAR(255) NULL,
    `barangay` VARCHAR(100) NULL,
    `city` VARCHAR(100) NULL,
    `province` VARCHAR(100) NULL,
    `country` VARCHAR(100) NULL,
    `address` TEXT NULL,
    `profile_picture` VARCHAR(255) NULL,
    `role` VARCHAR(50) DEFAULT 'user',
    `phone` VARCHAR(20) NULL,
    `last_login` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `is_active` BOOLEAN DEFAULT TRUE,
    INDEX `idx_username` (`username`),
    INDEX `idx_email` (`email`),
    INDEX `idx_id_number` (`id_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Password reset tokens table
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `expires_at` TIMESTAMP NOT NULL,
    `used` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    INDEX `idx_token` (`token`),
    INDEX `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User security questions table
CREATE TABLE IF NOT EXISTS `user_security_questions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `question1` VARCHAR(100) NOT NULL,
    `answer1` VARCHAR(255) NOT NULL,
    `question2` VARCHAR(100) NOT NULL,
    `answer2` VARCHAR(255) NOT NULL,
    `question3` VARCHAR(100) NOT NULL,
    `answer3` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uq_user` (`user_id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user
-- Username: admin
-- Password: admin@12345
-- Security Question: Master key?
-- Security Answer: admin
INSERT INTO `users` (`username`, `email`, `password`, `security_question`, `security_answer`, `is_active`, `role`)
VALUES (
    'admin',
    'admin@example.com',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- admin@12345
    'Master key?',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- admin
    1,
    'admin'
) ON DUPLICATE KEY UPDATE `username`=`username`;

