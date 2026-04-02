import { useState } from 'react'
import { THEME, STATUS_CFG, PRIORITY_CFG } from '../../utils/constants'
import { apiUtils } from '../../backend-api'
import ComplaintDetailModal from './ComplaintDetailModal'
import ComplaintFilters from './ComplaintFilters'

export default function ComplaintsTable({ complaints, loading, onRefresh, onStatusChange, updatingId }) {
  const [selected, setSelected]     = useState(null)
  const [filtered, setFiltered]     = useState(complaints)

  // Sync filtered when complaints change (e.g. after refresh)
  const displayList = filtered.length === complaints.length ? complaints : filtered

  return (
    <div>
      <ComplaintDetailModal
        complaint={selected}
        onClose={() => setSelected(null)}
        onStatusChange={(id, s) => { onStatusChange(id, s); setSelected(prev => prev ? { ...prev, status: s } : null) }}
        updatingId={updatingId}
      />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontWeight: '800', fontSize: '1.6rem', color: '#111827', margin: 0 }}>All Complaints</h2>
          <p style={{ color: '#6b7280', margin: '0.3rem 0 0', fontSize: '0.95rem' }}>{displayList.length} of {complaints.length} shown</p>
        </div>
        <button onClick={onRefresh} style={{ background: THEME.gradient, border: 'none', color: '#fff', borderRadius: '8px', padding: '0.55rem 1.25rem', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 3px 10px rgba(79,70,229,0.3)' }}>
          <i className="bi bi-arrow-clockwise" /> Refresh
        </button>
      </div>

      {/* Filters */}
      <ComplaintFilters complaints={complaints} onFiltered={setFiltered} />

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid #e5e7eb', borderTopColor: THEME.primary, borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 1rem' }} />
            <p style={{ color: '#9ca3af' }}>Loading complaints...</p>
          </div>
        ) : displayList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <i className="bi bi-inbox" style={{ fontSize: '3rem', color: '#d1d5db' }} />
            <p style={{ color: '#9ca3af', marginTop: '1rem' }}>No complaints found.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9', background: '#fafafa' }}>
                  {['ID', 'Student', 'Category', 'Location', 'Priority', 'Status', 'Image', 'Date', 'Action'].map(h => (
                    <th key={h} style={{ padding: '0.85rem 1rem', textAlign: 'left', color: '#6b7280', fontWeight: '600', fontSize: '0.77rem', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayList.map(complaint => {
                  const sc = STATUS_CFG[complaint.status] || STATUS_CFG.PENDING
                  const pc = PRIORITY_CFG[complaint.priority] || PRIORITY_CFG.LOW
                  const imgUrl = apiUtils.getImageUrl(complaint.imagePath)
                  return (
                    <tr key={complaint.id}
                      style={{ borderBottom: '1px solid #f9fafb', cursor: 'pointer' }}
                      onMouseOver={e => e.currentTarget.style.background = '#f9fafb'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                      onClick={() => setSelected(complaint)}
                    >
                      <td style={{ padding: '0.85rem 1rem', fontWeight: '700', color: THEME.primary, whiteSpace: 'nowrap' }}>{complaint.complaintId}</td>
                      <td style={{ padding: '0.85rem 1rem', color: '#374151' }}>{complaint.studentName}</td>
                      <td style={{ padding: '0.85rem 1rem', color: '#374151' }}>{complaint.category}</td>
                      <td style={{ padding: '0.85rem 1rem', color: '#6b7280', fontSize: '0.82rem', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{complaint.location}</td>
                      <td style={{ padding: '0.85rem 1rem' }} onClick={e => e.stopPropagation()}>
                        <span style={{ background: pc.bg, color: pc.color, borderRadius: '20px', padding: '2px 10px', fontSize: '0.75rem', fontWeight: '700' }}>{complaint.priority}</span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }} onClick={e => e.stopPropagation()}>
                        <span style={{ background: sc.bg, color: sc.color, borderRadius: '20px', padding: '2px 10px', fontSize: '0.75rem', fontWeight: '700', whiteSpace: 'nowrap' }}>{sc.label}</span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }} onClick={e => e.stopPropagation()}>
                        {imgUrl ? (
                          <img src={imgUrl} alt="proof" style={{ width: '44px', height: '36px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e5e7eb' }} onError={e => { e.target.style.display = 'none' }} />
                        ) : <span style={{ color: '#d1d5db', fontSize: '0.8rem' }}>—</span>}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#9ca3af', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>{apiUtils.formatDate(complaint.createdAt)}</td>
                      <td style={{ padding: '0.85rem 1rem' }} onClick={e => e.stopPropagation()}>
                        {updatingId === complaint.id ? (
                          <div style={{ width: '20px', height: '20px', border: '2px solid #e5e7eb', borderTopColor: THEME.primary, borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                        ) : (
                          <select value={complaint.status} onChange={e => onStatusChange(complaint.id, e.target.value)}
                            style={{ padding: '0.3rem 0.5rem', borderRadius: '7px', border: '1.5px solid #e5e7eb', background: '#f9fafb', fontSize: '0.8rem', outline: 'none', minWidth: '120px', color: '#374151', cursor: 'pointer' }}>
                            {Object.entries(STATUS_CFG).map(([k, cfg]) => <option key={k} value={k}>{cfg.label}</option>)}
                          </select>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
