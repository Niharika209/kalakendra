import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { uploadImage } from '../services/uploadService'

const API_URL = 'http://localhost:5000/api'

function CreateWorkshopPage() {
  const navigate = useNavigate()
  const { user, accessToken } = useAuth()
  const [artistData, setArtistData] = useState(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [workshopImage, setWorkshopImage] = useState(null)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Painting',
    subcategory: '',
    price: '',
    duration: '',
    mode: 'Online',
    location: '',
    maxParticipants: '',
    date: '',
    time: '',
    requirements: '',
    whatYouWillLearn: '',
    targetAudience: 'Beginners',
    materialProvided: false,
    certificateProvided: false
  })

  const categories = ['Painting', 'Sculpture', 'Photography', 'Music', 'Dance', 'Crafts', 'Digital Art', 'Pottery']
  const targetAudiences = ['Beginners', 'Intermediate', 'Advanced', 'All Levels']
  const durations = ['1 hour', '2 hours', '3 hours', '4 hours', '1 day', '2 days', '3 days', '1 week', '2 weeks', 'Custom']

  useEffect(() => {
    if (!user) {
      navigate('/auth/login')
      return
    }
    
    if (user.role !== 'artist') {
      navigate('/') // Only artists can create workshops
      return
    }

    // Fetch artist data
    const fetchArtistData = async () => {
      try {
        const response = await axios.get(`${API_URL}/artists/email/${user.email}`)
        setArtistData(response.data)
      } catch (err) {
        console.error('Error fetching artist data:', err)
      }
    }
    fetchArtistData()
  }, [user, navigate])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const validateStep = () => {
    if (currentStep === 1) {
      if (!formData.title.trim()) {
        setError('Workshop title is required')
        return false
      }
      if (!formData.description.trim() || formData.description.length < 50) {
        setError('Description must be at least 50 characters')
        return false
      }
      if (!formData.category) {
        setError('Please select a category')
        return false
      }
    }

    if (currentStep === 2) {
      if (!formData.date) {
        setError('Workshop date is required')
        return false
      }
      if (!formData.time) {
        setError('Workshop time is required')
        return false
      }
      if (!formData.duration) {
        setError('Duration is required')
        return false
      }
      if (!formData.mode) {
        setError('Please select a mode')
        return false
      }
      if (formData.mode === 'Offline' && !formData.location.trim()) {
        setError('Location is required for offline workshops')
        return false
      }
    }

    if (currentStep === 3) {
      if (!formData.price || parseFloat(formData.price) <= 0) {
        setError('Valid price is required')
        return false
      }
      if (!formData.maxParticipants || parseInt(formData.maxParticipants) <= 0) {
        setError('Maximum participants must be greater than 0')
        return false
      }
    }

    return true
  }

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 4))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleImageUpload = async (e) => {
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
      setWorkshopImage(uploadResult.url)
      alert('Workshop image uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async () => {
    console.log('Submit clicked - Checking validation...')
    console.log('User:', user)
    console.log('AccessToken:', accessToken)
    console.log('ArtistData:', artistData?._id)
    
    if (!user) {
      setError('You must be logged in to create a workshop')
      return
    }

    if (!artistData) {
      setError('Artist data not loaded. Please refresh the page.')
      return
    }

    if (!validateStep()) {
      return
    }

    if (!accessToken) {
      setError('Session expired. Please log out and log in again.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const workshopData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        subcategory: formData.subcategory,
        price: parseFloat(formData.price),
        duration: formData.duration,
        mode: formData.mode,
        location: formData.location || (formData.mode === 'Online' ? 'Online' : ''),
        maxParticipants: parseInt(formData.maxParticipants),
        date: new Date(formData.date),
        time: formData.time,
        artist: artistData._id,
        status: 'active',
        enrolled: 0,
        requirements: formData.requirements,
        whatYouWillLearn: formData.whatYouWillLearn,
        targetAudience: formData.targetAudience,
        materialProvided: formData.materialProvided,
        certificateProvided: formData.certificateProvided,
        imageUrl: workshopImage || undefined,
        thumbnailUrl: workshopImage || undefined
      }

      console.log('📤 Sending workshop data:', workshopData)
      
      await axios.post(`${API_URL}/workshops`, workshopData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      
      console.log('✅ Workshop created successfully!')
      setSuccess(true)
      
      // Redirect after success
      setTimeout(() => {
        navigate('/artist-dashboard')
      }, 2000)
    } catch (err) {
      console.error('❌ Error creating workshop:', err)
      console.error('Error response:', err.response?.data)
      console.error('Error status:', err.response?.status)
      console.error('Error message:', err.message)
      
      // Handle specific error cases
      if (err.response?.status === 401) {
        setError('Your session has expired. Please log in again.')
        setTimeout(() => navigate('/login'), 2000)
      } else if (err.response?.status === 403) {
        setError('Only artists can create workshops. Please log in with an artist account.')
      } else {
        setError(err.response?.data?.error || err.response?.data?.message || 'Failed to create workshop. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-purple-700">Loading...</p>
        </div>
      </>
    )
  }

  if (success) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 via-emerald-50 to-teal-50">
          <div className="text-center animate-fade-in">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-green-900 mb-2">Workshop Created Successfully! 🎉</h2>
            <p className="text-green-700 mb-6">Redirecting you to your dashboard...</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-amber-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-600 via-pink-600 to-amber-600 mb-3">
              Create Your Workshop
            </h1>
            <p className="text-gray-600 text-lg">Share your expertise with eager learners worldwide</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-10">
            <div className="flex justify-between items-center relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 -z-10">
                <div 
                  className="h-full bg-linear-to-r from-purple-600 to-pink-600 transition-all duration-500 ease-out"
                  style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                />
              </div>

              {/* Steps */}
              {[
                { num: 1, title: 'Basic Info' },
                { num: 2, title: 'Schedule' },
                { num: 3, title: 'Pricing' },
                { num: 4, title: 'Details' }
              ].map((step) => (
                <div key={step.num} className="flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      currentStep >= step.num
                        ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white scale-110 shadow-lg'
                        : 'bg-white text-gray-400 border-2 border-gray-200'
                    }`}
                  >
                    {currentStep > step.num ? '✓' : step.num}
                  </div>
                  <span className={`text-xs mt-2 font-medium transition-colors ${
                    currentStep >= step.num ? 'text-purple-600' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 transform transition-all duration-300 hover:shadow-3xl">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-shake">
                <p className="text-red-700 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              </div>
            )}

            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-slide-in">
                <div>
                  <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                    <span className="text-purple-600 mr-2">📝</span>
                    Workshop Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Acrylic Painting Masterclass for Beginners"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-200 hover:border-purple-300"
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                    <span className="text-purple-600 mr-2">✍️</span>
                    Description * <span className="text-xs text-gray-500 ml-2">(Min 50 characters)</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={5}
                    placeholder="Describe what students will learn, what makes your workshop unique, and what they can expect..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-200 hover:border-purple-300 resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.description.length} / 50 characters</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                      <span className="text-purple-600 mr-2">🎨</span>
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-200 hover:border-purple-300 bg-white"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                      <span className="text-purple-600 mr-2">🏷️</span>
                      Subcategory <span className="text-xs text-gray-500 ml-2">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.subcategory}
                      onChange={(e) => handleInputChange('subcategory', e.target.value)}
                      placeholder="e.g., Abstract, Portraits, Landscape"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-200 hover:border-purple-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                    <span className="text-purple-600 mr-2">🎯</span>
                    Target Audience
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {targetAudiences.map(audience => (
                      <button
                        key={audience}
                        type="button"
                        onClick={() => handleInputChange('targetAudience', audience)}
                        className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
                          formData.targetAudience === audience
                            ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {audience}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Schedule & Location */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-slide-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                      <span className="text-purple-600 mr-2">📅</span>
                      Workshop Date *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-200 hover:border-purple-300"
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                      <span className="text-purple-600 mr-2">🕐</span>
                      Start Time *
                    </label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-200 hover:border-purple-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                    <span className="text-purple-600 mr-2">⏱️</span>
                    Duration *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {durations.map(dur => (
                      <button
                        key={dur}
                        type="button"
                        onClick={() => handleInputChange('duration', dur)}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                          formData.duration === dur
                            ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {dur}
                      </button>
                    ))}
                  </div>
                  {formData.duration === 'Custom' && (
                    <input
                      type="text"
                      placeholder="Enter custom duration"
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      className="w-full mt-3 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                    />
                  )}
                </div>

                <div>
                  <label className="flex items-center text-sm font-bold text-gray-700 mb-3">
                    <span className="text-purple-600 mr-2">🌐</span>
                    Workshop Mode *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['Online', 'Offline'].map(mode => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => handleInputChange('mode', mode)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                          formData.mode === mode
                            ? 'border-purple-600 bg-purple-50 shadow-lg'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <div className="text-2xl mb-2">
                          {mode === 'Online' && '💻'}
                          {mode === 'Offline' && '🏢'}
                        </div>
                        <div className="font-bold text-gray-800">{mode}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {formData.mode !== 'Online' && (
                  <div className="animate-fade-in">
                    <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                      <span className="text-purple-600 mr-2">📍</span>
                      Location *
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Enter workshop venue address"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-200 hover:border-purple-300"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Pricing & Capacity */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-slide-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                      <span className="text-purple-600 mr-2">💰</span>
                      Price (₹) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">₹</span>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        placeholder="2500"
                        min="0"
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-200 hover:border-purple-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                      <span className="text-purple-600 mr-2">👥</span>
                      Max Participants *
                    </label>
                    <input
                      type="number"
                      value={formData.maxParticipants}
                      onChange={(e) => handleInputChange('maxParticipants', e.target.value)}
                      placeholder="20"
                      min="1"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-200 hover:border-purple-300"
                    />
                  </div>
                </div>

                <div className="p-6 bg-linear-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-100">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                    <span className="text-xl mr-2">✨</span>
                    What's Included?
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.materialProvided}
                        onChange={(e) => handleInputChange('materialProvided', e.target.checked)}
                        className="w-5 h-5 text-purple-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                      />
                      <span className="ml-3 text-gray-700 group-hover:text-purple-600 transition-colors">
                        Materials Provided
                      </span>
                    </label>
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.certificateProvided}
                        onChange={(e) => handleInputChange('certificateProvided', e.target.checked)}
                        className="w-5 h-5 text-purple-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                      />
                      <span className="ml-3 text-gray-700 group-hover:text-purple-600 transition-colors">
                        Certificate of Completion
                      </span>
                    </label>
                  </div>
                </div>

                <div className="p-6 bg-blue-50 rounded-xl border-2 border-blue-100">
                  <h4 className="font-bold text-blue-900 mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Pricing Tip
                  </h4>
                  <p className="text-sm text-blue-800">
                    Consider your experience, duration, and materials included when setting your price. 
                    Most {formData.duration || '3 hour'} workshops range from ₹1,500 to ₹5,000.
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Additional Details */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-slide-in">
                <div>
                  <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                    <span className="text-purple-600 mr-2">🖼️</span>
                    Workshop Image (Optional)
                  </label>
                  <div className="flex items-center gap-4">
                    {workshopImage ? (
                      <div className="relative w-48 h-32">
                        <img 
                          src={workshopImage} 
                          alt="Workshop preview"
                          className="w-full h-full object-cover rounded-lg border-2 border-purple-200"
                        />
                        <button
                          type="button"
                          onClick={() => setWorkshopImage(null)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-48 h-32 border-2 border-dashed border-purple-300 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                        {uploading ? (
                          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <svg className="w-10 h-10 text-purple-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm text-purple-600">Upload Image</span>
                          </>
                        )}
                      </label>
                    )}
                    <p className="text-xs text-gray-500">
                      Add an attractive image for your workshop<br/>
                      (Max 5MB, JPG/PNG/WebP)
                    </p>
                  </div>
                </div>

                <div>
                  <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                    <span className="text-purple-600 mr-2">📚</span>
                    What Will Students Learn?
                  </label>
                  <textarea
                    value={formData.whatYouWillLearn}
                    onChange={(e) => handleInputChange('whatYouWillLearn', e.target.value)}
                    rows={4}
                    placeholder="List the key skills and knowledge students will gain... (use bullet points or numbered list)"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-200 hover:border-purple-300 resize-none"
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                    <span className="text-purple-600 mr-2">📋</span>
                    Requirements / Prerequisites
                  </label>
                  <textarea
                    value={formData.requirements}
                    onChange={(e) => handleInputChange('requirements', e.target.value)}
                    rows={3}
                    placeholder="Any materials students need to bring or prior knowledge required..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-200 hover:border-purple-300 resize-none"
                  />
                </div>

                {/* Summary Card */}
                <div className="p-6 bg-linear-to-br from-purple-100 via-pink-100 to-amber-100 rounded-xl border-2 border-purple-200">
                  <h3 className="font-bold text-xl text-purple-900 mb-4 flex items-center">
                    <span className="text-2xl mr-2">📝</span>
                    Workshop Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Title:</span>
                      <span className="font-semibold text-gray-900">{formData.title || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Category:</span>
                      <span className="font-semibold text-gray-900">{formData.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Date & Time:</span>
                      <span className="font-semibold text-gray-900">
                        {formData.date ? new Date(formData.date).toLocaleDateString() : '-'} {formData.time || '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Duration:</span>
                      <span className="font-semibold text-gray-900">{formData.duration || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Mode:</span>
                      <span className="font-semibold text-gray-900">{formData.mode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Price:</span>
                      <span className="font-bold text-lg text-purple-900">₹{formData.price || '0'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Max Students:</span>
                      <span className="font-semibold text-gray-900">{formData.maxParticipants || '-'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t-2 border-gray-100">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>

              {currentStep < 4 ? (
                <button
                  onClick={handleNext}
                  className="px-8 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center"
                >
                  Next
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-8 py-3 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Create Workshop
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default CreateWorkshopPage
