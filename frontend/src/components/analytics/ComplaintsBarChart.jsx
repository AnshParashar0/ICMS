import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts'
import { complaintsByLocation } from '../../data/mockAnalyticsData'
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

export default function ComplaintsBarChart({ loading, error, onRetry }) {
  return (
    <ChartContainer
      title="Complaints by Location / Ward"
      icon="bi-bar-chart"
      loading={loading}
      error={error}
      onRetry={onRetry}
      skeletonHeight={280}
    >
      <div className="an-card-body">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={complaintsByLocation} barGap={4} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="ward"
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(79,70,229,0.04)' }} />
            <Legend wrapperStyle={{ color: '#9ca3af', fontSize: '0.78rem', paddingTop: '8px' }} />
            <Bar dataKey="complaints" name="Total" fill="#6366f1" radius={[5,5,0,0]} animationDuration={900} />
            <Bar dataKey="resolved"   name="Resolved" fill="#059669" radius={[5,5,0,0]} animationDuration={1100} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  )
}
