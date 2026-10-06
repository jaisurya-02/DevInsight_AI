import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { SkillGroupCard } from '../components/skills/SkillGroupCard';
import { SkillGapCard } from '../components/skills/SkillGapCard';
import { RecommendationCard } from '../components/cards/RecommendationCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { getDeveloperInsights } from '../services/api';
import type { CompleteDeveloperInsights } from '../types/developer';

export const SkillsPage: React.FC = () => {
  const [data, setData] = useState<CompleteDeveloperInsights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDeveloperInsights().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return (
      <DashboardLayout>
        <LoadingSpinner label="Loading skill intelligence..." size="lg" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout profile={data.profile}>
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-bold text-txt-primary tracking-tight">
            Skill Intelligence & Gap Analysis
          </h2>
          <p className="text-xs text-txt-muted">
            Observed technologies, target role alignment, and personalized learning recommendations
          </p>
        </div>

        {/* Skill Gap Analysis Section */}
        <section>
          <SkillGapCard
            skillGap={data.skillGap}
            targetRoleOptions={data.targetRoleOptions}
          />
        </section>

        {/* Recommended Next Skills Cards */}
        <section>
          <div className="mb-4">
            <h3 className="text-base font-semibold text-txt-primary">Recommended Next Skills</h3>
            <p className="text-xs text-txt-muted">
              Prioritized learning suggestions based on observed projects and target role requirements
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.recommendations.map((rec, index) => (
              <RecommendationCard key={rec.id} item={rec} index={index} />
            ))}
          </div>
        </section>

        {/* Observed Skills Category Groups */}
        <section>
          <div className="mb-4">
            <h3 className="text-base font-semibold text-txt-primary">Observed Skills Breakdown</h3>
            <p className="text-xs text-txt-muted">
              Technology exposure grouped by functional domain
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.skillGroups.map((group) => (
              <SkillGroupCard key={group.category} group={group} />
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};
