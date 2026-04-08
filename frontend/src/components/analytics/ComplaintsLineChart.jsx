import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { dailyTrend, weeklyTrend } from '../../data/mockAnalyticsData'
import ChartContainer from '../common/ChartContainer'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="an-tooltip">
      <div className="an-tooltip-label">{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontSize: '0.82rem' }}>
          {p.name}: <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  )
}

export default function ComplaintsLineChart({ loading, error, onRetry }) {
  const [mode, setMode] = useState('daily')
  const data = mode === 'daily' ? dailyTrend : weeklyTrend
  const xKey = mode === 'daily' ? 'date' : 'week'

  const toggleBtn = (
    <div style={{ display: 'flex', gap: '4px', background: '#f3f4f6', borderRadius: '8px', padding: '3px' }}>
      {['daily', 'weekly'].map(m => (
        <button
          key={m}
          onClick={() => setMode(m)}
          style={{
            padding: '4px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer',
            fontSize: '0.78rem', fontWeight: '600',
            background: mode === m ? '#4f46e5' : 'transparent',
            color: mode === m ? '#fff' : '#9ca3af',
            transition: 'all 0.15s',
          }}
        >
          {m.charAt(0).toUpperCase() + m.slice(1)}
        </button>
      ))}
    </div>
  )

  // Show every 5th tick for daily to avoid crowding
  const tickFormatter = (val, idx) => (mode === 'daily' ? (idx % 5 === 0 ? val : '') : val)

  return (
    <ChartContainer
      title="Complaint Trend Over Time"
      icon="bi-graph-up"
      loading={loading}
      error={error}
      onRetry={onRetry}
      skeletonHeight={280}
      action={toggleBtn}
    >
      <div className="an-card-body">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey={xKey}
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              tickFormatter={tickFormatter}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: '#9ca3af', fontSize: '0.78rem', paddingTop: '8px' }} />
            <Line
              type="monotone" dataKey="total" name="Total"
              stroke="#60a5fa" strokeWidth={2.5} dot={false}
              activeDot={{ r: 5, fill: '#60a5fa' }}
              animationDuration={1000}
            />
            <Line
              type="monotone" dataKey="resolved" name="Resolved"
              stroke="#34d399" strokeWidth={2.5} dot={false}
              activeDot={{ r: 5, fill: '#34d399' }}
              animationDuration={1200}
            />
            <Line
              type="monotone" dataKey="pending" name="Pending"
              stroke="#fbbf24" strokeWidth={2} dot={false} strokeDasharray="5 4"
              activeDot={{ r: 5, fill: '#fbbf24' }}
              animationDuration={1400}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  )
}
