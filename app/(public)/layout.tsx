import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {/* pt-16 lg:pt-20 accounts for the fixed navbar height */}
      <main className="flex-1 pt-16 lg:pt-20">{children}</main>
      <Footer />
    </div>
  )
}
