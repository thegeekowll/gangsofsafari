import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import BlogEditForm from './BlogEditForm'

interface Props { params: { id: string } }

export default async function BlogEditPage({ params }: Props) {
  const blog = await prisma.blog.findUnique({ where: { id: params.id } })
  if (!blog) notFound()
  return (
    <div>
      <h1 className="font-display font-black text-2xl text-stone-900 mb-8">Edit Post</h1>
      <BlogEditForm blog={blog} />
    </div>
  )
}
