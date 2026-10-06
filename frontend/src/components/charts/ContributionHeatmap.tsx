import React from 'react';
import type { HeatmapDay } from '../../types/developer';

interface ContributionHeatmapProps {
  days: HeatmapDay[];
}

export const ContributionHeatmap: React.FC<ContributionHeatmapProps> = ({ days }) => {
  // Group days into columns of 7 days (weeks)
  const weeks: HeatmapDay[][] = [];
  let currentWeek: HeatmapDay[] = [];

  days.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || index === days.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  const levelColorMap: Record<number, string> = {
    0: 'bg-[#161E30] border border-[#243048]',
    1: 'bg-[#064E3B] border border-[#047857]',
    2: 'bg-[#047857] border border-[#10B981]',
    3: 'bg-[#10B981] border border-[#34D399]',
    4: 'bg-[#34D399] border border-[#A7F3D0]',
  };

  const totalContributions = days.reduce((acc, d) => acc + d.count, 0);

  return (
    <div className="bg-bg-surface border border-border-dark rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-txt-primary font-display">GitHub Contribution Activity</h3>
          <p className="text-xs text-txt-muted">
            {totalContributions.toLocaleString()} contributions in the last year
          </p>
        </div>
        <div className="text-xs font-mono text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-md font-semibold">
          {days.filter((d) => d.count > 0).length} active days
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-flex gap-1.5 min-w-[720px]">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-1.5">
              {week.map((day) => (
                <div
                  key={day.date}
                  title={`${day.count} contributions on ${day.date}`}
                  className={`w-3.5 h-3.5 rounded-sm transition-transform hover:scale-125 ${levelColorMap[day.level]}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Heatmap Legend */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-dark text-xs text-txt-muted">
        <span>Observed Activity Calendar</span>
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span>Less</span>
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`w-3 h-3 rounded-sm ${levelColorMap[level]}`}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
};
