export type RoleType = 
  | 'ROLE_ADMIN' 
  | 'ROLE_TEACHER' 
  | 'ROLE_STUDENT' 
  | 'ROLE_PARENT' 
  | 'ROLE_SALES' 
  | 'ROLE_STUDENT_AFFAIR';

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  roles: RoleType[];
}

export interface Student {
  id: number;
  userId: number;
  studentCode: string;
  username: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  dob?: string;
  gender?: string;
  address?: string;
  emergencyContact?: string;
  parentId?: number;
  parentName?: string;
  parentPhone?: string;
  enrolledCourses: Course[];
  attendancePercentage: number;
  averageMarks: number;
  totalTuitionFee?: number;
  totalPaidAmount?: number;
  balanceDue?: number;
  paymentPlanType?: 'CASH_DOWN' | 'INSTALLMENT';
  focItemsReceived?: string[];
  joinedDate?: string;
}

export interface Teacher {
  id: number;
  userId: number;
  employeeCode: string;
  fullName: string;
  email: string;
  specialization?: string;
  qualification?: string;
  hireDate?: string;
}

export type CourseCategory = 
  | 'Artificial Intelligence & CS'
  | 'Full-Stack Software Engineering'
  | 'Data Science & Cloud Computing'
  | 'Cybersecurity & Networks'
  | 'Digital Product Design & UI/UX'
  | 'Business, Leadership & Marketing'
  | 'Languages & Humanities';

export interface Course {
  id: number;
  code: string;
  name: string;
  category?: CourseCategory | string;
  description?: string;
  credits: number;
  cashDownFee?: number;
  installmentMonths?: number;
  monthlyInstallment?: number;
  downPaymentAmount?: number;
  focPackage?: string;
  teacherId?: number;
  teacherName?: string;
  subjects?: Subject[];
  enrolledCount?: number;
}

export interface Subject {
  id: number;
  code: string;
  name: string;
  courseId: number;
  courseName?: string;
  teacherId?: number;
  teacherName?: string;
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export interface AttendanceRecord {
  id?: number;
  studentId: number;
  studentName?: string;
  studentCode?: string;
  courseId: number;
  courseName?: string;
  subjectId?: number;
  subjectName?: string;
  attendanceDate: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface TimetableSlot {
  id: number;
  courseId: number;
  courseName: string;
  subjectId: number;
  subjectName: string;
  teacherId?: number;
  teacherName?: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  roomNumber?: string;
}

export interface Exam {
  id: number;
  title: string;
  examDate: string;
  courseId: number;
  courseName?: string;
  subjectId: number;
  subjectName?: string;
  maxMarks: number;
  term?: string;
}

export interface ExamResult {
  id: number;
  examId: number;
  examTitle: string;
  studentId: number;
  studentName: string;
  studentCode: string;
  subjectName: string;
  marksObtained: number;
  maxMarks: number;
  grade: string;
  remarks?: string;
  publishedAt?: string;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  studentId: number;
  studentName: string;
  feeStructureTitle: string;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: 'PAID' | 'UNPAID' | 'PARTIAL';
  dueDate: string;
}

export interface Payment {
  id: number;
  studentId: number;
  studentName: string;
  studentCode?: string;
  courseId?: number;
  courseName?: string;
  courseCategory?: string;
  amountPaid: number;
  paymentDate: string;
  paymentMethod: string;
  paymentPeriod?: string; // 'DOWN_PAYMENT', 'MONTH_1', 'MONTH_2', 'MONTH_3', 'MONTH_4', 'CASH_DOWN', 'CUSTOM'
  receiptNumber?: string;
  focItems?: string[];
  totalFee?: number;
  remainingBalance?: number;
  salesAgentName?: string;
  notes?: string;
  transactionReference: string;
  status: 'COMPLETED' | 'PENDING' | 'VOID_REQUESTED' | 'FAILED';
  voidReason?: string;
}

export interface Parent {
  id: number;
  userId?: number;
  username?: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  occupation?: string;
  relationship: string;
  studentCode?: string;
  linkedStudentName?: string;
}

export interface AdminDeletionRequest {
  id: number;
  requestType: 'DELETE_STUDENT' | 'VOID_PAYMENT_RECORD';
  targetId: number;
  targetIdentifier: string; // e.g. studentCode or receiptNumber
  targetName: string;
  reason: string;
  requestedBy: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'ENROLLED' | 'LOST';

export interface Lead {
  id: number;
  fullName: string;
  email?: string;
  phone?: string;
  interestedCourse?: string;
  status: LeadStatus;
  source?: string;
  notes?: string;
  assignedUserId?: number;
  assignedUserName?: string;
  createdAt: string;
}

export type ComplaintStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Complaint {
  id: number;
  title: string;
  description: string;
  raisedById: number;
  raisedByName: string;
  studentId?: number;
  studentName?: string;
  status: ComplaintStatus;
  severity: SeverityLevel;
  resolutionNotes?: string;
  createdAt: string;
}

export interface LeaveRequest {
  id: number;
  studentId: number;
  studentName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewedById?: number;
  reviewedByName?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: number;
  recipientId: number;
  title: string;
  message: string;
  type: 'ACADEMIC' | 'ATTENDANCE' | 'FEE' | 'ALERT' | 'SYSTEM';
  isRead: boolean;
  createdAt: string;
}

export interface DisciplineRecord {
  id: number;
  studentId: number;
  studentName: string;
  incidentDate: string;
  description: string;
  actionTaken?: string;
  reportedById?: number;
  reportedByName?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalRevenue: number;
  overallAttendanceRate: number;
  pendingInvoicesCount: number;
  activeLeadsCount: number;
  openComplaintsCount: number;
}

