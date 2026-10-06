import React from 'react';
import type { SkillCategoryGroup } from '../../types/developer';
import { Badge } from '../common/Badge';

interface SkillGroupCardProps {
  group: SkillCategoryGroup;
}

export const SkillGroupCard: React.FC<SkillGroupCardProps> = ({ group }) => {
  const statusVariant = {
    Strong: 'success',
    Developing: 'warning',
    Recommended: 'secondary',
  } as const;

  return (
    <div className="bg-bg-surface border border-border-dark rounded-xl p-5 hover:border-border-hover transition-all">
      <h3 className="text-base font-semibold text-txt-primary mb-4 pb-2 border-b border-border-dark flex items-center justify-between">
        <span>{group.category}</span>
        <span className="text-xs font-normal text-txt-muted">{group.skills.length} Observed Skills</span>
      </h3>

      <div className="space-y-4">
        {group.skills.map((skill) => (
          <div key={skill.name}>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-txt-primary">{skill.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-txt-muted">{skill.repoCount} repos</span>
                <Badge variant={statusVariant[skill.status]} size="sm">
                  {skill.status}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 bg-bg-dark h-2 rounded-full overflow-hidden border border-border-dark/50">
                <div
                  className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-500"
                  style={{ width: `${skill.exposureLevel}%` }}
                />
              </div>
              <span className="text-xs font-mono font-medium text-txt-muted w-9 text-right">
                {skill.exposureLevel}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
