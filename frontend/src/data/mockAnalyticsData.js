import { subDays, format } from 'date-fns'

// ─── Generate daily trend data (last 30 days) ─────────────────────────────────
function generateDailyTrend() {
  return Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i)
    return {
      date: format(date, 'MMM dd'),
      total: Math.floor(Math.random() * 18) + 3,
      resolved: Math.floor(Math.random() * 12) + 1,
      pending: Math.floor(Math.random() * 8) + 1,
    }
  })
}

// ─── Complaints by Category ────────────────────────────────────────────────────
export const complaintsByCategory = [
  { name: 'Road',        value: 42, color: '#60a5fa' },
  { name: 'Water',       value: 35, color: '#34d399' },
  { name: 'Electricity', value: 28, color: '#fbbf24' },
  { name: 'Garbage',     value: 19, color: '#f472b6' },
  { name: 'Plumbing',    value: 16, color: '#a78bfa' },
  { name: 'Internet',    value: 11, color: '#22d3ee' },
  { name: 'Security',    value: 9,  color: '#fb7185' },
]

// ─── Complaints by Location / Ward ────────────────────────────────────────────
export const complaintsByLocation = [
  { ward: 'Ward A',  complaints: 38, resolved: 31 },
  { ward: 'Ward B',  complaints: 27, resolved: 19 },
  { ward: 'Ward C',  complaints: 45, resolved: 38 },
  { ward: 'Ward D',  complaints: 22, resolved: 18 },
  { ward: 'Ward E',  complaints: 33, resolved: 25 },
  { ward: 'Ward F',  complaints: 15, resolved: 12 },
  { ward: 'Hostel',  complaints: 52, resolved: 40 },
  { ward: 'Admin Blk', complaints: 18, resolved: 16 },
]

// ─── Daily / Weekly Trend ─────────────────────────────────────────────────────
export const dailyTrend = generateDailyTrend()

export const weeklyTrend = [
  { week: 'Week 1', total: 68, resolved: 52, pending: 16 },
  { week: 'Week 2', total: 74, resolved: 61, pending: 13 },
  { week: 'Week 3', total: 59, resolved: 49, pending: 10 },
  { week: 'Week 4', total: 82, resolved: 65, pending: 17 },
  { week: 'Week 5', total: 71, resolved: 58, pending: 13 },
  { week: 'Week 6', total: 90, resolved: 72, pending: 18 },
]

// ─── Performance Metrics ──────────────────────────────────────────────────────
export const performanceMetrics = {
  avgResolutionHours: 18.4,
  fastestResolutionHours: 1.2,
  fastestComplaint: 'CMP-0045 — Electricity',
  slowestResolutionHours: 96,
  slowestComplaint: 'CMP-0012 — Road',
  slaCompliancePercent: 82,
  totalResolved: 278,
  totalComplaints: 339,
  escalatedCount: 14,
  repeatComplaints: 23,
}

// ─── Department Ranking ────────────────────────────────────────────────────────
export const departmentRanking = [
  { rank: 1, dept: 'Electrical',  handled: 71, avgHours: 12.3, sla: 94, trend: 'up'   },
  { rank: 2, dept: 'Plumbing',    handled: 58, avgHours: 15.7, sla: 89, trend: 'up'   },
  { rank: 3, dept: 'Internet',    handled: 44, avgHours: 9.1,  sla: 97, trend: 'up'   },
  { rank: 4, dept: 'Cleaning',    handled: 39, avgHours: 21.5, sla: 78, trend: 'down' },
  { rank: 5, dept: 'Furniture',   handled: 33, avgHours: 28.2, sla: 72, trend: 'down' },
  { rank: 6, dept: 'Security',    handled: 22, avgHours: 18.0, sla: 81, trend: 'up'   },
  { rank: 7, dept: 'Other',       handled: 11, avgHours: 40.5, sla: 61, trend: 'down' },
]

// ─── Repeat Complaints ─────────────────────────────────────────────────────────
export const repeatComplaints = [
  { location: 'Hostel Block C',   category: 'Plumbing',    count: 5 },
  { location: 'Ward A — Gate 2',  category: 'Road',        count: 4 },
  { location: 'Admin Block 1F',   category: 'Electricity', count: 4 },
  { location: 'Ward B — Corridor',category: 'Internet',    count: 3 },
  { location: 'Cafeteria Area',   category: 'Garbage',     count: 3 },
  { location: 'Library Block',    category: 'Water',       count: 2 },
]

// ─── Overview Card trend data (compare last 7 vs prev 7 days) ─────────────────
export const overviewTrends = {
  total:      { prev: 67, curr: 82 },
  open:       { prev: 24, curr: 19 },
  inProgress: { prev: 18, curr: 22 },
  resolved:   { prev: 25, curr: 41 },
}

// ─── Locations list for filter ────────────────────────────────────────────────
export const LOCATIONS = [
  'Ward A', 'Ward B', 'Ward C', 'Ward D', 'Ward E', 'Ward F', 'Hostel', 'Admin Block',
]
