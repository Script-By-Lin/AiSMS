You are a senior UI/UX designer and frontend architect. Design a **production-grade user interface and user experience** for an **AI-powered Student Management System**.

---

## 1. System Context

The system includes multiple roles:

* Admin
* Student
* Teacher
* Parent
* Sales
* Student Affair

Clients:

* Web Application (Admin, Staff, Sales, Student Affair)
* Mobile Apps (Student, Parent, Teacher)

---

## 2. Design Principles (Strict)

* Clean, modern UI (similar to enterprise SaaS)
* Minimal clutter (avoid overloaded screens)
* Fast navigation (≤ 3 clicks to reach any feature)
* Mobile-first thinking
* Consistent design system
* Accessible (WCAG-friendly)
* Performance optimized UI

---

## 3. Design System

### Colors:

* Primary: Blue (trust, education)
* Secondary: Gray/White
* Status:

  * Success: Green
  * Warning: Yellow
  * Error: Red

---

### Typography:

* Clear hierarchy:

  * Heading
  * Subheading
  * Body
* Use readable fonts (Inter / Roboto)

---

### Components:

* Sidebar navigation (Web)
* Top navbar
* Cards (dashboard)
* Tables (data-heavy views)
* Forms with validation
* Modals
* Toast notifications

---

## 4. Role-Based UI Design

---

### 4.1 Admin Dashboard (Web)

Features:

* KPI cards:

  * Total students
  * Revenue
  * Attendance rate
* Charts:

  * Enrollment trends
  * Financial overview
* Quick actions:

  * Add student
  * Create course

---

### 4.2 Teacher Panel (Web + Mobile)

Features:

* Class list
* Attendance marking UI (fast input)
* Grade entry
* Student performance view

---

### 4.3 Student Panel (Mobile-first)

Features:

* Dashboard:

  * Attendance %
  * GPA
* Timetable
* Results
* Notifications
* AI assistant (chat UI)

---

### 4.4 Parent Panel (Mobile-first)

Features:

* Child overview
* Attendance alerts
* Grade reports
* Fee status
* Notifications

---

### 4.5 Sales Panel (Web)

Features:

* Lead pipeline (Kanban board)
* Follow-up reminders
* Conversion tracking

---

### 4.6 Student Affair Panel (Web)

Features:

* Complaints list
* Discipline tracking
* Leave approvals

---

## 5. Navigation Design

### Web:

* Sidebar:

  * Dashboard
  * Students
  * Courses
  * Finance
  * Reports
* Breadcrumbs for navigation

---

### Mobile:

* Bottom navigation:

  * Home
  * Schedule
  * Notifications
  * Profile

---

## 6. AI Integration in UI

### Chatbot UI:

* Floating chat button
* Chat screen:

  * User input
  * AI responses
* Suggestions:

  * “Check attendance”
  * “View results”

---

### AI Insights:

* Show in dashboards:

  * “Student performance declining”
  * “High-risk students”

---

### Smart Alerts:

* Highlight in UI:

  * Red badges
  * Notification banners

---

## 7. Forms & UX

* Inline validation
* Error messages clearly shown
* Auto-save (optional)
* Dropdowns for relationships

---

## 8. Data Visualization

Use:

* Line charts (trends)
* Bar charts (comparisons)
* Pie charts (distribution)

---

## 9. Performance UX

* Skeleton loading screens
* Lazy loading
* Pagination for tables
* Avoid large data rendering

---

## 10. Mobile UX Rules

* Touch-friendly buttons
* Minimal typing required
* Fast loading screens
* Offline-friendly (optional)

---

## 11. Deliverables

Generate:

1. Full UI structure for each role
2. Wireframes (textual or visual description)
3. Component breakdown
4. Page-by-page layout
5. Mobile screen flow
6. Design system tokens
7. AI UI integration patterns

---

## 12. Tech Recommendations

### Web:

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* React Query

### Mobile:

* Android (Kotlin + MVVM)
* iOS (Swift + MVVM)

---

## 13. Constraints

* Do NOT overcomplicate UI
* Focus on usability first
* Design for real users (students, staff, parents)
* Ensure consistency across web and mobile

---

Output UI design step-by-step with clear structure.
