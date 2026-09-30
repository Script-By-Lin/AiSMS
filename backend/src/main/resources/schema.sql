-- ====================================================================
-- Production PostgreSQL Schema (3NF) for AI-Powered Student Management System
-- ====================================================================

CREATE TABLE IF NOT EXISTS roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(30),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS parents (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    occupation VARCHAR(100),
    relationship VARCHAR(50) DEFAULT 'PARENT',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS teachers (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    employee_code VARCHAR(50) NOT NULL UNIQUE,
    specialization VARCHAR(150),
    qualification VARCHAR(150),
    hire_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS students (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_code VARCHAR(50) NOT NULL UNIQUE,
    dob DATE,
    gender VARCHAR(20),
    address TEXT,
    emergency_contact VARCHAR(50),
    parent_id BIGINT REFERENCES parents(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS courses (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    credits INT DEFAULT 3,
    teacher_id BIGINT REFERENCES teachers(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS subjects (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    teacher_id BIGINT REFERENCES teachers(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS timetables (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    subject_id BIGINT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    teacher_id BIGINT REFERENCES teachers(id) ON DELETE SET NULL,
    day_of_week VARCHAR(20) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room_number VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS enrollments (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    enrollment_date DATE NOT NULL,
    status VARCHAR(30) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    CONSTRAINT uq_student_course UNIQUE(student_id, course_id)
);

CREATE TABLE IF NOT EXISTS attendance (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    subject_id BIGINT REFERENCES subjects(id) ON DELETE SET NULL,
    attendance_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    remarks VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    CONSTRAINT uq_student_date_subject UNIQUE(student_id, attendance_date, subject_id)
);

CREATE TABLE IF NOT EXISTS exams (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    exam_date DATE NOT NULL,
    course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    subject_id BIGINT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    max_marks DECIMAL(5,2) DEFAULT 100.00,
    term VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS results (
    id BIGSERIAL PRIMARY KEY,
    exam_id BIGINT NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    marks_obtained DECIMAL(5,2) NOT NULL,
    grade VARCHAR(10),
    remarks TEXT,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    CONSTRAINT uq_exam_student UNIQUE(exam_id, student_id)
);

CREATE TABLE IF NOT EXISTS fee_structures (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    term VARCHAR(50),
    academic_year VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS invoices (
    id BIGSERIAL PRIMARY KEY,
    invoice_number VARCHAR(100) NOT NULL UNIQUE,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    fee_structure_id BIGINT NOT NULL REFERENCES fee_structures(id) ON DELETE CASCADE,
    total_amount DECIMAL(10,2) NOT NULL,
    paid_amount DECIMAL(10,2) DEFAULT 0.00,
    balance_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(30) DEFAULT 'UNPAID',
    due_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS payments (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    fee_structure_id BIGINT NOT NULL REFERENCES fee_structures(id) ON DELETE CASCADE,
    invoice_id BIGINT REFERENCES invoices(id) ON DELETE SET NULL,
    amount_paid DECIMAL(10,2) NOT NULL,
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(50) NOT NULL,
    transaction_reference VARCHAR(150) UNIQUE,
    status VARCHAR(30) DEFAULT 'COMPLETED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS leads (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150),
    phone VARCHAR(50),
    interested_course VARCHAR(150),
    status VARCHAR(50) DEFAULT 'NEW',
    source VARCHAR(100),
    notes TEXT,
    assigned_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS complaints (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    raised_by_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_id BIGINT REFERENCES students(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    severity VARCHAR(30) DEFAULT 'MEDIUM',
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS discipline_records (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    incident_date DATE NOT NULL,
    description TEXT NOT NULL,
    action_taken TEXT,
    reported_by_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS leave_requests (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'PENDING',
    reviewed_by_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS student_documents (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    document_name VARCHAR(150) NOT NULL,
    document_type VARCHAR(50),
    file_url TEXT NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    recipient_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'SYSTEM',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS ai_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    feature VARCHAR(100) NOT NULL,
    query_prompt TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- ====================================================================
-- Production Optimized Indexes (Audited & Refined)
-- ====================================================================
-- NOTE: Columns with UNIQUE constraints (users.username, users.email,
-- students.student_code, students.user_id, teachers.employee_code,
-- courses.code, subjects.code, invoices.invoice_number,
-- payments.transaction_reference) are automatically indexed by PostgreSQL
-- with unique B-Trees. Defining separate non-unique indexes on those columns
-- creates exact duplicates and degrades write throughput.
--
-- Similarly, composite UNIQUE constraints such as:
--   - enrollments(student_id, course_id)
--   - results(exam_id, student_id)
--   - attendance(student_id, attendance_date, subject_id)
-- automatically index their leading prefix column. Separate single-column
-- indexes on those leading columns are redundant and omitted.

-- 1. Foreign Key & Join Indexes
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_students_parent_id ON students(parent_id);
CREATE INDEX IF NOT EXISTS idx_courses_teacher_id ON courses(teacher_id);
CREATE INDEX IF NOT EXISTS idx_subjects_course_id ON subjects(course_id);
CREATE INDEX IF NOT EXISTS idx_subjects_teacher_id ON subjects(teacher_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_timetables_subject_id ON timetables(subject_id);
CREATE INDEX IF NOT EXISTS idx_exams_subject_id ON exams(subject_id);
CREATE INDEX IF NOT EXISTS idx_fee_structures_course_id ON fee_structures(course_id);
CREATE INDEX IF NOT EXISTS idx_invoices_fee_structure_id ON invoices(fee_structure_id);
CREATE INDEX IF NOT EXISTS idx_payments_fee_structure_id ON payments(fee_structure_id);
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_attendance_subject_id ON attendance(subject_id);
CREATE INDEX IF NOT EXISTS idx_discipline_records_reported_by_id ON discipline_records(reported_by_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_reviewed_by_id ON leave_requests(reviewed_by_id);
CREATE INDEX IF NOT EXISTS idx_student_documents_student_id ON student_documents(student_id);

-- 2. Composite Query & Schedule Indexes (Eliminates External Sorts)
CREATE INDEX IF NOT EXISTS idx_attendance_course_date ON attendance(course_id, attendance_date);
CREATE INDEX IF NOT EXISTS idx_timetables_course_schedule ON timetables(course_id, day_of_week, start_time);
CREATE INDEX IF NOT EXISTS idx_timetables_teacher_schedule ON timetables(teacher_id, day_of_week, start_time);
CREATE INDEX IF NOT EXISTS idx_exams_course_date ON exams(course_id, exam_date DESC);
CREATE INDEX IF NOT EXISTS idx_results_student_created ON results(student_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_student_status ON invoices(student_id, status);
CREATE INDEX IF NOT EXISTS idx_payments_student_date ON payments(student_id, payment_date DESC);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_created ON leads(assigned_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status_created ON leads(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_complaints_student_created ON complaints(student_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_complaints_raised_created ON complaints(raised_by_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_complaints_status_created ON complaints(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_discipline_records_student_date ON discipline_records(student_id, incident_date DESC);
CREATE INDEX IF NOT EXISTS idx_leave_requests_student_dates ON leave_requests(student_id, start_date DESC);
CREATE INDEX IF NOT EXISTS idx_ai_logs_user_created ON ai_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_logs_feature_created ON ai_logs(feature, created_at DESC);

-- 3. Composite Inbox & Targeted Partial Indexes (Zero Bloat for Hot Queries)
-- Accelerated user inbox pagination without memory sort
CREATE INDEX IF NOT EXISTS idx_notifications_user_inbox ON notifications(recipient_id, created_at DESC);

-- Partial index for unread notifications (typically <5% of table volume)
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(recipient_id, created_at DESC) WHERE is_read = false;

-- Partial index for active unpaid invoices (accelerates billing & overdue reminders)
CREATE INDEX IF NOT EXISTS idx_invoices_unpaid ON invoices(student_id, due_date) WHERE status = 'UNPAID';

-- Partial index for pending leave requests needing staff review
CREATE INDEX IF NOT EXISTS idx_leave_requests_pending ON leave_requests(created_at DESC) WHERE status = 'PENDING';


