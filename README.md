# ExamPulse — Full-Stack Online Quiz & Examination System

[![React](https://img.shields.io/badge/Frontend-React_19-61DAFB?logo=react)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring_Boot_3.3.4-6DB33F?logo=springboot)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Language-Java_17+-ED8B00?logo=openjdk)](https://www.oracle.com/java/)
[![MySQL](https://img.shields.io/badge/Database-MySQL_8.0-4479A1?logo=mysql)](https://www.mysql.com/)
[![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS_v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/Academic-NHITM_IT-indigo)](#academic-attribution)

---

## 📌 Overview

**ExamPulse** is an enterprise-grade, full-stack Online Evaluation & Examination System built for high-integrity academic assessments. Designed with a clean layered architecture, ExamPulse features real-time proctoring countdowns, randomized MCQ evaluation engines, dual-mode DEMO/LIVE environment switching, and role-based faculty analytics.

---

## 👥 Academic Team & Project Attribution

- **Institution:** NHITM Engineering College
- **Department:** Department of Information Technology
- **Academic Session:** 2025–2026 (Semester VI)

### Project Team Members
1. **Bhavesh Thakur** — Roll No. 53 (*Full Stack & System Architecture*) `[Lead]`
2. **Atharva Chavan** — Roll No. 6 (*Frontend UI/UX & State Architecture*)
3. **Aditya Mhaisekar** — Roll No. 24 (*Backend Services & Database Design*)

---

## ✨ Key Features

### 🎓 Student Portal
- **Dashboard & Honor Roll:** Overview of enrolled subjects, active exam notifications, and personal rank.
- **Randomized Question Engine:** Questions served in randomized order during examinations without exposing correct answers.
- **Real-Time Proctor Timer:** Countdown timer with automated submission on expiry.
- **Instant Result Evaluation:** Automated score calculation, percentage, and pass/fail determination.
- **Attempt History & Performance Analytics:** Historical score breakdown, trend charts, and topic mastery.
- **Departmental Leaderboard:** Valedictorian podium and top accuracy rankings.

### 🛡️ Faculty Admin Portal
- **Subject & Course Management:** Add, edit, and organize academic courses.
- **Exam Management:** Create timed exams, configure total/passing marks, publish/unpublish tests.
- **Question Bank:** Add multiple-choice questions with difficulty tags, options, and explanations.
- **Institutional Analytics:** Student participation trends, pass rates, and hardest question metrics.

### 🔄 Dual-Mode Environment Switcher (`[ DEMO ]` / `[ LIVE ]`)
- **DEMO Mode:** Operates 100% offline using structured mock data without requiring a backend server.
- **LIVE Mode:** Connects to the Spring Boot REST API (`http://localhost:8080/api`) with automatic health probing (`/api/health`).

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 19 (Vite)
- **Routing:** React Router DOM v7
- **Styling:** TailwindCSS v4 (Vanilla CSS System + Lucide Icons)
- **Data Visualization:** Recharts

### Backend
- **Framework:** Java 17+, Spring Boot 3.3.4
- **Modules:** Spring Web, Spring Security, Spring Data JPA, Bean Validation, Lombok
- **Authentication:** JWT (JSON Web Token) with BCrypt password hashing
- **Documentation:** OpenAPI / Swagger UI (`/swagger-ui.html`)
- **Database:** MySQL 8.0 (`quiz_db`)

---

## 🚀 Getting Started & Local Setup

### 1. Database Setup (MySQL)
Ensure MySQL Server is running on your machine:
```sql
CREATE DATABASE quiz_db;
```

### 2. Backend Setup (Spring Boot)
Navigate to the `backend/` directory:
```bash
cd backend
mvn spring-boot:run
```
The backend API will start on **`http://localhost:8080/api`**.

### 3. Frontend Setup (React)
From the project root directory:
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
The application will launch on **`http://localhost:5174/`**.

---

## 🔌 API Endpoints Summary

### Public & Health
- `GET /api/health` — System liveness status (`{"status":"UP"}`)

### Authentication
- `POST /api/auth/register` — Student registration
- `POST /api/auth/login` — Authentication returning JWT token

### Admin Services (`ROLE_ADMIN`)
- `GET/POST/PUT/DELETE /api/subjects` — Subject management
- `GET/POST/PUT/DELETE /api/exams` — Exam CRUD & publishing
- `GET/POST/PUT/DELETE /api/questions` — Question bank management
- `GET /api/admin/analytics` — Institutional performance data

### Student Services (`ROLE_STUDENT`)
- `GET /api/student/exams` — Available published tests
- `POST /api/attempts/start/{examId}` — Start exam session (randomized questions)
- `POST /api/attempts/{attemptId}/submit` — Auto-grading submission
- `GET /api/results/my` — Student attempt history
- `GET /api/student/leaderboard` — Departmental standings

---

## 📄 License & Attribution

Developed for **NHITM Engineering College, Department of Information Technology**. All rights reserved.
