'use client'

import { useMemo } from 'react'
import { SummaryCards } from '../components/SummaryCards'
import { ExpenseForm } from '../components/ExpenseForm'
import { ExpenseTable } from '../components/ExpenseTable'
import { Filters } from '../components/Filters'
import { Charts } from '../components/Charts'
import { ImportExport } from '../components/ImportExport'
import { useExpensesStore } from '../lib/store'

export default function Page() {
  const expenses = useExpensesStore((s) => s.filteredExpenses)
  const categories = useExpensesStore((s) => s.categories)

  const hasData = useMemo(() => expenses.length > 0, [expenses])

  return (
    <main className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Personal Expenses Dashboard</h1>
          <p className="text-sm text-slate-600">Add expenses, filter, and view insights</p>
        </div>
        <ImportExport />
      </header>

      <SummaryCards />

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card lg:col-span-1">
          <div className="card-header">Add Expense</div>
          <div className="card-body">
            <ExpenseForm />
          </div>
        </div>
        <div className="card lg:col-span-2">
          <div className="card-header">Filters</div>
          <div className="card-body">
            <Filters />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <div className="card-header">Spending Overview</div>
          <div className="card-body">
            <Charts />
          </div>
        </div>
        <div className="card lg:col-span-1">
          <div className="card-header">Categories</div>
          <div className="card-body text-sm text-slate-700">
            {categories.length === 0 ? (
              <p className="text-slate-500">No categories yet. Add an expense to create one.</p>
            ) : (
              <ul className="list-disc pl-5">
                {categories.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <section className="card">
        <div className="card-header">Expenses</div>
        <div className="card-body">
          <ExpenseTable />
        </div>
      </section>

      {!hasData && (
        <p className="text-center text-slate-500">Start by adding your first expense.</p>
      )}
    </main>
  )
}
