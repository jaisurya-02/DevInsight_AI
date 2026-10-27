import React from 'react';
import { Star, GitFork, ExternalLink, Activity, Code2 } from 'lucide-react';
import type { Repository } from '../../types/developer';

interface RepoCardProps {
  repo: Repository;
  onSelect?: (repo: Repository) => void;
}

export const RepoCard: React.FC<RepoCardProps> = ({ repo, onSelect }) => {
  return (
    <div
      onClick={() => onSelect && onSelect(repo)}
      className="bg-bg-surface border border-border-dark rounded-xl p-5 hover:border-border-hover transition-all duration-200 cursor-pointer group flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-primary shrink-0" />
            <h4 className="text-base font-bold text-txt-primary group-hover:text-primary-light transition-colors truncate">
              {repo.name}
            </h4>
          </div>
          <a
            href={repo.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-txt-muted hover:text-txt-primary p-1 rounded-md hover:bg-bg-elevated transition-colors"
            title="View on GitHub"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <p className="text-xs text-txt-secondary line-clamp-2 mb-4 leading-relaxed">
          {repo.description || 'No description provided.'}
        </p>

        {/* Technologies Badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {repo.technologies.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="text-[11px] font-mono px-2 py-0.5 rounded bg-bg-dark border border-border-dark text-txt-secondary"
            >
              {tech}
            </span>
          ))}
          {repo.technologies.length > 4 && (
            <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-bg-dark text-txt-muted">
              +{repo.technologies.length - 4}
            </span>
          )}
        </div>
      </div>

      <div>
        {/* Activity Indicator Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-[11px] text-txt-muted mb-1 font-mono">
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-secondary" /> Activity Score
            </span>
            <span className="text-txt-primary font-semibold">{repo.activityScore}%</span>
          </div>
          <div className="w-full bg-bg-dark h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-secondary h-full rounded-full"
              style={{ width: `${repo.activityScore}%` }}
            />
          </div>
        </div>

        {/* Footer Meta */}
        <div className="flex items-center justify-between pt-3 border-t border-border-dark text-xs text-txt-muted">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-txt-secondary">
              <Star className="w-3.5 h-3.5 text-accent-warning fill-accent-warning/20" /> {repo.stars}
            </span>
            <span className="flex items-center gap-1 text-txt-secondary">
              <GitFork className="w-3.5 h-3.5 text-txt-muted" /> {repo.forks}
            </span>
          </div>
          <span className="text-[11px]">{repo.lastUpdated}</span>
        </div>
      </div>
    </div>
  );
};
