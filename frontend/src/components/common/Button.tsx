import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  style,
  ...props
}) => {
  const sizeStyles: Record<string, { padding: string; fontSize: string; height: string }> = {
    sm: { padding: '0 0.75rem', fontSize: '0.8125rem', height: '32px' },
    md: { padding: '0 1rem', fontSize: '0.875rem', height: '40px' },
    lg: { padding: '0 1.5rem', fontSize: '1rem', height: '48px' },
  };

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--primary-600)',
          color: '#ffffff',
          border: '1px solid var(--primary-600)',
          boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)',
        };
      case 'secondary':
        return {
          backgroundColor: 'var(--slate-100)',
          color: 'var(--slate-800)',
          border: '1px solid var(--border-subtle)',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: 'var(--text-main)',
          border: '1px solid var(--border-subtle)',
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: 'var(--text-secondary)',
          border: '1px solid transparent',
        };
      case 'danger':
        return {
          backgroundColor: 'var(--danger-primary)',
          color: '#ffffff',
          border: '1px solid var(--danger-primary)',
        };
      case 'success':
        return {
          backgroundColor: 'var(--success-primary)',
          color: '#ffffff',
          border: '1px solid var(--success-primary)',
        };
      default:
        return {};
    }
  };

  return (
    <button
      disabled={disabled || isLoading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.45rem',
        fontWeight: 600,
        borderRadius: 'var(--radius-md)',
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all var(--transition-fast)',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        ...sizeStyles[size],
        ...getVariantStyles(),
        ...style,
      }}
      {...props}
    >
      {isLoading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        leftIcon && <span style={{ display: 'inline-flex' }}>{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span style={{ display: 'inline-flex' }}>{rightIcon}</span>}
    </button>
  );
};
