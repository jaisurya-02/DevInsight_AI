import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { MonthlyActivity } from '../../types/developer';

interface ActivityChartProps {
  data: MonthlyActivity[];
}

export const ActivityChart: React.FC<ActivityChartProps> = ({ data }) => {
  const [filter, setFilter] = useState<'3M' | '6M' | '1Y' | 'All'>('All');

  const getFilteredData = () => {
    if (filter === '3M') return data.slice(-3);
    if (filter === '6M') return data.slice(-6);
    return data;
  };

  const filteredData = getFilteredData();

  return (
    <div className="bg-bg-surface border border-border-dark rounded-xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-txt-primary font-display">Development Activity Overview</h3>
          <p className="text-xs text-txt-muted">Monthly commits, pull requests, and open-source contributions</p>
        </div>

        <div className="flex items-center gap-1 bg-bg-dark border border-border-dark p-1 rounded-lg self-start sm:self-auto font-mono">
          {(['3M', '6M', '1Y', 'All'] as const).map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                filter === item
                  ? 'bg-primary text-bg-dark shadow-sm'
                  : 'text-txt-muted hover:text-txt-primary hover:bg-bg-elevated'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#243048" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="#64748B"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#243048' }}
              fontFamily="JetBrains Mono"
            />
            <YAxis
              stroke="#64748B"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              fontFamily="JetBrains Mono"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F1522',
                borderColor: '#243048',
                borderRadius: '8px',
                color: '#F8FAFC',
                fontSize: '12px',
                fontFamily: 'Plus Jakarta Sans',
              }}
              labelStyle={{ color: '#94A3B8', fontWeight: 600 }}
            />
            <Area
              type="monotone"
              dataKey="totalActivity"
              name="Total Activity"
              stroke="#10B981"
              strokeWidth={2.5}
              fill="#10B981"
              fillOpacity={0.1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border-dark text-xs text-txt-muted">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
          <span>Commits & PRs</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
          <span>Issues & Discussions</span>
        </div>
      </div>
    </div>
  );
};
