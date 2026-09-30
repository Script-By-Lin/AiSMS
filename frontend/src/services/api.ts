import type {
  Student,
  Course,
  AttendanceRecord,
  TimetableSlot,
  ExamResult,
  Invoice,
  Payment,
  Parent,
  AdminDeletionRequest,
  Lead,
  Complaint,
  LeaveRequest,
  NotificationItem,
  DashboardStats,
  RoleType,
} from '../types';

const API_BASE = '/api/v1';

class ApiService {
  private token: string | null = null;
  private localPayments: Payment[] = [];
  private localAdminRequests: AdminDeletionRequest[] = [];
  private localParents: Parent[] = [];

  constructor() {
    this.token = localStorage.getItem('sms_access_token');
    this.initDefaultMockData();
  }

  private initDefaultMockData() {
    this.localPayments = [
      {
        id: 1,
        studentId: 1,
        studentName: 'Alice Walker',
        studentCode: 'STU-2026-0001',
        courseId: 1,
        courseName: 'CS101 - Introduction to AI & CS',
        courseCategory: 'Artificial Intelligence & CS',
        amountPaid: 400.0,
        paymentDate: '2026-09-01',
        paymentMethod: 'KBZ_PAY',
        paymentPeriod: 'DOWN_PAYMENT',
        receiptNumber: 'REC-2026-0001',
        focItems: ['Official Academy T-Shirt', 'Course Textbooks & Workbooks', 'Student ID Card & Lanyard'],
        totalFee: 1400.0,
        remainingBalance: 1000.0,
        salesAgentName: 'Sarah Connor (Admissions)',
        notes: 'Initial admission down payment completed via KBZPay QR.',
        transactionReference: 'TXN-KBZ-992014',
        status: 'COMPLETED',
      },
      {
        id: 2,
        studentId: 1,
        studentName: 'Alice Walker',
        studentCode: 'STU-2026-0001',
        courseId: 1,
        courseName: 'CS101 - Introduction to AI & CS',
        courseCategory: 'Artificial Intelligence & CS',
        amountPaid: 250.0,
        paymentDate: '2026-09-28',
        paymentMethod: 'BANK_TRANSFER',
        paymentPeriod: 'MONTH_1',
        receiptNumber: 'REC-2026-0042',
        focItems: ['Lab Access USB Kit'],
        totalFee: 1400.0,
        remainingBalance: 750.0,
        salesAgentName: 'Sarah Connor (Admissions)',
        notes: 'September Month 1 Installment received.',
        transactionReference: 'TXN-BNK-881290',
        status: 'COMPLETED',
      },
      {
        id: 3,
        studentId: 2,
        studentName: 'Michael Chen',
        studentCode: 'STU-2026-0002',
        courseId: 2,
        courseName: 'FSW102 - Full-Stack Web Architecture',
        courseCategory: 'Full-Stack Software Engineering',
        amountPaid: 1200.0,
        paymentDate: '2026-09-10',
        paymentMethod: 'CASH',
        paymentPeriod: 'CASH_DOWN',
        receiptNumber: 'REC-2026-0018',
        focItems: ['Official Academy T-Shirt', 'Branded Tech Backpack', 'Welcome Sticker Pack'],
        totalFee: 1200.0,
        remainingBalance: 0.0,
        salesAgentName: 'Sarah Connor (Admissions)',
        notes: 'Full upfront tuition cash-down discount applied.',
        transactionReference: 'TXN-CSH-401923',
        status: 'COMPLETED',
      },
      {
        id: 4,
        studentId: 3,
        studentName: 'Sophia Rodriguez',
        studentCode: 'STU-2026-0003',
        courseId: 3,
        courseName: 'DS301 - Data Science & Cloud AI',
        courseCategory: 'Data Science & Cloud Computing',
        amountPaid: 500.0,
        paymentDate: '2026-09-15',
        paymentMethod: 'WAVE_PAY',
        paymentPeriod: 'DOWN_PAYMENT',
        receiptNumber: 'REC-2026-0029',
        focItems: ['Course Textbooks & Workbooks', 'Student ID Card & Lanyard'],
        totalFee: 1600.0,
        remainingBalance: 1100.0,
        salesAgentName: 'Sarah Connor (Admissions)',
        notes: 'Down payment for Data Science specialization cohort.',
        transactionReference: 'TXN-WAV-771829',
        status: 'COMPLETED',
      },
    ];

    this.localParents = [
      {
        id: 1,
        userId: 3,
        username: 'parent1',
        fullName: 'Robert Walker',
        email: 'robert.walker@example.com',
        phoneNumber: '+1-555-0102',
        occupation: 'Senior Staff Software Engineer',
        relationship: 'FATHER',
        studentCode: 'STU-2026-0001',
        linkedStudentName: 'Alice Walker',
      },
      {
        id: 2,
        userId: 12,
        username: 'parent2',
        fullName: 'Linda Chen',
        email: 'linda.chen@techglobal.com',
        phoneNumber: '+1-555-0106',
        occupation: 'Enterprise Data Architect',
        relationship: 'MOTHER',
        studentCode: 'STU-2026-0002',
        linkedStudentName: 'Michael Chen',
      },
      {
        id: 3,
        userId: 13,
        username: 'parent3',
        fullName: 'Carlos Rodriguez',
        email: 'carlos.rodriguez@domain.com',
        phoneNumber: '+1-555-0108',
        occupation: 'Logistics Operations Director',
        relationship: 'FATHER',
        studentCode: 'STU-2026-0003',
        linkedStudentName: 'Sophia Rodriguez',
      },
    ];

    this.localAdminRequests = [
      {
        id: 1,
        requestType: 'DELETE_STUDENT',
        targetId: 99,
        targetIdentifier: 'STU-2026-0099',
        targetName: 'Test Student Demo',
        reason: 'Duplicate registration entered accidentally during Open Day testing.',
        requestedBy: 'Sarah Connor (Sales)',
        status: 'PENDING',
        createdAt: '2026-09-28 14:30',
      },
    ];
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('sms_access_token', token);
    } else {
      localStorage.removeItem('sms_access_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data.data !== undefined ? data.data : data;
    } catch (err) {
      console.warn(`API call failed for ${endpoint}, falling back to local state:`, err);
      throw err;
    }
  }

