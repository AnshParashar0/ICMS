import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { complaintsAPI, apiUtils } from '../backend-api'

function AdminDashboardPage() {
  const [currentUser, setCurrentUser] = useState(null)
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser')
    if (!storedUser) {
      navigate('/')
      return
    }
    const user = JSON.parse(storedUser)
    if (user.type !== 'admin') {
      navigate('/')
      return
    }
    setCurrentUser(user)
    loadComplaints()
  }, [navigate])

  const loadComplaints = async () => {
    try {
      setLoading(true)
      const data = await complaintsAPI.getAllComplaints()
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

  const total = complaints.length
  const pending = complaints.filter((c) => c.status === 'PENDING').length
  const inProgress = complaints.filter((c) => c.status === 'IN_PROGRESS').length
  const resolved = complaints.filter((c) => c.status === 'RESOLVED').length

  const recentComplaints = [...complaints]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  return (
    <div className="d-flex">
      <nav className="sidebar text-white p-3">
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

      <main className="flex-grow-1 p-4" style={{ marginLeft: 0 }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold mb-1">Admin Dashboard</h3>
            <p className="text-muted mb-0">Overview of all infrastructure complaints</p>
          </div>
          <button className="btn btn-outline-secondary" onClick={loadComplaints}>
            <i className="bi bi-arrow-clockwise me-1"></i> Refresh
          </button>
        </div>

        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm rounded-3 h-100">
              <div className="card-body p-3">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-primary bg-opacity-10 rounded-circle p-3">
                      <i className="bi bi-list-task text-primary fs-4"></i>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="text-muted mb-1">Total</h6>
                    <h3 className="fw-bold mb-0">{total}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm rounded-3 h-100">
              <div className="card-body p-3">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-warning bg-opacity-10 rounded-circle p-3">
                      <i className="bi bi-clock-history text-warning fs-4"></i>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="text-muted mb-1">Pending</h6>
                    <h3 className="fw-bold mb-0">{pending}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm rounded-3 h-100">
              <div className="card-body p-3">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-info bg-opacity-10 rounded-circle p-3">
                      <i className="bi bi-arrow-repeat text-info fs-4"></i>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="text-muted mb-1">In Progress</h6>
                    <h3 className="fw-bold mb-0">{inProgress}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm rounded-3 h-100">
              <div className="card-body p-3">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-success bg-opacity-10 rounded-circle p-3">
                      <i className="bi bi-check-circle text-success fs-4"></i>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="text-muted mb-1">Resolved</h6>
                    <h3 className="fw-bold mb-0">{resolved}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8 mb-4">
            <div className="card border-0 shadow-sm rounded-3 h-100">
              <div className="card-header bg-white border-0 pt-4 px-4">
                <h5 className="fw-bold mb-0">
                  <i className="bi bi-list-ul"></i> All Complaints
                </h5>
              </div>
              <div className="card-body p-4">
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : complaints.length === 0 ? (
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
                          <th>Location</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {complaints.map((complaint) => (
                          <tr key={complaint.id} className="fade-in">
                            <td>
                              <strong>{complaint.complaintId}</strong>
                            </td>
                            <td>{complaint.studentName}</td>
                            <td>{complaint.category}</td>
                            <td>{complaint.location}</td>
                            <td
                              dangerouslySetInnerHTML={{
                                __html: apiUtils.getStatusBadge(complaint.status),
                              }}
                            />
                            <td>{apiUtils.formatDate(complaint.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-4 mb-4">
            <div className="card border-0 shadow-sm rounded-3 h-100">
              <div className="card-header bg-white border-0 pt-4 px-4">
                <h5 className="fw-bold mb-0">
                  <i className="bi bi-clock-history"></i> Recent Complaints
                </h5>
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
                            <div className="small text-muted">
                              {complaint.category} • {complaint.location}
                            </div>
                          </div>
                          <div className="text-end small text-muted">
                            {apiUtils.formatDate(complaint.createdAt)}
                          </div>
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

