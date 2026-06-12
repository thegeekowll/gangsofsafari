import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { parseJSON } from '@/lib/utils'
import TourCard from '@/components/TourCard'
import { MapPin, ArrowLeft, CheckCircle, Hotel, TreePine } from 'lucide-react'

interface Props {
  params: { slug: string }
}

async function getDestination(slug: string) {
  return prisma.destination.findUnique({
    where: { slug },
    include: {
      tours: {
        include: {
          tour: {
            include: { destinations: { include: { destination: true } } },
          },
        },
        where: { tour: { published: true } },
      },
      accommodations: true,
      _count: { select: { tours: true } },
    },
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const dest = await getDestination(params.slug)
  if (!dest) return { title: 'Destination Not Found | Gangs of Safari' }
  return {
    title: `${dest.name}, ${dest.state} | Gangs of Safari`,
    description: dest.description.slice(0, 160),
    openGraph: {
      title: `${dest.name} | Gangs of Safari`,
      description: dest.description.slice(0, 160),
      images: dest.image ? [dest.image] : [],
    },
  }
}

const accommodationTypeIcon: Record<string, string> = {
  Hotel: '🏨',
  Resort: '🏖️',
  Camp: '⛺',
  Homestay: '🏡',
  Lodge: '🏕️',
}

export default async function DestinationDetailPage({ params }: Props) {
  const destination = await getDestination(params.slug)
  if (!destination) notFound()

  const highlights = parseJSON<string[]>(destination.highlights, [])
  const tours = destination.tours.map((td) => td.tour)

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="relative h-[55vh] min-h-[350px] bg-stone-900 overflow-hidden">
        {destination.image ? (
          <Image
            src={destination.image}
            alt={destination.name}
            fill
            className="object-cover opacity-60"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-forest-800 to-safari-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-900/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <nav className="flex items-center gap-2 text-stone-300 text-sm mb-4">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link href="/destinations" className="hover:text-white transition-colors">
                Destinations
              </Link>
              <span>/</span>
              <span className="text-white font-medium">{destination.name}</span>
            </nav>
            <div className="flex items-center gap-2 text-safari-300 text-sm font-medium mb-2">
              <MapPin className="w-4 h-4" />
              {destination.state}
            </div>
            <h1 className="font-display font-black text-4xl sm:text-5xl text-white">
              {destination.name}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/destinations"
          className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 text-sm mb-10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Destinations
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <section>
              <h2 className="font-display font-bold text-2xl text-stone-900 mb-4">About {destination.name}</h2>
              <p className="text-stone-600 leading-relaxed text-lg">{destination.description}</p>
            </section>

            {/* Highlights */}
            {highlights.length > 0 && (
              <section>
                <h2 className="font-display font-bold text-2xl text-stone-900 mb-5">
                  Highlights
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

            {/* Tours */}
            {tours.length > 0 && (
              <section>
                <h2 className="font-display font-bold text-2xl text-stone-900 mb-6">
                  Tours to {destination.name}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {tours.map((tour) => (
                    <TourCard key={tour.id} tour={tour} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar: Accommodations */}
          <div className="lg:col-span-1">
            {destination.accommodations.length > 0 && (
              <div className="sticky top-24">
                <h2 className="font-display font-bold text-xl text-stone-900 mb-5 flex items-center gap-2">
                  <Hotel className="w-5 h-5 text-forest-600" />
                  Where to Stay
                </h2>
                <div className="space-y-4">
                  {destination.accommodations.map((acc) => (
                    <div
                      key={acc.id}
                      className="border border-stone-200 rounded-xl p-4 hover:border-forest-300 hover:shadow-sm transition-all"
                    >
                      {acc.image && (
                        <div className="relative h-32 rounded-lg overflow-hidden mb-3">
                          <Image
                            src={acc.image}
                            alt={acc.name}
                            fill
                            className="object-cover"
                            sizes="300px"
                          />
                        </div>
                      )}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-stone-900">{acc.name}</h3>
                        <span className="text-lg shrink-0">
                          {accommodationTypeIcon[acc.type] || '🏠'}
                        </span>
                      </div>
                      <span className="inline-block text-xs font-medium text-forest-700 bg-forest-50 px-2 py-0.5 rounded-full mb-2">
                        {acc.type}
                      </span>
                      <p className="text-stone-500 text-sm">{acc.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tours.length === 0 && destination.accommodations.length === 0 && (
              <div className="bg-stone-50 rounded-xl p-6 text-center">
                <TreePine className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                <p className="text-stone-500 text-sm">
                  Tours and stays for this destination are being curated. Check back soon!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
