import { motion } from 'framer-motion'
import { repeatComplaints, performanceMetrics } from '../../data/mockAnalyticsData'

function RepeatComplaintsCard() {
  return (
    <div className="an-card" style={{ overflow: 'hidden' }}>
      <div className="an-card-header">
        <h6 className="an-card-title">
          <i className="bi bi-arrow-repeat" style={{ color: '#f87171' }} />
          Repeat Complaints
        </h6>
        <span className="an-badge-red">{repeatComplaints.length} hotspots</span>
      </div>
      <div className="an-card-body" style={{ padding: '0.5rem 1.5rem 1.5rem' }}>
        {repeatComplaints.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0.8rem 0', borderBottom: i < repeatComplaints.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: '600', color: '#e5e7eb', fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.location}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '2px' }}>{item.category}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '1rem', flexShrink: 0 }}>
              {[...Array(item.count)].map((_, j) => (
                <div key={j} style={{ width: 6, height: 6, borderRadius: '50%', background: item.count >= 4 ? '#f87171' : '#fbbf24' }} />
              ))}
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: item.count >= 4 ? '#f87171' : '#fbbf24', marginLeft: '4px' }}>
                ×{item.count}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function EscalatedCard() {
  return (
    <div className="an-card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(251,191,36,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <i className="bi bi-exclamation-triangle" style={{ color: '#fbbf24', fontSize: '1.1rem' }} />
        </div>
        <div>
          <div style={{ fontSize: '0.82rem', color: '#9ca3af' }}>Escalated Complaints</div>
          <div style={{ fontWeight: '800', fontSize: '2rem', color: '#fbbf24', lineHeight: 1 }}>
            {performanceMetrics.escalatedCount}
          </div>
        </div>
      </div>
      <p style={{ fontSize: '0.82rem', color: '#6b7280', lineHeight: 1.6, margin: 0 }}>
        These complaints exceeded their expected resolution time and were escalated to senior management.
      </p>

      <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'rgba(251,191,36,0.06)', borderRadius: '10px', border: '1px solid rgba(251,191,36,0.15)' }}>
        <div style={{ fontSize: '0.78rem', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Impact Breakdown</div>
        {[
          { label: 'Road / Civil',    count: 5, color: '#f87171' },
          { label: 'Plumbing',        count: 4, color: '#fbbf24' },
          { label: 'Electrical',      count: 3, color: '#a78bfa' },
          { label: 'Other',           count: 2, color: '#6b7280' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.82rem', color: '#d1d5db' }}>{item.label}</span>
            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: item.color }}>×{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function SummaryInsights({ complaints }) {
  const total    = complaints.length
  const resolved = complaints.filter(c => c.status === 'RESOLVED').length
  const urgent   = complaints.filter(c => c.priority === 'URGENT').length
  const rate     = total > 0 ? Math.round((resolved / total) * 100) : 0

  const insights = [
    { icon: 'bi-graph-up-arrow',       label: 'Resolution Rate',         value: `${rate}%`,    color: '#34d399' },
    { icon: 'bi-exclamation-octagon',  label: 'Urgent Open',             value: urgent,         color: '#f87171' },
    { icon: 'bi-arrow-repeat',         label: 'Repeat Incidents',        value: performanceMetrics.repeatComplaints, color: '#fbbf24' },
    { icon: 'bi-flag',                 label: 'Escalated',               value: performanceMetrics.escalatedCount,  color: '#a78bfa' },
  ]

  return (
    <div className="an-card" style={{ padding: '1.5rem' }}>
      <div style={{ fontSize: '0.82rem', color: '#6b7280', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.25rem' }}>
        <i className="bi bi-lightbulb" style={{ color: '#fbbf24', marginRight: '6px' }} />
        Quick Insights
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {insights.map(ins => (
          <div key={ins.label} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <i className={`bi ${ins.icon}`} style={{ color: ins.color, fontSize: '1.1rem', marginBottom: '8px', display: 'block' }} />
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: ins.color, lineHeight: 1 }}>{ins.value}</div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '4px' }}>{ins.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AdvancedInsights({ complaints }) {
  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ color: '#f9fafb', fontWeight: '800', fontSize: '1.05rem', margin: 0 }}>
          <i className="bi bi-binoculars" style={{ color: '#22d3ee', marginRight: '8px' }} />
          Advanced Insights
        </h3>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1.25rem' }}>
        <RepeatComplaintsCard />
        <EscalatedCard />
        <SummaryInsights complaints={complaints} />
      </div>
    </div>
  )
}
