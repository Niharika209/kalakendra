import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import SearchFilters from '../components/SearchFilters';
import ArtistCard from '../components/ArtistCard';
import WorkshopCard from '../components/WorkshopCard';
import { searchArtists, searchWorkshops } from '../services/searchService';

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const initialQuery = searchParams.get('q') || '';
  const initialType = searchParams.get('type') || 'all';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchType, setSearchType] = useState(initialType);
  const [filters, setFilters] = useState({});
  const [artistResults, setArtistResults] = useState([]);
  const [workshopResults, setWorkshopResults] = useState([]);
  const [facets, setFacets] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('relevance');
  const [paginationMode, setPaginationMode] = useState('pagination');
  
  const [artistPage, setArtistPage] = useState(1);
  const [workshopPage, setWorkshopPage] = useState(1);
  const [artistTotalPages, setArtistTotalPages] = useState(1);
  const [workshopTotalPages, setWorkshopTotalPages] = useState(1);
  const [hasMoreArtists, setHasMoreArtists] = useState(false);
  const [hasMoreWorkshops, setHasMoreWorkshops] = useState(false);
  
  const [showFilters, setShowFilters] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  
  const observer = useRef();
  const lastArtistRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMoreArtists && paginationMode === 'infinite') {
        setArtistPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMoreArtists, paginationMode]);
  
  const lastWorkshopRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMoreWorkshops && paginationMode === 'infinite') {
        setWorkshopPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMoreWorkshops, paginationMode]);

  const performSearch = async (isLoadMore = false) => {
    if (!searchQuery && Object.keys(filters).length === 0) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const searchParams = {
        q: searchQuery,
        ...filters,
        sortBy,
        limit: 12
      };

      if (searchType === 'all' || searchType === 'artists') {
        const artistParams = { 
          ...searchParams, 
          page: artistPage 
        };
        const artistData = await searchArtists(artistParams);
        
        if (artistData.success) {
          if (isLoadMore && paginationMode === 'infinite') {
            setArtistResults(prev => [...prev, ...artistData.data.results]);
          } else {
            setArtistResults(artistData.data.results);
          }
          setArtistTotalPages(artistData.data.totalPages);
          setHasMoreArtists(artistData.data.hasMore);
          if (artistData.data.facets) {
            setFacets(prev => ({ ...prev, ...artistData.data.facets }));
          }
        }
      }

      if (searchType === 'all' || searchType === 'workshops') {
        const workshopParams = { 
          ...searchParams, 
          page: workshopPage 
        };
        const workshopData = await searchWorkshops(workshopParams);
        
        if (workshopData.success) {
          if (isLoadMore && paginationMode === 'infinite') {
            setWorkshopResults(prev => [...prev, ...workshopData.data.results]);
          } else {
            setWorkshopResults(workshopData.data.results);
          }
          setWorkshopTotalPages(workshopData.data.totalPages);
          setHasMoreWorkshops(workshopData.data.hasMore);
          if (workshopData.data.facets) {
            setFacets(prev => ({ ...prev, ...workshopData.data.facets }));
          }
        }
      }
    } catch (err) {
      setError('Failed to fetch search results. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (artistPage === 1 && workshopPage === 1) {
      performSearch(false);
    } else {
      performSearch(true);
    }
  }, [searchQuery, filters, sortBy, artistPage, workshopPage]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (searchType) params.set('type', searchType);
    setSearchParams(params);
  }, [searchQuery, searchType]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setArtistPage(1);
    setWorkshopPage(1);
    setArtistResults([]);
    setWorkshopResults([]);
  };

  const handleFilterReset = () => {
    setFilters({});
    setArtistPage(1);
    setWorkshopPage(1);
    setArtistResults([]);
    setWorkshopResults([]);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setArtistPage(1);
    setWorkshopPage(1);
    setArtistResults([]);
    setWorkshopResults([]);
  };

  const handleArtistPageChange = (newPage) => {
    setArtistPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWorkshopPageChange = (newPage) => {
    setWorkshopPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalResults = artistResults.length + workshopResults.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Search Bar */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <SearchBar
            placeholder="Search artists, workshops, locations..."
            onSearch={(query) => {
              setSearchQuery(query);
              setArtistPage(1);
              setWorkshopPage(1);
            }}
            type={searchType}
            className="max-w-2xl mx-auto"
          />
          
          {/* Type Tabs */}
          <div className="flex items-center justify-center space-x-4 mt-4">
            <button
              onClick={() => setSearchType('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                searchType === 'all'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSearchType('artists')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                searchType === 'artists'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Artists
            </button>
            <button
              onClick={() => setSearchType('workshops')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                searchType === 'workshops'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Workshops
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <SearchFilters
              type={searchType}
              filters={filters}
              facets={facets}
              onFilterChange={handleFilterChange}
              onReset={handleFilterReset}
            />
          </div>

          {/* Results Section */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
                
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">{totalResults}</span> results found
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Pagination Mode Toggle */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPaginationMode('pagination')}
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      paginationMode === 'pagination'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Pages
                  </button>
                  <button
                    onClick={() => setPaginationMode('infinite')}
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      paginationMode === 'infinite'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Scroll
                  </button>
                </div>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="relevance">Most Relevant</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="popularity">Most Popular</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && artistResults.length === 0 && workshopResults.length === 0 && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin h-12 w-12 border-4 border-yellow-500 border-t-transparent rounded-full"></div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && totalResults === 0 && (
              <div className="text-center py-12">
                <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No results found</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <button
                  onClick={handleFilterReset}
                  className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Artists Results */}
            {(searchType === 'all' || searchType === 'artists') && artistResults.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Artists</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {artistResults.map((artist, index) => (
                    <div
                      key={artist._id}
                      ref={index === artistResults.length - 1 ? lastArtistRef : null}
                    >
                      <ArtistCard artist={artist} />
                    </div>
                  ))}
                </div>
                
                {/* Artists Pagination */}
                {paginationMode === 'pagination' && artistTotalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 mt-8">
                    <button
                      onClick={() => handleArtistPageChange(artistPage - 1)}
                      disabled={artistPage === 1}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    <div className="flex items-center space-x-1">
                      {[...Array(Math.min(artistTotalPages, 5))].map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handleArtistPageChange(pageNum)}
                            className={`px-3 py-1 rounded text-sm font-medium ${
                              artistPage === pageNum
                                ? 'bg-yellow-500 text-white'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => handleArtistPageChange(artistPage + 1)}
                      disabled={artistPage === artistTotalPages}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Workshops Results */}
            {(searchType === 'all' || searchType === 'workshops') && workshopResults.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Workshops</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {workshopResults.map((workshop, index) => (
                    <div
                      key={workshop._id}
                      ref={index === workshopResults.length - 1 ? lastWorkshopRef : null}
                    >
                      <WorkshopCard workshop={workshop} />
                    </div>
                  ))}
                </div>
                
                {/* Workshops Pagination */}
                {paginationMode === 'pagination' && workshopTotalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 mt-8">
                    <button
                      onClick={() => handleWorkshopPageChange(workshopPage - 1)}
                      disabled={workshopPage === 1}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    <div className="flex items-center space-x-1">
                      {[...Array(Math.min(workshopTotalPages, 5))].map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handleWorkshopPageChange(pageNum)}
                            className={`px-3 py-1 rounded text-sm font-medium ${
                              workshopPage === pageNum
                                ? 'bg-yellow-500 text-white'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => handleWorkshopPageChange(workshopPage + 1)}
                      disabled={workshopPage === workshopTotalPages}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Infinite Scroll Loading */}
            {paginationMode === 'infinite' && isLoading && totalResults > 0 && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-yellow-500 border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
