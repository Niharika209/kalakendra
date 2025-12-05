import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import placeholderImage from '../assets/wave-background.svg'

function CompletedWorkshopCard({ workshop, onReviewClick }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch (e) {
      return 'Recently'
    }
  }

  const handleImageError = (e) => {
    e.target.onerror = null
    e.target.src = placeholderImage
  }

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 overflow-hidden border border-green-100/50">
      
      <div className="flex p-6 gap-6">
        {/* Left: Enhanced Image with overlay */}
        <div className="relative shrink-0 w-48 h-32 rounded-xl overflow-hidden shadow-md group-hover:shadow-xl transition-shadow duration-500">
          {workshop.image ? (
            <>
              <img
                src={workshop.image}
                alt={workshop.title}
                onError={handleImageError}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </>
          ) : (
            <div className="w-full h-full bg-linear-to-br from-green-200 via-emerald-200 to-green-300 flex items-center justify-center">
              <span className="text-5xl opacity-60 group-hover:scale-110 transition-transform duration-500">🎨</span>
            </div>
          )}
        </div>

        {/* Middle: Content */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-green-600 group-hover:to-emerald-600 transition-all duration-300" title={workshop.title}>
              {workshop.title}
            </h3>
            
            {/* Artist */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                {workshop.artist?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Artist</p>
                <p className="text-sm font-semibold text-gray-900" title={workshop.artist}>
                  {workshop.artist || 'Unknown Artist'}
                </p>
              </div>
            </div>

            {/* Completion Date */}
            <div className="flex items-center gap-2 mb-3 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-lg border border-green-200">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold text-green-700">Completed {formatDate(workshop.completedDate)}</span>
              </div>
              
              {workshop.quantity && workshop.quantity > 1 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  <span className="font-semibold text-gray-700">{workshop.quantity} Tickets</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Action buttons */}
        <div className="flex flex-col gap-2 items-end justify-center">
          {!workshop.reviewed && (
            <button
              onClick={() => onReviewClick(workshop)}
              className="px-6 py-3 bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Write Review
            </button>
          )}
          <Link
            to={`/workshop/${workshop.id}`}
            className="px-6 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2"
          >
            View Details
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

CompletedWorkshopCard.propTypes = {
  workshop: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    image: PropTypes.string,
    title: PropTypes.string.isRequired,
    artist: PropTypes.string,
    completedDate: PropTypes.string,
    quantity: PropTypes.number,
    reviewed: PropTypes.bool
  }).isRequired,
  onReviewClick: PropTypes.func.isRequired
}

export default CompletedWorkshopCard
