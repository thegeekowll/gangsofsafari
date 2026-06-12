import { prisma } from '@/lib/prisma'
import DestinationCard from '@/components/DestinationCard'
import Link from 'next/link'
import { MapPin } from 'lucide-react'

interface DestinationsPageProps {
  searchParams: { state?: string }
}

async function getDestinations(state?: string) {
  return prisma.destination.findMany({
    where: state ? { state } : undefined,
    include: {
      _count: { select: { tours: true, accommodations: true } },
    },
    orderBy: { name: 'asc' },
  })
}

async function getAllStates() {
  const destinations = await prisma.destination.findMany({
    select: { state: true },
    distinct: ['state'],
    orderBy: { state: 'asc' },
  })
  return destinations.map((d) => d.state)
}

export const metadata = {
  title: 'Destinations | Gangs of Safari',
  description:
    "Explore India's wildest, most beautiful destinations — all accessible by Tata Safari.",
}

export default async function DestinationsPage({ searchParams }: DestinationsPageProps) {
  const activeState = searchParams.state

  const [destinations, states] = await Promise.all([
    getDestinations(activeState),
    getAllStates(),
  ])

  const destinationsWithCount = destinations.map((d) => ({
    ...d,
    tourCount: d._count.tours,
  }))

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div
        className="relative bg-forest-900 text-white py-24 px-4 overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-forest-950/70" />
        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-forest-300 text-sm font-medium mb-3">
            <MapPin className="w-4 h-4" />
            Explore India
          </div>
          <h1 className="font-display font-black text-5xl sm:text-6xl mb-4">
            Explore India&apos;s Wild Heart
          </h1>
          <p className="text-forest-200 text-xl max-w-2xl">
            From the Himalayas to the coasts, from deserts to jungles — every destination is a new
            chapter in your Safari story.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* State Filter */}
        {states.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <Link
              href="/destinations"
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                !activeState
                  ? 'bg-forest-600 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              All States
            </Link>
            {states.map((state) => (
              <Link
                key={state}
                href={`/destinations?state=${encodeURIComponent(state)}`}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  activeState === state
                    ? 'bg-forest-600 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {state}
              </Link>
            ))}
          </div>
        )}

        <p className="text-stone-500 text-sm mb-8">
          Showing{' '}
          <span className="font-semibold text-stone-900">{destinationsWithCount.length}</span>{' '}
          {destinationsWithCount.length === 1 ? 'destination' : 'destinations'}
          {activeState ? ` in ${activeState}` : ''}
        </p>

        {destinationsWithCount.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinationsWithCount.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <MapPin className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <h2 className="font-display font-bold text-2xl text-stone-700 mb-2">
              No destinations found
            </h2>
            <p className="text-stone-400 mb-6">
              {activeState
                ? `No destinations in ${activeState} yet. Explore other states.`
                : 'Destinations are being added. Check back soon!'}
            </p>
            {activeState && (
              <Link
                href="/destinations"
                className="px-5 py-2.5 bg-forest-600 text-white rounded-lg font-semibold text-sm hover:bg-forest-700 transition-colors"
              >
                View All Destinations
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
