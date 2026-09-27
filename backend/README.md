# ExamPulse Backend - Online Quiz & Examination System REST API

A production-grade, enterprise-ready RESTful backend built with **Java 17**, **Spring Boot 3.3.4**, **Spring Data JPA**, **Spring Security (Stateless JWT)**, and **MySQL 8.0**. Designed to power academic and corporate proctored examination platforms with strict role-based access control, candidate integrity guarantees, and automated score evaluation.

---

## 🏛️ Architecture & Clean Layering

The backend enforces a clean 5-tier architecture:

```text
HTTP Client (React Frontend / Mobile / Swagger)
              │
              ▼
   ┌──────────────────────┐
   │     Controllers      │  REST Endpoints, DTO Validation (@Valid), Security PreAuthorize
   └──────────┬───────────┘
              │
              ▼
   ┌──────────────────────┐
   │   Service Layer      │  Business logic, exam evaluation, randomized masking, transactions
   └──────────┬───────────┘
              │
              ▼
   ┌──────────────────────┐
   │  Repository Layer    │  Spring Data JPA Interfaces, custom queries, index optimization
   └──────────┬───────────┘
              │
              ▼
   ┌──────────────────────┐
   │     JPA Entities     │  Hibernate ORM Models (User, Subject, Exam, Question, Attempt, Answer)
   └──────────┬───────────┘
              │
              ▼
   ┌──────────────────────┐
   │      MySQL 8.0       │  Relational persistence with foreign keys, cascading, and indexes
   └──────────────────────┘
```

---

## 📁 Project Directory Structure

```text
backend/
├── pom.xml                                    # Maven configuration (Spring Boot 3.3.4, Java 17)
├── README.md                                  # Comprehensive architecture and API documentation
├── .mvn/wrapper/                              # Maven wrapper configuration
└── src/
    ├── main/
    │   ├── java/com/example/quizsystem/
    │   │   ├── QuizSystemApplication.java     # Spring Boot main application class
    │   │   ├── config/
    │   │   │   ├── CorsConfig.java            # CORS policy (allows http://localhost:5173)
    │   │   │   ├── DataSeeder.java            # Automatic seed records on fresh boot
    │   │   │   └── OpenApiConfig.java         # Swagger / OpenAPI 3.0 specification
    │   │   ├── controller/
    │   │   │   ├── AdminAnalyticsController.java  # Admin KPIs and student enrollment listing
    │   │   │   ├── AttemptController.java     # Start and submit candidate exam attempts
    │   │   │   ├── AuthController.java        # Registration, login, and profile
    │   │   │   ├── ExamController.java        # Exam CRUD, publishing, duplication
    │   │   │   ├── LeaderboardController.java # Academic rank list and scholar standing
    │   │   │   ├── QuestionController.java    # Question bank management per exam
    │   │   │   ├── ResultController.java      # Attempt audit, student history, diagnostics
    │   │   │   └── SubjectController.java     # Academic subject catalog CRUD
    │   │   ├── dto/                           # Data Transfer Objects with validation annotations
    │   │   │   ├── AdminAnalyticsDto.java
    │   │   │   ├── AnswerSubmissionDto.java
    │   │   │   ├── AttemptResultDto.java
    │   │   │   ├── AuthRequest.java
    │   │   │   ├── AuthResponse.java
    │   │   │   ├── ExamDto.java
    │   │   │   ├── LeaderboardEntryDto.java
    │   │   │   ├── QuestionAdminDto.java      # Includes correctAnswer & explanation
    │   │   │   ├── QuestionStudentDto.java    # Correct answer & explanation MASKED
    │   │   │   ├── RegisterRequest.java
    │   │   │   ├── StartAttemptResponse.java
    │   │   │   ├── StudentPerformanceDto.java
    │   │   │   ├── SubjectDto.java
    │   │   │   ├── SubmitAttemptRequest.java
    │   │   │   ├── SubmitAttemptResponse.java
    │   │   │   └── UserDto.java
    │   │   ├── entity/                        # JPA Entities
    │   │   │   ├── Answer.java
    │   │   │   ├── Attempt.java
    │   │   │   ├── AttemptStatus.java         # IN_PROGRESS, PASS, FAIL
    │   │   │   ├── Exam.java
    │   │   │   ├── Question.java
    │   │   │   ├── Role.java                  # ROLE_ADMIN, ROLE_STUDENT
    │   │   │   ├── Subject.java
    │   │   │   └── User.java
    │   │   ├── exception/                     # Centralized error handling
    │   │   │   ├── BadRequestException.java
    │   │   │   ├── DuplicateResourceException.java
    │   │   │   ├── ErrorResponse.java
    │   │   │   ├── GlobalExceptionHandler.java# @RestControllerAdvice handling 400, 401, 404, 409, 500
    │   │   │   ├── ResourceNotFoundException.java
    │   │   │   └── UnauthorizedException.java
    │   │   ├── repository/                    # Spring Data JPA Repositories
    │   │   │   ├── AnswerRepository.java
    │   │   │   ├── AttemptRepository.java
    │   │   │   ├── ExamRepository.java
    │   │   │   ├── QuestionRepository.java
    │   │   │   ├── SubjectRepository.java
    │   │   │   └── UserRepository.java
    │   │   ├── security/                      # Spring Security + JWT Architecture
    │   │   │   ├── JwtAuthenticationFilter.java   # Bearer token validation filter
    │   │   │   ├── JwtUtils.java              # JJWT token generation and signing
    │   │   │   ├── SecurityConfig.java        # SecurityFilterChain, BCrypt, RBAC rules
    │   │   │   └── UserDetailsServiceImpl.java# UserDetailsService loading database users
    │   │   └── service/                       # Service Layer Interfaces & Implementations
    │   │       ├── AnalyticsService.java
    │   │       ├── AttemptService.java
    │   │       ├── AuthService.java
    │   │       ├── ExamService.java
    │   │       ├── QuestionService.java
    │   │       ├── SubjectService.java
    │   │       └── impl/                      # Transactional Service Implementations
    │   └── resources/
    │       ├── application.properties         # Server port, MySQL URL, JPA config, JWT secrets
    │       └── schema.sql                     # Full MySQL DDL script with constraints and indexes
    └── test/                                  # Automated Unit & Integration Tests
        └── java/com/example/quizsystem/
            ├── AttemptEvaluationTest.java     # Verifies candidate question masking & evaluation
            └── QuizSystemApplicationTests.java# Smoke test with in-memory H2 profile
```

