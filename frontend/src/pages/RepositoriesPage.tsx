import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { RepoFilter } from '../components/repositories/RepoFilter';
import { RepoCard } from '../components/repositories/RepoCard';
import { RepoDetailModal } from '../components/repositories/RepoDetailModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { getDeveloperInsights } from '../services/api';
import type { CompleteDeveloperInsights, Repository } from '../types/developer';

export const RepositoriesPage: React.FC = () => {
  const [data, setData] = useState<CompleteDeveloperInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [sortBy, setSortBy] = useState<'stars' | 'activity' | 'updated'>('activity');
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);

  useEffect(() => {
    getDeveloperInsights().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return (
      <DashboardLayout>
        <LoadingSpinner label="Loading repository intelligence..." size="lg" />
      </DashboardLayout>
    );
  }

  // Extract unique languages across repos
  const allLanguages = Array.from(
    new Set(data.repositories.map((r) => r.primaryLanguage).filter(Boolean))
  );

  // Filter & Sort Repositories
  const filteredRepos = data.repositories
    .filter((repo) => {
      const matchesSearch =
        repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repo.topics.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesLang =
        selectedLanguage === 'All' || repo.primaryLanguage === selectedLanguage;

      return matchesSearch && matchesLang;
    })
    .sort((a, b) => {
      if (sortBy === 'stars') return b.stars - a.stars;
      if (sortBy === 'activity') return b.activityScore - a.activityScore;
      return 0; // default order
    });

  return (
    <DashboardLayout profile={data.profile}>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-txt-primary tracking-tight">
            Repository Intelligence Explorer
          </h2>
          <p className="text-xs text-txt-muted">
            Inspected public repositories, languages, documentation, and activity indicators
          </p>
        </div>

        {/* Filter Controls */}
        <RepoFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          sortBy={sortBy}
          onSortChange={setSortBy}
          languages={allLanguages}
        />

        {/* Repositories Grid */}
        {filteredRepos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRepos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} onSelect={setSelectedRepo} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No repositories found"
            description="No public repositories matched your search filter or language criteria."
            actionLabel="Reset Filters"
            onAction={() => {
              setSearchTerm('');
              setSelectedLanguage('All');
            }}
          />
        )}

        {/* Repository Detail Modal */}
        <RepoDetailModal
          repo={selectedRepo}
          onClose={() => setSelectedRepo(null)}
        />
      </div>
    </DashboardLayout>
  );
};
