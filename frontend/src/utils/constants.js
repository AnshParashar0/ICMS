// ─── ICMS Shared Constants ────────────────────────────────────────────────────

export const THEME = {
  gradient: 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 60%, #7c3aed 100%)',
  primary: '#4f46e5',
  primaryDark: '#4338ca',
  primaryLight: '#818cf8',
}

export const DEPARTMENTS = [
  'Electrical',
  'Plumbing',
  'Furniture',
  'Internet',
  'Cleaning',
  'Security',
  'Other',
]

export const CATEGORIES = ['Road', 'Water', 'Electricity', 'Garbage', ...DEPARTMENTS]

export const STATUS_CFG = {
  PENDING:     { color: '#d97706', bg: '#fef3c7', label: 'Pending' },
  IN_PROGRESS: { color: '#2563eb', bg: '#dbeafe', label: 'In Progress' },
  RESOLVED:    { color: '#059669', bg: '#d1fae5', label: 'Resolved' },
}

export const PRIORITY_CFG = {
  URGENT: { color: '#dc2626', bg: '#fee2e2' },
  HIGH:   { color: '#d97706', bg: '#fef3c7' },
  MEDIUM: { color: '#2563eb', bg: '#dbeafe' },
  LOW:    { color: '#6b7280', bg: '#f3f4f6' },
}

// Dark analytics palette
export const DARK = {
  bg:           '#0a0e1a',
  surface:      '#111827',
  surfaceHover: '#1f2937',
  border:       'rgba(255,255,255,0.08)',
  text:         '#f9fafb',
  textMuted:    '#9ca3af',
  neonGreen:    '#22d3ee',
  neonBlue:     '#60a5fa',
  accent:       '#a78bfa',
}

export const CHART_COLORS = [
  '#60a5fa',   // blue
  '#34d399',   // green
  '#f472b6',   // pink
  '#fbbf24',   // amber
  '#a78bfa',   // purple
  '#22d3ee',   // cyan
  '#fb7185',   // rose
]
