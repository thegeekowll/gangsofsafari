import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const destinationId = searchParams.get('destinationId')

    const accommodations = await prisma.accommodation.findMany({
      where: destinationId ? { destinationId } : undefined,
      include: {
        destination: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(accommodations)
  } catch (error) {
    console.error('GET /api/accommodations error:', error)
    return NextResponse.json({ error: 'Failed to fetch accommodations' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, type, description, image, destinationId } = body

    if (!name || !type || !description || !destinationId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const accommodation = await prisma.accommodation.create({
      data: {
        name,
        type,
        description,
        image: image || null,
        destinationId,
      },
    })

    return NextResponse.json(accommodation, { status: 201 })
  } catch (error) {
    console.error('POST /api/accommodations error:', error)
    return NextResponse.json({ error: 'Failed to create accommodation' }, { status: 500 })
  }
}
