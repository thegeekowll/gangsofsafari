import Link from 'next/link'
import { Mountain, MapPin, Phone, Mail, Instagram, Youtube, Facebook } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <div className="w-9 h-9 bg-safari-500 rounded-lg flex items-center justify-center">
                <Mountain className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-display font-bold text-white text-lg leading-tight block">
                  Gangs of Safari
                </span>
                <span className="text-xs text-safari-400 font-medium leading-none">
                  Adventure on Four Wheels
                </span>
              </div>
            </Link>
            <p className="text-sm text-stone-400 leading-relaxed mb-6">
              India&apos;s premier community for Tata Safari owners. Curated road trips, wildlife safaris, and mountain expeditions.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-stone-800 hover:bg-safari-500 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-stone-800 hover:bg-safari-500 rounded-lg flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-stone-800 hover:bg-safari-500 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-5">
              Explore
            </h3>
            <ul className="space-y-3">
              {[
                { href: '/tours', label: 'All Tours' },
                { href: '/destinations', label: 'Destinations' },
                { href: '/blog', label: 'Travel Blog' },
                { href: '/gallery', label: 'Gallery' },
                { href: '/about', label: 'About Us' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-400 hover:text-safari-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tours */}
          <div>
            <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-5">
              Tour Types
            </h3>
            <ul className="space-y-3">
              {[
                'Wildlife Safaris',
                'Mountain Expeditions',
                'Coastal Drives',
                'Desert Crossings',
                'Heritage Circuits',
                'Weekend Getaways',
              ].map((item) => (
                <li key={item}>
                  <Link
                    href={`/tours?type=${encodeURIComponent(item)}`}
                    className="text-sm text-stone-400 hover:text-safari-400 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-5">
              Get in Touch
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-stone-400">
                <MapPin className="w-4 h-4 text-safari-400 mt-0.5 shrink-0" />
                <span>Bangalore, Karnataka, India</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-stone-400">
                <Phone className="w-4 h-4 text-safari-400 shrink-0" />
                <a href="tel:+919876543210" className="hover:text-safari-400 transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-stone-400">
                <Mail className="w-4 h-4 text-safari-400 shrink-0" />
                <a
                  href="mailto:hello@gangsofsafari.com"
                  className="hover:text-safari-400 transition-colors"
                >
                  hello@gangsofsafari.com
                </a>
              </li>
            </ul>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 px-4 py-2 bg-forest-600 hover:bg-forest-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              WhatsApp Us
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-500">
            &copy; {new Date().getFullYear()} Gangs of Safari. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-stone-500 hover:text-stone-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-stone-500 hover:text-stone-300 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
