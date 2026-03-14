'use client';

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell
} from 'recharts';

interface StatsChartProps {
  data: { name: string; count: number }[];
}

const StatsChart = ({ data }: StatsChartProps) => {
  return (
    <div style={{ width: '100%', height: 400, marginTop: '20px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#666', fontSize: 13 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#999', fontSize: 12 }}
            dx={-10}
          />
          <Tooltip 
            cursor={{ fill: '#f8f9fa' }} 
            contentStyle={{ 
              borderRadius: '12px', 
              border: 'none', 
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              padding: '10px 15px'
            }}
            labelStyle={{ fontWeight: 700, marginBottom: '5px' }}
          />
          <Bar 
            dataKey="count" 
            name="운동 횟수" 
            radius={[6, 6, 0, 0]}
            barSize={32}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.count > 0 ? '#2196f3' : '#e0e0e0'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatsChart;
