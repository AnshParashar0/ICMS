import { motion } from 'framer-motion'
import { departmentRanking } from '../../data/mockAnalyticsData'
import { formatDuration } from '../../utils/formatters'

const RANK_COLORS = ['#fbbf24', '#9ca3af', '#b45309']
const getSLAColor = (sla) => {
  if (sla >= 90) return '#34d399'
  if (sla >= 75) return '#fbbf24'
  return '#f87171'
}

export default function DepartmentRankingTable() {
  return (
    <div className="an-card" style={{ overflow: 'hidden' }}>
      <div className="an-card-header">
        <h6 className="an-card-title">
          <i className="bi bi-trophy" style={{ color: '#fbbf24' }} />
          Department Performance Ranking
        </h6>
        <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>Based on complaints handled &amp; SLA</span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="an-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Department</th>
              <th>Complaints Handled</th>
              <th>Avg Resolution</th>
              <th>SLA Compliance</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            {departmentRanking.map((row, i) => (
              <motion.tr
                key={row.dept}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
              >
                <td>
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontWeight: '800', fontSize: '0.82rem',
                    background: i < 3 ? `${RANK_COLORS[i]}18` : '#f9fafb',
                    color: i < 3 ? RANK_COLORS[i] : '#9ca3af',
                    border: `1.5px solid ${i < 3 ? RANK_COLORS[i] + '40' : '#e5e7eb'}`,
                  }}>
                    {row.rank}
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: '600', color: '#111827' }}>{row.dept}</div>
                </td>
                <td>
                  <span style={{ fontWeight: '700', color: '#4f46e5' }}>{row.handled}</span>
                  <span style={{ color: '#6b7280', fontSize: '0.78rem', marginLeft: '4px' }}>complaints</span>
                </td>
                <td style={{ color: '#7c3aed', fontWeight: '600' }}>
                  {formatDuration(row.avgHours)}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ flex: 1, height: 6, background: '#f3f4f6', borderRadius: 6, overflow: 'hidden', minWidth: 60 }}>
                      <div style={{ height: '100%', borderRadius: 6, background: getSLAColor(row.sla), width: `${row.sla}%`, transition: 'width 1s ease' }} />
                    </div>
                    <span style={{ fontWeight: '700', color: getSLAColor(row.sla), fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                      {row.sla}%
                    </span>
                  </div>
                </td>
                <td>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.78rem', fontWeight: '700',
                    color: row.trend === 'up' ? '#059669' : '#dc2626',
                  }}>
                    <i className={`bi bi-arrow-${row.trend === 'up' ? 'up' : 'down'}-right`} />
                    {row.trend === 'up' ? 'Improving' : 'Declining'}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
