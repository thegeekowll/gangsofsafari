import type { Metadata } from 'next'
import ContactForm from './ContactForm'
import { MapPin, Phone, Mail, Clock, MessageSquare } from 'lucide-react'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Contact Us | Gangs of Safari',
  description:
    'Get in touch with the Gangs of Safari team. Ask about upcoming tours, join the community, or plan a custom convoy.',
}

interface ContactPageProps {
  searchParams: { tour?: string }
}

async function getTours() {
  return prisma.tour.findMany({
    where: { published: true },
    select: { id: true, title: true },
    orderBy: { title: 'asc' },
  })
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const tours = await getTours()
  const defaultTour = searchParams.tour || ''
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-stone-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-safari-400 text-sm font-medium mb-3">
            <MessageSquare className="w-4 h-4" />
            Let&apos;s talk adventure
          </div>
          <h1 className="font-display font-black text-5xl mb-4">Get in Touch</h1>
          <p className="text-stone-400 text-lg max-w-2xl">
            Have a tour in mind? Want to join the gang? Planning a custom convoy?
            We&apos;d love to hear from you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h2 className="font-display font-bold text-2xl text-stone-900 mb-6">
                Contact Info
              </h2>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-safari-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-safari-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-800 text-sm">Address</p>
                    <p className="text-stone-500 text-sm mt-0.5">Pune, Maharashtra<br />India</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-safari-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-safari-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-800 text-sm">Phone</p>
                    <a href="tel:+919876543210" className="text-stone-500 text-sm mt-0.5 hover:text-safari-600 transition-colors block">
                      +91 98765 43210
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-safari-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-safari-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-800 text-sm">Email</p>
                    <a href="mailto:hello@gangsofsafari.com" className="text-stone-500 text-sm mt-0.5 hover:text-safari-600 transition-colors block">
                      hello@gangsofsafari.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-safari-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-safari-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-800 text-sm">Response Time</p>
                    <p className="text-stone-500 text-sm mt-0.5">We reply within 24 hours,<br />usually much sooner.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* WhatsApp CTA */}
            <div className="bg-forest-50 border border-forest-200 rounded-2xl p-6">
              <h3 className="font-display font-bold text-forest-900 text-lg mb-2">
                Quick Response?
              </h3>
              <p className="text-forest-700 text-sm mb-4">
                WhatsApp us for the fastest response — especially for urgent tour enquiries.
              </p>
              <a
                href="https://wa.me/919876543210?text=Hi%20Gangs%20of%20Safari!%20I%27d%20like%20to%20know%20more%20about%20your%20tours."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-600 hover:bg-forest-700 text-white font-semibold rounded-xl text-sm transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-stone-50 rounded-2xl p-8 border border-stone-200">
              <h2 className="font-display font-bold text-2xl text-stone-900 mb-2">
                Send us a Message
              </h2>
              <p className="text-stone-500 text-sm mb-8">
                Fill in the form below and we&apos;ll get back to you as soon as possible.
              </p>
              <ContactForm tours={tours} defaultTour={defaultTour} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
