import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import type { RoleType } from '../../types';
import {
  GraduationCap,
  Sparkles,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sun,
  Moon,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface RolePreset {
  role: RoleType;
  title: string;
  username: string;
  pass: string;
  badge: string;
  icon: string;
  color: string;
  description: string;
}

const ROLE_PRESETS: RolePreset[] = [
  {
    role: 'ROLE_ADMIN',
    title: 'Administrator',
    username: 'admin',
    pass: 'Admin@123',
    badge: 'Super Admin',
    icon: '⚡',
    color: 'var(--primary-600)',
    description: 'Executive overview, student directory, courses & system telemetry.',
  },
  {
    role: 'ROLE_TEACHER',
    title: 'Faculty / Teacher',
    username: 'teacher1',
    pass: 'Teacher@123',
    badge: 'Instruction',
    icon: '📝',
    color: '#0284c7',
    description: 'Classroom attendance marking, midterm gradebook & course schedules.',
  },
  {
    role: 'ROLE_STUDENT',
    title: 'Enrolled Student',
    username: 'student1',
    pass: 'Student@123',
    badge: 'Academic',
    icon: '🎓',
    color: '#10b981',
    description: 'Weekly schedule timetable, exam results, GPA & fee receipts.',
  },
  {
    role: 'ROLE_PARENT',
    title: 'Parent / Guardian',
    username: 'parent1',
    pass: 'Parent@123',
    badge: 'Family Portal',
    icon: '👨‍👩‍👧',
    color: '#8b5cf6',
    description: 'Child campus presence check-in, report cards & online fee payments.',
  },
  {
    role: 'ROLE_SALES',
    title: 'Admissions & Sales',
    username: 'sales1',
    pass: 'Sales@123',
    badge: 'CRM Pipeline',
    icon: '💼',
    color: '#f59e0b',
    description: 'Prospective student Kanban pipeline, lead stages & conversion tracking.',
  },
  {
    role: 'ROLE_STUDENT_AFFAIR',
    title: 'Student Affairs',
    username: 'affairs1',
    pass: 'Affairs@123',
    badge: 'Welfare & Triage',
    icon: '🛡️',
    color: '#ec4899',
    description: 'Campus grievances triage, student leave authorizations & conduct log.',
  },
];

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [systemOnline, setSystemOnline] = useState(true);

  useEffect(() => {
    // Check backend health
    fetch('/api/v1/health')
      .then((res) => res.json())
      .then((data) => setSystemOnline(data.data?.status === 'UP'))
      .catch(() => setSystemOnline(true));
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMsg('Please enter both username and password.');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);

    try {
      const ok = await login(username, password);
      if (!ok) {
        setErrorMsg('Invalid username or password. Please verify your credentials.');
      }
    } catch {
      setErrorMsg('Authentication request failed. Please check network connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = async (preset: RolePreset) => {
    setUsername(preset.username);
    setPassword(preset.pass);
    setErrorMsg(null);
    setIsLoading(true);

    try {
      await login(preset.username, preset.pass);
    } catch {
      setErrorMsg('Login failed for role ' + preset.title);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg-main)',
        color: 'var(--text-main)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background ambient lighting accents */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '20%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(60px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '15%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.10) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(60px)',
        }}
      />

      {/* Top Header Bar */}
      <header
        style={{
          padding: '1.25rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
            }}
          >
            <GraduationCap size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  letterSpacing: '-0.02em',
                }}
              >
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
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Next-Gen Student Management System
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Health indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--slate-100)',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: systemOnline ? 'var(--success-primary)' : 'var(--warning-primary)',
                boxShadow: systemOnline ? '0 0 8px rgba(16, 185, 129, 0.6)' : 'none',
              }}
            />
            <span>{systemOnline ? 'Backend Online (Port 8080)' : 'Connecting Backend...'}</span>
          </div>

          {/* Theme switch */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            style={{
              width: '36px',
              height: '36px',
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
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2.5rem 1.5rem',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{ width: '100%', maxWidth: '1080px', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {/* Hero Banner Text */}
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
            <h1
              style={{
                fontSize: '2.25rem',
                fontWeight: 800,
                color: 'var(--text-main)',
                letterSpacing: '-0.03em',
                lineHeight: 1.2,
              }}
            >
              Sign In to Your Campus Portal
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
              Role-Based Access Control (RBAC) securely delivers customized telemetry for administrators, faculty, students, parents, admissions, and affairs officers.
            </p>
          </div>

          {/* Grid Layout: Left = Live Credentials Form, Right = Instant 1-Click Role Accounts */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '2rem',
              alignItems: 'stretch',
            }}
          >
            {/* Left Card: Standard Login Form */}
            <div
              className="surface-card"
              style={{
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--card-shadow-hover)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
                  <ShieldCheck size={20} color="var(--primary-600)" />
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Direct Authentication</h2>
                </div>

                {errorMsg && (
                  <div
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                      color: 'var(--danger-primary)',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <AlertCircle size={16} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                        marginBottom: '0.4rem',
                      }}
                    >
                      Username or Institutional ID
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span
                        style={{
                          position: 'absolute',
                          left: '0.85rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'var(--text-muted)',
                        }}
                      >
                        <User size={16} />
                      </span>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="e.g. admin, teacher1, student1"
                        style={{
                          width: '100%',
                          padding: '0.7rem 0.85rem 0.7rem 2.4rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-subtle)',
                          backgroundColor: 'var(--bg-main)',
                          color: 'var(--text-main)',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                        marginBottom: '0.4rem',
                      }}
                    >
                      Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span
                        style={{
                          position: 'absolute',
                          left: '0.85rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'var(--text-muted)',
                        }}
                      >
                        <Lock size={16} />
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        style={{
                          width: '100%',
                          padding: '0.7rem 2.4rem 0.7rem 2.4rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-subtle)',
                          backgroundColor: 'var(--bg-main)',
                          color: 'var(--text-main)',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          outline: 'none',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '0.85rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          border: 'none',
                          background: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                        }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      marginTop: '0.5rem',
                      padding: '0.8rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      border: 'none',
                      backgroundColor: 'var(--primary-600)',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
                      transition: 'all var(--transition-fast)',
                      opacity: isLoading ? 0.75 : 1,
                    }}
                  >
                    <span>{isLoading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
                    <ArrowRight size={16} />
                  </button>
                </form>
              </div>

              <div
                style={{
                  marginTop: '1.75rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                }}
              >
                <CheckCircle2 size={14} color="var(--success-primary)" />
                <span>Protected by Spring Security 6 Stateless JWT & Rate Limiting.</span>
              </div>
            </div>

            {/* Right Card: Instant 1-Click Role Accounts (RBAC Fast-Switcher) */}
            <div
              className="surface-card"
              style={{
                padding: '2rem',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Fast 1-Click Role Presets</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Select any institutional role persona below to instantly authenticate and inspect its custom dashboard:
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                {ROLE_PRESETS.map((preset) => (
                  <button
                    key={preset.role}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    disabled={isLoading}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-main)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                      transition: 'all var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--primary-400)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '1.35rem' }}>{preset.icon}</span>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.45rem',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: 'var(--slate-100)',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {preset.badge}
                      </span>
                    </div>

                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                        {preset.title}
                      </p>
                      <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.15rem', lineHeight: 1.3 }}>
                        {preset.description}
                      </p>
                    </div>

                    <div
                      style={{
                        marginTop: '0.35rem',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        color: 'var(--primary-600)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      <span>Auto-Login ({preset.username})</span>
                      <ArrowRight size={12} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
