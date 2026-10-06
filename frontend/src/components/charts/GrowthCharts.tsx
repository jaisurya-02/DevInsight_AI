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
      <div className="bg-white border border-border-dark rounded-xl p-6 shadow-xs">
        <div className="mb-4">
          <h3 className="text-base font-bold text-txt-primary font-display">Repository Growth Trajectory</h3>
          <p className="text-xs text-txt-muted">Cumulative public repositories created over time</p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growth.repoTimeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="year" stroke="#64748B" fontSize={12} tickLine={false} fontFamily="JetBrains Mono" />
              <YAxis stroke="#64748B" fontSize={12} tickLine={false} fontFamily="JetBrains Mono" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#CBD5E1',
                  borderRadius: '8px',
                  color: '#0F172A',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                name="Total Repositories"
                stroke="#4F46E5"
                strokeWidth={3}
                dot={{ fill: '#4F46E5', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Collaboration Trend Chart */}
      <div className="bg-white border border-border-dark rounded-xl p-6 shadow-xs">
        <div className="mb-4">
          <h3 className="text-base font-bold text-txt-primary font-display">Collaboration Activity Trend</h3>
          <p className="text-xs text-txt-muted">Pull requests, issues, and external open-source contributions</p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={growth.collaborationTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="period" stroke="#64748B" fontSize={12} tickLine={false} fontFamily="JetBrains Mono" />
              <YAxis stroke="#64748B" fontSize={12} tickLine={false} fontFamily="JetBrains Mono" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#CBD5E1',
                  borderRadius: '8px',
                  color: '#0F172A',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
              <Bar dataKey="prs" name="Pull Requests" fill="#4F46E5" radius={[2, 2, 0, 0]} />
              <Bar dataKey="issues" name="Issues Opened" fill="#0284C7" radius={[2, 2, 0, 0]} />
              <Bar dataKey="external" name="External Contributions" fill="#059669" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
