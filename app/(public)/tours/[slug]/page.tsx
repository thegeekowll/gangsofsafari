import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { formatPrice, formatDate, parseJSON } from '@/lib/utils'
import TourCard from '@/components/TourCard'
import {
  Clock,
  Users,
  TrendingUp,
  ChevronRight,
  CheckCircle,
  XCircle,
  CalendarDays,
  MapPin,
  Phone,
} from 'lucide-react'

interface Props {
  params: { slug: string }
}

async function getTour(slug: string) {
  return prisma.tour.findUnique({
    where: { slug },
    include: {
      destinations: { include: { destination: true } },
      itinerary: {
        orderBy: { day: 'asc' },
        include: { accommodation: true },
      },
    },
  })
}

async function getRelatedTours(tourId: string, destinationIds: string[]) {
  return prisma.tour.findMany({
    where: {
      published: true,
      id: { not: tourId },
      destinations: {
        some: { destinationId: { in: destinationIds } },
      },
    },
    include: { destinations: { include: { destination: true } } },
    take: 3,
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tour = await getTour(params.slug)
  if (!tour) return { title: 'Tour Not Found | Gangs of Safari' }
  return {
    title: `${tour.title} | Gangs of Safari`,
    description: tour.description.slice(0, 160),
    openGraph: {
      title: tour.title,
      description: tour.description.slice(0, 160),
      images: tour.coverImage ? [tour.coverImage] : [],
    },
  }
}

export default async function TourDetailPage({ params }: Props) {
  const tour = await getTour(params.slug)
  if (!tour) notFound()

  const highlights = parseJSON<string[]>(tour.highlights, [])
  const included = parseJSON<string[]>(tour.included, [])
  const excluded = parseJSON<string[]>(tour.excluded, [])

  const destinationIds = tour.destinations.map((d) => d.destinationId)
  const relatedTours = await getRelatedTours(tour.id, destinationIds)

  const difficultyColor: Record<string, string> = {
    Easy: 'bg-forest-100 text-forest-700',
    Moderate: 'bg-safari-100 text-safari-700',
    Challenging: 'bg-red-100 text-red-700',
  }

  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[400px] bg-stone-900 overflow-hidden">
        {tour.coverImage ? (
          <Image
            src={tour.coverImage}
            alt={tour.title}
            fill
            className="object-cover opacity-60"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-safari-800 to-forest-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-900/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-stone-300 text-sm mb-4">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/tours" className="hover:text-white transition-colors">Tours</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white font-medium">{tour.title}</span>
            </nav>
            <div className="flex flex-wrap items-start gap-3 mb-3">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  difficultyColor[tour.difficulty] || 'bg-stone-100 text-stone-700'
                }`}
              >
                {tour.difficulty}
              </span>
              {tour.destinations.map((d) => (
                <span
                  key={d.destinationId}
                  className="inline-flex items-center gap-1 text-xs font-medium bg-white/20 text-white px-3 py-1 rounded-full"
                >
                  <MapPin className="w-3 h-3" />
                  {d.destination.name}
                </span>
              ))}
            </div>
            <h1 className="font-display font-black text-4xl sm:text-5xl text-white max-w-3xl">
              {tour.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Overview */}
            <section>
              <h2 className="font-display font-bold text-2xl text-stone-900 mb-4">Overview</h2>
              <p className="text-stone-600 leading-relaxed text-lg">{tour.description}</p>
            </section>

            {/* Highlights */}
            {highlights.length > 0 && (
              <section>
                <h2 className="font-display font-bold text-2xl text-stone-900 mb-5">
                  Tour Highlights
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-forest-500 mt-0.5 shrink-0" />
                      <span className="text-stone-700 text-sm">{h}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Itinerary */}
            {tour.itinerary.length > 0 && (
              <section>
                <h2 className="font-display font-bold text-2xl text-stone-900 mb-6">
                  Day-by-Day Itinerary
                </h2>
                <div className="space-y-4">
                  {tour.itinerary.map((day) => {
                    const activities = parseJSON<string[]>(day.activities, [])
                    return (
                      <details
                        key={day.id}
                        className="group border border-stone-200 rounded-xl overflow-hidden"
                      >
                        <summary className="flex items-center justify-between p-5 cursor-pointer bg-stone-50 hover:bg-stone-100 transition-colors list-none">
                          <div className="flex items-center gap-4">
                            <span className="w-10 h-10 bg-safari-500 text-white rounded-lg flex items-center justify-center font-display font-bold text-sm shrink-0">
                              D{day.day}
                            </span>
                            <div>
                              <p className="text-xs text-safari-600 font-medium uppercase tracking-wide mb-0.5">
                                Day {day.day}
                              </p>
                              <h3 className="font-display font-bold text-stone-900">
                                {day.title}
                              </h3>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-stone-400 group-open:rotate-90 transition-transform shrink-0" />
                        </summary>
                        <div className="p-5 border-t border-stone-200 bg-white">
                          <p className="text-stone-600 text-sm leading-relaxed mb-4">
                            {day.description}
                          </p>
                          {activities.length > 0 && (
                            <div className="mb-4">
                              <p className="font-semibold text-stone-800 text-sm mb-2">
                                Activities:
                              </p>
                              <ul className="flex flex-wrap gap-2">
                                {activities.map((act, i) => (
                                  <li
                                    key={i}
                                    className="text-xs bg-safari-50 text-safari-700 px-3 py-1 rounded-full font-medium"
                                  >
                                    {act}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {day.accommodation && (
                            <div className="flex items-start gap-2 p-3 bg-forest-50 rounded-lg">
                              <span className="text-forest-600 font-semibold text-xs uppercase tracking-wide">
                                Stay:
                              </span>
                              <div>
                                <p className="text-stone-800 text-sm font-medium">
                                  {day.accommodation.name}
                                </p>
                                <p className="text-stone-500 text-xs">
                                  {day.accommodation.type}
                                  {day.accommodation.description
                                    ? ` · ${day.accommodation.description}`
                                    : ''}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </details>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Destinations */}
            {tour.destinations.length > 0 && (
              <section>
                <h2 className="font-display font-bold text-2xl text-stone-900 mb-5">
                  Destinations Covered
                </h2>
                <div className="flex flex-wrap gap-3">
                  {tour.destinations.map((d) => (
                    <Link
                      key={d.destinationId}
                      href={`/destinations/${d.destination.slug}`}
                      className="inline-flex items-center gap-2 px-4 py-2 border border-stone-200 hover:border-safari-400 hover:bg-safari-50 rounded-full text-sm font-medium text-stone-700 hover:text-safari-700 transition-all"
                    >
                      <MapPin className="w-4 h-4 text-safari-500" />
                      {d.destination.name}, {d.destination.state}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Included / Excluded */}
            {(included.length > 0 || excluded.length > 0) && (
              <section>
                <h2 className="font-display font-bold text-2xl text-stone-900 mb-6">
                  What&apos;s Included
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {included.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-forest-700 flex items-center gap-2 mb-3">
                        <CheckCircle className="w-5 h-5" /> Included
                      </h3>
                      <ul className="space-y-2">
                        {included.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-stone-600">
                            <CheckCircle className="w-4 h-4 text-forest-500 mt-0.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {excluded.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-red-600 flex items-center gap-2 mb-3">
                        <XCircle className="w-5 h-5" /> Not Included
                      </h3>
                      <ul className="space-y-2">
                        {excluded.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-stone-600">
                            <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Right: Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-white border border-stone-200 rounded-2xl shadow-lg overflow-hidden">
              {/* Price Header */}
              <div className="bg-gradient-to-br from-safari-500 to-safari-700 p-6 text-white">
                <p className="text-safari-100 text-sm mb-1">Starting from</p>
                <p className="font-display font-black text-4xl">{formatPrice(tour.price)}</p>
                <p className="text-safari-200 text-sm">per person</p>
              </div>

              {/* Key Info */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-stone-100">
                  <span className="flex items-center gap-2 text-stone-600 text-sm">
                    <Clock className="w-4 h-4 text-safari-500" /> Duration
                  </span>
                  <span className="font-semibold text-stone-900 text-sm">
                    {tour.duration} Days
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-stone-100">
                  <span className="flex items-center gap-2 text-stone-600 text-sm">
                    <Users className="w-4 h-4 text-safari-500" /> Group Size
                  </span>
                  <span className="font-semibold text-stone-900 text-sm">
                    Max {tour.maxGroupSize} people
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-stone-100">
                  <span className="flex items-center gap-2 text-stone-600 text-sm">
                    <TrendingUp className="w-4 h-4 text-safari-500" /> Difficulty
                  </span>
                  <span className="font-semibold text-stone-900 text-sm">{tour.difficulty}</span>
                </div>
                {tour.destinations.length > 0 && (
                  <div className="flex items-start justify-between py-3 border-b border-stone-100">
                    <span className="flex items-center gap-2 text-stone-600 text-sm">
                      <MapPin className="w-4 h-4 text-safari-500" /> Destinations
                    </span>
                    <span className="font-semibold text-stone-900 text-sm text-right max-w-[150px]">
                      {tour.destinations.map((d) => d.destination.name).join(', ')}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between py-3">
                  <span className="flex items-center gap-2 text-stone-600 text-sm">
                    <CalendarDays className="w-4 h-4 text-safari-500" /> Last Updated
                  </span>
                  <span className="font-semibold text-stone-900 text-sm">
                    {formatDate(tour.updatedAt)}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <div className="px-6 pb-6 space-y-3">
                <Link
                  href={`/contact?tour=${encodeURIComponent(tour.title)}`}
                  className="block w-full text-center px-6 py-3.5 bg-safari-500 hover:bg-safari-600 text-white font-bold rounded-xl transition-colors"
                >
                  Book This Tour
                </Link>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 border-2 border-forest-500 text-forest-600 hover:bg-forest-50 font-semibold rounded-xl transition-colors text-sm"
                >
                  <Phone className="w-4 h-4" />
                  Enquire on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Related Tours */}
        {relatedTours.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display font-bold text-3xl text-stone-900 mb-8">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedTours.map((t) => (
                <TourCard key={t.id} tour={t} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
