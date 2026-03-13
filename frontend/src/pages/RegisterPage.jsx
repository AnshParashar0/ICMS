import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI, apiUtils } from '../backend-api'

function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [userType, setUserType] = useState('student')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      setLoading(true)
      await authAPI.register({
        name: fullName,
        email,
        password,
        contactNumber: '',
      })

      const loginResponse = await authAPI.login({ email, password })
      const currentUser = {
        email: loginResponse.user.email,
        name: loginResponse.user.name,
        type: loginResponse.user.role.toLowerCase(),
      }
      localStorage.setItem('currentUser', JSON.stringify(currentUser))

      setSuccess('Registration successful! Redirecting...')

      if (currentUser.type === 'admin') {
        navigate('/admin-dashboard')
      } else {
        navigate('/student-dashboard')
      }
    } catch (err) {
      const message = apiUtils.handleError(err, 'Registration failed')
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
                    <i className="bi bi-person-plus" /> Register
                  </h2>
                  <p className="text-muted">Create your ICMS account</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="fullName" className="form-label">
                      <i className="bi bi-person" /> Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="fullName"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>

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

                  <div className="mb-3">
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
                    <div className="form-text">Password must be at least 6 characters</div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">
                      <i className="bi bi-lock-fill" /> Confirm Password
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      id="confirmPassword"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
                      <option value="student">Student</option>
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
                          Registering...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-person-check" /> Register
                        </>
                      )}
                    </button>
                  </div>

                  {error && (
                    <div className="alert alert-danger" role="alert">
                      <i className="bi bi-exclamation-triangle" /> {error}
                    </div>
                  )}

                  {success && (
                    <div className="alert alert-success" role="alert">
                      <i className="bi bi-check-circle" /> {success}
                    </div>
                  )}
                </form>

                <div className="text-center mt-4">
                  <p className="mb-0">
                    Already have an account?{' '}
                    <Link to="/" className="text-primary text-decoration-none">
                      Login here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage

