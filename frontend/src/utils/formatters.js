// ─── ICMS Formatters ──────────────────────────────────────────────────────────

export function formatDate(dateString) {
  if (!dateString) return '—'
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}

export function formatDateTime(dateString) {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export function formatDuration(hours) {
  if (hours == null) return '—'
  if (hours < 1) return `${Math.round(hours * 60)}m`
  if (hours < 24) return `${hours.toFixed(1)}h`
  return `${(hours / 24).toFixed(1)}d`
}

export function formatPercent(value) {
  return `${Math.round(value)}%`
}

export function getInitial(name) {
  if (!name) return '?'
  return name.charAt(0).toUpperCase()
}
