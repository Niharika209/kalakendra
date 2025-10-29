import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import priyaImage from '../assets/priya.png'

// Mock artist data
const mockArtist = {
  id: 1,
  name: "Priya Sharma",
  category: "Classical Dance",
  location: "Delhi, India",
  rating: 4.9,
  reviews: 128,
  verified: true,
  experience: 15,
  students: 250,
  hourlyRate: 1500,
  image: priyaImage,
  about: "I am a passionate classical dancer with over 15 years of experience in Bharatanatyam and Kathak. My teaching philosophy focuses on preserving traditional techniques while encouraging creative expression. I have trained students of all ages and have performed at numerous national and international venues.",
  specialties: ["Bharatanatyam", "Kathak", "Folk Dance", "Choreography"],
  workshops: [
    {
      id: 1,
      title: "Bharatanatyam Basics",
      date: "2025-11-15",
      time: "10:00 AM - 12:00 PM",
      duration: "2 hours",
      enrolled: 12,
      price: 2000
    },
    {
      id: 2,
      title: "Advanced Kathak Footwork",
      date: "2025-11-20",
      time: "3:00 PM - 5:00 PM",
      duration: "2 hours",
      enrolled: 8,
      price: 2500
    },
    {
      id: 3,
      title: "Folk Dance Workshop",
      date: "2025-11-25",
      time: "11:00 AM - 1:00 PM",
      duration: "2 hours",
      enrolled: 15,
      price: 1800
    }
  ],
  videos: [
    {
      id: 1,
      title: "Bharatanatyam Performance",
      thumbnail: "https://via.placeholder.com/300x200",
      duration: "5:30",
      views: 1200
    },
    {
      id: 2,
      title: "Kathak Tutorial - Basic Steps",
      thumbnail: "https://via.placeholder.com/300x200",
      duration: "12:45",
      views: 850
    },
    {
      id: 3,
      title: "Folk Dance Showcase",
      thumbnail: "https://via.placeholder.com/300x200",
      duration: "8:20",
      views: 920
    }
  ],
  testimonials: [
    {
      name: "Anjali Verma",
      rating: 5,
      text: "Priya ma'am is an excellent teacher! Her patience and dedication helped me master the basics of Bharatanatyam."
    },
    {
      name: "Rahul Gupta",
      rating: 5,
      text: "Learning Kathak from Priya has been an incredible journey. Her techniques are outstanding!"
    },
    {
      name: "Meera Singh",
      rating: 4,
      text: "Great workshops and very professional. Would highly recommend to anyone interested in classical dance."
    }
  ]
}

function ArtistProfilePage() {
  const navigate = useNavigate()
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [activeTab, setActiveTab] = useState('workshops') // New state for tabs
  const artist = mockArtist

  const handleBookSession = () => {
    setActiveTab('workshops')
    setTimeout(() => {
      const tabsSection = document.getElementById('tabs-section')
      if (tabsSection) {
        tabsSection.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Profile Image */}
            <div className="md:col-span-1">
              <div className="sticky top-20">
                <div className="relative h-80 bg-linear-to-br from-amber-200 to-orange-200 rounded-lg overflow-hidden mb-4">
                  <img
                    src={artist.image || "/placeholder.svg"}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button 
                  onClick={handleBookSession}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white mb-3 px-4 py-2 rounded-md font-medium transition-colors">
                  Book a Session
                </button>
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
                  <span className="text-2xl font-bold text-amber-900">{artist.rating}</span>
                  <span className="text-amber-700">({artist.reviews} reviews)</span>
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
                  <p className="text-2xl font-bold text-amber-900">{artist.experience}</p>
                  <p className="text-sm text-amber-700">Years Experience</p>
                </div>
                <div className="p-4 border border-amber-100 rounded-lg bg-white text-center">
                  <svg className="w-6 h-6 text-amber-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <p className="text-2xl font-bold text-amber-900">{artist.students}</p>
                  <p className="text-sm text-amber-700">Students</p>
                </div>
                <div className="p-4 border border-amber-100 rounded-lg bg-white text-center">
                  <svg className="w-6 h-6 text-amber-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-2xl font-bold text-amber-900">₹{artist.hourlyRate}</p>
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
                <p className="text-amber-800 leading-relaxed">{artist.about}</p>
              </div>
            </div>
          </div>

          {/* Specialties */}
          <div className="p-6 border border-amber-100 rounded-lg bg-white mb-12">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">Specialties</h2>
            <div className="flex flex-wrap gap-3">
              {artist.specialties.map((specialty) => (
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
                onClick={() => setActiveTab('videos')}
                className={`pb-4 px-6 font-semibold transition-all ${
                  activeTab === 'videos'
                    ? 'border-b-2 border-yellow-500 text-amber-900'
                    : 'text-amber-600 hover:text-amber-900'
                }`}
              >
                Videos
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
                  {artist.workshops.map((workshop) => (
                    <div key={workshop.id} className="p-6 border border-amber-100 rounded-lg bg-white hover:shadow-lg transition-shadow">
                      <h3 className="text-lg font-bold text-amber-900 mb-3">{workshop.title}</h3>
                      <div className="space-y-2 mb-4 text-sm text-amber-700">
                        <p>📅 {new Date(workshop.date).toLocaleDateString()}</p>
                        <p>🕐 {workshop.time}</p>
                        <p>⏱️ {workshop.duration}</p>
                        <p>👥 {workshop.enrolled} enrolled</p>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold text-amber-600">₹{workshop.price}</span>
                      </div>
                      <button 
                        onClick={() => navigate('/checkout')}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {artist.testimonials.map((testimonial, idx) => (
                    <div key={idx} className="p-6 border border-amber-100 rounded-lg bg-white">
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 fill-amber-500 text-amber-500" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-amber-800 mb-4 italic">"{testimonial.text}"</p>
                      <p className="font-semibold text-amber-900">- {testimonial.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Videos Tab */}
            {activeTab === 'videos' && (
              <div>
                <h2 className="text-2xl font-bold text-amber-900 mb-6">Performance Videos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {artist.videos.map((video) => (
                    <div key={video.id} className="border border-amber-100 rounded-lg bg-white overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="relative">
                        <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                          {video.duration}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-yellow-500 rounded-full p-4 hover:bg-yellow-600 transition-colors">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-amber-900 mb-2">{video.title}</h3>
                        <p className="text-sm text-amber-700">{video.views.toLocaleString()} views</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}

export default ArtistProfilePage
