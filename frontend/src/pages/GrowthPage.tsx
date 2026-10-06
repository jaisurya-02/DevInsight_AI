import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { GrowthCharts } from '../components/charts/GrowthCharts';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { getDeveloperInsights } from '../services/api';
import type { CompleteDeveloperInsights } from '../types/developer';

export const GrowthPage: React.FC = () => {
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
        <LoadingSpinner label="Loading growth analytics..." size="lg" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout profile={data.profile}>
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-bold text-txt-primary tracking-tight">
            Developer Growth Analytics
          </h2>
          <p className="text-xs text-txt-muted">
            Track repository expansion, technology adoption timeline, and open-source contribution trends
          </p>
        </div>

        {/* Technology Evolution Timeline */}
        <section className="bg-bg-surface border border-border-dark rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-base font-semibold text-txt-primary">Technology Adoption Evolution</h3>
            <p className="text-xs text-txt-muted">Historical progression of programming languages and frameworks</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            {data.growth.techEvolution.map((item, idx) => (
              <div
                key={item.year}
                className="bg-bg-dark border border-border-dark p-5 rounded-xl relative overflow-hidden group hover:border-primary/40 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold font-mono text-primary-light">{item.year}</span>
                  <span className="text-[10px] font-mono text-txt-muted uppercase bg-bg-elevated px-2 py-0.5 rounded">
                    Phase 0{idx + 1}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {item.technologies.map((t) => (
                    <span
                      key={t}
                      className="text-xs font-medium px-2.5 py-1 rounded-md bg-bg-elevated text-txt-primary border border-border-dark"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Growth Line & Bar Charts */}
        <section>
          <GrowthCharts growth={data.growth} />
        </section>
      </div>
    </DashboardLayout>
  );
};
