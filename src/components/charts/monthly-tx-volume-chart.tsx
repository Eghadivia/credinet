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

import type { MonthlyTxVolumeDatum } from '@/lib/admin/monthly-tx-volume-data'

const COLORS = {
  total: '#0f172a',
  successful: '#22c55e',
  failed: '#ef4444',
}

type Props = {
  data?: MonthlyTxVolumeDatum[]
}

export function MonthlyTxVolumeChart({ data }: Props) {
  const series = data?.length ? data : []

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
            domain={[0, 'auto']}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: '1px solid #e4e4e7',
              boxShadow: '0 10px 30px rgba(15,23,42,0.08)',
            }}
          />
          <Legend verticalAlign="bottom" height={36} />
          <Line
            type="monotone"
            dataKey="total"
            name="Total volume"
            stroke={COLORS.total}
            strokeWidth={2.5}
            dot={{ r: 3, strokeWidth: 1, fill: COLORS.total }}
            isAnimationActive={false}
          />
          {series.some((s) => s.successful != null) ? (
            <Line
              type="monotone"
              dataKey="successful"
              name="Successful"
              stroke={COLORS.successful}
              strokeWidth={2}
              dot={{ r: 2 }}
              isAnimationActive={false}
            />
          ) : null}
          {series.some((s) => s.failed != null) ? (
            <Line
              type="monotone"
              dataKey="failed"
              name="Failed"
              stroke={COLORS.failed}
              strokeWidth={2}
              dot={{ r: 2 }}
              isAnimationActive={false}
            />
          ) : null}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
