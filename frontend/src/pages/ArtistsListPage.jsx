import '../App.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import ArtistCard from '../components/ArtistCard'
import { API_BASE_URL } from '../config/api.js'

function ArtistsListPage() {
  const [artists, setArtists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const resp = await axios.get(`${API_BASE_URL}/artists`)
        if (!cancelled) setArtists(Array.isArray(resp.data) ? resp.data : [])
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.error || err.message || 'Could not load artists')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  // Filter artists based on search term (maintains sort order from backend)
  const filteredArtists = artists.filter(artist => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      artist.name?.toLowerCase().includes(search) ||
      artist.bio?.toLowerCase().includes(search) ||
      artist.specialties?.some(s => s.toLowerCase().includes(search)) ||
      artist.category?.toLowerCase().includes(search)
    )
  })
  // Artists sorted by: (Featured × 1000) + (Rating × 200) + (Availability × 50) + (Popularity × 10) + (Experience × 5)

  return (
    <>
      <Navbar 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search artists by name, specialty, or category..."
      />
      <div className="min-h-screen pt-16 px-6 bg-linear-to-b from-amber-50 to-yellow-50">
        <div className="max-w-7xl mx-auto pb-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-linear-to-r from-amber-700 to-yellow-600 pb-2">Explore Artists</h1>
          {loading && <div className="py-8 text-center">Loading artists…</div>}
          {error && <div className="py-8 text-center text-red-600">{error}</div>}
          {!loading && !error && (
            <>
              {searchTerm && (
                <p className="text-amber-700 mb-4">
                  Found {filteredArtists.length} artist{filteredArtists.length !== 1 ? 's' : ''}
                  {searchTerm && ` matching "${searchTerm}"`}
                </p>
              )}
              {filteredArtists.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {filteredArtists.map((a, idx) => (
                    <ArtistCard key={a._id || a.slug || idx} artist={a} index={idx} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-amber-700 text-lg">No artists found matching "{searchTerm}"</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default ArtistsListPage
