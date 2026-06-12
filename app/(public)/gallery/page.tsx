import { prisma } from '@/lib/prisma'
import GalleryClient from './GalleryClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gallery | Gangs of Safari',
  description:
    'Photos from the road — stunning landscapes, Tata Safaris, and wild encounters captured by our community.',
}

const placeholderImages = [
  { id: 'ph1', url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80', caption: 'Morning mist in the jungle', tourTag: 'Wildlife', createdAt: new Date() },
  { id: 'ph2', url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80', caption: 'Mountain convoy', tourTag: 'Himalayas', createdAt: new Date() },
  { id: 'ph3', url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80', caption: 'Desert sunset', tourTag: 'Desert', createdAt: new Date() },
  { id: 'ph4', url: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&q=80', caption: 'Forest trail drive', tourTag: 'Wildlife', createdAt: new Date() },
  { id: 'ph5', url: 'https://images.unsplash.com/photo-1530538987395-032d1800fdd4?w=800&q=80', caption: 'Himalayan pass crossing', tourTag: 'Himalayas', createdAt: new Date() },
  { id: 'ph6', url: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800&q=80', caption: 'Convoy at dawn', tourTag: 'Road Trips', createdAt: new Date() },
  { id: 'ph7', url: 'https://images.unsplash.com/photo-1564364420007-d8947e4dafbf?w=800&q=80', caption: 'Riverbank camp', tourTag: 'Wildlife', createdAt: new Date() },
  { id: 'ph8', url: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=800&q=80', caption: 'Coastal drive', tourTag: 'Road Trips', createdAt: new Date() },
  { id: 'ph9', url: 'https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=800&q=80', caption: 'Snow capped peaks', tourTag: 'Himalayas', createdAt: new Date() },
]

async function getGalleryImages() {
  return prisma.galleryImage.findMany({ orderBy: { createdAt: 'desc' } })
}

export default async function GalleryPage() {
  const dbImages = await getGalleryImages()
  const images = dbImages.length > 0 ? dbImages : placeholderImages

  const tagSet = new Set<string>()
  images.forEach((img) => { if (img.tourTag) tagSet.add(img.tourTag) })
  const tags = Array.from(tagSet).sort()

  return <GalleryClient images={images} tags={tags} />
}
