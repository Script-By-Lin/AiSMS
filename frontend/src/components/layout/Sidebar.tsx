import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarCheck,
  Award,
  CreditCard,
  KanbanSquare,
  ShieldAlert,
  Calendar,
  Sparkles,
  LifeBuoy,
  FileCheck2,
  UserPlus,
  Receipt,
  UserCheck,
  RefreshCw,
  BookOpen,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { activeRole } = useAuth();

  const getMenuItems = () => {
    switch (activeRole) {
      case 'ROLE_ADMIN':
        return [
          { id: 'dashboard', label: 'Admin Overview', icon: <LayoutDashboard size={18} /> },
          { id: 'students', label: 'Student Directory', icon: <Users size={18} /> },
          { id: 'courses', label: 'Academic Courses', icon: <GraduationCap size={18} /> },
          { id: 'finance', label: 'Tuition & Invoices', icon: <CreditCard size={18} /> },
          { id: 'attendance_roster', label: 'Attendance Roster', icon: <CalendarCheck size={18} /> },
          { id: 'ai_studio', label: 'AI Intelligence', icon: <Sparkles size={18} /> },
        ];
      case 'ROLE_TEACHER':
        return [
          { id: 'dashboard', label: 'Faculty Dashboard', icon: <LayoutDashboard size={18} /> },
          { id: 'attendance_mark', label: 'Take Attendance', icon: <CalendarCheck size={18} /> },
          { id: 'grade_entry', label: 'Grade & Exam Entry', icon: <Award size={18} /> },
          { id: 'my_classes', label: 'Class Schedules', icon: <Calendar size={18} /> },
          { id: 'ai_studio', label: 'AI Teaching Copilot', icon: <Sparkles size={18} /> },
        ];
      case 'ROLE_STUDENT':
        return [
          { id: 'dashboard', label: 'Student Dashboard', icon: <LayoutDashboard size={18} /> },
          { id: 'my_schedule', label: 'Class Timetable', icon: <Calendar size={18} /> },
          { id: 'my_results', label: 'Academic Grades', icon: <Award size={18} /> },
          { id: 'my_fees', label: 'Tuition Invoices', icon: <CreditCard size={18} /> },
          { id: 'ai_studio', label: 'AI Study Assistant', icon: <Sparkles size={18} /> },
        ];
      case 'ROLE_PARENT':
        return [
          { id: 'dashboard', label: 'Parent Portal', icon: <LayoutDashboard size={18} /> },
          { id: 'child_attendance', label: 'Attendance Alerts', icon: <CalendarCheck size={18} /> },
          { id: 'child_grades', label: 'Report Cards', icon: <Award size={18} /> },
          { id: 'child_fees', label: 'Fee Payments', icon: <CreditCard size={18} /> },
          { id: 'ai_studio', label: 'AI Performance Advisor', icon: <Sparkles size={18} /> },
        ];
      case 'ROLE_SALES':
        return [
          { id: 'pipeline', label: 'Admissions Pipeline', icon: <KanbanSquare size={18} /> },
          { id: 'register', label: 'Student Register', icon: <UserPlus size={18} /> },
          { id: 'students', label: 'Students Directory', icon: <Users size={18} /> },
          { id: 'courses', label: 'Course Categories & Plans', icon: <BookOpen size={18} /> },
          { id: 'payments', label: 'Installment & Payments', icon: <Receipt size={18} /> },
          { id: 'parents', label: 'Parent Accounts & Linker', icon: <UserCheck size={18} /> },
          { id: 're-enroll', label: 'Student Re-Enrollment', icon: <RefreshCw size={18} /> },
          { id: 'admin-requests', label: 'Admin Audit Queue', icon: <ShieldAlert size={18} /> },
        ];
      case 'ROLE_STUDENT_AFFAIR':
        return [
          { id: 'dashboard', label: 'Affairs Dashboard', icon: <LayoutDashboard size={18} /> },
          { id: 'complaints', label: 'Grievances & Triage', icon: <ShieldAlert size={18} /> },
          { id: 'leave_requests', label: 'Leave Approvals', icon: <FileCheck2 size={18} /> },
          { id: 'discipline', label: 'Disciplinary Records', icon: <LifeBuoy size={18} /> },
          { id: 'ai_studio', label: 'AI Behavioral Risk', icon: <Sparkles size={18} /> },
        ];
      default:
        return [
          { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
          { id: 'students', label: 'Students', icon: <Users size={18} /> },
        ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside
      style={{
        width: '240px',
        backgroundColor: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--sidebar-border)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.25rem 0.85rem',
        minHeight: 'calc(100vh - 64px)',
        position: 'sticky',
        top: '64px',
      }}
    >
      <div>
        <p
          style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--slate-500)',
            padding: '0.5rem 0.75rem',
            marginBottom: '0.4rem',
          }}
        >
          Navigation
        </p>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  backgroundColor: isActive ? 'var(--sidebar-active)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--sidebar-text)',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span style={{ color: isActive ? '#ffffff' : 'var(--slate-400)' }}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* System Status Footnote */}
      <div
        style={{
          padding: '0.75rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success-primary)' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-200)' }}>
            System Online
          </span>
        </div>
        <p style={{ fontSize: '0.7rem', color: 'var(--slate-400)' }}>
          PostgreSQL 16 • Redis Active
        </p>
      </div>
    </aside>
  );
};
