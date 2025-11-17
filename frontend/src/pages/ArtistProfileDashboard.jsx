import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import placeholderImage from '../assets/wave-background.svg'

function ArtistProfileDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('workshops')
  const [myWorkshops, setMyWorkshops] = useState([])
  const [bookings, setBookings] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editBio, setEditBio] = useState('')
  const [editSpeciality, setEditSpeciality] = useState('')
  const [showAddWorkshop, setShowAddWorkshop] = useState(false)
  
  // New workshop form state
  const [newWorkshop, setNewWorkshop] = useState({
    title: '',
    description: '',
    category: 'Painting',
    price: '',
    duration: '',
    mode: 'Online',
    maxParticipants: ''
  })

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.role !== 'artist') {
          navigate('/profile') // Redirect non-artists to learner profile
          return
        }
        setUser(parsed)
        setEditName(parsed.name || '')
        setEditEmail(parsed.email || '')
        setEditBio(parsed.bio || '')
        setEditSpeciality(parsed.speciality || '')
      } else {
        navigate('/auth/login')
      }
    } catch (e) {
      navigate('/auth/login')
    }
  }, [navigate])

  useEffect(() => {
    if (!user) return
    
    // Load artist's workshops
    try {
      const artistWorkshops = localStorage.getItem(`artist_workshops_${user.email}`)
      if (artistWorkshops) {
        setMyWorkshops(JSON.parse(artistWorkshops))
      }
    } catch (e) {
      // ignore
    }

    // Load bookings for artist's workshops
    try {
      const allBookings = localStorage.getItem(`artist_bookings_${user.email}`)
      if (allBookings) {
        setBookings(JSON.parse(allBookings))
      }
    } catch (e) {
      // ignore
    }
  }, [user])

  const handleSaveProfile = () => {
    if (!user) return
    const updated = { 
      ...user, 
      name: editName, 
      email: editEmail,
      bio: editBio,
      speciality: editSpeciality 
    }
    try {
      localStorage.setItem('user', JSON.stringify(updated))
      setUser(updated)
      window.dispatchEvent(new CustomEvent('userChanged'))
      setIsEditing(false)
    } catch (e) {
      // ignore
    }
  }

  const handleAddWorkshop = () => {
    if (!user || !newWorkshop.title || !newWorkshop.price) return
    
    const workshop = {
      id: Date.now().toString(),
      ...newWorkshop,
      artist: user.name,
      artistEmail: user.email,
      enrolled: 0,
      createdAt: new Date().toISOString(),
      status: 'active'
    }

    try {
      const updated = [...myWorkshops, workshop]
      localStorage.setItem(`artist_workshops_${user.email}`, JSON.stringify(updated))
      setMyWorkshops(updated)
      setShowAddWorkshop(false)
      setNewWorkshop({
        title: '',
        description: '',
        category: 'Painting',
        price: '',
        duration: '',
        mode: 'Online',
        maxParticipants: ''
      })
    } catch (e) {
      // ignore
    }
  }

  const handleDeleteWorkshop = (workshopId) => {
    try {
      const updated = myWorkshops.filter(w => w.id !== workshopId)
      localStorage.setItem(`artist_workshops_${user.email}`, JSON.stringify(updated))
      setMyWorkshops(updated)
    } catch (e) {
      // ignore
    }
  }

  const handleLogout = () => {
    try {
      localStorage.removeItem('user')
    } catch (e) {}
    window.dispatchEvent(new CustomEvent('userChanged'))
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
                <div className="w-32 h-32 rounded-full bg-purple-600 text-white flex items-center justify-center text-5xl font-bold border-4 border-white shadow-xl transform transition-all duration-300 hover:scale-110">
                  {initial}
                </div>
                <div className="flex-1 pt-20">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-amber-900 mb-1">{user.name}</h1>
                      <p className="text-amber-700 mb-2">{user.email}</p>
                      <div className="flex gap-2 items-center mb-2">
                        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-900 rounded-full text-sm font-medium">
                          🎨 Artist
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
                  <p className="text-2xl font-bold text-purple-900">4.8</p>
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
                onClick={() => setActiveTab('bookings')}
                className={`pb-3 px-4 font-semibold transition-all duration-200 ${
                  activeTab === 'bookings'
                    ? 'border-b-2 border-purple-600 text-purple-900'
                    : 'text-purple-600 hover:text-purple-900'
                }`}
              >
                Bookings ({bookings.length})
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
                  <button
                    onClick={() => setShowAddWorkshop(true)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Workshop
                  </button>
                </div>

                {/* Add Workshop Form */}
                {showAddWorkshop && (
                  <div className="mb-6 p-6 bg-purple-50 rounded-xl border border-purple-200 animate-fade-in">
                    <h3 className="text-lg font-semibold text-purple-900 mb-4">Create New Workshop</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-purple-900 mb-2">Workshop Title</label>
                        <input
                          value={newWorkshop.title}
                          onChange={(e) => setNewWorkshop({...newWorkshop, title: e.target.value})}
                          placeholder="e.g., Watercolor Landscape Painting"
                          className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-purple-900 mb-2">Description</label>
                        <textarea
                          value={newWorkshop.description}
                          onChange={(e) => setNewWorkshop({...newWorkshop, description: e.target.value})}
                          rows={3}
                          placeholder="Describe what students will learn..."
                          className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-purple-900 mb-2">Category</label>
                        <select
                          value={newWorkshop.category}
                          onChange={(e) => setNewWorkshop({...newWorkshop, category: e.target.value})}
                          className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option>Painting</option>
                          <option>Sculpture</option>
                          <option>Photography</option>
                          <option>Music</option>
                          <option>Dance</option>
                          <option>Crafts</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-purple-900 mb-2">Price (₹)</label>
                        <input
                          type="number"
                          value={newWorkshop.price}
                          onChange={(e) => setNewWorkshop({...newWorkshop, price: e.target.value})}
                          placeholder="2000"
                          className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-purple-900 mb-2">Duration</label>
                        <input
                          value={newWorkshop.duration}
                          onChange={(e) => setNewWorkshop({...newWorkshop, duration: e.target.value})}
                          placeholder="e.g., 2 hours, 3 days"
                          className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-purple-900 mb-2">Mode</label>
                        <select
                          value={newWorkshop.mode}
                          onChange={(e) => setNewWorkshop({...newWorkshop, mode: e.target.value})}
                          className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option>Online</option>
                          <option>In-Person</option>
                          <option>Hybrid</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-purple-900 mb-2">Max Participants</label>
                        <input
                          type="number"
                          value={newWorkshop.maxParticipants}
                          onChange={(e) => setNewWorkshop({...newWorkshop, maxParticipants: e.target.value})}
                          placeholder="20"
                          className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleAddWorkshop}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200"
                      >
                        Create Workshop
                      </button>
                      <button
                        onClick={() => setShowAddWorkshop(false)}
                        className="px-6 py-2 border border-purple-300 text-purple-900 rounded-lg hover:bg-purple-50 transition-all duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

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
                      <div key={workshop.id} className="border border-purple-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="h-40 bg-linear-to-br from-purple-200 to-pink-200 flex items-center justify-center">
                          <span className="text-5xl">🎨</span>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-purple-900 mb-2">{workshop.title}</h3>
                          <p className="text-sm text-purple-700 mb-2 line-clamp-2">{workshop.description}</p>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-lg font-bold text-purple-900">₹{workshop.price}</span>
                            <span className="text-sm text-purple-600">{workshop.enrolled || 0} enrolled</span>
                          </div>
                          <div className="flex gap-2 text-xs text-purple-600 mb-3">
                            <span className="px-2 py-1 bg-purple-50 rounded">{workshop.mode}</span>
                            <span className="px-2 py-1 bg-purple-50 rounded">{workshop.duration}</span>
                          </div>
                          <div className="flex gap-2">
                            <button className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-all duration-200">
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteWorkshop(workshop.id)}
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

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-bold text-purple-900 mb-6">Recent Bookings</h2>
                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-purple-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="text-xl font-semibold text-purple-900 mb-2">No bookings yet</h3>
                    <p className="text-purple-700">Student bookings will appear here</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-purple-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-purple-900">Student</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-purple-900">Workshop</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-purple-900">Date</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-purple-900">Amount</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-purple-900">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((booking, idx) => (
                          <tr key={idx} className="border-b border-purple-100 hover:bg-purple-50">
                            <td className="px-4 py-3 text-sm text-purple-900">{booking.studentName}</td>
                            <td className="px-4 py-3 text-sm text-purple-900">{booking.workshopTitle}</td>
                            <td className="px-4 py-3 text-sm text-purple-700">{booking.date}</td>
                            <td className="px-4 py-3 text-sm font-semibold text-purple-900">₹{booking.amount}</td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                {booking.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
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
    </>
  )
}

export default ArtistProfileDashboard
