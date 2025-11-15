import { useState, useEffect } from "react"
import { useLocation, useNavigate, Link } from "react-router-dom"

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

  const handleBack = () => {
    navigate(-1)
  }

  const isHomePage = location.pathname === '/'

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'))
    } catch (e) {
      return null
    }
  })

  useEffect(() => {
    const onUserChanged = () => {
      try {
        setUser(JSON.parse(localStorage.getItem('user')))
      } catch (e) {
        setUser(null)
      }
    }
    window.addEventListener('userChanged', onUserChanged)
    return () => window.removeEventListener('userChanged', onUserChanged)
  }, [])

  const handleLogout = () => {
    try { localStorage.removeItem('user') } catch (e) {}
    window.dispatchEvent(new CustomEvent('userChanged'))
    setIsOpen(false)
    navigate('/')
  }

  const ProfileButton = () => {
    const initial = (user?.name || 'U')[0].toUpperCase()
    return (
      <Link to="/profile">
        <button className="w-9 h-9 rounded-full bg-amber-600 text-white flex items-center justify-center font-semibold hover:bg-amber-700 transition-all duration-200 transform hover:scale-110">
          {initial}
        </button>
      </Link>
    )
  }

  return (
    <nav className="sticky top-0 z-50 bg-white backdrop-blur-sm border-b border-amber-200 shadow-md transition-all duration-300 ease-out">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            {/* Back Button - Only show on non-home pages */}
            {!isHomePage && (
              <button
                onClick={handleBack}
                className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-amber-50 transition-all duration-300 ease-out group"
                aria-label="Go back"
              >
                <svg 
                  className="w-5 h-5 text-amber-700 group-hover:text-amber-900 transition-colors" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            
            <a href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-linear-to-br from-yellow-400 to-amber-500 rounded-md flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 ease-out">
                <span className="text-white font-serif font-bold text-lg">K</span>
              </div>
              <span className="font-serif font-bold text-lg text-[#45453e] hidden sm:inline">Kalakendra</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              className="text-[#45453e] hover:text-yellow-600 transition-all duration-300 ease-out bg-transparent border border-amber-300 px-3 py-2 rounded-md"
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
              className="text-[#45453e] hover:text-yellow-600 font-medium transition-all duration-300 ease-out cursor-pointer"
            >
              Explore Artists
            </a>
            <a
              href="/workshops"
              className="text-[#45453e] hover:text-yellow-600 font-medium transition-all duration-300 ease-out"
            >
              Workshops
            </a>
            <a
              href="/about"
              className="text-[#45453e] hover:text-yellow-600 font-medium transition-all duration-300 ease-out"
            >
              About
            </a>
          </div>

          {/* Auth Buttons / Profile */}
          <div className="hidden md:flex items-center gap-4">
            {!user ? (
              <>
                <Link to="/auth/login">
                  <button className="border border-amber-300 text-[#45453e] hover:bg-amber-100 bg-white transition-all duration-300 ease-out px-4 py-2 rounded-md">
                    Login
                  </button>
                </Link>
                <Link to="/auth/signup">
                  <button className="bg-linear-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-[#45453e] shadow-md hover:shadow-lg transition-all duration-300 ease-out px-4 py-2 rounded-md font-semibold">
                    Sign Up
                  </button>
                </Link>
              </>
            ) : (
              <ProfileButton />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden pb-4 px-4 border-t border-amber-200 bg-white">
          <a
            href="#featured-artists"
            onClick={handleExploreArtists}
            className="block py-2 text-[#45453e] hover:text-yellow-600 transition-all duration-300 ease-out cursor-pointer"
          >
            Explore Artists
          </a>
          <a
            href="/workshops"
            className="block py-2 text-[#45453e] hover:text-yellow-600 transition-all duration-300 ease-out"
          >
            Workshops
          </a>
          <a
            href="/about"
            className="block py-2 text-[#45453e] hover:text-yellow-600 transition-all duration-300 ease-out"
          >
            About
          </a>
          <div className="flex gap-2 mt-4">
            {!user ? (
              <>
                <Link to="/auth/login" className="flex-1">
                  <button className="w-full border border-amber-300 text-[#45453e] hover:bg-amber-100 bg-white transition-all duration-300 ease-out px-4 py-2 rounded-md">
                    Login
                  </button>
                </Link>
                <Link to="/auth/signup" className="flex-1">
                  <button className="w-full bg-linear-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-[#45453e] shadow-md hover:shadow-lg transition-all duration-300 ease-out px-4 py-2 rounded-md font-semibold">
                    Sign Up
                  </button>
                </Link>
              </>
            ) : (
              <>
                <div className="flex-1" />
                <button onClick={handleLogout} className="w-full border border-amber-300 text-red-600 rounded-md py-2">Logout</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
