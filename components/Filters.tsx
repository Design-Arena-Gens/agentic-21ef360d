'use client'

import { useMemo } from 'react'
import { useExpensesStore } from '../lib/store'

export function Filters() {
  const filters = useExpensesStore((s) => s.filters)
  const setFilters = useExpensesStore((s) => s.setFilters)
  const clearFilters = useExpensesStore((s) => s.clearFilters)
  const categories = useExpensesStore((s) => s.categories)

  const categoryOptions = useMemo(() => ['All', ...categories], [categories])

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="space-y-1">
        <label className="text-sm text-slate-600">From</label>
        <input
          type="date"
          value={filters.fromDate ?? ''}
          onChange={(e) => setFilters({ fromDate: e.target.value || undefined })}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm text-slate-600">To</label>
        <input
          type="date"
          value={filters.toDate ?? ''}
          onChange={(e) => setFilters({ toDate: e.target.value || undefined })}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm text-slate-600">Category</label>
        <select
          value={filters.category ?? 'All'}
          onChange={(e) => setFilters({ category: e.target.value })}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        >
          {categoryOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <label className="text-sm text-slate-600">Search</label>
        <input
          type="text"
          value={filters.query ?? ''}
          onChange={(e) => setFilters({ query: e.target.value || undefined })}
          placeholder="Search description"
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </div>
      <div className="sm:col-span-2 lg:col-span-4">
        <button
          onClick={clearFilters}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100"
        >
          Clear Filters
        </button>
      </div>
    </div>
  )
}
