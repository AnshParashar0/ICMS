import { DARK } from '../../utils/constants'

// Animated shimmer skeleton for loading states
export function SkeletonBlock({ width = '100%', height = 20, borderRadius = 8, style = {} }) {
  return (
    <div
      className="an-skeleton"
      style={{ width, height, borderRadius, ...style }}
    />
  )
}

// Card-shaped skeleton for stat cards
export function StatCardSkeleton() {
  return (
    <div style={{
      background: '#111827',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '16px',
      padding: '1.5rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <SkeletonBlock width={52} height={52} borderRadius={14} />
        <SkeletonBlock width={60} height={22} borderRadius={20} />
      </div>
      <SkeletonBlock height={38} width="60%" style={{ marginBottom: '8px' }} />
      <SkeletonBlock height={14} width="50%" />
    </div>
  )
}

// Chart container skeleton
export function ChartSkeleton({ height = 260 }) {
  return (
    <div style={{ padding: '1.5rem' }}>
      <SkeletonBlock height={height} borderRadius={10} />
    </div>
  )
}

// Table row skeleton
export function TableRowSkeleton({ rows = 5 }) {
  return (
    <div style={{ padding: '1rem 1.5rem' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '0.85rem', alignItems: 'center' }}>
          <SkeletonBlock width={28} height={28} borderRadius={50} />
          <SkeletonBlock width="30%" height={14} />
          <SkeletonBlock width="20%" height={14} />
          <SkeletonBlock width="15%" height={14} />
          <SkeletonBlock width="15%" height={22} borderRadius={20} />
        </div>
      ))}
    </div>
  )
}
