import { useState } from 'react'
import { THEME, DEPARTMENTS } from '../../utils/constants'

export default function ComplaintFilters({ complaints, onFiltered }) {
  const [search, setSearch]         = useState('')
  const [filterStatus, setStatus]   = useState('')
  const [filterCategory, setCategory] = useState('')
  const [filterPriority, setPriority] = useState('')

  const applyFilters = (s, st, cat, pri) => {
    const q = s.toLowerCase()
    const filtered = complaints.filter(c => {
      const matchSearch = !s || c.complaintId?.toLowerCase().includes(q) || c.studentName?.toLowerCase().includes(q) || c.category?.toLowerCase().includes(q) || c.location?.toLowerCase().includes(q)
      return matchSearch && (!st || c.status === st) && (!cat || c.category === cat) && (!pri || c.priority === pri)
    })
    onFiltered(filtered)
  }

  const handleChange = (key, val) => {
    const vals = { search, filterStatus, filterCategory, filterPriority, [key]: val }
    setSearch(vals.search)
    setStatus(vals.filterStatus)
    setCategory(vals.filterCategory)
    setPriority(vals.filterPriority)
    applyFilters(vals.search, vals.filterStatus, vals.filterCategory, vals.filterPriority)
  }

  const hasFilter = search || filterStatus || filterCategory || filterPriority

  return (
    <div style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', padding: '1.25rem 1.5rem', marginBottom: '1.25rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '0.75rem' }}>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>
            <i className="bi bi-search" />
          </span>
          <input
            type="text"
            placeholder="Search by ID, student, category, location..."
            value={search}
            onChange={e => handleChange('search', e.target.value)}
            style={{ width: '100%', padding: '0.7rem 0.75rem 0.7rem 2.25rem', borderRadius: '8px', border: '1.5px solid #e5e7eb', background: '#f9fafb', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        {/* Status */}
        <select value={filterStatus} onChange={e => handleChange('filterStatus', e.target.value)}
          style={{ padding: '0.7rem 0.75rem', borderRadius: '8px', border: '1.5px solid #e5e7eb', background: '#f9fafb', fontSize: '0.875rem', outline: 'none', color: '#374151' }}>
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
        </select>

        {/* Category */}
        <select value={filterCategory} onChange={e => handleChange('filterCategory', e.target.value)}
          style={{ padding: '0.7rem 0.75rem', borderRadius: '8px', border: '1.5px solid #e5e7eb', background: '#f9fafb', fontSize: '0.875rem', outline: 'none', color: '#374151' }}>
          <option value="">All Categories</option>
          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        {/* Priority */}
        <select value={filterPriority} onChange={e => handleChange('filterPriority', e.target.value)}
          style={{ padding: '0.7rem 0.75rem', borderRadius: '8px', border: '1.5px solid #e5e7eb', background: '#f9fafb', fontSize: '0.875rem', outline: 'none', color: '#374151' }}>
          <option value="">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>

      {hasFilter && (
        <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>Filters active</span>
          <button
            onClick={() => { setSearch(''); setStatus(''); setCategory(''); setPriority(''); onFiltered(complaints) }}
            style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', padding: 0 }}
          >
            Clear ×
          </button>
        </div>
      )}
    </div>
  )
}
