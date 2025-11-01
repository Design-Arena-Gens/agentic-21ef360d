import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Expenses Dashboard',
  description: 'Track and visualize your personal expenses',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <div className="container py-6">
          {children}
        </div>
      </body>
    </html>
  )
}
