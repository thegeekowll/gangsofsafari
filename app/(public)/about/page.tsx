import Image from 'next/image'
import Link from 'next/link'
import { Car, Users, Shield, Map, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | Gangs of Safari',
  description:
    "The story behind Gangs of Safari — India's premier community for Tata Safari owners.",
}

const founder = {
  name: 'Anil Dhyani',
  role: 'Founder & Chief Explorer',
  location: 'Pune, Maharashtra, India',
  bio: 'Anil Dhyani is the man behind Gangs of Safari. A passionate Tata Safari owner and road tripper based in Pune, Anil started this community after realising there was no dedicated space for Safari owners to plan, connect, and explore together. From the Sahyadris to the Himalayas, he has driven some of India\'s most challenging and beautiful roads — and he built GoS so every Safari owner could do the same.',
  avatar: 'AD',
  stat: 'Founder & driving force of GoS',
}

const values = [
  {
    icon: Car,
    title: 'Safari First',
    desc: "Every decision we make is filtered through one lens: will this make the Tata Safari owner's experience better? Our tours, our routes, our partners — all chosen with our vehicle in mind.",
  },
  {
    icon: Users,
    title: 'Community Over Commerce',
    desc: "We're a community that happens to sell tours, not a tour company that happens to have members. The gang comes first — always.",
  },
  {
    icon: Shield,
    title: 'Safety Without Compromise',
    desc: "Adventure doesn't mean reckless. Every route is recce'd, every convoy has a sweep vehicle, and every member has an emergency contact system.",
  },
  {
    icon: Map,
    title: 'Authentic India',
    desc: "We don't do sanitised, resort-to-resort tours. We drive through real India — villages, forests, mountains, deserts — and our routes reflect that.",
  },
]

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div
        className="relative bg-stone-900 text-white py-32 px-4 overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-stone-950/75" />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-safari-400 font-semibold text-sm uppercase tracking-wider mb-4">
            Our Story
          </p>
          <h1 className="font-display font-black text-5xl sm:text-6xl mb-6 leading-tight">
            Born on the Open Road
          </h1>
          <p className="text-stone-300 text-xl max-w-2xl mx-auto leading-relaxed">
            Gangs of Safari started as a WhatsApp group of seven Tata Safari owners planning a trip
            to Coorg. Today, we&apos;re a 500-strong community that has collectively driven over
            10,000 kilometres of India&apos;s greatest roads.
          </p>
        </div>
      </div>

      {/* Origin Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-safari-500 font-semibold text-sm uppercase tracking-wider mb-3">
                How it started
              </p>
              <h2 className="font-display font-black text-4xl text-stone-900 mb-6">
                A WhatsApp Group That Became a Movement
              </h2>
              <div className="space-y-4 text-stone-600 leading-relaxed">
                <p>
                  It was October 2021. Anil Dhyani, a Tata Safari owner from Pune, had just
                  returned from a solo drive through the Sahyadris and knew he didn&apos;t want to
                  do the next one alone. He posted in a general car enthusiast group asking if
                  anyone else wanted to join a convoy to Coorg. Seven Safari owners raised their
                  hands.
                </p>
                <p>
                  The three-day convoy to Coorg — winding through the Western Ghats, camping by
                  coffee estates, and bonding over breakdowns — was unlike any of them had
                  experienced before. There was something magical about moving through India in
                  formation, in identical vehicles, with people who all understood the same
                  language.
                </p>
                <p>
                  Gangs of Safari was registered as a community in January 2022. By the end of
                  that year, we had completed 12 tours and onboarded 120 members. Today,
                  we&apos;re 500+ strong and still growing.
                </p>
              </div>
            </div>
            <div className="relative h-80 lg:h-[500px] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=900&q=80"
                alt="Safari convoy on a mountain road"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-safari-500 font-semibold text-sm uppercase tracking-wider mb-3">
              What We Stand For
            </p>
            <h2 className="font-display font-black text-4xl text-stone-900">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {values.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex gap-5 p-6 bg-white rounded-2xl border border-stone-200 hover:border-safari-300 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-safari-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-safari-500" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-stone-900 text-lg mb-2">{title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-safari-500 font-semibold text-sm uppercase tracking-wider mb-3">
              The Man Behind the Wheel
            </p>
            <h2 className="font-display font-black text-4xl text-stone-900">Meet the Founder</h2>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border border-stone-200 rounded-2xl p-10 text-center hover:border-safari-300 hover:shadow-lg transition-all">
              <div className="w-24 h-24 bg-safari-500 rounded-full flex items-center justify-center text-white font-display font-black text-3xl mx-auto mb-6">
                {founder.avatar}
              </div>
              <h3 className="font-display font-bold text-stone-900 text-2xl mb-1">
                {founder.name}
              </h3>
              <p className="text-safari-600 text-sm font-semibold mb-1">{founder.role}</p>
              <p className="text-stone-400 text-sm mb-6">{founder.location}</p>
              <p className="text-stone-500 text-base leading-relaxed mb-6">{founder.bio}</p>
              <span className="inline-block bg-safari-50 text-safari-700 text-xs font-semibold px-4 py-1.5 rounded-full border border-safari-200">
                {founder.stat}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-safari-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: '500+', label: 'Active Members' },
              { value: '50+', label: 'Tours Completed' },
              { value: '25', label: 'States Explored' },
              { value: '10,000+', label: 'KMs Logged' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="font-display font-black text-4xl text-safari-400 mb-2">{value}</p>
                <p className="text-stone-400 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display font-black text-3xl sm:text-4xl text-stone-900 mb-4">
            Ready to Join the Gang?
          </h2>
          <p className="text-stone-500 text-lg mb-8">
            Every Safari owner deserves a community. Start your adventure with us.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/tours"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-safari-500 hover:bg-safari-600 text-white font-bold rounded-xl transition-colors"
            >
              Browse Tours <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-stone-300 hover:border-safari-400 text-stone-700 hover:text-safari-600 font-semibold rounded-xl transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
