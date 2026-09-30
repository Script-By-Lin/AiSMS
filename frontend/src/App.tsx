import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { AiCopilot } from './components/ai/AiCopilot';
import { LoginPage } from './components/auth/LoginPage';

import { AdminDashboard } from './components/admin/AdminDashboard';
import { TeacherPanel } from './components/teacher/TeacherPanel';
import { StudentPanel } from './components/student/StudentPanel';
import { ParentPanel } from './components/parent/ParentPanel';
import { SalesPanel } from './components/sales/SalesPanel';
import { StudentAffairPanel } from './components/studentAffair/StudentAffairPanel';

const AppContent: React.FC = () => {
  const { isAuthenticated, activeRole } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Reset tab to default perspective when role changes
  useEffect(() => {
    setActiveTab(activeRole === 'ROLE_SALES' ? 'pipeline' : 'dashboard');
  }, [activeRole]);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderActiveView = () => {
    switch (activeRole) {
      case 'ROLE_ADMIN':
        return <AdminDashboard activeTab={activeTab} setActiveTab={setActiveTab} />;
      case 'ROLE_TEACHER':
        return <TeacherPanel activeTab={activeTab} setActiveTab={setActiveTab} />;
      case 'ROLE_STUDENT':
        return <StudentPanel activeTab={activeTab} setActiveTab={setActiveTab} />;
      case 'ROLE_PARENT':
        return <ParentPanel activeTab={activeTab} setActiveTab={setActiveTab} />;
      case 'ROLE_SALES':
        return <SalesPanel activeTab={activeTab} setActiveTab={setActiveTab} />;
      case 'ROLE_STUDENT_AFFAIR':
        return <StudentAffairPanel activeTab={activeTab} setActiveTab={setActiveTab} />;
      default:
        return <AdminDashboard activeTab={activeTab} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div style={{ display: 'flex', flex: 1 }}>
          {/* Desktop Left Sidebar */}
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Main Workspace Body */}
          <main className="main-content">
            <div className="page-body">
              {renderActiveView()}
            </div>
          </main>
        </div>

        {/* Mobile-First Bottom Navigation Bar */}
        <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Gemini AI Universal Copilot */}
        <AiCopilot />
      </div>
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
