import Link from 'next/link'
import Image from 'next/image'
import { MapPin, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DestinationCardProps {
  destination: {
    id: string
    name: string
    slug: string
    description: string
    image: string | null
    state: string
    tourCount?: number
  }
  className?: string
}

export default function DestinationCard({ destination, className }: DestinationCardProps) {
  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className={cn(
        'group block relative overflow-hidden rounded-2xl bg-stone-900 aspect-[4/3]',
        className
      )}
    >
      {destination.image ? (
        <Image
          src={destination.image}
          alt={destination.name}
          fill
          className="object-cover opacity-70 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-forest-800 to-safari-900 opacity-80" />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-5">
        <div className="flex items-center gap-1 text-safari-300 text-xs font-medium mb-1">
          <MapPin className="w-3 h-3" />
          {destination.state}
        </div>
        <h3 className="font-display font-bold text-white text-xl mb-1 group-hover:text-safari-300 transition-colors">
          {destination.name}
        </h3>
        <p className="text-stone-300 text-xs line-clamp-2 mb-3">{destination.description}</p>
        <div className="flex items-center justify-between">
          {destination.tourCount !== undefined && (
            <span className="text-xs text-stone-400">
              {destination.tourCount} {destination.tourCount === 1 ? 'tour' : 'tours'}
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-safari-400 text-xs font-semibold group-hover:gap-2 transition-all ml-auto">
            Explore <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
