import type { Metadata } from 'next'
import './globals.css'
import SessionWrapper from '@/components/SessionWrapper'

export const metadata: Metadata = {
  title: 'Gangs of Safari | Adventure on Four Wheels',
  description:
    "India's premier community for Tata Safari owners. Explore curated road trips, wildlife safaris, and mountain expeditions across India.",
  keywords: 'Tata Safari, road trips India, safari tours, adventure travel, SUV tours India',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  )
}
