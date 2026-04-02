import { THEME, STATUS_CFG, PRIORITY_CFG } from '../../utils/constants'
import { apiUtils } from '../../backend-api'

export default function ComplaintDetailModal({ complaint, onClose, onStatusChange, updatingId }) {
  if (!complaint) return null
  const sc = STATUS_CFG[complaint.status] || STATUS_CFG.PENDING
  const pc = PRIORITY_CFG[complaint.priority] || PRIORITY_CFG.LOW
  const imgUrl = apiUtils.getImageUrl(complaint.imagePath)

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', borderRadius: '18px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '1.5rem 1.75rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontWeight: '800', fontSize: '1.1rem', color: THEME.primary }}>{complaint.complaintId}</div>
            <div style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '2px' }}>{complaint.category} · {complaint.location}</div>
          </div>
          <button onClick={onClose} style={{ background: '#f3f4f6', border: 'none', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', fontSize: '1rem', color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem 1.75rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            {[
              { label: 'Student', val: complaint.studentName || '—' },
              { label: 'Contact', val: complaint.contactNumber || '—' },
              { label: 'Date',    val: apiUtils.formatDate(complaint.createdAt) },
            ].map(f => (
              <div key={f.label}>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '3px' }}>{f.label}</div>
                <div style={{ fontSize: '0.9rem', color: '#374151', fontWeight: '500' }}>{f.val}</div>
              </div>
            ))}
            <div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '3px' }}>Priority</div>
              <span style={{ background: pc.bg, color: pc.color, borderRadius: '20px', padding: '2px 12px', fontSize: '0.8rem', fontWeight: '700' }}>
                {complaint.priority}
              </span>
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Description</div>
            <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '1rem', fontSize: '0.9rem', color: '#374151', lineHeight: 1.65, border: '1px solid #f1f5f9' }}>
              {complaint.description || 'No description provided.'}
            </div>
          </div>

          {imgUrl && (
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Proof Photo</div>
              <img src={imgUrl} alt="Complaint proof" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '12px', border: '2px solid #e5e7eb' }}
                onError={e => { e.target.style.display = 'none' }} />
            </div>
          )}

          <div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Update Status</div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {Object.entries(STATUS_CFG).map(([key, cfg]) => (
                <button
                  key={key}
                  disabled={updatingId === complaint.id}
                  onClick={() => onStatusChange(complaint.id, key)}
                  style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', border: `1.5px solid ${complaint.status === key ? cfg.color : '#e5e7eb'}`, background: complaint.status === key ? cfg.bg : '#fff', color: complaint.status === key ? cfg.color : '#374151', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.15s' }}
                >
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
