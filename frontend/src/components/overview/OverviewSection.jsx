import { THEME, STATUS_CFG } from '../../utils/constants'
import { apiUtils } from '../../backend-api'

const DEPARTMENTS = ['Electrical', 'Plumbing', 'Furniture', 'Internet', 'Cleaning', 'Security', 'Other']

export default function OverviewSection({ complaints, workers, setActive }) {
  const total      = complaints.length
  const pending    = complaints.filter(c => c.status === 'PENDING').length
  const inProgress = complaints.filter(c => c.status === 'IN_PROGRESS').length
  const resolved   = complaints.filter(c => c.status === 'RESOLVED').length
  const recent     = [...complaints].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)

  const cards = [
    { label: 'Total Complaints', value: total,      icon: 'bi-list-task',    color: THEME.primary, bg: '#ede9fe' },
    { label: 'Pending',          value: pending,    icon: 'bi-clock-history', color: '#d97706',    bg: '#fef3c7' },
    { label: 'In Progress',      value: inProgress, icon: 'bi-arrow-repeat',  color: '#2563eb',    bg: '#dbeafe' },
    { label: 'Resolved',         value: resolved,   icon: 'bi-check-circle',  color: '#059669',    bg: '#d1fae5' },
  ]

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontWeight: '800', fontSize: '1.6rem', color: '#111827', margin: 0, letterSpacing: '-0.5px' }}>Dashboard Overview</h2>
        <p style={{ color: '#6b7280', margin: '0.3rem 0 0', fontSize: '0.95rem' }}>Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {cards.map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: '14px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #f1f5f9' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className={`bi ${s.icon}`} style={{ fontSize: '1.4rem', color: s.color }} />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#6b7280', fontWeight: '500' }}>{s.label}</div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: '#111827', lineHeight: 1 }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent complaints + workers by dept */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        {/* Recent complaints */}
        <div style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f9fafb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h6 style={{ fontWeight: '700', margin: 0, color: '#111827', fontSize: '0.95rem' }}>
              <i className="bi bi-clock-history me-2" style={{ color: THEME.primary }} />Recent Complaints
            </h6>
            <button onClick={() => setActive('complaints')} style={{ background: 'none', border: 'none', color: THEME.primary, fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer' }}>View all →</button>
          </div>
          <div style={{ padding: '0.5rem 1rem' }}>
            {recent.length === 0 ? (
              <p style={{ color: '#9ca3af', textAlign: 'center', padding: '1.5rem 0', fontSize: '0.9rem' }}>No complaints yet.</p>
            ) : recent.map(c => {
              const sc = STATUS_CFG[c.status] || STATUS_CFG.PENDING
              return (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 0', borderBottom: '1px solid #f9fafb' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '700', color: THEME.primary, fontSize: '0.875rem' }}>{c.complaintId}</div>
                    <div style={{ fontSize: '0.78rem', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.category} · {c.location}</div>
                  </div>
                  <span style={{ background: sc.bg, color: sc.color, borderRadius: '20px', padding: '2px 10px', fontSize: '0.72rem', fontWeight: '700', marginLeft: '0.75rem', whiteSpace: 'nowrap' }}>{sc.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Workers by dept */}
        <div style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f9fafb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h6 style={{ fontWeight: '700', margin: 0, color: '#111827', fontSize: '0.95rem' }}>
              <i className="bi bi-people me-2" style={{ color: THEME.primary }} />Workers by Department
            </h6>
            <button onClick={() => setActive('workers')} style={{ background: 'none', border: 'none', color: THEME.primary, fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer' }}>Manage →</button>
          </div>
          <div style={{ padding: '0.5rem 1rem' }}>
            {DEPARTMENTS.map(dept => {
              const count = workers.filter(w => w.department === dept).length
              return (
                <div key={dept} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.7rem 0', borderBottom: '1px solid #f9fafb' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>{dept}</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: '700', color: THEME.primary }}>{count}</span>
                    </div>
                    <div style={{ height: '4px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: THEME.primary, borderRadius: '4px', width: `${Math.min((count / Math.max(workers.length, 1)) * 100 * 3, 100)}%`, transition: 'width 0.5s ease' }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
