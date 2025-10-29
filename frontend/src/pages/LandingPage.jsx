import '../App.css'
import Navbar from '../components/Navbar'
import ArtistCard from '../components/ArtistCard'

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

      {/* Explore Artforms Section */}
      <section className="min-h-screen py-20 px-6 flex items-center justify-center bg-gradient-to-b from-amber-50 to-yellow-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 bg-linear-to-br from-amber-700 to-yellow-600 bg-clip-text text-transparent drop-shadow-md tracking-tight leading-tight text-center">
            Explore Artforms
          </h2>
          <p className="text-lg md:text-xl text-center text-amber-800 mb-16 max-w-3xl mx-auto">
            Discover diverse traditional and contemporary art forms from around the world
          </p>
          
          {/* Artform cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer">
              <div className="h-48 bg-linear-to-br from-yellow-200 to-orange-300 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Painting</h3>
              <p className="text-gray-600">Traditional and modern painting techniques</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer">
              <div className="h-48 bg-linear-to-br from-yellow-200 to-orange-300 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">💃</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Dance</h3>
              <p className="text-gray-600">Classical and contemporary dance forms</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer">
              <div className="h-48 bg-linear-to-br from-yellow-200 to-orange-300 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">🎵</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Music</h3>
              <p className="text-gray-600">Vocal and instrumental music traditions</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer">
              <div className="h-48 bg-linear-to-br from-yellow-200 to-orange-300 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">✍️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Calligraphy</h3>
              <p className="text-gray-600">Art of beautiful handwriting and lettering</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer">
              <div className="h-48 bg-linear-to-br from-yellow-200 to-orange-300 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">🗿</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Sculpture</h3>
              <p className="text-gray-600">Three-dimensional art and pottery</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer">
              <div className="h-48 bg-linear-to-br from-yellow-200 to-orange-300 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">🧵</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Textile Arts</h3>
              <p className="text-gray-600">Weaving, embroidery, and fabric design</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Artists Section */}
      <section id="featured-artists" className="min-h-screen py-20 px-6 flex items-center justify-center bg-linear-to-b from-yellow-50 to-amber-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 bg-linear-to-br from-amber-700 to-yellow-600 bg-clip-text text-transparent drop-shadow-md tracking-tight leading-tight text-center">
            Featured Artists
          </h2>
          <p className="text-lg md:text-xl text-center text-amber-800 mb-16 max-w-3xl mx-auto">
            Learn from master artists and discover their incredible talents
          </p>
          
          {/* Artist cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
