'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Loader2, Save, Trash2, AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Blog } from '@prisma/client'

interface Props { blog: Blog }

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

export default function BlogEditForm({ blog }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [msg, setMsg] = useState('')

  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      coverImage: blog.coverImage || '',
      author: blog.author,
      tags: (() => { try { return (JSON.parse(blog.tags) as string[]).join(', ') } catch { return blog.tags } })(),
      featured: blog.featured,
      published: blog.published,
    },
  })

  async function onSubmit(data: FormData) {
    setStatus('saving')
    try {
      const payload = {
        ...data,
        tags: JSON.stringify(data.tags.split(',').map((t) => t.trim()).filter(Boolean)),
        publishedAt: data.published && !blog.publishedAt ? new Date().toISOString() : blog.publishedAt,
      }
      const res = await fetch(`/api/admin/blog/${blog.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Save failed')
      setStatus('success')
      setMsg('Post saved successfully.')
      router.refresh()
    } catch {
      setStatus('error')
      setMsg('Failed to save. Please try again.')
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this post? This cannot be undone.')) return
    const res = await fetch(`/api/admin/blog/${blog.id}`, { method: 'DELETE' })
    if (res.ok) router.push('/admin/blog')
    else alert('Failed to delete post.')
  }

  const inputClass = 'w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-safari-400 transition'
  const labelClass = 'block text-sm font-semibold text-stone-700 mb-2'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {status === 'success' && (
        <div className="flex items-center gap-3 p-4 bg-forest-50 border border-forest-200 rounded-xl text-sm text-forest-700">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />{msg}
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />{msg}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <h2 className="font-display font-bold text-lg text-stone-900 mb-5">Post Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className={labelClass}>Title</label>
            <input className={inputClass} {...register('title', { required: true })} />
          </div>
          <div>
            <label className={labelClass}>Slug</label>
            <input className={inputClass} {...register('slug', { required: true })} />
          </div>
          <div>
            <label className={labelClass}>Author</label>
            <input className={inputClass} {...register('author')} />
          </div>
          <div>
            <label className={labelClass}>Cover Image URL</label>
            <input className={inputClass} type="url" {...register('coverImage')} />
          </div>
          <div>
            <label className={labelClass}>Tags (comma-separated)</label>
            <input className={inputClass} {...register('tags')} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Excerpt</label>
            <textarea rows={3} className={cn(inputClass, 'resize-none')} {...register('excerpt', { required: true })} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <h2 className="font-display font-bold text-lg text-stone-900 mb-2">Content (Markdown)</h2>
        <textarea rows={20} className={cn(inputClass, 'resize-y font-mono text-xs mt-4')} {...register('content', { required: true })} />
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

      <div className="flex items-center justify-between pt-2">
        <button type="button" onClick={handleDelete} className="inline-flex items-center gap-2 px-5 py-2.5 border border-red-300 text-red-600 hover:bg-red-50 font-semibold text-sm rounded-xl transition-colors">
          <Trash2 className="w-4 h-4" /> Delete Post
        </button>
        <button type="submit" disabled={status === 'saving'} className="inline-flex items-center gap-2 px-6 py-2.5 bg-safari-500 hover:bg-safari-600 disabled:bg-safari-300 text-white font-bold text-sm rounded-xl transition-colors">
          {status === 'saving' ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Changes</>}
        </button>
      </div>
    </form>
  )
}
