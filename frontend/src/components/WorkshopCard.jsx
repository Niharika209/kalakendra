import { useNavigate } from 'react-router-dom';

const WorkshopCard = ({ workshop }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/workshops/${workshop._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
    >
      {workshop.thumbnail && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={workshop.thumbnail}
            alt={workshop.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          {workshop.mode && (
            <span className="absolute top-2 right-2 px-2 py-1 bg-yellow-500 text-white text-xs font-semibold rounded">
              {workshop.mode}
            </span>
          )}
        </div>
      )}

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {workshop.title}
        </h3>

        {workshop.category && (
          <p className="text-sm text-gray-600 mb-2">{workshop.category}</p>
        )}

        {workshop.city && (
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{workshop.city}</span>
          </div>
        )}

        {/* Rating */}
        {workshop.rating && (
          <div className="flex items-center mb-3">
            <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="ml-1 text-sm font-medium text-gray-700">{workshop.rating.toFixed(1)}</span>
            {workshop.totalReviews && (
              <span className="ml-1 text-sm text-gray-500">({workshop.totalReviews})</span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-yellow-600">
              ₹{workshop.discountedPrice || workshop.price}
            </span>
            {workshop.discountedPrice && workshop.price !== workshop.discountedPrice && (
              <span className="text-sm text-gray-500 line-through">₹{workshop.price}</span>
            )}
          </div>
          
          {workshop.seatsAvailable !== undefined && (
            <span className={`text-xs font-medium px-2 py-1 rounded ${
              workshop.seatsAvailable > 0 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {workshop.seatsAvailable > 0 ? `${workshop.seatsAvailable} seats left` : 'Sold Out'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkshopCard;
