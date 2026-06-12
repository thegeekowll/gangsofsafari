'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  Car,
  LayoutDashboard,
  Map,
  FileText,
  MapPin,
  Hotel,
  Image,
  MessageSquare,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/tours', label: 'Tours', icon: Map },
  { href: '/admin/blog', label: 'Blog Posts', icon: FileText },
  { href: '/admin/destinations', label: 'Destinations', icon: MapPin },
  { href: '/admin/accommodations', label: 'Accommodations', icon: Hotel },
  { href: '/admin/gallery', label: 'Gallery', icon: Image },
  { href: '/admin/contacts', label: 'Messages', icon: MessageSquare },
]

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className={cn(
          'flex items-center gap-3 px-4 py-5 border-b border-stone-800',
          collapsed ? 'justify-center px-3' : ''
        )}
      >
        <div className="w-8 h-8 bg-safari-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <Car className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="font-display font-bold text-white text-sm leading-tight">
              Gangs of Safari
            </p>
            <p className="text-xs text-stone-500">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? label : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group',
                isActive
                  ? 'bg-safari-500 text-white shadow-md shadow-safari-500/20'
                  : 'text-stone-400 hover:text-white hover:bg-stone-800',
                collapsed ? 'justify-center px-2' : ''
              )}
            >
              <Icon
                className={cn(
                  'w-5 h-5 flex-shrink-0',
                  isActive ? 'text-white' : 'text-stone-400 group-hover:text-white'
                )}
              />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Collapse toggle (desktop) */}
      <div className="hidden lg:block px-3 pb-3">
        <button
          onClick={() => setCollapsed((v) => !v)}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-stone-400 hover:text-white hover:bg-stone-800 transition-all',
            collapsed ? 'justify-center px-2' : ''
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>

      {/* Logout */}
      <div className="px-3 pb-4 pt-1 border-t border-stone-800">
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-stone-400 hover:text-red-400 hover:bg-red-900/20 transition-all',
            collapsed ? 'justify-center px-2' : ''
          )}
          title={collapsed ? 'Sign out' : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen((v) => !v)}
        className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 bg-stone-900 rounded-lg flex items-center justify-center text-white shadow-lg"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'lg:hidden fixed top-0 left-0 z-50 h-full bg-stone-900 transition-transform duration-300',
          'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col flex-shrink-0 h-screen sticky top-0 bg-stone-900 transition-all duration-300',
          collapsed ? 'w-16' : 'w-60'
        )}
      >
        <SidebarContent />
      </aside>
    </>
  )
}
