# ICMS Backend - Infrastructure Complaint Management System

A complete Spring Boot backend for the Infrastructure Complaint Management System with MySQL database.

## 🚀 Features

- **User Authentication**: JWT-based authentication with role-based access
- **Complaint Management**: Full CRUD operations for complaints
- **Role-based Access**: Student and Admin roles with different permissions
- **Database Integration**: MySQL with JPA/Hibernate
- **RESTful APIs**: Clean and well-documented API endpoints
- **Security**: Spring Security with JWT tokens
- **Validation**: Input validation and error handling

## 📋 Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- MySQL 8.0 or higher
- IDE (IntelliJ IDEA, Eclipse, etc.)

## 🛠️ Setup Instructions

### 1. Database Setup

Create a MySQL database named `icms_db`:

```sql
CREATE DATABASE icms_db;
```

### 2. Configuration

Update the database credentials in `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/icms_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 3. Run the Application

#### Using Maven:

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

#### Using IDE:

- Import the project as a Maven project
- Run the `IcmsApplication.java` main class

The application will start on `http://localhost:8080`

## 📚 API Endpoints

### Authentication

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "student123"
}
```

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "student123",
  "contactNumber": "+1234567890"
}
```

### Complaints

#### Get All Complaints (Admin only)
```
GET /api/complaints
Authorization: Bearer <jwt_token>
```

#### Get My Complaints (Student)
```
GET /api/complaints/my-complaints
Authorization: Bearer <jwt_token>
```

#### Create Complaint
```
POST /api/complaints
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "category": "Electrical",
  "location": "Room 101, Building A",
  "description": "Light fixture not working",
  "priority": "MEDIUM",
  "contactNumber": "+1234567890"
}
```

#### Update Complaint Status (Admin only)
```
PUT /api/complaints/{id}/status?status=RESOLVED
Authorization: Bearer <jwt_token>
```

#### Filter Complaints (Admin only)
```
GET /api/complaints/filter?status=PENDING&search=electrical
Authorization: Bearer <jwt_token>
```

#### Get Statistics (Admin only)
```
GET /api/complaints/statistics
Authorization: Bearer <jwt_token>
```

## 🗄️ Database Schema

### Users Table
- `id` (BIGINT, Primary Key)
- `name` (VARCHAR(100))
- `email` (VARCHAR(100), Unique)
- `password` (VARCHAR(255))
- `role` (ENUM: STUDENT, ADMIN)
- `contact_number` (VARCHAR(20))
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Complaints Table
- `id` (BIGINT, Primary Key)
- `complaint_id` (VARCHAR(20), Unique)
- `user_id` (BIGINT, Foreign Key)
- `student_name` (VARCHAR(100))
- `category` (VARCHAR(50))
- `location` (VARCHAR(255))
- `description` (TEXT)
- `priority` (ENUM: LOW, MEDIUM, HIGH, URGENT)
- `status` (ENUM: PENDING, IN_PROGRESS, RESOLVED)
- `contact_number` (VARCHAR(20))
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## 🔐 Default Users

### Admin User
- Email: `admin@icms.com`
- Password: `admin123`
- Role: `ADMIN`

### Sample Students
- Email: `john@example.com`
- Password: `student123`
- Role: `STUDENT`

- Email: `jane@example.com`
- Password: `student123`
- Role: `STUDENT`

## 🛡️ Security

- JWT tokens for authentication
- Role-based authorization
- Password encryption with BCrypt
- CORS configuration
- Input validation

## 🧪 Testing

Run the test suite:

```bash
mvn test
```

## 📝 Project Structure

```
backend/
├── src/main/java/com/icms/
│   ├── IcmsApplication.java          # Main application class
│   ├── config/                       # Configuration classes
│   │   ├── JwtUtil.java
│   │   ├── JwtAuthenticationFilter.java
│   │   └── SecurityConfig.java
│   ├── controller/                   # REST controllers
│   │   ├── AuthController.java
│   │   └── ComplaintController.java
│   ├── dto/                         # Data Transfer Objects
│   │   ├── LoginRequest.java
│   │   ├── RegisterRequest.java
│   │   └── ComplaintRequest.java
│   ├── model/                       # JPA entities
│   │   ├── User.java
│   │   └── Complaint.java
│   ├── repository/                  # Spring Data repositories
│   │   ├── UserRepository.java
│   │   └── ComplaintRepository.java
│   └── service/                     # Business logic
│       ├── UserService.java
│       └── ComplaintService.java
├── src/main/resources/
│   ├── application.properties        # Application configuration
│   └── schema.sql                   # Database schema
└── pom.xml                          # Maven configuration
```

## 🔧 Configuration

### JWT Settings
```properties
jwt.secret=your-secret-key
jwt.expiration=86400000  # 24 hours
```

### Server Settings
```properties
server.port=8080
server.servlet.context-path=/api
```

## 🚀 Deployment

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM openjdk:17-jdk-slim
COPY target/icms-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

Build and run:

```bash
mvn clean package
docker build -t icms-backend .
docker run -p 8080:8080 icms-backend
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.
