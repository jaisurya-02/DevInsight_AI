import React, { useState } from 'react';
import { Menu, X, RefreshCw, Share2, Calendar } from 'lucide-react';
import { Sidebar } from '../navigation/Sidebar';
import type { DeveloperProfile } from '../../types/developer';

interface DashboardLayoutProps {
  children: React.ReactNode;
  profile?: DeveloperProfile;
  onRefresh?: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  profile,
  onRefresh,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col md:flex-row text-txt-primary">
      {/* Sidebar for Desktop */}
      <div className="hidden md:block">
        <Sidebar profile={profile} />
      </div>

      {/* Mobile Drawer Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-bg-surface border-b border-border-dark sticky top-0 z-30">
        <span className="font-bold text-base text-txt-primary">
          DevInsight <span className="text-primary">AI</span>
        </span>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-txt-muted hover:text-txt-primary rounded-lg bg-bg-dark border border-border-dark"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/70 flex">
          <div className="w-64 bg-bg-surface h-full">
            <Sidebar profile={profile} />
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header Banner for Dashboard Views */}
        {profile && (
          <header className="bg-bg-surface/50 border-b border-border-dark px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-11 h-11 rounded-xl border border-border-dark object-cover shadow-sm"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-txt-primary">{profile.name}</h1>
                  <span className="text-xs font-mono text-txt-muted">@{profile.username}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-txt-secondary">
                  <span className="font-semibold text-primary-light">{profile.predictedRole}</span>
                  <span className="text-txt-muted">• Analyzed from public GitHub activity</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-txt-muted bg-bg-dark border border-border-dark px-3 py-1.5 rounded-lg">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span>Last analyzed: {profile.lastAnalyzed}</span>
              </div>

              <button
                onClick={onRefresh}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-bg-elevated hover:bg-border-dark border border-border-dark text-txt-primary text-xs font-medium rounded-lg transition-colors"
                title="Refresh Analysis"
              >
                <RefreshCw className="w-3.5 h-3.5 text-primary-light" />
                <span>Refresh</span>
              </button>

              <button
                onClick={() => alert('Report link copied to clipboard!')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary-light text-xs font-medium rounded-lg transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Report</span>
              </button>
            </div>
          </header>
        )}

        {/* Page Content */}
        <div className="p-6 md:p-8 max-w-7xl w-full mx-auto flex-1">{children}</div>
      </main>
    </div>
  );
};
