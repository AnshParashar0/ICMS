import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI, apiUtils } from '../backend-api'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password || !userType) {
      setError('Please fill in all fields')
      return
    }

    try {
      setLoading(true)
      const response = await authAPI.login({ email, password })

      const currentUser = {
        email: response.user.email,
        name: response.user.name,
        type: response.user.role.toLowerCase(),
      }

      localStorage.setItem('currentUser', JSON.stringify(currentUser))

      if (currentUser.type === 'admin') {
        navigate('/admin-dashboard')
      } else {
        navigate('/student-dashboard')
      }
    } catch (err) {
      const message = apiUtils.handleError(err, 'Login failed')
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-light vh-100 d-flex align-items-center justify-content-center">
      <div className="container-fluid">
        <div className="row w-100">
          <div className="col-md-6 col-lg-4 mx-auto">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary">
                    <i className="bi bi-building" /> ICMS
                  </h2>
                  <p className="text-muted">Infrastructure Complaint Management System</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      <i className="bi bi-envelope" /> Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      id="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">
                      <i className="bi bi-lock" /> Password
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      id="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <select
                      className="form-select form-select-lg"
                      id="userType"
                      value={userType}
                      onChange={(e) => setUserType(e.target.value)}
                      required
                    >
                      <option value="">Select User Type</option>
                      <option value="student">Student</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div className="d-grid mb-3">
                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Logging in...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-box-arrow-in-right" /> Login
                        </>
                      )}
                    </button>
                  </div>

                  {error && (
                    <div className="alert alert-danger" role="alert">
                      <i className="bi bi-exclamation-triangle" /> {error}
                    </div>
                  )}
                </form>

                <div className="text-center mt-4">
                  <p className="mb-0">
                    Don&apos;t have an account?{' '}
                    <Link to="/register" className="text-primary text-decoration-none">
                      Register here
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-3">
              <small className="text-muted">
                Demo: Use any email/password with Student or Admin selection
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

