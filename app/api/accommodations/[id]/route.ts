import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface Params {
  params: { id: string }
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const accommodation = await prisma.accommodation.findUnique({
      where: { id: params.id },
      include: {
        destination: { select: { id: true, name: true, slug: true } },
      },
    })

    if (!accommodation) {
      return NextResponse.json({ error: 'Accommodation not found' }, { status: 404 })
    }

    return NextResponse.json(accommodation)
  } catch (error) {
    console.error(`GET /api/accommodations/${params.id} error:`, error)
    return NextResponse.json({ error: 'Failed to fetch accommodation' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, type, description, image, destinationId } = body

    const accommodation = await prisma.accommodation.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(type !== undefined && { type }),
        ...(description !== undefined && { description }),
        ...(image !== undefined && { image }),
        ...(destinationId !== undefined && { destinationId }),
      },
    })

    return NextResponse.json(accommodation)
  } catch (error) {
    console.error(`PUT /api/accommodations/${params.id} error:`, error)
    return NextResponse.json({ error: 'Failed to update accommodation' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.accommodation.delete({ where: { id: params.id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`DELETE /api/accommodations/${params.id} error:`, error)
    return NextResponse.json({ error: 'Failed to delete accommodation' }, { status: 500 })
  }
}
