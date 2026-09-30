import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import type { RoleType, NotificationItem } from '../../types';
import { api } from '../../services/api';

import {
  Bell,
  Sun,
  Moon,
  Sparkles,
  ChevronDown,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  Clock,
  LogOut,
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ setActiveTab }) => {
  const { user, activeRole, switchRole, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  useEffect(() => {
    api.getNotifications().then(setNotifications);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const rolesList: { role: RoleType; label: string; desc: string; icon: string }[] = [
    { role: 'ROLE_ADMIN', label: 'Admin Portal', desc: 'KPIs, courses, students, system oversight', icon: '⚡' },
    { role: 'ROLE_TEACHER', label: 'Teacher Panel', desc: 'Class roster, 1-click attendance, grading', icon: '📝' },
    { role: 'ROLE_STUDENT', label: 'Student Portal', desc: 'GPA, attendance ring, timetable, grades', icon: '🎓' },
    { role: 'ROLE_PARENT', label: 'Parent Portal', desc: 'Child tracking, fee ledger, instant alerts', icon: '👨‍👧' },
    { role: 'ROLE_SALES', label: 'Sales CRM', desc: 'Lead pipeline Kanban, conversion tracking', icon: '💼' },
    { role: 'ROLE_STUDENT_AFFAIR', label: 'Student Affairs', desc: 'Grievance triage, leave approvals', icon: '🛡️' },
  ];

  const currentRoleInfo = rolesList.find((r) => r.role === activeRole) || rolesList[0];
  const isAdmin = user?.username === 'admin' || (user?.roles && user.roles.includes('ROLE_ADMIN'));

  return (
    <header
      style={{
        height: '64px',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Brand & Context */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div
          onClick={() => setActiveTab('dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--primary-600) 0%, #1d4ed8 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)',
            }}
          >
            <GraduationCap size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                EduPulse
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  backgroundColor: 'var(--primary-100)',
                  color: 'var(--primary-700)',
                  padding: '0.1rem 0.4rem',
                  borderRadius: 'var(--radius-sm)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                }}
              >
                <Sparkles size={10} /> AI
              </span>
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1 }}>
              Student Management System
            </p>
          </div>
        </div>
      </div>

      {/* Role Switcher & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Quick Role Switcher Pill (Admin only can switch, others see their role) */}
        <div style={{ position: 'relative' }}>
          {isAdmin ? (
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              title="Admin Role Perspective Switcher"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'var(--slate-100)',
                border: '1px solid var(--border-subtle)',
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              <span>{currentRoleInfo.icon}</span>
              <span>{currentRoleInfo.label}</span>
              <ChevronDown size={14} color="var(--text-muted)" />
            </button>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'var(--slate-100)',
                border: '1px solid var(--border-subtle)',
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              <span>{currentRoleInfo.icon}</span>
              <span>{currentRoleInfo.label}</span>
            </div>
          )}

          {/* Role Dropdown Menu */}
          {showRoleMenu && (
            <div
              className="glass-panel animate-fade-in"
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '300px',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--card-shadow-hover)',
                padding: '0.5rem',
                zIndex: 100,
              }}
            >
              <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.35rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Switch Role Perspective
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Experience each role-specific workflow
                </p>
              </div>

              {rolesList.map((item) => (
                <div
                  key={item.role}
                  onClick={() => {
                    switchRole(item.role);
                    setShowRoleMenu(false);
                    setActiveTab('dashboard');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.65rem',
                    padding: '0.6rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    backgroundColor: activeRole === item.role ? 'var(--primary-50)' : 'transparent',
                    transition: 'background var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => {
                    if (activeRole !== item.role) e.currentTarget.style.backgroundColor = 'var(--slate-100)';
                  }}
                  onMouseLeave={(e) => {
                    if (activeRole !== item.role) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600, color: activeRole === item.role ? 'var(--primary-700)' : 'var(--text-main)' }}>
                        {item.label}
                      </p>
                      {activeRole === item.role && (
                        <CheckCircle2 size={14} color="var(--primary-600)" />
                      )}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--slate-100)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
          }}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Notifications Button & Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--slate-100)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all var(--transition-fast)',
            }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--danger-primary)',
                  color: '#ffffff',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 5px rgba(239, 68, 68, 0.4)',
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Flyout */}
          {showNotifications && (
            <div
              className="glass-panel animate-fade-in"
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '340px',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--card-shadow-hover)',
                padding: '0.75rem',
                zIndex: 100,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  Notifications
                </p>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary-600)', cursor: 'pointer', fontWeight: 600 }}>
                  Mark all as read
                </span>
              </div>

              <div style={{ maxHeight: '280px', overflowY: 'auto', marginTop: '0.5rem' }}>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      padding: '0.65rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: n.isRead ? 'transparent' : 'var(--primary-50)',
                      marginBottom: '0.4rem',
                      display: 'flex',
                      gap: '0.6rem',
                    }}
                  >
                    <div style={{ marginTop: '0.2rem' }}>
                      {n.type === 'ATTENDANCE' ? <CheckCircle2 size={16} color="var(--success-primary)" /> : <AlertCircle size={16} color="var(--primary-600)" />}
                    </div>
                    <div>
                      <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {n.title}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                        {n.message}
                      </p>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                        <Clock size={11} /> {n.createdAt}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '0.5rem', borderLeft: '1px solid var(--border-subtle)' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-700)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
            }}
          >
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.1 }}>
              {user?.fullName || 'User'}
            </p>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              @{user?.username || 'user'} • {user?.roles?.[0]?.replace('ROLE_', '') || 'STAFF'}
            </p>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={logout}
            title="Sign Out of Session"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--slate-100)',
              color: 'var(--text-secondary)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              marginLeft: '0.25rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--danger-primary)';
              e.currentTarget.style.borderColor = 'var(--danger-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
            }}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
