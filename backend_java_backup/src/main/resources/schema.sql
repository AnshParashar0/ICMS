-- ICMS Database Schema
-- Create database if not exists
CREATE DATABASE IF NOT EXISTS icms_db;
USE icms_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
    contact_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Complaints Table
CREATE TABLE IF NOT EXISTS complaints (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    complaint_id VARCHAR(20) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    student_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') NOT NULL DEFAULT 'MEDIUM',
    status ENUM('PENDING', 'IN_PROGRESS', 'RESOLVED') NOT NULL DEFAULT 'PENDING',
    contact_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_user_id (user_id),
    INDEX idx_category (category)
);

-- Insert default admin user (password: admin123)
INSERT IGNORE INTO users (name, email, password, role) 
VALUES ('Admin User', 'admin@icms.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'ADMIN');

-- Insert sample student users (password: student123)
INSERT IGNORE INTO users (name, email, password, role, contact_number) VALUES
('John Doe', 'john@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'STUDENT', '+1234567890'),
('Jane Smith', 'jane@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'STUDENT', '+1234567891'),
('Mike Johnson', 'mike@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'STUDENT', '+1234567892');

-- Insert sample complaints
INSERT IGNORE INTO complaints (complaint_id, user_id, student_name, category, location, description, priority, status, contact_number) VALUES
('CMP1001', 2, 'John Doe', 'Electrical', 'Room 101, Building A', 'Light fixture not working in the classroom', 'MEDIUM', 'PENDING', '+1234567890'),
('CMP1002', 3, 'Jane Smith', 'Plumbing', 'Library, 2nd Floor', 'Water leakage in the restroom', 'HIGH', 'IN_PROGRESS', '+1234567891'),
('CMP1003', 4, 'Mike Johnson', 'Furniture', 'Cafeteria', 'Broken chairs in the dining area', 'LOW', 'RESOLVED', '+1234567892'),
('CMP1004', 2, 'John Doe', 'Internet', 'Computer Lab, Room 205', 'WiFi not working properly', 'HIGH', 'IN_PROGRESS', '+1234567890'),
('CMP1005', 3, 'Jane Smith', 'Cleaning', 'Sports Complex', 'Garbage not collected for 3 days', 'MEDIUM', 'PENDING', '+1234567891');
