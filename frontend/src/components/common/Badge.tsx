import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'neutral';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
}) => {
  const variantStyles: Record<string, { bg: string; text: string; border: string; dotColor: string }> = {
    success: { bg: 'var(--success-bg)', text: 'var(--success-text)', border: 'var(--success-border)', dotColor: 'var(--success-primary)' },
    warning: { bg: 'var(--warning-bg)', text: 'var(--warning-text)', border: 'var(--warning-border)', dotColor: 'var(--warning-primary)' },
    danger: { bg: 'var(--danger-bg)', text: 'var(--danger-text)', border: 'var(--danger-border)', dotColor: 'var(--danger-primary)' },
    info: { bg: 'var(--info-bg)', text: 'var(--info-text)', border: 'var(--info-border)', dotColor: 'var(--info-primary)' },
    purple: { bg: 'var(--purple-bg)', text: 'var(--purple-text)', border: 'var(--purple-border)', dotColor: 'var(--purple-primary)' },
    neutral: { bg: 'var(--slate-100)', text: 'var(--slate-700)', border: 'var(--slate-300)', dotColor: 'var(--slate-500)' },
  };

  const style = variantStyles[variant];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: size === 'sm' ? '0.15rem 0.5rem' : '0.25rem 0.65rem',
        fontSize: size === 'sm' ? '0.75rem' : '0.8125rem',
        fontWeight: 600,
        borderRadius: 'var(--radius-full)',
        backgroundColor: style.bg,
        color: style.text,
        border: `1px solid ${style.border}`,
        lineHeight: 1.2,
      }}
    >
      {dot && (
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: style.dotColor,
          }}
        />
      )}
      {children}
    </span>
  );
};
