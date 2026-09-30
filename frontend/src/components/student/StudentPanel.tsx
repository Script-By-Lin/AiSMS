import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import type { ExamResult, TimetableSlot, Invoice } from '../../types';
import { StatCard } from '../common/StatCard';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import {
  LayoutDashboard,
  CalendarCheck,
  Award,
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  CreditCard,
  Sparkles,
  Send,
  Download,
  FileText,
  User,
} from 'lucide-react';

interface StudentPanelProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const StudentPanel: React.FC<StudentPanelProps> = ({ activeTab = 'dashboard', setActiveTab }) => {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    api.getResults(1).then(setResults);
    api.getTimetable().then(setTimetable);
    api.getInvoices().then((inv) => setInvoices(inv.filter((i) => i.studentId === 1)));
  }, []);

  const handleAskAi = async (promptText?: string) => {
    const q = promptText || aiPrompt;
    if (!q.trim()) return;
    setIsAiLoading(true);
    setAiResponse('');
    try {
      const resp = await api.askAi(q);
      setAiResponse(resp);
    } catch {
      setAiResponse('AI study assistant is currently synthesizing recommendations. Please try again shortly.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const currentTab = activeTab || 'dashboard';

  const navPills = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard size={15} /> },
    { id: 'my_schedule', label: 'Class Timetable', icon: <Calendar size={15} /> },
    { id: 'my_results', label: 'Academic Grades', icon: <Award size={15} /> },
    { id: 'my_fees', label: 'Tuition Invoices', icon: <CreditCard size={15} /> },
    { id: 'ai_studio', label: 'AI Study Assistant', icon: <Sparkles size={15} /> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      {/* Student Profile Hero Card */}
      <div
        className="surface-card"
        style={{
          padding: '1.75rem',
          background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--primary-50) 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, var(--primary-600) 0%, #1d4ed8 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.75rem',
              boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)',
            }}
          >
            A
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Alice Walker
              </h2>
              <Badge variant="success" dot>Enrolled Full-Time</Badge>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Student ID: <strong>STU-2026-0001</strong> • B.Sc. Computer Science & AI (Term 1)
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Advisor / Mentor</p>
            <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>Dr. John Smith</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Sparkles size={14} />}
            onClick={() => setActiveTab && setActiveTab('ai_studio')}
          >
            Study Copilot
          </Button>
        </div>
      </div>

      {/* Internal Navigation Tabs (Synchronized with Sidebar) */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          backgroundColor: 'var(--slate-100)',
          padding: '0.35rem',
          borderRadius: 'var(--radius-lg)',
          overflowX: 'auto',
          flexWrap: 'nowrap',
        }}
      >
        {navPills.map((pill) => {
          const isActive = currentTab === pill.id;
          return (
            <button
              key={pill.id}
              onClick={() => setActiveTab && setActiveTab(pill.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.5rem 0.95rem',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                backgroundColor: isActive ? 'var(--bg-surface)' : 'transparent',
                color: isActive ? 'var(--primary-600)' : 'var(--text-secondary)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
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

      {/* VIEW 1: DASHBOARD OVERVIEW */}
      {currentTab === 'dashboard' && (
        <>
          {/* Metric Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
            }}
          >
            <StatCard
              title="Attendance Rate"
              value="96.5%"
              subtitle="42 of 44 classes attended"
              trend={{ value: 'Perfect this week', positive: true }}
              icon={<CalendarCheck size={20} />}
              accentColor="var(--success-primary)"
            />
            <StatCard
              title="Cumulative GPA"
              value="3.88"
              subtitle="Top 5% of cohort"
              trend={{ value: '+0.12 pts', positive: true }}
              icon={<Award size={20} />}
              accentColor="var(--primary-600)"
            />
            <StatCard
              title="Enrolled Credits"
              value="18"
              subtitle="Fall 2026 Semester"
              icon={<BookOpen size={20} />}
              accentColor="var(--info-primary)"
            />
            <StatCard
              title="Tuition Balance"
              value="$0.00"
              subtitle="All invoices fully settled"
              trend={{ value: 'Cleared', positive: true }}
              icon={<CheckCircle2 size={20} />}
              accentColor="var(--success-primary)"
            />
          </div>

          {/* Quick Schedule + Results Preview */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {/* Class Timetable Card */}
            <div className="surface-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={18} color="var(--primary-600)" />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Today's Lectures</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab && setActiveTab('my_schedule')}>
                  Full Schedule →
                </Button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {timetable.slice(0, 3).map((slot) => (
                  <div
                    key={slot.id}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-app)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                          {slot.subjectName}
                        </span>
                        <Badge variant="neutral" size="sm">{slot.courseName}</Badge>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.35rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Clock size={12} /> {slot.startTime} - {slot.endTime}
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <MapPin size={12} /> {slot.roomNumber}
                        </span>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-600)' }}>
                      {slot.teacherName}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Academic Results Preview */}
            <div className="surface-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award size={18} color="var(--primary-600)" />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Published Grades</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab && setActiveTab('my_results')}>
                  All Grades →
                </Button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {results.slice(0, 3).map((res) => (
                  <div
                    key={res.id}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-app)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {res.subjectName}
                      </h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                        {res.examTitle}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <Badge variant={res.grade.startsWith('A') ? 'success' : 'info'}>
                        Grade: {res.grade}
                      </Badge>
                      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                        {res.marksObtained} / {res.maxMarks}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* VIEW 2: CLASS TIMETABLE */}
      {currentTab === 'my_schedule' && (
        <div className="surface-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Weekly Academic Class Schedule
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Official lecture halls, laboratory timeslots, and faculty appointments for Fall 2026.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Download size={14} />}
                onClick={() => alert('Exporting iCalendar (.ics) file with your scheduled lectures...')}
              >
                Export Schedule (.ics)
              </Button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
            {timetable.map((slot) => (
              <div
                key={slot.id}
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--bg-app)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-600)', textTransform: 'uppercase' }}>
                      {slot.dayOfWeek}
                    </span>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                      {slot.subjectName}
                    </h4>
                  </div>
                  <Badge variant="info">{slot.courseName}</Badge>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={14} color="var(--primary-600)" />
                    <span>{slot.startTime} - {slot.endTime}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={14} color="var(--success-primary)" />
                    <span>Hall {slot.roomNumber}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <User size={14} color="var(--purple-primary)" />
                    <span>Faculty: <strong>{slot.teacherName}</strong></span>
                  </div>
                </div>

                <div style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end' }}>
                  <Badge variant="success" size="sm">Confirmed Attendance</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: ACADEMIC GRADES */}
      {currentTab === 'my_results' && (
        <div className="surface-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Official Academic Transcript & Examination Results
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Certified grades verified by the Registrar and Faculty Department.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Semester GPA</span>
                <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-600)' }}>3.88 / 4.00</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {results.map((res) => (
              <div
                key={res.id}
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--bg-app)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {res.subjectName}
                    </h4>
                    <Badge variant={res.grade.startsWith('A') ? 'success' : 'info'}>
                      Grade: {res.grade}
                    </Badge>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    Assessment: <strong>{res.examTitle}</strong> • Total Possible: {res.maxMarks} marks
                  </p>
                  {res.remarks && (
                    <div style={{ marginTop: '0.5rem', padding: '0.5rem 0.75rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      💬 <strong>Faculty Remarks:</strong> {res.remarks}
                    </div>
                  )}
                </div>

                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-600)' }}>
                    {res.marksObtained}
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                      /{res.maxMarks}
                    </span>
                  </div>
                  <Badge variant="success" size="sm">Passed with Distinction</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: TUITION INVOICES */}
      {currentTab === 'my_fees' && (
        <div className="surface-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Tuition Ledger & Billing Statements
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Term fee structures, payment receipts, and settlement history.
              </p>
            </div>
            <Badge variant="success">All Accounts Settled</Badge>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {invoices.map((inv) => (
              <div
                key={inv.id}
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--bg-app)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {inv.feeStructureTitle}
                      </h4>
                      <Badge variant={inv.status === 'PAID' ? 'success' : 'warning'}>
                        {inv.status}
                      </Badge>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      Invoice #{inv.invoiceNumber} • Due Date: {inv.dueDate}
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      ${inv.totalAmount.toFixed(2)}
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--success-primary)', fontWeight: 600 }}>
                      Paid: ${inv.paidAmount?.toFixed(2) || inv.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Remaining Outstanding: <strong>${(inv.balanceAmount || 0).toFixed(2)}</strong>
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button size="sm" variant="outline" leftIcon={<FileText size={14} />} onClick={() => setSelectedInvoice(inv)}>
                      View Statement
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedInvoice && (
            <Modal isOpen={!!selectedInvoice} onClose={() => setSelectedInvoice(null)} title={`Invoice #${selectedInvoice.invoiceNumber}`}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-md)' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Fee Description</p>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>{selectedInvoice.feeStructureTitle}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Due: {selectedInvoice.dueDate}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span>Total Assessed</span>
                  <strong>${selectedInvoice.totalAmount.toFixed(2)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span>Amount Remitted</span>
                  <strong style={{ color: 'var(--success-primary)' }}>${(selectedInvoice.paidAmount || selectedInvoice.totalAmount).toFixed(2)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                  <span>Outstanding Balance</span>
                  <strong>${(selectedInvoice.balanceAmount || 0).toFixed(2)}</strong>
                </div>
                <Button variant="primary" onClick={() => setSelectedInvoice(null)}>
                  Close Statement
                </Button>
              </div>
            </Modal>
          )}
        </div>
      )}

      {/* VIEW 5: GEMINI AI STUDY ASSISTANT */}
      {currentTab === 'ai_studio' && (
        <div className="surface-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, var(--primary-600) 0%, #8b5cf6 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Gemini AI Academic Study Assistant
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Interactive course tutoring, exam revision question generator, and conceptual explanations.
                </p>
              </div>
            </div>
            <Badge variant="purple">Gemini 3.8 Flash</Badge>
          </div>

          {/* Quick Prompt Chips */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              'Explain Dijkstra shortest-path algorithm with practical code',
              'Generate 5 practice questions for CS101 Data Structures',
              'Summarize best exam revision techniques for Computer Science',
              'How can I improve my 3.88 GPA to 4.00 this semester?',
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => {
                  setAiPrompt(chip);
                  handleAskAi(chip);
                }}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary-400)';
                  e.currentTarget.style.color = 'var(--primary-600)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                💡 {chip}
              </button>
            ))}
          </div>

          {/* Interactive Chat Input */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskAi()}
              placeholder="Ask anything about your courses, assignments, or exam preparation..."
              style={{
                flex: 1,
                padding: '0.85rem 1.15rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-main)',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
            <Button
              variant="primary"
              disabled={isAiLoading || !aiPrompt.trim()}
              leftIcon={<Send size={16} />}
              onClick={() => handleAskAi()}
            >
              {isAiLoading ? 'Synthesizing...' : 'Ask Copilot'}
            </Button>
          </div>

          {/* AI Response Display */}
          {(aiResponse || isAiLoading) && (
            <div
              style={{
                marginTop: '0.5rem',
                padding: '1.25rem',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--bg-app)',
                border: '1px solid var(--border-subtle)',
                lineHeight: 1.6,
                fontSize: '0.9rem',
                color: 'var(--text-main)',
              }}
            >
              {isAiLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--primary-600)' }}>
                  <Sparkles size={18} className="animate-spin" />
                  <span>Gemini AI is analyzing your coursework and generating insights...</span>
                </div>
              ) : (
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {aiResponse}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
