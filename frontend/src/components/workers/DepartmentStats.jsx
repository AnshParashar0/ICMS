import { THEME, DEPARTMENTS } from '../../utils/constants'

export default function DepartmentStats({ workers, filterDept, setFilterDept }) {
  const deptStats = DEPARTMENTS.map(d => ({ dept: d, count: workers.filter(w => w.department === d).length }))

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
      {deptStats.map(({ dept, count }) => (
        <div
          key={dept}
          onClick={() => setFilterDept(filterDept === dept ? '' : dept)}
          style={{
            background: filterDept === dept ? '#ede9fe' : '#fff',
            borderRadius: '12px', padding: '1.1rem 1.25rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            border: `1.5px solid ${filterDept === dept ? THEME.primary : '#f1f5f9'}`,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
        >
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: filterDept === dept ? THEME.primary : '#111827' }}>{count}</div>
          <div style={{ fontSize: '0.82rem', color: '#6b7280', fontWeight: '500', marginTop: '2px' }}>{dept}</div>
        </div>
      ))}
    </div>
  )
}
