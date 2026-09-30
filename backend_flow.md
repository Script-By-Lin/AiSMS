You are a senior enterprise backend architect. Design and implement a **production-grade AI-powered Student Management System** using **Java (Spring Boot)** with a **modular monolithic architecture**, integrated with **native mobile apps (Android & iOS)** and **Gemini AI (Google)**.

---

## 1. Tech Stack (Strict Requirements)

### Backend

* Language: Java 17+
* Framework: Spring Boot (latest stable)
* Build Tool: Maven or Gradle
* ORM: Spring Data JPA (Hibernate)
* Database:

  * PostgreSQL (primary relational DB, production-grade schema)
  * MongoDB (optional, only for AI logs, chat history, events)
* Authentication:

  * Spring Security + JWT (access + refresh tokens)
* Caching:

  * Redis
* Messaging / Event System:

  * Spring Events (internal)
  * Optional: Kafka or RabbitMQ (for scalability)
* API Style:

  * RESTful APIs

---

### Mobile Apps

* Android: Kotlin (Jetpack, MVVM)
* iOS: Swift (MVVM)
* Communication:

  * REST APIs (JSON)
* Auth:

  * JWT token-based login

---

### AI Integration

* Gemini API (Google)
* Use for:

  * Chatbot
  * Predictions
  * Insights generation

---

## 2. Architecture (Modular Monolith)

Use **modular monolith**, not microservices.

### Package Structure:

* com.sms.app

  * config/
  * security/
  * controller/
  * service/
  * repository/
  * entity/
  * dto/
  * mapper/
  * event/
  * listener/
  * ai/
  * util/
  * exception/

---

### Layer Rules:

* Controller → Service → Repository
* No business logic in controllers
* DTOs for API communication
* Entities for DB only

---

## 3. Core Modules (Must Implement)

### 3.1 User & Role Management

* Users (authentication only)
* Roles:

  * ADMIN
  * STUDENT
  * TEACHER
  * PARENT
  * SALES
  * STUDENT_AFFAIR
* RBAC with Spring Security

---

### 3.2 Student Module

* Student profile
* Unique student_code
* Enrollment
* Documents

---

### 3.3 Teacher Module

* Course assignment
* Attendance marking
* Grading system

---

### 3.4 Parent Module

* Link child via student_code
* View:

  * Attendance
  * Results
  * Fees
* Notifications

---

### 3.5 Sales Module

* Lead management
* Follow-ups
* Conversion tracking

---

### 3.6 Student Affair Module

* Complaints
* Discipline records
* Leave requests

---

### 3.7 Academic Module

* Courses
* Subjects
* Timetable
* Exams
* Results

---

### 3.8 Finance Module

* Fee structure
* Payments
* Invoices

---

### 3.9 Notification Module

* Push notifications (for mobile)
* Email/SMS (optional)

---

## 4. Database Design (PostgreSQL)

### Requirements:

* Fully normalized schema (3NF)
* Foreign keys & constraints
* Indexes:

  * student_code
  * user_id
  * course_id
* Audit fields:

  * created_at
  * updated_at
* Soft delete (is_deleted)

---

### Core Tables:

* users
* roles
* user_roles
* students
* parents
* teachers
* courses
* enrollments
* attendance
* exams
* results
* payments
* leads
* complaints

---

### MongoDB (Optional)

Use only for:

* AI chat history
* Logs
* Event payloads

---

## 5. Event-Driven Architecture (Internal)

Implement **event-driven design inside monolith**:

### Events:

* StudentCreatedEvent
* AttendanceMarkedEvent
* ExamResultPublishedEvent
* PaymentCompletedEvent
* ComplaintRaisedEvent

---

### Requirements:

* Event publisher (Spring ApplicationEventPublisher)
* Event listeners (@EventListener)
* Async listeners (@Async)

---

### Example:

* AttendanceMarkedEvent → trigger AI analysis
* ExamResultPublishedEvent → notify parent

---

## 6. AI Integration (Gemini)

Create a dedicated AI module:

### Features:

1. Student Performance Analysis

   * Identify weak students
   * Suggest improvements

2. AI Chatbot

   * Answer student/parent queries

3. Smart Alerts

   * Low attendance
   * Poor grades

4. Feedback Generator

   * Auto feedback for students

---

### Implementation Rules:

* AI logic must be isolated in ai/ package
* Use service class:

  * GeminiService.java
* Use prompt templates
* Store responses/logs (Mongo optional)

---

## 7. Security

* JWT authentication
* Password hashing (BCrypt)
* Role-based authorization
* Input validation
* CORS config
* Rate limiting

---

## 8. Performance

* Pagination for all APIs
* Redis caching:

  * dashboards
  * frequently accessed data
* Async processing for heavy tasks

---

## 9. Mobile Integration

### API Requirements:

* Clean REST endpoints
* Consistent JSON format:

  * success
  * message
  * data
* Token-based authentication

---

### Mobile Features:

* Login / Register
* Dashboard
* Attendance
* Results
* Notifications (Push)

---

## 10. Observability

* Logging (SLF4J + Logback)
* Exception handling (Global handler)
* Metrics (optional)

---

## 11. Deliverables

Generate:

1. Full project structure (Spring Boot)
2. PostgreSQL schema (SQL)
3. JPA Entities
4. DTOs
5. Repositories
6. Services
7. Controllers
8. Security config (JWT + RBAC)
9. Event system implementation
10. AI integration (Gemini)
11. Sample API endpoints
12. Mobile API contract

---

## 12. Coding Rules

* Use clean code principles
* Use Lombok where appropriate
* Separate DTO and Entity
* Use MapStruct for mapping (optional)
* Write production-level code (not demo)

---

## 13. Constraints

* DO NOT use microservices
* DO NOT mix AI logic into core business logic
* KEEP modular structure
* KEEP event-driven inside monolith

---

Output the implementation step-by-step.
