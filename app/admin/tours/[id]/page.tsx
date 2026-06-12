import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import TourEditForm from './TourEditForm'

interface Props {
  params: { id: string }
}

async function getTour(id: string) {
  return prisma.tour.findUnique({
    where: { id },
    include: {
      destinations: { include: { destination: true } },
      itinerary: { orderBy: { day: 'asc' } },
    },
  })
}

async function getDestinations() {
  return prisma.destination.findMany({ orderBy: { name: 'asc' } })
}

export default async function TourEditPage({ params }: Props) {
  const [tour, destinations] = await Promise.all([getTour(params.id), getDestinations()])
  if (!tour) notFound()

  return (
    <div>
      <h1 className="font-display font-black text-2xl text-stone-900 mb-8">Edit Tour</h1>
      <TourEditForm tour={tour} destinations={destinations} />
    </div>
  )
}
