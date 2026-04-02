import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { complaintsAPI } from '../backend-api'
import { toast } from 'react-toastify'
import logo from '../assets/vecteezy_modern-real-estate-and-construction-logo_19897563.png'

const GRADIENT = 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 60%, #7c3aed 100%)'
const PRIMARY = '#4f46e5'

const CATEGORIES = [
  { value: 'Electrical', icon: '⚡', desc: 'Wiring, lights, plugs, generators' },
  { value: 'Plumbing', icon: '🔧', desc: 'Pipes, taps, drainage, leaks' },
  { value: 'Furniture', icon: '🪑', desc: 'Broken chairs, desks, doors' },
  { value: 'Internet', icon: '📡', desc: 'WiFi, LAN, connectivity issues' },
  { value: 'Cleaning', icon: '🧹', desc: 'Hygiene, waste, sanitation' },
  { value: 'Security', icon: '🔒', desc: 'Locks, CCTV, access control' },
  { value: 'Other', icon: '📋', desc: 'Any other infrastructure issues' },
]
const PRIORITIES = [
  { value: 'LOW',    label: 'Low',    color: '#6b7280', bg: '#f9fafb', desc: 'Can wait a few days' },
  { value: 'MEDIUM', label: 'Medium', color: '#2563eb', bg: '#eff6ff', desc: 'Within 24–48 hours' },
  { value: 'HIGH',   label: 'High',   color: '#d97706', bg: '#fffbeb', desc: 'Needs quick attention' },
  { value: 'URGENT', label: 'Urgent', color: '#dc2626', bg: '#fef2f2', desc: 'Immediate action required' },
]
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

