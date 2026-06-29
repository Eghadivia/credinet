'use client'

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { monthlySalesSeries } from '@/data/mock/admin-dashboard'
import type { MonthlySalesDatum } from '@/types/admin-api'

const COLORS = {
  airtime: '#ef4444',
  data: '#22c55e',
  electricity: '#eab308',
  cable: '#3b82f6',
}

/**
 * Multi-line chart (not stacked) so all four service types stay visible in the legend
 * and as separate traces — stacked areas collapse to one band when some series are zero.
 */
export function MonthlySalesChart({ data }: { data?: MonthlySalesDatum[] }) {
  const series = data?.length ? data : monthlySalesSeries

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={series} margin={{ top: 10, right: 16, left: 4, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#71717a', fontSize: 12 }}
            tickFormatter={(v) => `₦${v}m`}
            domain={[0, 'auto']}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: '1px solid #e4e4e7',
              boxShadow: '0 10px 30px rgba(15,23,42,0.08)',
            }}
            formatter={(value, name) => {
              const v = typeof value === 'number' ? value : Number(value)
              return [`₦${Number.isFinite(v) ? v : 0}m`, String(name)]
            }}
          />
          <Legend verticalAlign="bottom" height={36} />
          <Line
            type="monotone"
            dataKey="airtime"
            name="Airtime"
            stroke={COLORS.airtime}
            strokeWidth={2.5}
            dot={{ r: 3, strokeWidth: 1, fill: COLORS.airtime }}
            activeDot={{ r: 5 }}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="data"
            name="Data Bundles"
            stroke={COLORS.data}
            strokeWidth={2.5}
            dot={{ r: 3, strokeWidth: 1, fill: COLORS.data }}
            activeDot={{ r: 5 }}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="electricity"
            name="Electricity"
            stroke={COLORS.electricity}
            strokeWidth={2.5}
            dot={{ r: 3, strokeWidth: 1, fill: COLORS.electricity }}
            activeDot={{ r: 5 }}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="cable"
            name="Cable TV"
            stroke={COLORS.cable}
            strokeWidth={2.5}
            dot={{ r: 3, strokeWidth: 1, fill: COLORS.cable }}
            activeDot={{ r: 5 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
