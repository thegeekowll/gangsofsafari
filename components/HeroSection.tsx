'use client'

import Link from 'next/link'
import { ArrowRight, Users, Map, Star, Route } from 'lucide-react'

const stats = [
  { icon: Users, value: '500+', label: 'Members' },
  { icon: Map, value: '50+', label: 'Tours' },
  { icon: Route, value: '25', label: 'States Covered' },
  { icon: Star, value: '10,000+', label: 'KMs Logged' },
]

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-stone-900">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/hero-banner.webp')",
        }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/70 to-stone-950/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />

      {/* Main content — centered vertically */}
      <div className="relative flex-1 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-safari-500/20 border border-safari-400/30 text-safari-300 text-sm font-medium px-4 py-2 rounded-full mb-8">
              <Star className="w-3.5 h-3.5 fill-safari-400 text-safari-400" />
              India&apos;s #1 Tata Safari Community
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-6">
              Adventure on{' '}
              <span className="text-safari-400">Four Wheels</span>
            </h1>

            <p className="text-lg sm:text-xl text-stone-300 leading-relaxed mb-10 max-w-xl">
              India&apos;s premier community for Tata Safari owners who live to explore.
              Curated road trips, wildlife safaris, and mountain expeditions — built for the gang.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/tours"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-safari-500 hover:bg-safari-600 text-white font-bold rounded-xl text-base transition-all shadow-lg shadow-safari-500/30 hover:shadow-safari-500/50 hover:-translate-y-0.5"
              >
                Explore Tours <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-white/30 hover:border-white/60 hover:bg-white/10 text-white font-semibold rounded-xl text-base transition-all backdrop-blur-sm"
              >
                Join the Community
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Animated scroll indicator */}
      <div className="relative flex flex-col items-center pb-8 gap-2 text-stone-400">
        <span className="text-xs font-medium tracking-[0.2em] uppercase">Scroll</span>
        <div className="relative w-5 h-8 border-2 border-stone-500 rounded-full flex justify-center pt-1">
          <span className="w-1 h-2 bg-safari-400 rounded-full animate-bounce" />
        </div>
      </div>

      {/* Stats bar */}
      <div className="relative bg-stone-950/80 backdrop-blur-sm border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-stone-800">
            {stats.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 px-6 py-5"
              >
                <div className="w-10 h-10 bg-safari-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-safari-400" />
                </div>
                <div>
                  <p className="text-white font-display font-bold text-xl leading-none">{value}</p>
                  <p className="text-stone-400 text-xs mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
