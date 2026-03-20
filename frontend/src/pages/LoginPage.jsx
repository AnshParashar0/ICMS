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
      if (currentUser.type === 'admin') {
        navigate('/admin-dashboard')
      } else {
        navigate('/student-dashboard')
      }
    } catch (err) {
      setFormError('Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const LeftPanel = () => (
    <div style={{
      flex: '0 0 calc(50% - 200px)',
      background: 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 50%, #7c3aed 100%)',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'space-between', alignItems: 'center',
      padding: '3rem', color: 'white', position: 'relative', overflow: 'hidden'
    }}
      className="d-none d-lg-flex"
    >
      <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
      <div style={{ position: 'absolute', bottom: '-100px', left: '-60px', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

      {/* Logo */}
      <div className="w-100">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img
            src={logo}
            alt="ICMS Logo"
            style={{ width: '58px', height: '58px', objectFit: 'contain', mixBlendMode: 'screen', flexShrink: 0 }}
          />
          <div>
            <div style={{ fontWeight: '800', fontSize: '1.25rem', letterSpacing: '-0.5px' }}>ICMS</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Infrastructure Complaint System</div>
          </div>
        </div>
      </div>

      {/* Middle */}
      <div className="w-100">
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', lineHeight: 1.3, marginBottom: '1rem' }}>
          Resolve infrastructure issues <span style={{ color: '#a5f3fc' }}>faster than ever</span>
        </h2>
        <p style={{ opacity: 0.8, marginBottom: '2rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
          Submit, track and manage campus infrastructure complaints all in one place.
        </p>

        {/* Mini Dashboard Preview */}
        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '16px', padding: '1.25rem', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
            {[
              { label: 'Total', value: '124', color: '#818cf8' },
              { label: 'Pending', value: '38', color: '#fbbf24' },
              { label: 'Resolved', value: '86', color: '#34d399' },
            ].map((stat) => (
              <div key={stat.label} style={{ flex: 1, background: 'rgba(255,255,255,0.08)', borderRadius: '10px', padding: '0.75rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: '800', color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>{stat.label}</div>
              </div>
            ))}
          </div>
          {[
            { id: 'CMP001', cat: 'Electrical', status: 'Resolved', color: '#34d399' },
            { id: 'CMP002', cat: 'Plumbing', status: 'In Progress', color: '#60a5fa' },
            { id: 'CMP003', cat: 'Internet', status: 'Pending', color: '#fbbf24' },
          ].map((item) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: '600' }}>{item.id}</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>{item.cat}</div>
              </div>
              <div style={{ fontSize: '0.7rem', fontWeight: '600', color: item.color, background: 'rgba(255,255,255,0.08)', borderRadius: '20px', padding: '2px 10px' }}>
                {item.status}
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '2rem' }}>
          {[
            { value: '500+', label: 'Complaints Resolved' },
            { value: '98%', label: 'Satisfaction Rate' },
            { value: '24h', label: 'Avg Resolution' },
          ].map((stat) => (
            <div key={stat.label}>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#a5f3fc' }}>{stat.value}</div>
              <div style={{ fontSize: '0.72rem', opacity: 0.7 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonial */}
      <div className="w-100" style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '14px', padding: '1.25rem', border: '1px solid rgba(255,255,255,0.12)' }}>
        <div style={{ fontSize: '0.9rem', opacity: 0.9, fontStyle: 'italic', marginBottom: '0.75rem', lineHeight: 1.5 }}>
          &ldquo;ICMS helped us resolve our lab&apos;s electrical issue within 24 hours. The tracking system is excellent!&rdquo;
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #a855f7, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.9rem' }}>R</div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>Rahul Sharma</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>Computer Science, 3rd Year</div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      <LeftPanel />

      {/* Right Side - Pod.ai style */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: '#ffffff',
        overflowY: 'auto',
        minWidth: 0,
      }}>
        {/* Main content area */}
        <div style={{ flex: 1, padding: '3rem 3.5rem 2rem' }}>

          {/* Mobile Logo */}
          <div className="d-lg-none mb-4">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src={logo} alt="ICMS Logo" style={{ width: '44px', height: '44px', objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.15))' }} />
              <span style={{ fontWeight: '800', fontSize: '1.1rem', color: '#1e1b4b' }}>ICMS</span>
            </div>
          </div>

          {/* Header */}
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#111827', marginBottom: '0.4rem', letterSpacing: '-1px', lineHeight: 1.15 }}>
            Welcome to ICMS!
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1.15rem', marginBottom: '2.25rem', lineHeight: 1.5 }}>
            Ensuring every infrastructure issue reaches resolution.
          </p>

          {/* Institution search box */}
          <div style={{
            background: '#f3f0ff',
            borderRadius: '14px',
            padding: '1.4rem 1.5rem',
            marginBottom: '2rem',
            position: 'relative',
          }}>
            <p style={{ fontWeight: '700', color: '#1f2937', fontSize: '1rem', marginBottom: '0.9rem' }}>
              Search for your institution or department to proceed to log in.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Please specify the name of your institution or department"
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.75rem 0.75rem 2.6rem',
                    borderRadius: '10px',
                    border: '1.5px solid #e5e7eb',
                    background: '#ffffff',
                    fontSize: '0.875rem',
                    color: '#374151',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              {/* Decorative figure */}
              <div style={{ flexShrink: 0 }}>
                <svg width="64" height="72" viewBox="0 0 64 72" fill="none">
                  <circle cx="32" cy="14" r="9" fill="#7c3aed" opacity="0.15" />
                  <ellipse cx="32" cy="14" rx="5" ry="5" fill="#1f2937" />
                  <rect x="22" y="26" width="20" height="26" rx="4" fill="#7c3aed" opacity="0.85" />
                  <rect x="14" y="30" width="10" height="18" rx="3" fill="#5b21b6" opacity="0.7" />
                  <rect x="40" y="30" width="10" height="18" rx="3" fill="#5b21b6" opacity="0.7" />
                  <rect x="25" y="52" width="6" height="16" rx="3" fill="#4f46e5" />
                  <rect x="33" y="52" width="6" height="16" rx="3" fill="#4f46e5" />
                  {/* Shield */}
                  <path d="M46 20 L54 23 L54 31 Q54 37 46 41 Q38 37 38 31 L38 23 Z" fill="#34d399" opacity="0.9" />
                  <path d="M43 30 L46 33 L51 27" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </div>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '0.75rem', marginBottom: 0, lineHeight: 1.5 }}>
              Please note that all department specific login options will only be available on the dedicated login pages.
            </p>
          </div>

          {/* OR Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
            <span style={{ color: '#9ca3af', fontSize: '0.9rem', fontWeight: '500', letterSpacing: '0.05em' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
          </div>

          {/* Login section */}
          <p style={{ color: '#374151', fontSize: '1rem', marginBottom: '1rem', fontWeight: '400' }}>
            Login to your account directly using ICMS credentials.
          </p>

          {formError && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '10px',
              padding: '0.75rem 1rem',
              marginBottom: '1rem',
              color: '#dc2626',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email + Password in a row */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem', alignItems: 'flex-start' }}>
              {/* Email */}
              <div style={{ flex: 1 }}>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError('') }}
                  style={{
                    width: '100%',
                    padding: '0.9rem 1.1rem',
                    borderRadius: '10px',
                    border: `1.5px solid ${emailError ? '#f87171' : '#e5e7eb'}`,
                    background: '#f9fafb',
                    fontSize: '0.975rem',
                    color: '#111827',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                />
                {emailError && <div style={{ color: '#dc2626', fontSize: '0.78rem', marginTop: '4px' }}>{emailError}</div>}
              </div>

              {/* Password */}
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setPasswordError('') }}
                  style={{
                    width: '100%',
                    padding: '0.9rem 2.8rem 0.9rem 1.1rem',
                    borderRadius: '10px',
                    border: `1.5px solid ${passwordError ? '#f87171' : '#e5e7eb'}`,
                    background: '#f9fafb',
                    fontSize: '0.975rem',
                    color: '#111827',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#9ca3af',
                    display: 'flex', alignItems: 'center',
                  }}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
                {passwordError && <div style={{ color: '#dc2626', fontSize: '0.78rem', marginTop: '4px' }}>{passwordError}</div>}
              </div>
            </div>

            {/* Forgot password - right aligned */}
            <div style={{ textAlign: 'right', marginBottom: '1.25rem' }}>
              <a href="#" style={{ color: '#4f46e5', fontSize: '0.95rem', fontWeight: '600', textDecoration: 'none' }}
                onMouseOver={e => e.target.style.textDecoration = 'underline'}
                onMouseOut={e => e.target.style.textDecoration = 'none'}
              >
                Forgot Password?
              </a>
            </div>

            {/* Login button - right aligned */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: 'linear-gradient(135deg, #4f46e5, #6d28d9)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.85rem 2.75rem',
                  fontSize: '1.05rem',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.8 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'opacity 0.2s, transform 0.1s',
                  boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
                }}
                onMouseOver={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)' }}
              >
                {loading ? (
                  <>
                    <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.6s linear infinite' }} />
                    Signing in...
                  </>
                ) : 'Log in'}
              </button>
            </div>
          </form>

          {/* Register link */}
          <p style={{ marginTop: '1.75rem', color: '#6b7280', fontSize: '0.975rem' }}>
            Don&apos;t have an account?{' '}
            <Link to="/register" style={{ color: '#4f46e5', fontWeight: '600', textDecoration: 'none' }}>
              Register here
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div style={{
          borderTop: '1px solid #f3f4f6',
          padding: '1rem 3.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src={logo} alt="ICMS Logo" style={{ width: '32px', height: '32px', objectFit: 'contain', filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.12))' }} />
              <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1f2937' }}>ICMS</span>
            </div>
            <a href="mailto:support@icms.edu" style={{ color: '#6b7280', fontSize: '0.8rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              support@icms.edu
            </a>
            <a href="#" style={{ color: '#6b7280', fontSize: '0.8rem', textDecoration: 'none' }}>Terms of Use</a>
            <a href="#" style={{ color: '#6b7280', fontSize: '0.8rem', textDecoration: 'none' }}>Privacy Policy</a>
          </div>
          <span style={{ color: '#9ca3af', fontSize: '0.78rem' }}>© 2025 ICMS. Infrastructure Complaint Management System</span>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus { border-color: #6d28d9 !important; box-shadow: 0 0 0 3px rgba(109,40,217,0.12); }
      `}</style>
    </div>
  )
}

export default LoginPage