---

## ⚡ Prerequisites

- **Java JDK**: Version 17 or higher
- **Build Tool**: Apache Maven 3.8+ (or Maven Wrapper)
- **Database**: MySQL Server 8.0+

---

## 🛢️ Database Setup

1. Start your local MySQL service.
2. Connect to MySQL and create the target database:

```sql
CREATE DATABASE quiz_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. Configure your credentials in `src/main/resources/application.properties` (or export environment variables):

| Parameter | Environment Variable | Default Value |
|-----------|----------------------|---------------|
| JDBC URL | `DB_URL` | `jdbc:mysql://localhost:3306/quiz_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true` |
| Username | `DB_USERNAME` | `root` |
| Password | `DB_PASSWORD` | *(empty string)* |
| Server Port | `PORT` | `8080` |
| JWT Secret | `JWT_SECRET` | `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970` |
| Token Expiry | `JWT_EXPIRATION_MS` | `86400000` (24 hours) |

> **Note:** Hibernate is set to `spring.jpa.hibernate.ddl-auto=update`. Tables are automatically created and updated upon application boot.

---

## 🚀 Running the Application

### Option A: Using Installed Maven
```bash
cd backend
mvn clean spring-boot:run
```

### Option B: Using Maven Wrapper (Windows PowerShell)
```powershell
cd backend
./mvnw.cmd spring-boot:run
```

### Option C: Packaged JAR Execution
```bash
cd backend
mvn clean package -DskipTests
java -jar target/quiz-system-backend-1.0.0.jar
```

The server starts on `http://localhost:8080`.

---

## 🔑 Pre-Seeded Academic Accounts

On initial launch, `DataSeeder.java` automatically seeds the database with realistic faculty and candidate records:

### 1. Faculty Administrator
- **Email:** `r.verma@apexuniv.edu.in`
- **Password:** `DeanAdmin@2026`
- **Role:** `ROLE_ADMIN`
- **Name:** Prof. Rajesh Verma (Department Head, CSE)

### 2. Candidate Students
- **Password for all students:** `ApexSecure@2026`
- **Role:** `ROLE_STUDENT`
  - `aarav.sharma@apexuniv.edu.in` (Roll: `CS2024-042`)
  - `ananya.iyer@apexuniv.edu.in` (Roll: `CS2024-003`)
  - `rohan.deshmukh@apexuniv.edu.in` (Roll: `CS2024-089`)
  - `priya.nair@apexuniv.edu.in` (Roll: `CS2024-115`)

---

## 🔒 Security Design & Question Masking Guarantee

### Candidate Integrity Guarantee
- When an exam attempt starts via `POST /api/attempts/start/{examId}`, the service maps questions to `QuestionStudentDto`.
- **`correctAnswer` and `explanation` are strictly suppressed from the candidate payload.**
- Questions are dynamically randomized per attempt.
- Candidates receive the correct answers and detailed topic explanations **only after** `POST /api/attempts/{attemptId}/submit` is processed and recorded.

