import { useState } from 'react'
import { motion } from 'framer-motion'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
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

  // Apply filters to live complaint data
  const filteredComplaints = complaints.filter(c => {
    if (filters.category && c.category !== filters.category) return false
    if (filters.location && !c.location?.toLowerCase().includes(filters.location.toLowerCase())) return false
    if (filters.dateFrom && new Date(c.createdAt) < new Date(filters.dateFrom)) return false
    if (filters.dateTo   && new Date(c.createdAt) > new Date(filters.dateTo))   return false
    return true
  })

  const handleExport = () => {
    setExporting(true)
    try {
      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
      const now = new Date()
      const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

      // ── Header ──────────────────────────────────────────────────────────
      doc.setFillColor(79, 70, 229)
      doc.rect(0, 0, 297, 28, 'F')

      doc.setTextColor(255, 255, 255)
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.text('ICMS — Analytics Report', 14, 12)

      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.text('Infrastructure Complaint Management System', 14, 19)
      doc.text(`Generated: ${dateStr} at ${timeStr}`, 297 - 14, 19, { align: 'right' })

      // ── Summary section ──────────────────────────────────────────────────
      let y = 36
      doc.setTextColor(17, 24, 39)
      doc.setFontSize(13)
      doc.setFont('helvetica', 'bold')
      doc.text('Summary Statistics', 14, y)
      y += 8

      const total     = filteredComplaints.length
      const pending   = filteredComplaints.filter(c => c.status === 'PENDING').length
      const inProg    = filteredComplaints.filter(c => c.status === 'IN_PROGRESS').length
      const resolved  = filteredComplaints.filter(c => c.status === 'RESOLVED').length
      const resRate   = total > 0 ? Math.round((resolved / total) * 100) : 0

      const summaryData = [
        ['Total Complaints', total, 'Pending', pending],
        ['In Progress', inProg, 'Resolved', resolved],
        ['Resolution Rate', `${resRate}%`, 'Active Filters', Object.values(filters).filter(Boolean).length],
      ]

      autoTable(doc, {
        startY: y,
        body: summaryData,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 4, textColor: [17, 24, 39] },
        columnStyles: {
          0: { fontStyle: 'bold', fillColor: [248, 250, 252], textColor: [79, 70, 229] },
          1: { halign: 'center' },
          2: { fontStyle: 'bold', fillColor: [248, 250, 252], textColor: [79, 70, 229] },
          3: { halign: 'center' },
        },
        margin: { left: 14, right: 14 },
      })

      y = doc.lastAutoTable.finalY + 12

      // ── Complaints table ─────────────────────────────────────────────────
      doc.setFontSize(13)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(17, 24, 39)
      doc.text('Complaint Details', 14, y)
      y += 6

      const tableRows = filteredComplaints.map((c, i) => [
        i + 1,
        c.id || '—',
        (c.title || c.description || '—').slice(0, 40),
        c.category || '—',
        c.location || '—',
        c.status || '—',
        c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN') : '—',
      ])

      const statusColor = (status) => {
        if (status === 'RESOLVED')    return [5, 150, 105]
        if (status === 'IN_PROGRESS') return [79, 70, 229]
        return [217, 119, 6]
      }

      autoTable(doc, {
        startY: y,
        head: [['#', 'ID', 'Title / Description', 'Category', 'Location', 'Status', 'Date']],
        body: tableRows,
        theme: 'striped',
        headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold', fontSize: 9 },
        bodyStyles: { fontSize: 8.5, textColor: [55, 65, 81] },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        columnStyles: {
          0: { halign: 'center', cellWidth: 10 },
          1: { cellWidth: 22 },
          2: { cellWidth: 70 },
          3: { cellWidth: 32 },
          4: { cellWidth: 38 },
          5: { cellWidth: 28 },
          6: { cellWidth: 24 },
        },
        didDrawCell: (data) => {
          if (data.column.index === 5 && data.section === 'body') {
            const status = data.cell.raw
            const [r, g, b] = statusColor(status)
            doc.setFontSize(7.5)
            doc.setTextColor(r, g, b)
          }
        },
        margin: { left: 14, right: 14 },
      })

      // ── Footer ───────────────────────────────────────────────────────────
      const pageCount = doc.internal.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(156, 163, 175)
        doc.text(
          `ICMS Analytics Report  ·  Page ${i} of ${pageCount}  ·  Confidential`,
          297 / 2, 205, { align: 'center' }
        )
      }

      const filename = `ICMS_Analytics_${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}.pdf`
      doc.save(filename)
    } catch (err) {
      console.error('PDF export error:', err)
    } finally {
      setExporting(false)
    }
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
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#111827', margin: 0, letterSpacing: '-0.5px' }}>
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
              Generating PDF...
            </>
          ) : (
            <>
              <i className="bi bi-file-earmark-pdf" />
              Export PDF Report
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
