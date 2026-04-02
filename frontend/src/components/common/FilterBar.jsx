import { LOCATIONS } from '../../data/mockAnalyticsData'
import { CATEGORIES } from '../../utils/constants'

export default function FilterBar({ filters, onChange, onClear }) {
  const { dateFrom, dateTo, category, location } = filters

  const handleChange = (key, val) => onChange({ ...filters, [key]: val })

  const hasFilters = dateFrom || dateTo || category || location

  return (
    <div className="an-filter-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <i className="bi bi-calendar-range" style={{ color: '#60a5fa', fontSize: '0.9rem' }} />
        <input
          type="date"
          className="an-filter-input"
          value={dateFrom}
          onChange={e => handleChange('dateFrom', e.target.value)}
          style={{ minWidth: '140px' }}
        />
        <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>to</span>
        <input
          type="date"
          className="an-filter-input"
          value={dateTo}
          onChange={e => handleChange('dateTo', e.target.value)}
          style={{ minWidth: '140px' }}
        />
      </div>

      <select
        className="an-filter-input"
        value={category}
        onChange={e => handleChange('category', e.target.value)}
      >
        <option value="">All Categories</option>
        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      <select
        className="an-filter-input"
        value={location}
        onChange={e => handleChange('location', e.target.value)}
      >
        <option value="">All Locations</option>
        {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
      </select>

      {hasFilters && (
        <button
          onClick={onClear}
          style={{ background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.2)', color: '#fca5a5', borderRadius: '10px', padding: '0.6rem 1rem', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          <i className="bi bi-x-circle" /> Clear Filters
        </button>
      )}
    </div>
  )
}
