import { useState, useEffect } from 'react';

const SearchFilters = ({ 
  type = 'all', // 'all', 'artists', 'workshops'
  filters = {},
  facets = {},
  onFilterChange,
  onReset,
  className = ''
}) => {
  // Filter states
  const [localFilters, setLocalFilters] = useState({
    category: filters.category || '',
    subcategories: filters.subcategories || [],
    minPrice: filters.minPrice || '',
    maxPrice: filters.maxPrice || '',
    minRating: filters.minRating || '',
    city: filters.city || '',
    mode: filters.mode || '',
    available: filters.available || false,
    dateFrom: filters.dateFrom || '',
    dateTo: filters.dateTo || '',
    hasSeats: filters.hasSeats || false,
    certificateProvided: filters.certificateProvided || false,
    materialProvided: filters.materialProvided || false,
    targetAudience: filters.targetAudience || '',
    experienceYears: filters.experienceYears || '',
    ...filters
  });

  const [isExpanded, setIsExpanded] = useState({
    category: true,
    price: true,
    rating: true,
    location: false,
    availability: false,
    features: false
  });

  // Common categories
  const categories = [
    'Dance', 'Music', 'Visual Arts', 'Crafts', 'Theater', 
    'Photography', 'Literature', 'Digital Arts', 'Traditional Arts'
  ];

  // Mode options
  const modeOptions = ['online', 'offline', 'hybrid'];

  // Target audience options
  const audienceOptions = ['Beginners', 'Intermediate', 'Advanced', 'All Levels', 'Kids', 'Adults'];

  // Price ranges (predefined options)
  const priceRanges = [
    { label: 'Under ₹500', min: 0, max: 500 },
    { label: '₹500 - ₹1000', min: 500, max: 1000 },
    { label: '₹1000 - ₹2500', min: 1000, max: 2500 },
    { label: '₹2500 - ₹5000', min: 2500, max: 5000 },
    { label: 'Above ₹5000', min: 5000, max: null }
  ];

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(prev => ({ ...prev, ...filters }));
  }, [filters]);

  // Handle filter change
  const handleFilterChange = (key, value) => {
    const updated = { ...localFilters, [key]: value };
    setLocalFilters(updated);
    
    if (onFilterChange) {
      onFilterChange(updated);
    }
  };

  // Handle array filter toggle (e.g., subcategories)
  const handleArrayToggle = (key, value) => {
    const currentArray = localFilters[key] || [];
    const updated = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    handleFilterChange(key, updated);
  };

  // Handle price range selection
  const handlePriceRange = (min, max) => {
    const updated = { 
      ...localFilters, 
      minPrice: min || '', 
      maxPrice: max || '' 
    };
    setLocalFilters(updated);
    
    if (onFilterChange) {
      onFilterChange(updated);
    }
  };

  // Handle reset
  const handleReset = () => {
    const reset = {
      category: '',
      subcategories: [],
      minPrice: '',
      maxPrice: '',
      minRating: '',
      city: '',
      mode: '',
      available: false,
      dateFrom: '',
      dateTo: '',
      hasSeats: false,
      certificateProvided: false,
      materialProvided: false,
      targetAudience: '',
      experienceYears: ''
    };
    
    setLocalFilters(reset);
    
    if (onReset) {
      onReset();
    } else if (onFilterChange) {
      onFilterChange(reset);
    }
  };

  // Toggle section expansion
  const toggleSection = (section) => {
    setIsExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Get facet count
  const getFacetCount = (key, value) => {
    if (!facets || !facets[key]) return null;
    const item = facets[key].find(f => f._id === value);
    return item ? item.count : null;
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        <button
          onClick={handleReset}
          className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
        >
          Reset All
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('category')}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <h3 className="text-sm font-semibold text-gray-900">Category</h3>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded.category ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isExpanded.category && (
          <div className="space-y-2">
            {categories.map(cat => {
              const count = getFacetCount('category', cat);
              return (
                <label key={cat} className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="category"
                    value={cat}
                    checked={localFilters.category === cat}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-4 h-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
                  />
                  <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 flex-1">
                    {cat}
                  </span>
                  {count !== null && (
                    <span className="text-xs text-gray-500">({count})</span>
                  )}
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <h3 className="text-sm font-semibold text-gray-900">Price Range</h3>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded.price ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isExpanded.price && (
          <div className="space-y-3">
            {/* Predefined ranges */}
            <div className="space-y-2">
              {priceRanges.map(range => (
                <label key={range.label} className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={
                      localFilters.minPrice === range.min && 
                      (localFilters.maxPrice === range.max || (!range.max && !localFilters.maxPrice))
                    }
                    onChange={() => handlePriceRange(range.min, range.max)}
                    className="w-4 h-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
                  />
                  <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                    {range.label}
                  </span>
                </label>
              ))}
            </div>

            {/* Custom range */}
            <div className="pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-600 mb-2">Custom Range</p>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={localFilters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={localFilters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('rating')}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <h3 className="text-sm font-semibold text-gray-900">Rating</h3>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded.rating ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isExpanded.rating && (
          <div className="space-y-2">
            {[4.5, 4.0, 3.5, 3.0].map(rating => (
              <label key={rating} className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  name="rating"
                  value={rating}
                  checked={localFilters.minRating === rating.toString()}
                  onChange={(e) => handleFilterChange('minRating', e.target.value)}
                  className="w-4 h-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
                />
                <div className="ml-3 flex items-center">
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 mr-2">
                    {rating}+
                  </span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-500' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Location Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('location')}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <h3 className="text-sm font-semibold text-gray-900">Location</h3>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded.location ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isExpanded.location && (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Enter city name"
              value={localFilters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            
            {/* Mode filter (for workshops) */}
            {(type === 'all' || type === 'workshops') && (
              <div className="pt-2">
                <p className="text-xs text-gray-600 mb-2">Mode</p>
                <div className="space-y-2">
                  {modeOptions.map(mode => (
                    <label key={mode} className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="mode"
                        value={mode}
                        checked={localFilters.mode === mode}
                        onChange={(e) => handleFilterChange('mode', e.target.value)}
                        className="w-4 h-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
                      />
                      <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 capitalize">
                        {mode}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Availability Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('availability')}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <h3 className="text-sm font-semibold text-gray-900">Availability</h3>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded.availability ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isExpanded.availability && (
          <div className="space-y-3">
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={localFilters.available}
                onChange={(e) => handleFilterChange('available', e.target.checked)}
                className="w-4 h-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
              />
              <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                Available Now
              </span>
            </label>

            {/* Date range (for workshops) */}
            {(type === 'all' || type === 'workshops') && (
              <div className="pt-2">
                <p className="text-xs text-gray-600 mb-2">Date Range</p>
                <div className="space-y-2">
                  <input
                    type="date"
                    value={localFilters.dateFrom}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <input
                    type="date"
                    value={localFilters.dateTo}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Workshop-specific Features */}
      {(type === 'all' || type === 'workshops') && (
        <div className="mb-6">
          <button
            onClick={() => toggleSection('features')}
            className="flex items-center justify-between w-full text-left mb-3"
          >
            <h3 className="text-sm font-semibold text-gray-900">Features</h3>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded.features ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isExpanded.features && (
            <div className="space-y-2">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={localFilters.hasSeats}
                  onChange={(e) => handleFilterChange('hasSeats', e.target.checked)}
                  className="w-4 h-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                  Has Available Seats
                </span>
              </label>

              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={localFilters.certificateProvided}
                  onChange={(e) => handleFilterChange('certificateProvided', e.target.checked)}
                  className="w-4 h-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                  Certificate Provided
                </span>
              </label>

              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={localFilters.materialProvided}
                  onChange={(e) => handleFilterChange('materialProvided', e.target.checked)}
                  className="w-4 h-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                  Materials Provided
                </span>
              </label>

              {/* Target Audience */}
              <div className="pt-2">
                <p className="text-xs text-gray-600 mb-2">Target Audience</p>
                <select
                  value={localFilters.targetAudience}
                  onChange={(e) => handleFilterChange('targetAudience', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="">All Levels</option>
                  {audienceOptions.map(aud => (
                    <option key={aud} value={aud}>{aud}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Artist-specific Filters */}
      {(type === 'all' || type === 'artists') && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Experience</h3>
          <select
            value={localFilters.experienceYears}
            onChange={(e) => handleFilterChange('experienceYears', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="">Any Experience</option>
            <option value="1">1+ years</option>
            <option value="3">3+ years</option>
            <option value="5">5+ years</option>
            <option value="10">10+ years</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
