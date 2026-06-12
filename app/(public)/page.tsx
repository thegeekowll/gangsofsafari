import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import HeroSection from '@/components/HeroSection'
import TourCard from '@/components/TourCard'
import DestinationCard from '@/components/DestinationCard'
import BlogCard from '@/components/BlogCard'
import { ArrowRight, CheckCircle, Users, Compass, Star, Home } from 'lucide-react'

async function getFeaturedTours() {
  return prisma.tour.findMany({
    where: { published: true, featured: true },
    include: { destinations: { include: { destination: true } } },
    take: 3,
    orderBy: { createdAt: 'desc' },
  })
}

async function getDestinations() {
  return prisma.destination.findMany({
    take: 6,
    include: {
      _count: { select: { tours: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

async function getFeaturedBlogs() {
  return prisma.blog.findMany({
    where: { published: true },
    orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }],
    take: 3,
  })
}

const features = [
  {
    icon: CheckCircle,
    title: 'Verified Routes',
    description:
      'Every route is scouted and tested by our team before your convoy sets off. No surprises, only adventures.',
    color: 'text-forest-600',
    bg: 'bg-forest-50',
  },
  {
    icon: Compass,
    title: 'Expert Convoy Leaders',
    description:
      'Each tour is led by experienced Safarians with deep knowledge of terrain, weather, and local culture.',
    color: 'text-safari-600',
    bg: 'bg-safari-50',
  },
  {
    icon: Home,
    title: 'Curated Stays',
    description:
      'From jungle camps to heritage hotels — every accommodation is hand-picked for comfort and experience.',
    color: 'text-forest-600',
    bg: 'bg-forest-50',
  },
  {
    icon: Users,
    title: 'Community of 500+ Safarians',
    description:
      'Join a thriving community of passionate Tata Safari owners who share your love of the open road.',
    color: 'text-safari-600',
    bg: 'bg-safari-50',
  },
]

const testimonials = [
  {
    name: 'Rajesh Kumar',
    location: 'Bangalore',
    rating: 5,
    text: "The Coorg expedition was life-changing! The convoy leader knew every backroad and hidden viewpoint. My Safari handled everything like a beast. Already booked my next trip.",
    tour: 'Coorg Coffee & Cascades',
    avatar: 'RK',
  },
  {
    name: 'Priya Sharma',
    location: 'Delhi',
    rating: 5,
    text: "Went solo on the Rann of Kutch tour and made friends for life. The GoS community is incredibly welcoming. The sunset on the salt desert in my Safari — priceless.",
    tour: 'Rann of Kutch Desert Drive',
    avatar: 'PS',
  },
  {
    name: 'Arun Menon',
    location: 'Kochi',
    rating: 5,
    text: "Three tours done with Gangs of Safari and I can say they are simply the best. The logistics, the stays, the route — everything is perfectly organized. Zero stress, pure joy.",
    tour: 'Spiti Valley Expedition',
    avatar: 'AM',
  },
]

export default async function HomePage() {
  const [featuredTours, destinations, blogs] = await Promise.all([
    getFeaturedTours(),
    getDestinations(),
    getFeaturedBlogs(),
  ])

  const destinationsWithCount = destinations.map((d) => ({
    ...d,
    tourCount: d._count.tours,
  }))

  return (
    <>
      <HeroSection />

      {/* Featured Tours */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-safari-600 font-semibold text-sm uppercase tracking-wider mb-2">
                Curated for Safarians
              </p>
              <h2 className="font-display font-black text-4xl text-stone-900">Featured Tours</h2>
            </div>
            <Link
              href="/tours"
              className="hidden sm:inline-flex items-center gap-2 text-safari-600 font-semibold hover:text-safari-700 transition-colors"
            >
              View All Tours <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {featuredTours.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredTours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-stone-400">
              <p className="text-lg">Tours coming soon. Check back shortly!</p>
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/tours"
              className="inline-flex items-center gap-2 text-safari-600 font-semibold"
            >
              View All Tours <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-forest-600 font-semibold text-sm uppercase tracking-wider mb-2">
                Across the Subcontinent
              </p>
              <h2 className="font-display font-black text-4xl text-stone-900">
                Explore Destinations
              </h2>
            </div>
            <Link
              href="/destinations"
              className="hidden sm:inline-flex items-center gap-2 text-forest-600 font-semibold hover:text-forest-700 transition-colors"
            >
              All Destinations <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {destinationsWithCount.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinationsWithCount.map((destination) => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-stone-400">
              <p className="text-lg">Destinations coming soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Why GoS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-safari-600 font-semibold text-sm uppercase tracking-wider mb-2">
              The GoS Difference
            </p>
            <h2 className="font-display font-black text-4xl text-stone-900 mb-4">
              Why Gangs of Safari?
            </h2>
            <p className="text-stone-500 text-lg max-w-2xl mx-auto">
              We&apos;re not just a tour company — we&apos;re a community of passionate drivers who
              believe every road is a story waiting to be told.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map(({ icon: Icon, title, description, color, bg }) => (
              <div
                key={title}
                className="text-center p-6 rounded-2xl border border-stone-100 hover:border-stone-200 hover:shadow-md transition-all duration-300"
              >
                <div
                  className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center mx-auto mb-5`}
                >
                  <Icon className={`w-7 h-7 ${color}`} />
                </div>
                <h3 className="font-display font-bold text-stone-900 text-lg mb-3">{title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog */}
      {blogs.length > 0 && (
        <section className="py-20 bg-stone-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-safari-600 font-semibold text-sm uppercase tracking-wider mb-2">
                  Stories from the Road
                </p>
                <h2 className="font-display font-black text-4xl text-stone-900">From the Road</h2>
              </div>
              <Link
                href="/blog"
                className="hidden sm:inline-flex items-center gap-2 text-safari-600 font-semibold hover:text-safari-700 transition-colors"
              >
                All Posts <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-20 bg-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-safari-400 font-semibold text-sm uppercase tracking-wider mb-2">
              Voices of the Convoy
            </p>
            <h2 className="font-display font-black text-4xl text-white">
              What Safarians Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-stone-800 rounded-2xl p-6 border border-stone-700"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-safari-400 text-safari-400" />
                  ))}
                </div>
                <p className="text-stone-300 text-sm leading-relaxed mb-6 italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-safari-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-stone-400 text-xs">{t.location} · {t.tour}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-gradient-to-br from-safari-500 to-safari-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-black text-4xl sm:text-5xl text-white mb-4">
            Ready for Your Next Adventure?
          </h2>
          <p className="text-safari-100 text-lg mb-10 max-w-2xl mx-auto">
            Join the convoy. Book your spot on an upcoming tour and experience India
            from behind the wheel of a Tata Safari.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/tours"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-safari-600 font-bold rounded-xl text-base hover:bg-safari-50 transition-colors shadow-lg"
            >
              Browse Tours <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/40 hover:border-white text-white font-bold rounded-xl text-base transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
