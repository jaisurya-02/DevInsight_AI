import React, { useState } from 'react';
import { Target, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import type { SkillGapAnalysis } from '../../types/developer';

interface SkillGapCardProps {
  skillGap: SkillGapAnalysis;
  targetRoleOptions: string[];
}

export const SkillGapCard: React.FC<SkillGapCardProps> = ({
  skillGap,
  targetRoleOptions,
}) => {
  const [selectedRole, setSelectedRole] = useState(skillGap.targetRole);

  return (
    <div className="bg-bg-surface border border-border-dark rounded-xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-secondary/10 border border-secondary/20 text-secondary">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-txt-primary">Skill Gap Analysis</h3>
            <p className="text-xs text-txt-muted">Compare observed activity against target technical role requirements</p>
          </div>
        </div>

        {/* Target Role Dropdown */}
        <div className="flex items-center gap-2 bg-bg-dark border border-border-dark px-3 py-1.5 rounded-lg text-xs self-start sm:self-auto">
          <span className="text-txt-muted font-medium">Target Role:</span>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="bg-transparent text-txt-primary font-semibold focus:outline-none cursor-pointer pr-1"
          >
            {targetRoleOptions.map((role) => (
              <option key={role} value={role} className="bg-bg-surface">
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Strong Skills */}
        <div className="bg-bg-dark/60 border border-accent-success/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3 text-accent-success font-semibold text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" /> Strong Alignment
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skillGap.strong.map((s) => (
              <span
                key={s}
                className="text-xs font-medium px-2.5 py-1 rounded-md bg-accent-success/10 text-accent-success border border-accent-success/20"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Developing Skills */}
        <div className="bg-bg-dark/60 border border-accent-warning/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3 text-accent-warning font-semibold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" /> Developing Exposure
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skillGap.developing.map((s) => (
              <span
                key={s}
                className="text-xs font-medium px-2.5 py-1 rounded-md bg-accent-warning/10 text-accent-warning border border-accent-warning/20"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Recommended Priority Gaps */}
        <div className="bg-bg-dark/60 border border-primary/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3 text-primary-light font-semibold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> Recommended Gaps
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skillGap.recommended.map((s) => (
              <span
                key={s}
                className="text-xs font-medium px-2.5 py-1 rounded-md bg-primary/10 text-primary-light border border-primary/20"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
