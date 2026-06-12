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

    const blogs = await prisma.blog.findMany({
      where,
      orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
    })

    return NextResponse.json(blogs)
  } catch (error) {
    console.error('GET /api/blogs error:', error)
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { title, slug, excerpt, content, coverImage, author, tags, featured, published, publishedAt } = body

    if (!title || !slug || !excerpt || !content || !author) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage: coverImage || null,
        author,
        tags: typeof tags === 'string' ? tags : JSON.stringify(tags || []),
        featured: Boolean(featured),
        published: Boolean(published),
        publishedAt: published && publishedAt ? new Date(publishedAt) : published ? new Date() : null,
      },
    })

    return NextResponse.json(blog, { status: 201 })
  } catch (error) {
    console.error('POST /api/blogs error:', error)
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 })
  }
}
