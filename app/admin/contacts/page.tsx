import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Mail, Phone, MessageSquare, CheckCheck } from 'lucide-react'
import MarkReadButton from './MarkReadButton'

async function getContacts() {
  return prisma.contact.findMany({ orderBy: { createdAt: 'desc' } })
}

export default async function AdminContactsPage() {
  const contacts = await getContacts()
  const unread = contacts.filter((c) => !c.read).length

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-black text-2xl text-stone-900">Messages</h1>
          <p className="text-stone-500 text-sm mt-1">
            {contacts.length} total · {unread > 0 ? <span className="text-blue-600 font-semibold">{unread} unread</span> : 'all read'}
          </p>
        </div>
      </div>

      {contacts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-16 text-center">
          <MessageSquare className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-400 text-lg">No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`bg-white rounded-2xl border p-6 transition-all ${
                contact.read ? 'border-stone-200' : 'border-blue-200 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                    contact.read ? 'bg-stone-200 text-stone-600' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {contact.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <h3 className="font-semibold text-stone-900">{contact.name}</h3>
                      {!contact.read && (
                        <span className="text-xs bg-blue-100 text-blue-600 font-semibold px-2 py-0.5 rounded-full">New</span>
                      )}
                      <span className="text-xs text-stone-400">{formatDate(contact.createdAt)}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-stone-500 mb-3">
                      <a href={`mailto:${contact.email}`} className="flex items-center gap-1.5 hover:text-safari-600 transition-colors">
                        <Mail className="w-3.5 h-3.5" />{contact.email}
                      </a>
                      {contact.phone && (
                        <a href={`tel:${contact.phone}`} className="flex items-center gap-1.5 hover:text-safari-600 transition-colors">
                          <Phone className="w-3.5 h-3.5" />{contact.phone}
                        </a>
                      )}
                    </div>
                    <p className="text-stone-700 text-sm leading-relaxed bg-stone-50 rounded-xl p-4">
                      {contact.message}
                    </p>
                  </div>
                </div>
                {!contact.read && <MarkReadButton id={contact.id} />}
                {contact.read && (
                  <div className="flex items-center gap-1 text-xs text-stone-400 flex-shrink-0">
                    <CheckCheck className="w-3.5 h-3.5" /> Read
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
