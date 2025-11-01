'use client'

import { useMemo } from 'react'
import { useExpensesStore } from '../lib/store'
import { formatCurrency, monthKey } from '../lib/utils'
import { eachDayOfInterval } from 'date-fns'

export function SummaryCards() {
  const expenses = useExpensesStore((s) => s.filteredExpenses)

  const { total, monthTotal, avgPerDay, topCategory } = useMemo(() => {
    const total = expenses.reduce((sum, e) => sum + e.amount, 0)

    const now = new Date()
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    const monthTotal = expenses
      .filter((e) => monthKey(e.date) === thisMonth)
      .reduce((sum, e) => sum + e.amount, 0)

    const byDay = new Map<string, number>()
    for (const e of expenses) {
      const key = e.date
      byDay.set(key, (byDay.get(key) ?? 0) + e.amount)
    }

    let avgPerDay = 0
    if (expenses.length > 0) {
      const minDate = new Date(expenses[expenses.length - 1].date)
      const maxDate = new Date(expenses[0].date)
      const days = eachDayOfInterval({ start: minDate, end: maxDate })
      const denom = Math.max(days.length, 1)
      avgPerDay = total / denom
    }

    const byCat = new Map<string, number>()
    for (const e of expenses) {
      byCat.set(e.category, (byCat.get(e.category) ?? 0) + e.amount)
    }
    let topCategory = '-'
    let topVal = -1
    for (const [k, v] of byCat.entries()) {
      if (v > topVal) {
        topVal = v
        topCategory = k
      }
    }

    return { total, monthTotal, avgPerDay, topCategory }
  }, [expenses])

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="card">
        <div className="card-header">Total (Filtered)</div>
        <div className="card-body text-2xl font-semibold">{formatCurrency(total)}</div>
      </div>
      <div className="card">
        <div className="card-header">This Month</div>
        <div className="card-body text-2xl font-semibold">{formatCurrency(monthTotal)}</div>
      </div>
      <div className="card">
        <div className="card-header">Avg per Day</div>
        <div className="card-body text-2xl font-semibold">{formatCurrency(avgPerDay)}</div>
      </div>
      <div className="card">
        <div className="card-header">Top Category</div>
        <div className="card-body text-2xl font-semibold">{topCategory}</div>
      </div>
    </section>
  )
}
