'use client'

import { useMemo, useState } from 'react'
import { useExpensesStore } from '../lib/store'
import { formatCurrency } from '../lib/utils'
import type { Expense } from '../lib/types'

export function ExpenseTable() {
  const expenses = useExpensesStore((s) => s.filteredExpenses)
  const deleteExpense = useExpensesStore((s) => s.deleteExpense)
  const updateExpense = useExpensesStore((s) => s.updateExpense)
  const categories = useExpensesStore((s) => s.categories)

  const [editId, setEditId] = useState<string | null>(null)
  const [draft, setDraft] = useState<Partial<Expense>>({})

  const columns = useMemo(
    () => [
      { key: 'date', label: 'Date' },
      { key: 'description', label: 'Description' },
      { key: 'category', label: 'Category' },
      { key: 'amount', label: 'Amount' },
      { key: 'actions', label: '' },
    ],
    []
  )

  function onEditStart(expense: Expense) {
    setEditId(expense.id)
    setDraft(expense)
  }

  function onEditCancel() {
    setEditId(null)
    setDraft({})
  }

  function onEditSave() {
    if (!editId) return
    updateExpense(editId, {
      date: draft.date!,
      description: draft.description!,
      category: draft.category!,
      amount: Number(draft.amount!),
    })
    setEditId(null)
    setDraft({})
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {expenses.map((e) => (
            <tr key={e.id} className="hover:bg-slate-50">
              <td className="whitespace-nowrap px-3 py-2 text-sm">
                {editId === e.id ? (
                  <input
                    type="date"
                    value={draft.date as string}
                    onChange={(ev) => setDraft((d) => ({ ...d, date: ev.target.value }))}
                    className="rounded-md border border-slate-300 px-2 py-1"
                  />
                ) : (
                  e.date
                )}
              </td>
              <td className="px-3 py-2 text-sm">
                {editId === e.id ? (
                  <input
                    type="text"
                    value={draft.description as string}
                    onChange={(ev) => setDraft((d) => ({ ...d, description: ev.target.value }))}
                    className="w-full rounded-md border border-slate-300 px-2 py-1"
                  />
                ) : (
                  e.description
                )}
              </td>
              <td className="whitespace-nowrap px-3 py-2 text-sm">
                {editId === e.id ? (
                  <select
                    value={draft.category as string}
                    onChange={(ev) => setDraft((d) => ({ ...d, category: ev.target.value }))}
                    className="rounded-md border border-slate-300 px-2 py-1"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                ) : (
                  e.category
                )}
              </td>
              <td className="whitespace-nowrap px-3 py-2 text-sm">
                {editId === e.id ? (
                  <input
                    type="number"
                    step="0.01"
                    value={String(draft.amount)}
                    onChange={(ev) => setDraft((d) => ({ ...d, amount: Number(ev.target.value) }))}
                    className="w-28 rounded-md border border-slate-300 px-2 py-1 text-right"
                  />
                ) : (
                  <span className="tabular-nums">{formatCurrency(e.amount)}</span>
                )}
              </td>
              <td className="whitespace-nowrap px-3 py-2 text-right text-sm">
                {editId === e.id ? (
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={onEditSave} className="rounded-md bg-emerald-600 px-2 py-1 text-white hover:bg-emerald-500">Save</button>
                    <button onClick={onEditCancel} className="rounded-md border border-slate-300 px-2 py-1 hover:bg-slate-100">Cancel</button>
                  </div>
                ) : (
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => onEditStart(e)} className="rounded-md border border-slate-300 px-2 py-1 hover:bg-slate-100">Edit</button>
                    <button onClick={() => deleteExpense(e.id)} className="rounded-md bg-red-600 px-2 py-1 text-white hover:bg-red-500">Delete</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
          {expenses.length === 0 && (
            <tr>
              <td colSpan={5} className="px-3 py-6 text-center text-sm text-slate-500">No expenses match your filters.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
