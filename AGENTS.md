# Project Agent Instructions — AI-Powered Student Management System (SMS)

Welcome to the **AI-Powered Student Management System** workspace. This file establishes the architecture, conventions, and operational workflows for this repository.

---

## 1. Project Overview & Architecture

- **Backend**: Spring Boot 3.3.4, Java 17, PostgreSQL (`sms_db`), Redis (`localhost:6379`), Spring Security 6 (Stateless JWT + RBAC), Spring Events (`@Async` thread pool), Hibernate 6.5 (`default_batch_fetch_size: 50`).
- **AI Intelligence**: Google Gemini AI (`gemini-3.8-flash`) integrated via REST (`POST https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent`).
- **Clients**:
  - Web Frontend: React / Vite / Next.js with modern design tokens and accessible UI components.
  - Mobile Clients: Android (Kotlin, Jetpack Compose, Clean Architecture) and iOS (Swift, SwiftUI, Modern Concurrency) communicating via `backend/MOBILE_API_CONTRACT.md`.
- **Database & Performance**:
  - 3NF relational schema with 56 PostgreSQL B-Tree indexes.
  - `@EntityGraph(attributePaths = ...)` and eager join fetching on repositories to prevent N+1 queries.
  - Soft-delete pattern (`is_deleted` flags) across all critical entities.

---

## 2. Project-Scoped Skills (`.agents/skills/`)

All skills in `.agents/skills/` are installed **strictly for this project only**. The agent should progressively activate them based on task context:

### UI / UX & Design System
- **`ui-ux-pro-max`**: Design intelligence engine containing 79 searchable styles, 192 product palettes, 74 font pairings, 119 UX guidelines, and 25 chart types.
  - Query via: `python3 .agents/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain <domain>` or `--design-system`
  - LMS recommendations: Flat Design + Accessible & Ethical / Swiss Modernism, calm blue palette, high readability.
- **`design-system`**: Multi-layer design tokens (primitive → semantic → component), Tailwind & CSS token architecture, component specs.
- **`ui-styling`**: shadcn/ui components, accessible Radix UI primitives, responsive Tailwind styling patterns.
- **`design`**: Brand identity, CIP mockups, logo generation, SVG icons, and HTML presentations.
- **`liquid-glass-design`**: Glassmorphism, modern blur and frosted glass aesthetics.
- **`make-interfaces-feel-better`**: Tactile feedback, micro-interactions, responsive states, layout polish.
- **`motion-foundations` / `motion-patterns` / `motion-advanced`**: Choreographed transitions, timing curves, purposeful animations.
- **`taste` / `taste-application`**: Aesthetic judgment, typographic contrast, elevated whitespace hierarchy.

### Backend Engineering (Spring Boot & Java)
- **`springboot-patterns`**: Modular monolith structure, controller → service → repository separation, DTO mappings.
- **`springboot-security`**: Spring Security 6, stateless JWT filter, method-level RBAC (`@PreAuthorize`), password hashing.
- **`springboot-tdd`**: Red-Green-Refactor test cycle with JUnit 5, Mockito, and Spring Boot test slices (`@WebMvcTest`, `@DataJpaTest`).
- **`springboot-verification`**: Health checks, actuator metrics, connection pool verification, and build validation.
- **`jpa-patterns`**: Hibernate 6 / JPA best practices, N+1 query prevention, `@EntityGraph`, batch fetching, transaction boundaries.
- **`postgres-patterns`**: PostgreSQL B-Tree indexing, execution plan analysis (`EXPLAIN ANALYZE`), JSONB querying, vacuuming.
- **`redis-patterns`**: Cache-aside pattern, key namespacing, TTL expiration, serialization safety.
- **`api-design`**: RESTful API standards, standard envelope (`ApiResponse<T>`), semantic HTTP status codes, pagination (`PageResponse<T>`).
- **`backend-patterns`**: Resilient services, idempotent operations, decoupled async event listeners (`@Async`, `@EventListener`).
- **`security-review` / `security-scan`**: OWASP Top 10 defenses, parameterized SQL, XSS sanitization, authentication defense.
- **`database-migrations`**: Schema migrations, forward-compatible DDL, constraint integrity.

### Mobile Client Engineering (Android & iOS)
- **`android-clean-architecture`**: Android Clean Architecture with Domain, Data, and Presentation modules, UseCases, Repositories.
- **`compose-multiplatform-patterns`**: Jetpack Compose state hoisting, unidirectional data flow (UDF), design tokens.
- **`kotlin-patterns` / `kotlin-coroutines-flows` / `kotlin-testing`**: Idiomatic Kotlin, StateFlow, SharedFlow, coroutines, unit tests.
- **`swiftui-patterns` / `swift-concurrency-6-2` / `swift-actor-persistence`**: Declarative SwiftUI views, async/await, actors, SwiftData/persistence.

### Frontend Web Engineering
- **`react-patterns` / `react-performance` / `react-testing`**: Modern React hooks, memoization, bundle splitting, Vitest + Testing Library.
- **`vite-patterns`**: Vite fast dev server setup, path aliases, proxy configuration for backend API.
- **`frontend-patterns` / `frontend-a11y` / `frontend-design-direction`**: Semantic HTML5, WCAG 2.1 AA accessibility, keyboard traps prevention.

---

## 3. Project-Scoped Rules (`.agents/rules/`)

Active rules enforcing quality standards:
- `common-*`: Universal coding style, Git workflows, performance standards, security baselines, and test requirements.
- `java-*`: Java 17 records, immutability, stream idioms, exception hierarchy, JPA repository rules.
- `kotlin-*`: Null-safety, coroutine scope rules, sealed class pattern matching.
- `swift-*`: Swift 6 Sendable checks, actor isolation, SwiftUI state wrappers.
- `react-*` & `typescript-*`: Strict typing, no implicit `any`, hook dependencies, functional components.
- `web-*`: Responsive layouts, accessible contrast ratios (≥ 4.5:1), performance budgets.

---

## 4. Operational Runbook

- **Backend Jar**: Run via `java -jar backend/target/sms-app-1.0.0.jar`
- **Health Check**: `GET http://localhost:8080/api/v1/health`
- **API Documentation**: See `backend_flow.md` and `backend/MOBILE_API_CONTRACT.md`
- **Default Database**: PostgreSQL database `sms_db` on port `5432`
- **Default Cache**: Redis on port `6379`
