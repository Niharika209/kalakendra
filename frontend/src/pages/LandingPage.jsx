import '../App.css'

function LandingPage() {
  return (
    <>
      {/* Hero Section */}
      <div className="app-content min-h-screen">
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 bg-gradient-to-br from-white to-yellow-200 bg-clip-text text-transparent drop-shadow-lg tracking-tight leading-tight">
          Welcome to Kalakendra
        </h1>
        <p className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-6 drop-shadow-md">
          Discover the Art Within You
        </p>
        <p className="text-base md:text-lg lg:text-xl text-white mb-10 leading-relaxed drop-shadow max-w-2xl mx-auto">
          Your gateway to traditional and contemporary arts. Learn from master artists and explore your creative potential.
        </p>
        <button className="h-12 min-w-[200px] px-16 py-7 text-base md:text-lg font-bold text-yellow-900 bg-gradient-to-r from-yellow-200 to-yellow-400 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center gap-2">
          Explore Artists
          <span className="text-xl">→</span>
        </button>
      </div>

      {/* Explore Artforms Section */}
      <section className="min-h-screen py-20 px-6 flex items-center justify-center">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 bg-gradient-to-br from-white to-yellow-200 bg-clip-text text-transparent drop-shadow-lg tracking-tight leading-tight text-center">
            Explore Artforms
          </h2>
          <p className="text-lg md:text-xl text-center text-white mb-16 max-w-3xl mx-auto drop-shadow">
            Discover diverse traditional and contemporary art forms from around the world
          </p>
          
          {/* Artform cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer">
              <div className="h-48 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Painting</h3>
              <p className="text-gray-600">Traditional and modern painting techniques</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer">
              <div className="h-48 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">💃</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Dance</h3>
              <p className="text-gray-600">Classical and contemporary dance forms</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer">
              <div className="h-48 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">🎵</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Music</h3>
              <p className="text-gray-600">Vocal and instrumental music traditions</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer">
              <div className="h-48 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">✍️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Calligraphy</h3>
              <p className="text-gray-600">Art of beautiful handwriting and lettering</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer">
              <div className="h-48 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">🗿</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Sculpture</h3>
              <p className="text-gray-600">Three-dimensional art and pottery</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer">
              <div className="h-48 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">🧵</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Textile Arts</h3>
              <p className="text-gray-600">Weaving, embroidery, and fabric design</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default LandingPage