### Duplicate Submission Prevention
- Once an attempt has been transitioned from `IN_PROGRESS` to `PASS` or `FAIL`, any subsequent submission attempt on that ID is rejected with `400 Bad Request`.
- Submission verifies candidate ownership: students can only submit attempts created under their own authenticated account.

---

## 📚 Complete REST API Catalog

All secure endpoints require the `Authorization: Bearer <JWT>` header.

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/auth/register` | Public | Register new candidate student profile |
| `POST` | `/api/auth/login` | Public | Authenticate user and obtain JWT token |
| `GET` | `/api/auth/me` | Authenticated | Retrieve current authenticated user profile |

### 2. Academic Subjects (`/api/subjects`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/subjects` | Public | List all active subjects with exam counts |
| `GET` | `/api/subjects/{id}` | Public | Get subject details by ID |
| `POST` | `/api/subjects` | Admin | Create new academic subject |
| `PUT` | `/api/subjects/{id}` | Admin | Update existing subject details |
| `DELETE` | `/api/subjects/{id}` | Admin | Delete subject and cascading associations |

### 3. Examination Management (`/api/exams`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/exams` | Public | List exams (students see published; admins see all) |
| `GET` | `/api/exams/{id}` | Public | Get exam metadata and rules |
| `POST` | `/api/exams` | Admin | Create new exam with duration, marks, rules |
| `PUT` | `/api/exams/{id}` | Admin | Update exam configuration |
| `DELETE` | `/api/exams/{id}` | Admin | Delete exam and associated question bank |
| `PATCH`| `/api/exams/{id}/publish` | Admin | Toggle published status (Draft ↔ Published) |
| `POST` | `/api/exams/{id}/duplicate` | Admin | Clone exam configuration with fresh draft code |

### 4. Question Bank (`/api/questions`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/exams/{examId}/questions` | Admin | Get all questions for exam (with correct answers) |
| `GET` | `/api/questions/{id}` | Admin | Get single question details |
| `POST` | `/api/questions` | Admin | Add new multiple-choice question to an exam |
| `PUT` | `/api/questions/{id}` | Admin | Edit question text, options, answer, explanation |
| `DELETE`| `/api/questions/{id}` | Admin | Delete question from question bank |

### 5. Proctored Attempts (`/api/attempts`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/attempts/start/{examId}` | Student | Initiates attempt session, returns masked questions |
| `POST` | `/api/attempts/{attemptId}/submit` | Student | Submits candidate responses, returns score and pass/fail |

### 6. Results & Diagnostics (`/api/results` & `/api/students`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/results/{attemptId}` | Authenticated | Full attempt breakdown with explanations |
| `GET` | `/api/students/{studentId}/attempts` | Authenticated | Candidate's chronological attempt history |
| `GET` | `/api/students/{studentId}/performance` | Authenticated | Score trends, pass/fail ratio, topic insights |
| `GET` | `/api/admin/results` | Admin | Global candidate evaluation audit with filters |

### 7. Academic Standings (`/api/leaderboard`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/leaderboard` | Public | Ranked student list ordered by aggregate points |

### 8. Admin Analytics (`/api/admin`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/admin/analytics` | Admin | System KPIs, completion metrics, activity timeline |
| `GET` | `/api/admin/students` | Admin | All enrolled candidates with department filter |

---

## 📖 Interactive Swagger / OpenAPI Documentation

Once the backend is running, explore and test every endpoint interactively via Swagger UI:
- **Swagger UI:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **OpenAPI JSON Spec:** [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

To authenticate in Swagger UI:
1. Call `POST /api/auth/login` with admin or student credentials.
2. Copy the `token` string from the response.
3. Click the **Authorize** button at the top of Swagger UI.
4. Enter `Bearer <your_token>` and click **Authorize**.

---

## 🧪 Automated Testing

Run the test suite using Maven:

```bash
cd backend
mvn test
```

The test suite runs against an in-memory **H2 database** with no external MySQL dependency:
- `QuizSystemApplicationTests`: Smoke tests Spring context and dependency wiring.
- `AttemptEvaluationTest`: Asserts student question masking, accurate scoring calculation, percentage derivation, and pass/fail threshold evaluation.

---

## 🔗 Connecting the React Frontend

The React frontend (`src/`) is pre-configured with CORS support:
- Origin: `http://localhost:5173`
- Backend API Base URL: `http://localhost:8080`

When switching the frontend from mock mode to live backend mode, simply set `VITE_API_URL=http://localhost:8080` in your frontend environment.
