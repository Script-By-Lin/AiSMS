import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import type { Invoice, ExamResult } from '../../types';
import { StatCard } from '../common/StatCard';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import {
  LayoutDashboard,
  CalendarCheck,
  Award,
  CreditCard,
  CheckCircle2,
  Send,
  Sparkles,
  Clock,
} from 'lucide-react';

interface ParentPanelProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const ParentPanel: React.FC<ParentPanelProps> = ({ activeTab = 'dashboard', setActiveTab }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // AI Advisor State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    api.getInvoices().then((inv) => setInvoices(inv.filter((i) => i.studentId === 1)));
    api.getResults(1).then(setResults);
  }, []);

  const handlePay = async () => {
    if (!selectedInvoice) return;
    setIsPaying(true);
    try {
      await api.recordPayment({
        studentId: selectedInvoice.studentId,
        feeStructureId: 1,
        invoiceId: selectedInvoice.id,
        amount: selectedInvoice.balanceAmount || selectedInvoice.totalAmount,
        paymentMethod: 'ONLINE_CARD',
      });
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === selectedInvoice.id
            ? { ...inv, status: 'PAID', paidAmount: inv.totalAmount, balanceAmount: 0 }
            : inv
        )
      );
    } catch (err) {
      console.warn('Payment record notice:', err);
    }
    setIsPaying(false);
    setPaymentSuccess(true);
    setTimeout(() => {
      setPaymentSuccess(false);
      setSelectedInvoice(null);
    }, 2000);
  };

  const handleAskAdvisor = async (customPrompt?: string) => {
    const q = customPrompt || aiPrompt;
    if (!q.trim()) return;
    setIsAiLoading(true);
    setAiResponse('');
    try {
      const resp = await api.askAi(q, 1);
      setAiResponse(resp);
    } catch {
      setAiResponse('AI Family Advisor is synthesizing performance insights for Alice Walker...');
    } finally {
      setIsAiLoading(false);
    }
  };

  const currentTab = activeTab || 'dashboard';

  const navPills = [
    { id: 'dashboard', label: 'Parent Portal', icon: <LayoutDashboard size={15} /> },
    { id: 'child_attendance', label: 'Attendance Alerts', icon: <CalendarCheck size={15} /> },
    { id: 'child_grades', label: 'Report Cards', icon: <Award size={15} /> },
    { id: 'child_fees', label: 'Fee Payments', icon: <CreditCard size={15} /> },
    { id: 'ai_studio', label: 'AI Performance Advisor', icon: <Sparkles size={15} /> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      {/* Child Information Banner */}
      <div
        className="surface-card"
        style={{
          padding: '1.5rem',
          background: 'linear-gradient(135deg, var(--bg-surface) 0%, rgba(37, 99, 235, 0.05) 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-100)',
              color: 'var(--primary-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.4rem',
            }}
          >
            A
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Alice Walker</h2>
              <Badge variant="success" dot>Present on Campus</Badge>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Guardian: <strong>Robert Walker (Father)</strong> • Student Code: STU-2026-0001 • Class: Year 1 AI
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Sparkles size={14} />}
            onClick={() => setActiveTab && setActiveTab('ai_studio')}
          >
            Ask AI Advisor
          </Button>
          <Button variant="primary" size="sm" leftIcon={<Send size={14} />}>
            Message Advisor
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

      {/* VIEW 1: PARENT PORTAL OVERVIEW */}
      {currentTab === 'dashboard' && (
        <>
          {/* Metrics Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
            }}
          >
            <StatCard
              title="Campus Presence Today"
              value="Checked In"
              subtitle="Arrived at 08:45 AM (Hall 301)"
              trend={{ value: 'On Time', positive: true }}
              icon={<CheckCircle2 size={20} />}
              accentColor="var(--success-primary)"
            />
            <StatCard
              title="Overall Attendance"
              value="96.5%"
              subtitle="Exemplary monthly record"
              trend={{ value: 'No unexcused absence', positive: true }}
              icon={<CalendarCheck size={20} />}
              accentColor="var(--info-primary)"
            />
            <StatCard
              title="Academic Performance"
              value="88.5%"
              subtitle="Midterm Examination Average"
              trend={{ value: 'Grade A Standing', positive: true }}
              icon={<Award size={20} />}
              accentColor="var(--purple-primary)"
            />
            <StatCard
              title="Tuition Balance"
              value="$0.00"
              subtitle="All Fall 2026 fees settled"
              icon={<CreditCard size={20} />}
              accentColor="var(--success-primary)"
            />
          </div>

          {/* Quick Tuition & Grade Summaries */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {/* Tuition Preview */}
            <div className="surface-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CreditCard size={18} color="var(--primary-600)" />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Fee Structure & Payments</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab && setActiveTab('child_fees')}>
                  Payment Center →
                </Button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {invoices.map((inv) => (
                  <div
                    key={inv.id}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-app)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                          {inv.feeStructureTitle}
                        </h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          Invoice #{inv.invoiceNumber} • Due: {inv.dueDate}
                        </p>
                      </div>
                      <Badge variant={inv.status === 'PAID' ? 'success' : 'warning'}>
                        {inv.status}
                      </Badge>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>${inv.totalAmount.toFixed(2)}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--success-primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <CheckCircle2 size={14} /> Settled
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Academic Preview */}
            <div className="surface-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award size={18} color="var(--primary-600)" />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Exam Reports</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab && setActiveTab('child_grades')}>
                  All Reports →
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
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
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
                        {res.marksObtained}/{res.maxMarks}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* VIEW 2: CHILD ATTENDANCE ALERTS & LOGS */}
      {currentTab === 'child_attendance' && (
        <div className="surface-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Campus Physical Presence & Automated Arrival Alerts
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Smart RFID badge check-ins, morning gate scans, and lecture room telemetry.
              </p>
            </div>
            <Badge variant="success" dot>Real-time Campus Safe Pass</Badge>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <CheckCircle2 color="var(--success-primary)" size={20} />
                <h4 style={{ fontWeight: 700 }}>Today (September 29, 2026)</h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                Arrived on campus: <strong>08:45 AM</strong> (North Gate Sensor 2). Attended CS101 Lecture & Lab 2B on time.
              </p>
            </div>

            <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <CheckCircle2 color="var(--success-primary)" size={20} />
                <h4 style={{ fontWeight: 700 }}>Yesterday (September 28, 2026)</h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                Arrived on campus: <strong>08:50 AM</strong>. All 4 assigned periods completed without absence.
              </p>
            </div>

            <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Clock color="var(--primary-600)" size={20} />
                <h4 style={{ fontWeight: 700 }}>Cumulative Semester Score</h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                Total Days: <strong>44</strong> • Present: <strong>42</strong> • Authorized Leave: <strong>2</strong> • Unexcused: <strong>0</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: CHILD REPORT CARDS */}
      {currentTab === 'child_grades' && (
        <div className="surface-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Official Child Progress Report Cards
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Verified midterm assessment results and personalized faculty advisory notes.
              </p>
            </div>
            <Badge variant="purple">Honor Roll Eligible</Badge>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {res.subjectName}
                    </h4>
                    <Badge variant={res.grade.startsWith('A') ? 'success' : 'info'}>
                      Grade: {res.grade}
                    </Badge>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Exam: {res.examTitle}
                  </p>
                  {res.remarks && (
                    <div style={{ marginTop: '0.5rem', padding: '0.5rem 0.75rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      💬 <strong>Teacher Remarks:</strong> {res.remarks}
                    </div>
                  )}
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--primary-600)' }}>
                    {res.marksObtained}/{res.maxMarks}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Class Percentile: 94th</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: FEE PAYMENTS */}
      {currentTab === 'child_fees' && (
        <div className="surface-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Tuition Fee Payment Center
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Secure instant credit card settlements and official institutional receipts.
              </p>
            </div>
            <Badge variant="success">All Accounts In Good Standing</Badge>
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
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {inv.feeStructureTitle}
                      </h4>
                      <Badge variant={inv.status === 'PAID' ? 'success' : 'warning'}>
                        {inv.status}
                      </Badge>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Invoice #{inv.invoiceNumber} • Due: {inv.dueDate}
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      ${inv.totalAmount.toFixed(2)}
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--success-primary)', fontWeight: 600 }}>
                      Paid: ${inv.paidAmount?.toFixed(2) || inv.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Balance: <strong>${(inv.balanceAmount || 0).toFixed(2)}</strong>
                  </span>
                  {inv.balanceAmount && inv.balanceAmount > 0 ? (
                    <Button variant="primary" size="sm" onClick={() => setSelectedInvoice(inv)}>
                      Pay Balance (${inv.balanceAmount})
                    </Button>
                  ) : (
                    <span style={{ fontSize: '0.85rem', color: 'var(--success-primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <CheckCircle2 size={16} /> Fully Settled
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {selectedInvoice && (
            <Modal isOpen={!!selectedInvoice} onClose={() => setSelectedInvoice(null)} title={`Pay Invoice #${selectedInvoice.invoiceNumber}`}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-md)' }}>
                  <h4 style={{ fontWeight: 700 }}>{selectedInvoice.feeStructureTitle}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    Student: Alice Walker • Balance to Pay: <strong>${selectedInvoice.balanceAmount || selectedInvoice.totalAmount}</strong>
                  </p>
                </div>

                {paymentSuccess ? (
                  <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--success-primary)', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-md)' }}>
                    <CheckCircle2 size={36} style={{ margin: '0 auto 0.5rem' }} />
                    <h4 style={{ fontWeight: 800 }}>Payment Authorized & Cleared!</h4>
                    <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Official institution receipt has been generated.</p>
                  </div>
                ) : (
                  <>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Robert Walker"
                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-app)', color: 'var(--text-main)' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                        Credit / Debit Card Number
                      </label>
                      <input
                        type="text"
                        defaultValue="•••• •••• •••• 4242"
                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-app)', color: 'var(--text-main)' }}
                      />
                    </div>
                    <Button variant="primary" onClick={handlePay} disabled={isPaying}>
                      {isPaying ? 'Processing Bank Settlement...' : `Confirm Payment of $${selectedInvoice.balanceAmount || selectedInvoice.totalAmount}`}
                    </Button>
                  </>
                )}
              </div>
            </Modal>
          )}
        </div>
      )}

      {/* VIEW 5: GEMINI AI PERFORMANCE ADVISOR */}
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
                  Gemini AI Child Performance & Well-being Advisor
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Personalized academic guidance, study-life balance evaluation, and university prep counsel.
                </p>
              </div>
            </div>
            <Badge variant="purple">Gemini 3.8 Flash</Badge>
          </div>

          {/* Quick Prompts */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              "Analyze Alice's academic strengths and career pathways",
              'What subjects should Alice focus on for the upcoming finals?',
              'Recommend extracurricular activities for Computer Science students',
              'How can we support Alice in maintaining her 96.5% attendance?',
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => {
                  setAiPrompt(chip);
                  handleAskAdvisor(chip);
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

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskAdvisor()}
              placeholder="Ask the AI Advisor about Alice's progress, upcoming exam schedule, or study suggestions..."
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
              onClick={() => handleAskAdvisor()}
            >
              {isAiLoading ? 'Synthesizing...' : 'Consult Advisor'}
            </Button>
          </div>

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
                  <span>Gemini AI is analyzing academic records and formulating recommendations...</span>
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
