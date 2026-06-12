'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Car, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      if (result?.error) {
        setError('Invalid email or password. Please try again.')
      } else {
        router.push('/admin')
        router.refresh()
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-safari-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Car className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display font-black text-2xl text-white">Gangs of Safari</h1>
          <p className="text-stone-400 text-sm mt-1">Admin Panel</p>
        </div>

        {/* Card */}
        <div className="bg-stone-900 border border-stone-700 rounded-2xl p-8">
          <h2 className="font-display font-bold text-xl text-white mb-6">Sign In</h2>

          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-900/30 border border-red-800 rounded-xl text-sm text-red-300 mb-6">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-stone-300 mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gangsofsafari.com"
                required
                className="w-full px-4 py-3 rounded-xl bg-stone-800 border border-stone-600 text-white placeholder-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-safari-400 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-300 mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-stone-800 border border-stone-600 text-white placeholder-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-safari-400 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-safari-500 hover:bg-safari-600 disabled:bg-safari-400 text-white font-bold rounded-xl text-sm transition-colors mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-stone-600 text-xs mt-6">
          Gangs of Safari Admin Panel · Restricted Access
        </p>
      </div>
    </div>
  )
}
