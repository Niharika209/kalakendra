import '../App.css'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import ArtistCard from '../components/ArtistCard'
import { API_BASE_URL } from '../config/api.js'
import danceImage from '../assets/dance-art.jpg'
import sitarImage from '../assets/sitar.png'
import paintingImage from '../assets/painting.png'
import potteryImage from '../assets/pottery-art.jpg'
import priyaImage from '../assets/priya.png'
import ashaImage from '../assets/asha.png'
import karanImage from '../assets/karan.png'
import vikramImage from '../assets/vikram.png'

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

const fallbackFeaturedArtists = [
  {
    _id: 'a1',
    slug: 'priya-sharma',
    name: 'Priya Sharma',
    category: 'Classical Dance',
    location: 'Delhi',
    rating: 4.9,
    reviews: 128,
    pricePerHour: 1200,
    thumbnailUrl: priyaImage,
  },
  {
    _id: 'a2',
    slug: 'rajesh-kumar',
    name: 'Rajesh Kumar',
    category: 'Classical Music',
    location: 'Mumbai',
    rating: 4.8,
    reviews: 95,
    pricePerHour: 1000,
    thumbnailUrl: sitarImage,
  },
  {
    _id: 'a3',
    slug: 'ananya-desai',
    name: 'Ananya Desai',
    category: 'Traditional Art',
    location: 'Bengaluru',
    rating: 4.7,
    reviews: 112,
    pricePerHour: 900,
    thumbnailUrl: paintingImage,
  },
  {
    _id: 'a4',
    slug: 'vikram-patel',
    name: 'Vikram Patel',
    category: 'Pottery & Ceramics',
    location: 'Pune',
    rating: 4.8,
    reviews: 87,
    pricePerHour: 850,
    thumbnailUrl: potteryImage,
  },
]

const specialArtistAssets = {
  'asha-patel': ashaImage,
  'Asha Patel': ashaImage,
  'karan-mehta': karanImage,
  'Karan Mehta': karanImage,
  'vikram-rao': vikramImage,
  'Vikram Rao': vikramImage,
}

function applyAssetOverride(artist) {
  if (!artist) return artist
  const key = artist.slug || artist.name
  const asset = specialArtistAssets[key]
  if (asset) {
    return { ...artist, thumbnailUrl: asset }
  }
  return artist
}

function LandingPage() {
  const [featured, setFeatured] = useState(fallbackFeaturedArtists.map(applyAssetOverride))
  const [loadingFeatured, setLoadingFeatured] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function loadFeatured() {
      try {
        const resp = await axios.get(`${API_BASE_URL}/artists/featured`)
        if (!cancelled) {
          const data = resp?.data
          if (Array.isArray(data)) {
            setFeatured(data.slice(0, 4).map(applyAssetOverride))
          } else if (data && Array.isArray(data.artists)) {
            setFeatured(data.artists.slice(0, 4).map(applyAssetOverride))
          }
        }
      } catch (err) {
      } finally {
        if (!cancelled) setLoadingFeatured(false)
      }
    }

    loadFeatured()
    return () => { cancelled = true }
  }, [])

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
        <a href="/artists" className="inline-block">
          <button className="px-8 py-3 text-base md:text-lg font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center gap-2">
            Explore Artists
            <span className="text-xl">→</span>
          </button>
        </a>
      </div>

      {/* Explore workshops Section */}
      <section className="min-h-screen py-20 px-6 flex items-center justify-center bg-linear-to-b from-amber-50 to-yellow-50">
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
                <div className="h-40 sm:h-48 md:h-56 lg:h-64 bg-linear-to-br from-yellow-200 to-orange-300 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  {artForm.image ? (
                    <img src={artForm.image} alt={artForm.title} loading="lazy" className="w-full h-full object-center object-cover" />
                  ) : (
                    <div className="text-4xl font-bold text-amber-700">
                      {artForm.title.charAt(0)}
                    </div>
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
              <button className="px-10 py-4 text-base md:text-lg font-bold text-amber-900 bg-linear-to-r from-yellow-300 to-amber-400 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out inline-flex items-center justify-center gap-2">
                Find More Workshops
                <span className="text-xl">→</span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Artists Section */}
      <section 
        id="featured-artists" 
        className="min-h-screen py-20 px-6 flex items-center justify-center bg-linear-to-b from-yellow-100 to-yellow-200"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 bg-linear-to-br from-amber-700 to-yellow-600 bg-clip-text text-transparent drop-shadow-md tracking-tight leading-tight text-center">
            Featured Artists
          </h2>
          
          {/* Artist cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featured.map((artist, idx) => (
              <ArtistCard key={artist._id || artist.slug || idx} artist={artist} index={idx} />
            ))}
          </div>
          {/* Button to view all artists */}
          <div className="text-center mt-8">
            <Link to="/artists">
              <button className="px-8 py-3 text-base md:text-lg font-bold text-amber-900 bg-white border border-amber-200 rounded-full shadow hover:shadow-md transition-all duration-200">
                View All Artists
              </button>
            </Link>
          </div>
          {loadingFeatured && (
            <p className="mt-6 text-center text-sm text-amber-700">Loading featured artists…</p>
          )}
          {!loadingFeatured && (!featured || featured.length === 0) && (
            <div className="mt-8 p-8 bg-white/90 rounded-xl shadow-lg text-center">
              <h3 className="text-xl font-semibold text-amber-900 mb-2">No featured artists yet</h3>
              <p className="text-amber-700 mb-4">We don't have any featured artists at the moment. You can explore workshops or invite an artist to join.</p>
              <div className="flex items-center justify-center gap-4">
                <a href="/workshops" className="px-6 py-3 bg-linear-to-r from-yellow-300 to-amber-400 rounded-full text-amber-900 font-semibold">Explore Workshops</a>
                <a href="/contact" className="px-6 py-3 border border-amber-200 rounded-full text-amber-900 font-semibold">Invite an Artist</a>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default LandingPage