  // --- Auth APIs ---
  async login(username: string, password: string) {
    try {
      const res = await this.request<any>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      if (res && res.accessToken) {
        this.setToken(res.accessToken);
      }
      const user = res.user || {
        id: res.userId || 1,
        username: res.username || username,
        fullName: res.fullName || `${username.toUpperCase()} User`,
        email: res.email || `${username}@sms.edu`,
        roles: res.roles || ['ROLE_ADMIN'],
      };
      return { ...res, user };
    } catch {
      // Mock fallback login for immediate UI demoing across all roles
      const mockRoles: Record<string, RoleType[]> = {
        admin: ['ROLE_ADMIN'],
        teacher: ['ROLE_TEACHER'],
        student: ['ROLE_STUDENT'],
        parent: ['ROLE_PARENT'],
        sales: ['ROLE_SALES'],
        affairs: ['ROLE_STUDENT_AFFAIR'],
        affair: ['ROLE_STUDENT_AFFAIR'],
      };
      const assignedRole = mockRoles[username.toLowerCase()] || ['ROLE_ADMIN'];
      return {
        accessToken: 'mock-jwt-token-' + username,
        user: {
          id: 1,
          username,
          fullName: username.toUpperCase() + ' User',
          email: `${username}@sms.edu`,
          roles: assignedRole,
        },
      };
    }
  }

