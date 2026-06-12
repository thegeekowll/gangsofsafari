'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FormData {
  name: string
  email: string
  phone: string
  tourOfInterest: string
  message: string
}

interface Tour {
  id: string
  title: string
}

interface ContactFormProps {
  tours?: Tour[]
  defaultTour?: string
}

export default function ContactForm({ tours = [], defaultTour = '' }: ContactFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { tourOfInterest: defaultTour },
  })

  async function onSubmit(data: FormData) {
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to send')
      setStatus('success')
      reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-forest-500 mx-auto mb-4" />
        <h3 className="font-display font-bold text-xl text-stone-900 mb-2">Message Sent!</h3>
        <p className="text-stone-500 mb-6">
          Thanks for reaching out. We&apos;ll get back to you within 24 hours.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="px-5 py-2.5 bg-safari-500 text-white rounded-lg font-semibold text-sm hover:bg-safari-600 transition-colors"
        >
          Send Another Message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {status === 'error' && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          Something went wrong. Please try again or email us directly.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2" htmlFor="name">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            placeholder="Rahul Kumar"
            className={cn(
              'w-full px-4 py-3 rounded-xl border bg-white text-stone-900 text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-safari-400 transition',
              errors.name ? 'border-red-300' : 'border-stone-300'
            )}
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2" htmlFor="email">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            placeholder="rahul@example.com"
            className={cn(
              'w-full px-4 py-3 rounded-xl border bg-white text-stone-900 text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-safari-400 transition',
              errors.email ? 'border-red-300' : 'border-stone-300'
            )}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-2" htmlFor="phone">
          Phone Number <span className="text-stone-400 font-normal">(optional)</span>
        </label>
        <input
          id="phone"
          type="tel"
          placeholder="+91 98765 43210"
          className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-safari-400 transition"
          {...register('phone')}
        />
      </div>

      {tours.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2" htmlFor="tourOfInterest">
            Tour of Interest <span className="text-stone-400 font-normal">(optional)</span>
          </label>
          <select
            id="tourOfInterest"
            className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-safari-400 transition"
            {...register('tourOfInterest')}
          >
            <option value="">Select a tour...</option>
            {tours.map((t) => (
              <option key={t.id} value={t.title}>{t.title}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-2" htmlFor="message">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          rows={5}
          placeholder="Tell us about your interest — which tour, your experience level, any specific requirements..."
          className={cn(
            'w-full px-4 py-3 rounded-xl border bg-white text-stone-900 text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-safari-400 transition resize-none',
            errors.message ? 'border-red-300' : 'border-stone-300'
          )}
          {...register('message', {
            required: 'Please enter your message',
            minLength: { value: 10, message: 'Message should be at least 10 characters' },
          })}
        />
        {errors.message && (
          <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="inline-flex items-center gap-2 px-8 py-3.5 bg-safari-500 hover:bg-safari-600 disabled:bg-safari-300 text-white font-bold rounded-xl text-sm transition-colors w-full sm:w-auto justify-center"
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Send Message
          </>
        )}
      </button>
    </form>
  )
}
