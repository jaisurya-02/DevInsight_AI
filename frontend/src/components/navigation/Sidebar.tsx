import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  Code2,
  Sparkles,
  TrendingUp,
  Cpu,
} from 'lucide-react';
import type { DeveloperProfile } from '../../types/developer';

interface SidebarProps {
  profile?: DeveloperProfile;
}

export const Sidebar: React.FC<SidebarProps> = ({ profile }) => {
  const navItems = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/analyze', label: 'Analyze', icon: Search },
    { to: '/repositories', label: 'Repositories', icon: Code2 },
    { to: '/skills', label: 'Skills & Gaps', icon: Sparkles },
    { to: '/growth', label: 'Developer Growth', icon: TrendingUp },
  ];

  return (
    <aside className="w-64 bg-white border-r border-border-dark flex flex-col justify-between shrink-0 h-screen sticky top-0 shadow-sm">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-border-dark flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-bold text-txt-primary font-display tracking-tight block">
              DevInsight <span className="text-primary font-mono font-bold">AI</span>
            </span>
            <span className="text-[10px] text-txt-muted tracking-wider uppercase block font-mono">
              Developer Intelligence
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? 'bg-primary text-white font-bold shadow-sm shadow-primary/20'
                    : 'text-txt-secondary font-semibold hover:text-txt-primary hover:bg-bg-elevated'
                }`
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer Profile & Status Indicator */}
      <div className="p-4 border-t border-border-dark space-y-3">
        {profile && (
          <div className="flex items-center gap-3 p-2 rounded-lg bg-bg-elevated border border-border-dark">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-8 h-8 rounded-full border border-border-dark object-cover"
            />
            <div className="truncate">
              <span className="text-xs font-bold text-txt-primary block truncate">
                {profile.name}
              </span>
              <span className="text-[11px] text-txt-muted block truncate font-mono">
                @{profile.username}
              </span>
            </div>
          </div>
        )}

        {/* API Connection Indicator */}
        <div className="flex items-center justify-between text-xs text-txt-muted bg-bg-elevated border border-border-dark px-3 py-2 rounded-lg">
          <span className="flex items-center gap-1.5 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-accent-success animate-pulse"></span>
            GitHub API
          </span>
          <span className="text-[11px] font-mono text-accent-success font-bold">Connected</span>
        </div>
      </div>
    </aside>
  );
};
