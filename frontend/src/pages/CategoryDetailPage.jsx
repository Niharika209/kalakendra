import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import '../App.css'

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

  if (!category) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-24 px-6 bg-gradient-to-b from-amber-50 to-yellow-50 flex items-center justify-center">
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
      <div className="min-h-screen pt-16 px-6 bg-gradient-to-b from-amber-50 to-yellow-50">
        <div className="max-w-7xl mx-auto pb-20">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-yellow-600 pb-2">
              {category.title}
            </h1>
            <p className="text-lg md:text-xl text-[#45453e]/80">
              Explore {category.subcategories.length} workshops in {category.title}
            </p>
          </div>

          {/* Subcategories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        </div>
      </div>
    </>
  )
}

export default CategoryDetailPage
