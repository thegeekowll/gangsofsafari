import { prisma } from '@/lib/prisma'
import { Hotel } from 'lucide-react'

async function getAccommodations() {
  return prisma.accommodation.findMany({
    orderBy: { name: 'asc' },
    include: { destination: true },
  })
}

export default async function AdminAccommodationsPage() {
  const accommodations = await getAccommodations()

  const typeColors: Record<string, string> = {
    Resort: 'bg-safari-50 text-safari-700',
    Camp: 'bg-forest-50 text-forest-700',
    Hotel: 'bg-blue-50 text-blue-700',
    Homestay: 'bg-purple-50 text-purple-700',
    Lodge: 'bg-amber-50 text-amber-700',
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-black text-2xl text-stone-900">Accommodations</h1>
        <p className="text-stone-500 text-sm mt-1">{accommodations.length} accommodation{accommodations.length !== 1 ? 's' : ''}</p>
      </div>

      {accommodations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-16 text-center">
          <Hotel className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-400 text-lg">No accommodations yet. Run the seed script.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200">
                <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider hidden md:table-cell">Type</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider hidden lg:table-cell">Destination</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {accommodations.map((acc) => (
                <tr key={acc.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-stone-900 text-sm">{acc.name}</p>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${typeColors[acc.type] || 'bg-stone-100 text-stone-600'}`}>
                      {acc.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className="text-sm text-stone-600">{acc.destination.name}, {acc.destination.state}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-stone-500 line-clamp-2 max-w-xs">{acc.description}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
