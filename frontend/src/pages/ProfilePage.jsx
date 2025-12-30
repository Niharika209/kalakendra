import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import EnrolledWorkshopCard from '../components/EnrolledWorkshopCard'
import CompletedWorkshopCard from '../components/CompletedWorkshopCard'
import placeholderImage from '../assets/wave-background.svg'
import { uploadImage, updateLearnerProfileImage, deleteLearnerProfileImage } from '../services/uploadService'
import { API_BASE_URL } from '../config/api.js'

function ProfilePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout, updateUser } = useAuth()
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'enrolled')
  const [enrolledWorkshops, setEnrolledWorkshops] = useState([])
  const [completedWorkshops, setCompletedWorkshops] = useState([])
  const [demoBookings, setDemoBookings] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [uploading, setUploading] = useState(false)
  const [profileImage, setProfileImage] = useState(null)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [selectedWorkshop, setSelectedWorkshop] = useState(null)
  const [reviewData, setReviewData] = useState({ rating: 0, comment: '' })
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      if (user.role === 'artist') {
        navigate('/artist-dashboard')
        return
      }
      setEditName(user.name || '')
      setEditEmail(user.email || '')
      setProfileImage(user.profileImage || null)
    }
  }, [user, navigate])

  useEffect(() => {
    const loadWorkshops = () => {
      try {
        const userWorkshops = localStorage.getItem(`workshops_${user?.email}`)
        if (userWorkshops) {
          const workshops = JSON.parse(userWorkshops)
          setEnrolledWorkshops(workshops.filter(w => !w.completed))
          setCompletedWorkshops(workshops.filter(w => w.completed))
        } else {
          setEnrolledWorkshops([])
          setCompletedWorkshops([])
        }
      } catch (e) {
      }
    }

    const loadDemoBookings = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/demo-bookings/learner/${user.email}`)
        setDemoBookings(response.data)
      } catch (error) {
      }
    }

    if (user?.email) {
      loadWorkshops()
      loadDemoBookings()
    }
  }, [user])

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab)
      window.history.replaceState({}, document.title)
    }
  }, [location])

  const handleMarkComplete = (workshopId) => {
    try {
      const allWorkshops = [...enrolledWorkshops, ...completedWorkshops]
      const updatedWorkshops = allWorkshops.map(w => 
        w.id === workshopId ? { ...w, completed: true, completedDate: new Date().toISOString() } : w
      )
      localStorage.setItem(`workshops_${user.email}`, JSON.stringify(updatedWorkshops))
      setEnrolledWorkshops(updatedWorkshops.filter(w => !w.completed))
      setCompletedWorkshops(updatedWorkshops.filter(w => w.completed))
    } catch (e) {
    }
  }

  const handleSaveProfile = () => {
    if (!user) return
    const updated = { ...user, name: editName, email: editEmail }
    setIsEditing(false)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }
    
    try {
      setUploading(true)
      
      const uploadResult = await uploadImage(file)
      
      if (user.id || user._id) {
        const userId = user.id || user._id
        const result = await updateLearnerProfileImage(userId, uploadResult.url)
        setProfileImage(uploadResult.url)
        updateUser({ profileImage: uploadResult.url })
        alert('Profile image updated successfully!')
      } else {
        alert('Error: User ID not found')
      }
    } catch (error) {
      alert('Failed to upload image: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteProfileImage = async () => {
    if (!window.confirm('Are you sure you want to delete your profile picture?')) return
    
    try {
      setUploading(true)
      const userId = user.id || user._id
      
      await deleteLearnerProfileImage(userId)
      setProfileImage(null)
      updateUser({ profileImage: null })
      alert('Profile image deleted successfully!')
    } catch (error) {
      alert('Failed to delete image: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const handleOpenReviewModal = (workshop) => {
    setSelectedWorkshop(workshop)
    setReviewData({ rating: 0, comment: '' })
    setShowReviewModal(true)
  }

  const handleCloseReviewModal = () => {
    setShowReviewModal(false)
    setSelectedWorkshop(null)
    setReviewData({ rating: 0, comment: '' })
    setHoveredRating(0)
  }

  const handleSubmitReview = async () => {
    if (!reviewData.rating || !reviewData.comment.trim()) {
      alert('Please provide both a rating and a comment')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await axios.post(`${API_BASE_URL}/reviews`, {
        workshopId: selectedWorkshop.id,
        rating: reviewData.rating,
        comment: reviewData.comment,
        learnerName: user.name,
        learnerId: user._id || user.id
      })

      const userWorkshops = JSON.parse(localStorage.getItem(`workshops_${user.email}`) || '[]')
      const updatedWorkshops = userWorkshops.map(w => 
        w.id === selectedWorkshop.id ? { ...w, reviewed: true } : w
      )
      localStorage.setItem(`workshops_${user.email}`, JSON.stringify(updatedWorkshops))
      setCompletedWorkshops(updatedWorkshops.filter(w => w.completed))

      handleCloseReviewModal()
      alert('Thank you for your review!')
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to submit review. Please try again.'
      alert(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-amber-700">Loading profile...</p>
        </div>
      </>
    )
  }

  const initial = (user.name || 'U')[0].toUpperCase()

  return (
    <>
      <Navbar />
      
      {/* Review Modal */}
      {showReviewModal && selectedWorkshop && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 animate-scale-in">
            <div className="sticky top-0 bg-linear-to-r from-amber-500 to-orange-500 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white">Write a Review</h2>
              <button 
                onClick={handleCloseReviewModal}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{selectedWorkshop.title}</h3>
                <p className="text-gray-600">By {selectedWorkshop.artist}</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  How would you rate this workshop?
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewData({ ...reviewData, rating: star })}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-all duration-200 transform hover:scale-110 focus:outline-none"
                    >
                      <svg 
                        className={`w-10 h-10 transition-all duration-200 ${
                          star <= (hoveredRating || reviewData.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-none text-gray-300'
                        }`}
                        stroke="currentColor"
                        strokeWidth={1.5}
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </button>
                  ))}
                  {reviewData.rating > 0 && (
                    <span className="ml-3 text-lg font-semibold text-gray-700 animate-fade-in">
                      {reviewData.rating === 5 ? 'Excellent!' : 
                       reviewData.rating === 4 ? 'Great!' : 
                       reviewData.rating === 3 ? 'Good' : 
                       reviewData.rating === 2 ? 'Fair' : 'Poor'}
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Share your experience
                </label>
                <textarea
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                  placeholder="Tell us what you liked about this workshop, what you learned, and how it helped you..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 resize-none"
                />
                <p className="mt-2 text-sm text-gray-500">
                  {reviewData.comment.length} / 500 characters
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCloseReviewModal}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReview}
                  disabled={!reviewData.rating || !reviewData.comment.trim() || isSubmitting}
                  className="flex-1 px-6 py-3 bg-linear-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="min-h-screen bg-linear-to-br from-amber-50 via-yellow-50 to-orange-50">
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 transform transition-all duration-300 hover:shadow-2xl">
            <div className="h-32 bg-linear-to-r from-amber-400 via-yellow-400 to-orange-400"></div>
            <div className="px-8 pb-8">
              <div className="flex items-end gap-6 -mt-16">
                <div className="relative">
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt={user.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-amber-600 text-white flex items-center justify-center text-5xl font-bold border-4 border-white shadow-xl">
                      {initial}
                    </div>
                  )}
                  {isEditing && (
                    <>
                      <label className="absolute bottom-0 left-0 w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-amber-700 transition-colors">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </label>
                      {profileImage && (
                        <button
                          onClick={handleDeleteProfileImage}
                          disabled={uploading}
                          className="absolute bottom-0 right-0 w-10 h-10 bg-red-600 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                          title="Delete profile picture"
                        >
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                <div className="flex-1 pt-20">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-amber-900 mb-1">{user.name}</h1>
                      <p className="text-amber-700 mb-2">{user.email}</p>
                      <span className="inline-block px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-sm font-medium">
                        {user.role === 'artist' ? '🎨 Artist' : '🎓 Learner'}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="group px-6 py-2.5 bg-white border-2 border-amber-200 text-amber-900 rounded-xl font-medium hover:bg-amber-50 hover:border-amber-300 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
                      >
                        <svg className="w-5 h-5 text-amber-600 group-hover:text-amber-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                      </button>
                      <button
                        onClick={handleLogout}
                        className="group px-6 py-2.5 bg-linear-to-r from-red-500 to-rose-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-rose-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Form */}
              {isEditing && (
                <div className="mt-6 p-6 bg-amber-50 rounded-xl border border-amber-200 animate-fade-in">
                  <h3 className="text-lg font-semibold text-amber-900 mb-4">Edit Your Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold text-amber-900 mb-2">Name</label>
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-amber-900 mb-2">Email</label>
                      <input
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        type="email"
                        className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleSaveProfile}
                    className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-200 transform hover:scale-105"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-md border border-amber-100 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-900">{enrolledWorkshops.length + demoBookings.length}</p>
                  <p className="text-sm text-amber-700">Enrolled Items</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-amber-100 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-900">{completedWorkshops.length}</p>
                  <p className="text-sm text-amber-700">Completed</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-amber-100 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-900">{enrolledWorkshops.length + demoBookings.length}</p>
                  <p className="text-sm text-amber-700">In Progress</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex gap-4 border-b border-amber-200 mb-6">
              <button
                onClick={() => setActiveTab('enrolled')}
                className={`pb-3 px-4 font-semibold transition-all duration-200 ${
                  activeTab === 'enrolled'
                    ? 'border-b-2 border-amber-600 text-amber-900'
                    : 'text-amber-600 hover:text-amber-900'
                }`}
              >
                Enrolled ({enrolledWorkshops.length + demoBookings.length})
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`pb-3 px-4 font-semibold transition-all duration-200 ${
                  activeTab === 'completed'
                    ? 'border-b-2 border-amber-600 text-amber-900'
                    : 'text-amber-600 hover:text-amber-900'
                }`}
              >
                Completed ({completedWorkshops.length})
              </button>
              <button
                onClick={() => setActiveTab('wishlist')}
                className={`pb-3 px-4 font-semibold transition-all duration-200 ${
                  activeTab === 'wishlist'
                    ? 'border-b-2 border-amber-600 text-amber-900'
                    : 'text-amber-600 hover:text-amber-900'
                }`}
              >
                Wishlist
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`pb-3 px-4 font-semibold transition-all duration-200 ${
                  activeTab === 'settings'
                    ? 'border-b-2 border-amber-600 text-amber-900'
                    : 'text-amber-600 hover:text-amber-900'
                }`}
              >
                Settings
              </button>
            </div>

            {/* Enrolled Workshops Tab */}
            {activeTab === 'enrolled' && (
              <div className="animate-fade-in">
                {enrolledWorkshops.length === 0 && demoBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-amber-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <h3 className="text-xl font-semibold text-amber-900 mb-2">No enrolled workshops or demo sessions</h3>
                    <p className="text-amber-700 mb-4">Start learning by enrolling in a workshop or booking a demo session</p>
                    <Link to="/workshops" className="inline-block px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-200 transform hover:scale-105">
                      Explore Workshops
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Demo Bookings Section */}
                    {demoBookings.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-purple-900 mb-3">Demo Sessions ({demoBookings.length})</h3>
                        <div className="space-y-4">
                          {demoBookings.map((booking) => (
                            <div key={booking._id} className="bg-white rounded-lg border-2 border-purple-200 p-4 hover:shadow-lg transition-all duration-200">
                              <div className="flex items-start gap-4">
                                <img
                                  src={booking.artistId?.profileImage || placeholderImage}
                                  alt={booking.artistId?.name}
                                  className="w-20 h-20 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h4 className="font-semibold text-purple-900">Demo Session with {booking.artistId?.name}</h4>
                                      <p className="text-sm text-purple-600 capitalize">{booking.artistId?.category}</p>
                                    </div>
                                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                      {booking.status}
                                    </span>
                                  </div>
                                  {booking.selectedSlot && (
                                    <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600">
                                      <div className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {new Date(booking.selectedSlot.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {booking.selectedSlot.time}
                                      </div>
                                    </div>
                                  )}
                                  {booking.artInterest && (
                                    <p className="mt-2 text-sm text-gray-600">
                                      <span className="font-medium">Interest:</span> {booking.artInterest}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Enrolled Workshops Section */}
                    {enrolledWorkshops.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-amber-900 mb-3">Workshops ({enrolledWorkshops.length})</h3>
                        <div className="space-y-4">
                          {enrolledWorkshops.map((workshop, idx) => (
                            <EnrolledWorkshopCard key={idx} workshop={workshop} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Completed Workshops Tab */}
            {activeTab === 'completed' && (
              <div className="animate-fade-in">
                {completedWorkshops.length === 0 ? (
                  <div className="text-center py-16 px-4">
                    <div className="max-w-md mx-auto">
                      <div className="w-24 h-24 mx-auto mb-6 bg-linear-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center animate-bounce">
                        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-amber-900 mb-3">No Completed Workshops Yet</h3>
                      <p className="text-amber-700 mb-6 leading-relaxed">Complete your enrolled workshops to unlock achievements and see them here!</p>
                      <Link to="/profile" onClick={() => setActiveTab('enrolled')} className="inline-flex items-center gap-2 px-8 py-3 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        View Enrolled Workshops
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {completedWorkshops.map((workshop, idx) => (
                      <CompletedWorkshopCard 
                        key={idx} 
                        workshop={workshop}
                        onReviewClick={handleOpenReviewModal}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="text-center py-12 animate-fade-in">
                <svg className="w-16 h-16 text-amber-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-amber-900 mb-2">Your wishlist is empty</h3>
                <p className="text-amber-700">Save workshops you're interested in for later</p>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="animate-fade-in space-y-6">
                <div className="p-6 border border-amber-100 rounded-xl">
                  <h3 className="text-lg font-semibold text-amber-900 mb-4">Account Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-amber-100">
                      <div>
                        <p className="font-medium text-amber-900">Email Notifications</p>
                        <p className="text-sm text-amber-700">Receive updates about your workshops</p>
                      </div>
                      <input type="checkbox" className="w-5 h-5 text-amber-600" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-amber-100">
                      <div>
                        <p className="font-medium text-amber-900">Workshop Reminders</p>
                        <p className="text-sm text-amber-700">Get notified before workshops start</p>
                      </div>
                      <input type="checkbox" className="w-5 h-5 text-amber-600" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-amber-900">Marketing Emails</p>
                        <p className="text-sm text-amber-700">Special offers and new workshops</p>
                      </div>
                      <input type="checkbox" className="w-5 h-5 text-amber-600" />
                    </div>
                  </div>
                </div>

                <div className="p-6 border border-red-200 rounded-xl bg-red-50">
                  <h3 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h3>
                  <button
                    onClick={handleLogout}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}

export default ProfilePage
