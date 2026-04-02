import { useState } from 'react'
import { ChartSkeleton } from '../common/LoadingSkeleton'
import ErrorState from '../common/ErrorState'

// Wrapper card for any chart section
export default function ChartContainer({
  title,
  icon,
  children,
  loading = false,
  error = false,
  onRetry,
  skeletonHeight = 280,
  action,
  style = {},
}) {
  return (
    <div className="an-card" style={{ overflow: 'hidden', ...style }}>
      <div className="an-card-header">
        <h6 className="an-card-title">
          {icon && <i className={`bi ${icon}`} style={{ color: '#60a5fa' }} />}
          {title}
        </h6>
        {action && <div>{action}</div>}
      </div>

      {loading && <ChartSkeleton height={skeletonHeight} />}
      {!loading && error && (
        <div style={{ padding: '1rem' }}>
          <ErrorState message="Failed to load chart data." onRetry={onRetry} dark />
        </div>
      )}
      {!loading && !error && children}
    </div>
  )
}
