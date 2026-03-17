import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { complaintsAPI, apiUtils } from '../backend-api'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

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
      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      )
      toast.success(`Status updated to ${newStatus.replace('_', ' ')}`)
    } catch (err) {
      toast.error('Failed to update status. Please try again.')
    } finally {
      setUpdatingId(null)
    }
  }

  const logout = () => {
    localStorage.removeItem('currentUser')
    navigate('/')
  }

  // Stats
  const total = complaints.length
  const pending = complaints.filter((c) => c.status === 'PENDING').length
  const inProgress = complaints.filter((c) => c.status === 'IN_PROGRESS').length
  const resolved = complaints.filter((c) => c.status === 'RESOLVED').length

  // Filtered complaints
  const filteredComplaints = complaints.filter((c) => {
    const matchSearch =
      !search ||
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

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDING': return 'status-badge status-pending'
      case 'IN_PROGRESS': return 'status-badge status-in-progress'
      case 'RESOLVED': return 'status-badge status-resolved'
      default: return 'status-badge status-pending'
    }
  }

  // Chart data
  const statusChartData = {
    labels: ['Pending', 'In Progress', 'Resolved'],
    datasets: [{
      data: [pending, inProgress, resolved],
      backgroundColor: ['#fef3c7', '#dbeafe', '#d1fae5'],
      borderColor: ['#eab308', '#3b82f6', '#22c55e'],
      borderWidth: 2,
    }]
  }

  const categories = [...new Set(complaints.map((c) => c.category).filter(Boolean))]
  const categoryChartData = {
    labels: categories,
    datasets: [{
      label: 'Complaints',
      data: categories.map((cat) => complaints.filter((c) => c.category === cat).length),
      backgroundColor: '#818cf8',
      borderColor: '#4f46e5',
      borderWidth: 2,
      borderRadius: 6,
    }]
  }

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <nav className="sidebar text-white p-3" style={{ width: '220px', minWidth: '220px' }}>
        <h4 className="text-white mb-4 d-flex align-items-center">
          <i className="bi bi-building me-2"></i> ICMS Admin
        </h4>
        <ul className="nav flex-column mb-4">
          <li className="nav-item">
            <span className="nav-link active text-white">
              <i className="bi bi-speedometer2 me-2"></i> Dashboard
            </span>
          </li>
        </ul>
        <div className="mt-auto">
          <div className="text-white-50 small mb-2">
            <i className="bi bi-person-circle me-1"></i>
            {currentUser ? currentUser.name : 'Admin'}
          </div>
          <button className="btn btn-outline-light btn-sm w-100" onClick={logout}>
            <i className="bi bi-box-arrow-right me-1"></i> Logout
          </button>
        </div>
      </nav>

      <main className="flex-grow-1 p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold mb-1">Admin Dashboard</h3>
            <p className="text-muted mb-0">Overview of all infrastructure complaints</p>
          </div>
          <button className="btn btn-outline-secondary" onClick={loadComplaints}>
            <i className="bi bi-arrow-clockwise me-1"></i> Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="row mb-4">
          {[
            { label: 'Total', value: total, icon: 'bi-list-task', color: 'primary' },
            { label: 'Pending', value: pending, icon: 'bi-clock-history', color: 'warning' },
            { label: 'In Progress', value: inProgress, icon: 'bi-arrow-repeat', color: 'info' },
            { label: 'Resolved', value: resolved, icon: 'bi-check-circle', color: 'success' },
          ].map((stat) => (
            <div className="col-md-3 mb-3" key={stat.label}>
              <div className="card border-0 shadow-sm rounded-3 h-100">
                <div className="card-body p-3">
                  <div className="d-flex align-items-center">
                    <div className={`bg-${stat.color} bg-opacity-10 rounded-circle p-3`}>
                      <i className={`bi ${stat.icon} text-${stat.color} fs-4`}></i>
                    </div>
                    <div className="ms-3">
                      <h6 className="text-muted mb-1">{stat.label}</h6>
                      <h3 className="fw-bold mb-0">{stat.value}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        {complaints.length > 0 && (
          <div className="row mb-4">
            <div className="col-md-4 mb-3">
              <div className="card border-0 shadow-sm rounded-3 h-100">
                <div className="card-header bg-white border-0 pt-4 px-4">
                  <h6 className="fw-bold mb-0"><i className="bi bi-pie-chart me-2"></i>Status Overview</h6>
                </div>
                <div className="card-body d-flex justify-content-center align-items-center" style={{ maxHeight: '250px' }}>
                  <Pie data={statusChartData} options={{ maintainAspectRatio: true, plugins: { legend: { position: 'bottom' } } }} />
                </div>
              </div>
            </div>
            <div className="col-md-8 mb-3">
              <div className="card border-0 shadow-sm rounded-3 h-100">
                <div className="card-header bg-white border-0 pt-4 px-4">
                  <h6 className="fw-bold mb-0"><i className="bi bi-bar-chart me-2"></i>Complaints by Category</h6>
                </div>
                <div className="card-body" style={{ maxHeight: '250px' }}>
                  <Bar
                    data={categoryChartData}
                    options={{
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search & Filter */}
        <div className="card border-0 shadow-sm rounded-3 mb-3">
          <div className="card-body p-3">
            <div className="row g-2">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="🔍 Search by ID, student, category, location..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <select className="form-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </div>
              <div className="col-md-3">
                <select className="form-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                  <option value="">All Categories</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Internet">Internet</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Security">Security</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="col-md-2">
                <select className="form-select" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                  <option value="">All Priorities</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
            </div>
            {(search || filterStatus || filterCategory || filterPriority) && (
              <div className="mt-2">
                <small className="text-muted">
                  Showing {filteredComplaints.length} of {total} complaints
                </small>
                <button
                  className="btn btn-sm btn-link text-danger p-0 ms-2"
                  onClick={() => { setSearch(''); setFilterStatus(''); setFilterCategory(''); setFilterPriority('') }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="row">
          {/* Complaints Table */}
          <div className="col-lg-8 mb-4">
            <div className="card border-0 shadow-sm rounded-3">
              <div className="card-header bg-white border-0 pt-4 px-4">
                <h5 className="fw-bold mb-0"><i className="bi bi-list-ul"></i> All Complaints</h5>
              </div>
              <div className="card-body p-4">
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status" />
                  </div>
                ) : filteredComplaints.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-inbox text-muted fs-1"></i>
                    <p className="text-muted mt-3">No complaints found.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Student</th>
                          <th>Category</th>
                          <th>Priority</th>
                          <th>Status</th>
                          <th>Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredComplaints.map((complaint) => (
                          <tr key={complaint.id}>
                            <td><strong>{complaint.complaintId}</strong></td>
                            <td>{complaint.studentName}</td>
                            <td>{complaint.category}</td>
                            <td>
                              <span className={`badge ${
                                complaint.priority === 'URGENT' ? 'bg-danger' :
                                complaint.priority === 'HIGH' ? 'bg-warning text-dark' :
                                complaint.priority === 'MEDIUM' ? 'bg-info text-dark' : 'bg-secondary'
                              }`}>
                                {complaint.priority}
                              </span>
                            </td>
                            <td>
                              <span className={getStatusBadgeClass(complaint.status)}>
                                {complaint.status === 'IN_PROGRESS' ? 'In Progress' :
                                  complaint.status.charAt(0) + complaint.status.slice(1).toLowerCase()}
                              </span>
                            </td>
                            <td>{apiUtils.formatDate(complaint.createdAt)}</td>
                            <td>
                              {updatingId === complaint.id ? (
                                <div className="spinner-border spinner-border-sm text-primary" role="status" />
                              ) : (
                                <select
                                  className="form-select form-select-sm"
                                  style={{ minWidth: '130px' }}
                                  value={complaint.status}
                                  onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                                >
                                  <option value="PENDING">Pending</option>
                                  <option value="IN_PROGRESS">In Progress</option>
                                  <option value="RESOLVED">Resolved</option>
                                </select>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Complaints */}
          <div className="col-lg-4 mb-4">
            <div className="card border-0 shadow-sm rounded-3">
              <div className="card-header bg-white border-0 pt-4 px-4">
                <h5 className="fw-bold mb-0"><i className="bi bi-clock-history"></i> Recent Complaints</h5>
              </div>
              <div className="card-body p-4">
                {recentComplaints.length === 0 ? (
                  <p className="text-muted mb-0">No recent complaints.</p>
                ) : (
                  <ul className="list-group list-group-flush">
                    {recentComplaints.map((complaint) => (
                      <li key={complaint.id} className="list-group-item px-0">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <div className="fw-semibold">{complaint.complaintId}</div>
                            <div className="small text-muted">{complaint.category} • {complaint.location}</div>
                            <span className={getStatusBadgeClass(complaint.status)} style={{ fontSize: '0.7rem' }}>
                              {complaint.status === 'IN_PROGRESS' ? 'In Progress' :
                                complaint.status.charAt(0) + complaint.status.slice(1).toLowerCase()}
                            </span>
                          </div>
                          <div className="text-end small text-muted">{apiUtils.formatDate(complaint.createdAt)}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboardPage