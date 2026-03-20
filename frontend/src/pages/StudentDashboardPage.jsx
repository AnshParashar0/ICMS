import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { complaintsAPI, apiUtils } from '../backend-api'
import logo from '../assets/vecteezy_modern-real-estate-and-construction-logo_19897563.png'

const THEME = {
  gradient: 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 60%, #7c3aed 100%)',
  primary: '#4f46e5',
  primaryDark: '#3730a3',
  accent: '#7c3aed',
}

function StudentDashboardPage() {
  const [currentUser, setCurrentUser] = useState(null)
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser')
    if (!storedUser) { navigate('/'); return }
    const user = JSON.parse(storedUser)
    if (user.type !== 'student') { navigate('/'); return }
    setCurrentUser(user)
    loadComplaints()
  }, [navigate])

  const loadComplaints = async () => {
    try {
      setLoading(true)
      const data = await complaintsAPI.getMyComplaints()
      setComplaints(data || [])
    } catch (err) {
      apiUtils.handleError(err, 'Failed to load complaints')
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('currentUser')
    navigate('/')
  }

  const totalComplaints = complaints.length
  const pendingComplaints = complaints.filter((c) => c.status === 'PENDING').length
  const resolvedComplaints = complaints.filter((c) => c.status === 'RESOLVED').length

  const statCards = [
    { label: 'Total Complaints', value: totalComplaints, icon: 'bi-list-task', color: THEME.primary, bg: '#ede9fe' },
    { label: 'Pending', value: pendingComplaints, icon: 'bi-clock-history', color: '#d97706', bg: '#fef3c7' },
    { label: 'Resolved', value: resolvedComplaints, icon: 'bi-check-circle', color: '#059669', bg: '#d1fae5' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Navbar */}
      <nav style={{ background: THEME.gradient, boxShadow: '0 2px 16px rgba(79,70,229,0.18)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', height: '64px' }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={logo} alt="ICMS" style={{ width: '38px', height: '38px', objectFit: 'contain', mixBlendMode: 'screen' }} />
            <span style={{ color: '#fff', fontWeight: '800', fontSize: '1.15rem', letterSpacing: '-0.3px' }}>ICMS</span>
          </div>

          {/* Nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'rgba(255,255,255,0.95)', fontWeight: '600', fontSize: '0.9rem', padding: '0.45rem 1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.15)', cursor: 'default' }}>
              <i className="bi bi-speedometer2 me-1" /> Dashboard
            </span>
            <Link to="/raise-complaint" style={{ color: 'rgba(255,255,255,0.8)', fontWeight: '500', fontSize: '0.9rem', padding: '0.45rem 1rem', borderRadius: '8px', textDecoration: 'none', transition: 'background 0.2s' }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >
              <i className="bi bi-plus-circle me-1" /> Raise Complaint
            </Link>
          </div>

          {/* User */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.9rem' }}>
                {currentUser ? currentUser.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{currentUser ? currentUser.name : 'Student'}</span>
            </div>
            <button onClick={logout} style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', borderRadius: '8px', padding: '0.4rem 1rem', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
            >
              <i className="bi bi-box-arrow-right me-1" /> Logout
            </button>
          </div>
        </div>
      </nav>

      <div style={{ padding: '2rem 2.5rem' }}>
        {/* Welcome Banner */}
        <div style={{ background: THEME.gradient, borderRadius: '18px', padding: '2rem 2.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', boxShadow: '0 8px 30px rgba(79,70,229,0.25)' }}>
          <div>
            <h2 style={{ color: '#fff', fontWeight: '800', fontSize: '1.6rem', marginBottom: '0.3rem', letterSpacing: '-0.5px' }}>
              Welcome back, {currentUser ? currentUser.name : 'Student'}! 👋
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 0, fontSize: '1rem' }}>
              Manage your infrastructure complaints efficiently
            </p>
          </div>
          <Link to="/raise-complaint" style={{
            background: '#fff', color: THEME.primary, fontWeight: '700', fontSize: '0.95rem',
            padding: '0.75rem 1.75rem', borderRadius: '10px', textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '7px',
            transition: 'transform 0.15s',
          }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <i className="bi bi-plus-lg" /> Raise New Complaint
          </Link>
        </div>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          {statCards.map((stat) => (
            <div key={stat.label} style={{ background: '#fff', borderRadius: '14px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #f1f5f9' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i className={`bi ${stat.icon}`} style={{ fontSize: '1.4rem', color: stat.color }} />
              </div>
              <div>
                <div style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '0.2rem', fontWeight: '500' }}>{stat.label}</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#111827', lineHeight: 1 }}>{stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Complaints Table */}
        <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
          <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h5 style={{ fontWeight: '700', margin: 0, color: '#111827', fontSize: '1.05rem' }}>
              <i className="bi bi-list-ul me-2" style={{ color: THEME.primary }} />My Complaints
            </h5>
            <button onClick={loadComplaints} style={{ background: '#f3f4f6', border: 'none', borderRadius: '8px', padding: '0.4rem 1rem', fontSize: '0.85rem', fontWeight: '600', color: '#374151', cursor: 'pointer' }}>
              <i className="bi bi-arrow-clockwise me-1" /> Refresh
            </button>
          </div>
          <div style={{ padding: '1.5rem 2rem' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid #e5e7eb', borderTopColor: THEME.primary, borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 1rem' }} />
                <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Loading complaints...</p>
              </div>
            ) : complaints.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <i className="bi bi-inbox" style={{ fontSize: '3rem', color: '#d1d5db' }} />
                <p style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.95rem' }}>No complaints yet. Raise your first complaint!</p>
                <Link to="/raise-complaint" style={{ display: 'inline-block', marginTop: '0.5rem', background: THEME.gradient, color: '#fff', padding: '0.6rem 1.5rem', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' }}>
                  Raise Complaint
                </Link>
              </div>
            ) : (
              <div className="table-responsive">
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                      {['ID', 'Category', 'Location', 'Status', 'Date'].map(h => (
                        <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#6b7280', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {complaints.map((complaint) => (
                      <tr key={complaint.id} style={{ borderBottom: '1px solid #f9fafb', transition: 'background 0.15s' }}
                        onMouseOver={e => e.currentTarget.style.background = '#f9fafb'}
                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '0.9rem 1rem', fontWeight: '700', color: THEME.primary }}>{complaint.complaintId}</td>
                        <td style={{ padding: '0.9rem 1rem', color: '#374151' }}>{complaint.category}</td>
                        <td style={{ padding: '0.9rem 1rem', color: '#374151' }}>{complaint.location}</td>
                        <td style={{ padding: '0.9rem 1rem' }}
                          dangerouslySetInnerHTML={{ __html: apiUtils.getStatusBadge(complaint.status) }}
                        />
                        <td style={{ padding: '0.9rem 1rem', color: '#9ca3af', fontSize: '0.85rem' }}>{apiUtils.formatDate(complaint.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default StudentDashboardPage
