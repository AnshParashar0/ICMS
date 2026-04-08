import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { complaintsByCategory } from '../../data/mockAnalyticsData'
import ChartContainer from '../common/ChartContainer'

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="an-tooltip">
      <div className="an-tooltip-label">{d.name}</div>
      <div>{d.value} complaints</div>
      <div style={{ color: '#9ca3af', fontSize: '0.78rem' }}>
        {Math.round((d.value / complaintsByCategory.reduce((s, x) => s + x.value, 0)) * 100)}%
      </div>
    </div>
  )
}

function CustomLegend({ payload }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem 1.2rem', justifyContent: 'center', marginTop: '0.5rem' }}>
      {payload.map((entry, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#374151' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: entry.color, flexShrink: 0 }} />
          {entry.value}
        </div>
      ))}
    </div>
  )
}

export default function ComplaintsPieChart({ loading, error, onRetry }) {
  return (
    <ChartContainer
      title="Complaints by Category"
      icon="bi-pie-chart"
      loading={loading}
      error={error}
      onRetry={onRetry}
      skeletonHeight={260}
    >
      <div className="an-card-body">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={complaintsByCategory}
              cx="50%"
              cy="48%"
              innerRadius={65}
              outerRadius={105}
              paddingAngle={3}
              dataKey="value"
              animationBegin={0}
              animationDuration={900}
            >
              {complaintsByCategory.map((entry, i) => (
                <Cell key={i} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  )
}
