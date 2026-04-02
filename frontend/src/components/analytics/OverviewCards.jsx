import { motion } from 'framer-motion'
import { overviewTrends } from '../../data/mockAnalyticsData'
import { StatCardSkeleton } from '../common/LoadingSkeleton'

const CARDS = [
  {
    key: 'total',
    label: 'Total Complaints',
    icon: 'bi-list-task',
    color: '#60a5fa',
    bg: 'rgba(96,165,250,0.12)',
    getValue: (c) => c.length,
    trendLabel: (t) => `+${t.curr - t.prev} vs last week`,
    trendUp: (t) => t.curr >= t.prev,
  },
  {
    key: 'open',
    label: 'Open Complaints',
    icon: 'bi-clock-history',
    color: '#fbbf24',
    bg: 'rgba(251,191,36,0.12)',
    getValue: (c) => c.filter(x => x.status === 'PENDING').length,
    trendLabel: (t) => `${t.curr < t.prev ? '↓' : '↑'} ${Math.abs(t.curr - t.prev)} vs last week`,
    trendUp: (t) => t.curr < t.prev, // fewer open is "up" (good)
  },
  {
    key: 'inProgress',
    label: 'In Progress',
    icon: 'bi-arrow-repeat',
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.12)',
    getValue: (c) => c.filter(x => x.status === 'IN_PROGRESS').length,
    trendLabel: (t) => `+${t.curr - t.prev} this week`,
    trendUp: (t) => t.curr >= t.prev,
  },
  {
    key: 'resolved',
    label: 'Resolved',
    icon: 'bi-check-circle',
    color: '#34d399',
    bg: 'rgba(52,211,153,0.12)',
    getValue: (c) => c.filter(x => x.status === 'RESOLVED').length,
    trendLabel: (t) => `+${t.curr - t.prev} this week`,
    trendUp: (t) => t.curr >= t.prev,
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const cardAnim = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export default function OverviewCards({ complaints, loading }) {
  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: '1.25rem' }}>
        {[0,1,2,3].map(i => <StatCardSkeleton key={i} />)}
      </div>
    )
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: '1.25rem' }}
    >
      {CARDS.map(card => {
        const value = card.getValue(complaints)
        const trend = overviewTrends[card.key]
        const isUp  = card.trendUp(trend)

        return (
          <motion.div key={card.key} variants={cardAnim} className="an-stat-card">
            <div>
              <div className="an-stat-value">{value}</div>
              <div className="an-stat-label">{card.label}</div>
              <div className={isUp ? 'an-trend-up' : 'an-trend-down'}>
                <i className={`bi bi-arrow-${isUp ? 'up' : 'down'}-right`} />
                {card.trendLabel(trend)}
              </div>
            </div>
            <div className="an-stat-icon" style={{ background: card.bg }}>
              <i className={`bi ${card.icon}`} style={{ color: card.color }} />
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
