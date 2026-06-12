'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Camera, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

interface GalleryImage {
  id: string
  url: string
  caption: string | null
  tourTag: string | null
}

interface GalleryClientProps {
  images: GalleryImage[]
  tags: string[]
}

export default function GalleryClient({ images, tags }: GalleryClientProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const filteredImages = activeTag
    ? images.filter((img) => img.tourTag === activeTag)
    : images

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)

  const prev = () => {
    if (lightboxIndex === null) return
    setLightboxIndex((lightboxIndex - 1 + filteredImages.length) % filteredImages.length)
  }

  const next = () => {
    if (lightboxIndex === null) return
    setLightboxIndex((lightboxIndex + 1) % filteredImages.length)
  }

  const currentImage = lightboxIndex !== null ? filteredImages[lightboxIndex] : null

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-stone-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-safari-400 text-sm font-medium mb-3">
            <Camera className="w-4 h-4" />
            Memories from the road
          </div>
          <h1 className="font-display font-black text-5xl mb-4">Gallery</h1>
          <p className="text-stone-400 text-lg max-w-2xl">
            Snapshots of adventure — tigers, trails, convoy moments, and landscapes that made us
            pull over in awe.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tag Filter */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveTag(null)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                !activeTag
                  ? 'bg-safari-500 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              All Photos
            </button>
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  activeTag === tag
                    ? 'bg-safari-500 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        <p className="text-stone-500 text-sm mb-8">
          Showing{' '}
          <span className="font-semibold text-stone-900">{filteredImages.length}</span> photos
          {activeTag && ` in "${activeTag}"`}
        </p>

        {/* Masonry Grid */}
        {filteredImages.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {filteredImages.map((img, index) => (
              <div
                key={img.id}
                className="break-inside-avoid group relative overflow-hidden rounded-xl bg-stone-100 cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                <div className="relative w-full">
                  <Image
                    src={img.url}
                    alt={img.caption || 'Gallery image'}
                    width={800}
                    height={600}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-stone-950/0 group-hover:bg-stone-950/50 transition-all duration-300 flex items-center justify-center">
                  <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                {(img.caption || img.tourTag) && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/80 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    {img.caption && (
                      <p className="text-white text-sm font-medium leading-tight">{img.caption}</p>
                    )}
                    {img.tourTag && (
                      <span className="text-safari-300 text-xs mt-1 block">{img.tourTag}</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <Camera className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h2 className="font-display font-bold text-2xl text-stone-700 mb-2">
              No photos found
            </h2>
            <p className="text-stone-400">
              {activeTag ? `No photos tagged "${activeTag}".` : 'Gallery coming soon!'}
            </p>
            {activeTag && (
              <button
                onClick={() => setActiveTag(null)}
                className="mt-4 px-5 py-2.5 bg-safari-500 text-white rounded-lg font-semibold text-sm hover:bg-safari-600 transition-colors"
              >
                View All Photos
              </button>
            )}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {currentImage && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-4 text-white text-sm font-medium bg-black/40 px-3 py-1.5 rounded-full">
            {lightboxIndex + 1} / {filteredImages.length}
          </div>

          {/* Prev/Next */}
          {filteredImages.length > 1 && (
            <>
              <button
                className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                onClick={(e) => { e.stopPropagation(); prev() }}
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                onClick={(e) => { e.stopPropagation(); next() }}
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Image */}
          <div
            className="relative max-w-5xl max-h-[80vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={currentImage.url}
              alt={currentImage.caption || 'Gallery image'}
              width={1200}
              height={800}
              className="max-h-[80vh] w-auto object-contain rounded-xl"
              sizes="90vw"
            />
            {(currentImage.caption || currentImage.tourTag) && (
              <div className="mt-4 text-center">
                {currentImage.caption && (
                  <p className="text-white font-medium">{currentImage.caption}</p>
                )}
                {currentImage.tourTag && (
                  <span className="text-safari-400 text-sm">{currentImage.tourTag}</span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
