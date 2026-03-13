import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { complaintsAPI, apiUtils } from '../backend-api'

function StudentDashboardPage() {
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
    if (user.type !== 'student') {
      navigate('/')
      return
    }
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

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container-fluid">
          <span className="navbar-brand fw-bold">
            <i className="bi bi-building"></i> ICMS
          </span>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <span className="nav-link active">
                  <i className="bi bi-speedometer2"></i> Dashboard
                </span>
              </li>
              <li className="nav-item">
                <Link to="/raise-complaint" className="nav-link">
                  <i className="bi bi-plus-circle"></i> Raise Complaint
                </Link>
              </li>
            </ul>

            <ul className="navbar-nav">
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn btn-link text-white text-decoration-none"
                  id="navbarDropdown"
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-person-circle"></i>{' '}
                  <span>{currentUser ? currentUser.name : 'Student'}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <button className="dropdown-item" onClick={logout}>
                      <i className="bi bi-box-arrow-right"></i> Logout
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm rounded-3 mb-4">
              <div className="card-body p-4">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <h3 className="fw-bold text-primary mb-2">
                      Welcome back, <span>{currentUser ? currentUser.name : 'Student'}</span>!
                    </h3>
                    <p className="text-muted mb-0">Manage your infrastructure complaints efficiently</p>
                  </div>
                  <div className="col-md-4 text-md-end mt-3 mt-md-0">
                    <Link to="/raise-complaint" className="btn btn-success btn-lg">
                      <i className="bi bi-plus-lg"></i> Raise New Complaint
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-4 mb-3">
                <div className="card border-0 shadow-sm rounded-3 h-100">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0">
                        <div className="bg-primary bg-opacity-10 rounded-circle p-3">
                          <i className="bi bi-list-task text-primary fs-4"></i>
                        </div>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <h6 className="text-muted mb-1">Total Complaints</h6>
                        <h3 className="fw-bold mb-0">{totalComplaints}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4 mb-3">
                <div className="card border-0 shadow-sm rounded-3 h-100">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0">
                        <div className="bg-warning bg-opacity-10 rounded-circle p-3">
                          <i className="bi bi-clock-history text-warning fs-4"></i>
                        </div>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <h6 className="text-muted mb-1">Pending</h6>
                        <h3 className="fw-bold mb-0">{pendingComplaints}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4 mb-3">
                <div className="card border-0 shadow-sm rounded-3 h-100">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0">
                        <div className="bg-success bg-opacity-10 rounded-circle p-3">
                          <i className="bi bi-check-circle text-success fs-4"></i>
                        </div>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <h6 className="text-muted mb-1">Resolved</h6>
                        <h3 className="fw-bold mb-0">{resolvedComplaints}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm rounded-3">
              <div className="card-header bg-white border-0 pt-4 px-4">
                <h5 className="fw-bold mb-0">
                  <i className="bi bi-list-ul"></i> My Complaints
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
                    <p className="text-muted mt-3">
                      No complaints found. Raise your first complaint!
                    </p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>ID</th>
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
        </div>
      </div>
    </div>
  )
}

export default StudentDashboardPage

