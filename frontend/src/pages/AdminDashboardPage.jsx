import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { complaintsAPI, workersAPI } from '../backend-api'
import { STATUS_CFG } from '../utils/constants'

import Sidebar from '../components/common/Sidebar'
import OverviewSection from '../components/overview/OverviewSection'
import ComplaintsTable from '../components/complaints/ComplaintsTable'
import AnalyticsDashboard from '../components/analytics/AnalyticsDashboard'
import WorkersSection from './WorkersSection'

export default function AdminDashboardPage() {
  const [currentUser, setCurrentUser] = useState(null)
  const [complaints,  setComplaints]  = useState([])
  const [workers,     setWorkers]     = useState([])
  const [loading,     setLoading]     = useState(true)
  const [updatingId,  setUpdatingId]  = useState(null)
  const [active,      setActive]      = useState('overview')
  const navigate = useNavigate()

  // ── Auth guard ──────────────────────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem('currentUser')
    if (!stored) { navigate('/'); return }
    const user = JSON.parse(stored)
    if (user.type !== 'admin') { navigate('/'); return }
    setCurrentUser(user)
    loadAll()
  }, [navigate])

  // ── Data fetching ───────────────────────────────────────────
  const loadAll = useCallback(async () => {
    try {
      setLoading(true)
      const [c, w] = await Promise.all([
        complaintsAPI.getAllComplaints(),
        workersAPI.getAllWorkers(),
      ])
      setComplaints(c || [])
      setWorkers(w || [])
    } catch {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Status update ───────────────────────────────────────────
  const handleStatusChange = async (id, newStatus) => {
    try {
      setUpdatingId(id)
      await complaintsAPI.updateComplaintStatus(id, newStatus)
      setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c))
      toast.success(`Status updated to ${STATUS_CFG[newStatus]?.label || newStatus}`)
    } catch {
      toast.error('Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  // ── Logout ──────────────────────────────────────────────────
  const logout = () => { localStorage.removeItem('currentUser'); navigate('/') }

  // ── Render ──────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: active === 'analytics' ? '#0a0e1a' : '#f8fafc' }}>

      <Sidebar
        active={active}
        setActive={setActive}
        currentUser={currentUser}
        onLogout={logout}
      />

      <main style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>
        {/* Overview — light theme */}
        {active === 'overview' && (
          <div style={{ maxWidth: '1900px', margin: '0 auto', padding: '2rem 1.5rem', boxSizing: 'border-box' }}>
            <OverviewSection complaints={complaints} workers={workers} setActive={setActive} />
          </div>
        )}

        {/* Complaints — light theme */}
        {active === 'complaints' && (
          <div style={{ maxWidth: '1900px', margin: '0 auto', padding: '2rem 1.5rem', boxSizing: 'border-box' }}>
            <ComplaintsTable
              complaints={complaints}
              loading={loading}
              onRefresh={loadAll}
              onStatusChange={handleStatusChange}
              updatingId={updatingId}
            />
          </div>
        )}

        {/* Analytics — dark theme */}
        {active === 'analytics' && (
          <AnalyticsDashboard complaints={complaints} loading={loading} />
        )}

        {/* Workers — light theme */}
        {active === 'workers' && (
          <div style={{ maxWidth: '1900px', margin: '0 auto', padding: '2rem 1.5rem', boxSizing: 'border-box' }}>
            <WorkersSection workers={workers} onRefresh={loadAll} />
          </div>
        )}
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}