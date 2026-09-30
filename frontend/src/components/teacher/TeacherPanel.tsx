import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import type { Course, Student, AttendanceStatus } from '../../types';

import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  CalendarCheck,
  Award,
  Sparkles,
  Save,
  Check,
  Calendar,
} from 'lucide-react';

interface TeacherPanelProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const TeacherPanel: React.FC<TeacherPanelProps> = ({ activeTab = 'attendance_mark', setActiveTab }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number>(1);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceDate, setAttendanceDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Student Attendance State
  const [attendanceState, setAttendanceState] = useState<Record<number, AttendanceStatus>>({
    1: 'PRESENT',
    2: 'PRESENT',
    3: 'PRESENT',
  });

  // Grade Entry State
  const [gradesState, setGradesState] = useState<Record<number, { marks: number; remarks: string }>>({
    1: { marks: 92.5, remarks: 'Excellent algorithm proof' },
    2: { marks: 74.0, remarks: 'Good work, revise trees' },
    3: { marks: 95.0, remarks: 'Outstanding performance' },
  });

  const [isSaved, setIsSaved] = useState(false);
  const [isGradeSaved, setIsGradeSaved] = useState(false);

  useEffect(() => {
    api.getCourses().then((c) => {
      setCourses(c);
      if (c.length > 0) setSelectedCourseId(c[0].id);
    });
    api.getStudents().then((s) => {
      setStudents(s);
      const initialAtt: Record<number, AttendanceStatus> = {};
      s.forEach((st) => (initialAtt[st.id] = 'PRESENT'));
      setAttendanceState(initialAtt);
    });
  }, []);

  const handleStatusToggle = (studentId: number, status: AttendanceStatus) => {
    setAttendanceState((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAllPresent = () => {
    const updated: Record<number, AttendanceStatus> = {};
    students.forEach((s) => (updated[s.id] = 'PRESENT'));
    setAttendanceState(updated);
  };

  const handleSaveAttendance = async () => {
    setIsSaved(true);
    try {
      await Promise.all(
        students.map((s) =>
          api.markAttendance({
            studentId: s.id,
            courseId: selectedCourseId,
            attendanceDate,
            status: attendanceState[s.id] || 'PRESENT',
            remarks: 'Recorded via Faculty Instruction Suite',
          })
        )
      );
    } catch (err) {
      console.warn('Attendance backend sync:', err);
    }
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handlePublishGrades = async () => {
    setIsGradeSaved(true);
    try {
      await Promise.all(
        students.map((s) => {
          const info = gradesState[s.id] || { marks: 85, remarks: 'Satisfactory' };
          return api.publishResult({
            examId: 1,
            studentId: s.id,
            marksObtained: info.marks,
            grade: calculateGrade(info.marks),
            remarks: info.remarks,
          });
        })
      );
    } catch (err) {
      console.warn('Grade publish sync:', err);
    }
    setTimeout(() => setIsGradeSaved(false), 3000);
  };

  const calculateGrade = (marks: number): string => {
    if (marks >= 90) return 'A';
    if (marks >= 80) return 'B+';
    if (marks >= 70) return 'B';
    if (marks >= 60) return 'C';
    if (marks >= 50) return 'D';
    return 'F';
  };

  const presentCount = Object.values(attendanceState).filter((s) => s === 'PRESENT').length;
  const attendanceRate = students.length > 0 ? Math.round((presentCount / students.length) * 100) : 100;

  const currentTab = activeTab === 'dashboard' ? 'attendance_mark' : activeTab;

  const navPills = [
    { id: 'attendance_mark', label: 'Take Attendance', icon: <CalendarCheck size={15} /> },
    { id: 'grade_entry', label: 'Grade & Exam Entry', icon: <Award size={15} /> },
    { id: 'my_classes', label: 'Class Schedules', icon: <Calendar size={15} /> },
    { id: 'ai_studio', label: 'AI Teaching Copilot', icon: <Sparkles size={15} /> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Faculty Instruction Suite
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Rapid 1-click attendance marking, gradebook entry, and real-time class engagement telemetry.
          </p>
        </div>

        {/* View Switcher Pill */}
        <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--slate-100)', padding: '0.25rem', borderRadius: 'var(--radius-lg)' }}>
          {navPills.map((pill) => {
            const isActive = currentTab === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => setActiveTab && setActiveTab(pill.id)}
                style={{
                  padding: '0.45rem 0.95rem',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: isActive ? 'var(--bg-surface)' : 'transparent',
                  color: isActive ? 'var(--primary-600)' : 'var(--text-secondary)',
                  boxShadow: isActive ? 'var(--card-shadow)' : 'none',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <span>{pill.icon}</span>
                <span>{pill.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Course & Session Selector Bar (Shown for Attendance & Grading) */}
      {(currentTab === 'attendance_mark' || currentTab === 'grade_entry') && (
        <div className="surface-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
                Selected Class Course
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(Number(e.target.value))}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-main)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  outline: 'none',
                }}
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
                Lecture Date
              </label>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-main)',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {currentTab === 'attendance_mark' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Button variant="outline" size="sm" onClick={handleMarkAllPresent}>
                Mark All Present
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={isSaved ? <Check size={16} /> : <Save size={16} />}
                onClick={handleSaveAttendance}
              >
                {isSaved ? 'Attendance Recorded!' : 'Save Session'}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* VIEW: ATTENDANCE MARKING TAB */}
      {currentTab === 'attendance_mark' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Quick Metrics Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="surface-card" style={{ padding: '1rem 1.25rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Class Size</p>
              <p style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                {students.length} Students
              </p>
            </div>
            <div className="surface-card" style={{ padding: '1rem 1.25rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Present Count</p>
              <p style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success-primary)', marginTop: '0.2rem' }}>
                {presentCount} / {students.length}
              </p>
            </div>
            <div className="surface-card" style={{ padding: '1rem 1.25rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Daily Rate</p>
              <p style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-600)', marginTop: '0.2rem' }}>
                {attendanceRate}%
              </p>
            </div>
          </div>

          {/* Roster Table */}
          <div className="surface-card" style={{ padding: '1rem 1.5rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Student Details</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Course Status</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Mark Attendance State</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => {
                  const currentStatus = attendanceState[s.id] || 'PRESENT';
                  return (
                    <tr key={s.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--primary-100)',
                              color: 'var(--primary-700)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '0.85rem',
                            }}
                          >
                            {s.fullName.charAt(0)}
                          </div>
                          <div>
                            <p style={{ fontWeight: 600, color: 'var(--text-main)' }}>{s.fullName}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.studentCode}</p>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <Badge variant="info">Enrolled</Badge>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                          {(['PRESENT', 'LATE', 'EXCUSED', 'ABSENT'] as AttendanceStatus[]).map((status) => {
                            const isSelected = currentStatus === status;
                            const colors: Record<AttendanceStatus, { bg: string; color: string; border: string }> = {
                              PRESENT: { bg: 'rgba(16, 185, 129, 0.12)', color: 'var(--success-primary)', border: 'var(--success-primary)' },
                              LATE: { bg: 'rgba(245, 158, 11, 0.12)', color: 'var(--warning-primary)', border: 'var(--warning-primary)' },
                              EXCUSED: { bg: 'rgba(59, 130, 246, 0.12)', color: 'var(--primary-600)', border: 'var(--primary-600)' },
                              ABSENT: { bg: 'rgba(239, 68, 68, 0.12)', color: 'var(--danger-primary)', border: 'var(--danger-primary)' },
                            };
                            const c = colors[status];
                            return (
                              <button
                                key={status}
                                onClick={() => handleStatusToggle(s.id, status)}
                                style={{
                                  padding: '0.35rem 0.65rem',
                                  borderRadius: 'var(--radius-sm)',
                                  border: `1px solid ${isSelected ? c.border : 'var(--border-subtle)'}`,
                                  backgroundColor: isSelected ? c.bg : 'transparent',
                                  color: isSelected ? c.color : 'var(--text-secondary)',
                                  fontSize: '0.75rem',
                                  fontWeight: isSelected ? 700 : 500,
                                  cursor: 'pointer',
                                  transition: 'all var(--transition-fast)',
                                }}
                              >
                                {status}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: GRADE ENTRY TAB */}
      {currentTab === 'grade_entry' && (
        <div className="surface-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Midterm Exam Gradebook</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Enter exam score out of 100. Letter grades automatically compute.</p>
            </div>
            <Button
              variant="primary"
              size="sm"
              leftIcon={isGradeSaved ? <Check size={16} /> : <Save size={16} />}
              onClick={handlePublishGrades}
            >
              {isGradeSaved ? 'Grades Published!' : 'Publish Grades'}
            </Button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Student</th>
                <th style={{ padding: '0.75rem 1rem' }}>Raw Score (/100)</th>
                <th style={{ padding: '0.75rem 1rem' }}>Computed Grade</th>
                <th style={{ padding: '0.75rem 1rem' }}>Instructor Feedback</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => {
                const gradeInfo = gradesState[s.id] || { marks: 85, remarks: 'Satisfactory work' };
                const computed = calculateGrade(gradeInfo.marks);
                return (
                  <tr key={s.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <p style={{ fontWeight: 600 }}>{s.fullName}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.studentCode}</p>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={gradeInfo.marks}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setGradesState({
                            ...gradesState,
                            [s.id]: { ...gradeInfo, marks: val },
                          });
                        }}
                        style={{
                          width: '80px',
                          padding: '0.35rem 0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-subtle)',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                        }}
                      />
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <Badge variant={computed === 'A' ? 'success' : computed === 'B+' ? 'info' : 'warning'}>
                        Grade: {computed}
                      </Badge>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <input
                        type="text"
                        value={gradeInfo.remarks}
                        onChange={(e) => {
                          setGradesState({
                            ...gradesState,
                            [s.id]: { ...gradeInfo, remarks: e.target.value },
                          });
                        }}
                        placeholder="Feedback note..."
                        style={{
                          width: '100%',
                          maxWidth: '300px',
                          padding: '0.35rem 0.6rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-subtle)',
                          fontSize: '0.8rem',
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW: CLASS SCHEDULES */}
      {currentTab === 'my_classes' && (
        <div className="surface-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Assigned Course Lecture Schedules</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Weekly room allocations and assigned class hours</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-subtle)' }}>
              <Badge variant="info">Monday 09:00 - 10:30</Badge>
              <h4 style={{ fontWeight: 700, marginTop: '0.5rem' }}>CS101: Introduction to AI & Algorithms</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hall 301 • 38 Students</p>
            </div>
            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-subtle)' }}>
              <Badge variant="info">Wednesday 13:00 - 15:00</Badge>
              <h4 style={{ fontWeight: 700, marginTop: '0.5rem' }}>CS101: Machine Learning Computing Lab</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI Hub Lab B • 38 Students</p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: AI TEACHING COPILOT */}
      {currentTab === 'ai_studio' && (
        <div className="surface-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-100)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Gemini AI Faculty Assistant</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Intelligent attendance risk detection and rubric evaluation recommendations</p>
            </div>
          </div>

          <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-700)' }}>Automated Midterm Insights</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem', lineHeight: 1.5 }}>
              Alice Walker scored 92.5% on algorithm proofs and has 100% attendance. Michael Chen has an 82% attendance rate and would benefit from practice on tree traversals before final assessments.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
