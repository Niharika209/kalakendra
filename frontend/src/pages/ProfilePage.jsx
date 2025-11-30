import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import placeholderImage from '../assets/wave-background.svg'
import { uploadImage, updateLearnerProfileImage, deleteLearnerProfileImage } from '../services/uploadService'

function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout, updateUser } = useAuth()
  const [activeTab, setActiveTab] = useState('enrolled')
  const [enrolledWorkshops, setEnrolledWorkshops] = useState([])
  const [completedWorkshops, setCompletedWorkshops] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [uploading, setUploading] = useState(false)
  const [profileImage, setProfileImage] = useState(null)

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
    // Load enrolled and completed workshops from localStorage
    try {
      const userWorkshops = localStorage.getItem(`workshops_${user?.email}`)
      if (userWorkshops) {
        const workshops = JSON.parse(userWorkshops)
        setEnrolledWorkshops(workshops.filter(w => !w.completed))
        setCompletedWorkshops(workshops.filter(w => w.completed))
      } else {
        // If no workshops stored yet, check cart as enrolled workshops
        const cart = localStorage.getItem('cart')
        if (cart) {
          const items = JSON.parse(cart).map(item => ({
            ...item,
            completed: false,
            enrolledDate: new Date().toISOString()
          }))
          setEnrolledWorkshops(items)
          // Save to user-specific storage
          if (user?.email) {
            localStorage.setItem(`workshops_${user.email}`, JSON.stringify(items))
          }
        }
      }
    } catch (e) {
      // ignore
    }
  }, [user])

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
      // ignore
    }
  }

  const handleSaveProfile = () => {
    if (!user) return
    // TODO: Implement API call to update user profile
    const updated = { ...user, name: editName, email: editEmail }
    console.log('Profile update:', updated)
    setIsEditing(false)
  }

  const handleImageUpload = async (e) => {
    console.log('🎯 handleImageUpload called')
    const file = e.target.files?.[0]
    console.log('📁 Selected file:', file)
    if (!file) {
      console.log('❌ No file selected')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.log('❌ Invalid file type:', file.type)
      alert('Please select an image file')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.log('❌ File too large:', file.size)
      alert('Image size should be less than 5MB')
      return
    }

    console.log('✅ File validation passed')
    
    try {
      setUploading(true)
      
      console.log('🔄 Starting image upload...')
      // Upload to Cloudinary
      const uploadResult = await uploadImage(file)
      console.log('✅ Image uploaded to Cloudinary:', uploadResult)
      
      // Update learner profile with new image URL
      if (user.id || user._id) {
        const userId = user.id || user._id
        console.log('🔄 Updating learner profile with image:', userId, uploadResult.url)
        const result = await updateLearnerProfileImage(userId, uploadResult.url)
        console.log('✅ Profile image updated in database:', result)
        setProfileImage(uploadResult.url)
        console.log('✅ Local state updated')
        updateUser({ profileImage: uploadResult.url })
        console.log('✅ User context updated with profileImage:', uploadResult.url)
        alert('Profile image updated successfully!')
      } else {
        console.error('❌ No user.id or user._id found:', user)
        alert('Error: User ID not found')
      }
    } catch (error) {
      console.error('❌ Upload error:', error)
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
      console.error('Delete error:', error)
      alert('Failed to delete image: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
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
                        className="px-4 py-2 border border-amber-300 text-amber-900 rounded-lg hover:bg-amber-50 transition-all duration-200"
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
                  <p className="text-2xl font-bold text-amber-900">{enrolledWorkshops.length}</p>
                  <p className="text-sm text-amber-700">Enrolled Workshops</p>
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
                  <p className="text-2xl font-bold text-amber-900">{enrolledWorkshops.length}</p>
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
                Enrolled ({enrolledWorkshops.length})
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
                {enrolledWorkshops.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-amber-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <h3 className="text-xl font-semibold text-amber-900 mb-2">No enrolled workshops</h3>
                    <p className="text-amber-700 mb-4">Start learning by enrolling in a workshop</p>
                    <Link to="/workshops" className="inline-block px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-200 transform hover:scale-105">
                      Explore Workshops
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrolledWorkshops.map((workshop, idx) => (
                      <div key={idx} className="border border-amber-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="h-40 bg-linear-to-br from-amber-200 to-orange-200 flex items-center justify-center overflow-hidden">
                          {workshop.image ? (
                            <img src={workshop.image} alt={workshop.title} onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage }} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-5xl">🎨</span>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-amber-900 mb-1">{workshop.title}</h3>
                          <p className="text-sm text-amber-700 mb-2">By {workshop.artist || 'Unknown'}</p>
                          <p className="text-xs text-amber-600 mb-3">
                            📅 Enrolled • {workshop.quantity || 1} ticket(s)
                          </p>
                          <div className="flex gap-2">
                            <Link to={`/workshop/${workshop.id}`} className="flex-1 text-center px-3 py-2 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700 transition-all duration-200">
                              View Details
                            </Link>
                            <button 
                              onClick={() => handleMarkComplete(workshop.id)}
                              className="px-3 py-2 border border-green-600 text-green-600 rounded-lg text-sm hover:bg-green-50 transition-all duration-200"
                              title="Mark as completed"
                            >
                              ✓
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Completed Workshops Tab */}
            {activeTab === 'completed' && (
              <div className="animate-fade-in">
                {completedWorkshops.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-amber-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-amber-900 mb-2">No completed workshops yet</h3>
                    <p className="text-amber-700">Complete your enrolled workshops to see them here</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {completedWorkshops.map((workshop, idx) => (
                      <div key={idx} className="border border-green-200 bg-green-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="h-40 bg-linear-to-br from-green-200 to-emerald-200 flex items-center justify-center overflow-hidden relative">
                          {workshop.image ? (
                            <img src={workshop.image} alt={workshop.title} onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage }} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-5xl">🎨</span>
                          )}
                          <div className="absolute top-2 right-2 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            ✓ Completed
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-amber-900 mb-1">{workshop.title}</h3>
                          <p className="text-sm text-amber-700 mb-2">By {workshop.artist || 'Unknown'}</p>
                          <p className="text-xs text-green-700 mb-3">
                            🎉 Completed {workshop.completedDate ? new Date(workshop.completedDate).toLocaleDateString() : 'recently'}
                          </p>
                          <Link to={`/workshop/${workshop.id}`} className="block text-center px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-all duration-200">
                            View Details
                          </Link>
                        </div>
                      </div>
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
