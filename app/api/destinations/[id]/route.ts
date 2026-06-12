import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface Params {
  params: { id: string }
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const destination = await prisma.destination.findUnique({
      where: { id: params.id },
      include: {
        tours: {
          include: {
            tour: { include: { destinations: { include: { destination: true } } } },
          },
        },
        accommodations: true,
        _count: { select: { tours: true, accommodations: true } },
      },
    })

    if (!destination) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 })
    }

    return NextResponse.json(destination)
  } catch (error) {
    console.error(`GET /api/destinations/${params.id} error:`, error)
    return NextResponse.json({ error: 'Failed to fetch destination' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, slug, description, image, state, highlights } = body

    const destination = await prisma.destination.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description }),
        ...(image !== undefined && { image }),
        ...(state !== undefined && { state }),
        ...(highlights !== undefined && {
          highlights: typeof highlights === 'string' ? highlights : JSON.stringify(highlights),
        }),
      },
    })

    return NextResponse.json(destination)
  } catch (error) {
    console.error(`PUT /api/destinations/${params.id} error:`, error)
    return NextResponse.json({ error: 'Failed to update destination' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.destination.delete({ where: { id: params.id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`DELETE /api/destinations/${params.id} error:`, error)
    return NextResponse.json({ error: 'Failed to delete destination' }, { status: 500 })
  }
}
