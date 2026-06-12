import Link from 'next/link'
import Image from 'next/image'
import { CalendarDays, User, ArrowRight, Tag } from 'lucide-react'
import { formatDate, parseJSON } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface BlogCardProps {
  blog: {
    id: string
    title: string
    slug: string
    excerpt: string
    coverImage: string | null
    author: string
    tags: string
    publishedAt: Date | string | null
    featured?: boolean
  }
  variant?: 'default' | 'featured'
  className?: string
}

export default function BlogCard({ blog, variant = 'default', className }: BlogCardProps) {
  const tags = parseJSON<string[]>(blog.tags, [])

  if (variant === 'featured') {
    return (
      <Link
        href={`/blog/${blog.slug}`}
        className={cn(
          'group block bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-safari-300 shadow-sm hover:shadow-xl transition-all duration-300',
          'md:flex',
          className
        )}
      >
        <div className="relative md:w-1/2 h-64 md:h-auto overflow-hidden bg-stone-200">
          {blog.coverImage ? (
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-safari-200 to-forest-200" />
          )}
          {blog.featured && (
            <div className="absolute top-3 left-3 bg-safari-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              Featured
            </div>
          )}
        </div>
        <div className="p-6 md:p-8 flex flex-col justify-center md:w-1/2">
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs font-medium text-safari-600 bg-safari-50 px-2 py-0.5 rounded-full"
                >
                  <Tag className="w-2.5 h-2.5" />
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h2 className="font-display font-bold text-stone-900 text-2xl mb-3 line-clamp-3 group-hover:text-safari-700 transition-colors">
            {blog.title}
          </h2>
          <p className="text-stone-500 text-sm line-clamp-3 mb-5">{blog.excerpt}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-stone-400">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {blog.author}
              </span>
              <span className="flex items-center gap-1">
                <CalendarDays className="w-3.5 h-3.5" />
                {formatDate(blog.publishedAt)}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 text-safari-600 font-semibold text-sm group-hover:gap-2 transition-all">
              Read <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/blog/${blog.slug}`}
      className={cn(
        'group block bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-safari-300 shadow-sm hover:shadow-xl transition-all duration-300',
        className
      )}
    >
      <div className="relative h-48 overflow-hidden bg-stone-200">
        {blog.coverImage ? (
          <Image
            src={blog.coverImage}
            alt={blog.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-safari-200 to-forest-200" />
        )}
      </div>
      <div className="p-5">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium text-safari-600 bg-safari-50 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <h3 className="font-display font-bold text-stone-900 text-lg mb-2 line-clamp-2 group-hover:text-safari-700 transition-colors">
          {blog.title}
        </h3>
        <p className="text-sm text-stone-500 line-clamp-2 mb-4">{blog.excerpt}</p>
        <div className="flex items-center justify-between text-xs text-stone-400">
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {blog.author}
          </span>
          <span className="flex items-center gap-1">
            <CalendarDays className="w-3 h-3" />
            {formatDate(blog.publishedAt)}
          </span>
        </div>
      </div>
    </Link>
  )
}
