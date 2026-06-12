import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { MapPin, Eye } from 'lucide-react'

async function getDestinations() {
  return prisma.destination.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { tours: true, accommodations: true } } },
  })
}

export default async function AdminDestinationsPage() {
  const destinations = await getDestinations()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-black text-2xl text-stone-900">Destinations</h1>
          <p className="text-stone-500 text-sm mt-1">{destinations.length} destination{destinations.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {destinations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-16 text-center">
          <MapPin className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-400 text-lg">No destinations yet. Run the seed script to add sample data.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {destinations.map((dest) => (
            <div key={dest.id} className="bg-white rounded-2xl border border-stone-200 p-5 hover:border-safari-300 hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-display font-bold text-stone-900">{dest.name}</h3>
                  <div className="flex items-center gap-1 text-stone-400 text-xs mt-0.5">
                    <MapPin className="w-3 h-3" />{dest.state}
                  </div>
                </div>
                <Link href={`/destinations/${dest.slug}`} target="_blank" className="p-1.5 text-stone-400 hover:text-safari-600 transition-colors flex-shrink-0">
                  <Eye className="w-4 h-4" />
                </Link>
              </div>
              <p className="text-stone-500 text-xs line-clamp-2 mb-4">{dest.description}</p>
              <div className="flex gap-4 text-xs text-stone-500">
                <span>{dest._count.tours} tours</span>
                <span>{dest._count.accommodations} stays</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
