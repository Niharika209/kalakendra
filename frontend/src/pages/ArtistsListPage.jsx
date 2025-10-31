import '../App.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import ArtistCard from '../components/ArtistCard'

function ArtistsListPage() {
  const [artists, setArtists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const resp = await axios.get('/api/artists')
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

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-16 px-6 bg-linear-to-b from-amber-50 to-yellow-50">
        <div className="max-w-7xl mx-auto pb-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-linear-to-r from-amber-700 to-yellow-600 pb-2">Explore Artists</h1>
          {loading && <div className="py-8 text-center">Loading artists…</div>}
          {error && <div className="py-8 text-center text-red-600">{error}</div>}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {artists.map((a, idx) => (
                <ArtistCard key={a._id || a.slug || idx} artist={a} index={idx} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ArtistsListPage
