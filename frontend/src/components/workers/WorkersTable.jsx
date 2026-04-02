import { THEME } from '../../utils/constants'

const STATUS_COLORS = {
  AVAILABLE: { color: '#059669', bg: '#d1fae5' },
  BUSY:      { color: '#d97706', bg: '#fef3c7' },
  OFF_DUTY:  { color: '#6b7280', bg: '#f3f4f6' },
}

function statusLabel(s) {
  if (s === 'OFF_DUTY') return 'Off Duty'
  return s.charAt(0) + s.slice(1).toLowerCase()
}

export default function WorkersTable({ workers, filterDept, onEdit, onDelete }) {
  const filtered = filterDept ? workers.filter(w => w.department === filterDept) : workers

  return (
    <div style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f9fafb', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <h6 style={{ fontWeight: '700', margin: 0, color: '#111827', fontSize: '0.95rem' }}>
          <i className="bi bi-people me-2" style={{ color: THEME.primary }} />
          {filterDept ? `${filterDept} Workers` : 'All Workers'} ({filtered.length})
        </h6>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <i className="bi bi-person-x" style={{ fontSize: '2.5rem', color: '#d1d5db' }} />
          <p style={{ color: '#9ca3af', marginTop: '1rem' }}>No workers found.</p>
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f1f5f9', background: '#fafafa' }}>
              {['Name', 'Department', 'Phone', 'Email', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '0.85rem 1rem', textAlign: 'left', color: '#6b7280', fontWeight: '600', fontSize: '0.77rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(w => {
              const sc = STATUS_COLORS[w.status] || STATUS_COLORS.AVAILABLE
              return (
                <tr key={w.id} style={{ borderBottom: '1px solid #f9fafb' }}
                  onMouseOver={e => e.currentTarget.style.background = '#f9fafb'}
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '0.9rem 1rem', fontWeight: '600', color: '#111827' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: THEME.primary, fontSize: '0.95rem', flexShrink: 0 }}>
                        {w.name.charAt(0).toUpperCase()}
                      </div>
                      {w.name}
                    </div>
                  </td>
                  <td style={{ padding: '0.9rem 1rem', color: '#374151' }}>{w.department}</td>
                  <td style={{ padding: '0.9rem 1rem', color: '#6b7280' }}>{w.phone || '—'}</td>
                  <td style={{ padding: '0.9rem 1rem', color: '#6b7280' }}>{w.email || '—'}</td>
                  <td style={{ padding: '0.9rem 1rem' }}>
                    <span style={{ background: sc.bg, color: sc.color, borderRadius: '20px', padding: '3px 12px', fontSize: '0.75rem', fontWeight: '700' }}>
                      {statusLabel(w.status)}
                    </span>
                  </td>
                  <td style={{ padding: '0.9rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => onEdit(w)} style={{ background: '#ede9fe', border: 'none', color: THEME.primary, borderRadius: '7px', padding: '0.35rem 0.9rem', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => onDelete(w.id)} style={{ background: '#fee2e2', border: 'none', color: '#dc2626', borderRadius: '7px', padding: '0.35rem 0.9rem', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}
