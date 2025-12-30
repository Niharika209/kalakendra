import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import '../App.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../config/api.js'

function SubcategoryDetailPage() {
  const { categoryId, subcategoryName } = useParams()
  const [workshops, setWorkshops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const displayName = subcategoryName
    ? subcategoryName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : ''

  useEffect(() => {
    let cancelled = false
    async function fetchArtists() {
      setLoading(true)
      try {
          const decoded = (subcategoryName || '').replace(/-/g, ' ')
          const resp = await axios.get(`${API_BASE_URL}/workshops?category=${encodeURIComponent(decoded)}`)
          if (cancelled) return
          const all = Array.isArray(resp.data) ? resp.data : []

          setWorkshops(all)
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.error || err.message || 'Could not load artists')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchArtists()
    return () => { cancelled = true }
  }, [categoryId, subcategoryName])

  const filteredWorkshops = workshops.filter(w => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      w.title?.toLowerCase().includes(search) ||
      w.description?.toLowerCase().includes(search) ||
      w.artist?.name?.toLowerCase().includes(search)
    )
  })

  return (
    <>
      <Navbar 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search workshops..."
      />
      <div className="min-h-screen pt-16 px-6 bg-linear-to-b from-amber-50 to-yellow-50">
        <div className="max-w-7xl mx-auto pb-20">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-linear-to-r from-amber-700 to-yellow-600 pb-2">
              {displayName}
            </h1>
            <p className="text-lg md:text-xl text-[#45453e]/80 mb-4">
              Find the perfect artist for {displayName}
            </p>
            {searchTerm && (
              <p className="text-amber-700 mb-2">
                Found {filteredWorkshops.length} workshop{filteredWorkshops.length !== 1 ? 's' : ''} matching "{searchTerm}"
              </p>
            )}
            <Link 
              to={`/workshops/${categoryId}`}
              className="text-amber-600 hover:text-amber-700 font-semibold"
            >
              ← Back to {categoryId?.charAt(0).toUpperCase() + (categoryId?.slice ? categoryId.slice(1) : '')}
            </Link>
          </div>

          {loading && (
            <div className="py-8 text-center">Loading artists…</div>
          )}

          {error && (
            <div className="py-8 text-center text-red-600">{error}</div>
          )}

          {/* Workshops Grid */}
          {loading && <div className="py-8 text-center">Loading workshops…</div>}
          {!loading && filteredWorkshops.length === 0 && !searchTerm && (
            <div className="py-8 text-center text-amber-700">No workshops available for {displayName}.</div>
          )}
          {!loading && filteredWorkshops.length === 0 && searchTerm && (
            <div className="py-8 text-center text-amber-700">No workshops found matching "{searchTerm}".</div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkshops.map((w) => (
              <div key={w._id} className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg transition-all border border-amber-100 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#45453e] mb-2">{w.title}</h3>
                  <p className="text-sm text-amber-700 mb-2">By {w.artist?.name || 'Unknown'}</p>
                  <p className="text-sm text-amber-700 mb-2">� {w.date ? new Date(w.date).toLocaleDateString() : '-'}</p>
                  <p className="text-sm text-amber-700 mb-4">₹{w.price}</p>
                  <div className="flex items-center gap-2">
                    <Link to={`/artists/${w.artist?.slug || w.artist?._id}`} className="px-3 py-2 bg-amber-100 text-amber-900 rounded">View Artist</Link>
                    <Link to={`/workshop/${w._id}`} className="px-3 py-2 border border-amber-200 rounded">View Workshop</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default SubcategoryDetailPage
