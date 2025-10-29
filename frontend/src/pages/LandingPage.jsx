import '../App.css'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ArtistCard from '../components/ArtistCard'
import danceImage from '../assets/dance-art.jpg'
import sitarImage from '../assets/sitar.png'
import paintingImage from '../assets/painting.png'
import potteryImage from '../assets/pottery-art.jpg'

// Art Forms Data
const artForms = [
  {
    id: "dance",
    title: "Dance",
    description: "Bharatanatyam, Kathak, Odissi & more",
    image: danceImage,
    artistCount: 120,
  },
  {
    id: "music",
    title: "Music",
    description: "Tabla, Sitar, Hindustani & Carnatic",
    image: sitarImage,
    artistCount: 95,
  },
  {
    id: "painting",
    title: "Painting",
    description: "Madhubani, Warli, Miniature art",
    image: paintingImage,
    artistCount: 85,
  },
  {
    id: "pottery",
    title: "Pottery & Ceramics",
    description: "Clay work, traditional ceramics",
    image: potteryImage,
    artistCount: 60,
  },
];

// Featured Artists Data
const featuredArtists = [
  {
    id: 1,
    name: "Priya Sharma",
    category: "Classical Dance",
    location: "Delhi",
    rating: 4.9,
    reviews: 128,
    image: null,
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    category: "Classical Music",
    location: "Mumbai",
    rating: 4.8,
    reviews: 95,
    image: null,
  },
  {
    id: 3,
    name: "Ananya Desai",
    category: "Traditional Art",
    location: "Bangalore",
    rating: 4.7,
    reviews: 112,
    image: null,
  },
  {
    id: 4,
    name: "Vikram Patel",
    category: "Folk Music",
    location: "Pune",
    rating: 4.8,
    reviews: 87,
    image: null,
  },
]

function LandingPage() {
  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <div className="app-content min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 bg-linear-to-br from-white to-amber-100 bg-clip-text text-transparent drop-shadow-2xl tracking-tight leading-tight">
          Welcome to Kalakendra
        </h1>
        <p className="text-2xl md:text-3xl lg:text-4xl font-semibold text-amber-50 mb-6 drop-shadow-lg">
          Discover the Art Within You
        </p>
        <p className="text-base md:text-lg lg:text-xl text-amber-50 mb-16 leading-relaxed drop-shadow max-w-2xl">
          Your gateway to traditional and contemporary arts. Learn from master artists and explore your creative potential.
        </p>
        <button className="px-8 py-3 text-base md:text-lg font-bold text-amber-900 bg-linear-to-r from-yellow-300 to-amber-400 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center gap-2">
          Explore Artists
          <span className="text-xl">→</span>
        </button>
      </div>

      {/* Explore workshops Section */}
      <section className="min-h-screen py-20 px-6 flex items-center justify-center bg-gradient-to-b from-amber-50 to-yellow-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 bg-linear-to-br from-amber-700 to-yellow-600 bg-clip-text text-transparent drop-shadow-md tracking-tight leading-tight text-center">
            Explore Workshops
          </h2>
          
          
          {/* workshops cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {artForms.map((artForm, idx) => (
              <Link 
                key={idx} 
                to={`/workshops/${artForm.id}`}
                className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer"
              >
                <div className="h-48 bg-linear-to-br from-yellow-200 to-orange-300 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  {artForm.image ? (
                    <img src={artForm.image} alt={artForm.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl">
                      {idx === 0 ? '💃' : idx === 1 ? '🎵' : idx === 2 ? '🎨' : '🏺'}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-[#45453e] mb-2">{artForm.title}</h3>
                <p className="text-[#45453e]/70 mb-3">{artForm.description}</p>
                <p className="text-sm text-amber-600 font-medium">{artForm.artistCount} Artists</p>
              </Link>
            ))}
          </div>

          {/* Find More Button */}
          <div className="text-center mt-8">
            <Link to="/workshops">
              <button className="px-10 py-4 text-base md:text-lg font-bold text-amber-900 bg-gradient-to-r from-yellow-300 to-amber-400 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out inline-flex items-center justify-center gap-2">
                Find More Workshops
                <span className="text-xl">→</span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Artists Section */}
      <section id="featured-artists" className="min-h-screen py-20 px-6 flex items-center justify-center bg-linear-to-b from-yellow-100 to-yellow-200">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 bg-linear-to-br from-amber-700 to-yellow-600 bg-clip-text text-transparent drop-shadow-md tracking-tight leading-tight text-center">
            Featured Artists
          </h2>
          
          {/* Artist cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredArtists.map((artist, idx) => (
              <ArtistCard key={artist.id} artist={artist} index={idx} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default LandingPage
