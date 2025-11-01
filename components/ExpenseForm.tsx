'use client'

import { useState, useMemo } from 'react'
import { useExpensesStore } from '../lib/store'
import { parseAmount } from '../lib/utils'

export function ExpenseForm() {
  const addExpense = useExpensesStore((s) => s.addExpense)
  const categories = useExpensesStore((s) => s.categories)
  const addCategory = useExpensesStore((s) => s.addCategory)

  const today = useMemo(() => new Date().toISOString().slice(0, 10), [])

  const [date, setDate] = useState(today)
  const [description, setDescription] = useState('')
  const [amountInput, setAmountInput] = useState('')
  const [category, setCategory] = useState(categories[0] ?? 'Other')

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const amount = parseAmount(amountInput)
    if (!date || !description || !amount || !category) return

    addExpense({ date, description, amount, category })
    if (!categories.includes(category)) addCategory(category)

    setDescription('')
    setAmountInput('')
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="space-y-1">
        <label className="text-sm text-slate-600">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
          required
        />
      </div>
      <div className="space-y-1 sm:col-span-2">
        <label className="text-sm text-slate-600">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., Groceries at Market"
          className="w-full rounded-md border border-slate-300 px-3 py-2"
          required
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm text-slate-600">Amount</label>
        <input
          inputMode="decimal"
          value={amountInput}
          onChange={(e) => setAmountInput(e.target.value)}
          placeholder="e.g., 45.67"
          className="w-full rounded-md border border-slate-300 px-3 py-2"
          required
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm text-slate-600">Category</label>
        <input
          list="categories"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
          placeholder="Choose or type a category"
        />
        <datalist id="categories">
          {categories.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </div>
      <div className="sm:col-span-2">
        <button
          type="submit"
          className="w-full rounded-md bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-800"
        >
          Add Expense
        </button>
      </div>
    </form>
  )
}
