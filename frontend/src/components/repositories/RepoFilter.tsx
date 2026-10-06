import React from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

interface RepoFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedLanguage: string;
  onLanguageChange: (value: string) => void;
  sortBy: 'stars' | 'activity' | 'updated';
  onSortChange: (value: 'stars' | 'activity' | 'updated') => void;
  languages: string[];
}

export const RepoFilter: React.FC<RepoFilterProps> = ({
  searchTerm,
  onSearchChange,
  selectedLanguage,
  onLanguageChange,
  sortBy,
  onSortChange,
  languages,
}) => {
  return (
    <div className="bg-white border border-border-dark rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between shadow-xs">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-txt-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search repositories by name, topic, or description..."
          className="w-full bg-bg-elevated border border-border-dark rounded-lg pl-10 pr-4 py-2 text-sm font-medium text-txt-primary placeholder:text-txt-muted focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Language Filter */}
        <div className="relative">
          <div className="flex items-center gap-2 bg-bg-elevated border border-border-dark px-3 py-2 rounded-lg text-xs font-semibold text-txt-secondary">
            <Filter className="w-3.5 h-3.5 text-txt-muted" />
            <select
              value={selectedLanguage}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-transparent text-txt-primary font-semibold focus:outline-none cursor-pointer pr-2"
            >
              <option value="All" className="bg-white">All Languages</option>
              {languages.map((lang) => (
                <option key={lang} value={lang} className="bg-white">
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort Selector */}
        <div className="relative">
          <div className="flex items-center gap-2 bg-bg-elevated border border-border-dark px-3 py-2 rounded-lg text-xs font-semibold text-txt-secondary">
            <ArrowUpDown className="w-3.5 h-3.5 text-txt-muted" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as any)}
              className="bg-transparent text-txt-primary font-semibold focus:outline-none cursor-pointer pr-2"
            >
              <option value="activity" className="bg-white">Sort by Activity</option>
              <option value="stars" className="bg-white">Sort by Stars</option>
              <option value="updated" className="bg-white">Sort by Last Updated</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
