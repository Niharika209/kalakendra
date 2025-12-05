/**
 * SearchBar Component
 * 
 * Advanced search bar with autocomplete/typeahead functionality
 * Features: Debounced input, keyboard navigation, category filtering
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAutocompleteSuggestions } from '../services/searchService';

const SearchBar = ({ 
  placeholder = "Search artists, workshops, locations...", 
  onSearch,
  type = 'all',
  className = '',
  showIcon = true 
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  
  const searchRef = useRef(null);
  const debounceTimer = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch autocomplete suggestions with debounce
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer (300ms debounce)
    debounceTimer.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const result = await getAutocompleteSuggestions(query, type);
        if (result.success) {
          setSuggestions(result.data.suggestions || []);
          setShowDropdown(true);
        }
      } catch (error) {
        console.error('Autocomplete error:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query, type]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!showDropdown || suggestions.length === 0) {
      if (e.key === 'Enter' && query) {
        handleSearch(query);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSearch(query);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  // Handle search submission
  const handleSearch = (searchQuery) => {
    setShowDropdown(false);
    setSelectedIndex(-1);
    
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      // Default behavior: Navigate to search results page
      navigate(`/search?q=${encodeURIComponent(searchQuery)}&type=${type}`);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.name || suggestion.title);
    setShowDropdown(false);
    setSelectedIndex(-1);

    // Navigate based on suggestion type
    if (suggestion.type === 'artist') {
      navigate(`/artists/${suggestion._id}`);
    } else if (suggestion.type === 'workshop') {
      navigate(`/workshops/${suggestion._id}`);
    }
  };

  // Get suggestion display text
  const getSuggestionText = (suggestion) => {
    if (suggestion.type === 'artist') {
      return suggestion.name;
    } else if (suggestion.type === 'workshop') {
      return suggestion.title;
    }
    return '';
  };

  // Get suggestion subtitle
  const getSuggestionSubtitle = (suggestion) => {
    if (suggestion.type === 'artist') {
      return `${suggestion.category || 'Artist'} • ${suggestion.city || 'Location'}`;
    } else if (suggestion.type === 'workshop') {
      return `${suggestion.category || 'Workshop'} • ${suggestion.mode || 'Mode'}`;
    }
    return '';
  };

  // Highlight matching text
  const highlightMatch = (text, query) => {
    if (!query) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <span>
        {parts.map((part, index) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <strong key={index} className="font-semibold text-yellow-600">{part}</strong>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </span>
    );
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        {showIcon && (
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        )}
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setSuggestions.length > 0 && setShowDropdown(true)}
          placeholder={placeholder}
          className={`w-full ${showIcon ? 'pl-10' : 'pl-4'} pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
        />
        
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-5 w-5 border-2 border-yellow-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto">
          {/* Group by type */}
          {type === 'all' && (
            <>
              {/* Artists Section */}
              {suggestions.filter(s => s.type === 'artist').length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-xs font-semibold text-gray-600 uppercase">Artists</h3>
                  </div>
                  {suggestions
                    .filter(s => s.type === 'artist')
                    .map((suggestion, index) => (
                      <div
                        key={`artist-${suggestion._id}`}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={`px-4 py-3 cursor-pointer hover:bg-yellow-50 transition-colors ${
                          selectedIndex === index ? 'bg-yellow-50' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {suggestion.profilePicture && (
                            <img
                              src={suggestion.profilePicture}
                              alt={suggestion.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {highlightMatch(getSuggestionText(suggestion), query)}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {getSuggestionSubtitle(suggestion)}
                            </p>
                          </div>
                          {suggestion.rating && (
                            <div className="flex items-center space-x-1">
                              <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="text-xs text-gray-600">{suggestion.rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* Workshops Section */}
              {suggestions.filter(s => s.type === 'workshop').length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-xs font-semibold text-gray-600 uppercase">Workshops</h3>
                  </div>
                  {suggestions
                    .filter(s => s.type === 'workshop')
                    .map((suggestion, index) => {
                      const artistIndex = suggestions.filter(s => s.type === 'artist').length;
                      const currentIndex = artistIndex + index;
                      return (
                        <div
                          key={`workshop-${suggestion._id}`}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className={`px-4 py-3 cursor-pointer hover:bg-yellow-50 transition-colors ${
                            selectedIndex === currentIndex ? 'bg-yellow-50' : ''
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            {suggestion.thumbnail && (
                              <img
                                src={suggestion.thumbnail}
                                alt={suggestion.title}
                                className="w-10 h-10 rounded object-cover"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {highlightMatch(getSuggestionText(suggestion), query)}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {getSuggestionSubtitle(suggestion)}
                              </p>
                            </div>
                            {suggestion.price && (
                              <span className="text-sm font-semibold text-yellow-600">
                                ₹{suggestion.price}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </>
          )}

          {/* Single type display (artists or workshops only) */}
          {type !== 'all' && suggestions.map((suggestion, index) => (
            <div
              key={suggestion._id}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`px-4 py-3 cursor-pointer hover:bg-yellow-50 transition-colors ${
                selectedIndex === index ? 'bg-yellow-50' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                {(suggestion.profilePicture || suggestion.thumbnail) && (
                  <img
                    src={suggestion.profilePicture || suggestion.thumbnail}
                    alt={getSuggestionText(suggestion)}
                    className={`w-10 h-10 ${suggestion.type === 'artist' ? 'rounded-full' : 'rounded'} object-cover`}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {highlightMatch(getSuggestionText(suggestion), query)}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {getSuggestionSubtitle(suggestion)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No results message */}
      {showDropdown && !isLoading && query.length >= 2 && suggestions.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 px-4 py-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="mt-2 text-sm text-gray-600">No results found for "{query}"</p>
          <p className="text-xs text-gray-500 mt-1">Try different keywords</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
