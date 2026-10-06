import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  indicatorLabel?: string;
  icon: LucideIcon;
  trend?: string;
  accentColor?: 'primary' | 'secondary' | 'success' | 'warning';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  indicatorLabel = 'Observed Signal',
  icon: Icon,
  trend,
  accentColor = 'primary',
}) => {
  const accentClasses = {
    primary: 'text-primary bg-primary/10 border-primary/20',
    secondary: 'text-secondary bg-secondary/10 border-secondary/20',
    success: 'text-accent-success bg-accent-success/10 border-accent-success/20',
    warning: 'text-accent-warning bg-accent-warning/10 border-accent-warning/20',
  };

  return (
    <div className="bg-white border border-border-dark rounded-xl p-5 hover:border-border-hover transition-all duration-200 group shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono font-bold text-txt-muted uppercase tracking-wider">{title}</span>
        <div className={`p-2 rounded-lg border ${accentClasses[accentColor]} transition-transform group-hover:scale-105`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-3xl font-extrabold text-txt-primary tracking-tight font-display">{value}</span>
        {trend && (
          <span className="text-xs font-bold text-accent-success bg-accent-success/10 border border-accent-success/20 px-2 py-0.5 rounded">
            {trend}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border-dark text-xs">
        <span className="text-txt-secondary font-medium">{subtitle}</span>
        <span className="text-[11px] font-mono text-txt-muted">{indicatorLabel}</span>
      </div>
    </div>
  );
};
