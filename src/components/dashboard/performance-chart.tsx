"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: '24/11', views: 2049, engagement: 29 },
  { name: '25/11', views: 1171, engagement: 2 },
  { name: '26/11', views: 667, engagement: 7 },
  { name: '27/11', views: 6222, engagement: 6 },
  { name: '28/11', views: 2712, engagement: 22 },
  { name: '29/11', views: 565, engagement: 3 },
  { name: '30/11', views: 503, engagement: 13 },
];

export function PerformanceChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="name"
            className="text-xs"
            tick={{ fill: 'currentColor' }}
          />
          <YAxis
            className="text-xs"
            tick={{ fill: 'currentColor' }}
            yAxisId="left"
          />
          <YAxis
            className="text-xs"
            tick={{ fill: 'currentColor' }}
            yAxisId="right"
            orientation="right"
          />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="views"
            stroke="#2563eb"
            activeDot={{ r: 8 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="engagement"
            stroke="#16a34a"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}