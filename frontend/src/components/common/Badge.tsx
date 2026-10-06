import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'sm',
  className = '',
}) => {
  const baseStyle = 'inline-flex items-center font-medium rounded-full border transition-colors';
  
  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  const variantStyles = {
    primary: 'bg-primary/10 border-primary/30 text-primary-light',
    secondary: 'bg-secondary/10 border-secondary/30 text-secondary',
    success: 'bg-accent-success/10 border-accent-success/30 text-accent-success',
    warning: 'bg-accent-warning/10 border-accent-warning/30 text-accent-warning',
    danger: 'bg-accent-danger/10 border-accent-danger/30 text-accent-danger',
    neutral: 'bg-bg-elevated border-border-dark text-txt-secondary',
    outline: 'bg-transparent border-border-subtle text-txt-muted hover:text-txt-primary',
  };

  return (
    <span className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};
