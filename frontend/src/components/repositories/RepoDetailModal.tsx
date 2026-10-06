import React from 'react';
import { X, ExternalLink, Star, GitFork, Eye, Activity, FileText, Code2 } from 'lucide-react';
import type { Repository } from '../../types/developer';
import { Badge } from '../common/Badge';

interface RepoDetailModalProps {
  repo: Repository | null;
  onClose: () => void;
}

export const RepoDetailModal: React.FC<RepoDetailModalProps> = ({ repo, onClose }) => {
  if (!repo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-bg-surface border border-border-dark rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 text-txt-muted hover:text-txt-primary hover:bg-bg-elevated rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-txt-primary">{repo.name}</h3>
            <p className="text-xs text-txt-muted font-mono">{repo.fullName}</p>
          </div>
        </div>

        <p className="text-sm text-txt-secondary mt-3 mb-5 leading-relaxed">
          {repo.description}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3 mb-6 bg-bg-dark border border-border-dark p-3.5 rounded-xl text-center">
          <div>
            <span className="text-[11px] text-txt-muted uppercase block mb-1">Stars</span>
            <div className="flex items-center justify-center gap-1 text-base font-bold text-txt-primary">
              <Star className="w-4 h-4 text-accent-warning fill-accent-warning" /> {repo.stars}
            </div>
          </div>
          <div>
            <span className="text-[11px] text-txt-muted uppercase block mb-1">Forks</span>
            <div className="flex items-center justify-center gap-1 text-base font-bold text-txt-primary">
              <GitFork className="w-4 h-4 text-txt-muted" /> {repo.forks}
            </div>
          </div>
          <div>
            <span className="text-[11px] text-txt-muted uppercase block mb-1">Watchers</span>
            <div className="flex items-center justify-center gap-1 text-base font-bold text-txt-primary">
              <Eye className="w-4 h-4 text-secondary" /> {repo.watchers}
            </div>
          </div>
          <div>
            <span className="text-[11px] text-txt-muted uppercase block mb-1">Activity Score</span>
            <div className="flex items-center justify-center gap-1 text-base font-bold text-primary-light">
              <Activity className="w-4 h-4 text-primary" /> {repo.activityScore}%
            </div>
          </div>
        </div>

        {/* Primary Tech Stack */}
        <div className="mb-6">
          <h4 className="text-xs font-semibold text-txt-muted uppercase tracking-wider mb-2">
            Observed Technology Exposure
          </h4>
          <div className="flex flex-wrap gap-2">
            {repo.technologies.map((t) => (
              <Badge key={t} variant="primary" size="md">
                {t}
              </Badge>
            ))}
          </div>
        </div>

        {/* Topics */}
        {repo.topics.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-semibold text-txt-muted uppercase tracking-wider mb-2">
              GitHub Topics
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {repo.topics.map((tp) => (
                <span key={tp} className="text-xs font-mono px-2 py-0.5 rounded bg-bg-dark border border-border-dark text-txt-muted">
                  #{tp}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* README Snippet Preview */}
        {repo.readmeSnippet && (
          <div className="mb-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-txt-muted uppercase tracking-wider mb-2">
              <FileText className="w-3.5 h-3.5 text-primary-light" /> README Summary Preview
            </div>
            <div className="bg-bg-dark border border-border-dark p-4 rounded-xl font-mono text-xs text-txt-secondary leading-relaxed">
              {repo.readmeSnippet}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-dark">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-bg-elevated hover:bg-border-dark text-txt-secondary hover:text-txt-primary text-xs font-medium rounded-lg transition-colors"
          >
            Close
          </button>
          <a
            href={repo.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-medium rounded-lg transition-colors"
          >
            View Repository on GitHub <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
