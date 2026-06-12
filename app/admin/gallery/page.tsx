import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import { Camera } from 'lucide-react'

async function getImages() {
  return prisma.galleryImage.findMany({ orderBy: { createdAt: 'desc' } })
}

export default async function AdminGalleryPage() {
  const images = await getImages()

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-black text-2xl text-stone-900">Gallery</h1>
        <p className="text-stone-500 text-sm mt-1">{images.length} image{images.length !== 1 ? 's' : ''}</p>
      </div>

      {images.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-16 text-center">
          <Camera className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-400 text-lg">No gallery images yet. Run the seed script.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="bg-white rounded-xl border border-stone-200 overflow-hidden group">
              <div className="relative h-40">
                <Image
                  src={img.url}
                  alt={img.caption || 'Gallery image'}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
              <div className="p-3">
                {img.caption && <p className="text-xs text-stone-600 line-clamp-2 mb-1">{img.caption}</p>}
                {img.tourTag && <p className="text-xs text-safari-600 font-medium">{img.tourTag}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
