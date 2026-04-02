import { THEME, DEPARTMENTS } from '../../utils/constants'

export default function WorkerForm({ editWorker, form, setForm, onSave, onCancel, saving }) {
  const fields = [
    { label: 'Full Name *', key: 'name',  type: 'text',  placeholder: 'Worker name'   },
    { label: 'Phone',       key: 'phone', type: 'tel',   placeholder: 'Phone number'  },
    { label: 'Email',       key: 'email', type: 'email', placeholder: 'Email address' },
  ]

  return (
    <div style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '1.5rem', marginBottom: '1.25rem' }}>
      <h6 style={{ fontWeight: '700', color: '#111827', marginBottom: '1rem', fontSize: '1rem' }}>
        {editWorker ? 'Edit Worker' : 'Add New Worker'}
      </h6>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        {fields.map(f => (
          <div key={f.key}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#374151', marginBottom: '5px' }}>{f.label}</label>
            <input type={f.type} placeholder={f.placeholder} value={form[f.key]}
              onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: '8px', border: '1.5px solid #e5e7eb', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
          </div>
        ))}
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#374151', marginBottom: '5px' }}>Department *</label>
          <select value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))}
            style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: '8px', border: '1.5px solid #e5e7eb', fontSize: '0.875rem', outline: 'none', background: '#fff' }}>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#374151', marginBottom: '5px' }}>Status</label>
          <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
            style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: '8px', border: '1.5px solid #e5e7eb', fontSize: '0.875rem', outline: 'none', background: '#fff' }}>
            <option value="AVAILABLE">Available</option>
            <option value="BUSY">Busy</option>
            <option value="OFF_DUTY">Off Duty</option>
          </select>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button onClick={onSave} disabled={saving}
          style={{ background: THEME.gradient, border: 'none', color: '#fff', borderRadius: '8px', padding: '0.6rem 1.5rem', fontWeight: '700', fontSize: '0.875rem', cursor: 'pointer' }}>
          {saving ? 'Saving...' : (editWorker ? 'Update Worker' : 'Add Worker')}
        </button>
        <button onClick={onCancel}
          style={{ background: '#f3f4f6', border: 'none', color: '#374151', borderRadius: '8px', padding: '0.6rem 1.5rem', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer' }}>
          Cancel
        </button>
      </div>
    </div>
  )
}
