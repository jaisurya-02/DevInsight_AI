import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Code2,
  Calendar,
  Users,
  Flame,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { MetricCard } from '../components/cards/MetricCard';
import { ActivityChart } from '../components/charts/ActivityChart';
import { ContributionHeatmap } from '../components/charts/ContributionHeatmap';
import { LanguageDonutChart } from '../components/charts/LanguageDonutChart';
import { RolePredictionCard } from '../components/cards/RolePredictionCard';
import { RepoCard } from '../components/repositories/RepoCard';
import { getDeveloperInsights } from '../services/api';
import type { CompleteDeveloperInsights } from '../types/developer';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<CompleteDeveloperInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getDeveloperInsights().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return (
      <DashboardLayout>
        <LoadingSpinner label="Loading developer intelligence metrics..." size="lg" />
      </DashboardLayout>
    );
  }

  const { profile, stats } = {
    profile: data.profile,
    stats: data.profile.stats,
  };

  return (
    <DashboardLayout profile={profile} onRefresh={() => setLoading(true)}>
      <div className="space-y-8">
        {/* Key Metric Indicators Row */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <MetricCard
            title="Public Repositories"
            value={stats.publicRepos}
            trend={stats.publicReposTrend}
            subtitle="Inspected active projects"
            indicatorLabel="Repo Count"
            icon={Code2}
            accentColor="primary"
          />
          <MetricCard
            title="Technology Exposure"
            value={`${stats.techExposureCount} Techs`}
            subtitle="Detected across projects"
            indicatorLabel="Diversity Index"
            icon={Layers}
            accentColor="secondary"
          />
          <MetricCard
            title="Active Days"
            value={stats.activeDaysThisYear}
            subtitle="Contributions this year"
            indicatorLabel="Consistency Signal"
            icon={Calendar}
            accentColor="success"
          />
          <MetricCard
            title="Collaboration Activity"
            value={`${stats.collaborationIndex}`}
            subtitle="PRs, issues & reviews"
            indicatorLabel="Collaboration Index"
            icon={Users}
            accentColor="warning"
          />
          <MetricCard
            title="Open Source Activity"
            value={`${stats.openSourceIndicator}`}
            subtitle="Public repository commits"
            indicatorLabel="Activity Indicator"
            icon={Flame}
            accentColor="primary"
          />
        </section>

        {/* Development Activity Overview Chart */}
        <section>
          <ActivityChart data={data.monthlyActivity} />
        </section>

        {/* Contribution Heatmap */}
        <section>
          <ContributionHeatmap days={data.heatmapData} />
        </section>

        {/* Major Grid: Technology Intelligence + Role Prediction */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (2 cols): Technology Exposure & Languages */}
          <div className="lg:col-span-2 space-y-8">
            {/* Technology Exposure Horizontal Bars */}
            <div className="bg-white border border-border-dark rounded-xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-txt-primary font-display">Technology Exposure</h3>
                  <p className="text-xs text-txt-muted">Detected languages, frameworks, databases, and DevOps tools</p>
                </div>
                <button
                  onClick={() => navigate('/skills')}
                  className="text-xs text-primary hover:underline font-bold flex items-center gap-1 font-mono"
                >
                  View All Skills <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-4">
                {data.technologies.slice(0, 6).map((tech) => (
                  <div key={tech.name}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-txt-primary">{tech.name}</span>
                        <span className="text-[11px] font-mono font-medium px-2 py-0.2 rounded bg-bg-elevated text-txt-secondary border border-border-dark">
                          {tech.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-txt-muted text-[11px] font-mono">
                        <span>{tech.repoCount} repos</span>
                        <span className="font-bold text-txt-primary">{tech.usagePercentage}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-bg-elevated h-2 rounded-full overflow-hidden border border-border-dark">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${tech.usagePercentage}%`, backgroundColor: tech.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Language Distribution & Collaboration Network Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <LanguageDonutChart languages={data.languages} />

              {/* Collaboration Activity Summary */}
              <div className="bg-white border border-border-dark rounded-xl p-6 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-bold text-txt-primary font-display">Collaboration Overview</h3>
                    <Users className="w-4 h-4 text-secondary" />
                  </div>
                  <div className="space-y-3 mb-4 text-xs font-medium">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-bg-elevated border border-border-dark">
                      <span className="text-txt-secondary">Pull Requests Merged</span>
                      <span className="font-mono font-bold text-txt-primary">{data.collaboration.pullRequests}</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-bg-elevated border border-border-dark">
                      <span className="text-txt-secondary">Issues Opened / Resolved</span>
                      <span className="font-mono font-bold text-txt-primary">
                        {data.collaboration.issuesOpened} / {data.collaboration.issuesResolved}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-bg-elevated border border-border-dark">
                      <span className="text-txt-secondary">External Repository PRs</span>
                      <span className="font-mono font-bold text-accent-success">{data.collaboration.externalPRs}</span>
                    </div>
                  </div>
                </div>

                {/* Network-style visual representation */}
                <div className="bg-bg-elevated border border-border-dark p-3 rounded-xl text-[11px] font-mono text-txt-secondary">
                  <span className="text-primary font-bold">@alexjohnson</span>
                  <div className="pl-3 border-l border-border-dark mt-1 space-y-0.5">
                    <div>├── SmartAisle (@sarah-m, @dave-k)</div>
                    <div>└── DevPulse-Analytics (@open-source-bot)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (1 col): Role Prediction Card & Featured Repos */}
          <div className="space-y-8">
            <RolePredictionCard data={data.rolePrediction} />

            {/* Featured Repos Preview */}
            <div className="bg-white border border-border-dark rounded-xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-txt-primary font-display">Featured Repositories</h3>
                <button
                  onClick={() => navigate('/repositories')}
                  className="text-xs text-primary hover:underline font-bold flex items-center gap-1 font-mono"
                >
                  View All ({data.repositories.length}) <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-4">
                {data.repositories.slice(0, 2).map((repo) => (
                  <RepoCard
                    key={repo.id}
                    repo={repo}
                    onSelect={() => navigate('/repositories')}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
