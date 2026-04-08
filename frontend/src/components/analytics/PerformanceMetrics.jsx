import { motion } from 'framer-motion'
import { performanceMetrics } from '../../data/mockAnalyticsData'
import { formatDuration, formatPercent } from '../../utils/formatters'

function MetricCard({ icon, label, value, sub, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.35, ease: 'easeOut' }}
      className="an-card"
      style={{ padding: '1.5rem' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <i className={`bi ${icon}`} style={{ color, fontSize: '1.1rem' }} />
        </div>
        <div style={{ fontSize: '0.82rem', color: '#9ca3af', fontWeight: '500' }}>{label}</div>
      </div>
      <div style={{ fontSize: '2rem', fontWeight: '800', color, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '6px' }}>{sub}</div>}
    </motion.div>
  )
}

function SLACard({ value }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.35 }}
      className="an-card"
      style={{ padding: '1.5rem', gridColumn: 'span 1' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(79,70,229,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <i className="bi bi-shield-check" style={{ color: '#4f46e5', fontSize: '1.1rem' }} />
        </div>
        <div style={{ fontSize: '0.82rem', color: '#9ca3af', fontWeight: '500' }}>SLA Compliance</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ fontSize: '2rem', fontWeight: '800', color: '#4f46e5', lineHeight: 1 }}>{value}%</div>
        <div style={{ fontSize: '0.78rem', color: value >= 80 ? '#059669' : '#d97706', fontWeight: '600' }}>
          {value >= 90 ? 'Excellent' : value >= 80 ? 'Good' : value >= 70 ? 'Fair' : 'Needs Improvement'}
        </div>
      </div>
      <div className="an-progress-track">
        <motion.div
          className="an-progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ delay: 0.5, duration: 1.2, ease: 'easeOut' }}
        />
      </div>
      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '6px' }}>
        {performanceMetrics.totalResolved} of {performanceMetrics.totalComplaints} resolved within SLA
      </div>
    </motion.div>
  )
}

export default function PerformanceMetrics() {
  const p = performanceMetrics
  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ color: '#111827', fontWeight: '800', fontSize: '1.05rem', margin: 0 }}>
          <i className="bi bi-lightning-charge" style={{ color: '#d97706', marginRight: '8px' }} />
          Performance Analytics
        </h3>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: '1.25rem' }}>
        <MetricCard
          icon="bi-hourglass-split"
          label="Avg Resolution Time"
          value={formatDuration(p.avgResolutionHours)}
          sub="per complaint"
          color="#a78bfa"
          delay={0}
        />
        <MetricCard
          icon="bi-rocket-takeoff"
          label="Fastest Resolution"
          value={formatDuration(p.fastestResolutionHours)}
          sub={p.fastestComplaint}
          color="#34d399"
          delay={0.1}
        />
        <MetricCard
          icon="bi-snail"
          label="Slowest Resolution"
          value={formatDuration(p.slowestResolutionHours)}
          sub={p.slowestComplaint}
          color="#f87171"
          delay={0.2}
        />
        <SLACard value={p.slaCompliancePercent} />
      </div>
    </div>
  )
}
