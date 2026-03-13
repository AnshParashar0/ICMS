# ICMS Database Setup Guide
## MySQL Workbench Configuration

### Step 1: Open MySQL Workbench
1. Launch MySQL Workbench
2. Connect to your MySQL server using root credentials

### Step 2: Create Database
1. Click on the "Create new schema" icon (database with + sign)
2. Enter schema name: `icms_db`
3. Click "Apply"
4. Click "Apply" again on the confirmation screen

### Step 3: Update Application Properties
Open the file: `backend/src/main/resources/application.properties`

Update these lines with your MySQL credentials:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/icms_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

**Common configurations:**

**If you use root user:**
```properties
spring.datasource.username=root
spring.datasource.password=your_root_password
```

**If you use a different user:**
```properties
spring.datasource.username=icms_user
spring.datasource.password=icms_password
```

### Step 4: Run SQL Script (Optional)
The backend will automatically create tables when you run it (due to `spring.jpa.hibernate.ddl-auto=update`), but you can also run the script manually:

In MySQL Workbench, select the `icms_db` database and run:

```sql
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
```

### Step 5: Test Connection
1. Save the application.properties file
2. Run the backend application
3. Check console for successful database connection

### Step 6: Common Issues & Solutions

**Issue: "Access denied for user"**
- Solution: Update username/password in application.properties
- Make sure the user has privileges on icms_db database

**Issue: "Unknown database 'icms_db'"**
- Solution: Create the database first (Step 2)
- Check spelling in application.properties

**Issue: "Server timezone issue"**
- Solution: The `serverTimezone=UTC` in the URL should fix this
- Alternative: Use your local timezone instead of UTC

**Issue: "Connection timeout"**
- Solution: Check if MySQL server is running
- Verify port number (usually 3306)

### Step 7: Run the Application

```bash
cd backend
mvn spring-boot:run
```

You should see output like:
```
Started IcmsApplication in X.XXX seconds
```

### Step 8: Verify Database Tables
After running the application, check MySQL Workbench:
1. Refresh the schema
2. You should see `users` and `complaints` tables
3. Check if the sample data is inserted

### Default Login Credentials

Once setup is complete:

**Admin Login:**
- Email: admin@icms.com
- Password: admin123

**Student Login:**
- Email: john@example.com
- Password: student123

### Troubleshooting

If you encounter issues:

1. **Check MySQL Service**: Make sure MySQL is running
2. **Verify Port**: Default is 3306
3. **Check Credentials**: Ensure username/password are correct
4. **Firewall**: Allow connections on port 3306
5. **Permissions**: Ensure the user has CREATE, INSERT, UPDATE, DELETE privileges

### Quick Setup Commands

If you prefer command line:

```sql
-- Create database
CREATE DATABASE icms_db;

-- Create user (optional)
CREATE USER 'icms_user'@'localhost' IDENTIFIED BY 'icms_password';
GRANT ALL PRIVILEGES ON icms_db.* TO 'icms_user'@'localhost';
FLUSH PRIVILEGES;

-- Use the database
USE icms_db;

-- Run the schema (copy from schema.sql file)
SOURCE /path/to/backend/src/main/resources/schema.sql;
```

This should get your ICMS backend running with MySQL database!
