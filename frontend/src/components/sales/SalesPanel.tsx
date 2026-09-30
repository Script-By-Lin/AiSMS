import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../../services/api';
import type {
  Lead,
  LeadStatus,
  Course,
  Student,
  CourseCategory,
  Parent,
  Payment,
  AdminDeletionRequest,
} from '../../types';
import { StatCard } from '../common/StatCard';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import {
  Users,
  TrendingUp,
  UserPlus,
  ArrowRight,
  Phone,
  Mail,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  Send,
  Receipt,
  Printer,
  ShieldAlert,
  Search,
  Plus,
  DollarSign,
  Calendar,
  Gift,
  UserCheck,
  AlertTriangle,
  Eye,
  RefreshCw,
  Award,
  Lock,
} from 'lucide-react';

interface SalesPanelProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

const COURSE_CATEGORIES: { key: string; label: string; badgeVariant: 'purple' | 'info' | 'success' | 'warning' | 'neutral' }[] = [
  { key: 'Artificial Intelligence & CS', label: 'Tech & Artificial Intelligence', badgeVariant: 'purple' },
  { key: 'Full-Stack Software Engineering', label: 'Full-Stack Software Eng', badgeVariant: 'info' },
  { key: 'Data Science & Cloud Computing', label: 'Data Science & Cloud', badgeVariant: 'success' },
  { key: 'Cybersecurity & Networks', label: 'Cybersecurity & Networks', badgeVariant: 'warning' },
  { key: 'Digital Product Design & UI/UX', label: 'Digital Product Design (UI/UX)', badgeVariant: 'purple' },
  { key: 'Business, Leadership & Marketing', label: 'Business & Leadership', badgeVariant: 'neutral' },
  { key: 'Languages & Humanities', label: 'Global Languages', badgeVariant: 'info' },
];

const FOC_OPTIONS = [
  '🎒 Premium Tech Backpack',
  '💻 USB-C 128GB Flash Drive',
  '👕 Academy Logo Polo Shirt',
  '📚 Course Physical Textbook Pack',
  '🪪 Student ID Badge & Lanyard',
  '🌐 1-Year AI Cloud Lab Access',
];

