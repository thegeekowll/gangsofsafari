import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { prisma } from '@/lib/prisma'
import { formatDate, parseJSON } from '@/lib/utils'
import BlogCard from '@/components/BlogCard'
import { CalendarDays, User, Tag, ArrowLeft } from 'lucide-react'
import ShareButtons from '@/components/ShareButtons'

interface Props {
  params: { slug: string }
}

async function getBlog(slug: string) {
  return prisma.blog.findUnique({ where: { slug, published: true } })
}

async function getRelatedBlogs(blogId: string, tags: string[]) {
  if (tags.length === 0) return []
  const allBlogs = await prisma.blog.findMany({
    where: { published: true, id: { not: blogId } },
  })
  return allBlogs
    .filter((b) => {
      const bTags = parseJSON<string[]>(b.tags, [])
      return bTags.some((t) => tags.includes(t))
    })
    .slice(0, 3)
}

function extractHeadings(markdown: string) {
  const lines = markdown.split('\n')
  const headings: { level: number; text: string; id: string }[] = []
  lines.forEach((line) => {
    const match = line.match(/^(#{1,3})\s+(.+)/)
    if (match) {
      const text = match[2].trim()
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      headings.push({ level: match[1].length, text, id })
    }
  })
  return headings
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const blog = await getBlog(params.slug)
  if (!blog) return { title: 'Post Not Found | Gangs of Safari' }
  const tags = parseJSON<string[]>(blog.tags, [])
  return {
    title: `${blog.title} | Gangs of Safari Blog`,
    description: blog.excerpt,
    keywords: tags.join(', '),
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      type: 'article',
      images: blog.coverImage ? [blog.coverImage] : [],
      authors: [blog.author],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const blog = await getBlog(params.slug)
  if (!blog) notFound()

  const tags = parseJSON<string[]>(blog.tags, [])
  const relatedBlogs = await getRelatedBlogs(blog.id, tags)
  const headings = extractHeadings(blog.content)

  const shareUrl = `https://gangsofsafari.com/blog/${blog.slug}`

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[320px] bg-stone-900 overflow-hidden">
        {blog.coverImage ? (
          <Image
            src={blog.coverImage}
            alt={blog.title}
            fill
            className="object-cover opacity-60"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-safari-800 to-stone-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-900/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <nav className="flex items-center gap-2 text-stone-300 text-sm mb-4">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
              <span>/</span>
              <span className="text-white font-medium line-clamp-1">{blog.title}</span>
            </nav>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="inline-flex items-center gap-1 text-xs font-medium bg-safari-500/80 text-white px-2.5 py-1 rounded-full hover:bg-safari-500 transition-colors"
                  >
                    <Tag className="w-2.5 h-2.5" /> {tag}
                  </Link>
                ))}
              </div>
            )}
            <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white max-w-3xl">
              {blog.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar: ToC */}
          {headings.length > 0 && (
            <aside className="lg:col-span-1 order-2 lg:order-1">
              <div className="sticky top-24 bg-stone-50 rounded-xl p-5 border border-stone-200">
                <p className="font-display font-bold text-stone-900 text-sm uppercase tracking-wide mb-4">
                  Table of Contents
                </p>
                <nav className="space-y-2">
                  {headings.map((h) => (
                    <a
                      key={h.id}
                      href={`#${h.id}`}
                      className={`block text-sm transition-colors hover:text-safari-600 text-stone-600 ${
                        h.level === 1 ? '' : h.level === 2 ? 'pl-3' : 'pl-6'
                      }`}
                    >
                      {h.text}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}

          {/* Main Article */}
          <article
            className={`order-1 lg:order-2 ${headings.length > 0 ? 'lg:col-span-3' : 'lg:col-span-4 max-w-4xl'}`}
          >
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-stone-500 mb-8 pb-8 border-b border-stone-200">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-safari-500" />
                <span className="font-medium text-stone-700">{blog.author}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-safari-500" />
                {formatDate(blog.publishedAt || blog.createdAt)}
              </span>
            </div>

            {/* Excerpt */}
            <p className="text-xl text-stone-600 leading-relaxed mb-8 italic border-l-4 border-safari-400 pl-5">
              {blog.excerpt}
            </p>

            {/* Markdown Content */}
            <div className="prose prose-stone prose-lg max-w-none prose-headings:font-display prose-a:text-safari-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-code:text-safari-700 prose-code:bg-safari-50 prose-code:px-1.5 prose-code:rounded">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{blog.content}</ReactMarkdown>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="mt-10 pt-8 border-t border-stone-200">
                <p className="text-sm font-semibold text-stone-700 mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-safari-500" /> Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-safari-50 text-stone-600 hover:text-safari-700 rounded-full text-sm font-medium transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Share */}
            <ShareButtons url={shareUrl} title={blog.title} />

            <div className="mt-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>
            </div>
          </article>
        </div>

        {/* Related Posts */}
        {relatedBlogs.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display font-bold text-3xl text-stone-900 mb-8">
              Related Posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
