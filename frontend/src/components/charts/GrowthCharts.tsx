import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { GrowthAnalytics } from '../../types/developer';

interface GrowthChartsProps {
  growth: GrowthAnalytics;
}

export const GrowthCharts: React.FC<GrowthChartsProps> = ({ growth }) => {
  return (
    <div className="space-y-6">
      {/* Repo Creation Growth */}
      <div className="bg-bg-surface border border-border-dark rounded-xl p-6">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-txt-primary">Repository Growth Trajectory</h3>
          <p className="text-xs text-txt-muted">Cumulative public repositories created over time</p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growth.repoTimeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
              <XAxis dataKey="year" stroke="#64748B" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0D1320',
                  borderColor: '#1F2937',
                  borderRadius: '8px',
                  color: '#F8FAFC',
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                name="Total Repositories"
                stroke="#6366F1"
                strokeWidth={3}
                dot={{ fill: '#6366F1', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Collaboration Trend Chart */}
      <div className="bg-bg-surface border border-border-dark rounded-xl p-6">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-txt-primary">Collaboration Activity Trend</h3>
          <p className="text-xs text-txt-muted">Pull requests, issues, and external open-source contributions</p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={growth.collaborationTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
              <XAxis dataKey="period" stroke="#64748B" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0D1320',
                  borderColor: '#1F2937',
                  borderRadius: '8px',
                  color: '#F8FAFC',
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
              <Bar dataKey="prs" name="Pull Requests" fill="#6366F1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="issues" name="Issues Opened" fill="#22D3EE" radius={[4, 4, 0, 0]} />
              <Bar dataKey="external" name="External Contributions" fill="#22C55E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
