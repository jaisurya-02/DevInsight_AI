import React from 'react';
import type { HeatmapDay } from '../../types/developer';

interface ContributionHeatmapProps {
  days: HeatmapDay[];
}

export const ContributionHeatmap: React.FC<ContributionHeatmapProps> = ({ days }) => {
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
    0: 'bg-[#EBEDF0] border border-[#D0D7DE]',
    1: 'bg-[#9BE9A8] border border-[#40C463]',
    2: 'bg-[#40C463] border border-[#30A14E]',
    3: 'bg-[#30A14E] border border-[#216E39]',
    4: 'bg-[#216E39] border border-[#144622]',
  };

  const totalContributions = days.reduce((acc, d) => acc + d.count, 0);

  return (
    <div className="bg-white border border-border-dark rounded-xl p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-[#1F2328] font-display">GitHub Contribution Activity</h3>
          <p className="text-xs font-medium text-txt-secondary mt-0.5">
            {totalContributions.toLocaleString()} contributions in the last year
          </p>
        </div>
        <div className="text-xs font-mono text-accent-success bg-accent-success/10 border border-accent-success/20 px-3 py-1 rounded-md font-bold">
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
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-dark text-xs text-txt-secondary font-medium">
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
