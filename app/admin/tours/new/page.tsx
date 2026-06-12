'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Loader2, Plus, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

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

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function NewTourPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: { difficulty: 'Moderate', maxGroupSize: 20, duration: 3, price: 15000 },
  })

  const title = watch('title')

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue('title', e.target.value)
    setValue('slug', slugify(e.target.value))
  }

  async function onSubmit(data: FormData) {
    setStatus('saving')
    setErrorMsg('')
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
      const res = await fetch('/api/admin/tours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to create tour')
      }
      const tour = await res.json()
      router.push(`/admin/tours/${tour.id}`)
    } catch (err: unknown) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  const inputClass = 'w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-safari-400 transition'
  const labelClass = 'block text-sm font-semibold text-stone-700 mb-2'

  return (
    <div>
      <h1 className="font-display font-black text-2xl text-stone-900 mb-8">New Tour</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {status === 'error' && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {errorMsg}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <h2 className="font-display font-bold text-lg text-stone-900 mb-5">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className={labelClass}>Tour Title *</label>
              <input
                className={cn(inputClass, errors.title ? 'border-red-300' : '')}
                placeholder="e.g. Ranthambore Wildlife Safari"
                {...register('title', { required: true })}
                onChange={handleTitleChange}
              />
            </div>
            <div>
              <label className={labelClass}>Slug (URL) *</label>
              <input className={inputClass} placeholder="ranthambore-wildlife-safari" {...register('slug', { required: true })} />
            </div>
            <div>
              <label className={labelClass}>Cover Image URL</label>
              <input className={inputClass} type="url" placeholder="https://..." {...register('coverImage')} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Description *</label>
              <textarea rows={4} className={cn(inputClass, 'resize-none')} placeholder="Describe the tour..." {...register('description', { required: true })} />
            </div>
          </div>
        </div>

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
              <select className={inputClass} {...register('difficulty')}>
                <option>Easy</option>
                <option>Moderate</option>
                <option>Challenging</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Max Group Size</label>
              <input type="number" min={1} className={inputClass} {...register('maxGroupSize', { required: true, min: 1 })} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <h2 className="font-display font-bold text-lg text-stone-900 mb-5">Highlights & Inclusions</h2>
          <p className="text-stone-400 text-xs mb-5">Enter one item per line.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className={labelClass}>Highlights</label>
              <textarea rows={6} className={cn(inputClass, 'resize-none')} placeholder="Tiger spotting in the wild&#10;Ranthambore Fort..." {...register('highlights')} />
            </div>
            <div>
              <label className={labelClass}>Included</label>
              <textarea rows={6} className={cn(inputClass, 'resize-none')} placeholder="4 nights accommodation&#10;All meals..." {...register('included')} />
            </div>
            <div>
              <label className={labelClass}>Excluded</label>
              <textarea rows={6} className={cn(inputClass, 'resize-none')} placeholder="Personal fuel costs&#10;Tips..." {...register('excluded')} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <h2 className="font-display font-bold text-lg text-stone-900 mb-5">Publish Settings</h2>
          <div className="flex flex-wrap gap-8">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-safari-500" {...register('published')} />
              <span className="text-sm font-medium text-stone-700">Published</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-safari-500" {...register('featured')} />
              <span className="text-sm font-medium text-stone-700">Featured</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={status === 'saving'}
            className="inline-flex items-center gap-2 px-6 py-3 bg-safari-500 hover:bg-safari-600 disabled:bg-safari-300 text-white font-bold text-sm rounded-xl transition-colors"
          >
            {status === 'saving' ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</>
            ) : (
              <><Plus className="w-4 h-4" /> Create Tour</>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
