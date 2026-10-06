import React from 'react';
import { Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-bg-surface border-t border-border-dark py-12 mt-20 text-xs text-txt-muted">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center text-primary">
            <Cpu className="w-4 h-4" />
          </div>
          <span className="font-semibold text-txt-primary">DevInsight AI</span>
          <span>© 2026 Developer Intelligence Platform</span>
        </div>

        <p className="text-center md:text-right max-w-md text-[11px] leading-relaxed">
          DevInsight AI calculates transparent activity indicators and machine learning signals from public GitHub activity. It does not measure human intelligence or professional worth.
        </p>
      </div>
    </footer>
  );
};
