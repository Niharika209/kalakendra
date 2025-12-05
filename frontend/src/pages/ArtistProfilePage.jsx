import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import priyaImage from '../assets/priya.png'
import ashaImage from '../assets/asha.png'
import karanImage from '../assets/karan.png'
import vikramImage from '../assets/vikram.png'
import placeholderImage from '../assets/wave-background.svg'
import { API_BASE_URL } from '../config/api.js'

const API_URL = API_BASE_URL

function ArtistProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [activeTab, setActiveTab] = useState('workshops')
  const [artist, setArtist] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState('')
  const [showDemoModal, setShowDemoModal] = useState(false)
  const [demoSessionType, setDemoSessionType] = useState('') // 'live' or 'recorded'
  const [demoFormData, setDemoFormData] = useState({
    name: '',
    email: '',
    phone: '',
    artInterest: '',
    message: ''
  });
  const [demoSubmitting, setDemoSubmitting] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl)
    setShowImageModal(true)
  }

  const closeModal = () => {
    setShowImageModal(false)
    setSelectedImage('')
  }

  useEffect(() => {
    let cancelled = false
    async function loadArtist() {
      setLoading(true)
      try {
  const resp = await axios.get(`/api/artists/${id}`)
        if (!cancelled) setArtist(resp.data)
      } catch (err) {
        // If we got a 404 and the id looks numeric (old links may use 1-based indexes),
        // try to resolve it by fetching all artists and mapping the numeric id to a slug.
        const status = err?.response?.status
        if (!cancelled && status === 404 && /^[0-9]+$/.test(id)) {
          try {
            const listResp = await axios.get(`${API_URL}/artists`)
            const idx = Math.max(0, Number(id) - 1)
            const target = Array.isArray(listResp.data) ? listResp.data[idx] : null
            if (target) {
              const key = target.slug || target._id
              const retry = await axios.get(`/api/artists/${key}`)
              if (!cancelled) {
                setArtist(retry.data)
                setError(null)
                // Redirect to canonical URL (slug or _id) so the browser shows stable URLs
                try {
                  navigate(`/artists/${key}`, { replace: true })
                } catch (navErr) {
                  // ignore navigation errors in tests
                }
                return
              }
            }
          } catch (e) {
            // swallow and fall through to the generic error below
          }
        }

        // Keep error message short and user-friendly
        if (!cancelled) setError(err?.response?.data?.error || err.message || 'Could not load artist')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    if (id) loadArtist()
    return () => { cancelled = true }
  }, [id])

  const handleBookSession = () => {
    if (!user) {
      alert('Please login to book a demo session')
      navigate('/login')
      return
    }
    
    // Check if artist has demo sessions enabled
    const demoSettings = artist?.demoSessionSettings
    if (!demoSettings?.enabled) {
      alert('This artist is not currently offering demo sessions')
      return
    }
    
    // Validate that artist has actually set up demo content
    const hasRecordedVideo = demoSettings.offersRecorded && demoSettings.recordedSessionUrl
    const hasLiveSlots = demoSettings.offersLive && demoSettings.liveSessionSlots && demoSettings.liveSessionSlots.length > 0
    
    if (!hasRecordedVideo && !hasLiveSlots) {
      alert('Demo sessions are not available at the moment. The artist needs to set up demo content.')
      return
    }
    
    // Set default session type based on what artist offers
    if (demoSettings.offersLive && hasLiveSlots && !hasRecordedVideo) {
      setDemoSessionType('live')
    } else if (hasRecordedVideo && !hasLiveSlots) {
      setDemoSessionType('recorded')
    } else if (hasLiveSlots) {
      setDemoSessionType('live') // Default to live if both are available
    } else {
      setDemoSessionType('recorded')
    }
    
    setShowDemoModal(true)
    // Pre-fill form with user data
    setDemoFormData(prev => ({
      ...prev,
      name: user.name || '',
      email: user.email || ''
    }))
  }

  const handleDemoFormChange = (e) => {
    const { name, value } = e.target
    setDemoFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleDemoSubmit = async (e) => {
    e.preventDefault()
    
    // For recorded sessions, no booking needed - just acknowledge access
    if (demoSessionType === 'recorded') {
      alert('You now have access to the demo video! You can watch it anytime.')
      setShowDemoModal(false)
      return
    }

    // For live sessions, validate form and slot selection
    if (!demoFormData.name || !demoFormData.email || !demoFormData.phone) {
      alert('Please fill in all required fields')
      return
    }

    if (!selectedSlot) {
      alert('Please select a time slot for the live session')
      return
    }

    setDemoSubmitting(true)

    try {
      // Create demo booking via API
      const bookingData = {
        artistId: artist._id,
        learnerName: demoFormData.name,
        learnerEmail: demoFormData.email,
        learnerPhone: demoFormData.phone,
        artInterest: demoFormData.artInterest,
        message: demoFormData.message,
        sessionType: 'live',
        selectedSlot: selectedSlot
      }

      const response = await axios.post(`${API_URL}/demo-bookings`, bookingData)
      
      // Show success confirmation
      alert(`🎉 Demo session confirmed!\n\nYour live session with ${artist.name} has been booked for:\n📅 ${new Date(selectedSlot.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}\n🕐 ${selectedSlot.time}\n\nThe artist will contact you at ${demoFormData.email} with session details.`)
      
      setShowDemoModal(false)
      setDemoFormData({
        name: '',
        email: '',
        phone: '',
        artInterest: '',
        message: ''
      })
      setSelectedSlot(null)
    } catch (error) {
      console.error('Error booking demo session:', error)
      alert('Failed to book demo session. Please try again.')
    } finally {
      setDemoSubmitting(false)
    }
  }

  // Helper getters with graceful fallbacks
  // Prefer any image provided by the API, but for the seeded "Karan Mehta" entry
  // use the local `karan.png` asset as an explicit override (fallbacks follow).
  // Special-case local assets for seeded artists so their profile image uses the local file.
  const overrideImage = artist
    ? (artist.name === 'Asha Patel' || artist.slug === 'asha-patel')
      ? ashaImage
      : (artist.name === 'Karan Mehta' || artist.slug === 'karan-mehta')
        ? karanImage
        : (artist.name === 'Vikram Rao' || artist.slug === 'vikram-rao')
          ? vikramImage
          : null
    : null
  // Ensure any explicit override is used first, then prefer API images, then local fallbacks.
  const profileImage = overrideImage || artist?.imageUrl || artist?.image || artist?.thumbnailUrl || priyaImage || placeholderImage
  const pricePerHour = artist?.pricePerHour ?? artist?.hourlyRate ?? '-'
  const rating = artist?.rating ?? artist?.avgRating ?? '-'
  // Normalize reviewsCount: prefer explicit number, otherwise use array length when reviews array exists
  const reviewsCount = typeof artist?.reviewsCount === 'number'
    ? artist.reviewsCount
    : Array.isArray(artist?.reviews)
      ? artist.reviews.length
      : 0
  const specialties = Array.isArray(artist?.specialties) ? artist.specialties : []
  const workshops = Array.isArray(artist?.workshops) ? artist.workshops : []
  // Prefer explicit testimonials array; fall back to reviews array if testimonials missing
  const testimonials = Array.isArray(artist?.testimonials)
    ? artist.testimonials
    : Array.isArray(artist?.reviews)
      ? artist.reviews
      : []
  const gallery = Array.isArray(artist?.gallery) ? artist.gallery : []

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-12">
          {loading && (
            <div className="py-20 text-center">
              <p className="text-amber-700">Loading artist profile…</p>
            </div>
          )}

          {error && (
            <div className="py-20 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button onClick={() => navigate(-1)} className="px-4 py-2 bg-amber-100 rounded">Go back</button>
            </div>
          )}

          {!loading && !artist && !error && (
            <div className="py-20 text-center">
              <p className="text-amber-700">Artist not found.</p>
              <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-amber-100 rounded">Return home</button>
            </div>
          )}

          {artist && (
            <>
              {/* Hero Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {/* Profile Image */}
                <div className="md:col-span-1">
                  <div className="sticky top-20">
                    <div className="relative h-56 sm:h-72 md:h-80 lg:h-96 bg-linear-to-br from-amber-200 to-orange-200 rounded-lg overflow-hidden mb-4">
                      <img
                        src={profileImage}
                        alt={artist.name || 'Artist'}
                        loading="lazy"
                        onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage }}
                        className="w-full h-full object-center object-cover"
                      />
                    </div>
                    {/* Only show demo button if artist has enabled demo sessions */}
                    {artist.demoSessionSettings?.enabled && (
                      <button
                        onClick={handleBookSession}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white mb-3 px-4 py-2 rounded-md font-medium transition-colors">
                        Book Free Demo Session
                      </button>
                    )}
                    <button
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className={`w-full px-4 py-2 rounded-md font-medium border transition-colors ${
                        isWishlisted
                          ? "bg-red-50 border-red-300 text-red-600"
                          : "border-amber-300 text-amber-900 hover:bg-amber-50 bg-transparent"
                      }`}
                    >
                      <svg className={`w-4 h-4 inline mr-2 ${isWishlisted ? "fill-current" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                    </button>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="md:col-span-2">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-4xl font-bold text-amber-900 mb-2">{artist.name}</h1>
                      <p className="text-xl text-amber-700 mb-4">{artist.category}</p>
                    </div>
                    <button className="border border-amber-300 text-amber-900 hover:bg-amber-50 bg-transparent px-4 py-2 rounded-md">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                  </div>

                  {/* Rating and Verification */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 fill-amber-500 text-amber-500" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-2xl font-bold text-amber-900">{rating}</span>
                      <span className="text-amber-700">({reviewsCount} reviews)</span>
                    </div>
                    {artist.verified && (
                      <div className="bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                        <span className="text-green-700 text-sm font-semibold">Verified Artist</span>
                      </div>
                    )}
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="p-4 border border-amber-100 rounded-lg bg-white text-center">
                      <svg className="w-6 h-6 text-amber-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      <p className="text-2xl font-bold text-amber-900">{artist.experience ?? '-'}</p>
                      <p className="text-sm text-amber-700">Years Experience</p>
                    </div>
                    <div className="p-4 border border-amber-100 rounded-lg bg-white text-center">
                      <svg className="w-6 h-6 text-amber-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <p className="text-2xl font-bold text-amber-900">{artist.students ?? '-'}</p>
                      <p className="text-sm text-amber-700">Students</p>
                    </div>
                    <div className="p-4 border border-amber-100 rounded-lg bg-white text-center">
                      <svg className="w-6 h-6 text-amber-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-2xl font-bold text-amber-900">₹{pricePerHour}</p>
                      <p className="text-sm text-amber-700">Per Hour</p>
                    </div>
                  </div>

                  {/* Location and Contact */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-amber-900">{artist.location}</span>
                    </div>
                  </div>

                  {/* About */}
                  <div className="p-6 border border-amber-100 rounded-lg bg-white">
                    <h2 className="text-xl font-bold text-amber-900 mb-3">About</h2>
                    <p className="text-amber-800 leading-relaxed">{artist.bio || artist.about || ''}</p>
                  </div>
                </div>
              </div>

              {/* Specialties */}
              <div className="p-6 border border-amber-100 rounded-lg bg-white mb-12">
                <h2 className="text-2xl font-bold text-amber-900 mb-4">Specialties</h2>
                <div className="flex flex-wrap gap-3">
                  {specialties.map((specialty) => (
                    <span key={specialty} className="bg-amber-100 text-amber-900 px-4 py-2 rounded-full font-medium">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tabs Navigation */}
              <div id="tabs-section" className="mb-12">
                <div className="flex justify-around border-b border-amber-200 mb-8">
                  <button
                    onClick={() => setActiveTab('gallery')}
                    className={`pb-4 px-6 font-semibold transition-all ${
                      activeTab === 'gallery'
                        ? 'border-b-2 border-yellow-500 text-amber-900'
                        : 'text-amber-600 hover:text-amber-900'
                    }`}
                  >
                    Artist's Gallery
                  </button>
                  <button
                    onClick={() => setActiveTab('testimonials')}
                    className={`pb-4 px-6 font-semibold transition-all ${
                      activeTab === 'testimonials'
                        ? 'border-b-2 border-yellow-500 text-amber-900'
                        : 'text-amber-600 hover:text-amber-900'
                    }`}
                  >
                    Testimonials
                  </button>
                  <button
                    onClick={() => setActiveTab('workshops')}
                    className={`pb-4 px-6 font-semibold transition-all ${
                      activeTab === 'workshops'
                        ? 'border-b-2 border-yellow-500 text-amber-900'
                        : 'text-amber-600 hover:text-amber-900'
                    }`}
                  >
                    Workshops
                  </button>
                </div>

                {/* Workshops Tab */}
                {activeTab === 'workshops' && (
                  <div>
                    <h2 className="text-2xl font-bold text-amber-900 mb-6">Upcoming Workshops</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {workshops.map((workshop) => (
                            <div key={workshop._id || workshop.id} className="p-6 border border-amber-100 rounded-lg bg-white hover:shadow-lg transition-shadow">
                              <h3 className="text-lg font-bold text-amber-900 mb-3">
                                <Link to={`/workshop/${workshop._id || workshop.id}`} className="hover:underline">{workshop.title}</Link>
                              </h3>
                          <div className="space-y-2 mb-4 text-sm text-amber-700">
                            <p>📅 {workshop.date ? new Date(workshop.date).toLocaleDateString() : '-'}</p>
                            <p>🕐 {workshop.time || '-'}</p>
                            <p>⏱️ {workshop.duration || '-'}</p>
                            <p>👥 {workshop.enrolled ?? 0} enrolled</p>
                          </div>
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-2xl font-bold text-amber-600">₹{workshop.price}</span>
                          </div>
                              <button
                                onClick={() => {
                                  try {
                                    const raw = localStorage.getItem('cart')
                                    const cart = raw ? JSON.parse(raw) : []
                                    const id = workshop._id || workshop.id
                                    const existing = cart.find((i) => i.id === id)
                                    if (existing) existing.quantity = (existing.quantity || 1) + 1
                                    else cart.push({ id, title: workshop.title, price: workshop.price || 0, quantity: 1, artist: artist?.name || '', image: artist?.thumbnailUrl || artist?.imageUrl || artist?.image || placeholderImage })
                                    localStorage.setItem('cart', JSON.stringify(cart))
                                  } catch (e) {
                                    console.warn('could not update cart', e)
                                  }
                                  navigate('/checkout')
                                }}
                                className="w-full bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
                                Enroll Now
                              </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Testimonials Tab */}
                {activeTab === 'testimonials' && (
                  <div>
                    <h2 className="text-2xl font-bold text-amber-900 mb-6">Student Testimonials</h2>
                    {testimonials.length === 0 ? (
                      <div className="text-center py-12">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No testimonials yet</h3>
                        <p className="text-gray-500">Be the first to leave a review after completing a workshop</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, idx) => {
                          const rating = Math.round(testimonial.rating || 0)
                          return (
                            <div key={idx} className="p-6 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                              <div className="flex items-center gap-1 mb-3">
                                {[...Array(5)].map((_, i) => (
                                  <svg 
                                    key={i} 
                                    className={`w-5 h-5 ${i < rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} 
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <p className="text-gray-700 mb-4 leading-relaxed">&ldquo;{testimonial.text}&rdquo;</p>
                              <div className="flex items-center justify-between">
                                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                                {testimonial.date && (
                                  <p className="text-xs text-gray-500">
                                    {new Date(testimonial.date).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Artist's Gallery Tab */}
                {activeTab === 'gallery' && (
                  <div>
                    <h2 className="text-2xl font-bold text-amber-900 mb-6">Artist's Gallery</h2>
                    {gallery.length === 0 ? (
                      <div className="text-center py-12 text-amber-700">
                        <p>No gallery items yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {gallery.map((item, idx) => (
                          <div key={item._id || idx} className="border border-amber-100 rounded-lg bg-white overflow-hidden hover:shadow-lg transition-shadow">
                            {item.type === 'video' ? (
                              <div className="relative">
                                <video 
                                  controls 
                                  className="w-full h-40 sm:h-48 md:h-56 object-cover bg-black"
                                  onError={(e) => { e.target.style.display = 'none' }}
                                >
                                  <source src={item.url} type="video/mp4" />
                                  Your browser does not support the video tag.
                                </video>
                              </div>
                            ) : (
                              <div className="relative cursor-pointer" onClick={() => handleImageClick(item.url)}>
                                <img 
                                  src={item.url} 
                                  alt={`Gallery item ${idx + 1}`} 
                                  loading="lazy" 
                                  onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage }} 
                                  className="w-full h-40 sm:h-48 md:h-56 object-cover hover:opacity-90 transition-opacity"
                                />
                              </div>
                            )}
                            {item.uploadedAt && (
                              <div className="p-3">
                                <p className="text-xs text-amber-600">
                                  {new Date(item.uploadedAt).toLocaleDateString()}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Image Lightbox Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-50"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative w-auto max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage}
              alt="Gallery view"
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Demo Session Booking Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowDemoModal(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-amber-100 px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-amber-900">Book Free Demo Session</h2>
                <p className="text-sm text-amber-700">with {artist?.name}</p>
              </div>
              <button
                onClick={() => setShowDemoModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleDemoSubmit} className="p-6">
              {/* Session Type Selection - Only show if artist offers both with content */}
              {(() => {
                const hasRecordedVideo = artist?.demoSessionSettings?.offersRecorded && artist?.demoSessionSettings?.recordedSessionUrl
                const hasLiveSlots = artist?.demoSessionSettings?.offersLive && artist?.demoSessionSettings?.liveSessionSlots && artist?.demoSessionSettings?.liveSessionSlots.length > 0
                return hasRecordedVideo && hasLiveSlots
              })() && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-amber-900 mb-3">Select Session Type *</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setDemoSessionType('live')}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        demoSessionType === 'live'
                          ? 'border-amber-600 bg-amber-50'
                          : 'border-gray-200 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-center justify-center mb-2">
                        <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="font-semibold text-amber-900">Live Online Session</p>
                      <p className="text-xs text-amber-700 mt-1">Schedule a real-time session</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDemoSessionType('recorded')}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        demoSessionType === 'recorded'
                          ? 'border-amber-600 bg-amber-50'
                          : 'border-gray-200 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-center justify-center mb-2">
                        <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="font-semibold text-amber-900">Recorded Session</p>
                      <p className="text-xs text-amber-700 mt-1">Watch at your convenience</p>
                    </button>
                  </div>
                </div>
              )}
              
              {/* Show single session type info if only one is offered */}
              {(() => {
                const hasRecordedVideo = artist?.demoSessionSettings?.offersRecorded && artist?.demoSessionSettings?.recordedSessionUrl
                const hasLiveSlots = artist?.demoSessionSettings?.offersLive && artist?.demoSessionSettings?.liveSessionSlots && artist?.demoSessionSettings?.liveSessionSlots.length > 0
                return hasLiveSlots && !hasRecordedVideo
              })() && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-amber-900">Live Online Session</p>
                      <p className="text-sm text-amber-700">This artist offers live demo sessions</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Show video player when recorded is selected (single or multiple options) */}
              {demoSessionType === 'recorded' && artist?.demoSessionSettings?.offersRecorded && artist?.demoSessionSettings?.recordedSessionUrl && (
                <div className="mb-6">
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-4">
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="flex-1">
                        <p className="font-semibold text-amber-900">Free Demo Session - Watch Now!</p>
                        <p className="text-sm text-amber-700">This pre-recorded demo is available for free</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Video Player */}
                  <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-lg mb-4">
                    <iframe
                      src={artist?.demoSessionSettings?.recordedSessionUrl?.replace('watch?v=', 'embed/')}
                      className="w-full h-full"
                      allowFullScreen
                      title="Demo Session Video"
                    />
                  </div>

                  {/* Close Button for Recorded Video */}
                  <button
                    type="button"
                    onClick={() => setShowDemoModal(false)}
                    className="w-full px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-semibold"
                  >
                    Close
                  </button>
                </div>
              )}

              {/* Only show form for live sessions */}
              {demoSessionType === 'live' && (
                <>
                  {/* Time Slot Selection for Live Sessions */}
                  <div className="mb-6">
                  <h3 className="text-lg font-semibold text-amber-900 mb-3">📅 Choose Your Session Time</h3>
                  <p className="text-sm text-amber-700 mb-4">Select an available time slot for your live demo session</p>
                  
                  {(() => {
                    console.log('=== DEMO BOOKING DEBUG ===')
                    console.log('Full Artist Data:', artist)
                    console.log('Demo Settings:', artist?.demoSessionSettings)
                    console.log('Live Session Slots:', artist?.demoSessionSettings?.liveSessionSlots)
                    console.log('Slots Type:', typeof artist?.demoSessionSettings?.liveSessionSlots)
                    console.log('Is Array:', Array.isArray(artist?.demoSessionSettings?.liveSessionSlots))
                    console.log('=========================')
                    return null
                  })()}
                  
                  {artist?.demoSessionSettings?.liveSessionSlots && Array.isArray(artist.demoSessionSettings.liveSessionSlots) && artist.demoSessionSettings.liveSessionSlots.length > 0 ? (
                    artist.demoSessionSettings.liveSessionSlots.filter(slot => slot.available && new Date(`${slot.date}T${slot.time}`) > new Date()).length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {artist.demoSessionSettings.liveSessionSlots
                          .filter(slot => slot.available && new Date(`${slot.date}T${slot.time}`) > new Date())
                          .map((slot, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => setSelectedSlot(slot)}
                              className={`p-4 border-2 rounded-lg text-left transition-all transform hover:scale-105 ${
                                selectedSlot?.date === slot.date && selectedSlot?.time === slot.time
                                  ? 'border-amber-600 bg-amber-50 shadow-lg'
                                  : 'border-amber-200 hover:border-amber-400 hover:shadow-md'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${
                                  selectedSlot?.date === slot.date && selectedSlot?.time === slot.time
                                    ? 'bg-amber-600'
                                    : 'bg-amber-100'
                                }`}>
                                  <svg className={`w-5 h-5 ${
                                    selectedSlot?.date === slot.date && selectedSlot?.time === slot.time
                                      ? 'text-white'
                                      : 'text-amber-600'
                                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-amber-900">
                                    {new Date(slot.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                  </p>
                                  <p className="text-sm text-amber-700 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {slot.time}
                                  </p>
                                </div>
                                {selectedSlot?.date === slot.date && selectedSlot?.time === slot.time && (
                                  <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                            </button>
                          ))}
                      </div>
                    ) : (
                      <div className="p-6 bg-amber-50 border-2 border-amber-200 rounded-lg text-center">
                        <svg className="w-12 h-12 text-amber-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="font-medium text-amber-900 mb-1">No upcoming time slots</p>
                        <p className="text-sm text-amber-700">All available slots have passed or been booked.</p>
                      </div>
                    )
                  ) : (
                    <div className="p-6 bg-red-50 border-2 border-red-200 rounded-lg text-center">
                      <svg className="w-12 h-12 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="font-medium text-red-900 mb-1">No time slots available</p>
                      <p className="text-sm text-red-700">The artist hasn't added any time slots yet.</p>
                    </div>
                  )}
                </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-amber-900 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={demoFormData.name}
                    onChange={handleDemoFormChange}
                    required
                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-amber-900 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={demoFormData.email}
                    onChange={handleDemoFormChange}
                    required
                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-amber-900 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={demoFormData.phone}
                  onChange={handleDemoFormChange}
                  required
                  className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="+91 1234567890"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-amber-900 mb-2">Art Interest</label>
                <input
                  type="text"
                  name="artInterest"
                  value={demoFormData.artInterest}
                  onChange={handleDemoFormChange}
                  className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="e.g., Watercolor painting, Portrait drawing"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-amber-900 mb-2">Message (Optional)</label>
                <textarea
                  name="message"
                  value={demoFormData.message}
                  onChange={handleDemoFormChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  placeholder="Any specific topics or questions you'd like to cover..."
                ></textarea>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowDemoModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-amber-300 text-amber-900 rounded-lg font-semibold hover:bg-amber-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={demoSubmitting}
                  className="flex-1 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {demoSubmitting ? 'Booking...' : 'Book Demo Session'}
                </button>
              </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default ArtistProfilePage

