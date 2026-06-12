import Link from 'next/link'
import Image from 'next/image'
import { Clock, Users, TrendingUp, ArrowRight } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface TourCardProps {
  tour: {
    id: string
    title: string
    slug: string
    description: string
    coverImage: string | null
    duration: number
    price: number
    difficulty: string
    maxGroupSize: number
    featured?: boolean
    destinations?: { destination: { name: string } }[]
  }
  className?: string
}

const difficultyColor: Record<string, string> = {
  Easy: 'bg-forest-100 text-forest-700',
  Moderate: 'bg-safari-100 text-safari-700',
  Challenging: 'bg-red-100 text-red-700',
}

export default function TourCard({ tour, className }: TourCardProps) {
  return (
    <Link
      href={`/tours/${tour.slug}`}
      className={cn(
        'group block bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-safari-300 shadow-sm hover:shadow-xl transition-all duration-300',
        className
      )}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-stone-200">
        {tour.coverImage ? (
          <Image
            src={tour.coverImage}
            alt={tour.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-safari-200 to-forest-200 flex items-center justify-center">
            <span className="text-4xl">🌿</span>
          </div>
        )}
        {tour.featured && (
          <div className="absolute top-3 left-3 bg-safari-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            Featured
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span
            className={cn(
              'text-xs font-semibold px-2.5 py-1 rounded-full',
              difficultyColor[tour.difficulty] || 'bg-stone-100 text-stone-700'
            )}
          >
            {tour.difficulty}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {tour.destinations && tour.destinations.length > 0 && (
          <p className="text-xs text-safari-600 font-medium mb-1 uppercase tracking-wide">
            {tour.destinations.map((d) => d.destination.name).join(' · ')}
          </p>
        )}
        <h3 className="font-display font-bold text-stone-900 text-lg mb-2 line-clamp-2 group-hover:text-safari-700 transition-colors">
          {tour.title}
        </h3>
        <p className="text-sm text-stone-500 line-clamp-2 mb-4">{tour.description}</p>

        <div className="flex items-center gap-4 text-xs text-stone-500 mb-4">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {tour.duration} days
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            Max {tour.maxGroupSize}
          </span>
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            {tour.difficulty}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-400">From</span>
            <p className="text-safari-600 font-bold text-xl font-display">
              {formatPrice(tour.price)}
            </p>
            <span className="text-xs text-stone-400">per person</span>
          </div>
          <span className="inline-flex items-center gap-1 text-safari-600 font-semibold text-sm group-hover:gap-2 transition-all">
            View Details <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}
