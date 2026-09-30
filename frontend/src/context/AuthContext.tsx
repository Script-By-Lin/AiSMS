import React, { createContext, useContext, useState } from 'react';
import type { User, RoleType } from '../types';

import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  activeRole: RoleType;
  switchRole: (role: RoleType) => void;
  login: (username: string, pass: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const token = localStorage.getItem('sms_access_token');
    const savedUser = localStorage.getItem('sms_user');
    if (token && savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [activeRole, setActiveRole] = useState<RoleType>(() => {
    const savedRole = localStorage.getItem('sms_active_role') as RoleType;
    return savedRole || 'ROLE_ADMIN';
  });

  const demoProfiles: Record<RoleType, User> = {
    ROLE_ADMIN: { id: 1, username: 'admin', fullName: 'Headmaster Admin', email: 'admin@sms.edu', roles: ['ROLE_ADMIN'] },
    ROLE_TEACHER: { id: 2, username: 'teacher1', fullName: 'Dr. John Smith', email: 'john.smith@sms.edu', roles: ['ROLE_TEACHER'] },
    ROLE_STUDENT: { id: 4, username: 'student1', fullName: 'Alice Walker', email: 'alice.walker@sms.edu', roles: ['ROLE_STUDENT'] },
    ROLE_PARENT: { id: 3, username: 'parent1', fullName: 'Robert Walker', email: 'robert.walker@sms.edu', roles: ['ROLE_PARENT'] },
    ROLE_SALES: { id: 5, username: 'sales1', fullName: 'Sarah Jenkins', email: 'sarah.j@sms.edu', roles: ['ROLE_SALES'] },
    ROLE_STUDENT_AFFAIR: { id: 6, username: 'affairs1', fullName: 'Marcus Vance', email: 'marcus.v@sms.edu', roles: ['ROLE_STUDENT_AFFAIR'] },
  };

  const switchRole = (role: RoleType) => {
    setActiveRole(role);
    localStorage.setItem('sms_active_role', role);

    // If currently authenticated as admin or switching demo perspective
    if (demoProfiles[role]) {
      const updatedUser = { ...demoProfiles[role], roles: [role] };
      setUser(updatedUser);
      localStorage.setItem('sms_user', JSON.stringify(updatedUser));
    }
  };

  const login = async (username: string, pass: string): Promise<boolean> => {
    try {
      const res = await api.login(username, pass);
      if (res && res.user) {
        setUser(res.user);
        localStorage.setItem('sms_user', JSON.stringify(res.user));
        const assignedRole = (res.user.roles && res.user.roles[0]) || 'ROLE_ADMIN';
        setActiveRole(assignedRole);
        localStorage.setItem('sms_active_role', assignedRole);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = () => {
    api.setToken(null);
    setUser(null);
    localStorage.removeItem('sms_user');
    localStorage.removeItem('sms_active_role');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activeRole,
        switchRole,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
