import React, { useState } from 'react';
import { Cpu, ChevronDown, ChevronUp, Sparkles, HelpCircle } from 'lucide-react';
import type { RolePredictionDetail } from '../../types/developer';
import { Badge } from '../common/Badge';

interface RolePredictionCardProps {
  data: RolePredictionDetail;
}

export const RolePredictionCard: React.FC<RolePredictionCardProps> = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white border border-border-dark rounded-xl p-6 hover:border-border-hover transition-all shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-txt-primary font-display">Model-Predicted Role</h3>
            <p className="text-xs text-txt-muted">Machine learning classification signal</p>
          </div>
        </div>
        <Badge variant="primary" size="md">
          Predicted
        </Badge>
      </div>

      <div className="mb-5 bg-bg-elevated border border-border-dark p-4 rounded-xl">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-xl font-bold text-txt-primary font-display tracking-tight">{data.predictedRole}</span>
          <span className="text-sm font-bold text-primary font-mono">
            {Math.round(data.confidence * 100)}% confidence
          </span>
        </div>
        <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-border-dark">
          <div
            className="bg-primary h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.round(data.confidence * 100)}%` }}
          />
        </div>
      </div>

      {/* Secondary Possibilities */}
      <div className="mb-4">
        <span className="text-xs font-mono font-bold text-txt-muted uppercase tracking-wider block mb-2">
          Alternative Indicators
        </span>
        <div className="space-y-2">
          {data.secondaryRoles.map((item) => (
            <div key={item.role} className="flex items-center justify-between text-xs">
              <span className="text-txt-secondary font-medium">{item.role}</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-bg-elevated h-1.5 rounded-full overflow-hidden border border-border-dark">
                  <div
                    className="bg-txt-muted h-full rounded-full"
                    style={{ width: `${Math.round(item.confidence * 100)}%` }}
                  />
                </div>
                <span className="text-txt-muted font-mono w-8 text-right font-semibold">
                  {Math.round(item.confidence * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expandable "Why?" Section */}
      <div className="border-t border-border-dark pt-3 mt-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-xs font-semibold text-primary hover:text-primary-hover transition-colors py-1"
        >
          <span className="flex items-center gap-1.5 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-secondary" />
            Why this prediction? (Contributing Signals)
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {isExpanded && (
          <div className="mt-3 space-y-2 bg-bg-elevated border border-border-dark p-3.5 rounded-xl animate-fadeIn">
            {data.whySignals.map((signal, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-txt-secondary font-medium">
                <span className="text-accent-success font-bold font-mono">+</span>
                <span>{signal}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Responsible AI Disclaimer */}
      <div className="mt-4 pt-3 border-t border-border-dark flex items-start gap-2 text-[11px] text-txt-muted">
        <HelpCircle className="w-3.5 h-3.5 shrink-0 text-txt-muted mt-0.5" />
        <p>{data.disclaimer}</p>
      </div>
    </div>
  );
};
