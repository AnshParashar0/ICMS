import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { complaintsAPI, apiUtils } from '../backend-api'
import logo from '../assets/vecteezy_modern-real-estate-and-construction-logo_19897563.png'

// ── Lightweight SVG Pie Chart (no external deps) ──────────────────────────────
function PieChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  if (total === 0) return <div style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem' }}>No data</div>
  let cumAngle = -Math.PI / 2
  const slices = data.map((d) => {
    const angle = (d.value / total) * 2 * Math.PI
    const x1 = 80 + 70 * Math.cos(cumAngle)
    const y1 = 80 + 70 * Math.sin(cumAngle)
    cumAngle += angle
    const x2 = 80 + 70 * Math.cos(cumAngle)
    const y2 = 80 + 70 * Math.sin(cumAngle)
    const large = angle > Math.PI ? 1 : 0
    return { ...d, x1, y1, x2, y2, large, angle }
  })
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <svg width="160" height="160" viewBox="0 0 160 160">
        {slices.map((s, i) => (
          s.angle > 0.01 && (
            <path key={i}
              d={`M80,80 L${s.x1},${s.y1} A70,70 0 ${s.large},1 ${s.x2},${s.y2} Z`}
              fill={s.color} stroke="#fff" strokeWidth="2"
            />
          )
        ))}
        <circle cx="80" cy="80" r="32" fill="#fff" />
        <text x="80" y="76" textAnchor="middle" fontSize="11" fill="#6b7280" fontWeight="600">Total</text>
        <text x="80" y="92" textAnchor="middle" fontSize="18" fill="#111827" fontWeight="800">{total}</text>
      </svg>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: '#374151' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: d.color, flexShrink: 0 }} />
            {d.label}: <strong>{d.value}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Lightweight CSS Bar Chart (no external deps) ──────────────────────────────
function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '180px', padding: '0 0.5rem' }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: '4px' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#4f46e5' }}>{d.value}</span>
          <div style={{
            width: '100%', background: 'linear-gradient(180deg, #818cf8, #4f46e5)',
            borderRadius: '4px 4px 0 0', height: `${(d.value / max) * 140}px`,
            minHeight: d.value > 0 ? '6px' : '0', transition: 'height 0.4s ease',
          }} />
          <span style={{ fontSize: '0.65rem', color: '#9ca3af', textAlign: 'center', lineHeight: 1.2, wordBreak: 'break-word' }}>{d.label}</span>
        </div>
      ))}
    </div>
  )
}

const THEME = {
  gradient: 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 60%, #7c3aed 100%)',
  primary: '#4f46e5',
  primaryDark: '#3730a3',
}

