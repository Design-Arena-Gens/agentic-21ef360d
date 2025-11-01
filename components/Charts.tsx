'use client'

import { useMemo } from 'react'
import { useExpensesStore } from '../lib/store'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js'
import { Doughnut, Line } from 'react-chartjs-2'
import { monthKey } from '../lib/utils'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement)

export function Charts() {
  const expenses = useExpensesStore((s) => s.filteredExpenses)

  const { doughnutData, lineData } = useMemo(() => {
    // Category doughnut (for filtered set)
    const byCat = new Map<string, number>()
    for (const e of expenses) {
      byCat.set(e.category, (byCat.get(e.category) ?? 0) + e.amount)
    }
    const catLabels = Array.from(byCat.keys())
    const catValues = Array.from(byCat.values())

    const doughnutData = {
      labels: catLabels,
      datasets: [
        {
          data: catValues,
          backgroundColor: [
            '#0ea5e9', '#22c55e', '#f97316', '#a855f7', '#ef4444',
            '#14b8a6', '#f59e0b', '#6366f1', '#84cc16', '#06b6d4',
          ],
          borderWidth: 1,
        },
      ],
    }

    // Monthly line for last 12 months based on all expenses (not just filtered)
    const all = useExpensesStore.getState().expenses
    const byMonth = new Map<string, number>()
    for (const e of all) {
      const key = monthKey(e.date)
      byMonth.set(key, (byMonth.get(key) ?? 0) + e.amount)
    }

    const now = new Date()
    const months: string[] = []
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const label = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      months.push(label)
    }

    const lineValues = months.map((m) => byMonth.get(m) ?? 0)

    const lineData = {
      labels: months,
      datasets: [
        {
          label: 'Monthly Spending',
          data: lineValues,
          borderColor: '#0f172a',
          backgroundColor: 'rgba(15, 23, 42, 0.2)',
          tension: 0.3,
        },
      ],
    }

    return { doughnutData, lineData }
  }, [expenses])

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div>
        <h3 className="mb-2 text-sm font-medium text-slate-600">By Category (Filtered)</h3>
        <Doughnut data={doughnutData} />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium text-slate-600">Last 12 Months (All)</h3>
        <Line data={lineData} />
      </div>
    </div>
  )
}
