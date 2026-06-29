'use client'

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

import { revenueBreakdown } from '@/data/mock/admin-dashboard'

export function RevenuePieChart() {
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={revenueBreakdown} dataKey="value" nameKey="name" innerRadius={70} outerRadius={100} paddingAngle={3}>
            {revenueBreakdown.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => {
              const v = typeof value === 'number' ? value : Number(value)
              return [`${Number.isFinite(v) ? v : 0}%`, 'Share']
            }}
            contentStyle={{
              borderRadius: 12,
              border: '1px solid #e4e4e7',
              boxShadow: '0 10px 30px rgba(15,23,42,0.08)',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
