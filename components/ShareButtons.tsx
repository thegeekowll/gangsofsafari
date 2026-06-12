'use client'

import { Share2, Twitter, Facebook, Link2, CheckCircle } from 'lucide-react'
import { useState } from 'react'

interface ShareButtonsProps {
  url: string
  title: string
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const shareText = encodeURIComponent(title)
  const encodedUrl = encodeURIComponent(url)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for environments without clipboard API
    }
  }

  return (
    <div className="mt-8 pt-8 border-t border-stone-200">
      <p className="text-sm font-semibold text-stone-700 mb-4 flex items-center gap-2">
        <Share2 className="w-4 h-4 text-safari-500" /> Share this post
      </p>
      <div className="flex flex-wrap gap-3">
        <a
          href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1DA1F2] hover:bg-[#1a8fd1] text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Twitter className="w-4 h-4" /> Twitter
        </a>
        <a
          href={`https://facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#4267B2] hover:bg-[#365899] text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Facebook className="w-4 h-4" /> Facebook
        </a>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-sm font-medium transition-colors"
        >
          {copied ? (
            <>
              <CheckCircle className="w-4 h-4 text-forest-500" /> Copied!
            </>
          ) : (
            <>
              <Link2 className="w-4 h-4" /> Copy Link
            </>
          )}
        </button>
      </div>
    </div>
  )
}
