import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handleExploreArtists = (e) => {
    e.preventDefault()
    
    // If on home page, scroll to section
    if (location.pathname === '/') {
      const section = document.getElementById('featured-artists')
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      // Navigate to home page first, then scroll
      navigate('/')
      setTimeout(() => {
        const section = document.getElementById('featured-artists')
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
    setIsOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-amber-50 to-yellow-50 backdrop-blur-sm border-b border-amber-200 shadow-md transition-all duration-300 ease-out">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-md flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 ease-out">
              <span className="text-white font-serif font-bold text-lg">K</span>
            </div>
            <span className="font-serif font-bold text-lg text-amber-900 hidden sm:inline">Kalakendra</span>
          </a>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              className="text-amber-900 hover:text-yellow-600 transition-all duration-300 ease-out bg-transparent border border-amber-300 px-3 py-2 rounded-md"
              onClick={() => setIsOpen(!isOpen)}
            >
              ☰
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#featured-artists"
              onClick={handleExploreArtists}
              className="text-amber-800 hover:text-yellow-600 font-medium transition-all duration-300 ease-out cursor-pointer"
            >
              Explore Artists
            </a>
            <a
              href="/workshops"
              className="text-amber-800 hover:text-yellow-600 font-medium transition-all duration-300 ease-out"
            >
              Workshops
            </a>
            <a
              href="/about"
              className="text-amber-800 hover:text-yellow-600 font-medium transition-all duration-300 ease-out"
            >
              About
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <a href="/auth/login">
              <button className="border border-amber-300 text-amber-900 hover:bg-amber-100 bg-white transition-all duration-300 ease-out px-4 py-2 rounded-md">
                Login
              </button>
            </a>
            <a href="/auth/signup">
              <button className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white shadow-md hover:shadow-lg transition-all duration-300 ease-out px-4 py-2 rounded-md font-semibold">
                Sign Up
              </button>
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden pb-4 px-4 border-t border-amber-200 bg-amber-50">
          <a
            href="#featured-artists"
            onClick={handleExploreArtists}
            className="block py-2 text-amber-800 hover:text-yellow-600 transition-all duration-300 ease-out cursor-pointer"
          >
            Explore Artists
          </a>
          <a
            href="/workshops"
            className="block py-2 text-amber-800 hover:text-yellow-600 transition-all duration-300 ease-out"
          >
            Workshops
          </a>
          <a
            href="/about"
            className="block py-2 text-amber-800 hover:text-yellow-600 transition-all duration-300 ease-out"
          >
            About
          </a>
          <div className="flex gap-2 mt-4">
            <a href="/auth/login" className="flex-1">
              <button className="w-full border border-amber-300 text-amber-900 hover:bg-amber-100 bg-white transition-all duration-300 ease-out px-4 py-2 rounded-md">
                Login
              </button>
            </a>
            <a href="/auth/signup" className="flex-1">
              <button className="w-full bg-linear-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white shadow-md hover:shadow-lg transition-all duration-300 ease-out px-4 py-2 rounded-md font-semibold">
                Sign Up
              </button>
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
