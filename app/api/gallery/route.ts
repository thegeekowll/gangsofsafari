import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const tourTag = searchParams.get('tourTag')

    const images = await prisma.galleryImage.findMany({
      where: tourTag ? { tourTag } : undefined,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(images)
  } catch (error) {
    console.error('GET /api/gallery error:', error)
    return NextResponse.json({ error: 'Failed to fetch gallery images' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { url, caption, tourTag } = body

    if (!url) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 })
    }

    const image = await prisma.galleryImage.create({
      data: {
        url,
        caption: caption || null,
        tourTag: tourTag || null,
      },
    })

    return NextResponse.json(image, { status: 201 })
  } catch (error) {
    console.error('POST /api/gallery error:', error)
    return NextResponse.json({ error: 'Failed to add gallery image' }, { status: 500 })
  }
}
