import { prisma } from '@/lib/prisma'
import BlogCard from '@/components/BlogCard'
import { parseJSON } from '@/lib/utils'
import Link from 'next/link'
import { BookOpen, Tag } from 'lucide-react'

interface BlogPageProps {
  searchParams: { tag?: string }
}

export const metadata = {
  title: 'Blog | Gangs of Safari',
  description:
    'Stories, tips, and tales from the road — by and for the Tata Safari community.',
}

async function getBlogs(tag?: string) {
  const blogs = await prisma.blog.findMany({
    where: { published: true },
    orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }],
  })

  if (tag) {
    return blogs.filter((b) => {
      const tags = parseJSON<string[]>(b.tags, [])
      return tags.some((t) => t.toLowerCase() === tag.toLowerCase())
    })
  }

  return blogs
}

async function getAllTags() {
  const blogs = await prisma.blog.findMany({
    where: { published: true },
    select: { tags: true },
  })
  const allTags = new Set<string>()
  blogs.forEach((b) => {
    const tags = parseJSON<string[]>(b.tags, [])
    tags.forEach((t) => allTags.add(t))
  })
  return Array.from(allTags).sort()
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const activeTag = searchParams.tag
  const [blogs, allTags] = await Promise.all([getBlogs(activeTag), getAllTags()])

  const featuredPost = !activeTag ? blogs.find((b) => b.featured) : undefined
  const restPosts = featuredPost ? blogs.filter((b) => b.id !== featuredPost.id) : blogs

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-stone-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-safari-400 font-semibold text-sm uppercase tracking-wider mb-2">
            Stories from Safarians
          </p>
          <h1 className="font-display font-black text-5xl mb-4">The Road Diaries</h1>
          <p className="text-stone-400 text-lg max-w-2xl">
            Trip reports, route guides, Safari maintenance tips, and tales from India&apos;s most
            adventurous roads.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tag Filter */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            <Link
              href="/blog"
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                !activeTag
                  ? 'bg-safari-500 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> All Posts
            </Link>
            {allTags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  activeTag === tag
                    ? 'bg-safari-500 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <Tag className="w-3 h-3" /> {tag}
              </Link>
            ))}
          </div>
        )}

        {blogs.length === 0 ? (
          <div className="text-center py-24">
            <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <h2 className="font-display font-bold text-2xl text-stone-700 mb-2">
              No posts found
            </h2>
            <p className="text-stone-400">
              {activeTag
                ? `No posts tagged "${activeTag}". Try another tag.`
                : 'Blog posts coming soon. Stay tuned!'}
            </p>
            {activeTag && (
              <Link
                href="/blog"
                className="inline-block mt-4 px-5 py-2.5 bg-safari-500 text-white rounded-lg font-semibold text-sm hover:bg-safari-600 transition-colors"
              >
                View All Posts
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <div className="mb-12">
                <BlogCard blog={featuredPost} variant="featured" />
              </div>
            )}

            {/* Grid */}
            {restPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {restPosts.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
