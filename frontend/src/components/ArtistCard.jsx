import seedheMautImage from '../assets/seedhe_maut.png'

function ArtistCard({ artist, index }) {
  return (
    <a href={`/artist/${artist.id}`}>
      <div 
        className="overflow-hidden hover:shadow-2xl hover:-translate-y-2 border border-amber-200 bg-white cursor-pointer group rounded-xl transition-all duration-300 ease-out animate-fade-in"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="relative h-48 bg-linear-to-br from-yellow-200 to-amber-300 overflow-hidden">
          <img
            src={artist.image || seedheMautImage}
            alt={artist.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-linear-to-t from-amber-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out"></div>
        </div>
        <div className="p-5 bg-linear-to-b from-white to-amber-50">
          <h3 className="font-serif font-bold text-amber-900 mb-1 group-hover:text-yellow-600 transition-all duration-300 ease-out">
            {artist.name}
          </h3>
          <p className="text-sm text-amber-700 mb-3">{artist.category}</p>
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
              <span className="font-semibold text-amber-900">{artist.rating}</span>
            </div>
            <span className="text-sm text-amber-700">({artist.reviews})</span>
          </div>
        </div>
      </div>
    </a>
  )
}

export default ArtistCard
