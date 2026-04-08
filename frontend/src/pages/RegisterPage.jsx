import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../backend-api'
import { toast } from 'react-toastify'
import logo from '../assets/vecteezy_modern-real-estate-and-construction-logo_19897563.png'

// ─── OTP Verification Step ──────────────────────────────────────────────────
function OtpStep({ email, onBack, onSuccess }) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [otpError, setOtpError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [resending, setResending] = useState(false)
  const inputRefs = useRef([])
  const timerRef = useRef(null)

  // Start 30s cooldown on mount (OTP just sent)
  useEffect(() => {
    startCooldown()
    return () => clearInterval(timerRef.current)
  }, [])

  const startCooldown = () => {
    setResendCooldown(30)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  const handleOtpChange = (val, idx) => {
    if (!/^\d*$/.test(val)) return
    const next = [...otp]
    next[idx] = val.slice(-1)
    setOtp(next)
    setOtpError('')
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus()
  }

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus()
    }
  }

  const handleOtpPaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      setOtp(pasted.split(''))
      inputRefs.current[5]?.focus()
    }
  }

  const handleVerify = async () => {
    const otpValue = otp.join('')
    if (otpValue.length < 6) { setOtpError('Please enter the complete 6-digit OTP'); return }
    try {
      setLoading(true)
      await authAPI.verifyOtp(email, otpValue)
      toast.success('✅ Account created! Please login to continue.')
      onSuccess()
    } catch (err) {
      setOtpError(err.message || 'Invalid OTP. Please try again.')
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      setResending(true)
      await authAPI.resendOtp(email)
      toast.success('OTP resent! Check your email.')
      startCooldown()
      setOtp(['', '', '', '', '', ''])
      setOtpError('')
      inputRefs.current[0]?.focus()
    } catch (err) {
      toast.error(err.message || 'Failed to resend OTP.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#ffffff', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2.5rem' }}>
          <img src={logo} alt="ICMS" style={{ width: '44px', height: '44px', objectFit: 'contain' }} />
          <span style={{ fontWeight: '800', fontSize: '1.15rem', color: '#1e1b4b' }}>ICMS</span>
        </div>

        {/* Icon */}
        <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'linear-gradient(135deg, #ede9fe, #ddd6fe)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#111827', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
          Verify your email
        </h1>
        <p style={{ color: '#6b7280', fontSize: '0.95rem', marginBottom: '0.5rem', lineHeight: 1.6 }}>
          We sent a 6-digit OTP to
        </p>
        <p style={{ color: '#4f46e5', fontWeight: '700', fontSize: '0.95rem', marginBottom: '2rem', wordBreak: 'break-all' }}>
          {email}
        </p>

        {/* OTP boxes */}
        <div style={{ display: 'flex', gap: '0.625rem', marginBottom: '1.25rem', justifyContent: 'center' }} onPaste={handleOtpPaste}>
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={el => inputRefs.current[idx] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleOtpChange(e.target.value, idx)}
              onKeyDown={e => handleOtpKeyDown(e, idx)}
              style={{
                width: '52px',
                height: '56px',
                textAlign: 'center',
                fontSize: '1.5rem',
                fontWeight: '700',
                borderRadius: '12px',
                border: `2px solid ${otpError ? '#f87171' : digit ? '#4f46e5' : '#e5e7eb'}`,
                background: digit ? '#f5f3ff' : '#f9fafb',
                color: '#111827',
                outline: 'none',
                transition: 'border-color 0.2s, background 0.2s',
                caretColor: '#4f46e5',
              }}
            />
          ))}
        </div>

        {otpError && (
          <div style={{ color: '#dc2626', fontSize: '0.85rem', textAlign: 'center', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
            {otpError}
          </div>
        )}

        {/* Verify button */}
        <button
          onClick={handleVerify}
          disabled={loading}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #4f46e5, #6d28d9)',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            padding: '0.875rem',
            fontSize: '1rem',
            fontWeight: '700',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.8 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(79,70,229,0.35)',
            transition: 'opacity 0.2s, transform 0.1s',
            marginBottom: '1rem',
          }}
          onMouseOver={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)' }}
        >
          {loading ? (
            <>
              <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.6s linear infinite' }} />
              Verifying...
            </>
          ) : 'Verify & Create Account'}
        </button>

        {/* Resend + Edit row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <button
            onClick={handleResend}
            disabled={resendCooldown > 0 || resending}
            style={{
              background: 'none', border: 'none', padding: 0,
              color: resendCooldown > 0 ? '#9ca3af' : '#4f46e5',
              fontSize: '0.875rem', fontWeight: '600',
              cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: '5px',
            }}
          >
            {resending ? (
              <span style={{ width: '12px', height: '12px', border: '2px solid #9ca3af', borderTopColor: '#4f46e5', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.6s linear infinite' }} />
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
            )}
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
          </button>

          <button
            onClick={onBack}
            style={{
              background: 'none', border: '1.5px solid #e5e7eb', borderRadius: '8px',
              padding: '0.45rem 0.9rem', color: '#374151', fontSize: '0.875rem',
              fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
              transition: 'border-color 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.borderColor = '#9ca3af'}
            onMouseOut={e => e.currentTarget.style.borderColor = '#e5e7eb'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
            Edit Details
          </button>
        </div>

        <p style={{ marginTop: '2rem', color: '#9ca3af', fontSize: '0.8rem', textAlign: 'center', lineHeight: 1.6 }}>
          Didn't receive the email? Check your spam folder or use <strong>Edit Details</strong> if your email was incorrect.
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input[type="text"]:focus { border-color: #4f46e5 !important; box-shadow: 0 0 0 3px rgba(79,70,229,0.15); background: #f5f3ff !important; }
      `}</style>
    </div>
  )
}

// ─── Registration Form ──────────────────────────────────────────────────────
function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [formError, setFormError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // OTP step state
  const [step, setStep] = useState('register') // 'register' | 'otp'
  const [pendingEmail, setPendingEmail] = useState('')

  const navigate = useNavigate()

  const validate = () => {
    let valid = true
    setNameError(''); setEmailError(''); setPasswordError(''); setConfirmPasswordError(''); setFormError('')
    if (!fullName.trim()) { setNameError('Full name is required'); valid = false }
    if (!email) { setEmailError('Email is required'); valid = false }
    if (!password) { setPasswordError('Password is required'); valid = false }
    else if (password.length < 6) { setPasswordError('Password must be at least 6 characters'); valid = false }
    if (!confirmPassword) { setConfirmPasswordError('Please confirm your password'); valid = false }
    else if (password !== confirmPassword) { setConfirmPasswordError('Passwords do not match'); valid = false }
    return valid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    try {
      setLoading(true)
      await authAPI.register({ name: fullName, email, password, contactNumber })
      toast.info(`📧 OTP sent to ${email}. Please check your inbox.`)
      setPendingEmail(email)
      setStep('otp')
    } catch (err) {
      const message = err.message || ''
      if (message === 'Email already exists') {
        setEmailError('This email is already registered')
        setFormError('An account with this email already exists. Please login instead.')
      } else {
        setFormError(message || 'Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  // OTP verified → go to login
  const handleOtpSuccess = () => {
    setTimeout(() => navigate('/'), 500)
  }

  // Back from OTP → restore form (email stays pre-filled so they can correct it)
  const handleBack = () => {
    setStep('register')
  }

  // ── Render OTP step ────────────────────────────────────────────────────
  if (step === 'otp') {
    return <OtpStep email={pendingEmail} onBack={handleBack} onSuccess={handleOtpSuccess} />
  }

  // ── Render Register form ───────────────────────────────────────────────
  const inputStyle = (hasError) => ({
    width: '100%',
    padding: '0.8rem 1rem',
    borderRadius: '10px',
    border: `1.5px solid ${hasError ? '#f87171' : '#e5e7eb'}`,
    background: '#f9fafb',
    fontSize: '0.875rem',
    color: '#111827',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  })

  const EyeIcon = ({ open }) => open ? (
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
  )

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
          <img src={logo} alt="ICMS Logo" style={{ width: '58px', height: '58px', objectFit: 'contain', mixBlendMode: 'screen', flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: '800', fontSize: '1.25rem', letterSpacing: '-0.5px' }}>ICMS</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Infrastructure Complaint System</div>
          </div>
        </div>
      </div>

      {/* Middle */}
      <div className="w-100">
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', lineHeight: 1.3, marginBottom: '1rem' }}>
          Join thousands of students <span style={{ color: '#a5f3fc' }}>getting issues resolved</span>
        </h2>
        <p style={{ opacity: 0.8, marginBottom: '2rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
          Create your account and start submitting complaints in under 2 minutes.
        </p>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { step: '01', title: 'Create Account', desc: 'Register with your college email' },
            { step: '02', title: 'Verify Email', desc: 'Enter the OTP sent to your inbox' },
            { step: '03', title: 'Submit & Track', desc: 'Describe the issue and track progress' },
          ].map((item) => (
            <div key={item.step} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(165,243,252,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '800', color: '#a5f3fc', flexShrink: 0 }}>
                {item.step}
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{item.title}</div>
                <div style={{ fontSize: '0.78rem', opacity: 0.65 }}>{item.desc}</div>
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
          &ldquo;Registered in seconds and my first complaint was resolved the same day. Amazing system!&rdquo;
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.9rem' }}>P</div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>Priya Verma</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>Electronics Engineering, 2nd Year</div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      <LeftPanel />

      {/* Right Side */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#ffffff', overflowY: 'auto', minWidth: 0 }}>
        {/* Main content area */}
        <div style={{ flex: 1, padding: '2.5rem 3.5rem 2rem' }}>

          {/* Mobile Logo */}
          <div className="d-lg-none mb-4">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src={logo} alt="ICMS Logo" style={{ width: '44px', height: '44px', objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.15))' }} />
              <span style={{ fontWeight: '800', fontSize: '1.1rem', color: '#1e1b4b' }}>ICMS</span>
            </div>
          </div>

          {/* Header */}
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#111827', marginBottom: '0.4rem', letterSpacing: '-1px', lineHeight: 1.15 }}>
            Create your account!
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1.15rem', marginBottom: '2rem', lineHeight: 1.5 }}>
            Join ICMS and start resolving campus issues today.
          </p>

          {/* Institution search box */}
          <div style={{ background: '#f3f0ff', borderRadius: '14px', padding: '1.25rem 1.5rem', marginBottom: '1.75rem', position: 'relative' }}>
            <p style={{ fontWeight: '700', color: '#1f2937', fontSize: '1rem', marginBottom: '0.9rem' }}>
              Search for your institution or department to get started.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </span>
                <input type="text" placeholder="Please specify the name of your institution or department" style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.6rem', borderRadius: '10px', border: '1.5px solid #e5e7eb', background: '#ffffff', fontSize: '0.875rem', color: '#374151', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ flexShrink: 0 }}>
                <svg width="64" height="72" viewBox="0 0 64 72" fill="none">
                  <circle cx="32" cy="14" r="9" fill="#7c3aed" opacity="0.15" />
                  <ellipse cx="32" cy="14" rx="5" ry="5" fill="#1f2937" />
                  <rect x="22" y="26" width="20" height="26" rx="4" fill="#7c3aed" opacity="0.85" />
                  <rect x="14" y="30" width="10" height="18" rx="3" fill="#5b21b6" opacity="0.7" />
                  <rect x="40" y="30" width="10" height="18" rx="3" fill="#5b21b6" opacity="0.7" />
                  <rect x="25" y="52" width="6" height="16" rx="3" fill="#4f46e5" />
                  <rect x="33" y="52" width="6" height="16" rx="3" fill="#4f46e5" />
                  <path d="M46 20 L54 23 L54 31 Q54 37 46 41 Q38 37 38 31 L38 23 Z" fill="#34d399" opacity="0.9" />
                  <path d="M43 30 L46 33 L51 27" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </div>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '0.75rem', marginBottom: 0, lineHeight: 1.5 }}>
              Please note that all department specific registration options will only be available on the dedicated pages.
            </p>
          </div>

          {/* OR Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
            <span style={{ color: '#9ca3af', fontSize: '0.9rem', fontWeight: '500', letterSpacing: '0.05em' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
          </div>

          <p style={{ color: '#374151', fontSize: '1rem', marginBottom: '1.25rem', fontWeight: '400' }}>
            Create your account directly using ICMS credentials.
          </p>

          {formError && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#dc2626', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Row 1: Full Name + Contact */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.85rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '0.35rem' }}>Full Name</label>
                <input type="text" id="fullName" placeholder="Enter your full name" value={fullName} onChange={(e) => { setFullName(e.target.value); setNameError('') }} style={inputStyle(nameError)} />
                {nameError && <div style={{ color: '#dc2626', fontSize: '0.78rem', marginTop: '4px' }}>{nameError}</div>}
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '0.35rem' }}>
                  Contact Number <span style={{ color: '#9ca3af', fontWeight: '400' }}>(Optional)</span>
                </label>
                <input type="tel" id="contactNumber" placeholder="Enter your contact number" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} style={inputStyle(false)} />
              </div>
            </div>

            {/* Row 2: Email */}
            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '0.35rem' }}>Email Address</label>
              <input type="email" id="email" placeholder="Enter your email address" value={email} onChange={(e) => { setEmail(e.target.value); setEmailError('') }} style={inputStyle(emailError)} />
              {emailError && <div style={{ color: '#dc2626', fontSize: '0.78rem', marginTop: '4px' }}>{emailError}</div>}
            </div>

            {/* Row 3: Password + Confirm */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '0.35rem' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? 'text' : 'password'} id="password" placeholder="Min 6 characters" value={password} onChange={(e) => { setPassword(e.target.value); setPasswordError('') }} style={{ ...inputStyle(passwordError), paddingRight: '2.8rem' }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center' }}>
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
                {passwordError && <div style={{ color: '#dc2626', fontSize: '0.78rem', marginTop: '4px' }}>{passwordError}</div>}
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '0.35rem' }}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showConfirm ? 'text' : 'password'} id="confirmPassword" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setConfirmPasswordError('') }} style={{ ...inputStyle(confirmPasswordError), paddingRight: '2.8rem' }} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center' }}>
                    <EyeIcon open={showConfirm} />
                  </button>
                </div>
                {confirmPasswordError && <div style={{ color: '#dc2626', fontSize: '0.78rem', marginTop: '4px' }}>{confirmPasswordError}</div>}
              </div>
            </div>

            {/* Submit button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                disabled={loading}
                style={{ background: 'linear-gradient(135deg, #4f46e5, #6d28d9)', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '0.75rem 2.25rem', fontSize: '0.95rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.8 : 1, display: 'flex', alignItems: 'center', gap: '8px', transition: 'opacity 0.2s, transform 0.1s', boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)' }}
                onMouseOver={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)' }}
              >
                {loading ? (
                  <>
                    <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.6s linear infinite' }} />
                    Sending OTP...
                  </>
                ) : 'Continue →'}
              </button>
            </div>
          </form>

          {/* Login link */}
          <p style={{ marginTop: '1.5rem', color: '#6b7280', fontSize: '0.975rem' }}>
            Already have an account?{' '}
            <Link to="/" style={{ color: '#4f46e5', fontWeight: '600', textDecoration: 'none' }}>Login here</Link>
          </p>
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #f3f4f6', padding: '1rem 3.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src={logo} alt="ICMS Logo" style={{ width: '32px', height: '32px', objectFit: 'contain', filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.12))' }} />
              <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1f2937' }}>ICMS</span>
            </div>
            <a href="mailto:support@icms.edu" style={{ color: '#6b7280', fontSize: '0.8rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>support@icms.edu</a>
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

export default RegisterPage