import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "We couldn't analyze this GitHub profile.",
  message = "The username may not exist or GitHub may be temporarily unavailable.",
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-bg-surface border border-accent-danger/20 rounded-xl text-center my-6">
      <div className="w-12 h-12 rounded-full bg-accent-danger/10 flex items-center justify-center text-accent-danger mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-txt-primary mb-2">{title}</h3>
      <p className="text-sm text-txt-secondary max-w-md mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-bg-elevated hover:bg-border-dark border border-border-dark text-txt-primary text-sm font-medium rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4 text-primary-light" />
          Try Again
        </button>
      )}
    </div>
  );
};
