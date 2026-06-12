'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Loader2, Plus, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FormData {
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  author: string
  tags: string
  featured: boolean
  published: boolean
}

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function NewBlogPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: { author: 'Gangs of Safari Team' },
  })

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
        tags: JSON.stringify(data.tags.split(',').map((t) => t.trim()).filter(Boolean)),
        publishedAt: data.published ? new Date().toISOString() : null,
      }
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to create post')
      }
      const post = await res.json()
      router.push(`/admin/blog/${post.id}`)
    } catch (err: unknown) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  const inputClass = 'w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-safari-400 transition'
  const labelClass = 'block text-sm font-semibold text-stone-700 mb-2'

  return (
    <div>
      <h1 className="font-display font-black text-2xl text-stone-900 mb-8">New Blog Post</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {status === 'error' && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {errorMsg}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <h2 className="font-display font-bold text-lg text-stone-900 mb-5">Post Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className={labelClass}>Title *</label>
              <input className={cn(inputClass, errors.title ? 'border-red-300' : '')} placeholder="e.g. 10 Best Road Trips for Safari Owners" {...register('title', { required: true })} onChange={handleTitleChange} />
            </div>
            <div>
              <label className={labelClass}>Slug *</label>
              <input className={inputClass} placeholder="10-best-road-trips-safari-owners" {...register('slug', { required: true })} />
            </div>
            <div>
              <label className={labelClass}>Author</label>
              <input className={inputClass} {...register('author')} />
            </div>
            <div>
              <label className={labelClass}>Cover Image URL</label>
              <input className={inputClass} type="url" placeholder="https://..." {...register('coverImage')} />
            </div>
            <div>
              <label className={labelClass}>Tags (comma-separated)</label>
              <input className={inputClass} placeholder="Road Trip, Wildlife, Tips" {...register('tags')} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Excerpt *</label>
              <textarea rows={3} className={cn(inputClass, 'resize-none', errors.excerpt ? 'border-red-300' : '')} placeholder="A short summary of the post..." {...register('excerpt', { required: true })} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <h2 className="font-display font-bold text-lg text-stone-900 mb-2">Content</h2>
          <p className="text-stone-400 text-xs mb-4">Write in Markdown format.</p>
          <textarea rows={20} className={cn(inputClass, 'resize-y font-mono text-xs', errors.content ? 'border-red-300' : '')} placeholder="# Your Post Title&#10;&#10;Start writing..." {...register('content', { required: true })} />
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
          <button type="submit" disabled={status === 'saving'} className="inline-flex items-center gap-2 px-6 py-3 bg-safari-500 hover:bg-safari-600 disabled:bg-safari-300 text-white font-bold text-sm rounded-xl transition-colors">
            {status === 'saving' ? <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</> : <><Plus className="w-4 h-4" /> Create Post</>}
          </button>
        </div>
      </form>
    </div>
  )
}
