'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Car, Menu, X, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/tours', label: 'Tours' },
  { href: '/destinations', label: 'Destinations' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const isHome = pathname === '/'
  const transparent = isHome && !scrolled

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          transparent ? 'bg-transparent' : 'bg-white shadow-md'
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="w-9 h-9 bg-safari-500 rounded-lg flex items-center justify-center group-hover:bg-safari-600 transition-colors">
                <Car className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span
                  className={cn(
                    'font-display font-bold text-lg leading-tight transition-colors',
                    transparent ? 'text-white' : 'text-safari-600'
                  )}
                >
                  Gangs of Safari
                </span>
                <span
                  className={cn(
                    'text-xs font-medium transition-colors hidden sm:block',
                    transparent ? 'text-orange-200' : 'text-stone-500'
                  )}
                >
                  Adventure on four wheels
                </span>
              </div>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    pathname === link.href
                      ? transparent
                        ? 'text-white bg-white/20'
                        : 'text-safari-600 bg-safari-50'
                      : transparent
                      ? 'text-white/90 hover:text-white hover:bg-white/10'
                      : 'text-stone-600 hover:text-safari-600 hover:bg-safari-50'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTA + Hamburger */}
            <div className="flex items-center gap-3">
              <Link
                href="/tours"
                className="hidden sm:inline-flex items-center gap-1.5 bg-safari-500 hover:bg-safari-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
              >
                <MapPin className="w-4 h-4" />
                Book Now
              </Link>

              <button
                onClick={() => setMobileOpen((v) => !v)}
                className={cn(
                  'lg:hidden p-2 rounded-md transition-colors',
                  transparent
                    ? 'text-white hover:bg-white/10'
                    : 'text-stone-600 hover:bg-stone-100'
                )}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile menu */}
        <div
          className={cn(
            'lg:hidden overflow-hidden transition-all duration-300 bg-white border-t border-stone-100',
            mobileOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-safari-50 text-safari-600'
                    : 'text-stone-700 hover:bg-stone-50 hover:text-safari-600'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 pb-1">
              <Link
                href="/tours"
                className="flex items-center justify-center gap-1.5 w-full bg-safari-500 hover:bg-safari-600 text-white text-sm font-semibold px-4 py-3 rounded-lg transition-colors"
              >
                <MapPin className="w-4 h-4" />
                Book a Tour
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay for mobile menu */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  )
}
