import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface Params {
  params: { id: string }
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const tour = await prisma.tour.findUnique({
      where: { id: params.id },
      include: {
        destinations: { include: { destination: true } },
        itinerary: {
          orderBy: { day: 'asc' },
          include: { accommodation: true },
        },
      },
    })

    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 })
    }

    return NextResponse.json(tour)
  } catch (error) {
    console.error(`GET /api/tours/${params.id} error:`, error)
    return NextResponse.json({ error: 'Failed to fetch tour' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
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

    const tour = await prisma.tour.update({
      where: { id: params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description }),
        ...(coverImage !== undefined && { coverImage }),
        ...(duration !== undefined && { duration: Number(duration) }),
        ...(price !== undefined && { price: Number(price) }),
        ...(difficulty !== undefined && { difficulty }),
        ...(maxGroupSize !== undefined && { maxGroupSize: Number(maxGroupSize) }),
        ...(highlights !== undefined && {
          highlights: typeof highlights === 'string' ? highlights : JSON.stringify(highlights),
        }),
        ...(included !== undefined && {
          included: typeof included === 'string' ? included : JSON.stringify(included),
        }),
        ...(excluded !== undefined && {
          excluded: typeof excluded === 'string' ? excluded : JSON.stringify(excluded),
        }),
        ...(featured !== undefined && { featured: Boolean(featured) }),
        ...(published !== undefined && { published: Boolean(published) }),
      },
    })

    return NextResponse.json(tour)
  } catch (error) {
    console.error(`PUT /api/tours/${params.id} error:`, error)
    return NextResponse.json({ error: 'Failed to update tour' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.tour.delete({ where: { id: params.id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`DELETE /api/tours/${params.id} error:`, error)
    return NextResponse.json({ error: 'Failed to delete tour' }, { status: 500 })
  }
}
