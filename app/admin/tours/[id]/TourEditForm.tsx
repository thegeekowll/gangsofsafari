'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Loader2, Save, Trash2, AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Tour, Destination } from '@prisma/client'

interface Props {
  tour: Tour & {
    destinations: { destinationId: string; destination: Destination }[]
    itinerary: {
      id: string
      day: number
      title: string
      description: string
      activities: string
      accommodationId: string | null
    }[]
  }
  destinations: Destination[]
}

interface FormData {
  title: string
  slug: string
  description: string
  coverImage: string
  duration: number
  price: number
  difficulty: string
  maxGroupSize: number
  highlights: string
  included: string
  excluded: string
  featured: boolean
  published: boolean
}

export default function TourEditForm({ tour, destinations }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [statusMsg, setStatusMsg] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    defaultValues: {
      title: tour.title,
      slug: tour.slug,
      description: tour.description,
      coverImage: tour.coverImage || '',
      duration: tour.duration,
      price: tour.price,
      difficulty: tour.difficulty,
      maxGroupSize: tour.maxGroupSize,
      highlights: (() => {
        try { return JSON.parse(tour.highlights).join('\n') } catch { return tour.highlights }
      })(),
      included: (() => {
        try { return JSON.parse(tour.included).join('\n') } catch { return tour.included }
      })(),
      excluded: (() => {
        try { return JSON.parse(tour.excluded).join('\n') } catch { return tour.excluded }
      })(),
      featured: tour.featured,
      published: tour.published,
    },
  })

  async function onSubmit(data: FormData) {
    setStatus('saving')
    try {
      const payload = {
        ...data,
        duration: Number(data.duration),
        price: Number(data.price),
        maxGroupSize: Number(data.maxGroupSize),
        highlights: JSON.stringify(data.highlights.split('\n').filter(Boolean)),
        included: JSON.stringify(data.included.split('\n').filter(Boolean)),
        excluded: JSON.stringify(data.excluded.split('\n').filter(Boolean)),
      }
      const res = await fetch(`/api/admin/tours/${tour.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Save failed')
      setStatus('success')
      setStatusMsg('Tour saved successfully.')
      router.refresh()
    } catch {
      setStatus('error')
      setStatusMsg('Failed to save. Please try again.')
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this tour? This cannot be undone.')) return
    try {
      const res = await fetch(`/api/admin/tours/${tour.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      router.push('/admin/tours')
    } catch {
      alert('Failed to delete tour.')
    }
  }

  const inputClass = 'w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-safari-400 transition'
  const labelClass = 'block text-sm font-semibold text-stone-700 mb-2'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Status banner */}
      {status === 'success' && (
        <div className="flex items-center gap-3 p-4 bg-forest-50 border border-forest-200 rounded-xl text-sm text-forest-700">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          {statusMsg}
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {statusMsg}
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <h2 className="font-display font-bold text-lg text-stone-900 mb-5">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className={labelClass}>Tour Title</label>
            <input className={cn(inputClass, errors.title ? 'border-red-300' : '')} {...register('title', { required: true })} />
          </div>
          <div>
            <label className={labelClass}>Slug (URL)</label>
            <input className={inputClass} {...register('slug', { required: true })} />
          </div>
          <div>
            <label className={labelClass}>Cover Image URL</label>
            <input className={inputClass} type="url" {...register('coverImage')} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Description</label>
            <textarea rows={4} className={cn(inputClass, 'resize-none')} {...register('description', { required: true })} />
          </div>
        </div>
      </div>

      {/* Tour Details */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <h2 className="font-display font-bold text-lg text-stone-900 mb-5">Tour Details</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <div>
            <label className={labelClass}>Duration (days)</label>
            <input type="number" min={1} className={inputClass} {...register('duration', { required: true, min: 1 })} />
          </div>
          <div>
            <label className={labelClass}>Price (₹)</label>
            <input type="number" min={0} className={inputClass} {...register('price', { required: true, min: 0 })} />
          </div>
          <div>
            <label className={labelClass}>Difficulty</label>
            <select className={inputClass} {...register('difficulty', { required: true })}>
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Challenging">Challenging</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Max Group Size</label>
            <input type="number" min={1} className={inputClass} {...register('maxGroupSize', { required: true, min: 1 })} />
          </div>
        </div>
      </div>

      {/* Lists */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <h2 className="font-display font-bold text-lg text-stone-900 mb-5">Highlights & Inclusions</h2>
        <p className="text-stone-400 text-xs mb-5">Enter one item per line.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className={labelClass}>Highlights</label>
            <textarea rows={8} className={cn(inputClass, 'resize-none')} {...register('highlights')} />
          </div>
          <div>
            <label className={labelClass}>Included</label>
            <textarea rows={8} className={cn(inputClass, 'resize-none')} {...register('included')} />
          </div>
          <div>
            <label className={labelClass}>Excluded</label>
            <textarea rows={8} className={cn(inputClass, 'resize-none')} {...register('excluded')} />
          </div>
        </div>
      </div>

      {/* Publish Settings */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <h2 className="font-display font-bold text-lg text-stone-900 mb-5">Publish Settings</h2>
        <div className="flex flex-wrap gap-8">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 accent-safari-500" {...register('published')} />
            <span className="text-sm font-medium text-stone-700">Published (visible on site)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 accent-safari-500" {...register('featured')} />
            <span className="text-sm font-medium text-stone-700">Featured (show on homepage)</span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={handleDelete}
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-red-300 text-red-600 hover:bg-red-50 font-semibold text-sm rounded-xl transition-colors"
        >
          <Trash2 className="w-4 h-4" /> Delete Tour
        </button>
        <button
          type="submit"
          disabled={status === 'saving'}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-safari-500 hover:bg-safari-600 disabled:bg-safari-300 text-white font-bold text-sm rounded-xl transition-colors"
        >
          {status === 'saving' ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
          ) : (
            <><Save className="w-4 h-4" /> Save Changes</>
          )}
        </button>
      </div>
    </form>
  )
}