function AdminDashboardPage() {
  const [currentUser, setCurrentUser] = useState(null)
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterPriority, setFilterPriority] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser')
    if (!storedUser) { navigate('/'); return }
    const user = JSON.parse(storedUser)
    if (user.type !== 'admin') { navigate('/'); return }
    setCurrentUser(user)
    loadComplaints()
  }, [navigate])

  const loadComplaints = async () => {
    try {
      setLoading(true)
      const data = await complaintsAPI.getAllComplaints()
      setComplaints(data || [])
    } catch (err) {
      toast.error('Failed to load complaints')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      setUpdatingId(id)
      await complaintsAPI.updateComplaintStatus(id, newStatus)
      setComplaints((prev) => prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c)))
      toast.success(`Status updated to ${newStatus.replace('_', ' ')}`)
    } catch (err) {
      toast.error('Failed to update status. Please try again.')
    } finally {
      setUpdatingId(null)
    }
  }

  const logout = () => { localStorage.removeItem('currentUser'); navigate('/') }

  const total = complaints.length
  const pending = complaints.filter((c) => c.status === 'PENDING').length
  const inProgress = complaints.filter((c) => c.status === 'IN_PROGRESS').length
  const resolved = complaints.filter((c) => c.status === 'RESOLVED').length

  const filteredComplaints = complaints.filter((c) => {
    const matchSearch = !search ||
      c.complaintId?.toLowerCase().includes(search.toLowerCase()) ||
      c.studentName?.toLowerCase().includes(search.toLowerCase()) ||
      c.category?.toLowerCase().includes(search.toLowerCase()) ||
      c.location?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !filterStatus || c.status === filterStatus
    const matchCategory = !filterCategory || c.category === filterCategory
    const matchPriority = !filterPriority || c.priority === filterPriority
    return matchSearch && matchStatus && matchCategory && matchPriority
  })

  const recentComplaints = [...complaints]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  const statusColor = (status) => {
    if (status === 'PENDING') return { color: '#d97706', bg: '#fef3c7' }
    if (status === 'IN_PROGRESS') return { color: '#2563eb', bg: '#dbeafe' }
    return { color: '#059669', bg: '#d1fae5' }
  }

  const priorityColor = (priority) => {
    if (priority === 'URGENT') return { color: '#dc2626', bg: '#fee2e2' }
    if (priority === 'HIGH') return { color: '#d97706', bg: '#fef3c7' }
    if (priority === 'MEDIUM') return { color: '#2563eb', bg: '#dbeafe' }
    return { color: '#6b7280', bg: '#f3f4f6' }
  }

  const statusPieData = [
    { label: 'Pending', value: pending, color: '#eab308' },
    { label: 'In Progress', value: inProgress, color: '#3b82f6' },
    { label: 'Resolved', value: resolved, color: '#22c55e' },
  ]

  const categories = [...new Set(complaints.map((c) => c.category).filter(Boolean))]
  const categoryBarData = categories.map((cat) => ({
    label: cat,
    value: complaints.filter((c) => c.category === cat).length,
  }))

  const statCards = [
    { label: 'Total', value: total, icon: 'bi-list-task', color: THEME.primary, bg: '#ede9fe' },
    { label: 'Pending', value: pending, icon: 'bi-clock-history', color: '#d97706', bg: '#fef3c7' },
    { label: 'In Progress', value: inProgress, icon: 'bi-arrow-repeat', color: '#2563eb', bg: '#dbeafe' },
    { label: 'Resolved', value: resolved, icon: 'bi-check-circle', color: '#059669', bg: '#d1fae5' },
  ]

  const sidebarNavStyle = (active) => ({
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '0.65rem 1rem', borderRadius: '10px', marginBottom: '4px',
    color: active ? '#fff' : 'rgba(255,255,255,0.65)',
    background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
    fontWeight: active ? '600' : '500', fontSize: '0.9rem', cursor: 'default',
  })

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar */}
      <nav style={{
        width: '240px', minWidth: '240px', background: THEME.gradient,
        display: 'flex', flexDirection: 'column', padding: '1.5rem 1rem',
        boxShadow: '4px 0 20px rgba(79,70,229,0.15)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2.5rem', padding: '0 0.25rem' }}>
          <img src={logo} alt="ICMS" style={{ width: '40px', height: '40px', objectFit: 'contain', mixBlendMode: 'screen' }} />
          <div>
            <div style={{ color: '#fff', fontWeight: '800', fontSize: '1.1rem', letterSpacing: '-0.3px' }}>ICMS</div>
            <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.7rem' }}>Admin Panel</div>
          </div>
        </div>

        {/* Nav */}
        <div style={{ flex: 1 }}>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>Menu</div>
          <div style={sidebarNavStyle(true)}>
            <i className="bi bi-speedometer2" /> Dashboard
          </div>
        </div>

        {/* User + Logout */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '1rem', marginTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem', padding: '0 0.25rem' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#fff', flexShrink: 0 }}>
              {currentUser ? currentUser.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ color: '#fff', fontWeight: '600', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser ? currentUser.name : 'Admin'}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem' }}>Administrator</div>
            </div>
          </div>
          <button onClick={logout} style={{
            width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff', borderRadius: '8px', padding: '0.55rem 1rem', fontWeight: '600',
            fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
            transition: 'background 0.2s',
          }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            <i className="bi bi-box-arrow-right" /> Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        {/* Top bar */}
        <div style={{ background: '#fff', borderBottom: '1px solid #f1f5f9', padding: '1.1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10, boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
          <div>
            <h4 style={{ fontWeight: '800', color: '#111827', margin: 0, fontSize: '1.2rem', letterSpacing: '-0.3px' }}>Admin Dashboard</h4>
            <p style={{ color: '#9ca3af', margin: 0, fontSize: '0.82rem' }}>Overview of all infrastructure complaints</p>
          </div>
          <button onClick={loadComplaints} style={{ background: THEME.gradient, border: 'none', color: '#fff', borderRadius: '8px', padding: '0.5rem 1.25rem', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 3px 10px rgba(79,70,229,0.3)' }}>
            <i className="bi bi-arrow-clockwise" /> Refresh
          </button>
        </div>

        <div style={{ padding: '2rem' }}>
          {/* Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
            {statCards.map((stat) => (
              <div key={stat.label} style={{ background: '#fff', borderRadius: '14px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #f1f5f9' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className={`bi ${stat.icon}`} style={{ fontSize: '1.4rem', color: stat.color }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#6b7280', fontWeight: '500', marginBottom: '0.15rem' }}>{stat.label}</div>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: '#111827', lineHeight: 1 }}>{stat.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          {complaints.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.25rem', marginBottom: '2rem' }}>
              <div style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f9fafb' }}>
                  <h6 style={{ fontWeight: '700', margin: 0, color: '#111827', fontSize: '0.95rem' }}><i className="bi bi-pie-chart me-2" style={{ color: THEME.primary }} />Status Overview</h6>
                </div>
                <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                  <PieChart data={statusPieData} />
                </div>
              </div>
              <div style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f9fafb' }}>
                  <h6 style={{ fontWeight: '700', margin: 0, color: '#111827', fontSize: '0.95rem' }}><i className="bi bi-bar-chart me-2" style={{ color: THEME.primary }} />Complaints by Category</h6>
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <BarChart data={categoryBarData} />
                </div>
              </div>
            </div>
          )}

          {/* Search & Filter */}
          <div style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', padding: '1.25rem 1.5rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>
                  <i className="bi bi-search" />
                </span>
                <input type="text" placeholder="Search by ID, student, category, location..."
                  value={search} onChange={(e) => setSearch(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem 0.75rem 0.7rem 2.25rem', borderRadius: '8px', border: '1.5px solid #e5e7eb', background: '#f9fafb', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              {[
                { val: filterStatus, set: setFilterStatus, opts: [['', 'All Statuses'], ['PENDING', 'Pending'], ['IN_PROGRESS', 'In Progress'], ['RESOLVED', 'Resolved']] },
                { val: filterCategory, set: setFilterCategory, opts: [['', 'All Categories'], ['Electrical', 'Electrical'], ['Plumbing', 'Plumbing'], ['Furniture', 'Furniture'], ['Internet', 'Internet'], ['Cleaning', 'Cleaning'], ['Security', 'Security'], ['Other', 'Other']] },
                { val: filterPriority, set: setFilterPriority, opts: [['', 'All Priorities'], ['LOW', 'Low'], ['MEDIUM', 'Medium'], ['HIGH', 'High'], ['URGENT', 'Urgent']] },
              ].map((sel, i) => (
                <select key={i} value={sel.val} onChange={(e) => sel.set(e.target.value)}
                  style={{ padding: '0.7rem 0.75rem', borderRadius: '8px', border: '1.5px solid #e5e7eb', background: '#f9fafb', fontSize: '0.875rem', outline: 'none', color: '#374151' }}>
                  {sel.opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              ))}
            </div>
            {(search || filterStatus || filterCategory || filterPriority) && (
              <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>Showing {filteredComplaints.length} of {total} complaints</span>
                <button onClick={() => { setSearch(''); setFilterStatus(''); setFilterCategory(''); setFilterPriority('') }}
                  style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', padding: 0 }}>
                  Clear filters ×
                </button>
              </div>
            )}
          </div>

          {/* Table + Recent side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
            {/* All Complaints Table */}
            <div style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f9fafb' }}>
                <h5 style={{ fontWeight: '700', margin: 0, color: '#111827', fontSize: '1rem' }}>
                  <i className="bi bi-list-ul me-2" style={{ color: THEME.primary }} />All Complaints
                </h5>
              </div>
              <div style={{ padding: '0 1rem' }}>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ width: '40px', height: '40px', border: '3px solid #e5e7eb', borderTopColor: THEME.primary, borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 1rem' }} />
                    <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Loading...</p>
                  </div>
                ) : filteredComplaints.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <i className="bi bi-inbox" style={{ fontSize: '3rem', color: '#d1d5db' }} />
                    <p style={{ color: '#9ca3af', marginTop: '1rem' }}>No complaints found.</p>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                          {['ID', 'Student', 'Category', 'Priority', 'Status', 'Date', 'Action'].map(h => (
                            <th key={h} style={{ padding: '0.75rem 0.75rem', textAlign: 'left', color: '#6b7280', fontWeight: '600', fontSize: '0.77rem', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredComplaints.map((complaint) => {
                          const sc = statusColor(complaint.status)
                          const pc = priorityColor(complaint.priority)
                          return (
                            <tr key={complaint.id} style={{ borderBottom: '1px solid #f9fafb', transition: 'background 0.15s' }}
                              onMouseOver={e => e.currentTarget.style.background = '#f9fafb'}
                              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                            >
                              <td style={{ padding: '0.85rem 0.75rem', fontWeight: '700', color: THEME.primary, whiteSpace: 'nowrap' }}>{complaint.complaintId}</td>
                              <td style={{ padding: '0.85rem 0.75rem', color: '#374151' }}>{complaint.studentName}</td>
                              <td style={{ padding: '0.85rem 0.75rem', color: '#374151' }}>{complaint.category}</td>
                              <td style={{ padding: '0.85rem 0.75rem' }}>
                                <span style={{ background: pc.bg, color: pc.color, borderRadius: '20px', padding: '2px 10px', fontSize: '0.75rem', fontWeight: '700' }}>{complaint.priority}</span>
                              </td>
                              <td style={{ padding: '0.85rem 0.75rem' }}>
                                <span style={{ background: sc.bg, color: sc.color, borderRadius: '20px', padding: '2px 10px', fontSize: '0.75rem', fontWeight: '700', whiteSpace: 'nowrap' }}>
                                  {complaint.status === 'IN_PROGRESS' ? 'In Progress' : complaint.status.charAt(0) + complaint.status.slice(1).toLowerCase()}
                                </span>
                              </td>
                              <td style={{ padding: '0.85rem 0.75rem', color: '#9ca3af', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>{apiUtils.formatDate(complaint.createdAt)}</td>
                              <td style={{ padding: '0.85rem 0.75rem' }}>
                                {updatingId === complaint.id ? (
                                  <div style={{ width: '20px', height: '20px', border: '2px solid #e5e7eb', borderTopColor: THEME.primary, borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                                ) : (
                                  <select value={complaint.status} onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                                    style={{ padding: '0.35rem 0.5rem', borderRadius: '7px', border: '1.5px solid #e5e7eb', background: '#f9fafb', fontSize: '0.8rem', outline: 'none', minWidth: '120px', color: '#374151', cursor: 'pointer' }}>
                                    <option value="PENDING">Pending</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="RESOLVED">Resolved</option>
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

            {/* Recent Complaints */}
            <div style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f9fafb' }}>
                <h5 style={{ fontWeight: '700', margin: 0, color: '#111827', fontSize: '1rem' }}>
                  <i className="bi bi-clock-history me-2" style={{ color: THEME.primary }} />Recent
                </h5>
              </div>
              <div style={{ padding: '1rem' }}>
                {recentComplaints.length === 0 ? (
                  <p style={{ color: '#9ca3af', textAlign: 'center', padding: '1.5rem 0', fontSize: '0.9rem' }}>No recent complaints.</p>
                ) : recentComplaints.map((complaint) => {
                  const sc = statusColor(complaint.status)
                  return (
                    <div key={complaint.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0.9rem 0', borderBottom: '1px solid #f9fafb' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: '700', color: THEME.primary, fontSize: '0.875rem', marginBottom: '2px' }}>{complaint.complaintId}</div>
                        <div style={{ fontSize: '0.78rem', color: '#6b7280', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{complaint.category} • {complaint.location}</div>
                        <span style={{ background: sc.bg, color: sc.color, borderRadius: '20px', padding: '1px 8px', fontSize: '0.7rem', fontWeight: '700' }}>
                          {complaint.status === 'IN_PROGRESS' ? 'In Progress' : complaint.status.charAt(0) + complaint.status.slice(1).toLowerCase()}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginLeft: '0.5rem', whiteSpace: 'nowrap' }}>{apiUtils.formatDate(complaint.createdAt)}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default AdminDashboardPage