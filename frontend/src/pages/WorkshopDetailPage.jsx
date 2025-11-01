import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import placeholderImage from '../assets/wave-background.svg'

function WorkshopDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [workshop, setWorkshop] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const resp = await axios.get(`/api/workshops/${id}`)
        if (!cancelled) setWorkshop(resp.data)
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.error || err.message || 'Could not load workshop')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    if (id) load()
    return () => { cancelled = true }
  }, [id])

  const addToCart = (w) => {
    try {
      const raw = localStorage.getItem('cart')
      const cart = raw ? JSON.parse(raw) : []
      const itemId = w._id || w.id
      const existing = cart.find((i) => i.id === itemId)
      if (existing) {
        existing.quantity = (existing.quantity || 1) + 1
      } else {
        const cartItem = {
          id: itemId,
          title: w.title,
          price: w.price || 0,
          quantity: 1,
          artist: (w.artist && w.artist.name) || (w.artistName) || '',
          image: (w.thumbnailUrl) || (w.imageUrl) || placeholderImage,
        }
        cart.push(cartItem)
      }
      localStorage.setItem('cart', JSON.stringify(cart))
      navigate('/checkout')
    } catch (e) {
      console.warn('Could not add to cart', e)
      navigate('/checkout')
    }
  }

  if (loading) return (<><Navbar /><div className="min-h-screen flex items-center justify-center">Loading workshop…</div></>)
  if (error) return (<><Navbar /><div className="min-h-screen flex items-center justify-center text-red-600">{error}</div></>)
  if (!workshop) return (<><Navbar /><div className="min-h-screen flex items-center justify-center">Workshop not found.</div></>)

  const artist = workshop.artist || {}

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h1 className="text-3xl font-bold text-amber-900 mb-3">{workshop.title}</h1>
              <p className="text-sm text-amber-700 mb-4">By {artist.name ? <Link to={`/artists/${artist.slug || artist._id}`}>{artist.name}</Link> : (workshop.artistName || 'Unknown')}</p>
              <div className="mb-6">
                <img src={workshop.thumbnailUrl || workshop.imageUrl || placeholderImage} alt={workshop.title} loading="lazy" onError={(e)=>{e.target.onerror=null; e.target.src=placeholderImage}} className="w-full h-64 object-center object-cover rounded-lg" />
              </div>
              <div className="mb-6 bg-white p-6 rounded-lg border border-amber-100">
                <h2 className="text-xl font-semibold text-amber-900 mb-2">About this workshop</h2>
                <p className="text-amber-800 leading-relaxed">{workshop.description || 'No description provided.'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg border border-amber-100">
                  <h3 className="font-semibold text-amber-900 mb-2">When</h3>
                  <p className="text-amber-700">{workshop.date ? new Date(workshop.date).toLocaleString() : 'TBA'}</p>
                  <p className="text-amber-700">{workshop.time || ''}</p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-amber-100">
                  <h3 className="font-semibold text-amber-900 mb-2">Details</h3>
                  <p className="text-amber-700">Duration: {workshop.duration || '-'}</p>
                  <p className="text-amber-700">Mode: {workshop.mode || 'Online/Offline'}</p>
                  <p className="text-amber-700">Location: {workshop.location || '-'}</p>
                </div>
              </div>
            </div>

            <aside className="md:col-span-1">
              <div className="p-6 bg-white rounded-lg border border-amber-100 sticky top-24">
                <div className="mb-4">
                  <div className="text-2xl font-bold text-amber-600">₹{workshop.price || 0}</div>
                  <div className="text-sm text-amber-700">{workshop.enrolled ?? 0} enrolled</div>
                </div>
                <button onClick={() => addToCart(workshop)} className="w-full bg-amber-600 hover:bg-amber-700 text-white px-4 py-3 rounded-md font-medium">Enroll Now</button>
                <button onClick={() => navigate(-1)} className="w-full mt-3 border border-amber-200 text-amber-900 px-4 py-2 rounded-md">Back</button>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  )
}

export default WorkshopDetailPage