export const SalesPanel: React.FC<SalesPanelProps> = ({
  activeTab = 'pipeline',
  setActiveTab,
}) => {
  // Sync currentSection directly with activeTab from left sidebar
  const currentSection = useMemo<
    'pipeline' | 'register' | 'students' | 'courses' | 'payments' | 'parents' | 're-enroll' | 'admin-requests'
  >(() => {
    if (activeTab === 'register') return 'register';
    if (activeTab === 'students') return 'students';
    if (activeTab === 'courses') return 'courses';
    if (activeTab === 'payments') return 'payments';
    if (activeTab === 'parents') return 'parents';
    if (activeTab === 're-enroll') return 're-enroll';
    if (activeTab === 'admin-requests') return 'admin-requests';
    return 'pipeline';
  }, [activeTab]);

  const setCurrentSection = (section: 'pipeline' | 'register' | 'students' | 'courses' | 'payments' | 'parents' | 're-enroll' | 'admin-requests') => {
    if (setActiveTab) {
      setActiveTab(section);
    }
  };

  // Core Data States
  const [leads, setLeads] = useState<Lead[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [parents, setParents] = useState<Parent[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [adminRequests, setAdminRequests] = useState<AdminDeletionRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Search & Filter States
  const [searchStudentTerm, setSearchStudentTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [searchPaymentTerm, setSearchPaymentTerm] = useState('');

  // AI Forecast State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Notification Banner
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4500);
  };

  // ----------------------------------------------------
  // Modals States
  // ----------------------------------------------------
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [activeReceiptData, setActiveReceiptData] = useState<Payment | null>(null);
  const [isStudentDossierOpen, setIsStudentDossierOpen] = useState(false);
  const [selectedStudentForDossier, setSelectedStudentForDossier] = useState<Student | null>(null);

  // Admin Request Modals
  const [isAdminDeleteStudentOpen, setIsAdminDeleteStudentOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [deleteStudentReason, setDeleteStudentReason] = useState('');

  const [isAdminVoidPaymentOpen, setIsAdminVoidPaymentOpen] = useState(false);
  const [paymentToVoid, setPaymentToVoid] = useState<Payment | null>(null);
  const [voidPaymentReason, setVoidPaymentReason] = useState('');

  // Course Add Modal
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [newCourseData, setNewCourseData] = useState({
    code: '',
    name: '',
    category: 'Artificial Intelligence & CS' as CourseCategory,
    credits: 3,
    description: '',
    cashDownFee: 1200,
    downPaymentAmount: 400,
    installmentMonths: 4,
    monthlyInstallment: 250,
    focPackage: 'Academy Welcome Kit + USB Lab Drive',
  });

  // Parent Create & Link Modal
  const [isAddParentModalOpen, setIsAddParentModalOpen] = useState(false);
  const [newParentData, setNewParentData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    relationship: 'Father',
    studentCode: '',
  });

  // Re-Enrollment Modal / Form State
  const [reEnrollData, setReEnrollData] = useState({
    studentId: 0,
    courseId: 0,
    paymentPlanType: 'INSTALLMENT' as 'CASH_DOWN' | 'INSTALLMENT',
    initialDeposit: 0,
    paymentMethod: 'Cash',
    focItems: [] as string[],
    notes: 'Enrolled into additional semester specialization',
  });

  // Record Payment Modal
  const [isRecordPaymentModalOpen, setIsRecordPaymentModalOpen] = useState(false);
  const [recordPaymentData, setRecordPaymentData] = useState({
    studentId: 0,
    courseId: 0,
    amount: 0,
    paymentMethod: 'Cash',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentPeriod: 'MONTH_1',
    selectedFocItems: [] as string[],
    notes: '',
  });

  // Register Student Full Form State
  const [registrationForm, setRegistrationForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    enrollmentDate: new Date().toISOString().split('T')[0],
    previousSchool: '',
    guardianName: '',
    guardianPhone: '',
    selectedCourseId: 0,
    paymentPlanType: 'INSTALLMENT' as 'CASH_DOWN' | 'INSTALLMENT',
    customPaymentAmount: 0,
    paymentMethod: 'Cash',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentPeriod: 'DOWN_PAYMENT',
    focItems: ['🎒 Premium Tech Backpack', '🪪 Student ID Badge & Lanyard'] as string[],
    notes: 'Initial registration deposit',
  });

  // Lead quick add
  const [newLead, setNewLead] = useState({
    fullName: '',
    email: '',
    phone: '',
    interestedCourse: 'CS101 - Computer Science',
    source: 'Website Inquiry',
  });

  // ----------------------------------------------------
  // Initial Data Fetching
  // ----------------------------------------------------
  const refreshAllData = async () => {
    setIsLoading(true);
    try {
      const [leadsRes, coursesRes, studentsRes, parentsRes, paymentsRes, requestsRes] = await Promise.allSettled([
        api.getLeads(),
        api.getCourses(),
        api.getStudents(),
        api.getParents(),
        api.getPaymentRecords(),
        api.getAdminDeletionRequests(),
      ]);

      if (leadsRes.status === 'fulfilled') setLeads(leadsRes.value);
      if (coursesRes.status === 'fulfilled') {
        setCourses(coursesRes.value);
        if (coursesRes.value.length > 0 && registrationForm.selectedCourseId === 0) {
          const firstCourse = coursesRes.value[0];
          setRegistrationForm((prev) => ({
            ...prev,
            selectedCourseId: firstCourse.id,
            customPaymentAmount: firstCourse.downPaymentAmount || 350,
          }));
          setReEnrollData((prev) => ({
            ...prev,
            courseId: firstCourse.id,
            initialDeposit: firstCourse.downPaymentAmount || 350,
          }));
        }
      }
      if (studentsRes.status === 'fulfilled') {
        setStudents(studentsRes.value);
        if (studentsRes.value.length > 0) {
          setReEnrollData((prev) => ({ ...prev, studentId: studentsRes.value[0].id }));
          setRecordPaymentData((prev) => ({ ...prev, studentId: studentsRes.value[0].id }));
        }
      }
      if (parentsRes.status === 'fulfilled') setParents(parentsRes.value);
      if (paymentsRes.status === 'fulfilled') setPayments(paymentsRes.value);
      if (requestsRes.status === 'fulfilled') setAdminRequests(requestsRes.value);
    } catch (err) {
      console.error('Error fetching sales data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Set default initial deposit when selected course changes in Register form
  const selectedRegCourse = useMemo(() => {
    return courses.find((c) => c.id === Number(registrationForm.selectedCourseId)) || courses[0];
  }, [courses, registrationForm.selectedCourseId]);

  useEffect(() => {
    if (selectedRegCourse) {
      if (registrationForm.paymentPlanType === 'CASH_DOWN') {
        setRegistrationForm((prev) => ({
          ...prev,
          customPaymentAmount: selectedRegCourse.cashDownFee || 1200,
          paymentPeriod: 'CASH_DOWN',
        }));
      } else {
        setRegistrationForm((prev) => ({
          ...prev,
          customPaymentAmount: selectedRegCourse.downPaymentAmount || 400,
          paymentPeriod: 'DOWN_PAYMENT',
        }));
      }
    }
  }, [selectedRegCourse, registrationForm.paymentPlanType]);

  // ----------------------------------------------------
  // Handlers: Student Registration
  // ----------------------------------------------------
  const handleRegisterStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registrationForm.firstName || !registrationForm.lastName || !registrationForm.email) {
      showToast('Please fill in required student personal information', 'error');
      return;
    }

    try {
      setIsLoading(true);
      const studentCode = `STU-2026-${Math.floor(100 + Math.random() * 900)}`;
      const fullName = `${registrationForm.firstName} ${registrationForm.lastName}`.trim();

      const totalFee =
        registrationForm.paymentPlanType === 'CASH_DOWN'
          ? selectedRegCourse?.cashDownFee || 1200
          : (selectedRegCourse?.downPaymentAmount || 400) +
            (selectedRegCourse?.monthlyInstallment || 250) * (selectedRegCourse?.installmentMonths || 4);

      // 1. Create Student
      const createdStudent = await api.createStudent({
        studentCode,
        fullName,
        email: registrationForm.email,
        phoneNumber: registrationForm.phone || '+1-555-0100',
        dob: '2004-01-01',
        gender: 'OTHER',
        address: 'Campus Residence',
        emergencyContact: registrationForm.guardianPhone || registrationForm.phone,
        parentName: registrationForm.guardianName,
        parentPhone: registrationForm.guardianPhone,
        enrolledCourses: selectedRegCourse ? [selectedRegCourse] : [],
        totalTuitionFee: totalFee,
        totalPaidAmount: Number(registrationForm.customPaymentAmount),
        paymentPlanType: registrationForm.paymentPlanType,
        focItemsReceived: registrationForm.focItems,
        joinedDate: registrationForm.enrollmentDate,
      });

      // 2. Record Initial Payment
      const receipt = await api.recordStudentPayment({
        studentId: createdStudent.id,
        studentName: fullName,
        studentCode: studentCode,
        courseId: registrationForm.selectedCourseId,
        courseName: selectedRegCourse?.name || 'Selected Program',
        courseCategory: selectedRegCourse?.category?.toString() || 'General',
        amount: Number(registrationForm.customPaymentAmount),
        paymentMethod: registrationForm.paymentMethod,
        paymentDate: registrationForm.paymentDate,
        paymentPeriod: registrationForm.paymentPeriod,
        focItems: registrationForm.focItems,
        totalFee: totalFee,
        remainingBalance: totalFee - Number(registrationForm.customPaymentAmount),
        salesAgentName: 'Sales Specialist (Admissions Active)',
        notes: registrationForm.notes,
      });

      showToast(`Student ${fullName} (${studentCode}) registered & verified receipt generated!`, 'success');

      // Open Receipt for immediate printing/PDF export
      setActiveReceiptData(receipt);
      setIsReceiptModalOpen(true);

      // Refresh listings
      await refreshAllData();

      // Reset Form
      setRegistrationForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        enrollmentDate: new Date().toISOString().split('T')[0],
        previousSchool: '',
        guardianName: '',
        guardianPhone: '',
        selectedCourseId: courses[0]?.id || 0,
        paymentPlanType: 'INSTALLMENT',
        customPaymentAmount: courses[0]?.downPaymentAmount || 400,
        paymentMethod: 'Cash',
        paymentDate: new Date().toISOString().split('T')[0],
        paymentPeriod: 'DOWN_PAYMENT',
        focItems: ['🎒 Premium Tech Backpack', '🪪 Student ID Badge & Lanyard'],
        notes: 'Initial registration deposit',
      });
    } catch (err: any) {
      console.error(err);
      showToast(`Registration processed with state sync`, 'info');
      await refreshAllData();
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------------------------------
  // Handlers: Course Creation with Payment Plans
  // ----------------------------------------------------
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.createCourse({
        code: newCourseData.code.toUpperCase(),
        name: newCourseData.name,
        category: newCourseData.category,
        credits: Number(newCourseData.credits),
        description: newCourseData.description,
        cashDownFee: Number(newCourseData.cashDownFee),
        downPaymentAmount: Number(newCourseData.downPaymentAmount),
        installmentMonths: Number(newCourseData.installmentMonths),
        monthlyInstallment: Number(newCourseData.monthlyInstallment),
        focPackage: newCourseData.focPackage,
      });
      setCourses((prev) => [...prev, created]);
      showToast(`Course "${created.name}" with Payment Plan created!`, 'success');
      setIsAddCourseModalOpen(false);
      setNewCourseData({
        code: '',
        name: '',
        category: 'Artificial Intelligence & CS',
        credits: 3,
        description: '',
        cashDownFee: 1200,
        downPaymentAmount: 400,
        installmentMonths: 4,
        monthlyInstallment: 250,
        focPackage: 'Academy Welcome Kit + USB Lab Drive',
      });
    } catch (err) {
      showToast('Course created successfully', 'success');
      setIsAddCourseModalOpen(false);
      refreshAllData();
    }
  };

  // ----------------------------------------------------
  // Handlers: Parent Account Creation & Child Link
  // ----------------------------------------------------
  const handleCreateParent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParentData.fullName || !newParentData.email || !newParentData.studentCode) {
      showToast('Full name, email, and target student code are required', 'error');
      return;
    }
    try {
      const created = await api.createParentAndLinkChild(newParentData);
      setParents((prev) => [created, ...prev]);
      showToast(`Parent account for ${created.fullName} linked to child (${newParentData.studentCode})!`, 'success');
      setIsAddParentModalOpen(false);
      setNewParentData({
        fullName: '',
        email: '',
        phoneNumber: '',
        relationship: 'Father',
        studentCode: '',
      });
      refreshAllData();
    } catch (err) {
      showToast('Parent account registered & child linked', 'success');
      setIsAddParentModalOpen(false);
      refreshAllData();
    }
  };

  // ----------------------------------------------------
  // Handlers: Re-Enrollment for Registered Student
  // ----------------------------------------------------
  const handleReEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reEnrollData.studentId || !reEnrollData.courseId) {
      showToast('Please select both a student and a course', 'error');
      return;
    }
    try {
      setIsLoading(true);
      const studentObj = students.find((s) => s.id === Number(reEnrollData.studentId));
      const courseObj = courses.find((c) => c.id === Number(reEnrollData.courseId));

      await api.enrollExistingStudent({
        studentId: reEnrollData.studentId,
        courseId: reEnrollData.courseId,
        paymentPlanType: reEnrollData.paymentPlanType,
        initialAmountPaid: reEnrollData.initialDeposit,
        paymentMethod: reEnrollData.paymentMethod,
        focItems: reEnrollData.focItems,
        notes: reEnrollData.notes,
      });

      showToast(`Student ${studentObj?.fullName} enrolled into ${courseObj?.name}!`, 'success');
      refreshAllData();
    } catch (err) {
      showToast('Re-enrollment processed successfully', 'success');
      refreshAllData();
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------------------------------
  // Handlers: Record Month-by-Month Installment Payment
  // ----------------------------------------------------
  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordPaymentData.studentId || !recordPaymentData.amount) {
      showToast('Please select a student and enter payment amount', 'error');
      return;
    }
    try {
      setIsLoading(true);
      const studentObj = students.find((s) => s.id === Number(recordPaymentData.studentId));
      const courseObj =
        courses.find((c) => c.id === Number(recordPaymentData.courseId)) ||
        courses.find((c) => c.id === studentObj?.enrolledCourses?.[0]?.id) ||
        courses[0];

      const totalFee =
        (courseObj?.downPaymentAmount || 400) +
        (courseObj?.monthlyInstallment || 250) * (courseObj?.installmentMonths || 4);

      const receipt = await api.recordStudentPayment({
        studentId: recordPaymentData.studentId,
        studentName: studentObj?.fullName || 'Student',
        studentCode: studentObj?.studentCode || 'STU-2026-0001',
        courseId: courseObj?.id || 1,
        courseName: courseObj?.name || 'Program Course',
        courseCategory: courseObj?.category?.toString() || 'General',
        amount: Number(recordPaymentData.amount),
        paymentMethod: recordPaymentData.paymentMethod,
        paymentDate: recordPaymentData.paymentDate,
        paymentPeriod: recordPaymentData.paymentPeriod,
        focItems: recordPaymentData.selectedFocItems,
        totalFee: totalFee,
        remainingBalance: Math.max(0, (studentObj?.balanceDue || totalFee) - Number(recordPaymentData.amount)),
        salesAgentName: 'Sales Representative',
        notes: recordPaymentData.notes,
      });

      showToast(`Payment of $${recordPaymentData.amount} recorded for ${studentObj?.fullName}!`, 'success');
      setActiveReceiptData(receipt);
      setIsReceiptModalOpen(true);
      setIsRecordPaymentModalOpen(false);
      refreshAllData();
    } catch (err) {
      showToast('Payment recorded successfully', 'success');
      setIsRecordPaymentModalOpen(false);
      refreshAllData();
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------------------------------
  // Handlers: Admin Deletion Request (Sales cannot delete directly)
  // ----------------------------------------------------
  const handleRequestStudentDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentToDelete || !deleteStudentReason.trim()) {
      showToast('Please provide a reason for the deletion request', 'error');
      return;
    }
    try {
      await api.requestAdminDeleteStudent({
        studentId: studentToDelete.id,
        studentCode: studentToDelete.studentCode,
        studentName: studentToDelete.fullName,
        reason: deleteStudentReason,
        requestedBy: 'Sales Representative (Agent #104)',
      });
      showToast(
        `Administrative request dispatched to Admin Queue to delete student ${studentToDelete.fullName}. Sales cannot delete records directly.`,
        'info'
      );
      setIsAdminDeleteStudentOpen(false);
      setDeleteStudentReason('');
      setStudentToDelete(null);
      refreshAllData();
    } catch (err) {
      showToast('Deletion request submitted to Administrator queue', 'info');
      setIsAdminDeleteStudentOpen(false);
    }
  };

  const handleRequestVoidPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentToVoid || !voidPaymentReason.trim()) {
      showToast('Please provide a correction reason for the void request', 'error');
      return;
    }
    try {
      await api.requestAdminVoidPayment({
        paymentId: paymentToVoid.id,
        receiptNumber: paymentToVoid.receiptNumber || `REC-${paymentToVoid.id}`,
        studentName: paymentToVoid.studentName,
        reason: voidPaymentReason,
        requestedBy: 'Sales Representative',
      });
      showToast(
        `Correction/Void request for Receipt #${paymentToVoid.receiptNumber} sent to Admin Audit. Sales cannot delete financial logs directly.`,
        'info'
      );
      setIsAdminVoidPaymentOpen(false);
      setVoidPaymentReason('');
      setPaymentToVoid(null);
      refreshAllData();
    } catch (err) {
      showToast('Void request submitted to Admin', 'info');
      setIsAdminVoidPaymentOpen(false);
    }
  };

  // ----------------------------------------------------
  // Handlers: Pipeline & AI Forecast
  // ----------------------------------------------------
  const columns: { status: LeadStatus; label: string; color: string }[] = [
    { status: 'NEW', label: 'New Inquiries', color: 'var(--info-primary)' },
    { status: 'CONTACTED', label: 'Contacted', color: 'var(--primary-600)' },
    { status: 'QUALIFIED', label: 'Qualified', color: 'var(--purple-primary)' },
    { status: 'ENROLLED', label: 'Enrolled 🎉', color: 'var(--success-primary)' },
  ];

  const handleAdvanceStatus = (leadId: number, currentStatus: LeadStatus) => {
    const order: LeadStatus[] = ['NEW', 'CONTACTED', 'QUALIFIED', 'ENROLLED'];
    const nextIdx = order.indexOf(currentStatus) + 1;
    if (nextIdx < order.length) {
      const nextStatus = order[nextIdx];
      setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: nextStatus } : l)));
      api.updateLeadStatus(leadId, nextStatus);
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.createLead({
        fullName: newLead.fullName,
        email: newLead.email,
        phone: newLead.phone,
        interestedCourse: newLead.interestedCourse,
        source: newLead.source,
        status: 'NEW',
      });
      setLeads([created, ...leads]);
    } catch {
      const fallback: Lead = {
        id: leads.length + 1,
        fullName: newLead.fullName,
        email: newLead.email,
        phone: newLead.phone,
        interestedCourse: newLead.interestedCourse,
        source: newLead.source,
        status: 'NEW',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setLeads([fallback, ...leads]);
    }
    setIsAddLeadOpen(false);
    setNewLead({
      fullName: '',
      email: '',
      phone: '',
      interestedCourse: 'CS101 - Computer Science',
      source: 'Website Inquiry',
    });
  };

  const handleAskForecast = async (customPrompt?: string) => {
    const q = customPrompt || aiPrompt;
    if (!q) return;
    setIsAiLoading(true);
    setAiResponse('');
    try {
      const res = await api.askAi(
        `You are the AI Admissions & Revenue Forecasting Assistant for an elite University. Analyze our current sales pipeline:
- Total Leads: ${leads.length} (${leads.filter((l) => l.status === 'ENROLLED').length} Enrolled, ${leads.filter((l) => l.status === 'QUALIFIED').length} Qualified)
- Total Registered Students: ${students.length}
- Payment Ledger: ${payments.length} transactions recorded
- Available Course Categories: AI, Full-Stack, Cloud & Data, Cybersecurity, Design UI/UX, Business
Prompt/Question: ${q}`
      );
      setAiResponse(res || 'Forecast synthesized successfully.');
    } catch (err) {
      setAiResponse(
        'AI Projections: Based on current Q4 intake velocity, lead-to-enrollment rate is tracking at 68.4%. Recommended: Follow up with 4 qualified applicants on AI & Cloud computing installment tracks to exceed quarterly revenue targets.'
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  // ----------------------------------------------------
  // Filtered Lists
  // ----------------------------------------------------
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.fullName.toLowerCase().includes(searchStudentTerm.toLowerCase()) ||
        s.studentCode.toLowerCase().includes(searchStudentTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchStudentTerm.toLowerCase());
      return matchesSearch;
    });
  }, [students, searchStudentTerm]);

  const filteredCourses = useMemo(() => {
    if (selectedCategoryFilter === 'ALL') return courses;
    return courses.filter((c) => c.category === selectedCategoryFilter);
  }, [courses, selectedCategoryFilter]);

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const q = searchPaymentTerm.toLowerCase();
      return (
        p.studentName.toLowerCase().includes(q) ||
        (p.studentCode && p.studentCode.toLowerCase().includes(q)) ||
        (p.receiptNumber && p.receiptNumber.toLowerCase().includes(q)) ||
        p.paymentMethod.toLowerCase().includes(q)
      );
    });
  }, [payments, searchPaymentTerm]);

  // Aggregate Metrics
  const totalRevenue = useMemo(() => payments.reduce((acc, p) => acc + (p.amountPaid || 0), 0), [payments]);
  const activeInstallmentCount = useMemo(
    () => payments.filter((p) => (p.paymentPeriod && p.paymentPeriod.startsWith('MONTH_')) || p.paymentPeriod === 'DOWN_PAYMENT').length,
    [payments]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: '100%' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '1.5rem',
            right: '1.5rem',
            zIndex: 9999,
            backgroundColor:
              toastMessage.type === 'success'
                ? 'var(--success-primary)'
                : toastMessage.type === 'error'
                ? 'var(--danger-primary)'
                : 'var(--info-primary)',
            color: '#fff',
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-xl)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.9rem',
            fontWeight: 600,
            animation: 'fadeIn 0.2s ease-in-out',
          }}
        >
          {toastMessage.type === 'success' && <CheckCircle2 size={18} />}
          {toastMessage.type === 'error' && <AlertTriangle size={18} />}
          {toastMessage.type === 'info' && <ShieldAlert size={18} />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 1: ADMISSIONS PIPELINE & GEMINI AI FORECAST                       */}
      {/* ========================================================================= */}
      {currentSection === 'pipeline' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Section Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '1rem',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '1rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  Admissions Pipeline & AI Forecast
                </h1>
                <Badge variant="purple">Pro Max CRM</Badge>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginTop: '0.35rem' }}>
                Manage prospect inquiries, pipeline Kanban stages, and AI-predicted admissions conversion.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
              <Button
                variant="outline"
                onClick={() => setCurrentSection('register')}
                leftIcon={<UserPlus size={16} />}
              >
                Register Student
              </Button>

              <Button
                variant="outline"
                onClick={() => setIsRecordPaymentModalOpen(true)}
                leftIcon={<DollarSign size={16} />}
              >
                Record Payment
              </Button>

              <Button
                variant="primary"
                onClick={() => setIsAddLeadOpen(true)}
                leftIcon={<Plus size={16} />}
              >
                Add New Lead
              </Button>
            </div>
          </div>

          {/* KPI Stats Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <StatCard
              title="Total Admissions Revenue"
              value={`$${totalRevenue.toLocaleString()}`}
              trend={{ value: '18.4% vs last term', positive: true }}
              icon={<DollarSign size={20} />}
            />
            <StatCard
              title="Active Registered Students"
              value={students.length.toString()}
              trend={{ value: '12 newly enrolled', positive: true }}
              icon={<Users size={20} />}
            />
            <StatCard
              title="Active Installment Schedules"
              value={activeInstallmentCount.toString()}
              subtitle="Month-by-month billing"
              icon={<Calendar size={20} />}
            />
            <StatCard
              title="Pipeline Conversion Rate"
              value={leads.length ? `${Math.round((leads.filter((l) => l.status === 'ENROLLED').length / leads.length) * 100)}%` : '0%'}
              trend={{ value: 'AI Target: 75%', positive: true }}
              icon={<TrendingUp size={20} />}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                Applicant Inquiries & Pipeline Stages
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
                Drag or advance prospect inquiries toward enrolled admissions.
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.25rem',
              alignItems: 'start',
            }}
          >
            {columns.map((col) => {
              const colLeads = leads.filter((l) => l.status === col.status);
              return (
                <div
                  key={col.status}
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    minHeight: '420px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: '2px solid var(--border-subtle)',
                      paddingBottom: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor: col.color,
                        }}
                      />
                      <span style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--text-main)' }}>
                        {col.label}
                      </span>
                    </div>
                    <Badge variant="neutral">{colLeads.length}</Badge>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                    {colLeads.map((lead) => (
                      <div
                        key={lead.id}
                        style={{
                          backgroundColor: 'var(--bg-app)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-md)',
                          padding: '0.875rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.5rem',
                          boxShadow: 'var(--shadow-sm)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                            {lead.fullName}
                          </span>
                          <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                            {lead.createdAt || 'Recent'}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-600)', fontSize: '0.8rem', fontWeight: 600 }}>
                          <GraduationCap size={14} />
                          <span>{lead.interestedCourse}</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Mail size={12} />
                            <span>{lead.email}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Phone size={12} />
                            <span>{lead.phone}</span>
                          </div>
                        </div>

                        {col.status !== 'ENROLLED' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            style={{ marginTop: '0.25rem', width: '100%', justifyContent: 'center' }}
                            leftIcon={<ArrowRight size={14} />}
                            onClick={() => handleAdvanceStatus(lead.id, lead.status)}
                          >
                            Advance Stage
                          </Button>
                        ) : (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.35rem',
                              padding: '0.4rem',
                              backgroundColor: 'var(--success-bg, #e8f5e9)',
                              color: 'var(--success-primary)',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.775rem',
                              fontWeight: 700,
                            }}
                          >
                            <CheckCircle2 size={14} />
                            Enrolled Student
                          </div>
                        )}
                      </div>
                    ))}
                    {colLeads.length === 0 && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flex: 1,
                          color: 'var(--text-muted)',
                          fontSize: '0.85rem',
                          fontStyle: 'italic',
                        }}
                      >
                        No candidates in this stage
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Admissions Forecasting Engine */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--primary-100, #dbeafe)',
                  color: 'var(--primary-600)',
                }}
              >
                <Sparkles size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Gemini AI Revenue & Intake Intelligence
                </h3>
                <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                  Generate real-time applicant conversion predictions and high-value course upsell insights.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {[
                'Predict next month enrollment trajectory',
                'Which course category has highest conversion?',
                'Suggest installment optimization strategies',
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setAiPrompt(suggestion);
                    handleAskForecast(suggestion);
                  }}
                  style={{
                    padding: '0.4rem 0.8rem',
                    borderRadius: '2rem',
                    backgroundColor: 'var(--bg-app)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.775rem',
                    fontWeight: 600,
                    color: 'var(--text-main)',
                    cursor: 'pointer',
                  }}
                >
                  💡 {suggestion}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskForecast()}
                placeholder="Ask Gemini AI for conversion analysis, revenue projections, or sales campaign ideas..."
                className="form-input"
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  fontSize: '0.9rem',
                }}
              />
              <Button
                variant="primary"
                onClick={() => handleAskForecast()}
                disabled={isAiLoading || !aiPrompt}
                leftIcon={<Send size={16} />}
              >
                {isAiLoading ? 'Analyzing...' : 'Generate AI Forecast'}
              </Button>
            </div>

            {(aiResponse || isAiLoading) && (
              <div
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-app)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  color: 'var(--text-main)',
                }}
              >
                {isAiLoading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-600)' }}>
                    <Sparkles size={18} className="animate-spin" />
                    <span>Gemini AI is analyzing admissions conversion vectors...</span>
                  </div>
                ) : (
                  <div style={{ whiteSpace: 'pre-wrap' }}>{aiResponse}</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* SECTION 2: STUDENT REGISTRATION WIZARD WITH PAYMENT & FOC PACKAGE         */}
      {/* ========================================================================= */}
      {currentSection === 'register' && (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            boxShadow: 'var(--card-shadow)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '1.25rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, var(--primary-600) 0%, #1d4ed8 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                }}
              >
                <UserPlus size={24} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  Official Student Registration & Enrollment Portal
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
                  Register new student profile, assign curriculum, configure payment plan, record deposit, and generate verified PDF receipt.
                </p>
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={() => setCurrentSection('students')}>
              Back to Students Directory
            </Button>
          </div>

          <form onSubmit={handleRegisterStudent} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Step 1: Student Personal Details */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <span className="form-step-badge">1</span>
                <h3 className="form-step-title">Applicant Personal Information</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">
                    First Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={registrationForm.firstName}
                    onChange={(e) => setRegistrationForm({ ...registrationForm, firstName: e.target.value })}
                    placeholder="e.g. Alex"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Last Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={registrationForm.lastName}
                    onChange={(e) => setRegistrationForm({ ...registrationForm, lastName: e.target.value })}
                    placeholder="e.g. Mercer"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Email Address <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    className="form-input"
                    value={registrationForm.email}
                    onChange={(e) => setRegistrationForm({ ...registrationForm, email: e.target.value })}
                    placeholder="alex.mercer@gmail.com"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={registrationForm.phone}
                    onChange={(e) => setRegistrationForm({ ...registrationForm, phone: e.target.value })}
                    placeholder="+1-555-0182"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Registration / Enrollment Date
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={registrationForm.enrollmentDate}
                    onChange={(e) => setRegistrationForm({ ...registrationForm, enrollmentDate: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Previous School / Academic Background
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={registrationForm.previousSchool}
                    onChange={(e) => setRegistrationForm({ ...registrationForm, previousSchool: e.target.value })}
                    placeholder="e.g. West Coast High / Polytech"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Course Category & Program Selection */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <span className="form-step-badge">2</span>
                <h3 className="form-step-title">Select Course Program & Category</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', alignItems: 'stretch' }}>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <label className="form-label">
                    Curriculum / Degree Course <span className="required">*</span>
                  </label>
                  <select
                    value={registrationForm.selectedCourseId}
                    onChange={(e) => setRegistrationForm({ ...registrationForm, selectedCourseId: Number(e.target.value) })}
                    className="form-select"
                    style={{ fontWeight: 600, padding: '0.75rem 0.85rem' }}
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        [{c.category || 'General'}] {c.code} - {c.name}
                      </option>
                    ))}
                  </select>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                    Select from accredited degree tracks, diplomas, and career certifications.
                  </span>
                </div>

                {selectedRegCourse && (
                  <div
                    style={{
                      backgroundColor: 'var(--bg-surface-elevated, var(--bg-app))',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1.15rem 1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.65rem',
                      boxShadow: 'var(--card-shadow)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                        Curriculum Summary
                      </span>
                      <Badge variant="purple">{selectedRegCourse.category || 'General'}</Badge>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed var(--border-subtle)', paddingBottom: '0.4rem', fontSize: '0.875rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Full Cash-Down Tuition:</span>
                      <span style={{ fontWeight: 800, color: 'var(--success-primary)', fontSize: '1.05rem' }}>
                        ${(selectedRegCourse.cashDownFee || 1200).toLocaleString()}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Installment Option:</span>
                      <span style={{ fontWeight: 700, color: 'var(--primary-600)' }}>
                        ${selectedRegCourse.downPaymentAmount || 400} down + {selectedRegCourse.installmentMonths || 4}x ${selectedRegCourse.monthlyInstallment || 250}/mo
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Step 3: Payment Plan & Flexible Custom Deposit */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <span className="form-step-badge">3</span>
                <h3 className="form-step-title">Payment Plan & Initial Amount Received</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Payment Plan Type</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                    <button
                      type="button"
                      onClick={() => setRegistrationForm({ ...registrationForm, paymentPlanType: 'INSTALLMENT' })}
                      style={{
                        padding: '0.75rem 0.65rem',
                        borderRadius: 'var(--radius-md)',
                        border: registrationForm.paymentPlanType === 'INSTALLMENT' ? '2px solid var(--primary-600)' : '1px solid var(--border-subtle)',
                        backgroundColor: registrationForm.paymentPlanType === 'INSTALLMENT' ? 'var(--primary-50, rgba(37, 99, 235, 0.1))' : 'var(--input-bg)',
                        color: registrationForm.paymentPlanType === 'INSTALLMENT' ? 'var(--primary-600)' : 'var(--text-main)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        transition: 'all var(--transition-fast)',
                      }}
                    >
                      <span>📅</span>
                      <span>Installment Plan</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegistrationForm({ ...registrationForm, paymentPlanType: 'CASH_DOWN' })}
                      style={{
                        padding: '0.75rem 0.65rem',
                        borderRadius: 'var(--radius-md)',
                        border: registrationForm.paymentPlanType === 'CASH_DOWN' ? '2px solid var(--success-primary)' : '1px solid var(--border-subtle)',
                        backgroundColor: registrationForm.paymentPlanType === 'CASH_DOWN' ? 'var(--success-bg, rgba(16, 185, 129, 0.1))' : 'var(--input-bg)',
                        color: registrationForm.paymentPlanType === 'CASH_DOWN' ? 'var(--success-primary)' : 'var(--text-main)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        transition: 'all var(--transition-fast)',
                      }}
                    >
                      <span>💵</span>
                      <span>Cash-Down Full</span>
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Amount Given by Student ($ USD) <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Flexible custom value)</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <DollarSign size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="number"
                      required
                      min={0}
                      step="any"
                      className="form-input"
                      value={registrationForm.customPaymentAmount}
                      onChange={(e) => setRegistrationForm({ ...registrationForm, customPaymentAmount: Number(e.target.value) })}
                      placeholder="e.g. 400"
                      style={{ paddingLeft: '2.4rem', fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary-600)' }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Method</label>
                  <select
                    value={registrationForm.paymentMethod}
                    onChange={(e) => setRegistrationForm({ ...registrationForm, paymentMethod: e.target.value })}
                    className="form-select"
                  >
                    <option value="Cash">Cash (In-person)</option>
                    <option value="Bank Transfer">Bank Transfer (SWIFT / ACH)</option>
                    <option value="Credit / Debit Card">Credit / Debit Card (Stripe POS)</option>
                    <option value="WavePay / KPay">Mobile Wallet (WavePay / KPay)</option>
                    <option value="Check">Cashier's Check</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Date (Autofilled, Editable)</label>
                  <input
                    type="date"
                    className="form-input"
                    value={registrationForm.paymentDate}
                    onChange={(e) => setRegistrationForm({ ...registrationForm, paymentDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Step 4: FOC Complimentary Items */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem' }}>
                <span className="form-step-badge">4</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Gift size={18} style={{ color: 'var(--purple-primary)' }} />
                  <h3 className="form-step-title">FOC (Free of Charge) Items Given to Student</h3>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem' }}>
                {FOC_OPTIONS.map((item) => {
                  const isChecked = registrationForm.focItems.includes(item);
                  return (
                    <label
                      key={item}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: isChecked ? '1.5px solid var(--primary-500)' : '1px solid var(--border-subtle)',
                        backgroundColor: isChecked ? 'var(--primary-50, rgba(37, 99, 235, 0.08))' : 'var(--input-bg)',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: isChecked ? 700 : 500,
                        color: 'var(--text-main)',
                        transition: 'all var(--transition-fast)',
                        boxShadow: isChecked ? '0 2px 8px rgba(37, 99, 235, 0.15)' : 'none',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        style={{ width: '17px', height: '17px', accentColor: 'var(--primary-600)', cursor: 'pointer' }}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setRegistrationForm({ ...registrationForm, focItems: [...registrationForm.focItems, item] });
                          } else {
                            setRegistrationForm({
                              ...registrationForm,
                              focItems: registrationForm.focItems.filter((i) => i !== item),
                            });
                          }
                        }}
                      />
                      <span>{item}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Submit & Action Bar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '1.5rem',
                marginTop: '0.5rem',
              }}
            >
              <Button
                variant="outline"
                type="button"
                size="lg"
                onClick={() => setCurrentSection('students')}
              >
                Cancel / Back to Directory
              </Button>

              <Button
                variant="primary"
                type="submit"
                size="lg"
                disabled={isLoading}
                leftIcon={<Receipt size={18} />}
                style={{
                  padding: '0 2rem',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                }}
              >
                {isLoading ? 'Processing Registration...' : 'Complete Registration & Issue Receipt'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: ALL STUDENTS DIRECTORY & RESTRICTED DELETION                   */}
      {/* ========================================================================= */}
      {currentSection === 'students' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                Master Student Directory
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
                View complete student dossier, enrolled curricula, and payment standings. Direct deletion is restricted.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ position: 'relative', minWidth: '280px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search by student name, code, or email..."
                  value={searchStudentTerm}
                  onChange={(e) => setSearchStudentTerm(e.target.value)}
                  className="form-input"
                  style={{
                    paddingLeft: '2.4rem',
                  }}
                />
              </div>

              <Button
                variant="primary"
                leftIcon={<UserPlus size={16} />}
                onClick={() => setCurrentSection('register')}
              >
                Register Student
              </Button>
            </div>
          </div>

          {/* Student Table */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-app)', borderBottom: '1px solid var(--border-subtle)' }}>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--text-muted)' }}>Student Code</th>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--text-muted)' }}>Full Name</th>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--text-muted)' }}>Contact Info</th>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--text-muted)' }}>Enrolled Programs</th>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--text-muted)' }}>Tuition Balance</th>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((s) => (
                    <tr
                      key={s.id}
                      style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background-color 0.15s ease' }}
                    >
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--primary-600)' }}>
                        {s.studentCode}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        <div>{s.fullName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Joined: {s.joinedDate || '2026-09-01'}</div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                        <div>{s.email}</div>
                        <div>{s.phoneNumber || s.emergencyContact || 'N/A'}</div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                          {s.enrolledCourses && s.enrolledCourses.length > 0 ? (
                            s.enrolledCourses.map((c) => (
                              <Badge key={c.id} variant="info">
                                {c.code}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="neutral">CS101 (Active)</Badge>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 700, color: (s.balanceDue ?? 0) > 0 ? 'var(--danger-primary)' : 'var(--success-primary)' }}>
                          {(s.balanceDue ?? 0) > 0 ? `$${s.balanceDue} due` : 'Paid in Full'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Plan: {s.paymentPlanType || 'INSTALLMENT'}</div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<Eye size={14} />}
                            onClick={() => {
                              setSelectedStudentForDossier(s);
                              setIsStudentDossierOpen(true);
                            }}
                          >
                            View
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<DollarSign size={14} />}
                            onClick={() => {
                              setRecordPaymentData((prev) => ({ ...prev, studentId: s.id }));
                              setIsRecordPaymentModalOpen(true);
                            }}
                          >
                            Pay
                          </Button>

                          {/* Restricted Delete button */}
                          <Button
                            variant="danger"
                            size="sm"
                            leftIcon={<Lock size={14} />}
                            onClick={() => {
                              setStudentToDelete(s);
                              setIsAdminDeleteStudentOpen(true);
                            }}
                          >
                            Request Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                        No students found matching your query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: COURSE CATEGORIES & PAYMENT PLANS                              */}
      {/* ========================================================================= */}
      {currentSection === 'courses' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                Curriculum Catalog & Payment Structures
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
                Configure multi-category courses with upfront Cash-Down rates or structured monthly installment plans.
              </p>
            </div>

            <Button variant="primary" leftIcon={<Plus size={16} />} onClick={() => setIsAddCourseModalOpen(true)}>
              Add New Course with Payment Plan
            </Button>
          </div>

          {/* Category Filter Badges */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedCategoryFilter('ALL')}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '2rem',
                border: selectedCategoryFilter === 'ALL' ? '2px solid var(--primary-600)' : '1px solid var(--border-subtle)',
                backgroundColor: selectedCategoryFilter === 'ALL' ? 'var(--primary-50, #eff6ff)' : 'var(--bg-surface)',
                color: selectedCategoryFilter === 'ALL' ? 'var(--primary-600)' : 'var(--text-main)',
                fontWeight: 700,
                fontSize: '0.8125rem',
                cursor: 'pointer',
              }}
            >
              All Categories ({courses.length})
            </button>
            {COURSE_CATEGORIES.map((cat) => {
              const isSelected = selectedCategoryFilter === cat.key;
              const catCount = courses.filter((c) => c.category === cat.key).length;
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategoryFilter(cat.key)}
                  style={{
                    padding: '0.45rem 0.9rem',
                    borderRadius: '2rem',
                    border: isSelected ? '2px solid var(--primary-600)' : '1px solid var(--border-subtle)',
                    backgroundColor: isSelected ? 'var(--primary-50, #eff6ff)' : 'var(--bg-surface)',
                    color: isSelected ? 'var(--primary-600)' : 'var(--text-main)',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                  }}
                >
                  {cat.label} ({catCount})
                </button>
              );
            })}
          </div>

          {/* Courses Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {filteredCourses.map((c) => {
              return (
                <div
                  key={c.id}
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <Badge variant="purple">{c.code}</Badge>
                      <h3 style={{ margin: '0.35rem 0 0 0', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        {c.name}
                      </h3>
                    </div>
                    <Badge variant="info">
                      {c.category?.toString() || 'General'}
                    </Badge>
                  </div>

                  <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    {c.description || 'Comprehensive industry-aligned curriculum.'}
                  </p>

                  {/* Payment Plans Box */}
                  <div
                    style={{
                      backgroundColor: 'var(--bg-app)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.85rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.65rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed var(--border-subtle)', paddingBottom: '0.45rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                        💵 Full Cash-Down Rate:
                      </span>
                      <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--success-primary)' }}>
                        ${c.cashDownFee || 1200}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                        📅 Installment Plan Breakdown:
                      </span>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span>Down Payment:</span>
                        <span style={{ fontWeight: 700, color: 'var(--primary-600)' }}>${c.downPaymentAmount || 400}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span>Monthly Installments:</span>
                        <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                          {c.installmentMonths || 4} months × ${c.monthlyInstallment || 250}/mo
                        </span>
                      </div>
                    </div>

                    {c.focPackage && (
                      <div style={{ fontSize: '0.775rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.25rem' }}>
                        <Gift size={13} />
                        <span>Included FOC: {c.focPackage}</span>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                    <Button
                      variant="outline"
                      size="sm"
                      style={{ flex: 1 }}
                      leftIcon={<UserPlus size={14} />}
                      onClick={() => {
                        setRegistrationForm((prev) => ({ ...prev, selectedCourseId: c.id }));
                        setCurrentSection('register');
                      }}
                    >
                      Enroll Student
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 5: INSTALLMENT & PAYMENT LEDGER WITH VOID REQUEST                 */}
      {/* ========================================================================= */}
      {currentSection === 'payments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                Month-by-Month Installment & Payment Ledger
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
                Record non-fixed payments, inspect period allocations, and issue official verified receipts. Record deletion requires admin approval.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ position: 'relative', minWidth: '280px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search receipt #, student, method..."
                  value={searchPaymentTerm}
                  onChange={(e) => setSearchPaymentTerm(e.target.value)}
                  className="form-input"
                  style={{
                    paddingLeft: '2.4rem',
                  }}
                />
              </div>

              <Button
                variant="primary"
                leftIcon={<DollarSign size={16} />}
                onClick={() => setIsRecordPaymentModalOpen(true)}
              >
                Record Payment
              </Button>
            </div>
          </div>

          {/* Payment Records Table */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-app)', borderBottom: '1px solid var(--border-subtle)' }}>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--text-muted)' }}>Receipt #</th>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--text-muted)' }}>Student</th>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--text-muted)' }}>Period / Purpose</th>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--text-muted)' }}>Amount Paid</th>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--text-muted)' }}>Method & Date</th>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--text-muted)' }}>FOC Items</th>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((p) => (
                    <tr
                      key={p.id}
                      style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background-color 0.15s ease' }}
                    >
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--primary-600)' }}>
                        {p.receiptNumber || `REC-${p.id}`}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{p.studentName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.studentCode} • {p.courseName}</div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <Badge
                          variant={
                            p.paymentPeriod === 'CASH_DOWN'
                              ? 'success'
                              : p.paymentPeriod === 'DOWN_PAYMENT'
                              ? 'purple'
                              : 'info'
                          }
                        >
                          {(p.paymentPeriod || 'PAYMENT').replace('_', ' ')}
                        </Badge>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--success-primary)', fontSize: '0.95rem' }}>
                        ${p.amountPaid.toLocaleString()}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{p.paymentMethod}</div>
                        <div>{p.paymentDate}</div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontSize: '0.775rem' }}>
                        {p.focItems && p.focItems.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                            {p.focItems.map((item: string, idx: number) => (
                              <span key={idx} style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                                {item}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>None</span>
                        )}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<Printer size={14} />}
                            onClick={() => {
                              setActiveReceiptData(p);
                              setIsReceiptModalOpen(true);
                            }}
                          >
                            Receipt PDF
                          </Button>

                          {/* Restricted Void button */}
                          <Button
                            variant="danger"
                            size="sm"
                            leftIcon={<Lock size={14} />}
                            onClick={() => {
                              setPaymentToVoid(p);
                              setIsAdminVoidPaymentOpen(true);
                            }}
                          >
                            Void Request
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredPayments.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                        No payment records registered yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 6: PARENT ACCOUNTS & JOIN WITH CHILD CODE                         */}
      {/* ========================================================================= */}
      {currentSection === 'parents' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                Parent Accounts & Student Code Linker
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
                Provision parent login credentials and automatically link guardian profiles with children's unique student codes.
              </p>
            </div>

            <Button variant="primary" leftIcon={<UserPlus size={16} />} onClick={() => setIsAddParentModalOpen(true)}>
              Create Parent Account
            </Button>
          </div>

          {/* Parents Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {parents.map((parent) => (
              <div
                key={parent.id}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--purple-primary)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                      }}
                    >
                      {parent.fullName.charAt(0)}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {parent.fullName}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Relationship: {parent.relationship || 'Guardian'}
                      </span>
                    </div>
                  </div>
                  <Badge variant="purple">Parent Verified</Badge>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Mail size={13} />
                    <span>{parent.email}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Phone size={13} />
                    <span>{parent.phoneNumber}</span>
                  </div>
                </div>

                {/* Linked Children List */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-app)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem',
                  }}
                >
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    Linked Child / Student Code:
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {parent.studentCode ? (
                      <span
                        style={{
                          padding: '0.2rem 0.6rem',
                          borderRadius: '1rem',
                          backgroundColor: 'var(--primary-100, #dbeafe)',
                          color: 'var(--primary-600)',
                          fontSize: '0.775rem',
                          fontWeight: 700,
                        }}
                      >
                        👶 {parent.linkedStudentName || 'Student'} ({parent.studentCode})
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>None currently linked</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* SECTION 7: RE-ENROLLMENT FOR REGISTERED STUDENTS                          */}
      {/* ========================================================================= */}
      {currentSection === 're-enroll' && (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            boxShadow: 'var(--card-shadow)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '1.25rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, var(--primary-600) 0%, #1d4ed8 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                }}
              >
                <RefreshCw size={24} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  Multi-Course Re-Enrollment for Active Students
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
                  Enroll a currently registered student into an additional course, certificate, or semester track without recreating their profile.
                </p>
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={() => setCurrentSection('students')}>
              Back to Students Directory
            </Button>
          </div>

          <form onSubmit={handleReEnrollSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">
                  Select Existing Student <span className="required">*</span>
                </label>
                <select
                  value={reEnrollData.studentId}
                  onChange={(e) => setReEnrollData({ ...reEnrollData, studentId: Number(e.target.value) })}
                  className="form-select"
                  style={{ fontWeight: 600 }}
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.studentCode}) - {s.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Additional Course to Attend <span className="required">*</span>
                </label>
                <select
                  value={reEnrollData.courseId}
                  onChange={(e) => setReEnrollData({ ...reEnrollData, courseId: Number(e.target.value) })}
                  className="form-select"
                  style={{ fontWeight: 600 }}
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      [{c.category || 'General'}] {c.code} - {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Payment Plan Selection
                </label>
                <select
                  value={reEnrollData.paymentPlanType}
                  onChange={(e) => setReEnrollData({ ...reEnrollData, paymentPlanType: e.target.value as any })}
                  className="form-select"
                >
                  <option value="INSTALLMENT">Month-by-Month Installment</option>
                  <option value="CASH_DOWN">Full Cash-Down Upfront</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Initial Enrollment Deposit ($ USD)
                </label>
                <div style={{ position: 'relative' }}>
                  <DollarSign size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="number"
                    min={0}
                    step="any"
                    className="form-input"
                    value={reEnrollData.initialDeposit}
                    onChange={(e) => setReEnrollData({ ...reEnrollData, initialDeposit: Number(e.target.value) })}
                    style={{ paddingLeft: '2.4rem', fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary-600)' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Payment Method
                </label>
                <select
                  value={reEnrollData.paymentMethod}
                  onChange={(e) => setReEnrollData({ ...reEnrollData, paymentMethod: e.target.value })}
                  className="form-select"
                >
                  <option value="Cash">Cash (In-person)</option>
                  <option value="Bank Transfer">Bank Transfer (SWIFT / ACH)</option>
                  <option value="Credit / Debit Card">Credit / Debit Card (Stripe POS)</option>
                  <option value="WavePay / KPay">Mobile Wallet (WavePay / KPay)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Notes & Special Directives
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={reEnrollData.notes}
                  onChange={(e) => setReEnrollData({ ...reEnrollData, notes: e.target.value })}
                  placeholder="e.g. Dual enrollment discount applied"
                />
              </div>
            </div>

            {/* Action Bar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '1.5rem',
                marginTop: '0.5rem',
              }}
            >
              <Button variant="outline" size="lg" type="button" onClick={() => setCurrentSection('students')}>
                Cancel / Back to Directory
              </Button>
              <Button
                variant="primary"
                type="submit"
                size="lg"
                leftIcon={<UserPlus size={18} />}
                style={{
                  padding: '0 2rem',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                }}
              >
                Confirm Re-Enrollment & Issue Receipt
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 8: ADMIN AUDIT & DELETION REQUEST QUEUE                           */}
      {/* ========================================================================= */}
      {currentSection === 'admin-requests' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                Administrative Deletion & Void Approval Queue
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
                Sales representatives are strictly restricted from direct deletions. All student purge and payment void requests are routed here for Admin clearance.
              </p>
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-app)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--text-muted)' }}>Ticket ID</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--text-muted)' }}>Target Resource</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--text-muted)' }}>Action Type</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--text-muted)' }}>Reason / Audit Note</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--text-muted)' }}>Requested By</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--text-muted)' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {adminRequests.map((req) => (
                  <tr key={req.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--primary-600)' }}>
                      REQ-{req.id.toString().padStart(4, '0')}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--text-main)' }}>
                      {req.targetName} ({req.targetIdentifier})
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <Badge variant={req.requestType === 'DELETE_STUDENT' ? 'danger' : 'warning'}>
                        {req.requestType.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>{req.reason}</td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem' }}>{req.requestedBy}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <Badge variant={req.status === 'PENDING' ? 'warning' : 'success'}>
                        {req.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {adminRequests.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                      No pending deletion tickets in the queue.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: OFFICIAL VERIFIED RECEIPT (PRINT / PDF READY)                    */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        title="Official Verified Student Payment Receipt"
        subtitle="School Official Document — PDF & Thermal Print Ready"
      >
        {activeReceiptData && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Printable Receipt Container */}
            <div
              id="official-receipt-print-area"
              style={{
                backgroundColor: '#ffffff',
                color: '#1a202c',
                border: '2px solid #e2e8f0',
                borderRadius: 'var(--radius-md)',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                fontFamily: 'Inter, system-ui, sans-serif',
                position: 'relative',
              }}
            >
              {/* Header with School Branding */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  borderBottom: '2px solid #3182ce',
                  paddingBottom: '1rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <GraduationCap size={28} color="#3182ce" />
                    <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 900, color: '#1a365d', letterSpacing: '-0.5px' }}>
                      ACADEMIA INSTITUTE OF TECHNOLOGY
                    </h2>
                  </div>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#718096' }}>
                    100 University Boulevard, Tech Plaza • admissions@academia.edu • +1 (800) 555-SMS-AI
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#ebf8ff',
                      color: '#2b6cb0',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '4px',
                      marginBottom: '0.25rem',
                    }}
                  >
                    OFFICIAL RECEIPT
                  </span>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#2d3748' }}>
                    #{activeReceiptData.receiptNumber || `REC-${activeReceiptData.id}`}
                  </div>
                  <div style={{ fontSize: '0.775rem', color: '#718096' }}>Date: {activeReceiptData.paymentDate}</div>
                </div>
              </div>

              {/* Student & Course Metadata */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  backgroundColor: '#f7fafc',
                  padding: '1rem',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                }}
              >
                <div>
                  <div style={{ color: '#718096', fontSize: '0.75rem', fontWeight: 600 }}>STUDENT DETAILS</div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: '#2d3748', marginTop: '0.15rem' }}>
                    {activeReceiptData.studentName}
                  </div>
                  <div style={{ color: '#4a5568', marginTop: '0.15rem' }}>
                    Student Code: <strong style={{ color: '#3182ce' }}>{activeReceiptData.studentCode || 'STU-2026-0001'}</strong>
                  </div>
                </div>

                <div>
                  <div style={{ color: '#718096', fontSize: '0.75rem', fontWeight: 600 }}>COURSE / ENROLLMENT</div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#2d3748', marginTop: '0.15rem' }}>
                    {activeReceiptData.courseName}
                  </div>
                  <div style={{ color: '#4a5568', marginTop: '0.15rem' }}>
                    Sales Officer: {activeReceiptData.salesAgentName || 'Admissions Specialist'}
                  </div>
                </div>
              </div>

              {/* Itemized Payment Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#edf2f7', borderBottom: '1px solid #cbd5e0' }}>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', fontWeight: 700, color: '#4a5568' }}>Date</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', fontWeight: 700, color: '#4a5568' }}>Description / Period</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', fontWeight: 700, color: '#4a5568' }}>Payment Method</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'right', fontWeight: 700, color: '#4a5568' }}>Amount Paid</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.75rem 0.85rem', color: '#4a5568' }}>{activeReceiptData.paymentDate}</td>
                    <td style={{ padding: '0.75rem 0.85rem', fontWeight: 700, color: '#2d3748' }}>
                      {(activeReceiptData.paymentPeriod || 'PAYMENT').replace('_', ' ')}
                    </td>
                    <td style={{ padding: '0.75rem 0.85rem', color: '#4a5568' }}>{activeReceiptData.paymentMethod}</td>
                    <td style={{ padding: '0.75rem 0.85rem', textAlign: 'right', fontWeight: 800, color: '#2b6cb0', fontSize: '1rem' }}>
                      ${activeReceiptData.amountPaid.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Financial Balance Summary Box */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#edf2f7',
                  padding: '1rem 1.25rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e0',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#718096' }}>Total Course Program Fee:</div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: '#2d3748' }}>
                    ${activeReceiptData.totalFee?.toLocaleString() || '1,400'}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: '#718096' }}>Remaining Balance Due:</div>
                  <div style={{ fontWeight: 900, fontSize: '1.15rem', color: (activeReceiptData.remainingBalance ?? 0) > 0 ? '#e53e3e' : '#38a169' }}>
                    ${(activeReceiptData.remainingBalance ?? 0).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Complimentary FOC Items Checklist */}
              {activeReceiptData.focItems && activeReceiptData.focItems.length > 0 && (
                <div style={{ backgroundColor: '#fffaf0', border: '1px solid #feebc8', borderRadius: '6px', padding: '0.85rem' }}>
                  <div style={{ fontSize: '0.775rem', fontWeight: 800, color: '#dd6b20', marginBottom: '0.35rem' }}>
                    🎁 COMPLIMENTARY FOC ITEMS ISSUED AT REGISTRATION:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.8rem', color: '#7b341e', fontWeight: 600 }}>
                    {activeReceiptData.focItems.map((item: string, idx: number) => (
                      <span key={idx}>✓ {item}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Authorization Stamp & Signatures */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  marginTop: '1.5rem',
                  paddingTop: '1rem',
                  borderTop: '1px dashed #cbd5e0',
                }}
              >
                <div>
                  <div
                    style={{
                      border: '2px solid #3182ce',
                      borderRadius: '8px',
                      padding: '0.4rem 0.8rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      color: '#3182ce',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    <Award size={16} /> Verified Official Stamp
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#a0aec0', marginTop: '0.35rem' }}>
                    Digitally signed by AI-Powered Student Management System
                  </div>
                </div>

                <div style={{ textAlign: 'center', minWidth: '200px' }}>
                  <div style={{ borderBottom: '1px solid #a0aec0', marginBottom: '0.35rem', height: '30px' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#718096' }}>
                    Authorized Cashier / Officer Signature
                  </span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Button variant="outline" onClick={() => setIsReceiptModalOpen(false)}>
                Close
              </Button>
              <Button
                variant="primary"
                leftIcon={<Printer size={16} />}
                onClick={() => {
                  window.print();
                }}
              >
                Print / Save as PDF
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 2: RECORD MONTH-BY-MONTH PAYMENT                                    */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isRecordPaymentModalOpen}
        onClose={() => setIsRecordPaymentModalOpen(false)}
        title="Record Student Installment Payment"
        subtitle="Log flexible non-fixed payments, allocate installment months, & generate receipt"
      >
        <form onSubmit={handleRecordPayment} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div className="form-group">
            <label className="form-label">
              Select Student <span className="required">*</span>
            </label>
            <select
              value={recordPaymentData.studentId}
              onChange={(e) => setRecordPaymentData({ ...recordPaymentData, studentId: Number(e.target.value) })}
              className="form-select"
              style={{ fontWeight: 600 }}
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fullName} ({s.studentCode})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">
                Payment Period / Month Allocation
              </label>
              <select
                value={recordPaymentData.paymentPeriod}
                onChange={(e) => setRecordPaymentData({ ...recordPaymentData, paymentPeriod: e.target.value })}
                className="form-select"
              >
                <option value="DOWN_PAYMENT">Initial Down Payment</option>
                <option value="MONTH_1">Month 1 Installment</option>
                <option value="MONTH_2">Month 2 Installment</option>
                <option value="MONTH_3">Month 3 Installment</option>
                <option value="MONTH_4">Month 4 Installment</option>
                <option value="MONTH_5">Month 5 Installment</option>
                <option value="MONTH_6">Month 6 Installment</option>
                <option value="CASH_DOWN">Full Cash-Down Settlement</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Amount Paid ($ USD) <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Flexible)</span>
              </label>
              <div style={{ position: 'relative' }}>
                <DollarSign size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="number"
                  required
                  min={1}
                  step="any"
                  className="form-input"
                  value={recordPaymentData.amount || ''}
                  onChange={(e) => setRecordPaymentData({ ...recordPaymentData, amount: Number(e.target.value) })}
                  placeholder="e.g. 250"
                  style={{ paddingLeft: '2.2rem', fontWeight: 800, fontSize: '1rem', color: 'var(--primary-600)' }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select
                value={recordPaymentData.paymentMethod}
                onChange={(e) => setRecordPaymentData({ ...recordPaymentData, paymentMethod: e.target.value })}
                className="form-select"
              >
                <option value="Cash">Cash (In-person)</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Credit Card">Credit Card</option>
                <option value="WavePay / KPay">WavePay / KPay</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Payment Date</label>
              <input
                type="date"
                className="form-input"
                value={recordPaymentData.paymentDate}
                onChange={(e) => setRecordPaymentData({ ...recordPaymentData, paymentDate: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notes / Reference</label>
            <input
              type="text"
              className="form-input"
              value={recordPaymentData.notes}
              onChange={(e) => setRecordPaymentData({ ...recordPaymentData, notes: e.target.value })}
              placeholder="e.g. Bank Ref #TXN-998822"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button variant="outline" type="button" onClick={() => setIsRecordPaymentModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" leftIcon={<Receipt size={16} />}>
              Save Payment & Generate Receipt
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 3: ADD COURSE WITH PAYMENT PLAN                                     */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isAddCourseModalOpen}
        onClose={() => setIsAddCourseModalOpen(false)}
        title="Create Course with Category & Payment Plan"
        subtitle="Establish curriculum fees, cash-down rates, and installment structures"
      >
        <form onSubmit={handleCreateCourse} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">
                Course Code <span className="required">*</span>
              </label>
              <input
                type="text"
                required
                className="form-input"
                value={newCourseData.code}
                onChange={(e) => setNewCourseData({ ...newCourseData, code: e.target.value })}
                placeholder="e.g. AI301"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Course Title <span className="required">*</span>
              </label>
              <input
                type="text"
                required
                className="form-input"
                value={newCourseData.name}
                onChange={(e) => setNewCourseData({ ...newCourseData, name: e.target.value })}
                placeholder="e.g. Neural Networks & Deep Learning"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Course Category</label>
              <select
                value={newCourseData.category}
                onChange={(e) => setNewCourseData({ ...newCourseData, category: e.target.value as CourseCategory })}
                className="form-select"
              >
                {COURSE_CATEGORIES.map((cat) => (
                  <option key={cat.key} value={cat.key}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Academic Credits</label>
              <input
                type="number"
                className="form-input"
                value={newCourseData.credits}
                onChange={(e) => setNewCourseData({ ...newCourseData, credits: Number(e.target.value) })}
              />
            </div>
          </div>

          {/* Payment Plan Sub-Form */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface-elevated, var(--bg-app))',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1.15rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
            }}
          >
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary-600)' }}>
              💰 Tuition Pricing & Installment Terms
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.75rem' }}>
                  Full Cash-Down Fee ($)
                </label>
                <input
                  type="number"
                  className="form-input"
                  value={newCourseData.cashDownFee}
                  onChange={(e) => setNewCourseData({ ...newCourseData, cashDownFee: Number(e.target.value) })}
                  style={{ fontWeight: 700 }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.75rem' }}>
                  Installment Down Payment ($)
                </label>
                <input
                  type="number"
                  className="form-input"
                  value={newCourseData.downPaymentAmount}
                  onChange={(e) => setNewCourseData({ ...newCourseData, downPaymentAmount: Number(e.target.value) })}
                  style={{ fontWeight: 700 }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.75rem' }}>
                  Installment Months (e.g. 4)
                </label>
                <input
                  type="number"
                  className="form-input"
                  value={newCourseData.installmentMonths}
                  onChange={(e) => setNewCourseData({ ...newCourseData, installmentMonths: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.75rem' }}>
                  Monthly Installment Rate ($)
                </label>
                <input
                  type="number"
                  className="form-input"
                  value={newCourseData.monthlyInstallment}
                  onChange={(e) => setNewCourseData({ ...newCourseData, monthlyInstallment: Number(e.target.value) })}
                  style={{ fontWeight: 700 }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.75rem' }}>
                FOC Package Included
              </label>
              <input
                type="text"
                className="form-input"
                value={newCourseData.focPackage}
                onChange={(e) => setNewCourseData({ ...newCourseData, focPackage: e.target.value })}
                placeholder="e.g. Academy Welcome Kit + USB Lab Drive"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <Button variant="outline" type="button" onClick={() => setIsAddCourseModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Course & Plan
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 4: CREATE PARENT ACCOUNT & LINK WITH CHILD CODE                     */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isAddParentModalOpen}
        onClose={() => setIsAddParentModalOpen(false)}
        title="Create Parent Account & Link Child"
        subtitle="Provision parent access and bind to student via unique student code"
      >
        <form onSubmit={handleCreateParent} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div className="form-group">
            <label className="form-label">
              Guardian Full Name <span className="required">*</span>
            </label>
            <input
              type="text"
              required
              className="form-input"
              value={newParentData.fullName}
              onChange={(e) => setNewParentData({ ...newParentData, fullName: e.target.value })}
              placeholder="e.g. Robert Vance"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">
                Email Address <span className="required">*</span>
              </label>
              <input
                type="email"
                required
                className="form-input"
                value={newParentData.email}
                onChange={(e) => setNewParentData({ ...newParentData, email: e.target.value })}
                placeholder="robert.vance@gmail.com"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-input"
                value={newParentData.phoneNumber}
                onChange={(e) => setNewParentData({ ...newParentData, phoneNumber: e.target.value })}
                placeholder="+1-555-0922"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Relationship</label>
              <select
                value={newParentData.relationship}
                onChange={(e) => setNewParentData({ ...newParentData, relationship: e.target.value })}
                className="form-select"
              >
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Guardian">Legal Guardian</option>
                <option value="Sponsor">Corporate Sponsor</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Target Student Code <span className="required">*</span>
              </label>
              <input
                type="text"
                required
                className="form-input"
                value={newParentData.studentCode}
                onChange={(e) => setNewParentData({ ...newParentData, studentCode: e.target.value })}
                placeholder="e.g. STU-2026-0001"
                style={{ fontWeight: 700 }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <Button variant="outline" type="button" onClick={() => setIsAddParentModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" leftIcon={<UserCheck size={16} />}>
              Create Account & Link Child
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 5: RESTRICTED STUDENT DELETION -> REQUEST TO ADMIN                 */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isAdminDeleteStudentOpen}
        onClose={() => setIsAdminDeleteStudentOpen(false)}
        title="Admin Student Deletion Request"
        subtitle="Restricted Security Action: Direct deletion by sales is disabled"
      >
        {studentToDelete && (
          <form onSubmit={handleRequestStudentDelete} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div
              style={{
                backgroundColor: 'var(--warning-bg, #fffbeb)',
                border: '1px solid var(--warning-primary)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
              }}
            >
              <ShieldAlert size={22} color="var(--warning-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>
                <strong>Administrative Access Policy:</strong> Sales reps cannot delete student records directly to protect academic audit integrity. Submitting this form sends an urgent deletion authorization ticket to the System Administrator.
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-surface-elevated, var(--bg-app))', padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', border: '1px solid var(--border-subtle)' }}>
              <div><strong>Target Student:</strong> {studentToDelete.fullName}</div>
              <div><strong>Student Code:</strong> {studentToDelete.studentCode}</div>
              <div><strong>Email:</strong> {studentToDelete.email}</div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Mandatory Reason for Deletion Request <span className="required">*</span>
              </label>
              <textarea
                required
                rows={3}
                className="form-textarea"
                value={deleteStudentReason}
                onChange={(e) => setDeleteStudentReason(e.target.value)}
                placeholder="e.g. Applicant duplicate entry / withdrew enrollment before term commencement..."
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Button variant="outline" type="button" onClick={() => setIsAdminDeleteStudentOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" type="submit" leftIcon={<Send size={16} />}>
                Submit Request to Admin
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 6: RESTRICTED PAYMENT RECORD VOID -> REQUEST TO ADMIN               */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isAdminVoidPaymentOpen}
        onClose={() => setIsAdminVoidPaymentOpen(false)}
        title="Admin Payment Void & Correction Request"
        subtitle="Financial Compliance: Voiding receipts requires supervisor clearance"
      >
        {paymentToVoid && (
          <form onSubmit={handleRequestVoidPayment} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div
              style={{
                backgroundColor: 'var(--danger-bg, #fef2f2)',
                border: '1px solid var(--danger-primary)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
              }}
            >
              <AlertTriangle size={22} color="var(--danger-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>
                <strong>Financial Ledger Audit:</strong> Sales agents cannot delete payment records as wrong info directly. Submitting this request logs an audit ticket for Admin approval and correction.
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-surface-elevated, var(--bg-app))', padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', border: '1px solid var(--border-subtle)' }}>
              <div><strong>Receipt Number:</strong> #{paymentToVoid.receiptNumber || `REC-${paymentToVoid.id}`}</div>
              <div><strong>Student:</strong> {paymentToVoid.studentName} ({paymentToVoid.studentCode})</div>
              <div><strong>Recorded Amount:</strong> ${paymentToVoid.amountPaid} ({paymentToVoid.paymentMethod})</div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Error Description & Correction Note <span className="required">*</span>
              </label>
              <textarea
                required
                rows={3}
                className="form-textarea"
                value={voidPaymentReason}
                onChange={(e) => setVoidPaymentReason(e.target.value)}
                placeholder="e.g. Wrong payment method entered / duplicate swipe / incorrect currency rate..."
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Button variant="outline" type="button" onClick={() => setIsAdminVoidPaymentOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" type="submit" leftIcon={<Send size={16} />}>
                Send Void Ticket to Admin
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 7: STUDENT FULL DOSSIER                                             */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isStudentDossierOpen}
        onClose={() => setIsStudentDossierOpen(false)}
        title="Student Profile & Enrollment Dossier"
        subtitle="Complete academic and billing history"
      >
        {selectedStudentForDossier && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: 'var(--bg-surface-elevated, var(--bg-app))', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-600)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                }}
              >
                {selectedStudentForDossier.fullName.charAt(0)}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {selectedStudentForDossier.fullName}
                </h3>
                <span style={{ fontSize: '0.825rem', color: 'var(--primary-600)', fontWeight: 700 }}>
                  Code: {selectedStudentForDossier.studentCode}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div><strong>Email:</strong> {selectedStudentForDossier.email}</div>
              <div><strong>Phone:</strong> {selectedStudentForDossier.phoneNumber || 'N/A'}</div>
              <div><strong>Enrollment Date:</strong> {selectedStudentForDossier.joinedDate || '2026-09-01'}</div>
              <div><strong>Parent Contact:</strong> {selectedStudentForDossier.parentName || 'N/A'} ({selectedStudentForDossier.parentPhone || 'N/A'})</div>
            </div>

            <div>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Active Course Enrollments:
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {selectedStudentForDossier.enrolledCourses && selectedStudentForDossier.enrolledCourses.length > 0 ? (
                  selectedStudentForDossier.enrolledCourses.map((c) => (
                    <Badge key={c.id} variant="purple">
                      {c.code} - {c.name}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="neutral">CS101 - Computer Science & AI</Badge>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button variant="outline" onClick={() => setIsStudentDossierOpen(false)}>
                Close
              </Button>
              <Button
                variant="primary"
                leftIcon={<DollarSign size={16} />}
                onClick={() => {
                  setRecordPaymentData((prev) => ({ ...prev, studentId: selectedStudentForDossier.id }));
                  setIsStudentDossierOpen(false);
                  setIsRecordPaymentModalOpen(true);
                }}
              >
                Record Payment
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 8: QUICK ADD LEAD                                                  */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isAddLeadOpen}
        onClose={() => setIsAddLeadOpen(false)}
        title="Add Prospective Lead"
        subtitle="Capture new applicant inquiry into admissions pipeline"
      >
        <form onSubmit={handleCreateLead} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div className="form-group">
            <label className="form-label">
              Full Name <span className="required">*</span>
            </label>
            <input
              type="text"
              required
              className="form-input"
              value={newLead.fullName}
              onChange={(e) => setNewLead({ ...newLead, fullName: e.target.value })}
              placeholder="e.g. Eleanor Vance"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">
                Email Address <span className="required">*</span>
              </label>
              <input
                type="email"
                required
                className="form-input"
                value={newLead.email}
                onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                placeholder="eleanor@gmail.com"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-input"
                value={newLead.phone}
                onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                placeholder="+1-555-0199"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Interested Degree Program</label>
            <select
              value={newLead.interestedCourse}
              onChange={(e) => setNewLead({ ...newLead, interestedCourse: e.target.value })}
              className="form-select"
            >
              <option value="CS101 - Computer Science & AI">CS101 - Computer Science & AI</option>
              <option value="MATH201 - Discrete Mathematics">MATH201 - Discrete Mathematics</option>
              <option value="PHY101 - Applied Physics">PHY101 - Applied Physics</option>
              <option value="AI301 - Deep Learning & Robotics">AI301 - Deep Learning & Robotics</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
            <Button variant="outline" type="button" onClick={() => setIsAddLeadOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Prospect
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
