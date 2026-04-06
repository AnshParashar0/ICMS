# 🏛️ ICMS — Infrastructure Complaint Management System

![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.0-6DB33F?style=flat&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat&logo=jsonwebtokens&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat&logo=vite&logoColor=white)

A full-stack web application that enables students to report infrastructure issues and allows administrators to manage, track, and resolve complaints efficiently — with real-time email notifications.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Future Enhancements](#future-enhancements)
- [Contributors](#contributors)

---

## 🎯 Overview

ICMS addresses a common problem in educational institutions — students have no formal, trackable way to report infrastructure issues like electrical faults, plumbing problems, broken furniture, or internet outages. Without a centralized system, complaints get lost, resolution is slow, and there's no accountability.

ICMS solves this by providing:
- A student-facing portal to submit, track, and manage complaints
- An admin dashboard with full complaint oversight, status management, and analytics
- Automated email notifications to keep students informed of every status update
- Role-based access control ensuring security at every level

---

## ✨ Features

### Student
- Register and login with email/password
- Submit infrastructure complaints with category, location, description, priority, and photo
- View all personal complaints with real-time status
- Receive email notifications when complaint status changes
- Secure JWT-based session management

### Admin
- View all complaints from all students in one dashboard
- Filter and search complaints by status, category, priority, or keyword
- Update complaint status (Pending → In Progress → Resolved)
- Visual analytics — status overview and complaints by category charts
- Automatic email sent to student on every status change

### Security
- JWT authentication with role-based access control
- Protected routes — students cannot access admin pages and vice versa
- Passwords stored as BCrypt hashes
- Spring Security filter chain with stateless sessions

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Java | 17 | Programming language |
| Spring Boot | 3.2.0 | Application framework |
| Spring Security | 6.2 | Authentication & authorization |
| Spring Data JPA | 3.2 | Database ORM |
| Hibernate | 6.3 | JPA implementation |
| jjwt | 0.11 | JWT token generation & validation |
| Spring Mail | 3.2 | Email notifications via Gmail SMTP |
| Lombok | 1.18 | Boilerplate reduction |
| MySQL Connector | 8.0 | Database driver |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18 | UI framework |
| Vite | 5.0 | Build tool & dev server |
| React Router | 6 | Client-side routing |
| Bootstrap | 5.3 | CSS framework |
| Bootstrap Icons | 1.11 | Icon library |
| React Toastify | 10 | Toast notifications |
| Axios / Fetch API | — | HTTP requests |

### Database & Infrastructure
| Technology | Purpose |
|---|---|
| MySQL 8.0 | Relational database |
| Railway | Backend deployment |
| Vercel | Frontend deployment |
| Gmail SMTP | Email delivery |
| File System | Complaint image storage |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────┐
│           Frontend (React + Vite)        │
│  Login │ Student Dashboard │ Admin Panel │
└──────────────────┬──────────────────────┘
                   │ REST API + JWT
┌──────────────────▼──────────────────────┐
│         Backend (Spring Boot)            │
│  AuthController │ ComplaintController    │
│  JwtFilter      │ EmailService           │
└────────┬─────────────────────┬──────────┘
         │ JPA/Hibernate        │ SMTP
┌────────▼────────┐    ┌────────▼────────┐
│   MySQL DB      │    │   Gmail SMTP    │
│ users           │    │ Status emails   │
│ complaints      │    │ Welcome emails  │
└─────────────────┘    └─────────────────┘
```

---

## 🗄️ Database Schema

### `users` table
| Column | Type | Constraints |
|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT |
| name | VARCHAR(255) | NOT NULL |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password | VARCHAR(255) | NOT NULL (BCrypt) |
| role | ENUM | STUDENT / ADMIN |
| contact_number | VARCHAR(20) | NULLABLE |
| created_at | DATETIME | Auto-set |
| updated_at | DATETIME | Auto-set |

### `complaints` table
| Column | Type | Constraints |
|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT |
| complaint_id | VARCHAR(255) | UNIQUE (e.g. CMP1234) |
| user_id | BIGINT | FK → users.id |
| category | VARCHAR(50) | NOT NULL |
| location | VARCHAR(255) | NOT NULL |
| description | TEXT | NOT NULL |
| priority | ENUM | LOW / MEDIUM / HIGH / URGENT |
| status | ENUM | PENDING / IN_PROGRESS / RESOLVED |
| contact_number | VARCHAR(20) | NULLABLE |
| image_path | VARCHAR(500) | NULLABLE |
| created_at | DATETIME | Auto-set |
| updated_at | DATETIME | Auto-set |

**Relationship:** One `user` → many `complaints` (one-to-many)

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8.0+
- Maven 3.8+

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/icms.git
cd icms/backend

# Configure application.properties
# Update DB credentials, JWT secret, Gmail credentials

# Build and run
mvn clean install
mvn spring-boot:run
```

### Frontend Setup

```bash
cd icms/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Database Setup

```sql
CREATE DATABASE icms_db;
USE icms_db;

-- Tables are auto-created by Hibernate (ddl-auto=update)

-- Insert admin user (update password hash accordingly)
INSERT INTO users (name, email, password, role, contact_number, created_at, updated_at)
VALUES ('Admin', 'admin@icms.com', '$2a$10$...bcrypt_hash...', 'ADMIN', '0000000000', NOW(), NOW());
```

---

## ⚙️ Environment Variables

### Backend (`application.properties`)

```properties
# Server
server.port=${PORT:8081}

# Database
spring.datasource.url=${SPRING_DATASOURCE_URL:jdbc:mysql://localhost:3306/icms_db}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME:root}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD:yourpassword}

# JWT
jwt.secret=${JWT_SECRET:yourSecretKey}
jwt.expiration=${JWT_EXPIRATION:86400000}

# Email
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${SPRING_MAIL_USERNAME:yourgmail@gmail.com}
spring.mail.password=${SPRING_MAIL_PASSWORD:yourapppassword}

# File Upload
file.upload.dir=${FILE_UPLOAD_DIR:uploads/complaints}
```

### Frontend (`.env`)

```env
VITE_API_BASE_URL=http://localhost:8081/api
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new student |
| POST | `/api/auth/login` | Public | Login and get JWT token |
| POST | `/api/auth/verify-otp` | Public | Verify email OTP and create account |
| POST | `/api/auth/resend-otp` | Public | Resend OTP to email |

### Complaints
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/complaints` | Student | Submit new complaint |
| GET | `/api/complaints/my` | Student | Get own complaints |
| GET | `/api/complaints` | Admin | Get all complaints |
| PUT | `/api/complaints/{id}/status` | Admin | Update complaint status |
| DELETE | `/api/complaints/{id}` | Admin | Delete complaint |

---

## 🔮 Future Enhancements

- **Worker Management** — Assign complaints to specific maintenance workers by department
- **Complaint Timeline** — Full history of status changes with timestamps
- **Push Notifications** — Browser push notifications for real-time updates
- **Mobile App** — React Native app for easier complaint submission on mobile
- **PDF Export** — Admin can download complaint reports as PDF/Excel
- **Analytics Dashboard** — Advanced charts — monthly trends, resolution time, category breakdown
- **Multi-institution Support** — Support multiple colleges/campuses under one system
- **AI Priority Suggestion** — Auto-suggest complaint priority based on description using NLP
- **SLA Tracking** — Service level agreement monitoring with escalation alerts
- **Dark Mode** — Full dark mode support across all pages
- **Offline Support** — PWA with offline complaint drafting

---

## 👨‍💻 Contributors

| Name | Role |
|---|---|
| Ansh Parashar | Full Stack Developer |

### Mentor / Guide
- Department of Computer Science & Engineering
- Medicaps University, Indore

---

## 📄 License

This project is developed for academic purposes at Medicaps University.

---

> Built with ❤️ using Spring Boot + React
