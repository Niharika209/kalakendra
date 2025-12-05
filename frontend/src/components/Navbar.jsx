import { useState, useEffect, useRef } from "react"
import { useLocation, useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import axios from "axios"

const API_URL = 'http://localhost:5000/api'

function Navbar({ searchTerm = '', onSearchChange = null, searchPlaceholder = 'Search...' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [internalSearch, setInternalSearch] = useState('')
  const [searchResults, setSearchResults] = useState({ workshops: [], artists: [] })
  const [showDropdown, setShowDropdown] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const searchRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  
  // Use internal search if no external search is provided
  const currentSearch = searchTerm || internalSearch
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  // Live search as user types using new search API
  useEffect(() => {
    const searchAll = async () => {
      if (currentSearch.trim().length < 2) {
        setSearchResults({ workshops: [], artists: [] })
        setShowDropdown(false)
        return
      }
      
      setIsSearching(true)
      setShowDropdown(true)
      
      try {
        // Use the new autocomplete endpoint
        const response = await axios.get(`${API_URL}/search/autocomplete`, {
          params: { q: currentSearch, type: 'all' }
        });
        
        if (response.data.success) {
          const suggestions = response.data.data.suggestions;
          
          // Separate by type
          const artists = suggestions.filter(s => s.type === 'artist');
          const workshops = suggestions.filter(s => s.type === 'workshop');
          
          setSearchResults({ workshops, artists });
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false)
      }
    }
    
    const debounceTimer = setTimeout(searchAll, 300)
    return () => clearTimeout(debounceTimer)
  }, [currentSearch])
  
  const handleSearchChange = (value) => {
    if (onSearchChange) {
      onSearchChange(value)
    } else {
      setInternalSearch(value)
    }
  }
  
  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (currentSearch.trim()) {
      setShowDropdown(false)
      navigate(`/workshops?search=${encodeURIComponent(currentSearch)}`)
    }
  }
  
  const handleResultClick = (type, id) => {
    setShowDropdown(false)
    setInternalSearch('')
    if (type === 'workshop') {
      navigate(`/workshop/${id}`)
    } else if (type === 'artist') {
      navigate(`/artists/${id}`)
    }
  }

  const handleExploreArtists = (e) => {
    e.preventDefault()
    navigate('/artists')
    setIsOpen(false)
  }

  const handleBack = () => {
    navigate(-1)
  }

  const isHomePage = location.pathname === '/'

  const handleLogout = async () => {
    await logout()
    setIsOpen(false)
    navigate('/')
  }

  const ProfileButton = () => {
    const initial = (user?.name || 'U')[0].toUpperCase()
    const profileImageUrl = user?.role === 'artist' ? user?.imageUrl : user?.profileImage
    
    console.log('👤 Navbar ProfileButton:', { 
      role: user?.role, 
      imageUrl: user?.imageUrl, 
      profileImage: user?.profileImage,
      computed: profileImageUrl 
    })
    
    return (
      <Link to="/profile">
        <button className="w-9 h-9 rounded-full bg-amber-600 text-white flex items-center justify-center font-semibold hover:bg-amber-700 transition-all duration-200 transform hover:scale-110 overflow-hidden">
          {profileImageUrl ? (
            <img 
              src={profileImageUrl} 
              alt={user?.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('❌ Image failed to load:', profileImageUrl)
                e.target.style.display = 'none'
              }}
            />
          ) : (
            initial
          )}
        </button>
      </Link>
    )
  }

  return (
    <nav className="sticky top-0 z-50 bg-white backdrop-blur-sm border-b border-amber-200 shadow-md transition-all duration-300 ease-out">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo */}
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

          {/* Center: Navigation Links */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
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

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              className="text-[#45453e] hover:text-yellow-600 transition-all duration-300 ease-out bg-transparent border border-amber-300 px-3 py-2 rounded-md"
              onClick={() => setIsOpen(!isOpen)}
            >
              ☰
            </button>
          </div>
          
          {/* Right: Search Bar & Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <div ref={searchRef} className="relative">
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  value={currentSearch}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search workshops, artists, cities..."
                  className="w-64 px-3 py-1.5 pl-8 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 text-sm text-gray-800 placeholder-gray-400"
                />
                <svg 
                  className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </form>
              
              {/* Search Dropdown */}
              {showDropdown && (
                <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                  {isSearching ? (
                    <div className="p-4 text-center text-gray-500">Searching...</div>
                  ) : (
                    <>
                      {/* Workshops Section */}
                      {searchResults.workshops.length > 0 && (
                        <div className="p-2">
                          <div className="text-xs font-semibold text-gray-500 px-2 py-1">WORKSHOPS</div>
                          {searchResults.workshops.map(workshop => (
                            <button
                              key={workshop._id}
                              onClick={() => handleResultClick('workshop', workshop._id)}
                              className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded transition-colors"
                            >
                              <div className="font-medium text-sm text-gray-800">{workshop.title}</div>
                              <div className="text-xs text-gray-500">
                                {workshop.city && `📍 ${workshop.city}`}
                                {workshop.category && ` • ${workshop.category}`}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {/* Artists Section */}
                      {searchResults.artists.length > 0 && (
                        <div className="p-2 border-t border-gray-100">
                          <div className="text-xs font-semibold text-gray-500 px-2 py-1">ARTISTS</div>
                          {searchResults.artists.map(artist => (
                            <button
                              key={artist._id}
                              onClick={() => handleResultClick('artist', artist._id)}
                              className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded transition-colors"
                            >
                              <div className="font-medium text-sm text-gray-800">{artist.name}</div>
                              <div className="text-xs text-gray-500">{artist.specialization}</div>
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {/* No results */}
                      {searchResults.workshops.length === 0 && searchResults.artists.length === 0 && (
                        <div className="p-4 text-center text-gray-500 text-sm">
                          No results found for "{currentSearch}"
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

          {/* Auth Buttons / Profile */}
          
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
          {/* Mobile Search Bar - Always visible */}
          <div className="mb-4 pt-4 relative">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                value={currentSearch}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search workshops, artists, cities..."
                className="w-full px-4 py-2 pl-10 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
              />
              <svg 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </form>
            
            {/* Mobile Search Dropdown */}
            {showDropdown && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto z-50">
                {isSearching ? (
                  <div className="p-4 text-center text-gray-500">Searching...</div>
                ) : (
                  <>
                    {/* Workshops Section */}
                    {searchResults.workshops.length > 0 && (
                      <div className="p-2">
                        <div className="text-xs font-semibold text-gray-500 px-2 py-1">WORKSHOPS</div>
                        {searchResults.workshops.map(workshop => (
                          <button
                            key={workshop._id}
                            onClick={() => {
                              handleResultClick('workshop', workshop._id)
                              setIsOpen(false)
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded transition-colors"
                          >
                            <div className="font-medium text-sm text-gray-800">{workshop.title}</div>
                            <div className="text-xs text-gray-500">
                              {workshop.city && `📍 ${workshop.city}`}
                              {workshop.category && ` • ${workshop.category}`}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {/* Artists Section */}
                    {searchResults.artists.length > 0 && (
                      <div className="p-2 border-t border-gray-100">
                        <div className="text-xs font-semibold text-gray-500 px-2 py-1">ARTISTS</div>
                        {searchResults.artists.map(artist => (
                          <button
                            key={artist._id}
                            onClick={() => {
                              handleResultClick('artist', artist._id)
                              setIsOpen(false)
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded transition-colors"
                          >
                            <div className="font-medium text-sm text-gray-800">{artist.name}</div>
                            <div className="text-xs text-gray-500">{artist.specialization}</div>
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {/* No results */}
                    {searchResults.workshops.length === 0 && searchResults.artists.length === 0 && (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        No results found for "{currentSearch}"
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
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
