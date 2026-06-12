import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const state = searchParams.get('state')

    const destinations = await prisma.destination.findMany({
      where: state ? { state } : undefined,
      include: {
        _count: { select: { tours: true, accommodations: true } },
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(destinations)
  } catch (error) {
    console.error('GET /api/destinations error:', error)
    return NextResponse.json({ error: 'Failed to fetch destinations' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, slug, description, image, state, highlights } = body

    if (!name || !slug || !description || !state) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const destination = await prisma.destination.create({
      data: {
        name,
        slug,
        description,
        image: image || null,
        state,
        highlights: typeof highlights === 'string' ? highlights : JSON.stringify(highlights || []),
      },
    })

    return NextResponse.json(destination, { status: 201 })
  } catch (error) {
    console.error('POST /api/destinations error:', error)
    return NextResponse.json({ error: 'Failed to create destination' }, { status: 500 })
  }
}