function RaiseComplaintPage() {
  const [currentUser, setCurrentUser] = useState(null)
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageError, setImageError] = useState('')
  const [dragOver, setDragOver] = useState(false)
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

  const logout = () => { localStorage.removeItem('currentUser'); navigate('/') }

  const handleImageFile = (file) => {
    setImageError('')
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setImageError('Please select an image file (JPG, PNG, GIF, WebP, etc.)')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setImageError(`File too large. Maximum size is 5MB. Your file: ${(file.size / 1024 / 1024).toFixed(1)}MB`)
      return
    }
    setImage(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleImageCapture = (e) => handleImageFile(e.target.files[0])

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    handleImageFile(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccessId('')
    try {
      setLoading(true)
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
    } catch {
      toast.error('Failed to submit complaint. Please try again.')
    } finally { setLoading(false) }
  }

  const inputStyle = {
    width: '100%', padding: '0.9rem 1.1rem', borderRadius: '10px',
    border: '1.5px solid #e5e7eb', background: '#f9fafb', fontSize: '0.95rem',
    color: '#111827', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s', fontFamily: 'inherit',
  }
  const labelStyle = { display: 'block', fontWeight: '600', color: '#374151', fontSize: '0.9rem', marginBottom: '0.45rem' }
  const cardStyle = { background: '#fff', borderRadius: '14px', padding: '1.5rem 1.75rem', marginBottom: '1.1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Left Sidebar */}
      <nav style={{ width: '230px', minWidth: '230px', background: GRADIENT, display: 'flex', flexDirection: 'column', padding: '1.5rem 1rem', boxShadow: '4px 0 20px rgba(79,70,229,0.15)', position: 'sticky', top: 0, height: '100vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2.5rem' }}>
          <img src={logo} alt="ICMS" style={{ width: '38px', height: '38px', objectFit: 'contain', mixBlendMode: 'screen' }} />
          <div>
            <div style={{ color: '#fff', fontWeight: '800', fontSize: '1.1rem' }}>ICMS</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>Student Portal</div>
          </div>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.68rem', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>Menu</div>
        <div style={{ flex: 1 }}>
          {[
            { to: '/student-dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
            { to: '/student-dashboard', icon: 'bi-list-task', label: 'My Complaints' },
          ].map(n => (
            <Link key={n.label} to={n.to} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.7rem 1rem', borderRadius: '10px', marginBottom: '4px', color: 'rgba(255,255,255,0.65)', fontWeight: '500', fontSize: '0.9rem', textDecoration: 'none', transition: 'background 0.15s' }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
              <i className={`bi ${n.icon}`} style={{ fontSize: '1rem' }} />{n.label}
            </Link>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.7rem 1rem', borderRadius: '10px', marginBottom: '4px', color: '#fff', fontWeight: '700', fontSize: '0.9rem', background: 'rgba(255,255,255,0.18)' }}>
            <i className="bi bi-plus-circle" style={{ fontSize: '1rem' }} />Raise Complaint
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#fff', flexShrink: 0 }}>
              {currentUser ? currentUser.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: '600', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>{currentUser?.name || 'Student'}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>Student</div>
            </div>
          </div>
          <button onClick={logout} style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px', padding: '0.55rem 1rem', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="bi bi-box-arrow-right" /> Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>
        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '2rem 1.5rem' }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <h1 style={{ fontWeight: '800', fontSize: '1.7rem', color: '#111827', marginBottom: '0.3rem', letterSpacing: '-0.5px' }}>Raise a New Complaint</h1>
            <p style={{ color: '#6b7280', fontSize: '0.95rem', marginBottom: 0 }}>Describe the issue and we'll get it resolved as soon as possible.</p>
          </div>

          {successId && (
            <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '14px', padding: '1.25rem 1.5rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '700', fontSize: '1rem', color: '#166534', marginBottom: '0.2rem' }}>Complaint Submitted Successfully!</div>
                <div style={{ color: '#16a34a', fontSize: '0.9rem' }}>ID: <strong style={{ fontFamily: 'monospace' }}>{successId}</strong></div>
                <div style={{ marginTop: '0.85rem', display: 'flex', gap: '0.75rem' }}>
                  <button onClick={() => setSuccessId('')} style={{ background: '#fff', border: '1.5px solid #86efac', color: '#166534', borderRadius: '8px', padding: '0.45rem 1.1rem', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer' }}>Submit Another</button>
                  <button onClick={() => navigate('/student-dashboard')} style={{ background: '#22c55e', border: 'none', color: '#fff', borderRadius: '8px', padding: '0.45rem 1.1rem', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer' }}>View Dashboard</button>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Category */}
            <div style={cardStyle}>
              <label style={labelStyle}><i className="bi bi-tag me-2" style={{ color: PRIMARY }} />Category</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '0.65rem', marginTop: '0.6rem' }}>
                {CATEGORIES.map(cat => (
                  <button key={cat.value} type="button" onClick={() => setCategory(cat.value)} style={{ padding: '0.75rem 0.9rem', borderRadius: '10px', border: `1.5px solid ${category === cat.value ? PRIMARY : '#e5e7eb'}`, background: category === cat.value ? '#ede9fe' : '#f9fafb', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', boxShadow: category === cat.value ? '0 0 0 3px rgba(79,70,229,0.1)' : 'none' }}>
                    <div style={{ fontSize: '1.3rem', marginBottom: '3px' }}>{cat.icon}</div>
                    <div style={{ fontWeight: '700', fontSize: '0.88rem', color: category === cat.value ? PRIMARY : '#111827' }}>{cat.value}</div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '1px' }}>{cat.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Location + Contact */}
            <div style={cardStyle}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.1rem' }}>
                <div>
                  <label style={labelStyle}><i className="bi bi-geo-alt me-2" style={{ color: PRIMARY }} />Location</label>
                  <input type="text" placeholder="e.g., Room 101, Building A" value={location} onChange={e => setLocation(e.target.value)} required style={inputStyle} />
                  <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '4px' }}>Be specific for faster resolution</div>
                </div>
                <div>
                  <label style={labelStyle}><i className="bi bi-telephone me-2" style={{ color: PRIMARY }} />Contact <span style={{ fontWeight: '400', color: '#9ca3af' }}>(optional)</span></label>
                  <input type="tel" placeholder="Phone for follow-up" value={contactNumber} onChange={e => setContactNumber(e.target.value)} style={inputStyle} />
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={cardStyle}>
              <label style={labelStyle}><i className="bi bi-text-paragraph me-2" style={{ color: PRIMARY }} />Description</label>
              <textarea rows={4} placeholder="Describe the issue — what happened, when it started, how severe..." value={description} onChange={e => setDescription(e.target.value)} required style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.65 }} />
            </div>

            {/* Priority */}
            <div style={cardStyle}>
              <label style={labelStyle}><i className="bi bi-exclamation-triangle me-2" style={{ color: PRIMARY }} />Priority Level</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '0.65rem', marginTop: '0.6rem' }}>
                {PRIORITIES.map(p => (
                  <button key={p.value} type="button" onClick={() => setPriority(p.value)} style={{ padding: '0.85rem 0.6rem', borderRadius: '10px', border: `1.5px solid ${priority === p.value ? p.color : '#e5e7eb'}`, background: priority === p.value ? p.bg : '#f9fafb', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s' }}>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem', color: priority === p.value ? p.color : '#374151' }}>{p.label}</div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '2px' }}>{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Upload */}
            <div style={cardStyle}>
              <label style={labelStyle}><i className="bi bi-camera me-2" style={{ color: PRIMARY }} />Photo of Issue <span style={{ fontWeight: '400', color: '#9ca3af' }}>(optional, max 5MB)</span></label>
              <input type="file" id="imageInput" accept="image/*" onChange={handleImageCapture} style={{ display: 'none' }} />

              {imageError && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.65rem 1rem', marginTop: '0.5rem', marginBottom: '0.75rem', color: '#dc2626', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="bi bi-exclamation-circle" />  {imageError}
                </div>
              )}

              {imagePreview ? (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginTop: '0.65rem' }}>
                  <div style={{ position: 'relative' }}>
                    <img src={imagePreview} alt="Preview" style={{ width: '160px', height: '120px', objectFit: 'cover', borderRadius: '10px', border: '2px solid #e5e7eb' }} />
                    <button type="button" onClick={() => { setImage(null); setImagePreview(null); setImageError('') }}
                      style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#374151', marginBottom: '4px' }}>✓ Photo attached</div>
                    <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '0.75rem' }}>{image?.name} · {(image?.size / 1024).toFixed(0)}KB</div>
                    <button type="button" onClick={() => document.getElementById('imageInput').click()}
                      style={{ background: 'none', border: '1.5px solid #e5e7eb', color: '#6b7280', borderRadius: '8px', padding: '0.45rem 1rem', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>
                      <i className="bi bi-arrow-repeat me-1" />Change Photo
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('imageInput').click()}
                  style={{ marginTop: '0.65rem', background: dragOver ? '#ede9fe' : '#f9fafb', border: `2px dashed ${dragOver ? PRIMARY : '#d1d5db'}`, borderRadius: '10px', padding: '1.75rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', transition: 'all 0.2s' }}>
                  <i className="bi bi-cloud-upload" style={{ fontSize: '2rem', color: dragOver ? PRIMARY : '#9ca3af' }} />
                  <span style={{ fontWeight: '600', fontSize: '0.9rem', color: '#374151' }}>Click to upload or drag & drop</span>
                  <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>JPG, PNG, GIF, WebP — Max 5MB</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
              <Link to="/student-dashboard" style={{ background: '#fff', border: '1.5px solid #e5e7eb', color: '#374151', borderRadius: '10px', padding: '0.8rem 1.75rem', fontWeight: '600', fontSize: '0.95rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>Cancel</Link>
              <button type="submit" disabled={loading || !category || !priority}
                style={{ background: (!category || !priority || loading) ? '#e5e7eb' : GRADIENT, color: (!category || !priority || loading) ? '#9ca3af' : '#fff', border: 'none', borderRadius: '10px', padding: '0.8rem 2.25rem', fontSize: '0.95rem', fontWeight: '700', cursor: (!category || !priority || loading) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', boxShadow: (!category || !priority || loading) ? 'none' : '0 4px 14px rgba(79,70,229,0.35)' }}>
                {loading ? (
                  <><span style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.6s linear infinite' }} />Submitting...</>
                ) : (<><i className="bi bi-send" /> Submit Complaint</>)}
              </button>
            </div>
            {(!category || !priority) && <p style={{ textAlign: 'right', fontSize: '0.82rem', color: '#9ca3af', marginTop: '0.5rem' }}>Please select a category and priority to submit</p>}
          </form>

          {/* Guidelines */}
          <div style={{ ...cardStyle, marginTop: '1.5rem' }}>
            <h6 style={{ fontWeight: '700', fontSize: '0.95rem', color: '#111827', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="bi bi-info-circle" style={{ color: PRIMARY }} /> Submission Guidelines
            </h6>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '0.75rem' }}>
              {['Be specific and detailed in your description', 'Provide accurate location for faster response', 'Set priority based on actual urgency', 'Attach a photo when possible — helps a lot', 'Submit only genuine infrastructure complaints', 'Track status from your student dashboard'].map((tip, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.85rem', color: '#4b5563' }}>
                  <span style={{ color: '#22c55e', fontWeight: '700', flexShrink: 0 }}>✓</span>{tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } input:focus, textarea:focus, select:focus { border-color: ${PRIMARY} !important; box-shadow: 0 0 0 3px rgba(79,70,229,0.1); }`}</style>
    </div>
  )
}

export default RaiseComplaintPage