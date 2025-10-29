import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import '../App.css'

// Sample artists data - In a real app, this would come from an API
const generateArtistsForSubcategory = (subcategoryName) => {
  // Sample artist data
  const sampleArtists = [
    {
      id: 1,
      name: "Priya Sharma",
      specialization: subcategoryName,
      experience: "8 years",
      rating: 4.9,
      reviews: 128,
      location: "Delhi",
      price: "₹1,500/session",
      image: null,
      bio: "Experienced artist with passion for teaching"
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      specialization: subcategoryName,
      experience: "12 years",
      rating: 4.8,
      reviews: 95,
      location: "Mumbai",
      price: "₹2,000/session",
      image: null,
      bio: "Master artist with multiple awards"
    },
    {
      id: 3,
      name: "Ananya Desai",
      specialization: subcategoryName,
      experience: "6 years",
      rating: 4.7,
      reviews: 112,
      location: "Bangalore",
      price: "₹1,800/session",
      image: null,
      bio: "Contemporary approach to traditional art"
    },
    {
      id: 4,
      name: "Vikram Patel",
      specialization: subcategoryName,
      experience: "10 years",
      rating: 4.9,
      reviews: 87,
      location: "Pune",
      price: "₹1,600/session",
      image: null,
      bio: "Dedicated to preserving cultural heritage"
    },
    {
      id: 5,
      name: "Sneha Reddy",
      specialization: subcategoryName,
      experience: "5 years",
      rating: 4.6,
      reviews: 64,
      location: "Hyderabad",
      price: "₹1,400/session",
      image: null,
      bio: "Young and energetic teaching style"
    },
    {
      id: 6,
      name: "Arjun Mehta",
      specialization: subcategoryName,
      experience: "15 years",
      rating: 5.0,
      reviews: 150,
      location: "Ahmedabad",
      price: "₹2,500/session",
      image: null,
      bio: "Award-winning artist and mentor"
    }
  ]
  
  return sampleArtists
}

function SubcategoryDetailPage() {
  const { categoryId, subcategoryName } = useParams()
  
  // Convert URL slug back to readable name
  const displayName = subcategoryName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
  
  const artists = generateArtistsForSubcategory(displayName)

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-16 px-6 bg-gradient-to-b from-amber-50 to-yellow-50">
        <div className="max-w-7xl mx-auto pb-20">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-yellow-600 pb-2">
              {displayName}
            </h1>
            <p className="text-lg md:text-xl text-[#45453e]/80 mb-4">
              Find the perfect artist for {displayName} workshops
            </p>
            <Link 
              to={`/workshops/${categoryId}`}
              className="text-amber-600 hover:text-amber-700 font-semibold"
            >
              ← Back to {categoryId.charAt(0).toUpperCase() + categoryId.slice(1)}
            </Link>
          </div>

          {/* Artists Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artists.map((artist) => (
              <Link
                key={artist.id}
                to={`/artist/${artist.id}`}
                className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl transition-all border border-amber-100 overflow-hidden hover:scale-105 transform duration-300"
              >
                {/* Artist Image */}
                <div className="h-48 bg-gradient-to-br from-amber-200 to-yellow-300 flex items-center justify-center">
                  {artist.image ? (
                    <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-6xl">👤</div>
                  )}
                </div>

                {/* Artist Details */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#45453e] mb-2">{artist.name}</h3>
                  <p className="text-amber-600 font-semibold mb-3">{artist.specialization}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-[#45453e]/70">
                      <span>📍</span>
                      <span>{artist.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#45453e]/70">
                      <span>⏱️</span>
                      <span>{artist.experience} experience</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#45453e]/70">
                      <span>⭐</span>
                      <span>{artist.rating} ({artist.reviews} reviews)</span>
                    </div>
                  </div>

                  <p className="text-sm text-[#45453e]/60 mb-4">{artist.bio}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-amber-100">
                    <span className="text-lg font-bold text-amber-700">{artist.price}</span>
                    <span className="text-amber-600 font-semibold">View Profile →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default SubcategoryDetailPage
