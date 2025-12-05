import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import '../App.css'
import { useState } from 'react'

// All workshop categories
const workshopCategories = [
  { id: 'painting', title: "Painting", description: "Explore various painting techniques", count: 14 },
  { id: 'drawing', title: "Drawing", description: "Master the art of drawing", count: 5 },
  { id: 'dance', title: "Dance", description: "Learn different dance forms", count: 5 },
  { id: 'music', title: "Music", description: "Discover musical instruments and vocals", count: 5 },
  { id: 'pottery', title: "Pottery & Ceramics", description: "Create beautiful pottery and ceramic art", count: 3 },
  { id: 'crafts', title: "Crafts", description: "Handmade crafts and DIY projects", count: 13 },
  { id: 'sculpture', title: "Sculpture", description: "Sculpt with various materials", count: 6 },
  { id: 'textile', title: "Textile Arts", description: "Weaving, embroidery and fabric arts", count: 6 },
  { id: 'calligraphy', title: "Calligraphy", description: "Beautiful lettering and writing", count: 3 },
  { id: 'digital', title: "Digital Arts", description: "Modern digital creative arts", count: 4 },
  { id: 'photography', title: "Photography", description: "Capture moments professionally", count: 4 },
  { id: 'mixedmedia', title: "Mixed Media", description: "Combine multiple art forms", count: 4 },
  { id: 'printmaking', title: "Printmaking", description: "Traditional and modern printing", count: 6 },
  { id: 'fashion', title: "Fashion & Accessories", description: "Design clothing and accessories", count: 3 },
  { id: 'decorative', title: "Decorative Arts", description: "Decorate and beautify spaces", count: 3 },
  { id: 'performing', title: "Performing Arts", description: "Theater and performance", count: 3 },
  { id: 'literary', title: "Literary Arts", description: "Writing and storytelling", count: 3 }
]

function WorkshopsListPage() {
  const [searchTerm, setSearchTerm] = useState('')

  // Filter categories based on search term
  const filteredCategories = workshopCategories.filter(category => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      category.title.toLowerCase().includes(search) ||
      category.description.toLowerCase().includes(search) ||
      category.id.toLowerCase().includes(search)
    )
  })

  return (
    <>
      <Navbar 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search workshop categories..."
      />
      <div className="min-h-screen pt-16 px-6 bg-linear-to-b from-amber-50 to-yellow-50">
        <div className="max-w-7xl mx-auto pb-20">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-linear-to-r from-amber-700 to-yellow-600 pb-2">
              All Workshop Categories
            </h1>
            <p className="text-lg md:text-xl text-[#45453e]/80 max-w-2xl mx-auto">
              Explore all available art forms and find the perfect workshop for your creative journey
            </p>
          </div>

          {searchTerm && (
            <p className="text-amber-700 mb-4 text-center">
              Found {filteredCategories.length} categor{filteredCategories.length !== 1 ? 'ies' : 'y'}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          )}

          {/* Categories Grid */}
          {filteredCategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <Link
                key={category.id}
                to={`/workshops/${category.id}`}
                className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl transition-all border border-amber-100 p-6 hover:scale-105 transform duration-300"
              >
                <div className="flex flex-col h-full">
                  <h3 className="text-2xl font-bold text-[#45453e] mb-2">{category.title}</h3>
                  <p className="text-[#45453e]/70 mb-4 grow">{category.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-amber-100">
                    <span className="text-sm text-amber-600 font-semibold">{category.count} workshops</span>
                    <span className="text-amber-600 text-xl">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-amber-700 text-lg">No categories found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default WorkshopsListPage
