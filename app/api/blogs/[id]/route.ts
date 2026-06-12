import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface Params {
  params: { id: string }
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const blog = await prisma.blog.findUnique({
      where: { id: params.id },
    })

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    return NextResponse.json(blog)
  } catch (error) {
    console.error(`GET /api/blogs/${params.id} error:`, error)
    return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { title, slug, excerpt, content, coverImage, author, tags, featured, published, publishedAt } = body

    const existingBlog = await prisma.blog.findUnique({ where: { id: params.id } })
    if (!existingBlog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    const blog = await prisma.blog.update({
      where: { id: params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(excerpt !== undefined && { excerpt }),
        ...(content !== undefined && { content }),
        ...(coverImage !== undefined && { coverImage }),
        ...(author !== undefined && { author }),
        ...(tags !== undefined && {
          tags: typeof tags === 'string' ? tags : JSON.stringify(tags),
        }),
        ...(featured !== undefined && { featured: Boolean(featured) }),
        ...(published !== undefined && { published: Boolean(published) }),
        ...(publishedAt !== undefined && {
          publishedAt: publishedAt ? new Date(publishedAt) : null,
        }),
      },
    })

    return NextResponse.json(blog)
  } catch (error) {
    console.error(`PUT /api/blogs/${params.id} error:`, error)
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.blog.delete({ where: { id: params.id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`DELETE /api/blogs/${params.id} error:`, error)
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 })
  }
}
