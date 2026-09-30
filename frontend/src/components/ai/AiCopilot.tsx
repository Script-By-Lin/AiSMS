import React, { useState, useRef, useEffect } from 'react';
import { api } from '../../services/api';
import { Sparkles, Send, X, Bot, User, Loader2, ArrowRight } from 'lucide-react';

export const AiCopilot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: 'Hello! I am your EduPulse AI Copilot powered by Google Gemini. How can I assist you today? You can ask about student attendance, performance trends, tuition fee forecasts, or class scheduling.',
      time: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg = { sender: 'user' as const, text: query, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.askAi(query);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: response,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Sorry, I encountered a temporary connection issue reaching the Gemini AI service. Please verify server connectivity.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'Check student attendance risk',
    'Summarize Fall 2026 tuition status',
    'Identify students needing academic support',
    'Generate parent progress summary',
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="pulse-glow"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            height: '52px',
            padding: '0 1.25rem',
            borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(135deg, var(--primary-600) 0%, #7c3aed 100%)',
            color: '#ffffff',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(124, 58, 237, 0.4)',
            zIndex: 100,
            transition: 'transform var(--transition-fast)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Sparkles size={20} />
          <span>Ask AI Copilot</span>
        </button>
      )}

      {/* Slide-over AI Chat Drawer */}
      {isOpen && (
        <div
          className="glass-panel animate-fade-in"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '420px',
            maxWidth: 'calc(100vw - 48px)',
            height: '620px',
            maxHeight: 'calc(100vh - 48px)',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 101,
            overflow: 'hidden',
            border: '1px solid var(--border-subtle)',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '1rem 1.25rem',
              background: 'linear-gradient(135deg, var(--primary-600) 0%, #7c3aed 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Bot size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                  Gemini AI Copilot
                </h4>
                <p style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                  Intelligent Student & Campus Assistant
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                padding: '0.25rem',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Feed */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
              backgroundColor: 'var(--bg-app)',
            }}
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  gap: '0.65rem',
                  alignItems: 'flex-start',
                  justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                {m.sender === 'ai' && (
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-100)',
                      color: 'var(--primary-700)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    <Bot size={15} />
                  </div>
                )}

                <div
                  style={{
                    maxWidth: '82%',
                    padding: '0.75rem 0.95rem',
                    borderRadius: 'var(--radius-lg)',
                    fontSize: '0.85rem',
                    lineHeight: 1.45,
                    backgroundColor: m.sender === 'user' ? 'var(--primary-600)' : 'var(--bg-surface)',
                    color: m.sender === 'user' ? '#ffffff' : 'var(--text-main)',
                    boxShadow: 'var(--card-shadow)',
                    border: m.sender === 'ai' ? '1px solid var(--border-subtle)' : 'none',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {m.text}
                  <div
                    style={{
                      fontSize: '0.65rem',
                      marginTop: '0.35rem',
                      textAlign: 'right',
                      opacity: 0.7,
                    }}
                  >
                    {m.time}
                  </div>
                </div>

                {m.sender === 'user' && (
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--slate-800)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    <User size={15} />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                <Bot size={16} />
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Loader2 size={14} className="animate-spin" /> Gemini AI analyzing campus data...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Suggestion Chips */}
          <div
            style={{
              padding: '0.5rem 0.75rem',
              backgroundColor: 'var(--bg-surface)',
              borderTop: '1px solid var(--border-subtle)',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              display: 'flex',
              gap: '0.4rem',
            }}
          >
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                style={{
                  padding: '0.25rem 0.6rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--slate-50)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  flexShrink: 0,
                  transition: 'background var(--transition-fast)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-50)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--slate-50)')}
              >
                <span>{prompt}</span>
                <ArrowRight size={10} />
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--bg-surface)',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              gap: '0.5rem',
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything or request AI insights..."
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '0.55rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-600)',
                color: '#ffffff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: !input.trim() || isLoading ? 'not-allowed' : 'pointer',
                opacity: !input.trim() || isLoading ? 0.5 : 1,
                transition: 'background var(--transition-fast)',
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
