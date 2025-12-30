import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import Navbar from '../components/Navbar'
import placeholderImage from '../assets/wave-background.svg'
import { 
  uploadImage, 
  uploadMultipleImages,
  updateArtistProfileImage,
  deleteArtistProfileImage, 
  addToArtistGallery,
  removeFromArtistGallery 
} from '../services/uploadService'
import { API_BASE_URL } from '../config/api.js'

const API_URL = API_BASE_URL

function ArtistProfileDashboard() {
  const navigate = useNavigate()
  const { user, logout, accessToken, updateUser } = useAuth()
  const [activeTab, setActiveTab] = useState('workshops')
  const [myWorkshops, setMyWorkshops] = useState([])
  const [artistData, setArtistData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editBio, setEditBio] = useState('')
  const [editSpeciality, setEditSpeciality] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [demoSettings, setDemoSettings] = useState({
    enabled: false,
    offersLive: false,
    offersRecorded: false,
    recordedSessionUrl: '',
    demoDescription: '',
    liveSessionSlots: []
  })
  const [uploadingRecording, setUploadingRecording] = useState(false)
  const [newSlotDate, setNewSlotDate] = useState('')
  const [newSlotTime, setNewSlotTime] = useState('')
  const [demoBookings, setDemoBookings] = useState([])
  const [loadingBookings, setLoadingBookings] = useState(false)

  useEffect(() => {
    if (user) {
      if (user.role !== 'artist') {
        navigate('/profile') 
        return
      }
      setEditName(user.name || '')
      setEditEmail(user.email || '')
      setEditBio(user.bio || '')
      setEditSpeciality(user.speciality || '')
    }
  }, [user, navigate])

  useEffect(() => {
    if (!user) return
    
    const fetchArtistData = async () => {
      try {
        setLoading(true)
        const artistResponse = await axios.get(`${API_URL}/artists/email/${user.email}`)
        const artist = artistResponse.data
        setArtistData(artist)
        
        if (artist.demoSessionSettings) {
          setDemoSettings({
            enabled: artist.demoSessionSettings.enabled || false,
            offersLive: artist.demoSessionSettings.offersLive || false,
            offersRecorded: artist.demoSessionSettings.offersRecorded || false,
            recordedSessionUrl: artist.demoSessionSettings.recordedSessionUrl || '',
            demoDescription: artist.demoSessionSettings.demoDescription || '',
            liveSessionSlots: artist.demoSessionSettings.liveSessionSlots || []
          })
        }
        
        const workshopsResponse = await axios.get(`${API_URL}/workshops/artist/${artist._id}`)
        setMyWorkshops(workshopsResponse.data)
      } catch (error) {
        console.error('Error fetching artist data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchArtistData()
  }, [user])

  useEffect(() => {
    if (activeTab === 'demoSessions' && artistData?._id) {
      fetchDemoBookings()
    }
  }, [activeTab, artistData])

  useEffect(() => {
    if (activeTab === 'workshops' && artistData?._id) {
      fetchWorkshops()
    }
  }, [activeTab, artistData])

  const fetchWorkshops = async () => {
    if (!artistData?._id) return
    
    try {
      const response = await axios.get(`${API_URL}/workshops/artist/${artistData._id}`)
      setMyWorkshops(response.data)
    } catch (error) {
      console.error('Error fetching workshops:', error)
    }
  }

  const fetchDemoBookings = async () => {
    if (!artistData?._id) return
    
    try {
      setLoadingBookings(true)
      const response = await axios.get(`${API_URL}/demo-bookings/artist/${artistData._id}`)
      setDemoBookings(response.data)
    } catch (error) {
      console.error('Error fetching demo bookings:', error)
    } finally {
      setLoadingBookings(false)
    }
  }

  const handleSaveProfile = () => {
    if (!user) return
    const updated = { 
      ...user, 
      name: editName, 
      email: editEmail,
      bio: editBio,
      speciality: editSpeciality 
    }
    setIsEditing(false)
  }

  const handleDeleteWorkshop = async (workshopId) => {
    if (!window.confirm('Are you sure you want to delete this workshop?')) return
    
    try {
      await axios.delete(`${API_URL}/workshops/${workshopId}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      })
      setMyWorkshops(myWorkshops.filter(w => w._id !== workshopId))
    } catch (error) {
      console.error('Error deleting workshop:', error)
      alert('Failed to delete workshop')
    }
  }

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

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
      
      if (artistData?._id) {
        await updateArtistProfileImage(artistData._id, uploadResult.url)
        setArtistData({ ...artistData, imageUrl: uploadResult.url })
        updateUser({ imageUrl: uploadResult.url })
        alert('Profile image updated successfully!')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteProfileImage = async () => {
    if (!window.confirm('Are you sure you want to delete your profile picture?')) return
    
    try {
      setUploading(true)
      
      if (artistData?._id) {
        await deleteArtistProfileImage(artistData._id)
        setArtistData({ ...artistData, imageUrl: null, thumbnailUrl: null })
        updateUser({ imageUrl: null })
        alert('Profile image deleted successfully!')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete image: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    if (files.length > 10) {
      alert('You can upload maximum 10 files at once')
      return
    }

    const invalidFiles = files.filter(f => !f.type.startsWith('image/') && !f.type.startsWith('video/'))
    if (invalidFiles.length > 0) {
      alert('Please select only image or video files')
      return
    }

    try {
      setUploadingGallery(true)
      const uploadResult = await uploadMultipleImages(files)
      
      if (artistData?._id) {
        const mediaItems = uploadResult.files.map((f, idx) => ({
          url: f.url,
          type: files[idx].type.startsWith('video/') ? 'video' : 'image'
        }))
        
        const result = await addToArtistGallery(artistData._id, mediaItems)
        
        setArtistData({ ...artistData, gallery: result.gallery })
        const imageCount = mediaItems.filter(m => m.type === 'image').length
        const videoCount = mediaItems.filter(m => m.type === 'video').length
        alert(`Added ${imageCount} image(s) and ${videoCount} video(s) to gallery!`)
      }
    } catch (error) {
      console.error('Gallery upload error:', error)
      alert('Failed to upload gallery images: ' + error.message)
    } finally {
      setUploadingGallery(false)
    }
  }

  const handleRemoveGalleryImage = async (imageUrl) => {
    if (!window.confirm('Remove this image from gallery?')) return

    try {
      if (artistData?._id) {
        const result = await removeFromArtistGallery(artistData._id, imageUrl)
        setArtistData({ ...artistData, gallery: result.gallery })
        alert('Image removed from gallery')
      }
    } catch (error) {
      console.error('Remove gallery image error:', error)
      alert('Failed to remove image: ' + error.message)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl)
    setShowImageModal(true)
  }

  const closeModal = () => {
    setShowImageModal(false)
    setSelectedImage(null)
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

  const initial = (user.name || 'A')[0].toUpperCase()
  const totalRevenue = myWorkshops.reduce((sum, w) => sum + (w.enrolled || 0) * parseFloat(w.price || 0), 0)
  const totalEnrollments = myWorkshops.reduce((sum, w) => sum + (w.enrolled || 0), 0)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Artist Profile Header */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 transform transition-all duration-300 hover:shadow-2xl">
            <div className="h-32 bg-linear-to-r from-purple-400 via-pink-400 to-amber-400"></div>
            <div className="px-8 pb-8">
              <div className="flex items-end gap-6 -mt-16">
                <div className="relative">
                  {artistData?.imageUrl ? (
                    <img 
                      src={artistData.imageUrl} 
                      alt={user.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-purple-600 text-white flex items-center justify-center text-5xl font-bold border-4 border-white shadow-xl">
                      {initial}
                    </div>
                  )}
                  {isEditing && (
                    <>
                      <label className="absolute bottom-0 left-0 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-purple-700 transition-colors">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleProfileImageUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </label>
                      {artistData?.imageUrl && (
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
                      <div className="flex gap-2 items-center mb-2">
                        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-900 rounded-full text-sm font-medium">
                          Artist
                        </span>
                        {user.speciality && (
                          <span className="inline-block px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-sm">
                            {user.speciality}
                          </span>
                        )}
                      </div>
                      {user.bio && (
                        <p className="text-amber-600 text-sm max-w-2xl">{user.bio}</p>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="px-4 py-2 border border-purple-300 text-purple-900 rounded-lg hover:bg-purple-50 transition-all duration-200"
                      >
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                      </button>
                      <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <div className="mt-6 p-6 bg-purple-50 rounded-xl border border-purple-200 animate-fade-in">
                  <h3 className="text-lg font-semibold text-purple-900 mb-4">Edit Your Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold text-purple-900 mb-2">Name</label>
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-purple-900 mb-2">Email</label>
                      <input
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        type="email"
                        className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-purple-900 mb-2">Speciality</label>
                      <input
                        value={editSpeciality}
                        onChange={(e) => setEditSpeciality(e.target.value)}
                        placeholder="e.g., Watercolor Artist, Sculptor"
                        className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-purple-900 mb-2">Bio</label>
                      <textarea
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        rows={3}
                        placeholder="Tell us about yourself and your artistic journey..."
                        className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleSaveProfile}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 transform hover:scale-105"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-md border border-purple-100 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-900">{myWorkshops.length}</p>
                  <p className="text-sm text-purple-700">Workshops</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-purple-100 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-900">{totalEnrollments}</p>
                  <p className="text-sm text-purple-700">Total Students</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-purple-100 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-900">₹{totalRevenue.toLocaleString()}</p>
                  <p className="text-sm text-purple-700">Total Revenue</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-purple-100 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-900">
                    {artistData?.rating ? Number(artistData.rating).toFixed(1) : '0.0'}
                  </p>
                  <p className="text-sm text-purple-700">Avg Rating</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex gap-4 border-b border-purple-200 mb-6">
              <button
                onClick={() => setActiveTab('workshops')}
                className={`pb-3 px-4 font-semibold transition-all duration-200 ${
                  activeTab === 'workshops'
                    ? 'border-b-2 border-purple-600 text-purple-900'
                    : 'text-purple-600 hover:text-purple-900'
                }`}
              >
                My Workshops ({myWorkshops.length})
              </button>
              <button
                onClick={() => setActiveTab('gallery')}
                className={`pb-3 px-4 font-semibold transition-all duration-200 ${
                  activeTab === 'gallery'
                    ? 'border-b-2 border-purple-600 text-purple-900'
                    : 'text-purple-600 hover:text-purple-900'
                }`}
              >
                Gallery ({artistData?.gallery?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('demoSessions')}
                className={`pb-3 px-4 font-semibold transition-all duration-200 ${
                  activeTab === 'demoSessions'
                    ? 'border-b-2 border-purple-600 text-purple-900'
                    : 'text-purple-600 hover:text-purple-900'
                }`}
              >
                Demo Sessions
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`pb-3 px-4 font-semibold transition-all duration-200 ${
                  activeTab === 'analytics'
                    ? 'border-b-2 border-purple-600 text-purple-900'
                    : 'text-purple-600 hover:text-purple-900'
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`pb-3 px-4 font-semibold transition-all duration-200 ${
                  activeTab === 'settings'
                    ? 'border-b-2 border-purple-600 text-purple-900'
                    : 'text-purple-600 hover:text-purple-900'
                }`}
              >
                Settings
              </button>
            </div>

            {/* My Workshops Tab */}
            {activeTab === 'workshops' && (
              <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-purple-900">Your Workshops</h2>
                  <Link
                    to="/create-workshop"
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Workshop
                  </Link>
                </div>

                {/* Workshops List */}
                {myWorkshops.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-purple-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <h3 className="text-xl font-semibold text-purple-900 mb-2">No workshops yet</h3>
                    <p className="text-purple-700">Create your first workshop to start teaching</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myWorkshops.map((workshop) => (
                      <div key={workshop._id} className="border border-purple-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="h-40 bg-linear-to-br from-purple-200 to-pink-200 flex items-center justify-center overflow-hidden">
                          {workshop.thumbnailUrl || workshop.imageUrl ? (
                            <img 
                              src={workshop.thumbnailUrl || workshop.imageUrl} 
                              alt={workshop.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none'
                                e.target.parentElement.innerHTML = '<span class="text-5xl">🎨</span>'
                              }}
                            />
                          ) : (
                            <span className="text-5xl">🎨</span>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-purple-900 mb-2">{workshop.title}</h3>
                          <p className="text-sm text-purple-700 mb-2 line-clamp-2">{workshop.description}</p>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-lg font-bold text-purple-900">₹{workshop.price}</span>
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              <span className="text-sm font-semibold text-purple-600">{workshop.enrolled || 0} enrolled</span>
                            </div>
                          </div>
                          {workshop.revenue > 0 && (
                            <div className="mb-3 flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-sm font-semibold text-green-700">Revenue: ₹{workshop.revenue?.toLocaleString('en-IN') || 0}</span>
                            </div>
                          )}
                          <div className="flex gap-2 text-xs text-purple-600 mb-3">
                            <span className="px-2 py-1 bg-purple-50 rounded">{workshop.mode}</span>
                            <span className="px-2 py-1 bg-purple-50 rounded">{workshop.duration}</span>
                          </div>
                          <div className="flex gap-2">
                            <button className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-all duration-200">
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteWorkshop(workshop._id)}
                              className="px-3 py-2 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50 transition-all duration-200"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Gallery Tab */}
            {activeTab === 'gallery' && (
              <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-purple-900">Your Gallery</h2>
                  <label className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 transform hover:scale-105 cursor-pointer flex items-center gap-2">
                    <input 
                      type="file" 
                      accept="image/*,video/*" 
                      multiple
                      onChange={handleGalleryUpload}
                      className="hidden"
                      disabled={uploadingGallery}
                    />
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {uploadingGallery ? 'Uploading...' : 'Add Media'}
                  </label>
                </div>

                {!artistData?.gallery || artistData.gallery.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-purple-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-purple-900 mb-2">No gallery media yet</h3>
                    <p className="text-purple-700">Add images and videos to showcase your work</p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-purple-700 mb-4">Gallery has {artistData.gallery.length} items</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {artistData.gallery.map((mediaItem, idx) => {
                        const isVideo = typeof mediaItem === 'object' && mediaItem.type === 'video'
                        const mediaUrl = typeof mediaItem === 'object' ? mediaItem.url : mediaItem
                        
                        return (
                          <div key={idx} className="relative group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-purple-200 bg-white">
                            {isVideo ? (
                              <video 
                                src={mediaUrl} 
                                className="w-full h-48 object-cover"
                                controls
                                preload="metadata"
                              />
                            ) : (
                              <img 
                                src={mediaUrl} 
                                alt={`Gallery ${idx + 1}`}
                                onClick={() => handleImageClick(mediaUrl)}
                                className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                              />
                            )}
                            <button
                              onClick={() => handleRemoveGalleryImage(mediaUrl)}
                              className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Remove media"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Demo Sessions Tab */}
            {activeTab === 'demoSessions' && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-bold text-purple-900 mb-6">Demo Session Settings</h2>
                
                <div className="space-y-6">
                  {/* Enable Demo Sessions */}
                  <div className="p-6 border border-purple-100 rounded-xl bg-purple-50">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-purple-900 mb-1">Enable Demo Sessions</h3>
                        <p className="text-sm text-purple-700">Allow learners to book free demo sessions</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={demoSettings.enabled}
                          onChange={(e) => setDemoSettings({...demoSettings, enabled: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    {demoSettings.enabled && (
                      <div className="space-y-4 mt-6 pt-6 border-t border-purple-200">
                        {/* Session Type Selection */}
                        <div>
                          <h4 className="font-semibold text-purple-900 mb-3">What type of demo sessions do you offer?</h4>
                          <div className="space-y-2">
                            <label className="flex items-center gap-3 p-3 border border-purple-200 rounded-lg hover:bg-white cursor-pointer">
                              <input
                                type="checkbox"
                                checked={demoSettings.offersLive}
                                onChange={(e) => setDemoSettings({...demoSettings, offersLive: e.target.checked})}
                                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                              />
                              <div>
                                <p className="font-medium text-purple-900">Live Online Sessions</p>
                                <p className="text-sm text-purple-700">Schedule real-time sessions with learners</p>
                              </div>
                            </label>
                            
                            <label className="flex items-center gap-3 p-3 border border-purple-200 rounded-lg hover:bg-white cursor-pointer">
                              <input
                                type="checkbox"
                                checked={demoSettings.offersRecorded}
                                onChange={(e) => setDemoSettings({...demoSettings, offersRecorded: e.target.checked})}
                                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                              />
                              <div>
                                <p className="font-medium text-purple-900">Pre-Recorded Sessions</p>
                                <p className="text-sm text-purple-700">Share a recorded demo video</p>
                              </div>
                            </label>
                          </div>
                        </div>

                        {/* Live Session Scheduling */}
                        {demoSettings.offersLive && (
                          <div className="p-4 bg-white border border-purple-200 rounded-lg">
                            <h4 className="font-semibold text-purple-900 mb-3">Live Session Availability</h4>
                            <p className="text-sm text-purple-700 mb-4">Add available time slots for live demo sessions</p>
                            
                            {/* Add New Slot Form */}
                            <div className="flex gap-2 mb-4">
                              <input
                                type="date"
                                value={newSlotDate}
                                onChange={(e) => setNewSlotDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="flex-1 px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                              <input
                                type="time"
                                value={newSlotTime}
                                onChange={(e) => setNewSlotTime(e.target.value)}
                                className="flex-1 px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                              <button
                                onClick={() => {
                                  if (newSlotDate && newSlotTime) {
                                    const newSlot = {
                                      date: newSlotDate,
                                      time: newSlotTime,
                                      available: true
                                    }
                                    const updatedSlots = [...(demoSettings.liveSessionSlots || []), newSlot]
                                    
                                    setDemoSettings({
                                      ...demoSettings,
                                      liveSessionSlots: updatedSlots
                                    })
                                    setNewSlotDate('')
                                    setNewSlotTime('')
                                  } else {
                                    alert('Please select both date and time')
                                  }
                                }}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                            </div>

                            {/* Display Slots */}
                            {demoSettings.liveSessionSlots && demoSettings.liveSessionSlots.length > 0 ? (
                              <div className="space-y-2">
                                {demoSettings.liveSessionSlots.map((slot, index) => (
                                  <div key={index} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                      <div>
                                        <p className="font-medium text-purple-900">
                                          {new Date(slot.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                        <p className="text-sm text-purple-700">{slot.time}</p>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => {
                                        setDemoSettings({
                                          ...demoSettings,
                                          liveSessionSlots: demoSettings.liveSessionSlots.filter((_, i) => i !== index)
                                        })
                                      }}
                                      className="text-red-600 hover:text-red-700 p-1"
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-6 text-purple-500 text-sm">
                                No time slots added yet
                              </div>
                            )}
                          </div>
                        )}

                        {/* Recorded Session Upload */}
                        {demoSettings.offersRecorded && (
                          <div className="p-4 bg-white border border-purple-200 rounded-lg">
                            <h4 className="font-semibold text-purple-900 mb-3">Upload Recorded Demo Session</h4>
                            <div className="space-y-3">
                              <div>
                                <label className="block text-sm font-medium text-purple-900 mb-2">
                                  Video URL (YouTube, Vimeo, or direct link)
                                </label>
                                <input
                                  type="url"
                                  value={demoSettings.recordedSessionUrl}
                                  onChange={(e) => setDemoSettings({...demoSettings, recordedSessionUrl: e.target.value})}
                                  placeholder="https://youtube.com/watch?v=..."
                                  className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                              </div>
                              
                              <div className="text-sm text-purple-700 bg-purple-50 p-3 rounded-lg">
                                <p className="font-medium mb-1">💡 Tips for your demo video:</p>
                                <ul className="list-disc list-inside space-y-1 text-xs">
                                  <li>Keep it between 5-15 minutes</li>
                                  <li>Introduce yourself and your teaching style</li>
                                  <li>Showcase a simple technique or project</li>
                                  <li>Ensure good lighting and audio quality</li>
                                </ul>
                              </div>
                              
                              {demoSettings.recordedSessionUrl && (
                                <div className="mt-3">
                                  <p className="text-sm font-medium text-purple-900 mb-2">Preview:</p>
                                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                                    <iframe
                                      src={demoSettings.recordedSessionUrl.replace('watch?v=', 'embed/')}
                                      className="w-full h-full rounded-lg"
                                      allowFullScreen
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Demo Description */}
                        <div>
                          <label className="block text-sm font-medium text-purple-900 mb-2">
                            Demo Session Description (Optional)
                          </label>
                          <textarea
                            value={demoSettings.demoDescription}
                            onChange={(e) => setDemoSettings({...demoSettings, demoDescription: e.target.value})}
                            placeholder="Describe what learners can expect from your demo session..."
                            rows="3"
                            className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end pt-4 border-t border-purple-200">
                          <button
                            onClick={async () => {
                              try {
                                if (!artistData?._id) {
                                  alert('Artist ID is missing. Please refresh the page.')
                                  return
                                }
                                
                                const response = await axios.patch(
                                  `${API_URL}/artists/${artistData._id}`,
                                  { demoSessionSettings: demoSettings },
                                  { headers: { Authorization: `Bearer ${accessToken}` } }
                                )
                                
                                setArtistData(response.data)
                                setDemoSettings(response.data.demoSessionSettings || {
                                  enabled: false,
                                  offersLive: false,
                                  offersRecorded: false,
                                  recordedSessionUrl: '',
                                  demoDescription: '',
                                  liveSessionSlots: []
                                })
                                alert('Demo session settings saved successfully!')
                              } catch (error) {
                                alert(`Failed to save settings: ${error.response?.data?.error || error.message}`)
                              }
                            }}
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Save Settings
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Demo Bookings Section */}
                  {demoSettings.enabled && (
                    <div className="p-6 border border-purple-100 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-purple-900">Demo Session Bookings</h3>
                        <button
                          onClick={fetchDemoBookings}
                          className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Refresh
                        </button>
                      </div>

                      {loadingBookings ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                          <p className="text-sm text-purple-600 mt-2">Loading bookings...</p>
                        </div>
                      ) : demoBookings.length === 0 ? (
                        <div className="text-center py-8 text-purple-600">
                          <svg className="w-12 h-12 mx-auto mb-3 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm">No demo bookings yet</p>
                          <p className="text-xs text-purple-500 mt-1">When learners book demo sessions, they'll appear here</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {demoBookings.map((booking) => (
                            <div key={booking._id} className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:shadow-md transition-shadow">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-semibold text-purple-900">{booking.learnerName}</h4>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                      booking.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                                      booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                      'bg-yellow-100 text-yellow-700'
                                    }`}>
                                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                    </span>
                                  </div>
                                  
                                  <div className="space-y-1 text-sm text-purple-700">
                                    <p className="flex items-center gap-2">
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                      </svg>
                                      {booking.learnerEmail}
                                    </p>
                                    <p className="flex items-center gap-2">
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                      </svg>
                                      {booking.learnerPhone}
                                    </p>
                                    
                                    {booking.sessionType === 'live' && booking.selectedSlot && (
                                      <p className="flex items-center gap-2 font-medium text-purple-900 mt-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {new Date(booking.selectedSlot.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {booking.selectedSlot.time}
                                      </p>
                                    )}
                                    
                                    {booking.artInterest && (
                                      <p className="text-xs mt-2">
                                        <span className="font-medium">Interest:</span> {booking.artInterest}
                                      </p>
                                    )}
                                    
                                    {booking.message && (
                                      <p className="text-xs mt-1 italic">
                                        "{booking.message}"
                                      </p>
                                    )}
                                    
                                    <p className="text-xs text-purple-500 mt-2">
                                      Booked on {new Date(booking.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="flex flex-col gap-2 ml-4">
                                  <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                                    booking.sessionType === 'live' 
                                      ? 'bg-amber-100 text-amber-700' 
                                      : 'bg-blue-100 text-blue-700'
                                  }`}>
                                    {booking.sessionType === 'live' ? '🎥 Live' : '▶️ Recorded'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-bold text-purple-900 mb-6">Performance Analytics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 border border-purple-100 rounded-xl">
                    <h3 className="font-semibold text-purple-900 mb-4">Revenue Trend</h3>
                    <div className="h-48 flex items-end justify-around gap-2">
                      {[40, 65, 45, 80, 70, 90].map((height, idx) => (
                        <div key={idx} className="flex-1 bg-purple-200 rounded-t hover:bg-purple-300 transition-all duration-200" style={{height: `${height}%`}}></div>
                      ))}
                    </div>
                    <div className="flex justify-around mt-2 text-xs text-purple-600">
                      <span>Jan</span>
                      <span>Feb</span>
                      <span>Mar</span>
                      <span>Apr</span>
                      <span>May</span>
                      <span>Jun</span>
                    </div>
                  </div>
                  <div className="p-6 border border-purple-100 rounded-xl">
                    <h3 className="font-semibold text-purple-900 mb-4">Popular Workshops</h3>
                    <div className="space-y-3">
                      {myWorkshops.slice(0, 3).map((workshop, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                          <span className="text-sm text-purple-900">{workshop.title}</span>
                          <span className="text-sm font-semibold text-purple-600">{workshop.enrolled || 0} students</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="animate-fade-in space-y-6">
                <div className="p-6 border border-purple-100 rounded-xl">
                  <h3 className="text-lg font-semibold text-purple-900 mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-purple-100">
                      <div>
                        <p className="font-medium text-purple-900">New Booking Alerts</p>
                        <p className="text-sm text-purple-700">Get notified when students enroll</p>
                      </div>
                      <input type="checkbox" className="w-5 h-5 text-purple-600" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-purple-100">
                      <div>
                        <p className="font-medium text-purple-900">Payment Notifications</p>
                        <p className="text-sm text-purple-700">Revenue and payment updates</p>
                      </div>
                      <input type="checkbox" className="w-5 h-5 text-purple-600" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-purple-900">Marketing Emails</p>
                        <p className="text-sm text-purple-700">Tips and best practices</p>
                      </div>
                      <input type="checkbox" className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                </div>

                <div className="p-6 border border-purple-100 rounded-xl">
                  <h3 className="text-lg font-semibold text-purple-900 mb-4">Payment Settings</h3>
                  <p className="text-sm text-purple-700 mb-4">Configure your payment and banking details</p>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200">
                    Update Payment Info
                  </button>
                </div>
              </div>
            )}
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
              alt="Gallery view"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  )
}

export default ArtistProfileDashboard
