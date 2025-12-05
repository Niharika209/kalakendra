import { Link } from 'react-router-dom'
import ashaImage from '../assets/asha.png'
import karanImage from '../assets/karan.png'
import vikramImage from '../assets/vikram.png'

function ArtistCard({ artist, index }) {
  // backend fields: thumbnailUrl, imageUrl, rating, reviewsCount, slug, _id
  const placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f59e0b" width="400" height="300"/%3E%3Ctext fill="%23ffffff" font-family="Arial" font-size="20" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E'
  // Use local assets for seeded entries (Asha, Karan, Vikram), then prefer API thumbnails/images, then placeholder
  let overrideImage = null
  if (artist) {
    if (artist.name === 'Asha Patel' || artist.slug === 'asha-patel') overrideImage = ashaImage
    else if (artist.name === 'Karan Mehta' || artist.slug === 'karan-mehta') overrideImage = karanImage
    else if (artist.name === 'Vikram Rao' || artist.slug === 'vikram-rao') overrideImage = vikramImage
  }
  const imgSrc = overrideImage || artist.thumbnailUrl || artist.imageUrl || artist.image || placeholder
  const rating = artist.rating ?? artist.avgRating ?? 0
  const reviews = artist.reviewsCount ?? artist.reviews ?? artist.reviewCount ?? 0
  const idOrSlug = artist.slug || artist._id || artist.id

  return (
    <Link to={`/artists/${idOrSlug}`}>
      <div 
        className="overflow-hidden hover:shadow-2xl hover:-translate-y-2 border border-amber-200 bg-white cursor-pointer group rounded-xl transition-all duration-300 ease-out animate-fade-in"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="relative h-40 sm:h-48 md:h-56 lg:h-64 bg-linear-to-br from-yellow-200 to-amber-300 overflow-hidden">
          <img
            src={imgSrc}
            alt={artist.name}
            loading="lazy"
            onError={(e) => { e.target.onerror = null; e.target.src = placeholder }}
            className="w-full h-full object-center object-cover group-hover:scale-110 transition-all duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-linear-to-t from-amber-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out"></div>
          {artist.isFeaturedByScore && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
              <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              FEATURED
            </div>
          )}
        </div>
        <div className="p-5 bg-linear-to-b from-white to-amber-50">
          <h3 className="font-serif font-bold text-amber-900 mb-1 group-hover:text-yellow-600 transition-all duration-300 ease-out">
            {artist.name}
          </h3>
          <p className="text-sm text-amber-700 mb-3">{artist.category || artist.specialties?.[0] || ''}</p>
          <div className="flex items-center gap-1 mb-4">
            <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm text-amber-700">{artist.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 fill-yellow-500 text-yellow-500" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-semibold text-amber-900">{rating}</span>
            </div>
            <span className="text-sm text-amber-700">({reviews})</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ArtistCard
