import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  Sparkles,
  Users,
  Award,
  CreditCard,
  KanbanSquare,
  ShieldAlert,
  CalendarCheck,
} from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab }) => {
  const { activeRole } = useAuth();

  const getMobileItems = () => {
    switch (activeRole) {
      case 'ROLE_ADMIN':
        return [
          { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard size={18} /> },
          { id: 'students', label: 'Students', icon: <Users size={18} /> },
          { id: 'finance', label: 'Finance', icon: <CreditCard size={18} /> },
          { id: 'ai_studio', label: 'AI Studio', icon: <Sparkles size={18} /> },
        ];
      case 'ROLE_TEACHER':
        return [
          { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard size={18} /> },
          { id: 'attendance_mark', label: 'Attendance', icon: <CalendarCheck size={18} /> },
          { id: 'grade_entry', label: 'Grades', icon: <Award size={18} /> },
          { id: 'ai_studio', label: 'AI Copilot', icon: <Sparkles size={18} /> },
        ];
      case 'ROLE_STUDENT':
        return [
          { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard size={18} /> },
          { id: 'my_schedule', label: 'Schedule', icon: <Calendar size={18} /> },
          { id: 'my_results', label: 'Grades', icon: <Award size={18} /> },
          { id: 'ai_studio', label: 'AI Tutor', icon: <Sparkles size={18} /> },
        ];
      case 'ROLE_PARENT':
        return [
          { id: 'dashboard', label: 'Portal', icon: <LayoutDashboard size={18} /> },
          { id: 'child_attendance', label: 'Attendance', icon: <CalendarCheck size={18} /> },
          { id: 'child_grades', label: 'Reports', icon: <Award size={18} /> },
          { id: 'child_fees', label: 'Payments', icon: <CreditCard size={18} /> },
        ];
      case 'ROLE_SALES':
        return [
          { id: 'pipeline', label: 'Pipeline', icon: <KanbanSquare size={18} /> },
          { id: 'register', label: 'Register', icon: <Users size={18} /> },
          { id: 'students', label: 'Students', icon: <Users size={18} /> },
          { id: 'payments', label: 'Payments', icon: <CreditCard size={18} /> },
        ];
      case 'ROLE_STUDENT_AFFAIR':
        return [
          { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard size={18} /> },
          { id: 'complaints', label: 'Grievance', icon: <ShieldAlert size={18} /> },
          { id: 'leave_requests', label: 'Leaves', icon: <CalendarCheck size={18} /> },
          { id: 'ai_studio', label: 'AI Risk', icon: <Sparkles size={18} /> },
        ];
      default:
        return [
          { id: 'dashboard', label: 'Home', icon: <LayoutDashboard size={18} /> },
          { id: 'students', label: 'Roster', icon: <Users size={18} /> },
          { id: 'ai_studio', label: 'AI Copilot', icon: <Sparkles size={18} /> },
        ];
    }
  };

  const items = getMobileItems();

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'none',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 90,
        boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.05)',
      }}
      className="mobile-nav-bar"
    >
      {items.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.2rem',
              border: 'none',
              background: 'none',
              color: isActive ? 'var(--primary-600)' : 'var(--text-muted)',
              fontSize: '0.7rem',
              fontWeight: isActive ? 700 : 500,
              cursor: 'pointer',
              flex: 1,
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
