import { prisma } from '@/lib/prisma'
import TourCard from '@/components/TourCard'
import { Search } from 'lucide-react'
import Link from 'next/link'

interface ToursPageProps {
  searchParams: { difficulty?: string; type?: string }
}

const difficulties = ['All', 'Easy', 'Moderate', 'Challenging']

async function getTours(difficulty?: string) {
  return prisma.tour.findMany({
    where: {
      published: true,
      ...(difficulty && difficulty !== 'All' ? { difficulty } : {}),
    },
    include: {
      destinations: { include: { destination: true } },
    },
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
  })
}

export const metadata = {
  title: 'Tours | Gangs of Safari',
  description:
    'Explore our curated collection of Tata Safari road trips, wildlife safaris, and mountain expeditions across India.',
}

export default async function ToursPage({ searchParams }: ToursPageProps) {
  const activeDifficulty = searchParams.difficulty || 'All'
  const tours = await getTours(activeDifficulty)

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-stone-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-safari-400 font-semibold text-sm uppercase tracking-wider mb-2">
            Pack Your Bags
          </p>
          <h1 className="font-display font-black text-5xl mb-4">Explore Our Tours</h1>
          <p className="text-stone-400 text-lg max-w-2xl">
            From misty mountain passes to scorching desert crossings — every tour is crafted for
            Tata Safari owners who demand more from their drives.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex gap-2 flex-wrap">
            {difficulties.map((d) => (
              <Link
                key={d}
                href={d === 'All' ? '/tours' : `/tours?difficulty=${d}`}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  activeDifficulty === d
                    ? 'bg-safari-500 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {d}
              </Link>
            ))}
          </div>
          <p className="text-stone-500 text-sm">
            <span className="font-semibold text-stone-900">{tours.length}</span>{' '}
            {tours.length === 1 ? 'tour' : 'tours'} found
          </p>
        </div>

        {/* Grid */}
        {tours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 flex flex-col items-center gap-4">
            <Search className="w-12 h-12 text-stone-300" />
            <h2 className="font-display font-bold text-2xl text-stone-700">No tours found</h2>
            <p className="text-stone-400 max-w-sm">
              {activeDifficulty !== 'All'
                ? `No ${activeDifficulty} tours available right now. Try a different difficulty.`
                : 'No tours are published yet. Check back soon!'}
            </p>
            {activeDifficulty !== 'All' && (
              <Link
                href="/tours"
                className="mt-2 px-5 py-2.5 bg-safari-500 text-white rounded-lg font-semibold text-sm hover:bg-safari-600 transition-colors"
              >
                View All Tours
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
