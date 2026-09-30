You are a senior performance engineer and database expert. Analyze and optimize a **Java Spring Boot monolithic backend system** for performance, scalability, and database efficiency.

---

## 1. Context

The system is a **Student Management System** with:

* Multi-role system (Admin, Student, Teacher, Parent, Sales, Student Affair)
* PostgreSQL as primary database
* Redis for caching
* Optional MongoDB
* Event-driven internal architecture
* REST APIs used by Web and Mobile apps

---

## 2. Your Tasks

Perform a **deep performance audit** of the backend code.

---

## 3. API Performance Analysis

For each API endpoint:

### Check:

* Response time (target < 200ms)
* Blocking vs async execution
* Payload size (optimize for mobile)
* Pagination usage
* Unnecessary data fetching

### Output:

* Estimated response time
* Bottlenecks
* Optimization suggestions

---

## 4. Database Query Analysis (CRITICAL)

Analyze all database interactions.

### Detect:

* N+1 query problems
* Missing indexes
* Full table scans
* Inefficient joins
* Over-fetching (SELECT *)

---

### For Each Query:

Provide:

1. SQL equivalent
2. Performance issue (if any)
3. Optimized version
4. Index recommendation

---

### Indexing Rules:

Check if indexes exist for:

* student_code
* user_id
* course_id
* foreign keys
* frequently filtered columns

---

## 5. JPA / Hibernate Optimization

### Check:

* Lazy vs Eager loading
* Use of JOIN FETCH
* Batch fetching
* DTO projections vs Entity loading

---

### Fix:

* Replace EAGER with LAZY where needed
* Use custom queries for heavy joins
* Use pagination (Pageable)

---

## 6. Caching Strategy (Redis)

### Identify:

* Frequently accessed endpoints
* Repeated queries

### Suggest:

* Cache keys
* TTL strategy
* Cache invalidation rules

Example:

* student_dashboard:{student_id}

---

## 7. Event-Driven Performance

### Check:

* Are events blocking requests?
* Are heavy tasks async?

### Fix:

* Use @Async for event listeners
* Move heavy tasks to background

---

## 8. AI (Gemini) Performance

### Check:

* Are AI calls blocking API response?
* Are prompts optimized?

### Fix:

* Move AI calls to async/background
* Cache AI responses if reusable

---

## 9. Response Time Optimization

Suggest improvements:

* Reduce DB round trips
* Use projections instead of full entities
* Use batch inserts/updates
* Enable connection pooling (HikariCP)

---

## 10. Load Handling

### Evaluate:

* Concurrent users (100–10,000)
* Thread pool usage
* DB connection pool size

---

### Recommend:

* Optimal HikariCP config
* Thread pool settings

---

## 11. Logging & Monitoring

Check:

* Slow query logging
* API timing logs

Recommend:

* Add interceptor for request timing
* Log queries > 100ms

---

## 12. Output Format

For each issue:

* Problem
* Impact
* Fix
* Example code (if needed)

---

## 13. Constraints

* Focus on production-level optimization
* Avoid theoretical answers
* Provide practical fixes with code
