import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import '../App.css'
import { useEffect, useState } from 'react'
import axios from 'axios'

// All workshop data with subcategories
const workshopData = {
  painting: {
    title: "Painting",
    subcategories: [
      "Oil Painting", "Acrylic Painting", "Watercolor Painting", "Charcoal Drawing",
      "Pastels", "Fabric Painting", "Flower Painting", "Glass Painting",
      "Rangoli Making", "Warli Painting", "Finger Painting", "Fire Painting",
      "Soft Pastel", "Poster Color Painting"
    ]
  },
  drawing: {
    title: "Drawing",
    subcategories: [
      "Pencil Sketching", "Charcoal Shading", "Caricature Drawing",
      "Freehand Drawing", "Pencil Shading"
    ]
  },
  dance: {
    title: "Dance",
    subcategories: [
      "Classical Dance", "Contemporary Dance", "Folk Dance", "Ballet", "Hip-Hop"
    ]
  },
  music: {
    title: "Music",
    subcategories: [
      "Vocal Music", "Instrumental Music", "Classical", "Contemporary", "Folk Music"
    ]
  },
  pottery: {
    title: "Pottery & Ceramics",
    subcategories: [
      "Pottery Making", "Ceramic Art", "Clay Modeling"
    ]
  },
  crafts: {
    title: "Crafts",
    subcategories: [
      "Jewelry Making", "Candle Making", "Paper Craft", "Origami", "Quilling",
      "Envelope Making", "Gift Packing", "Soft Toy Making", "Ice-Cream Stick Art",
      "Bread Craft", "Mask Making", "Lamp Making", "Pop-up Cards"
    ]
  },
  sculpture: {
    title: "Sculpture",
    subcategories: [
      "Wood Carving", "Metal Sculpting", "Relief Sculpture",
      "Stone Carving", "Terra-cotta", "Bronze Casting"
    ]
  },
  textile: {
    title: "Textile Arts",
    subcategories: [
      "Weaving", "Embroidery", "Knitting", "Dyeing", "Quilting", "Fabric Design"
    ]
  },
  calligraphy: {
    title: "Calligraphy",
    subcategories: [
      "Hand Lettering", "Brush Pen Calligraphy", "Digital Calligraphy"
    ]
  },
  digital: {
    title: "Digital Arts",
    subcategories: [
      "Graphic Design", "Digital Illustration", "Animation", "Digital Fabrication"
    ]
  },
  photography: {
    title: "Photography",
    subcategories: [
      "Portrait Photography", "Landscape Photography", "Studio Photography", "Digital Editing"
    ]
  },
  mixedmedia: {
    title: "Mixed Media",
    subcategories: [
      "Collage", "Assemblage", "Resin Art", "Upcycled Art"
    ]
  },
  printmaking: {
    title: "Printmaking",
    subcategories: [
      "Screen Printing", "Etching", "Lithography", "Woodcut", "Linocut", "Monotype"
    ]
  },
  fashion: {
    title: "Fashion & Accessories",
    subcategories: [
      "Clothing Design", "Jewelry Design", "Handbag Making"
    ]
  },
  decorative: {
    title: "Decorative Arts",
    subcategories: [
      "Furniture Painting", "Mosaic", "Glass Painting"
    ]
  },
  performing: {
    title: "Performing Arts",
    subcategories: [
      "Theater", "Stand-up Comedy", "Performance Art"
    ]
  },
  literary: {
    title: "Literary Arts",
    subcategories: [
      "Poetry", "Storytelling", "Scriptwriting"
    ]
  }
}

function CategoryDetailPage() {
  const { categoryId } = useParams()
  const category = workshopData[categoryId]
  const [workshops, setWorkshops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function fetchWorkshops() {
      setLoading(true)
      try {
        const resp = await axios.get(`/api/workshops/category/${categoryId}`)
        if (!cancelled) setWorkshops(Array.isArray(resp.data) ? resp.data : [])
      } catch (err) {
        // If backend returns 404 (no workshops/resource), treat as empty list instead of showing raw error
        const status = err?.response?.status
        if (!cancelled && (status === 404 || status === 204)) {
          setWorkshops([])
          setError(null)
        } else {
          if (!cancelled) setError(err?.response?.data?.error || 'Could not load workshops')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    if (category) fetchWorkshops()
    return () => { cancelled = true }
  }, [categoryId, category])

  if (!category) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-24 px-6 bg-linear-to-b from-amber-50 to-yellow-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#45453e] mb-4">Category Not Found</h1>
            <Link to="/workshops" className="text-amber-600 hover:text-amber-700 font-semibold">
              ← Back to All Categories
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-16 px-6 bg-linear-to-b from-amber-50 to-yellow-50">
        <div className="max-w-7xl mx-auto pb-20">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-linear-to-r from-amber-700 to-yellow-600 pb-2">
              {category.title}
            </h1>
            <p className="text-lg md:text-xl text-[#45453e]/80">
              {loading ? 'Loading…' : `Explore ${category.title}`}
            </p>
            {error && <p className="text-red-600 mt-2">{error}</p>}
          </div>

          {/* Subcategories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {category.subcategories.map((subcategory, idx) => (
              <Link
                key={idx}
                to={`/workshops/${categoryId}/${subcategory.toLowerCase().replace(/\s+/g, '-')}`}
                className="p-4 bg-white/90 backdrop-blur-sm rounded-lg hover:shadow-lg transition-all border border-amber-100 hover:border-amber-300 hover:scale-105 transform duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[#45453e] font-semibold text-lg">{subcategory}</span>
                  <span className="text-amber-600 text-xl">→</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Workshops List */}
          <div>
            {loading && <div className="py-8 text-center">Loading workshops…</div>}

            {!loading && workshops.length === 0 && (
              <div className="py-8 text-center text-amber-700">No workshops available in {category.title}.</div>
            )}

            {!loading && workshops.length > 0 && (
              <>
                <h2 className="text-2xl font-bold text-amber-900 mb-4">Workshops</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {workshops.map((w) => (
                    <div key={w._id} className="p-4 bg-white rounded-lg border border-amber-100">
                      <h3 className="font-semibold text-amber-900 mb-2">{w.title}</h3>
                      <p className="text-sm text-amber-700 mb-2">By {w.artist?.name || 'Unknown'}</p>
                      <p className="text-sm text-amber-700 mb-2">📅 {w.date ? new Date(w.date).toLocaleDateString() : '-'}</p>
                      <p className="text-sm text-amber-700 mb-4">₹{w.price}</p>
                      <div className="flex items-center gap-2">
                        <Link to={`/artists/${w.artist?.slug || w.artist?._id}`} className="px-3 py-2 bg-amber-100 text-amber-900 rounded">View Artist</Link>
                        <Link to={`/workshops/${w._id}`} className="px-3 py-2 border border-amber-200 rounded">View Workshop</Link>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default CategoryDetailPage
