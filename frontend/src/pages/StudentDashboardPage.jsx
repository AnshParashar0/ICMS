import { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { complaintsAPI, apiUtils } from '../backend-api'
import { toast } from 'react-toastify'
import logo from '../assets/vecteezy_modern-real-estate-and-construction-logo_19897563.png'

const THEME = {
  gradient: 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 60%, #7c3aed 100%)',
  primary: '#4f46e5',
}

const STATUS_CFG = {
  PENDING:     { color: '#d97706', bg: '#fef3c7', label: 'Pending' },
  IN_PROGRESS: { color: '#2563eb', bg: '#dbeafe', label: 'In Progress' },
  RESOLVED:    { color: '#059669', bg: '#d1fae5', label: 'Resolved' },
}

// ─── Complaint Detail Modal ────────────────────────────────────────────────────
function ComplaintDetailModal({ complaint, onClose }) {
  if (!complaint) return null
  const sc = STATUS_CFG[complaint.status] || STATUS_CFG.PENDING
  const imgUrl = apiUtils.getImageUrl(complaint.imagePath)
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: '18px', width: '100%', maxWidth: '540px', maxHeight: '88vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '1.5rem 1.75rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: '800', fontSize: '1.05rem', color: THEME.primary }}>{complaint.complaintId}</div>
            <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>{complaint.category} · {complaint.location}</div>
          </div>
          <button onClick={onClose} style={{ background: '#f3f4f6', border: 'none', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', fontSize: '1rem', color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
        <div style={{ padding: '1.5rem 1.75rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Status</div>
              <span style={{ background: sc.bg, color: sc.color, borderRadius: '20px', padding: '3px 14px', fontSize: '0.82rem', fontWeight: '700' }}>{sc.label}</span>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Priority</div>
              <span style={{ fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>{complaint.priority}</span>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Submitted</div>
              <span style={{ fontWeight: '500', color: '#374151', fontSize: '0.9rem' }}>{apiUtils.formatDate(complaint.createdAt)}</span>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Contact</div>
              <span style={{ fontWeight: '500', color: '#374151', fontSize: '0.9rem' }}>{complaint.contactNumber || '—'}</span>
            </div>
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Description</div>
            <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '1rem', fontSize: '0.9rem', color: '#374151', lineHeight: 1.65, border: '1px solid #f1f5f9' }}>
              {complaint.description || 'No description provided.'}
            </div>
          </div>
          {imgUrl && (
            <div>
              <div style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Proof Photo</div>
              <img src={imgUrl} alt="Complaint proof" style={{ width: '100%', maxHeight: '260px', objectFit: 'cover', borderRadius: '12px', border: '2px solid #e5e7eb' }}
                onError={e => { e.target.style.display = 'none' }} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ active, setActive, currentUser, onLogout }) {
  const nav = [
    { key: 'dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
    { key: 'complaints', icon: 'bi-list-task', label: 'My Complaints' },
  ]
  return (
    <nav style={{ width: '230px', minWidth: '230px', background: THEME.gradient, display: 'flex', flexDirection: 'column', padding: '1.5rem 1rem', boxShadow: '4px 0 20px rgba(79,70,229,0.15)', position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2.5rem', padding: '0 0.25rem' }}>
        <img src={logo} alt="ICMS" style={{ width: '38px', height: '38px', objectFit: 'contain', mixBlendMode: 'screen' }} />
        <div>
          <div style={{ color: '#fff', fontWeight: '800', fontSize: '1.1rem' }}>ICMS</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>Student Portal</div>
        </div>
      </div>
      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.68rem', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>Menu</div>
      <div style={{ flex: 1 }}>
        {nav.map(n => (
          <button key={n.key} onClick={() => setActive(n.key)} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
            padding: '0.7rem 1rem', borderRadius: '10px', marginBottom: '4px',
            color: active === n.key ? '#fff' : 'rgba(255,255,255,0.65)',
            background: active === n.key ? 'rgba(255,255,255,0.18)' : 'transparent',
            fontWeight: active === n.key ? '700' : '500', fontSize: '0.9rem',
            border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
          }}
            onMouseOver={e => { if (active !== n.key) e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
            onMouseOut={e => { if (active !== n.key) e.currentTarget.style.background = 'transparent' }}
          >
            <i className={`bi ${n.icon}`} style={{ fontSize: '1rem', flexShrink: 0 }} />
            {n.label}
          </button>
        ))}
        <Link to="/raise-complaint" style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '0.7rem 1rem', borderRadius: '10px', marginBottom: '4px',
          color: 'rgba(255,255,255,0.65)', fontWeight: '500', fontSize: '0.9rem',
          textDecoration: 'none', transition: 'background 0.15s',
        }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          onMouseOut={e => e.currentTarget.style.background = 'transparent'}
        >
          <i className="bi bi-plus-circle" style={{ fontSize: '1rem' }} />
          Raise Complaint
        </Link>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem', padding: '0 0.25rem' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#fff', fontSize: '1rem', flexShrink: 0 }}>
            {currentUser ? currentUser.name.charAt(0).toUpperCase() : 'S'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ color: '#fff', fontWeight: '600', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser?.name || 'Student'}</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>Student</div>
          </div>
        </div>
        <button onClick={onLogout} style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px', padding: '0.55rem 1rem', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="bi bi-box-arrow-right" /> Logout
        </button>
      </div>
    </nav>
  )
}

// ─── Dashboard Home ────────────────────────────────────────────────────────────
function DashboardHome({ currentUser, complaints, loading, setActive }) {
  const total = complaints.length
  const pending = complaints.filter(c => c.status === 'PENDING').length
  const resolved = complaints.filter(c => c.status === 'RESOLVED').length
  const recent = [...complaints].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3)

  return (
    <div>
      <div style={{ background: THEME.gradient, borderRadius: '18px', padding: '2rem 2.25rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', boxShadow: '0 8px 30px rgba(79,70,229,0.25)' }}>
        <div>
          <h2 style={{ color: '#fff', fontWeight: '800', fontSize: '1.7rem', marginBottom: '0.3rem', letterSpacing: '-0.5px' }}>
            Welcome back, {currentUser?.name || 'Student'}! 👋
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', marginBottom: 0, fontSize: '1rem' }}>Manage your infrastructure complaints efficiently</p>
        </div>
        <Link to="/raise-complaint" style={{ background: '#fff', color: THEME.primary, fontWeight: '700', fontSize: '0.95rem', padding: '0.75rem 1.6rem', borderRadius: '10px', textDecoration: 'none', boxShadow: '0 4px 14px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '7px', transition: 'transform 0.15s' }}
          onMouseOver={e => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
          <i className="bi bi-plus-lg" /> Raise New Complaint
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Submitted', value: total, icon: 'bi-list-task', color: THEME.primary, bg: '#ede9fe' },
          { label: 'Pending', value: pending, icon: 'bi-clock-history', color: '#d97706', bg: '#fef3c7' },
          { label: 'Resolved', value: resolved, icon: 'bi-check-circle', color: '#059669', bg: '#d1fae5' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: '14px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #f1f5f9' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className={`bi ${s.icon}`} style={{ fontSize: '1.4rem', color: s.color }} />
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', color: '#6b7280', fontWeight: '500' }}>{s.label}</div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: '#111827', lineHeight: 1 }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f9fafb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h6 style={{ fontWeight: '700', margin: 0, color: '#111827', fontSize: '0.95rem' }}><i className="bi bi-clock-history me-2" style={{ color: THEME.primary }} />Recent Complaints</h6>
          <button onClick={() => setActive('complaints')} style={{ background: 'none', border: 'none', color: THEME.primary, fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer' }}>View all →</button>
        </div>
        <div style={{ padding: '0.5rem 1.5rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ width: '36px', height: '36px', border: '3px solid #e5e7eb', borderTopColor: THEME.primary, borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto' }} />
            </div>
          ) : recent.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem' }}>
              <i className="bi bi-inbox" style={{ fontSize: '2.5rem', color: '#d1d5db' }} />
              <p style={{ color: '#9ca3af', marginTop: '0.75rem' }}>No complaints yet. Raise your first one!</p>
              <Link to="/raise-complaint" style={{ display: 'inline-block', marginTop: '0.5rem', background: THEME.gradient, color: '#fff', padding: '0.6rem 1.5rem', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' }}>Raise Complaint</Link>
            </div>
          ) : recent.map(c => {
            const sc = STATUS_CFG[c.status] || STATUS_CFG.PENDING
            return (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.9rem 0', borderBottom: '1px solid #f9fafb' }}>
                <div>
                  <div style={{ fontWeight: '700', color: THEME.primary, fontSize: '0.875rem' }}>{c.complaintId}</div>
                  <div style={{ fontSize: '0.82rem', color: '#6b7280' }}>{c.category} · {c.location}</div>
                </div>
                <span style={{ background: sc.bg, color: sc.color, borderRadius: '20px', padding: '2px 12px', fontSize: '0.75rem', fontWeight: '700' }}>{sc.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── My Complaints Section ────────────────────────────────────────────────────
function MyComplaintsSection({ complaints, loading, onRefresh }) {
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const filtered = complaints.filter(c => {
    const q = search.toLowerCase()
    const matchSearch = !search || c.complaintId?.toLowerCase().includes(q) || c.category?.toLowerCase().includes(q) || c.location?.toLowerCase().includes(q)
    return matchSearch && (!filterStatus || c.status === filterStatus)
  })

  return (
    <div>
      <ComplaintDetailModal complaint={selected} onClose={() => setSelected(null)} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontWeight: '800', fontSize: '1.6rem', color: '#111827', margin: 0 }}>My Complaints</h2>
          <p style={{ color: '#6b7280', margin: '0.3rem 0 0', fontSize: '0.95rem' }}>{filtered.length} complaint(s) found</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={onRefresh} style={{ background: '#f3f4f6', border: 'none', color: '#374151', borderRadius: '8px', padding: '0.55rem 1.1rem', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <i className="bi bi-arrow-clockwise" /> Refresh
          </button>
          <Link to="/raise-complaint" style={{ background: THEME.gradient, border: 'none', color: '#fff', borderRadius: '8px', padding: '0.55rem 1.25rem', fontWeight: '700', fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 3px 10px rgba(79,70,229,0.3)' }}>
            <i className="bi bi-plus-lg" /> New Complaint
          </Link>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', padding: '1rem 1.25rem', marginBottom: '1.25rem', display: 'flex', gap: '0.75rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}><i className="bi bi-search" /></span>
          <input type="text" placeholder="Search complaints..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.65rem 0.75rem 0.65rem 2.1rem', borderRadius: '8px', border: '1.5px solid #e5e7eb', background: '#f9fafb', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          style={{ padding: '0.65rem 0.9rem', borderRadius: '8px', border: '1.5px solid #e5e7eb', background: '#f9fafb', fontSize: '0.875rem', outline: 'none', color: '#374151' }}>
          <option value="">All Statuses</option>
          {Object.entries(STATUS_CFG).map(([k, cfg]) => <option key={k} value={k}>{cfg.label}</option>)}
        </select>
      </div>

      <div style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid #e5e7eb', borderTopColor: THEME.primary, borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 1rem' }} />
            <p style={{ color: '#9ca3af' }}>Loading complaints...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <i className="bi bi-inbox" style={{ fontSize: '3rem', color: '#d1d5db' }} />
            <p style={{ color: '#9ca3af', marginTop: '1rem' }}>No complaints found.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9', background: '#fafafa' }}>
                  {['ID', 'Category', 'Location', 'Priority', 'Status', 'Photo', 'Date', 'Details'].map(h => (
                    <th key={h} style={{ padding: '0.85rem 1rem', textAlign: 'left', color: '#6b7280', fontWeight: '600', fontSize: '0.77rem', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => {
                  const sc = STATUS_CFG[c.status] || STATUS_CFG.PENDING
                  const imgUrl = apiUtils.getImageUrl(c.imagePath)
                  return (
                    <tr key={c.id} style={{ borderBottom: '1px solid #f9fafb' }}
                      onMouseOver={e => e.currentTarget.style.background = '#f9fafb'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '0.9rem 1rem', fontWeight: '700', color: THEME.primary, whiteSpace: 'nowrap' }}>{c.complaintId}</td>
                      <td style={{ padding: '0.9rem 1rem', color: '#374151' }}>{c.category}</td>
                      <td style={{ padding: '0.9rem 1rem', color: '#6b7280', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.location}</td>
                      <td style={{ padding: '0.9rem 1rem', color: '#374151', fontWeight: '500' }}>{c.priority}</td>
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <span style={{ background: sc.bg, color: sc.color, borderRadius: '20px', padding: '2px 12px', fontSize: '0.75rem', fontWeight: '700', whiteSpace: 'nowrap' }}>{sc.label}</span>
                      </td>
                      <td style={{ padding: '0.9rem 1rem' }}>
                        {imgUrl ? (
                          <img src={imgUrl} alt="proof" style={{ width: '44px', height: '36px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e5e7eb' }} onError={e => { e.target.style.display = 'none' }} />
                        ) : <span style={{ color: '#d1d5db', fontSize: '0.8rem' }}>—</span>}
                      </td>
                      <td style={{ padding: '0.9rem 1rem', color: '#9ca3af', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>{apiUtils.formatDate(c.createdAt)}</td>
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <button onClick={() => setSelected(c)} style={{ background: '#ede9fe', border: 'none', color: THEME.primary, borderRadius: '7px', padding: '0.35rem 0.9rem', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}>View</button>
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

// ─── Main Page ────────────────────────────────────────────────────────────────
function StudentDashboardPage() {
  const [currentUser, setCurrentUser] = useState(null)
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState('dashboard')
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser')
    if (!storedUser) { navigate('/'); return }
    const user = JSON.parse(storedUser)
    if (user.type !== 'student') { navigate('/'); return }
    setCurrentUser(user)
    loadComplaints()
  }, [navigate])

  const loadComplaints = useCallback(async () => {
    try {
      setLoading(true)
      const data = await complaintsAPI.getMyComplaints()
      setComplaints(data || [])
    } catch (err) {
      toast.error('Failed to load complaints')
    } finally { setLoading(false) }
  }, [])

  const logout = () => { localStorage.removeItem('currentUser'); navigate('/') }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <Sidebar active={active} setActive={setActive} currentUser={currentUser} onLogout={logout} />
      <main style={{ flex: 1, overflow: 'auto', minWidth: 0, display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '1600px', margin: '0 auto', padding: '2rem 1.5rem', boxSizing: 'border-box' }}>
          {active === 'dashboard'  && <DashboardHome currentUser={currentUser} complaints={complaints} loading={loading} setActive={setActive} />}
          {active === 'complaints' && <MyComplaintsSection complaints={complaints} loading={loading} onRefresh={loadComplaints} />}
        </div>
      </main>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default StudentDashboardPage
