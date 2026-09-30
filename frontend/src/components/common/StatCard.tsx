import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
  accentColor?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  accentColor = 'var(--primary-600)',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="surface-card"
      style={{
        padding: '1.25rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle top accent border */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          backgroundColor: accentColor,
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
            {title}
          </p>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            {value}
          </h3>
        </div>

        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary-50)',
            color: accentColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
          }}
        >
          {icon}
        </div>
      </div>

      {(subtitle || trend) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.85rem', fontSize: '0.8rem' }}>
          {trend && (
            <span
              style={{
                fontWeight: 600,
                color: trend.positive ? 'var(--success-primary)' : 'var(--danger-primary)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.15rem',
              }}
            >
              {trend.positive ? '↑' : '↓'} {trend.value}
            </span>
          )}
          {subtitle && (
            <span style={{ color: 'var(--text-muted)' }}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
