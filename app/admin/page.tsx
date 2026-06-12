import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Map, FileText, MapPin, MessageSquare, Eye, ArrowRight, Plus } from 'lucide-react'

async function getStats() {
  const [tours, blogs, destinations, contacts, unreadContacts] = await Promise.all([
    prisma.tour.count(),
    prisma.blog.count(),
    prisma.destination.count(),
    prisma.contact.count(),
    prisma.contact.count({ where: { read: false } }),
  ])
  return { tours, blogs, destinations, contacts, unreadContacts }
}

async function getRecentContacts() {
  return prisma.contact.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  })
}

async function getRecentTours() {
  return prisma.tour.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { destinations: { include: { destination: true } } },
  })
}

export default async function AdminDashboard() {
  const [stats, recentContacts, recentTours] = await Promise.all([
    getStats(),
    getRecentContacts(),
    getRecentTours(),
  ])

  const statCards = [
    {
      label: 'Total Tours',
      value: stats.tours,
      icon: Map,
      href: '/admin/tours',
      color: 'text-safari-600',
      bg: 'bg-safari-50',
      border: 'border-safari-200',
    },
    {
      label: 'Blog Posts',
      value: stats.blogs,
      icon: FileText,
      href: '/admin/blog',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
    },
    {
      label: 'Destinations',
      value: stats.destinations,
      icon: MapPin,
      href: '/admin/destinations',
      color: 'text-forest-600',
      bg: 'bg-forest-50',
      border: 'border-forest-200',
    },
    {
      label: 'Messages',
      value: stats.contacts,
      icon: MessageSquare,
      href: '/admin/contacts',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      badge: stats.unreadContacts > 0 ? stats.unreadContacts : undefined,
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-black text-2xl text-stone-900">Dashboard</h1>
          <p className="text-stone-500 text-sm mt-1">Welcome back. Here&apos;s what&apos;s happening.</p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700 transition-colors"
        >
          <Eye className="w-4 h-4" /> View Site
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {statCards.map(({ label, value, icon: Icon, href, color, bg, border, badge }) => (
          <Link
            key={label}
            href={href}
            className={`relative bg-white rounded-2xl border ${border} p-6 hover:shadow-md transition-all group`}
          >
            {badge && (
              <span className="absolute top-4 right-4 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {badge}
              </span>
            )}
            <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center mb-4`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="font-display font-black text-3xl text-stone-900 mb-1">{value}</p>
            <p className="text-stone-500 text-sm">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Tours */}
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
            <h2 className="font-display font-bold text-stone-900">Recent Tours</h2>
            <Link href="/admin/tours/new" className="inline-flex items-center gap-1 text-xs text-safari-600 font-semibold hover:text-safari-700">
              <Plus className="w-3.5 h-3.5" /> New Tour
            </Link>
          </div>
          {recentTours.length === 0 ? (
            <div className="p-8 text-center text-stone-400 text-sm">No tours yet.</div>
          ) : (
            <ul className="divide-y divide-stone-50">
              {recentTours.map((tour) => (
                <li key={tour.id}>
                  <Link
                    href={`/admin/tours/${tour.id}`}
                    className="flex items-center justify-between px-6 py-3.5 hover:bg-stone-50 transition-colors group"
                  >
                    <div className="min-w-0">
                      <p className="text-stone-800 font-medium text-sm truncate group-hover:text-safari-600 transition-colors">
                        {tour.title}
                      </p>
                      <p className="text-stone-400 text-xs mt-0.5">
                        {tour.duration} days ·{' '}
                        <span className={tour.published ? 'text-forest-600' : 'text-amber-600'}>
                          {tour.published ? 'Published' : 'Draft'}
                        </span>
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-safari-400 flex-shrink-0 ml-3" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <div className="px-6 py-3 border-t border-stone-50">
            <Link href="/admin/tours" className="text-xs text-safari-600 font-semibold hover:text-safari-700">
              View all tours →
            </Link>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
            <h2 className="font-display font-bold text-stone-900">Recent Messages</h2>
            {stats.unreadContacts > 0 && (
              <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">
                {stats.unreadContacts} unread
              </span>
            )}
          </div>
          {recentContacts.length === 0 ? (
            <div className="p-8 text-center text-stone-400 text-sm">No messages yet.</div>
          ) : (
            <ul className="divide-y divide-stone-50">
              {recentContacts.map((contact) => (
                <li key={contact.id}>
                  <Link
                    href="/admin/contacts"
                    className="flex items-start gap-3 px-6 py-3.5 hover:bg-stone-50 transition-colors group"
                  >
                    <div className="w-8 h-8 bg-stone-200 rounded-full flex items-center justify-center text-stone-600 font-bold text-xs flex-shrink-0 mt-0.5">
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-stone-800 font-medium text-sm truncate">{contact.name}</p>
                        {!contact.read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-stone-400 text-xs truncate mt-0.5">{contact.message}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <div className="px-6 py-3 border-t border-stone-50">
            <Link href="/admin/contacts" className="text-xs text-safari-600 font-semibold hover:text-safari-700">
              View all messages →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
