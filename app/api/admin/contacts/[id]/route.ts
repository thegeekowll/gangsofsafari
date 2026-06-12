import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface Params { params: { id: string } }

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const contact = await prisma.contact.update({ where: { id: params.id }, data: body })
    return NextResponse.json(contact)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 })
  }
}
