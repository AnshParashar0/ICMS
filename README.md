# 🏛️ ICMS — Infrastructure Complaint Management System

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.2-000000?style=flat&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%2F%20Mongoose-47A248?style=flat&logo=mongodb&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=flat&logo=vite&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Media%20Storage-3448C5?style=flat&logo=cloudinary&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat&logo=jsonwebtokens&logoColor=white)

A modern full-stack web application designed for educational institutions to streamline reporting, tracking, and resolving campus infrastructure issues — powered by **Node.js, Express, React 19, MongoDB Atlas, Cloudinary, and Gmail API OAuth2 notifications**.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Database Schema](#-database-schema)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Future Enhancements](#-future-enhancements)
- [Contributors & Mentorship](#-contributors--mentorship)
- [License](#-license)

---

## 🎯 Overview

In universities and colleges, students and staff often encounter infrastructure breakdowns — faulty electrical sockets, broken plumbing, damaged classroom furniture, or Wi-Fi disruptions. Without a centralized digital platform, complaints get lost in paperwork, resolution tracking is opaque, and accountability is missing.

**ICMS** solves this problem by providing:
- **Student Portal**: Instant submission of complaints with photo evidence, priority ratings, and real-time status tracking.
- **Admin Command Center**: Complete oversight of institution-wide complaints, status workflow management, interactive charts, and PDF reporting.
- **Worker Management**: Dedicated workforce tracking to allocate, monitor, and manage maintenance personnel across campus departments.
- **Automated Email Notifications**: Real-time notifications powered by Google OAuth2 for OTP verification, account onboarding, and status transitions.
- **Cloud Media Uploads**: High-speed image uploads and CDN hosting via Cloudinary.

---

## ✨ Key Features

### 👨‍🎓 Student Portal
- **Email Verification (OTP)**: Two-step registration with secure 6-digit email OTP valid for 10 minutes.
- **Complaint Submission**: Log issues with category (Electrical, Plumbing, Furniture, IT, etc.), location details, priority (`LOW`, `MEDIUM`, `HIGH`, `URGENT`), description, and photo upload.
- **Personal Dashboard**: Track history and live status (`PENDING` ⏳, `IN_PROGRESS` ⚙️, `RESOLVED` ✅).
- **Automated Alerts**: Receive an email update the moment an admin updates complaint status.

### 🛡️ Administrator Dashboard
- **Consolidated Complaint Feed**: Filter, search, and sort complaints across all student submissions.
- **Status Workflow**: Update complaint status (`PENDING` → `IN_PROGRESS` → `RESOLVED`) triggering automated emails to the student.
- **Visual Analytics**: Interactive data visualization charts (complaints by category, status breakdown, resolution trends) built with Chart.js and Recharts.
- **Maintenance Worker Management**:
  - Add, edit, delete, and view field workers.
  - Track availability statuses (`AVAILABLE`, `BUSY`, `OFF_DUTY`).
  - View department statistics (Electrical, Plumbing, Carpentry, etc.).
- **PDF Report Generation**: Export formatted complaint summaries using jsPDF and AutoTable.

### 🔒 Security & Performance
- **Stateless JWT Authentication**: Signed tokens with configurable expiration and role validation.
- **Password Protection**: BCrypt cryptographic hashing with 10 salt rounds.
- **Role-Based Access Control (RBAC)**: Middleware gates (`auth.js` and `admin.js`) ensuring students cannot access admin APIs and vice versa.
- **Cloudinary Storage**: File uploads are securely piped to Cloudinary CDN via Multer storage.

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | 18+ | JavaScript server runtime environment |
| **Express.js** | 5.2 | Web application and REST API framework |
| **MongoDB Atlas** | Cloud | Managed NoSQL document database |
| **Mongoose** | 9.9 | Object Data Modeling (ODM) library for MongoDB |
| **jsonwebtoken** | 9.0 | JWT generation, signing, and verification |
| **bcryptjs** | 3.0 | Secure password hashing |
| **Cloudinary** | 1.41 | Cloud-based media storage and image optimization |
| **multer & multer-storage-cloudinary** | 2.2 / 4.0 | Multipart form-data handling and direct cloud upload |
| **Google APIs / Gmail OAuth2** | — | Secure email delivery for OTP and status notifications |
| **cors & dotenv** | — | Cross-origin resource sharing & environment configuration |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | 19.2 | Frontend user interface library |
| **Vite** | 8.0 | Next-generation frontend build tool and dev server |
| **React Router** | 7.13 | Client-side routing and navigation |
| **Chart.js & react-chartjs-2** | 4.5 / 5.3 | Analytics and data visualization charts |
| **Recharts** | 3.8 | Composable SVG chart components |
| **Framer Motion & GSAP** | 12.38 / 3.15 | Smooth UI animations and micro-interactions |
| **React Toastify** | 11.0 | Real-time toast notifications |
| **jsPDF & jspdf-autotable** | 4.2 / 5.0 | Client-side PDF generation and table exports |
| **date-fns** | 4.1 | Date formatting and manipulation |

### Landing Page
- Located in `landing_page/`: Responsive presentation website built with semantic HTML5, modern CSS3 animations, and assets.

---

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────┐
│                   Client Layer                         │
│  ┌─────────────────────────┐  ┌─────────────────────┐  │
│  │ React 19 Frontend (Vite)│  │ Landing Page (HTML) │  │
│  │ Student & Admin Portals │  │ Info & Quick Links  │  │
│  └────────────┬────────────┘  └─────────────────────┘  │
└───────────────┼────────────────────────────────────────┘
                │ REST API Calls (JSON & FormData) + Bearer JWT
┌───────────────▼────────────────────────────────────────┐
│             Backend Layer (Node.js + Express 5)        │
│  ┌───────────────┐  ┌────────────────┐  ┌───────────┐  │
│  │ Auth Routes   │  │Complaints Route│  │  Workers  │  │
│  └───────┬───────┘  └───────┬────────┘  └─────┬─────┘  │
│          │ JWT / BCrypt     │ Multer / Cloud  │ RBAC   │
│  ┌───────▼──────────────────▼─────────────────▼─────┐  │
│  │ Middleware: auth.js, admin.js, cloudinary.js     │  │
│  └───────┬──────────────────┬─────────────────┬─────┘  │
└──────────┼──────────────────┼─────────────────┼────────┘
           │ Mongoose         │ HTTPS REST      │ OAuth2
┌──────────▼────────┐ ┌───────▼────────┐ ┌──────▼────────┐
│   MongoDB Atlas   │ │   Cloudinary   │ │   Gmail API   │
│ users, complaints │ │ Uploaded photo │ │ OTP & status  │
│ & workers docs    │ │ evidence CDN   │ │ update emails │
└───────────────────┘ └────────────────┘ └───────────────┘
```

---

## 🗄️ Database Schema

ICMS uses MongoDB with three main Mongoose collections. For complete configuration steps and troubleshooting, see the [DATABASE_SETUP.md](file:///c:/Users/ASUS/Desktop/ICMS/DATABASE_SETUP.md) guide.

### 1. `users` Collection
- `_id`: ObjectId (Primary key)
- `name`: String (Required, max 100)
- `email`: String (Required, Unique, lowercase)
- `password`: String (Required, BCrypt hash)
- `role`: Enum `['STUDENT', 'ADMIN']` (Default: `'STUDENT'`)
- `contact_number`: String (Optional)
- `created_at` / `updated_at`: Timestamps

### 2. `complaints` Collection
- `_id`: ObjectId (Primary key)
- `complaint_id`: String (Unique business ID, e.g. `CMP1711122334455`)
- `user_id`: ObjectId (Ref to `User`)
- `student_name`: String
- `category`: String (Electrical, Plumbing, Furniture, IT, etc.)
- `location`: String (Hostel, Room, Academic Block)
- `description`: String
- `priority`: Enum `['LOW', 'MEDIUM', 'HIGH', 'URGENT']` (Default: `'MEDIUM'`)
- `status`: Enum `['PENDING', 'IN_PROGRESS', 'RESOLVED']` (Default: `'PENDING'`)
- `contact_number`: String
- `imagePath`: String (Cloudinary hosted secure URL)
- `created_at` / `updated_at`: Timestamps

### 3. `workers` Collection
- `_id`: ObjectId (Primary key)
- `name`: String
- `department`: String (Electrical, Plumbing, Carpentry, etc.)
- `phone`: String
- `email`: String
- `status`: Enum `['AVAILABLE', 'BUSY', 'OFF_DUTY']` (Default: `'AVAILABLE'`)
- `createdAt`: Timestamp

---

## 📁 Project Structure

```
ICMS/
├── backend/
│   ├── config/
│   │   ├── cloudinary.js       # Cloudinary & Multer upload config
│   │   └── db.js               # MongoDB Mongoose connection handler
│   ├── middleware/
│   │   ├── admin.js            # Admin role validation middleware
│   │   └── auth.js             # JWT verification middleware
│   ├── models/
│   │   ├── Complaint.js        # Mongoose Complaint schema
│   │   ├── User.js             # Mongoose User schema
│   │   └── Worker.js           # Mongoose Worker schema
│   ├── routes/
│   │   ├── auth.js             # Register, verify OTP, login, profile
│   │   ├── complaints.js       # CRUD operations for complaints
│   │   └── workers.js          # Maintenance worker management & stats
│   ├── scripts/
│   │   └── seed.js             # Database seeding (Admin & sample workers)
│   ├── utils/
│   │   └── email.js            # Gmail API OAuth2 email dispatcher
│   ├── .env.example            # Backend environment template
│   ├── package.json
│   └── server.js               # Main Express application entry point
├── frontend/
│   ├── src/
│   │   ├── assets/             # Images, icons, static assets
│   │   ├── components/         # Reusable UI components & modals
│   │   ├── pages/              # Login, Register, Student & Admin dashboards
│   │   ├── backend-api.js      # Centralized API service client
│   │   ├── App.jsx             # React routing setup
│   │   └── main.jsx            # React root mount
│   ├── .env.example            # Frontend environment template
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── landing_page/               # Marketing & informative landing page
│   ├── index.html
│   └── style.css
├── DATABASE_SETUP.md           # Step-by-step MongoDB setup guide
└── README.md                   # Main documentation
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (or local MongoDB)
- [Cloudinary](https://cloudinary.com/) account (free tier works great)
- Google Cloud Console OAuth 2.0 Credentials (for Gmail API, optional for local testing)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/AnshParashar0/ICMS.git
cd ICMS
```

---

### Step 2: Configure and Start the Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` file from the provided template:
   ```bash
   cp .env.example .env
   ```
4. Fill in your MongoDB connection string, JWT secret, and Cloudinary keys:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/icms_db?retryWrites=true&w=majority
   PORT=8081
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRATION=86400000
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
5. Seed initial database data (Creates default Admin and sample workers):
   ```bash
   npm run seed
   ```
6. Start the backend development server:
   ```bash
   npm run dev
   # Or for production:
   # npm start
   ```
   *The server will run on `http://localhost:8081`.*

---

### Step 3: Configure and Start the Frontend

1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. (Optional) Create `.env` if your backend port differs:
   ```bash
   cp .env.example .env
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173`.*

---

### Step 4: Login with Default Credentials

Once seeded, you can sign in to test the application:

- **Admin Account**:
  - **Email:** `admin@icms.com`
  - **Password:** `admin123`
- **Student Account**:
  - Register a new account via the UI (an OTP will be sent to your email), or use any registered student credentials.

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `MONGO_URI` | MongoDB Atlas or local connection string | `mongodb+srv://user:pass@cluster.mongodb.net/icms_db` |
| `PORT` | Port for Express backend server | `8081` |
| `JWT_SECRET` | Secret key for signing JSON Web Tokens | `my_jwt_secret_phrase` |
| `JWT_EXPIRATION` | Token validity duration in milliseconds | `86400000` (24h) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account cloud name | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | `abcdefghijklmnopqrstuv` |
| `GMAIL_CLIENT_ID` | Google Cloud OAuth2 Client ID | `xxx.apps.googleusercontent.com` |
| `GMAIL_CLIENT_SECRET` | Google Cloud OAuth2 Client Secret | `GOCSPX-xxxx` |
| `GMAIL_REFRESH_TOKEN` | OAuth2 Refresh Token for Gmail API | `1//04xxx...` |
| `GMAIL_FROM_EMAIL` | Sender email address for outgoing alerts | `icms.medicaps@gmail.com` |

### Frontend (`frontend/.env`)

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Base endpoint URL for backend API | `http://localhost:8081/api` |
| `VITE_UPLOADS_BASE_URL` | Base endpoint for uploads | `http://localhost:8081` |

---

## 📡 API Endpoints

### 🔐 Authentication (`/api/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/auth/ping` | Public | Service health check |
| `POST` | `/api/auth/register` | Public | Register student details and trigger OTP email |
| `POST` | `/api/auth/verify-otp` | Public | Validate OTP and activate student account |
| `POST` | `/api/auth/resend-otp` | Public | Request a fresh OTP email |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT token |
| `GET` | `/api/auth/profile` | Authenticated | Retrieve current user profile |

### 📝 Complaints (`/api/complaints`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/complaints` | Student | Submit complaint with multipart image upload (Cloudinary) |
| `GET` | `/api/complaints/my` | Student | Retrieve all complaints submitted by the authenticated student |
| `GET` | `/api/complaints` | Admin | Retrieve all institutional complaints |
| `PUT` | `/api/complaints/:id/status` | Admin | Update status (`PENDING`, `IN_PROGRESS`, `RESOLVED`) & alert student |
| `DELETE` | `/api/complaints/:id` | Admin | Remove a complaint |

### 👷 Workers & Maintenance (`/api/workers`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/workers` | Admin | List all registered maintenance workers |
| `GET` | `/api/workers/stats` | Admin | Department-wise worker headcount and stats |
| `GET` | `/api/workers/department/:dept` | Admin | Filter workers by department |
| `POST` | `/api/workers` | Admin | Register new maintenance worker |
| `PUT` | `/api/workers/:id` | Admin | Update worker details or availability status |
| `DELETE` | `/api/workers/:id` | Admin | Delete a worker record |

---

## 🔮 Future Enhancements

- 🤖 **AI-Assisted Priority & Routing**: Auto-categorize complaints and suggest priority using NLP based on the problem description.
- 📱 **Mobile Application**: Cross-platform companion app for on-site staff and students using React Native.
- 🔔 **Web Push Notifications**: In-browser real-time push alerts via Service Workers.
- ⏱️ **SLA & Escalation Engine**: Automated escalation for high/urgent priority issues exceeding resolution time targets.
- 📊 **Worker Assignment Workflow**: Direct complaint-to-worker dispatching with SMS/WhatsApp notifications.

---

## 👨‍💻 Contributors & Mentorship

| Name | Role |
|---|---|
| **Ansh Parashar** | Full Stack Developer |
| **Ansh Gupta** | Testing Lead |
| **Anshul Gupta** | Idea & Innovation Lead |
| **Anmol Jain** | Prompting & AI Integration Lead |

### Academic Mentorship
- **Department of Computer Science & Engineering**
- **Medi-Caps University, Indore**

---

## 📄 License

This project is developed for educational and academic purposes at Medi-Caps University.

---

> Built with 💻 by the ICMS Team
