import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { Recommendation } from '../../types/developer';
import { Badge } from '../common/Badge';

interface RecommendationCardProps {
  item: Recommendation;
  index: number;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ item, index }) => {
  const priorityVariant = {
    High: 'danger',
    Medium: 'warning',
    Low: 'neutral',
  } as const;

  return (
    <div className="bg-white border border-border-dark rounded-xl p-5 hover:border-border-hover transition-all shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
            0{index + 1}
          </span>
          <h4 className="text-base font-bold text-txt-primary font-display">{item.skill}</h4>
        </div>
        <Badge variant={priorityVariant[item.priority]}>
          {item.priority} Priority
        </Badge>
      </div>

      <div className="space-y-3">
        <div>
          <span className="text-[11px] font-mono font-bold text-txt-muted uppercase tracking-wider block mb-1">
            Why Recommended
          </span>
          <p className="text-xs text-txt-secondary leading-relaxed bg-bg-elevated border border-border-dark p-2.5 rounded-lg font-medium">
            {item.why}
          </p>
        </div>

        <div>
          <span className="text-[11px] font-mono font-bold text-txt-muted uppercase tracking-wider block mb-1">
            Suggested Priority Action
          </span>
          <div className="flex items-start gap-2 text-xs text-txt-primary font-medium">
            <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
            <span>{item.suggestedAction}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
