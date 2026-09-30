# Mobile API Contract Specification (Android & iOS)

This specification defines the production REST API contract for the native mobile applications:
* **Android**: Kotlin, Jetpack Compose, MVVM, Retrofit / OkHttp
* **iOS**: Swift, SwiftUI, MVVM, URLSession / Alamofire

---

## 1. General Standards

* **Base URL**: `http://<server-host>:8080/api/v1`
* **Content Type**: `application/json`
* **Standard Response Envelope**:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2026-09-29T21:40:00"
}
```
* **Error Response Envelope**:
```json
{
  "success": false,
  "message": "Error description",
  "data": null,
  "timestamp": "2026-09-29T21:40:00"
}
```

---

## 2. Authentication & Security

All protected endpoints require the HTTP Header:
```http
Authorization: Bearer <access_token>
```

### 2.1 User Login
* **Endpoint**: `POST /auth/login`
* **Public**: Yes
* **Request Body**:
```json
{
  "username": "student1",
  "password": "Student@123"
}
```
* **Response Body (`200 OK`)**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi...",
    "tokenType": "Bearer",
    "expiresIn": 86400000,
    "userId": 3,
    "username": "student1",
    "email": "alice.walker@sms.edu",
    "fullName": "Alice Walker",
    "roles": ["ROLE_STUDENT"],
    "profileId": 1
  }
}
```

### 2.2 Refresh Token
* **Endpoint**: `POST /auth/refresh`
* **Public**: Yes
* **Request Body**:
```json
{
  "refreshToken": "eyJhbGciOi..."
}
```
* **Response Body (`200 OK`)**:
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi...",
    "tokenType": "Bearer",
    "expiresIn": 86400000,
    "userId": 3,
    "roles": ["ROLE_STUDENT"],
    "profileId": 1
  }
}
```

---

## 3. Mobile First Endpoints

### 3.1 Mobile Dashboard
Retrieves role-specific consolidated metrics, attendance summaries, upcoming tests, and active AI insights in a single network round-trip.
* **Endpoint**: `GET /mobile/dashboard`
* **Auth**: Required
* **Response Body (`200 OK`)**:
```json
{
  "success": true,
  "message": "Mobile dashboard retrieved",
  "data": {
    "userRole": "STUDENT",
    "fullName": "Alice Walker",
    "email": "alice.walker@sms.edu",
    "attendancePercentage": 100.0,
    "gpaOrAverageScore": 88.5,
    "currentCourses": [
      {
        "id": 1,
        "code": "CS101",
        "name": "Introduction to Computer Science & AI",
        "credits": 4
      }
    ],
    "recentAttendance": [
      {
        "id": 1,
        "attendanceDate": "2026-09-28",
        "status": "PRESENT",
        "remarks": "On time"
      }
    ],
    "recentResults": [
      {
        "id": 1,
        "examTitle": "Midterm Examination",
        "marksObtained": 88.5,
        "maxMarks": 100.0,
        "grade": "A"
      }
    ],
    "pendingInvoices": [
      {
        "id": 1,
        "invoiceNumber": "INV-2026-0001",
        "totalAmount": 1200.0,
        "paidAmount": 600.0,
        "balanceAmount": 600.0,
        "status": "PARTIAL",
        "dueDate": "2026-11-30"
      }
    ],
    "unreadNotifications": [],
    "aiInsights": [
      "Good job! Your attendance is strong at 100.0%.",
      "Academic Excellence: You are maintaining an average score of 88.5%!"
    ]
  }
}
```

### 3.2 Mobile Attendance
* **Endpoint**: `GET /mobile/attendance`
* **Auth**: Required
* **Response Body (`200 OK`)**:
```json
{
  "success": true,
  "message": "Attendance summary",
  "data": {
    "studentId": 1,
    "studentCode": "STU-2026-0001",
    "studentName": "Alice Walker",
    "totalClasses": 2,
    "presentCount": 2,
    "absentCount": 0,
    "lateCount": 0,
    "excusedCount": 0,
    "percentage": 100.0,
    "lowAttendanceAlert": false
  }
}
```

### 3.3 Mobile Results
* **Endpoint**: `GET /mobile/results`
* **Auth**: Required
* **Response Body (`200 OK`)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "examId": 1,
      "examTitle": "Midterm Examination",
      "subjectName": "Algorithms and Data Structures",
      "marksObtained": 88.5,
      "maxMarks": 100.0,
      "grade": "A",
      "remarks": "Excellent analytical depth in data structures"
    }
  ]
}
```

---

## 4. Gemini AI Integration Endpoints

### 4.1 AI Chatbot
Interactive educational assistant answering student and parent questions.
* **Endpoint**: `POST /ai/chat`
* **Auth**: Required
* **Request Body**:
```json
{
  "message": "What is my current attendance percentage and do I have any upcoming fees?",
  "studentId": 1
}
```
* **Response Body (`200 OK`)**:
```json
{
  "success": true,
  "message": "AI Response generated",
  "data": {
    "reply": "Hello Alice! Your attendance is currently at 100.0%, which is well above the required threshold. You have an active tuition invoice of $600.00 due on November 30, 2026.",
    "model": "gemini-1.5-flash",
    "timestamp": "2026-09-29T21:40:00"
  }
}
```

### 4.2 AI Student Performance Analysis
* **Endpoint**: `GET /ai/performance/{studentId}`
* **Auth**: Required
* **Response Body (`200 OK`)**:
```json
{
  "success": true,
  "message": "AI Performance Analysis generated",
  "data": {
    "studentId": 1,
    "studentCode": "STU-2026-0001",
    "studentName": "Alice Walker",
    "currentGpa": 4.43,
    "averageMarks": 88.5,
    "attendanceRate": 100.0,
    "performanceTier": "EXCELLENT",
    "weakSubjects": [],
    "strongSubjects": ["Algorithms and Data Structures"],
    "aiSuggestions": [
      "Establish a daily 45-minute revision routine with practice mock quizzes.",
      "Leverage teacher office hours to clear conceptual bottlenecks early."
    ],
    "detailedSummary": "Alice Walker demonstrates consistent learning capacity and exemplary conceptual retention."
  }
}
```

### 4.3 AI Smart Alerts
* **Endpoint**: `GET /ai/smart-alerts/{studentId}`
* **Auth**: Required
* **Response Body (`200 OK`)**:
```json
{
  "success": true,
  "data": {
    "studentId": 1,
    "studentName": "Alice Walker",
    "studentCode": "STU-2026-0001",
    "lowAttendanceRisk": false,
    "attendancePercentage": 100.0,
    "poorGradesRisk": false,
    "failingGradesPercentage": 0.0,
    "activeAlerts": ["Student is currently in good standing with satisfactory attendance and marks."],
    "aiActionPlan": "No immediate intervention required. Maintain regular academic check-ins."
  }
}
```

---

## 5. HTTP Status Codes & Error Handling

| Status Code | Meaning | Client Action |
|-------------|---------|---------------|
| `200 OK` | Request succeeded | Process `data` payload |
| `201 Created` | Resource created | Update UI or list |
| `400 Bad Request` | Validation failure | Show `data` error map to user |
| `401 Unauthorized` | Token expired or invalid | Trigger refresh token or redirect to login |
| `403 Forbidden` | Insufficient role | Display access denied message |
| `404 Not Found` | Resource missing | Notify user that record does not exist |
| `429 Too Many Requests` | Rate limit hit (120 req/min) | Back off and retry |
| `500 Server Error` | Unexpected server condition | Show friendly error message |
