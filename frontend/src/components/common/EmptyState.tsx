import React from 'react';
import { FolderX } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-bg-surface border border-border-dark rounded-xl text-center my-4">
      <div className="w-12 h-12 rounded-full bg-bg-elevated flex items-center justify-center text-txt-muted mb-4">
        <FolderX className="w-6 h-6 text-txt-muted" />
      </div>
      <h3 className="text-lg font-semibold text-txt-primary mb-1">{title}</h3>
      <p className="text-sm text-txt-secondary max-w-md mb-6">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
