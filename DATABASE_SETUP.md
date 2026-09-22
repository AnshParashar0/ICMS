# 🍃 ICMS Database Setup Guide (MongoDB & Atlas)

This guide walks you through setting up and configuring the **MongoDB** database for the **Infrastructure Complaint Management System (ICMS)** backend.

ICMS uses **MongoDB** as its primary database alongside **Mongoose ODM** (Object Data Modeling) in Node.js, providing flexible JSON-like document storage, automatic schema validations, and high performance.

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Method 1: Cloud Setup with MongoDB Atlas (Recommended)](#method-1-cloud-setup-with-mongodb-atlas-recommended)
- [Method 2: Local Setup with MongoDB or Docker](#method-2-local-setup-with-mongodb-or-docker)
- [Environment Configuration (`.env`)](#environment-configuration-env)
- [Database Collections & Mongoose Schemas](#database-collections--mongoose-schemas)
- [Seeding Initial Data (Admin & Workers)](#seeding-initial-data-admin--workers)
- [Verifying the Connection](#verifying-the-connection)
- [Troubleshooting & Common Issues](#troubleshooting--common-issues)

---

## 📌 Prerequisites

Before you begin, ensure you have:
- **Node.js** (v18.0.0 or higher) installed
- **npm** (comes with Node.js)
- A web browser (for MongoDB Atlas web console) or **MongoDB Compass** (optional GUI)

---

## ☁️ Method 1: Cloud Setup with MongoDB Atlas (Recommended)

MongoDB Atlas is the official, free cloud-hosted database service. No local installation required.

### Step 1: Create a Free MongoDB Atlas Account
1. Visit [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. Log in and click **"Build a Database"**.
3. Choose the **M0 Free Tier** (Shared).
4. Select your preferred Cloud Provider (e.g., AWS) and region closest to you.
5. Click **"Create Cluster"**.

### Step 2: Create a Database User
1. In the Atlas dashboard, navigate to **Security** → **Database Access**.
2. Click **"Add New Database User"**.
3. Authentication Method: **Password**.
4. Set a Username (e.g., `icms_user`) and a secure Password.
   > **Note:** If your password contains special characters like `@`, `:`, `/`, or `?`, you must URL-encode them or use an alphanumeric password.
5. In **Database User Privileges**, select **"Read and write to any database"** (or specify `icms_db`).
6. Click **"Add User"**.

### Step 3: Configure Network Access (IP Whitelist)
1. In the Atlas dashboard, navigate to **Security** → **Network Access**.
2. Click **"Add IP Address"**.
3. For development, click **"Allow Access from Anywhere"** (`0.0.0.0/0`) or select **"Add Current IP Address"**.
4. Click **"Confirm"**.

### Step 4: Get Your Connection String
1. Go to **Deployment** → **Database**.
2. Click the **"Connect"** button next to your cluster.
3. Select **"Drivers"** (Node.js).
4. Copy the connection string. It will look similar to:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Append the database name `icms_db` before the query parameters:
   ```
   mongodb+srv://icms_user:<your_password>@cluster0.xxxxx.mongodb.net/icms_db?retryWrites=true&w=majority
   ```

---

## 💻 Method 2: Local Setup with MongoDB or Docker

If you prefer running MongoDB locally on your machine:

### Option A: Using Docker (Fastest)
Run the official MongoDB container with a single command:
```bash
docker run -d -p 27017:27017 --name icms-mongodb mongo:latest
```
Your local connection URI will be:
```
mongodb://localhost:27017/icms_db
```

### Option B: Local MongoDB Community Server
1. Download and install [MongoDB Community Server](https://www.mongodb.com/try/download/community).
2. Start the MongoDB service:
   - **Windows**: Started automatically as a Windows Service, or run `net start MongoDB`.
   - **macOS / Linux**: `brew services start mongodb-community` or `sudo systemctl start mongod`.
3. Connect with [MongoDB Compass](https://www.mongodb.com/products/compass) at `mongodb://localhost:27017`.

---

## ⚙️ Environment Configuration (`.env`)

In the `backend/` directory, open or create a `.env` file (you can copy from `backend/.env.example`):

```bash
cd backend
cp .env.example .env
```

Set the `MONGO_URI` variable to your connection string:

```env
# MongoDB Atlas
MONGO_URI=mongodb+srv://icms_user:yourPassword123@cluster0.xxxxx.mongodb.net/icms_db?retryWrites=true&w=majority

# OR Local MongoDB
# MONGO_URI=mongodb://localhost:27017/icms_db

# Server port
PORT=8081

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRATION=86400000

# Gmail API OAuth2 (For OTP and Status Update Emails)
GMAIL_CLIENT_ID=your_gmail_oauth_client_id.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=your_gmail_oauth_client_secret
GMAIL_REFRESH_TOKEN=your_gmail_oauth_refresh_token
GMAIL_FROM_EMAIL=your_email@gmail.com

# Cloudinary (For Complaint Media Uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

## 🗄️ Database Collections & Mongoose Schemas

Mongoose automatically generates the collections upon inserting records. Below is the document structure for each collection:

### 1. `users` Collection (`backend/models/User.js`)
Stores authenticated accounts for students and administrators.

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto | Primary key document identifier |
| `name` | String | Yes | Full name of the user (max 100 chars) |
| `email` | String | Yes | Unique login email address (lowercase, trimmed) |
| `password` | String | Yes | BCrypt hashed password (10 salt rounds) |
| `role` | String | Yes | Enum: `'STUDENT'`, `'ADMIN'` (Default: `'STUDENT'`) |
| `contact_number` | String | No | Phone contact number |
| `created_at` | Date | Auto | Document creation timestamp |
| `updated_at` | Date | Auto | Last updated timestamp |

### 2. `complaints` Collection (`backend/models/Complaint.js`)
Stores reported infrastructure complaints submitted by students.

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto | Primary key document identifier |
| `complaint_id` | String | Yes | Unique business identifier (e.g. `CMP1711122334455`) |
| `user_id` | ObjectId | Yes | Reference (`ref: 'User'`) to the submitting user |
| `student_name` | String | Yes | Student's name at the time of submission |
| `category` | String | Yes | Issue category (Electrical, Plumbing, Furniture, etc.) |
| `location` | String | Yes | Campus location (Hostel, Block, Room No.) |
| `description` | String | Yes | Detailed description of the problem |
| `priority` | String | Yes | Enum: `'LOW'`, `'MEDIUM'`, `'HIGH'`, `'URGENT'` (Default: `'MEDIUM'`) |
| `status` | String | Yes | Enum: `'PENDING'`, `'IN_PROGRESS'`, `'RESOLVED'` (Default: `'PENDING'`) |
| `contact_number` | String | No | Contact number for follow-up |
| `imagePath` | String | No | Secure Cloudinary URL of uploaded evidence image |
| `created_at` | Date | Auto | Document creation timestamp |
| `updated_at` | Date | Auto | Last updated timestamp |

### 3. `workers` Collection (`backend/models/Worker.js`)
Stores maintenance staff profiles used for complaint assignments and department analytics.

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto | Primary key document identifier |
| `name` | String | Yes | Name of the worker |
| `department` | String | No | Department (e.g., Electrical, Plumbing, Carpentry, IT) |
| `phone` | String | No | Contact phone number |
| `email` | String | No | Worker email address |
| `status` | String | Yes | Enum: `'AVAILABLE'`, `'BUSY'`, `'OFF_DUTY'` (Default: `'AVAILABLE'`) |
| `createdAt` | Date | Auto | Creation timestamp |

---

## 🌱 Seeding Initial Data (Admin & Workers)

To initialize your MongoDB database with the default **Admin account** and sample maintenance workers, run the built-in seed script:

```bash
cd backend
npm run seed
```

This will automatically create:
- **Default Admin Account:**
  - **Email:** `admin@icms.com`
  - **Password:** `admin123`
  - **Role:** `ADMIN`
- **Sample Maintenance Workers:**
  - Rajesh Kumar (Electrical — AVAILABLE)
  - Suresh Verma (Plumbing — AVAILABLE)
  - Vikram Singh (Carpentry — AVAILABLE)

---

## 🔍 Verifying the Connection

### 1. Start the Backend Server
```bash
cd backend
npm run dev
# or: npm start
```

Look for the confirmation message in your terminal:
```
Successfully connected to MongoDB Atlas
Server is running on port 8081
```

### 2. Verify with Health Check Endpoint
Open your browser or run curl:
```bash
curl http://localhost:8081/api/auth/ping
```
Expected response:
```json
{
  "status": "ok",
  "service": "ICMS Backend"
}
```

### 3. Inspect in MongoDB Compass or Atlas
Open **MongoDB Compass** or the **Atlas Data Explorer** to view the `icms_db` database and inspect the collections: `users`, `complaints`, and `workers`.

---

## 🛠️ Troubleshooting & Common Issues

### 1. `MongoServerSelectionError: connection timed out` or `querySrv ENOTFOUND`
- **Cause:** Network access is blocked or the IP is not whitelisted in MongoDB Atlas.
- **Solution:** 
  1. Go to Atlas dashboard → **Network Access**.
  2. Click **"Add IP Address"** → **"Allow Access From Anywhere"** (`0.0.0.0/0`).
  3. Ensure your local network/firewall permits outbound connections on port `27017`.

### 2. `MongoServerError: bad auth : authentication failed`
- **Cause:** Invalid database username or password in `MONGO_URI`.
- **Solution:**
  1. Verify the username and password in Atlas → **Database Access**.
  2. If your password contains special characters like `@`, `#`, `%`, or `/`, URL-encode them (e.g., `@` becomes `%40`, `#` becomes `%23`).
  3. Ensure you are specifying the database name in the URI (`...mongodb.net/icms_db?...`).

### 3. `E11000 duplicate key error collection: icms_db.users index: email_1`
- **Cause:** Attempting to register with an email that already exists in the `users` collection.
- **Solution:** Use a different email address or log in with the existing account.

### 4. Admin Login Returns 401 Unauthorized
- **Cause:** Admin user has not been seeded yet or password hash does not match.
- **Solution:** Run `npm run seed` in the `backend/` directory to re-generate the admin user with password `admin123`.

---

> For frontend and general project configuration, please refer to the main [README.md](file:///c:/Users/ASUS/Desktop/ICMS/README.md).
