import { useState } from 'react'
import { toast } from 'react-toastify'
import { THEME } from '../utils/constants'
import { workersAPI } from '../backend-api'
import DepartmentStats from '../components/workers/DepartmentStats'
import WorkerForm from '../components/workers/WorkerForm'
import WorkersTable from '../components/workers/WorkersTable'

const BLANK_FORM = { name: '', department: 'Electrical', phone: '', email: '', status: 'AVAILABLE' }

export default function WorkersSection({ workers, onRefresh }) {
  const [showForm,   setShowForm]   = useState(false)
  const [editWorker, setEditWorker] = useState(null)
  const [form,       setForm]       = useState(BLANK_FORM)
  const [saving,     setSaving]     = useState(false)
  const [filterDept, setFilterDept] = useState('')

  const handleSave = async () => {
    if (!form.name || !form.department) return toast.error('Name and department are required')
    try {
      setSaving(true)
      if (editWorker) await workersAPI.updateWorker(editWorker.id, form)
      else await workersAPI.addWorker(form)
      toast.success(editWorker ? 'Worker updated!' : 'Worker added!')
      setShowForm(false); setEditWorker(null); setForm(BLANK_FORM)
      onRefresh()
    } catch { toast.error('Failed to save worker') } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this worker?')) return
    try { await workersAPI.deleteWorker(id); toast.success('Worker deleted'); onRefresh() }
    catch { toast.error('Failed to delete') }
  }

  const openEdit = (w) => {
    setEditWorker(w)
    setForm({ name: w.name, department: w.department, phone: w.phone || '', email: w.email || '', status: w.status })
    setShowForm(true)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontWeight: '800', fontSize: '1.6rem', color: '#111827', margin: 0 }}>Workers Management</h2>
          <p style={{ color: '#6b7280', margin: '0.3rem 0 0', fontSize: '0.95rem' }}>{workers.length} total workers across all departments</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditWorker(null); setForm(BLANK_FORM) }}
          style={{ background: THEME.gradient, border: 'none', color: '#fff', borderRadius: '10px', padding: '0.65rem 1.5rem', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px', boxShadow: '0 4px 14px rgba(79,70,229,0.3)' }}
        >
          <i className="bi bi-plus-lg" /> Add Worker
        </button>
      </div>

      <DepartmentStats workers={workers} filterDept={filterDept} setFilterDept={setFilterDept} />

      {showForm && (
        <WorkerForm
          editWorker={editWorker}
          form={form}
          setForm={setForm}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditWorker(null) }}
          saving={saving}
        />
      )}

      {filterDept && (
        <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>Filtered: <strong>{filterDept}</strong></span>
          <button onClick={() => setFilterDept('')} style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', marginLeft: '0.5rem' }}>Clear ×</button>
        </div>
      )}

      <WorkersTable
        workers={workers}
        filterDept={filterDept}
        onEdit={openEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}
