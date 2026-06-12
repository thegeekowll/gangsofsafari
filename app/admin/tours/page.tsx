import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { Plus, Pencil, Eye, Clock, Users } from 'lucide-react'

async function getTours() {
  return prisma.tour.findMany({
    orderBy: { createdAt: 'desc' },
    include: { destinations: { include: { destination: true } } },
  })
}

export default async function AdminToursPage() {
  const tours = await getTours()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-black text-2xl text-stone-900">Tours</h1>
          <p className="text-stone-500 text-sm mt-1">{tours.length} tour{tours.length !== 1 ? 's' : ''} total</p>
        </div>
        <Link
          href="/admin/tours/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-safari-500 hover:bg-safari-600 text-white font-semibold text-sm rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" /> New Tour
        </Link>
      </div>

      {tours.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-16 text-center">
          <p className="text-stone-400 text-lg mb-4">No tours yet.</p>
          <Link
            href="/admin/tours/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-safari-500 text-white rounded-xl font-semibold text-sm hover:bg-safari-600 transition-colors"
          >
            <Plus className="w-4 h-4" /> Create your first tour
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Tour</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider hidden md:table-cell">Duration</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider hidden lg:table-cell">Price</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider hidden lg:table-cell">Difficulty</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {tours.map((tour) => (
                  <tr key={tour.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-stone-900 text-sm">{tour.title}</p>
                        <p className="text-stone-400 text-xs mt-0.5">
                          {tour.destinations.map((d) => d.destination.name).join(', ') || 'No destinations'}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="inline-flex items-center gap-1 text-xs text-stone-600">
                        <Clock className="w-3.5 h-3.5" />
                        {tour.duration} days
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="text-sm text-stone-700 font-medium">{formatPrice(tour.price)}</span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="text-xs text-stone-600">{tour.difficulty}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`inline-block w-2 h-2 rounded-full ${tour.published ? 'bg-forest-500' : 'bg-amber-400'}`} />
                        <span className="text-xs text-stone-600">{tour.published ? 'Published' : 'Draft'}</span>
                      </div>
                      {tour.featured && (
                        <span className="text-xs text-safari-600 font-medium">Featured</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/tours/${tour.slug}`}
                          target="_blank"
                          className="p-1.5 text-stone-400 hover:text-stone-600 transition-colors"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/tours/${tour.id}`}
                          className="p-1.5 text-stone-400 hover:text-safari-600 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
