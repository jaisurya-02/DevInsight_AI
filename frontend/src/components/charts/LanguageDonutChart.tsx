import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { LanguageDistribution } from '../../types/developer';

interface LanguageDonutChartProps {
  languages: LanguageDistribution[];
}

export const LanguageDonutChart: React.FC<LanguageDonutChartProps> = ({ languages }) => {
  return (
    <div className="bg-bg-surface border border-border-dark rounded-xl p-6">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-txt-primary">Language Distribution</h3>
        <p className="text-xs text-txt-muted">Byte breakdown across public repositories</p>
      </div>

      <div className="relative h-48 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={languages}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={3}
              dataKey="percentage"
            >
              {languages.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#0D1320" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#0D1320',
                borderColor: '#1F2937',
                borderRadius: '8px',
                color: '#F8FAFC',
                fontSize: '12px',
              }}
              formatter={(value: any) => [`${value}%`, 'Share']}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-bold text-txt-primary font-mono">{languages.length}</span>
          <span className="text-[11px] text-txt-muted uppercase tracking-wider">Languages</span>
        </div>
      </div>

      {/* Custom Legend */}
      <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-border-dark text-xs">
        {languages.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-txt-secondary truncate">{item.name}</span>
            </div>
            <span className="font-mono text-txt-muted font-medium ml-2">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
