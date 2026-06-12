import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const publishedParam = searchParams.get('published')
    const featured = searchParams.get('featured')

    const where: Record<string, unknown> = {}
    if (publishedParam === 'true') where.published = true
    if (publishedParam === 'false') where.published = false
    if (featured === 'true') where.featured = true

    const tours = await prisma.tour.findMany({
      where,
      include: {
        destinations: { include: { destination: true } },
        itinerary: { orderBy: { day: 'asc' } },
      },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    })

    return NextResponse.json(tours)
  } catch (error) {
    console.error('GET /api/tours error:', error)
    return NextResponse.json({ error: 'Failed to fetch tours' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const {
      title, slug, description, coverImage, duration, price,
      difficulty, maxGroupSize, highlights, included, excluded, featured, published,
    } = body

    if (!title || !slug || !description || !duration || !price || !difficulty || !maxGroupSize) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const tour = await prisma.tour.create({
      data: {
        title,
        slug,
        description,
        coverImage: coverImage || null,
        duration: Number(duration),
        price: Number(price),
        difficulty,
        maxGroupSize: Number(maxGroupSize),
        highlights: typeof highlights === 'string' ? highlights : JSON.stringify(highlights || []),
        included: typeof included === 'string' ? included : JSON.stringify(included || []),
        excluded: typeof excluded === 'string' ? excluded : JSON.stringify(excluded || []),
        featured: Boolean(featured),
        published: Boolean(published),
      },
    })

    return NextResponse.json(tour, { status: 201 })
  } catch (error) {
    console.error('POST /api/tours error:', error)
    return NextResponse.json({ error: 'Failed to create tour' }, { status: 500 })
  }
}
