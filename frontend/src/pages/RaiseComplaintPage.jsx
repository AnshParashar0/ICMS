import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { complaintsAPI } from '../backend-api'
import { toast } from 'react-toastify'
import logo from '../assets/vecteezy_modern-real-estate-and-construction-logo_19897563.png'

function RaiseComplaintPage() {
  const [currentUser, setCurrentUser] = useState(null)
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [successId, setSuccessId] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser')
    if (!storedUser) { navigate('/'); return }
    const user = JSON.parse(storedUser)
    if (user.type !== 'student') { navigate('/'); return }
    setCurrentUser(user)
  }, [navigate])

  const logout = () => {
    localStorage.removeItem('currentUser')
    navigate('/')
  }

  const handleImageCapture = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccessId('')

    try {
      setLoading(true)

      // ✅ Send as FormData instead of JSON
      const formData = new FormData()
      formData.append('category', category)
      formData.append('location', location)
      formData.append('description', description)
      formData.append('priority', priority)
      if (contactNumber) formData.append('contactNumber', contactNumber)
      if (image) formData.append('image', image)

      const newComplaint = await complaintsAPI.createComplaint(formData)
      setSuccessId(newComplaint.complaintId)
      toast.success('Complaint submitted successfully! 🎉')
      setCategory(''); setLocation(''); setDescription('')
      setPriority(''); setContactNumber(''); setImage(null); setImagePreview(null)
    } catch (err) {
      toast.error('Failed to submit complaint. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/student-dashboard">
            <img src={logo} alt="ICMS" style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
            ICMS
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/student-dashboard">
                  <i className="bi bi-speedometer2"></i> Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <span className="nav-link active">
                  <i className="bi bi-plus-circle"></i> Raise Complaint
                </span>
              </li>
            </ul>
            <ul className="navbar-nav">
              <li className="nav-item dropdown">
                <button className="nav-link dropdown-toggle btn btn-link text-white text-decoration-none" id="navbarDropdown" data-bs-toggle="dropdown">
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
          <div className="col-lg-8 mx-auto">
            <div className="text-center mb-4">
              <h2 className="fw-bold text-primary">
                <i className="bi bi-plus-circle"></i> Raise New Complaint
              </h2>
              <p className="text-muted">Fill in the details below to submit your infrastructure complaint</p>
            </div>

            <div className="card border-0 shadow-sm rounded-3">
              <div className="card-body p-5">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="category" className="form-label fw-semibold">
                      <i className="bi bi-tag"></i> Category
                    </label>
                    <select className="form-select form-select-lg" id="category" value={category} onChange={(e) => setCategory(e.target.value)} required>
                      <option value="">Select Category</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Plumbing">Plumbing</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Internet">Internet</option>
                      <option value="Cleaning">Cleaning</option>
                      <option value="Security">Security</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="location" className="form-label fw-semibold">
                      <i className="bi bi-geo-alt"></i> Location
                    </label>
                    <input type="text" className="form-control form-control-lg" id="location" placeholder="e.g., Room 101, Building A, Library" value={location} onChange={(e) => setLocation(e.target.value)} required />
                    <div className="form-text">Be specific about the location for faster resolution</div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="description" className="form-label fw-semibold">
                      <i className="bi bi-text-paragraph"></i> Description
                    </label>
                    <textarea className="form-control" id="description" rows="5" placeholder="Please describe the issue in detail..." value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                    <div className="form-text">Provide as much detail as possible to help us resolve the issue quickly</div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="priority" className="form-label fw-semibold">
                      <i className="bi bi-exclamation-triangle"></i> Priority Level
                    </label>
                    <select className="form-select form-select-lg" id="priority" value={priority} onChange={(e) => setPriority(e.target.value)} required>
                      <option value="">Select Priority</option>
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="contactNumber" className="form-label fw-semibold">
                      <i className="bi bi-telephone"></i> Contact Number (Optional)
                    </label>
                    <input type="tel" className="form-control form-control-lg" id="contactNumber" placeholder="Your contact number for follow-up" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
                  </div>

                  {/* ✅ Camera capture section */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-camera"></i> Photo of Issue (Optional)
                    </label>
                    <div className="d-flex flex-column align-items-start gap-3">
                      <input
                        type="file"
                        id="imageCapture"
                        accept="image/*"
                        capture="environment"
                        onChange={handleImageCapture}
                        style={{ display: 'none' }}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => document.getElementById('imageCapture').click()}
                      >
                        <i className="bi bi-camera me-2"></i>
                        {imagePreview ? 'Retake Photo' : 'Take Photo'}
                      </button>

                      {imagePreview && (
                        <div style={{ position: 'relative' }}>
                          <img
                            src={imagePreview}
                            alt="Complaint"
                            style={{ width: '200px', height: '150px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #e2e8f0' }}
                          />
                          <button
                            type="button"
                            onClick={() => { setImage(null); setImagePreview(null) }}
                            style={{
                              position: 'absolute', top: '-8px', right: '-8px',
                              background: '#ef4444', color: 'white', border: 'none',
                              borderRadius: '50%', width: '24px', height: '24px',
                              cursor: 'pointer', fontSize: '12px'
                            }}
                          >✕</button>
                        </div>
                      )}
                    </div>
                    <div className="form-text">Take a photo of the issue using your camera</div>
                  </div>

                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <Link to="/student-dashboard" className="btn btn-outline-secondary btn-lg">
                      <i className="bi bi-x-circle"></i> Cancel
                    </Link>
                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                      {loading ? (
                        <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Submitting...</>
                      ) : (
                        <><i className="bi bi-send"></i> Submit Complaint</>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {successId && (
              <div className="card border-0 shadow-sm rounded-3 mt-4">
                <div className="card-body p-4">
                  <h5 className="fw-bold text-success">
                    <i className="bi bi-check-circle"></i> Complaint Submitted Successfully!
                  </h5>
                  <p className="mb-2">Your complaint has been registered successfully.</p>
                  <p className="mb-0">Complaint ID: <strong>{successId}</strong></p>
                  <div className="mt-3">
                    <button type="button" className="btn btn-secondary me-2" onClick={() => setSuccessId('')}>Submit Another</button>
                    <button type="button" className="btn btn-primary" onClick={() => navigate('/student-dashboard')}>View Dashboard</button>
                  </div>
                </div>
              </div>
            )}

            <div className="card border-0 shadow-sm rounded-3 mt-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3"><i className="bi bi-info-circle"></i> Guidelines for Submitting Complaints</h5>
                <ul className="mb-0">
                  <li className="mb-2">Be specific and detailed in your description</li>
                  <li className="mb-2">Provide accurate location information</li>
                  <li className="mb-2">Set appropriate priority level based on urgency</li>
                  <li className="mb-2">Take a clear photo of the issue if possible</li>
                  <li className="mb-0">Submit only genuine complaints related to infrastructure</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RaiseComplaintPage