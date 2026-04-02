// Generic error / empty-state UI for analytics
export default function ErrorState({ message = 'Something went wrong.', onRetry, icon = 'bi-exclamation-triangle', dark = false }) {
  const bg   = dark ? 'rgba(248,113,113,0.06)' : '#fff5f5'
  const col  = dark ? '#fca5a5' : '#dc2626'
  const sub  = dark ? '#9ca3af' : '#6b7280'
  const btn  = dark ? 'rgba(248,113,113,0.15)' : '#fee2e2'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem', textAlign: 'center', background: bg, borderRadius: '14px' }}>
      <i className={`bi ${icon}`} style={{ fontSize: '2.5rem', color: col, marginBottom: '1rem' }} />
      <p style={{ color: col, fontWeight: '700', fontSize: '1rem', margin: 0 }}>{message}</p>
      <p style={{ color: sub, fontSize: '0.85rem', marginTop: '4px' }}>Check your connection or try refreshing.</p>
      {onRetry && (
        <button onClick={onRetry} style={{ marginTop: '1rem', background: btn, border: 'none', color: col, borderRadius: '8px', padding: '0.5rem 1.25rem', fontWeight: '700', fontSize: '0.875rem', cursor: 'pointer' }}>
          Retry
        </button>
      )}
    </div>
  )
}