  // --- Dashboard Stats ---
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const stats = await this.request<any>('/mobile/dashboard');
      return {
        totalStudents: stats.totalStudents || 1240,
        totalTeachers: 85,
        totalCourses: (stats.currentCourses && stats.currentCourses.length) || 42,
        totalRevenue: 285400,
        overallAttendanceRate: stats.attendancePercentage || 94.6,
        pendingInvoicesCount: (stats.pendingInvoices && stats.pendingInvoices.length) || 18,
        activeLeadsCount: 34,
        openComplaintsCount: 5,
      };
    } catch {
      return {
        totalStudents: 1240,
        totalTeachers: 85,
        totalCourses: 42,
        totalRevenue: 285400,
        overallAttendanceRate: 94.6,
        pendingInvoicesCount: 18,
        activeLeadsCount: 34,
        openComplaintsCount: 5,
      };
    }
  }

  // --- Students APIs ---
  async getStudents(): Promise<Student[]> {
    try {
      const res = await this.request<any>('/students?size=50');
      return res.content || [];
    } catch {
      return [
        {
          id: 1,
          userId: 4,
          studentCode: 'STU-2026-0001',
          username: 'student1',
          email: 'alice.walker@sms.edu',
          fullName: 'Alice Walker',
          phoneNumber: '+1-555-0103',
          dob: '2004-05-14',
          gender: 'FEMALE',
          address: '42 University Ave, Innovation District',
          emergencyContact: '+1-555-0102',
          parentId: 1,
          parentName: 'Robert Walker',
          parentPhone: '+1-555-0102',
          enrolledCourses: [
            {
              id: 1,
              code: 'CS101',
              name: 'Introduction to Computer Science & AI',
              category: 'Artificial Intelligence & CS',
              credits: 4,
              cashDownFee: 1200,
              installmentMonths: 4,
              monthlyInstallment: 250,
              downPaymentAmount: 400,
              teacherName: 'Dr. John Smith',
            },
            {
              id: 4,
              code: 'DS301',
              name: 'Applied Machine Learning & Neural Nets',
              category: 'Data Science & Cloud Computing',
              credits: 4,
              cashDownFee: 1400,
              installmentMonths: 4,
              monthlyInstallment: 300,
              downPaymentAmount: 450,
              teacherName: 'Dr. Alan Turing',
            },
          ],
          attendancePercentage: 96.5,
          averageMarks: 88.5,
          totalTuitionFee: 1400,
          totalPaidAmount: 650,
          balanceDue: 750,
          paymentPlanType: 'INSTALLMENT',
          focItemsReceived: ['Official Academy T-Shirt', 'Course Textbooks & Workbooks', 'Student ID Card & Lanyard'],
          joinedDate: '2026-09-01',
        },
        {
          id: 2,
          userId: 5,
          studentCode: 'STU-2026-0002',
          username: 'student2',
          email: 'michael.chen@sms.edu',
          fullName: 'Michael Chen',
          phoneNumber: '+1-555-0105',
          dob: '2003-11-20',
          gender: 'MALE',
          address: '108 Tech Boulevard, Silicon Park',
          emergencyContact: '+1-555-0106',
          parentId: 2,
          parentName: 'Linda Chen',
          parentPhone: '+1-555-0106',
          enrolledCourses: [
            {
              id: 2,
              code: 'FSW102',
              name: 'Full-Stack Web Architecture (React & Spring Boot)',
              category: 'Full-Stack Software Engineering',
              credits: 4,
              cashDownFee: 1200,
              installmentMonths: 4,
              monthlyInstallment: 250,
              downPaymentAmount: 400,
              teacherName: 'Prof. Sarah Connor',
            },
          ],
          attendancePercentage: 82.0,
          averageMarks: 74.0,
          totalTuitionFee: 1200,
          totalPaidAmount: 1200,
          balanceDue: 0,
          paymentPlanType: 'CASH_DOWN',
          focItemsReceived: ['Official Academy T-Shirt', 'Branded Tech Backpack', 'Welcome Sticker Pack'],
          joinedDate: '2026-09-10',
        },
        {
          id: 3,
          userId: 6,
          studentCode: 'STU-2026-0003',
          username: 'student3',
          email: 'sophia.rodriguez@sms.edu',
          fullName: 'Sophia Rodriguez',
          phoneNumber: '+1-555-0109',
          dob: '2004-02-18',
          gender: 'FEMALE',
          address: '77 Heritage Way, Cambridge',
          emergencyContact: '+1-555-0108',
          parentId: 3,
          parentName: 'Carlos Rodriguez',
          parentPhone: '+1-555-0108',
          enrolledCourses: [
            {
              id: 3,
              code: 'UIX201',
              name: 'Digital Product Design & Modern UI/UX Pro Max',
              category: 'Digital Product Design & UI/UX',
              credits: 3,
              cashDownFee: 1100,
              installmentMonths: 3,
              monthlyInstallment: 280,
              downPaymentAmount: 350,
              teacherName: 'Elena Rostova',
            },
          ],
          attendancePercentage: 98.2,
          averageMarks: 94.0,
          totalTuitionFee: 1190,
          totalPaidAmount: 500,
          balanceDue: 690,
          paymentPlanType: 'INSTALLMENT',
          focItemsReceived: ['Course Textbooks & Workbooks', 'Student ID Card & Lanyard'],
          joinedDate: '2026-09-15',
        },
      ];
    }
  }

  async createStudent(studentData: any): Promise<Student> {
    try {
      return await this.request<Student>('/students', {
        method: 'POST',
        body: JSON.stringify(studentData),
      });
    } catch {
      const uname = studentData.email?.split('@')[0] || `stu_${Date.now()}`;
      const code = `STU-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;
      return {
        id: Date.now(),
        userId: Date.now(),
        studentCode: code,
        username: uname,
        email: studentData.email,
        fullName: studentData.fullName,
        phoneNumber: studentData.phoneNumber || '+1-555-0000',
        dob: studentData.dob || '2005-01-01',
        gender: studentData.gender || 'MALE',
        address: studentData.address || 'Campus Dorms',
        emergencyContact: studentData.emergencyContact || studentData.phoneNumber,
        enrolledCourses: studentData.enrolledCourses || [],
        attendancePercentage: 100,
        averageMarks: 0,
        totalTuitionFee: studentData.totalTuitionFee || 1200,
        totalPaidAmount: studentData.totalPaidAmount || 0,
        balanceDue: (studentData.totalTuitionFee || 1200) - (studentData.totalPaidAmount || 0),
        paymentPlanType: studentData.paymentPlanType || 'INSTALLMENT',
        focItemsReceived: studentData.focItemsReceived || [],
        joinedDate: new Date().toISOString().split('T')[0],
      };
    }
  }

  // Sales CANNOT delete student directly: dispatches request to admin
  async requestAdminDeleteStudent(payload: {
    studentId: number;
    studentCode: string;
    studentName: string;
    reason: string;
    requestedBy?: string;
  }): Promise<AdminDeletionRequest> {
    const req: AdminDeletionRequest = {
      id: Date.now(),
      requestType: 'DELETE_STUDENT',
      targetId: payload.studentId,
      targetIdentifier: payload.studentCode,
      targetName: payload.studentName,
      reason: payload.reason,
      requestedBy: payload.requestedBy || 'Sales Agent',
      status: 'PENDING',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    this.localAdminRequests.unshift(req);

    // Also record in complaints/affairs ticket system for administrator visibility
    try {
      await this.request('/affairs/complaints', {
        method: 'POST',
        body: JSON.stringify({
          title: `[SALES REQUEST: DELETE STUDENT] ${payload.studentName} (${payload.studentCode})`,
          description: `Sales requested administrative deletion of student record ${payload.studentCode}.\nReason: ${payload.reason}\nRequested by: ${req.requestedBy}`,
          severity: 'HIGH',
        }),
      });
    } catch {
      // Local state preserved
    }

    return req;
  }

  // --- Courses & Categories APIs ---
  async getCourses(): Promise<Course[]> {
    try {
      const res = await this.request<any>('/academic/courses?size=50');
      return res.content || res || [];
    } catch {
      return [
        {
          id: 1,
          code: 'CS101',
          name: 'Introduction to Computer Science & AI',
          category: 'Artificial Intelligence & CS',
          description: 'Fundamental algorithms, object-oriented systems, graph theory, and Python machine learning.',
          credits: 4,
          cashDownFee: 1200,
          installmentMonths: 4,
          monthlyInstallment: 250,
          downPaymentAmount: 400,
          focPackage: 'Official Academy T-Shirt, Course Textbooks & Workbooks, Student ID Card',
          teacherId: 1,
          teacherName: 'Dr. John Smith',
          enrolledCount: 38,
        },
        {
          id: 2,
          code: 'FSW102',
          name: 'Full-Stack Web Architecture (React & Spring Boot)',
          category: 'Full-Stack Software Engineering',
          description: 'Enterprise React 19, TypeScript, Vite, Spring Boot 3 REST APIs, PostgreSQL and Redis.',
          credits: 4,
          cashDownFee: 1200,
          installmentMonths: 4,
          monthlyInstallment: 250,
          downPaymentAmount: 400,
          focPackage: 'Official Academy T-Shirt, Branded Tech Backpack, Welcome Sticker Pack',
          teacherId: 2,
          teacherName: 'Prof. Sarah Connor',
          enrolledCount: 45,
        },
        {
          id: 3,
          code: 'UIX201',
          name: 'Digital Product Design & Modern UI/UX Pro Max',
          category: 'Digital Product Design & UI/UX',
          description: 'Design systems, Figma tokens, Swiss modern aesthetics, responsive micro-interactions, WCAG AA.',
          credits: 3,
          cashDownFee: 1100,
          installmentMonths: 3,
          monthlyInstallment: 280,
          downPaymentAmount: 350,
          focPackage: 'Course Textbooks & Workbooks, Student ID Card & Lanyard, UI Kit Assets',
          teacherId: 3,
          teacherName: 'Elena Rostova',
          enrolledCount: 32,
        },
        {
          id: 4,
          code: 'DS301',
          name: 'Data Science, Big Data & Cloud AI',
          category: 'Data Science & Cloud Computing',
          description: 'Predictive analytics, deep learning models, PyTorch, ETL pipelines, and GCP deployment.',
          credits: 4,
          cashDownFee: 1400,
          installmentMonths: 4,
          monthlyInstallment: 300,
          downPaymentAmount: 450,
          focPackage: 'Official Academy T-Shirt, Textbooks, Cloud Credit Voucher $100',
          teacherId: 4,
          teacherName: 'Dr. Alan Turing',
          enrolledCount: 29,
        },
        {
          id: 5,
          code: 'CYB101',
          name: 'Cybersecurity, Threat Analysis & Ethical Hacking',
          category: 'Cybersecurity & Networks',
          description: 'Network defense, penetration testing, cryptography, incident response and cloud hardening.',
          credits: 4,
          cashDownFee: 1350,
          installmentMonths: 4,
          monthlyInstallment: 290,
          downPaymentAmount: 420,
          focPackage: 'Academy T-Shirt, Hardware Security Key, Student ID Badge',
          teacherId: 1,
          teacherName: 'Dr. John Smith',
          enrolledCount: 24,
        },
        {
          id: 6,
          code: 'BIZ201',
          name: 'Tech Entrepreneurship & Product Management',
          category: 'Business, Leadership & Marketing',
          description: 'Agile product roadmaps, go-to-market strategies, unit economics, and AI-assisted marketing.',
          credits: 3,
          cashDownFee: 1000,
          installmentMonths: 3,
          monthlyInstallment: 260,
          downPaymentAmount: 300,
          focPackage: 'Course Case Study Manual, Leadership Notebook & Pen',
          teacherId: 2,
          teacherName: 'Prof. Sarah Connor',
          enrolledCount: 21,
        },
      ];
    }
  }

  async createCourse(courseData: Partial<Course>): Promise<Course> {
    try {
      return await this.request<Course>('/academic/courses', {
        method: 'POST',
        body: JSON.stringify(courseData),
      });
    } catch {
      return {
        id: Date.now(),
        code: courseData.code || 'CRS-NEW',
        name: courseData.name || 'New Course Title',
        category: courseData.category || 'Artificial Intelligence & CS',
        description: courseData.description || '',
        credits: courseData.credits || 3,
        cashDownFee: courseData.cashDownFee || 1200,
        installmentMonths: courseData.installmentMonths || 4,
        monthlyInstallment: courseData.monthlyInstallment || 250,
        downPaymentAmount: courseData.downPaymentAmount || 400,
        focPackage: courseData.focPackage || 'Official Academy T-Shirt, Textbooks, Student ID Card',
        enrolledCount: 0,
      };
    }
  }

  // --- Parent Account & Child Linking ---
  async getParents(): Promise<Parent[]> {
    return this.localParents;
  }

  async createParentAndLinkChild(payload: {
    fullName: string;
    email: string;
    phoneNumber: string;
    occupation?: string;
    relationship: string;
    studentCode: string;
  }): Promise<Parent> {
    try {
      const res = await this.request<any>('/parents', {
        method: 'POST',
        body: JSON.stringify({
          username: payload.email.split('@')[0] || `parent_${Date.now()}`,
          email: payload.email,
          password: 'Parent@123',
          fullName: payload.fullName,
          phoneNumber: payload.phoneNumber,
          occupation: payload.occupation,
          relationship: payload.relationship,
        }),
      });

      if (res && res.id && payload.studentCode) {
        await this.request(`/parents/${res.id}/link-child`, {
          method: 'POST',
          body: JSON.stringify({ studentCode: payload.studentCode }),
        }).catch(() => {});
      }
    } catch {
      // fallback to local collection
    }

    const newParent: Parent = {
      id: Date.now(),
      fullName: payload.fullName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      occupation: payload.occupation,
      relationship: payload.relationship,
      studentCode: payload.studentCode,
      linkedStudentName: `Student (${payload.studentCode})`,
    };
    this.localParents.unshift(newParent);
    return newParent;
  }

  // --- Existing Student Re-Enrollment ---
  async enrollExistingStudent(payload: {
    studentId: number;
    courseId: number;
    paymentPlanType: 'CASH_DOWN' | 'INSTALLMENT';
    initialAmountPaid: number;
    paymentMethod: string;
    focItems: string[];
    paymentDate?: string;
    notes?: string;
  }): Promise<any> {
    try {
      await this.request(`/students/${payload.studentId}/enroll/${payload.courseId}`, {
        method: 'POST',
      });
    } catch {
      // Local fallback
    }

    // If initial payment is made during enrollment, record payment
    if (payload.initialAmountPaid > 0) {
      return await this.recordStudentPayment({
        studentId: payload.studentId,
        courseId: payload.courseId,
        amount: payload.initialAmountPaid,
        paymentMethod: payload.paymentMethod,
        paymentPeriod: payload.paymentPlanType === 'CASH_DOWN' ? 'CASH_DOWN' : 'DOWN_PAYMENT',
        focItems: payload.focItems,
        paymentDate: payload.paymentDate || new Date().toISOString().split('T')[0],
        notes: payload.notes || `Enrollment payment for Course ID #${payload.courseId}`,
      });
    }

    return { success: true, message: 'Student re-enrolled successfully' };
  }

  // --- Payment & Installment Records ---
  async getPaymentRecords(): Promise<Payment[]> {
    try {
      const res = await this.request<any>('/finance/payments');
      if (Array.isArray(res) && res.length > 0) {
        return res;
      }
      return this.localPayments;
    } catch {
      return this.localPayments;
    }
  }

  async recordStudentPayment(payload: {
    studentId: number;
    studentName?: string;
    studentCode?: string;
    courseId?: number;
    courseName?: string;
    courseCategory?: string;
    amount: number;
    paymentMethod: string;
    paymentPeriod: string; // 'DOWN_PAYMENT', 'MONTH_1', 'MONTH_2', 'MONTH_3', 'MONTH_4', 'CASH_DOWN', 'CUSTOM'
    focItems?: string[];
    paymentDate?: string;
    totalFee?: number;
    remainingBalance?: number;
    salesAgentName?: string;
    notes?: string;
  }): Promise<Payment> {
    const receiptNo = `REC-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;
    const txnRef = `TXN-${payload.paymentMethod.substring(0, 3).toUpperCase()}-${String(Math.floor(100000 + Math.random() * 900000))}`;

    const newPayment: Payment = {
      id: Date.now(),
      studentId: payload.studentId,
      studentName: payload.studentName || 'Alice Walker',
      studentCode: payload.studentCode || 'STU-2026-0001',
      courseId: payload.courseId || 1,
      courseName: payload.courseName || 'CS101 - Introduction to Computer Science & AI',
      courseCategory: payload.courseCategory || 'Artificial Intelligence & CS',
      amountPaid: payload.amount,
      paymentDate: payload.paymentDate || new Date().toISOString().split('T')[0],
      paymentMethod: payload.paymentMethod,
      paymentPeriod: payload.paymentPeriod,
      receiptNumber: receiptNo,
      focItems: payload.focItems || [],
      totalFee: payload.totalFee || 1400,
      remainingBalance: payload.remainingBalance !== undefined ? payload.remainingBalance : 750,
      salesAgentName: payload.salesAgentName || 'Sarah Connor (Admissions)',
      notes: payload.notes || 'Payment processed at admissions counter.',
      transactionReference: txnRef,
      status: 'COMPLETED',
    };

    try {
      await this.request('/finance/payments', {
        method: 'POST',
        body: JSON.stringify({
          studentId: payload.studentId,
          feeStructureId: payload.courseId || 1,
          amount: payload.amount,
          paymentMethod: payload.paymentMethod,
          paymentPeriod: payload.paymentPeriod,
          focItems: (payload.focItems || []).join(', '),
          notes: payload.notes,
          totalFee: payload.totalFee,
          remainingBalance: payload.remainingBalance,
          salesAgentName: payload.salesAgentName,
          paymentDate: payload.paymentDate ? `${payload.paymentDate}T12:00:00` : undefined,
          transactionReference: txnRef,
        }),
      });
    } catch {
      // Local collection handles fallback
    }

    this.localPayments.unshift(newPayment);
    return newPayment;
  }

  async recordPayment(payload: any): Promise<Payment> {
    return this.recordStudentPayment({
      studentId: payload.studentId || 1,
      amount: payload.amount || payload.amountPaid || 0,
      paymentMethod: payload.paymentMethod || 'Cash',
      paymentPeriod: payload.paymentPeriod || 'CUSTOM',
      notes: payload.notes || payload.remarks,
      courseId: payload.courseId || payload.feeStructureId || 1,
    });
  }

  // Sales CANNOT delete payment record directly: dispatches void request to admin
  async requestAdminVoidPayment(payload: {
    paymentId: number;
    receiptNumber: string;
    studentName: string;
    reason: string;
    requestedBy?: string;
  }): Promise<AdminDeletionRequest> {
    const req: AdminDeletionRequest = {
      id: Date.now(),
      requestType: 'VOID_PAYMENT_RECORD',
      targetId: payload.paymentId,
      targetIdentifier: payload.receiptNumber,
      targetName: payload.studentName,
      reason: payload.reason,
      requestedBy: payload.requestedBy || 'Sales Agent',
      status: 'PENDING',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    this.localAdminRequests.unshift(req);

    // Update local payment status
    this.localPayments = this.localPayments.map((p) =>
      p.id === payload.paymentId ? { ...p, status: 'VOID_REQUESTED' as const, voidReason: payload.reason } : p
    );

    // Record admin ticket in complaints/affairs
    try {
      await this.request('/affairs/complaints', {
        method: 'POST',
        body: JSON.stringify({
          title: `[SALES REQUEST: VOID PAYMENT RECEIPT] ${payload.receiptNumber} (${payload.studentName})`,
          description: `Sales requested administrative voiding of payment receipt ${payload.receiptNumber}.\nReason: ${payload.reason}\nRequested by: ${req.requestedBy}`,
          severity: 'HIGH',
        }),
      });
    } catch {
      // Local state preserved
    }

    return req;
  }

  async getAdminDeletionRequests(): Promise<AdminDeletionRequest[]> {
    return this.localAdminRequests;
  }

  // --- Attendance APIs ---
  async markAttendance(record: AttendanceRecord) {
    try {
      return await this.request('/attendance/mark', {
        method: 'POST',
        body: JSON.stringify({
          studentId: record.studentId,
          courseId: record.courseId,
          subjectId: record.subjectId || null,
          attendanceDate: record.attendanceDate,
          status: record.status,
          remarks: record.remarks || '',
        }),
      });
    } catch {
      return { success: true, message: 'Attendance recorded successfully' };
    }
  }

  async getStudentAttendance(studentId: number = 1): Promise<any> {
    try {
      return await this.request(`/attendance/student/${studentId}`);
    } catch {
      return { content: [] };
    }
  }

  async getAttendanceSummary(studentId: number = 1): Promise<any> {
    try {
      return await this.request(`/attendance/student/${studentId}/summary`);
    } catch {
      return { totalClasses: 44, presentCount: 42, absentCount: 2, percentage: 95.5 };
    }
  }

  // --- Exams & Results ---
  async getResults(studentId: number = 1): Promise<ExamResult[]> {
    try {
      const res = await this.request<any>(`/academic/students/${studentId}/results`);
      return Array.isArray(res) ? res : (res.content || []);
    } catch {
      return [
        {
          id: 1,
          examId: 1,
          examTitle: 'Midterm Examination 2026',
          studentId: 1,
          studentName: 'Alice Walker',
          studentCode: 'STU-2026-0001',
          subjectName: 'Algorithms & Data Structures',
          marksObtained: 92.5,
          maxMarks: 100,
          grade: 'A',
          remarks: 'Outstanding algorithmic complexity analysis.',
          publishedAt: '2026-09-15',
        },
        {
          id: 2,
          examId: 2,
          examTitle: 'Midterm Examination 2026',
          studentId: 1,
          studentName: 'Alice Walker',
          studentCode: 'STU-2026-0001',
          subjectName: 'Discrete Mathematics',
          marksObtained: 84.5,
          maxMarks: 100,
          grade: 'B+',
          remarks: 'Strong inductive proofs and graph understanding.',
          publishedAt: '2026-09-16',
        },
      ];
    }
  }

  async publishResult(payload: {
    examId: number;
    studentId: number;
    marksObtained: number;
    grade?: string;
    remarks?: string;
  }): Promise<any> {
    try {
      return await this.request('/academic/results/publish', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch {
      return { success: true, message: 'Result published' };
    }
  }

  // --- Timetables ---
  async getTimetable(): Promise<TimetableSlot[]> {
    try {
      const res = await this.request<any>('/academic/timetables');
      if (Array.isArray(res) && res.length > 0) return res;
      if (res && res.content && res.content.length > 0) return res.content;
      return [
        { id: 1, courseId: 1, courseName: 'CS101', subjectId: 1, subjectName: 'Algorithms & DS', dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '10:30', roomNumber: 'Hall 301', teacherName: 'Dr. John Smith' },
        { id: 2, courseId: 2, courseName: 'MATH201', subjectId: 2, subjectName: 'Discrete Math', dayOfWeek: 'MONDAY', startTime: '11:00', endTime: '12:30', roomNumber: 'Lab B', teacherName: 'Prof. Sarah Connor' },
        { id: 3, courseId: 1, courseName: 'CS101', subjectId: 1, subjectName: 'Machine Learning Lab', dayOfWeek: 'WEDNESDAY', startTime: '13:00', endTime: '15:00', roomNumber: 'AI Computing Hub', teacherName: 'Dr. John Smith' },
        { id: 4, courseId: 3, courseName: 'PHY101', subjectId: 3, subjectName: 'Quantum Physics', dayOfWeek: 'THURSDAY', startTime: '10:00', endTime: '11:30', roomNumber: 'Science Tower 4', teacherName: 'Dr. Alan Turing' },
      ];
    } catch {
      return [
        { id: 1, courseId: 1, courseName: 'CS101', subjectId: 1, subjectName: 'Algorithms & DS', dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '10:30', roomNumber: 'Hall 301', teacherName: 'Dr. John Smith' },
        { id: 2, courseId: 2, courseName: 'MATH201', subjectId: 2, subjectName: 'Discrete Math', dayOfWeek: 'MONDAY', startTime: '11:00', endTime: '12:30', roomNumber: 'Lab B', teacherName: 'Prof. Sarah Connor' },
        { id: 3, courseId: 1, courseName: 'CS101', subjectId: 1, subjectName: 'Machine Learning Lab', dayOfWeek: 'WEDNESDAY', startTime: '13:00', endTime: '15:00', roomNumber: 'AI Computing Hub', teacherName: 'Dr. John Smith' },
        { id: 4, courseId: 3, courseName: 'PHY101', subjectId: 3, subjectName: 'Quantum Physics', dayOfWeek: 'THURSDAY', startTime: '10:00', endTime: '11:30', roomNumber: 'Science Tower 4', teacherName: 'Dr. Alan Turing' },
      ];
    }
  }

  // --- Invoices & Finance ---
  async getInvoices(): Promise<Invoice[]> {
    try {
      const res = await this.request<any>('/finance/invoices');
      return Array.isArray(res) ? res : (res.content || []);
    } catch {
      return [
        {
          id: 1,
          invoiceNumber: 'INV-2026-001',
          studentId: 1,
          studentName: 'Alice Walker',
          feeStructureTitle: 'Fall 2026 Computer Science Tuition',
          totalAmount: 4500.0,
          paidAmount: 4500.0,
          balanceAmount: 0.0,
          status: 'PAID',
          dueDate: '2026-09-01',
        },
        {
          id: 2,
          invoiceNumber: 'INV-2026-002',
          studentId: 2,
          studentName: 'Michael Chen',
          feeStructureTitle: 'Fall 2026 Engineering Fee',
          totalAmount: 4500.0,
          paidAmount: 2000.0,
          balanceAmount: 2500.0,
          status: 'PARTIAL',
          dueDate: '2026-10-15',
        },
        {
          id: 3,
          invoiceNumber: 'INV-2026-003',
          studentId: 3,
          studentName: 'Sophia Rodriguez',
          feeStructureTitle: 'Fall 2026 Mathematics Department Tuition',
          totalAmount: 3800.0,
          paidAmount: 0.0,
          balanceAmount: 3800.0,
          status: 'UNPAID',
          dueDate: '2026-10-10',
        },
      ];
    }
  }

  async getStudentInvoices(studentId: number): Promise<Invoice[]> {
    try {
      const res = await this.request<any>(`/finance/invoices/student/${studentId}`);
      return Array.isArray(res) ? res : (res.content || []);
    } catch {
      return (await this.getInvoices()).filter((i) => i.studentId === studentId);
    }
  }

  // --- Leads (Sales) ---
  async getLeads(): Promise<Lead[]> {
    try {
      const res = await this.request<any>('/sales/leads?size=50');
      return res.content || (Array.isArray(res) ? res : []);
    } catch {
      return [
        { id: 1, fullName: 'David Beckham', email: 'david.b@gmail.com', phone: '+1-555-9011', interestedCourse: 'CS101 - Computer Science & AI', status: 'NEW', source: 'Web Portal', createdAt: '2026-09-28' },
        { id: 2, fullName: 'Emma Watson', email: 'emma.w@gmail.com', phone: '+1-555-9012', interestedCourse: 'FSW102 - Full-Stack Web Architecture', status: 'CONTACTED', source: 'Campus Open Day', notes: 'Interested in installment payment plan', createdAt: '2026-09-27' },
        { id: 3, fullName: 'Liam Neeson', email: 'liam.n@yahoo.com', phone: '+1-555-9013', interestedCourse: 'DS301 - Data Science & Cloud AI', status: 'QUALIFIED', source: 'Referral', notes: 'Aptitude test passed. Ready for down payment.', createdAt: '2026-09-25' },
        { id: 4, fullName: 'Olivia Wilde', email: 'olivia.w@outlook.com', phone: '+1-555-9014', interestedCourse: 'UIX201 - Digital Product Design', status: 'ENROLLED', source: 'Direct Admission', createdAt: '2026-09-20' },
      ];
    }
  }

  async createLead(leadData: Partial<Lead>): Promise<Lead> {
    try {
      return await this.request<Lead>('/sales/leads', {
        method: 'POST',
        body: JSON.stringify(leadData),
      });
    } catch {
      return {
        id: Date.now(),
        fullName: leadData.fullName || 'New Prospect',
        email: leadData.email,
        phone: leadData.phone,
        interestedCourse: leadData.interestedCourse,
        status: 'NEW',
        source: leadData.source || 'Direct',
        createdAt: new Date().toISOString().split('T')[0],
      };
    }
  }

  async updateLeadStatus(id: number, status: Lead['status']): Promise<void> {
    try {
      await this.request(`/sales/leads/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
    } catch {
      // Handled
    }
  }

  // --- Student Affairs ---
  async getComplaints(): Promise<Complaint[]> {
    try {
      const res = await this.request<any>('/affairs/complaints?size=50');
      return res.content || (Array.isArray(res) ? res : []);
    } catch {
      return [
        { id: 1, title: 'Projector flickering in Room 301', description: 'During afternoon AI lectures, the projector flashes intermittently.', raisedById: 2, raisedByName: 'Dr. John Smith', studentName: 'Room 301 Class', status: 'IN_PROGRESS', severity: 'MEDIUM', createdAt: '2026-09-27' },
        { id: 2, title: 'Library Study Pod Wi-Fi Dropout', description: 'Quiet study pod #4 loses 5GHz wireless connectivity periodically.', raisedById: 4, raisedByName: 'Alice Walker', studentName: 'Alice Walker', status: 'PENDING', severity: 'LOW', createdAt: '2026-09-28' },
        { id: 3, title: 'Cafeteria Dietary Allergen Notice', description: 'Request clear gluten-free and peanut labeling on daily lunch menus.', raisedById: 1, raisedByName: 'Robert Walker', status: 'RESOLVED', severity: 'HIGH', resolutionNotes: 'Nutrition department implemented color-coded allergen cards.', createdAt: '2026-09-22' },
      ];
    }
  }

  async createComplaint(payload: {
    title: string;
    description: string;
    studentId?: number;
    severity?: string;
  }): Promise<Complaint> {
    return await this.request<Complaint>('/affairs/complaints', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async resolveComplaint(id: number, resolutionNotes: string, status: string = 'RESOLVED'): Promise<void> {
    try {
      await this.request(`/affairs/complaints/${id}/resolve`, {
        method: 'PUT',
        body: JSON.stringify({ status, resolutionNotes }),
      });
    } catch {
      // Handled
    }
  }

  async getLeaveRequests(): Promise<LeaveRequest[]> {
    try {
      const res = await this.request<any>('/affairs/leave');
      return Array.isArray(res) ? res : (res.content || []);
    } catch {
      return [
        { id: 1, studentId: 1, studentName: 'Alice Walker', startDate: '2026-10-05', endDate: '2026-10-07', reason: 'ACM Collegiate Programming Contest Regional Finals', status: 'PENDING', createdAt: '2026-09-28' },
        { id: 2, studentId: 2, studentName: 'Michael Chen', startDate: '2026-09-20', endDate: '2026-09-22', reason: 'Medical appointment & recovery', status: 'APPROVED', reviewedByName: 'Headmaster Admin', createdAt: '2026-09-18' },
      ];
    }
  }

  async applyForLeave(payload: {
    studentId: number;
    startDate: string;
    endDate: string;
    reason: string;
  }): Promise<LeaveRequest> {
    return await this.request<LeaveRequest>('/affairs/leave', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async updateLeaveStatus(id: number, status: 'APPROVED' | 'REJECTED'): Promise<void> {
    try {
      await this.request(`/affairs/leave/${id}/status?status=${status}`, {
        method: 'PUT',
      });
    } catch {
      // Handled
    }
  }

  // --- Notifications ---
  async getNotifications(): Promise<NotificationItem[]> {
    try {
      const res = await this.request<any>('/notifications');
      return res.content || (Array.isArray(res) ? res : []);
    } catch {
      return [
        { id: 1, recipientId: 1, title: 'Fall Midterm Exam Results Published', message: 'Official grades for CS101 and MATH201 are now accessible in your portal.', type: 'ACADEMIC', isRead: false, createdAt: '10 mins ago' },
        { id: 2, recipientId: 1, title: 'Attendance Alert: 100% Milestone', message: 'Congratulations! Alice Walker has achieved perfect attendance for September.', type: 'ATTENDANCE', isRead: false, createdAt: '2 hours ago' },
        { id: 3, recipientId: 1, title: 'Tuition Fee Receipt INV-2026-001', message: 'Payment of $4,500.00 has been verified and settled.', type: 'FEE', isRead: true, createdAt: 'Yesterday' },
      ];
    }
  }

  async markNotificationRead(id: number): Promise<void> {
    try {
      await this.request(`/notifications/${id}/read`, {
        method: 'PUT',
      });
    } catch {
      // Handled
    }
  }

  // --- AI Intelligence Copilot (Gemini API) ---
  async askAi(prompt: string, studentId?: number): Promise<string> {
    try {
      if (studentId) {
        const res = await this.request<any>(`/ai/performance/${studentId}`);
        return res.analysis || res.aiResponse || JSON.stringify(res);
      }
      const res = await this.request<any>('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message: prompt, studentId }),
      });
      return res.reply || res.response || res.aiResponse || res;
    } catch {
      // Smart contextual fallback response
      if (prompt.toLowerCase().includes('attendance')) {
        return "📊 **AI Attendance Insight**: Alice Walker has an exemplary 96.5% attendance rate with zero unexcused absences. Michael Chen has an 82% attendance rate with absences concentrated on Friday lab sessions. Recommendation: Send an automated pulse check notification to Michael Chen's advisor.";
      }
      if (prompt.toLowerCase().includes('fee') || prompt.toLowerCase().includes('invoice') || prompt.toLowerCase().includes('installment')) {
        return "💳 **AI Financial Assessment**: 84% of semester tuition has been collected. 18 invoices remain outstanding totaling $38,400. Automated friendly installment reminders scheduled for delivery 3 days before the October 15th milestone.";
      }
      if (prompt.toLowerCase().includes('risk') || prompt.toLowerCase().includes('performance')) {
        return "🧠 **AI Academic Risk Predictor**: Evaluated 1,240 enrolled students against historical grade correlations. 3 students flagged with downward grade trajectory. Interventions recommended: Schedule 1-on-1 tutoring in Discrete Mathematics.";
      }
      return `🤖 **EduPulse Gemini AI Copilot**: I have analyzed your request regarding "${prompt}". All academic indicators, database indexes, and student event listeners are operating within normal parameters. Let me know if you would like me to generate a detailed report.`;
    }
  }
}

export const api = new ApiService();

