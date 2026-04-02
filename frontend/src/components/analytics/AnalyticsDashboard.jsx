import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import '../../styles/dashboard.css'

import FilterBar from '../common/FilterBar'
import OverviewCards from '../analytics/OverviewCards'
import ComplaintsPieChart from '../analytics/ComplaintsPieChart'
import ComplaintsBarChart from '../analytics/ComplaintsBarChart'
import ComplaintsLineChart from '../analytics/ComplaintsLineChart'
import PerformanceMetrics from '../analytics/PerformanceMetrics'
import DepartmentRankingTable from '../analytics/DepartmentRankingTable'
import AdvancedInsights from '../analytics/AdvancedInsights'

const EMPTY_FILTERS = { dateFrom: '', dateTo: '', category: '', location: '' }

export default function AnalyticsDashboard({ complaints, loading }) {
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [exporting, setExporting] = useState(false)

  // Apply filters to live complaint data used in OverviewCards
  const filteredComplaints = complaints.filter(c => {
    if (filters.category && c.category !== filters.category) return false
    if (filters.location && !c.location?.toLowerCase().includes(filters.location.toLowerCase())) return false
    if (filters.dateFrom && new Date(c.createdAt) < new Date(filters.dateFrom)) return false
    if (filters.dateTo   && new Date(c.createdAt) > new Date(filters.dateTo))   return false
    return true
  })

  const handleExport = () => {
    setExporting(true)
    setTimeout(() => setExporting(false), 1800)
  }

  const pageAnim = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  }

  return (
    <div className="analytics-page" style={{ padding: '2rem 2rem 3rem' }}>
      {/* ── Top bar ───────────────────────────────────────────── */}
      <motion.div {...pageAnim} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#f9fafb', margin: 0, letterSpacing: '-0.5px' }}>
            Analytics Dashboard
          </h1>
          <p style={{ color: '#6b7280', margin: '4px 0 0', fontSize: '0.92rem' }}>
            Insights &amp; trends for infrastructure complaints · ICMS
          </p>
        </div>
        <button
          className="an-btn-export"
          onClick={handleExport}
          disabled={exporting}
          id="btn-export-report"
        >
          {exporting ? (
            <>
              <i className="bi bi-hourglass-split" style={{ animation: 'spin 0.8s linear infinite' }} />
              Generating...
            </>
          ) : (
            <>
              <i className="bi bi-download" />
              Export Report
            </>
          )}
        </button>
      </motion.div>

      {/* ── Filter bar ─────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} style={{ marginBottom: '2rem' }}>
        <FilterBar filters={filters} onChange={setFilters} onClear={() => setFilters(EMPTY_FILTERS)} />
      </motion.div>

      {/* ── Overview stat cards ────────────────────────────────── */}
      <section style={{ marginBottom: '2rem' }}>
        <OverviewCards complaints={filteredComplaints} loading={loading} />
      </section>

      {/* ── Pie + Bar charts ────────────────────────────────────── */}
      <section className="an-charts-grid" style={{ marginBottom: '2rem' }}>
        <ComplaintsPieChart loading={loading} />
        <ComplaintsBarChart loading={loading} />
      </section>

      {/* ── Line chart trend ────────────────────────────────────── */}
      <section style={{ marginBottom: '2rem' }}>
        <ComplaintsLineChart loading={loading} />
      </section>

      {/* ── Performance metrics ─────────────────────────────────── */}
      <section style={{ marginBottom: '2rem' }}>
        <PerformanceMetrics />
      </section>

      {/* ── Department ranking table ─────────────────────────────── */}
      <section style={{ marginBottom: '2rem' }}>
        <DepartmentRankingTable />
      </section>

      {/* ── Advanced insights ────────────────────────────────────── */}
      <section style={{ marginBottom: '2rem' }}>
        <AdvancedInsights complaints={filteredComplaints} />
      </section>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
