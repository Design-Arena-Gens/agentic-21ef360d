'use client'

import { useRef } from 'react'
import { useExpensesStore } from '../lib/store'

export function ImportExport() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const expenses = useExpensesStore((s) => s.expenses)
  const categories = useExpensesStore((s) => s.categories)
  const importData = useExpensesStore((s) => s.importData)
  const clearAll = useExpensesStore((s) => s.clearAll)

  function doExport() {
    const data = JSON.stringify({ expenses, categories }, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'expenses-export.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function triggerImport() {
    fileInputRef.current?.click()
  }

  function onFileChange(ev: React.ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const obj = JSON.parse(String(reader.result)) as { expenses?: any[]; categories?: string[] }
        // Basic validation
        if (obj.expenses && !Array.isArray(obj.expenses)) throw new Error('Invalid expenses')
        if (obj.categories && !Array.isArray(obj.categories)) throw new Error('Invalid categories')
        importData({
          expenses: obj.expenses?.map((e) => ({
            id: e.id ?? crypto.randomUUID(),
            date: String(e.date ?? '').slice(0, 10),
            description: String(e.description ?? ''),
            amount: Number(e.amount ?? 0),
            category: String(e.category ?? 'Other'),
          })),
          categories: obj.categories,
        })
      } catch (e) {
        alert('Failed to import file: ' + (e as Error).message)
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={doExport}
        className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100"
      >
        Export JSON
      </button>
      <button
        onClick={triggerImport}
        className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100"
      >
        Import JSON
      </button>
      <button
        onClick={() => {
          if (confirm('This will delete all expenses and reset categories. Continue?')) clearAll()
        }}
        className="rounded-md border border-red-300 px-3 py-2 text-sm text-red-700 hover:bg-red-50"
      >
        Reset Data
      </button>
      <input ref={fileInputRef} type="file" accept="application/json" onChange={onFileChange} className="hidden" />
    </div>
  )
}
