'use client'

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { weeklyActivitySeries } from '@/data/mock/admin-dashboard'

type WeeklyActivityChartProps = {
  /** When false, hide revenue overlay (e.g. Admin role without financial analytics). */
  showRevenue?: boolean
}

export function WeeklyActivityChart({ showRevenue = true }: WeeklyActivityChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={weeklyActivitySeries} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
          <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
          <YAxis
            yAxisId="left"
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#71717a', fontSize: 12 }}
            tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
          />
          {showRevenue ? (
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#71717a', fontSize: 12 }}
              tickFormatter={(v) => `₦${v}m`}
            />
          ) : null}
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: '1px solid #e4e4e7',
              boxShadow: '0 10px 30px rgba(15,23,42,0.08)',
            }}
          />
          <Legend />
          <Bar yAxisId="left" dataKey="transactions" name="Transactions" fill="#0f172a" radius={[6, 6, 0, 0]} opacity={0.85} />
          {showRevenue ? (
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              name="Revenue (₦m)"
              stroke="#f84b44"
              strokeWidth={3}
              dot={{ r: 3, fill: '#f84b44' }}
            />
          ) : null}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
