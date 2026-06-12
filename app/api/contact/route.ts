import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, tourOfInterest, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 })
    }

    const fullMessage = tourOfInterest
      ? `Tour of Interest: ${tourOfInterest}\n\n${message}`
      : message

    const contact = await prisma.contact.create({
      data: { name, email, phone: phone || null, message: fullMessage },
    })

    return NextResponse.json({ success: true, id: contact.id }, { status: 201 })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Failed to submit contact form' }, { status: 500 })
  }
}
