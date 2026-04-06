import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../backend-api'
import { toast } from 'react-toastify'
import logo from '../assets/vecteezy_modern-real-estate-and-construction-logo_19897563.png'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const validate = () => {
    let valid = true
    setEmailError(''); setPasswordError(''); setFormError('')
    if (!email) { setEmailError('Email is required'); valid = false }
    if (!password) { setPasswordError('Password is required'); valid = false }
    return valid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    try {
      setLoading(true)
      const response = await authAPI.login({ email, password })
      const currentUser = {
        email: response.user.email,
        name: response.user.name,
        type: response.user.role.toLowerCase(),
      }
      localStorage.setItem('currentUser', JSON.stringify(currentUser))
      toast.success(`Welcome back, ${currentUser.name}! 👋`)
      if (currentUser.type === 'admin') navigate('/admin-dashboard')
      else navigate('/student-dashboard')
    } catch {
      setFormError('Invalid email or password. Please try again.')
    } finally { setLoading(false) }
  }

  const features = [
    { icon: '📋', title: 'Smart Complaint Submission', desc: 'Submit infrastructure issues with category, priority, location & photos in seconds.' },
    { icon: '📊', title: 'Real-Time Status Tracking', desc: 'Monitor complaint progress from Pending → In Progress → Resolved.' },
    { icon: '📈', title: 'Admin Analytics Dashboard', desc: 'Centralized view with charts, filters, and category-wise analytics.' },
    { icon: '🔒', title: 'Role-Based Access Control', desc: 'Separate secure portals for students and administrators.' },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left Panel */}
      <div style={{ flex: '0 0 42%', background: 'linear-gradient(155deg,#0f0e1a 0%,#1e1b4b 40%,#312e81 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', padding: '3rem', color: 'white', position: 'relative', overflow: 'hidden' }}
        className="d-none d-lg-flex">
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.2) 0%,transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.18) 0%,transparent 70%)' }} />

        <div className="w-100">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img src={logo} alt="ICMS Logo" style={{ width: '54px', height: '54px', objectFit: 'contain', mixBlendMode: 'screen', flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: '800', fontSize: '1.5rem', letterSpacing: '-0.5px' }}>ICMS</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.6, marginTop: '1px' }}>Infrastructure Complaint Management System</div>
            </div>
          </div>
        </div>

        <div className="w-100" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: '2.5rem', paddingBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', lineHeight: 1.25, marginBottom: '0.6rem', letterSpacing: '-0.5px' }}>
            Everything you need to<br />
            <span style={{ color: '#a5b4fc' }}>manage campus infrastructure</span>
          </h2>
          <p style={{ opacity: 0.65, fontSize: '1rem', lineHeight: 1.65, marginBottom: '2.5rem' }}>
            A unified platform built for educational institutions to streamline complaint resolution.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {features.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1rem 1.25rem', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(4px)' }}>
                <div style={{ fontSize: '1.4rem', flexShrink: 0, marginTop: '2px' }}>{f.icon}</div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '3px' }}>{f.title}</div>
                  <div style={{ fontSize: '0.875rem', opacity: 0.6, lineHeight: 1.55 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-100" style={{ display: 'flex', gap: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
          {[{ value: '500+', label: 'Complaints Resolved' }, { value: '98%', label: 'Satisfaction Rate' }, { value: '< 24h', label: 'Avg. Resolution' }].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#a5b4fc' }}>{s.value}</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#ffffff', overflowY: 'auto', minWidth: 0 }}>
        {/* Centered form */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 2rem' }}>
          <div style={{ width: '100%', maxWidth: '600px', minHeight: '15vh', overflowY: 'auto' }}>

            {/* Mobile Logo */}
            <div className="d-lg-none mb-4">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src={logo} alt="ICMS Logo" style={{ width: '44px', height: '44px', objectFit: 'contain' }} />
                <span style={{ fontWeight: '800', fontSize: '1.2rem', color: '#1e1b4b' }}>ICMS</span>
              </div>
            </div>

            <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f0e1a', marginBottom: '0.4rem', letterSpacing: '-1px', lineHeight: 1.15 }}>Welcome back</h1>
            <p style={{ color: '#6b7280', fontSize: '1rem', marginBottom: '2rem', lineHeight: 1.5 }}>Sign in to your ICMS account to continue</p>

            {formError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '0.85rem 1.1rem', marginBottom: '1.25rem', color: '#dc2626', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', fontSize: '0.9rem', marginBottom: '0.45rem' }}>Email address</label>
                <input type="email" id="email" placeholder="you@university.edu" value={email}
                  onChange={e => { setEmail(e.target.value); setEmailError('') }}
                  style={{ width: '100%', padding: '0.9rem 1.1rem', borderRadius: '10px', border: `1.5px solid ${emailError ? '#f87171' : '#e5e7eb'}`, background: '#f9fafb', fontSize: '0.95rem', color: '#111827', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }} />
                {emailError && <div style={{ color: '#dc2626', fontSize: '0.82rem', marginTop: '4px' }}>{emailError}</div>}
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', fontSize: '0.9rem', marginBottom: '0.45rem' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? 'text' : 'password'} id="password" placeholder="Enter your password" value={password}
                    onChange={e => { setPassword(e.target.value); setPasswordError('') }}
                    style={{ width: '100%', padding: '0.9rem 3rem 0.9rem 1.1rem', borderRadius: '10px', border: `1.5px solid ${passwordError ? '#f87171' : '#e5e7eb'}`, background: '#f9fafb', fontSize: '0.95rem', color: '#111827', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center' }}
                    aria-label="Toggle password visibility">
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {passwordError && <div style={{ color: '#dc2626', fontSize: '0.82rem', marginTop: '4px' }}>{passwordError}</div>}
              </div>

              <div style={{ textAlign: 'right', marginBottom: '1.75rem' }}>
                <a href="#" style={{ color: '#4f46e5', fontSize: '0.9rem', fontWeight: '600', textDecoration: 'none' }}
                  onMouseOver={e => e.target.style.textDecoration = 'underline'}
                  onMouseOut={e => e.target.style.textDecoration = 'none'}>Forgot Password?</a>
              </div>

              <button type="submit" disabled={loading} style={{ width: '100%', background: 'linear-gradient(135deg,#4f46e5,#6d28d9)', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '1rem', fontSize: '1rem', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.8 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'opacity 0.2s,transform 0.1s', boxShadow: '0 4px 14px rgba(79,70,229,0.35)', letterSpacing: '0.01em' }}
                onMouseOver={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)' }}>
                {loading ? (
                  <>
                    <span style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.6s linear infinite' }} />
                    Signing in...
                  </>
                ) : 'Sign in →'}
              </button>
            </form>

            <p style={{ marginTop: '1.75rem', color: '#6b7280', fontSize: '0.95rem', textAlign: 'center' }}>
              Don&apos;t have an account?{' '}
              <Link to="/register" style={{ color: '#4f46e5', fontWeight: '700', textDecoration: 'none' }}>Create one here</Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #f3f4f6', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src={logo} alt="ICMS Logo" style={{ width: '26px', height: '26px', objectFit: 'contain' }} />
              <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1f2937' }}>ICMS</span>
            </div>
            <a href="#" style={{ color: '#9ca3af', fontSize: '0.82rem', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ color: '#9ca3af', fontSize: '0.82rem', textDecoration: 'none' }}>Terms of Use</a>
          </div>
          <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>© 2025 ICMS</span>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus { border-color: #6d28d9 !important; box-shadow: 0 0 0 3px rgba(109,40,217,0.1); }
      `}</style>
    </div>
  )
}

export default LoginPage