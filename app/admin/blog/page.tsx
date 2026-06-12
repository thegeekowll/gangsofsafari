import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatDate, parseJSON } from '@/lib/utils'
import { Plus, Pencil, Eye, Tag } from 'lucide-react'

async function getBlogs() {
  return prisma.blog.findMany({ orderBy: { createdAt: 'desc' } })
}

export default async function AdminBlogPage() {
  const blogs = await getBlogs()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-black text-2xl text-stone-900">Blog Posts</h1>
          <p className="text-stone-500 text-sm mt-1">{blogs.length} post{blogs.length !== 1 ? 's' : ''} total</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-safari-500 hover:bg-safari-600 text-white font-semibold text-sm rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" /> New Post
        </Link>
      </div>

      {blogs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-16 text-center">
          <p className="text-stone-400 text-lg mb-4">No blog posts yet.</p>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-safari-500 text-white rounded-xl font-semibold text-sm hover:bg-safari-600 transition-colors"
          >
            <Plus className="w-4 h-4" /> Write your first post
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Title</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider hidden md:table-cell">Author</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider hidden lg:table-cell">Tags</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider hidden lg:table-cell">Published</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {blogs.map((blog) => {
                  const tags = parseJSON<string[]>(blog.tags, [])
                  return (
                    <tr key={blog.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-stone-900 text-sm line-clamp-1">{blog.title}</p>
                          <p className="text-stone-400 text-xs mt-0.5 line-clamp-1">{blog.excerpt}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="text-sm text-stone-600">{blog.author}</span>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="inline-flex items-center gap-1 text-xs text-safari-600 bg-safari-50 px-2 py-0.5 rounded-full">
                              <Tag className="w-2.5 h-2.5" />{tag}
                            </span>
                          ))}
                          {tags.length > 2 && <span className="text-xs text-stone-400">+{tags.length - 2}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <span className="text-xs text-stone-500">
                          {blog.publishedAt ? formatDate(blog.publishedAt) : '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${blog.published ? 'bg-forest-500' : 'bg-amber-400'}`} />
                            <span className="text-xs text-stone-600">{blog.published ? 'Published' : 'Draft'}</span>
                          </div>
                          {blog.featured && <span className="text-xs text-safari-600 font-medium">Featured</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {blog.published && (
                            <Link
                              href={`/blog/${blog.slug}`}
                              target="_blank"
                              className="p-1.5 text-stone-400 hover:text-stone-600 transition-colors"
                              title="Preview"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          )}
                          <Link
                            href={`/admin/blog/${blog.id}`}
                            className="p-1.5 text-stone-400 hover:text-safari-600 transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
