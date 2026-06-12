'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCheck, Loader2 } from 'lucide-react'

interface Props { id: string }

export default function MarkReadButton({ id }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleMarkRead() {
    setLoading(true)
    try {
      await fetch(`/api/admin/contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      })
      router.refresh()
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleMarkRead}
      disabled={loading}
      className="flex-shrink-0 inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-forest-600 border border-stone-200 hover:border-forest-300 px-3 py-1.5 rounded-lg transition-colors"
    >
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCheck className="w-3.5 h-3.5" />}
      Mark Read
    </button>
  )
}
