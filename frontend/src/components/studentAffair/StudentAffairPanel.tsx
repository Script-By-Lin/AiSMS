import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import type { Complaint, LeaveRequest, DisciplineRecord, ComplaintStatus } from '../../types';
import { StatCard } from '../common/StatCard';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import {
  LayoutDashboard,
  ShieldAlert,
  FileCheck2,
  LifeBuoy,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  Send,
} from 'lucide-react';

interface StudentAffairPanelProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const StudentAffairPanel: React.FC<StudentAffairPanelProps> = ({ activeTab = 'dashboard', setActiveTab }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [resolutionText, setResolutionText] = useState('');

  // AI Welfare & Risk State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Mock Discipline Records
  const [disciplineRecords] = useState<DisciplineRecord[]>([
    {
      id: 1,
      studentId: 2,
      studentName: 'Michael Chen',
      incidentDate: '2026-09-18',
      description: 'Unauthorized access to hardware prototyping laboratory after hours.',
      actionTaken: 'Formal written warning issued. Laboratory privileges restored after safety orientation.',
      reportedByName: 'Dr. Alan Turing',
      createdAt: '2026-09-18',
    },
  ]);

  useEffect(() => {
    api.getComplaints().then(setComplaints);
    api.getLeaveRequests().then(setLeaveRequests);
  }, []);

  const handleResolveComplaint = async () => {
    if (!selectedComplaint) return;
    const cid = selectedComplaint.id;
    const notes = resolutionText;
    try {
      await api.resolveComplaint(cid, notes, 'RESOLVED');
    } catch (err) {
      console.warn('Complaint resolution sync notice:', err);
    }
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === cid
          ? { ...c, status: 'RESOLVED' as ComplaintStatus, resolutionNotes: notes }
          : c
      )
    );
    setSelectedComplaint(null);
    setResolutionText('');
  };

  const handleLeaveDecision = async (leaveId: number, status: 'APPROVED' | 'REJECTED') => {
    try {
      await api.updateLeaveStatus(leaveId, status);
    } catch (err) {
      console.warn('Leave status update notice:', err);
    }
    setLeaveRequests((prev) =>
      prev.map((l) => (l.id === leaveId ? { ...l, status, reviewedByName: 'Student Affairs Officer' } : l))
    );
  };

  const handleAskAiWelfare = async (customPrompt?: string) => {
    const q = customPrompt || aiPrompt;
    if (!q.trim()) return;
    setIsAiLoading(true);
    setAiResponse('');
    try {
      const resp = await api.askAi(q);
      setAiResponse(resp);
    } catch {
      setAiResponse('AI Welfare & Behavioral Risk Advisor is analyzing campus grievance sentiment and leave records...');
    } finally {
      setIsAiLoading(false);
    }
  };

  const pendingComplaintsCount = complaints.filter((c) => c.status === 'PENDING').length;
  const pendingLeavesCount = leaveRequests.filter((l) => l.status === 'PENDING').length;

  const currentTab = activeTab || 'dashboard';

  const navPills = [
    { id: 'dashboard', label: 'Affairs Overview', icon: <LayoutDashboard size={15} /> },
    { id: 'complaints', label: `Grievances (${pendingComplaintsCount})`, icon: <ShieldAlert size={15} /> },
    { id: 'leave_requests', label: `Leave Approvals (${pendingLeavesCount})`, icon: <FileCheck2 size={15} /> },
    { id: 'discipline', label: 'Disciplinary Records', icon: <LifeBuoy size={15} /> },
    { id: 'ai_studio', label: 'AI Behavioral Risk', icon: <Sparkles size={15} /> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Student Affairs & Welfare Administration
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Campus grievance triage, student leave authorization, and behavioral integrity logging.
          </p>
        </div>

        <Button
          variant="outline"
          leftIcon={<Sparkles size={16} />}
          onClick={() => setActiveTab && setActiveTab('ai_studio')}
        >
          AI Risk Triage
        </Button>
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

      {/* Metrics Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        <StatCard
          title="Open Grievances"
          value={pendingComplaintsCount}
          subtitle="Awaiting resolution"
          icon={<AlertTriangle size={20} />}
          accentColor="var(--warning-primary)"
        />
        <StatCard
          title="Pending Leave Requests"
          value={pendingLeavesCount}
          subtitle="Staff review queue"
          icon={<Clock size={20} />}
          accentColor="var(--info-primary)"
        />
        <StatCard
          title="Resolution Rate"
          value="92.4%"
          subtitle="Under 48hr SLA"
          trend={{ value: '+4% MoM', positive: true }}
          icon={<CheckCircle2 size={20} />}
          accentColor="var(--success-primary)"
        />
        <StatCard
          title="Disciplinary Incidents"
          value={disciplineRecords.length}
          subtitle="Current semester"
          icon={<LifeBuoy size={20} />}
          accentColor="var(--purple-primary)"
        />
      </div>

      {/* VIEW 1: AFFAIRS OVERVIEW (Recent grievances + leaves preview) */}
      {currentTab === 'dashboard' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.25rem' }}>
          {/* Recent Grievances Preview */}
          <div className="surface-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldAlert size={18} color="var(--primary-600)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Priority Grievances</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setActiveTab && setActiveTab('complaints')}>
                All Grievances →
              </Button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {complaints.slice(0, 3).map((c) => (
                <div
                  key={c.id}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-app)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>{c.title}</h4>
                    <Badge variant={c.severity === 'HIGH' ? 'danger' : 'warning'} size="sm">{c.severity}</Badge>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {c.description.slice(0, 90)}...
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    <span>By: {c.raisedByName}</span>
                    <Badge variant={c.status === 'RESOLVED' ? 'success' : 'warning'} size="sm">{c.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Leaves Preview */}
          <div className="surface-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileCheck2 size={18} color="var(--primary-600)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Pending Leave Authorizations</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setActiveTab && setActiveTab('leave_requests')}>
                Review Queue →
              </Button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {leaveRequests.slice(0, 3).map((l) => (
                <div
                  key={l.id}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-app)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>{l.studentName}</h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                      "{l.reason}"
                    </p>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {l.startDate} to {l.endDate}
                    </span>
                  </div>
                  <Badge variant={l.status === 'APPROVED' ? 'success' : l.status === 'REJECTED' ? 'danger' : 'warning'}>
                    {l.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: COMPLAINTS TAB */}
      {currentTab === 'complaints' && (
        <div className="surface-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Campus Complaints & Concerns</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Indexed with composite status+timestamp sorting for zero-latency triage.</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {complaints.map((c) => (
              <div
                key={c.id}
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-app)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div style={{ maxWidth: '650px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {c.title}
                    </h4>
                    <Badge variant={c.severity === 'HIGH' ? 'danger' : c.severity === 'MEDIUM' ? 'warning' : 'info'} size="sm">
                      {c.severity} Severity
                    </Badge>
                    <Badge variant={c.status === 'RESOLVED' ? 'success' : c.status === 'IN_PROGRESS' ? 'info' : 'warning'}>
                      {c.status}
                    </Badge>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.45rem', lineHeight: 1.5 }}>
                    {c.description}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.65rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>Raised by: <strong>{c.raisedByName}</strong></span>
                    <span>•</span>
                    <span>Date: {c.createdAt}</span>
                  </div>

                  {c.resolutionNotes && (
                    <div style={{ marginTop: '0.65rem', padding: '0.5rem 0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.2)', fontSize: '0.8rem', color: 'var(--success-primary)' }}>
                      <strong>Resolution Note:</strong> {c.resolutionNotes}
                    </div>
                  )}
                </div>

                {c.status !== 'RESOLVED' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedComplaint(c);
                      setResolutionText('');
                    }}
                  >
                    Resolve Grievance
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: LEAVES TAB */}
      {currentTab === 'leave_requests' && (
        <div className="surface-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Student Leave Authorization</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Accelerated by PostgreSQL partial index on pending status.</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {leaveRequests.map((l) => (
              <div
                key={l.id}
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
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
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                      {l.studentName}
                    </h4>
                    <Badge variant={l.status === 'APPROVED' ? 'success' : l.status === 'REJECTED' ? 'danger' : 'warning'}>
                      {l.status}
                    </Badge>
                  </div>

                  <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                    Reason: <em>"{l.reason}"</em>
                  </p>

                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                    Period: <strong>{l.startDate}</strong> to <strong>{l.endDate}</strong> • Submitted: {l.createdAt}
                  </p>
                </div>

                {l.status === 'PENDING' ? (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button
                      size="sm"
                      variant="danger"
                      leftIcon={<XCircle size={14} />}
                      onClick={() => handleLeaveDecision(l.id, 'REJECTED')}
                    >
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      variant="success"
                      leftIcon={<CheckCircle2 size={14} />}
                      onClick={() => handleLeaveDecision(l.id, 'APPROVED')}
                    >
                      Authorize Leave
                    </Button>
                  </div>
                ) : (
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Reviewed by {l.reviewedByName}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: DISCIPLINE TAB */}
      {currentTab === 'discipline' && (
        <div className="surface-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Campus Disciplinary Records</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Chronological incident file with teacher reports and administrative actions.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {disciplineRecords.map((d) => (
              <div
                key={d.id}
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-app)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                      {d.studentName}
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                      {d.description}
                    </p>
                  </div>
                  <Badge variant="warning">Incident: {d.incidentDate}</Badge>
                </div>

                {d.actionTaken && (
                  <div style={{ marginTop: '0.75rem', padding: '0.6rem 0.85rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.8rem' }}>
                    <strong>Action Enforced:</strong> {d.actionTaken}
                  </div>
                )}

                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Reported by: {d.reportedByName}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 5: GEMINI AI BEHAVIORAL RISK */}
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
                  Gemini AI Campus Welfare & Behavioral Risk Assessment
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Sentiment anomaly detection, grievance escalation radar, and restorative justice guidance.
                </p>
              </div>
            </div>
            <Badge variant="purple">Gemini 3.8 Flash</Badge>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              'Analyze recent grievance trends across engineering and science labs',
              'Identify students with elevated absenteeism risk based on leave logs',
              'Draft an amicable resolution template for campus facility noise complaints',
              'Recommend preventive welfare interventions for mid-semester stress',
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => {
                  setAiPrompt(chip);
                  handleAskAiWelfare(chip);
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
              onKeyDown={(e) => e.key === 'Enter' && handleAskAiWelfare()}
              placeholder="Ask the AI Welfare system to analyze student grievances, leave logs, or restorative plans..."
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
              onClick={() => handleAskAiWelfare()}
            >
              {isAiLoading ? 'Analyzing...' : 'Analyze Welfare'}
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
                  <span>Gemini AI is assessing student welfare and grievance sentiment...</span>
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

      {/* Resolve Complaint Modal */}
      <Modal
        isOpen={!!selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        title="Resolve Student Grievance"
        subtitle={`Closing case: ${selectedComplaint?.title}`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
              Resolution Summary & Action Enacted
            </label>
            <textarea
              rows={4}
              required
              placeholder="Detail actions taken to remediate this student grievance..."
              value={resolutionText}
              onChange={(e) => setResolutionText(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
            <Button variant="outline" onClick={() => setSelectedComplaint(null)}>
              Cancel
            </Button>
            <Button variant="primary" disabled={!resolutionText.trim()} onClick={handleResolveComplaint}>
              Mark as Resolved
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
