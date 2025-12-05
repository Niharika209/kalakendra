import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import placeholderImage from '../assets/wave-background.svg'

function EnrolledWorkshopCard({ workshop }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch (e) {
      return 'Invalid date'
    }
  }

  const handleImageError = (e) => {
    e.target.onerror = null
    e.target.src = placeholderImage
  }

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 overflow-hidden border border-amber-100/50">
      
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
            <div className="w-full h-full bg-linear-to-br from-amber-200 via-orange-200 to-amber-300 flex items-center justify-center">
              <span className="text-5xl opacity-60 group-hover:scale-110 transition-transform duration-500">🎨</span>
            </div>
          )}
          
          {/* Status badge overlay on image - only show if completed */}
          {workshop.completed && (
            <div className="absolute top-2 right-2">
              <span className="px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg backdrop-blur-sm bg-green-500/90 text-white">
                ✓ Completed
              </span>
            </div>
          )}
        </div>

        {/* Middle: Content with better typography */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            {/* Title with gradient on hover */}
            <h3 className="text-xl font-bold text-amber-900 mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-amber-600 group-hover:to-orange-600 transition-all duration-300" title={workshop.title}>
              {workshop.title}
            </h3>
            
            {/* Artist with icon */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                {workshop.artist?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div>
                <p className="text-xs text-amber-600 font-medium">Artist</p>
                <p className="text-sm font-semibold text-amber-900" title={workshop.artist}>
                  {workshop.artist || 'Unknown Artist'}
                </p>
              </div>
            </div>

            {/* Info pills */}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-lg border border-amber-200">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs font-semibold text-amber-700">{formatDate(workshop.enrolledDate)}</span>
              </div>
              
              {workshop.quantity && workshop.quantity > 1 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 rounded-lg border border-orange-200">
                  <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  <span className="text-xs font-semibold text-orange-700">{workshop.quantity} Tickets</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Action button */}
        <div className="flex items-center">
          <Link
            to={`/workshop/${workshop.id}`}
            className="group/btn px-6 py-3 bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            aria-label={`View details for ${workshop.title}`}
          >
            <span>View Details</span>
            <svg className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

EnrolledWorkshopCard.propTypes = {
  workshop: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    image: PropTypes.string,
    title: PropTypes.string.isRequired,
    artist: PropTypes.string,
    enrolledDate: PropTypes.string,
    completed: PropTypes.bool
  }).isRequired
}

export default EnrolledWorkshopCard
