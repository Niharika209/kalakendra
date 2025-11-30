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
  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)

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

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl)
    setShowImageModal(true)
  }

  const closeModal = () => {
    setShowImageModal(false)
    setSelectedImage(null)
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
                <img 
                  src={workshop.thumbnailUrl || workshop.imageUrl || placeholderImage} 
                  alt={workshop.title} 
                  loading="lazy" 
                  onError={(e)=>{e.target.onerror=null; e.target.src=placeholderImage}} 
                  onClick={() => handleImageClick(workshop.imageUrl || workshop.thumbnailUrl || placeholderImage)}
                  className="w-full h-64 object-center object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity" 
                />
              </div>
              <div className="mb-6 bg-white p-6 rounded-lg border border-amber-100">
                <h2 className="text-xl font-semibold text-amber-900 mb-2">About this workshop</h2>
                <p className="text-amber-800 leading-relaxed">{workshop.description || 'No description provided.'}</p>
              </div>

              {workshop.whatYouWillLearn && (
                <div className="mb-6 bg-white p-6 rounded-lg border border-amber-100">
                  <h2 className="text-xl font-semibold text-amber-900 mb-3">🎯 What You'll Learn</h2>
                  <p className="text-amber-800 leading-relaxed whitespace-pre-line">{workshop.whatYouWillLearn}</p>
                </div>
              )}

              {workshop.requirements && (
                <div className="mb-6 bg-white p-6 rounded-lg border border-amber-100">
                  <h2 className="text-xl font-semibold text-amber-900 mb-3">📝 Requirements</h2>
                  <p className="text-amber-800 leading-relaxed whitespace-pre-line">{workshop.requirements}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-white rounded-lg border border-amber-100">
                  <h3 className="font-semibold text-amber-900 mb-2">📅 When</h3>
                  <p className="text-amber-700">{workshop.date ? new Date(workshop.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'TBA'}</p>
                  <p className="text-amber-700 font-medium">{workshop.time || 'Time TBA'}</p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-amber-100">
                  <h3 className="font-semibold text-amber-900 mb-2">⏱️ Duration</h3>
                  <p className="text-amber-700 text-lg font-medium">{workshop.duration || 'TBA'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg border border-amber-100">
                  <h3 className="font-semibold text-amber-900 mb-2">📍 Mode & Location</h3>
                  <p className="text-amber-700">
                    <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-2">
                      {workshop.mode || 'Online'}
                    </span>
                  </p>
                  <p className="text-amber-700">{workshop.location || (workshop.mode === 'Online' ? 'Online Platform' : 'Location TBA')}</p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-amber-100">
                  <h3 className="font-semibold text-amber-900 mb-2">🎯 Target Audience</h3>
                  <p className="text-amber-700">{workshop.targetAudience || 'All Levels'}</p>
                  {workshop.maxParticipants && (
                    <p className="text-amber-600 text-sm mt-2">👥 Max: {workshop.maxParticipants} participants</p>
                  )}
                </div>
              </div>

              {(workshop.materialProvided || workshop.certificateProvided) && (
                <div className="mt-6 bg-amber-50 p-6 rounded-lg border border-amber-200">
                  <h3 className="font-semibold text-amber-900 mb-3">✨ Included</h3>
                  <div className="space-y-2">
                    {workshop.materialProvided && (
                      <div className="flex items-center text-amber-800">
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Materials Provided</span>
                      </div>
                    )}
                    {workshop.certificateProvided && (
                      <div className="flex items-center text-amber-800">
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Certificate of Completion</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <aside className="md:col-span-1">
              <div className="p-6 bg-white rounded-lg border border-amber-100 sticky top-24">
                {(workshop.category || workshop.subcategory) && (
                  <div className="mb-4 pb-4 border-b border-amber-100">
                    {workshop.category && (
                      <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium mb-2">
                        {workshop.category}
                      </span>
                    )}
                    {workshop.subcategory && (
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium ml-2 mb-2">
                        {workshop.subcategory}
                      </span>
                    )}
                  </div>
                )}
                <div className="mb-4">
                  <div className="text-3xl font-bold text-amber-600">₹{workshop.price || 0}</div>
                  <div className="text-sm text-amber-700 mt-1">
                    👥 {workshop.enrolled ?? 0} enrolled
                    {workshop.maxParticipants && ` / ${workshop.maxParticipants} max`}
                  </div>
                </div>
                <button onClick={() => addToCart(workshop)} className="w-full bg-amber-600 hover:bg-amber-700 text-white px-4 py-3 rounded-md font-medium transition-colors">🎓 Enroll Now</button>
                <button onClick={() => navigate(-1)} className="w-full mt-3 border border-amber-200 hover:bg-amber-50 text-amber-900 px-4 py-2 rounded-md transition-colors">← Back</button>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Image Lightbox Modal */}
      {showImageModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-50"
            aria-label="Close"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div 
            className="relative max-w-6xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt={workshop?.title || 'Workshop image'}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onError={(e)=>{e.target.onerror=null; e.target.src=placeholderImage}}
            />
          </div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-4 py-2 rounded-full">
            Click anywhere to close
          </div>
        </div>
      )}
    </>
  )
}

export default WorkshopDetailPage
