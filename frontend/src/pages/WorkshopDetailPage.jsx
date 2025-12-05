import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import placeholderImage from '../assets/wave-background.svg'

function WorkshopDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [workshop, setWorkshop] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [enrolledWorkshop, setEnrolledWorkshop] = useState(null)
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

  // Check if user is already enrolled in this workshop
  useEffect(() => {
    if (user?.email && id) {
      try {
        const userWorkshops = localStorage.getItem(`workshops_${user.email}`)
        if (userWorkshops) {
          const workshops = JSON.parse(userWorkshops)
          const enrolled = workshops.find(w => w.id === id || w.id === workshop?._id)
          setEnrolledWorkshop(enrolled || null)
        }
      } catch (e) {
        console.error('Error checking enrollment:', e)
      }
    }
  }, [user, id, workshop])

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

  const handleMarkComplete = () => {
    if (!user?.email || !enrolledWorkshop) return
    
    try {
      const userWorkshops = localStorage.getItem(`workshops_${user.email}`)
      if (userWorkshops) {
        const workshops = JSON.parse(userWorkshops)
        const updated = workshops.map(w => 
          (w.id === id || w.id === workshop?._id) 
            ? { ...w, completed: true, completedDate: new Date().toISOString() } 
            : w
        )
        localStorage.setItem(`workshops_${user.email}`, JSON.stringify(updated))
        alert('🎉 Workshop marked as complete! Redirecting to your profile...')
        navigate('/profile', { state: { tab: 'completed' } })
      }
    } catch (e) {
      console.error('Error marking complete:', e)
      alert('Failed to mark workshop as complete. Please try again.')
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

  if (loading) return (
    <>
      <Navbar />
      <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-amber-900 font-semibold">Loading workshop details...</p>
        </div>
      </div>
    </>
  )
  
  if (error) return (
    <>
      <Navbar />
      <div className="min-h-screen bg-linear-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-900 mb-2">Oops!</h2>
          <p className="text-red-700 mb-6">{error}</p>
          <button onClick={() => navigate(-1)} className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300">
            Go Back
          </button>
        </div>
      </div>
    </>
  )
  
  if (!workshop) return (
    <>
      <Navbar />
      <div className="min-h-screen bg-linear-to-br from-amber-50 to-orange-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-amber-900 mb-2">Workshop Not Found</h2>
          <p className="text-amber-700 mb-6">The workshop you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate('/workshops')} className="px-6 py-3 bg-linear-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300">
            Browse Workshops
          </button>
        </div>
      </div>
    </>
  )

  const artist = workshop.artist || {}

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-yellow-50">
        {/* Hero Section with Image */}
        <div className="relative h-96 overflow-hidden">
          <img 
            src={workshop.thumbnailUrl || workshop.imageUrl || placeholderImage} 
            alt={workshop.title} 
            loading="lazy" 
            onError={(e)=>{e.target.onerror=null; e.target.src=placeholderImage}} 
            onClick={() => handleImageClick(workshop.imageUrl || workshop.thumbnailUrl || placeholderImage)}
            className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"></div>
          
          {/* Title Overlay on Image */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-3 mb-3">
                {workshop.category && (
                  <span className="px-4 py-1.5 bg-purple-500/90 backdrop-blur-sm text-white rounded-full text-sm font-semibold">
                    {workshop.category}
                  </span>
                )}
                {workshop.subcategory && (
                  <span className="px-4 py-1.5 bg-blue-500/90 backdrop-blur-sm text-white rounded-full text-sm font-semibold">
                    {workshop.subcategory}
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">{workshop.title}</h1>
              <div className="flex items-center gap-3 text-white/90">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold shadow-lg">
                  {artist.name?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                <p className="text-lg font-medium">
                  {artist.name ? <Link to={`/artists/${artist.slug || artist._id}`} className="hover:text-amber-300 transition-colors">{artist.name}</Link> : (workshop.artistName || 'Unknown Artist')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* About Section */}
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-amber-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-linear-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-amber-900">About this workshop</h2>
                </div>
                <p className="text-amber-800 leading-relaxed text-lg">{workshop.description || 'No description provided.'}</p>
              </div>

              {workshop.whatYouWillLearn && (
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-amber-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-linear-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-amber-900">What You'll Learn</h2>
                  </div>
                  <p className="text-amber-800 leading-relaxed whitespace-pre-line text-lg">{workshop.whatYouWillLearn}</p>
                </div>
              )}

              {workshop.requirements && (
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-amber-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-amber-900">Requirements</h2>
                  </div>
                  <p className="text-amber-800 leading-relaxed whitespace-pre-line text-lg">{workshop.requirements}</p>
                </div>
              )}

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-amber-100 hover:shadow-xl hover:border-amber-300 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-amber-900 text-lg">Schedule</h3>
                  </div>
                  <p className="text-amber-800 font-semibold mb-1">{workshop.date ? new Date(workshop.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Date TBA'}</p>
                  <p className="text-amber-700">{workshop.time || 'Time TBA'}</p>
                </div>

                <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-amber-100 hover:shadow-xl hover:border-amber-300 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-amber-900 text-lg">Duration</h3>
                  </div>
                  <p className="text-amber-800 font-semibold text-xl">{workshop.duration || 'TBA'}</p>
                </div>

                <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-amber-100 hover:shadow-xl hover:border-amber-300 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-linear-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-amber-900 text-lg">Mode & Location</h3>
                  </div>
                  <span className="inline-block px-4 py-1.5 bg-linear-to-r from-amber-100 to-orange-100 text-amber-900 rounded-full text-sm font-bold mb-2">
                    {workshop.mode || 'Online'}
                  </span>
                  <p className="text-amber-800">{workshop.location || (workshop.mode === 'Online' ? 'Online Platform' : 'Location TBA')}</p>
                </div>

                <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-amber-100 hover:shadow-xl hover:border-amber-300 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-linear-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-amber-900 text-lg">Target Audience</h3>
                  </div>
                  <p className="text-amber-800 font-semibold">{workshop.targetAudience || 'All Levels'}</p>
                  {workshop.maxParticipants && (
                    <p className="text-amber-600 text-sm mt-2 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Max {workshop.maxParticipants} participants
                    </p>
                  )}
                </div>
              </div>

              {/* Includes Section */}
              {(workshop.materialProvided || workshop.certificateProvided) && (
                <div className="bg-linear-to-br from-amber-100 to-orange-100 p-8 rounded-2xl shadow-lg border border-amber-200">
                  <h3 className="font-bold text-amber-900 text-2xl mb-4">What's Included</h3>
                  <div className="space-y-3">
                    {workshop.materialProvided && (
                      <div className="flex items-center gap-3 text-amber-900 bg-white/60 backdrop-blur-sm p-4 rounded-xl">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center shrink-0">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="font-semibold">Materials Provided</span>
                      </div>
                    )}
                    {workshop.certificateProvided && (
                      <div className="flex items-center gap-3 text-amber-900 bg-white/60 backdrop-blur-sm p-4 rounded-xl">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center shrink-0">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="font-semibold">Certificate of Completion</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Pricing & Actions */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-amber-200">
                {/* Price */}
                <div className="mb-6 pb-6 border-b border-amber-100">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-bold bg-linear-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">₹{workshop.price || 0}</span>
                  </div>
                  <div className="flex items-center gap-2 text-amber-700 text-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="font-semibold">{workshop.enrolled ?? 0} students enrolled</span>
                  </div>
                  {workshop.maxParticipants && (
                    <div className="mt-2 text-amber-600 text-sm flex items-center gap-2">
                      <div className="flex-1 bg-amber-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-linear-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500" 
                          style={{width: `${Math.min(((workshop.enrolled ?? 0) / workshop.maxParticipants) * 100, 100)}%`}}
                        ></div>
                      </div>
                      <span className="text-xs font-semibold">{workshop.maxParticipants - (workshop.enrolled ?? 0)} spots left</span>
                    </div>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-3">
                  {enrolledWorkshop ? (
                    <>
                      {enrolledWorkshop.completed ? (
                        <div className="w-full bg-linear-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-xl font-bold text-center shadow-lg flex items-center justify-center gap-2">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Workshop Completed
                        </div>
                      ) : (
                        <button 
                          onClick={handleMarkComplete}
                          className="w-full bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Mark as Complete
                        </button>
                      )}
                      {!enrolledWorkshop.completed && (
                        <div className="text-center bg-linear-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
                          <div className="flex items-center justify-center gap-2 text-amber-900 font-semibold">
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            You're Enrolled
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <button 
                      onClick={() => addToCart(workshop)} 
                      className="w-full bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-6 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                    >
                      <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Enroll Now
                    </button>
                  )}
                  
                  <button 
                    onClick={() => navigate(-1)} 
                    className="w-full border-2 border-amber-300 hover:bg-amber-50 text-amber-900 px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Go Back
                  </button>
                </div>

                {/* Additional Info */}
                <div className="mt-6 pt-6 border-t border-amber-100 space-y-3 text-sm">
                  <div className="flex items-start gap-3 text-amber-700">
                    <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Secure payment processing</span>
                  </div>
                  <div className="flex items-start gap-3 text-amber-700">
                    <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Instant enrollment confirmation</span>
                  </div>
                </div>
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
