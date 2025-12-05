/**
 * Search Controller
 * 
 * Handles all search operations for artists and workshops.
 * Features:
 * - Multi-field keyword search with autocomplete
 * - Category, price, rating, location filters
 * - Geo-proximity search (near me)
 * - Availability filtering
 * - Multi-signal ranking
 * - Faceted search results
 * - Pagination
 */

import Artist from '../models/Artist.js';
import Workshop from '../models/Workshop.js';

/**
 * Search Artists with Advanced Filters
 * 
 * Query Parameters:
 * - q: Search keyword (name, bio, category, city)
 * - category: Art form category
 * - subcategories: Comma-separated subcategories
 * - city: City name
 * - lat, lng, radius: Geo-proximity (radius in km)
 * - minPrice, maxPrice: Price range
 * - minRating: Minimum rating (0-5)
 * - available: true/false for immediate availability
 * - mode: online/studio/both
 * - sortBy: relevance/rating/price/distance/popularity
 * - page, limit: Pagination
 */
export const searchArtists = async (req, res) => {
  try {
    const {
      q = '',
      category,
      subcategories,
      city,
      minPrice,
      maxPrice,
      minRating,
      available,
      experienceYears,
      sortBy = 'relevance',
      page = 1,
      limit = 20
    } = req.query;

    // Build filter query (fallback to regular queries until Atlas Search indexes are created)
    const filter = {};
    
    // Text search
    if (q) {
      const searchRegex = new RegExp(q, 'i');
      filter.$or = [
        { name: searchRegex },
        { bio: searchRegex },
        { category: searchRegex },
        { city: searchRegex },
        { searchText: searchRegex }
      ];
    }
    
    // Category filter
    if (category) {
      filter.category = category;
    }
    
    // Subcategories filter
    if (subcategories) {
      filter.subcategories = { $in: subcategories.split(',') };
    }
    
    // City filter
    if (city) {
      filter.city = new RegExp(city, 'i');
    }
    
    // Price range
    if (minPrice || maxPrice) {
      filter.pricePerHour = {};
      if (minPrice) filter.pricePerHour.$gte = parseFloat(minPrice);
      if (maxPrice) filter.pricePerHour.$lte = parseFloat(maxPrice);
    }
    
    // Rating filter
    if (minRating) {
      filter.rating = { $gte: parseFloat(minRating) };
    }
    
    // Availability filter
    if (available === 'true') {
      filter['availabilitySettings.isAvailable'] = true;
    }
    
    // Experience filter
    if (experienceYears) {
      filter.experienceYears = { $gte: parseInt(experienceYears) };
    }
    
    // Build sort
    let sort = {};
    switch (sortBy) {
      case 'rating':
      case 'top_rated':
        // For rating sort, prioritize artists with reviews
        // Artists with 0 reviews will appear at the end
        sort = { rating: -1, reviewsCount: -1, totalBookings: -1 };
        // Optional: Add filter to exclude 0-rated artists
        if (!minRating) {
          filter.rating = { $gt: 0 }; // Exclude unrated artists
        }
        break;
      case 'price_low':
        sort = { pricePerHour: 1, rating: -1 };
        break;
      case 'price_high':
        sort = { pricePerHour: -1, rating: -1 };
        break;
      case 'popularity':
      case 'popular':
        sort = { totalBookings: -1, reviewsCount: -1, rating: -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'available_now':
        sort = { 'availabilitySettings.isAvailable': -1, rating: -1, totalBookings: -1 };
        break;
      case 'recommended':
      default:
        // Recommended: Featured first, then rated highly, then available, then popular
        sort = { featured: -1, featuredOrder: 1, rating: -1, 'availabilitySettings.isAvailable': -1, totalBookings: -1 };
    }
    
    // Execute query
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const results = await Artist.find(filter)
      .select('name category subcategories city locality pricePerHour rating reviewsCount totalBookings imageUrl profilePicture experienceYears availabilitySettings')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    // Get total count
    const total = await Artist.countDocuments(filter);
    const totalPages = Math.ceil(total / parseInt(limit));
    
    // Get facets (filter counts)
    const facets = {};
    
    // Category facets
    const categoryFacets = await Artist.aggregate([
      { $match: filter },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    facets.category = categoryFacets;
    
    res.json({
      success: true,
      data: {
        results,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages,
        hasMore: parseInt(page) < totalPages,
        facets
      }
    });
    
  } catch (error) {
    console.error('Search artists error:', error);
    res.status(500).json({
      success: false,
      message: 'Artist search failed',
      error: error.message
    });
  }
};

/**
 * Search Workshops with Advanced Filters
 */
export const searchWorkshops = async (req, res) => {
  try {
    const {
      q = '',
      category,
      subcategory,
      tags,
      city,
      minPrice,
      maxPrice,
      minRating,
      mode,
      targetAudience,
      dateFrom,
      dateTo,
      hasSeats,
      certificateProvided,
      materialProvided,
      sortBy = 'relevance',
      page = 1,
      limit = 20
    } = req.query;

    // Build filter query (fallback to regular queries until Atlas Search indexes are created)
    const filter = {};
    
    // Text search
    if (q) {
      const searchRegex = new RegExp(q, 'i');
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { city: searchRegex },
        { searchText: searchRegex }
      ];
    }
    
    // Category filter
    if (category) {
      filter.category = category;
    }
    
    // Subcategory filter
    if (subcategory) {
      filter.subcategory = subcategory;
    }
    
    // Tags filter
    if (tags) {
      filter.tags = { $in: tags.split(',') };
    }
    
    // City filter
    if (city) {
      filter.city = new RegExp(city, 'i');
    }
    
    // Price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    
    // Rating filter
    if (minRating) {
      filter.rating = { $gte: parseFloat(minRating) };
    }
    
    // Mode filter
    if (mode) {
      filter.mode = mode.toLowerCase();
    }
    
    // Target audience filter
    if (targetAudience) {
      filter.targetAudience = targetAudience;
    }
    
    // Date range filter
    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom);
      if (dateTo) filter.date.$lte = new Date(dateTo);
    }
    
    // Seats available filter
    if (hasSeats === 'true') {
      filter.seatsAvailable = { $gt: 0 };
    }
    
    // Certificate filter
    if (certificateProvided === 'true') {
      filter.certificateProvided = true;
    }
    
    // Materials filter
    if (materialProvided === 'true') {
      filter.materialProvided = true;
    }
    
    // Build sort
    let sort = {};
    switch (sortBy) {
      case 'rating':
      case 'top_rated':
        sort = { averageRating: -1, reviewCount: -1, bookingCount: -1 };
        // Filter out unrated workshops for better results
        if (!minRating) {
          filter.averageRating = { $gt: 0 };
        }
        break;
      case 'price_low':
        sort = { price: 1, averageRating: -1 };
        break;
      case 'price_high':
        sort = { price: -1, averageRating: -1 };
        break;
      case 'popularity':
      case 'popular':
        sort = { enrolled: -1, bookingCount: -1, averageRating: -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'date':
      case 'date_soon':
        sort = { date: 1, seatsAvailable: -1 };
        break;
      case 'available_now':
        sort = { isFullyBooked: 1, seatsAvailable: -1, averageRating: -1 };
        break;
      case 'recommended':
      default:
        // Recommended: Featured artist first, then rating, then seats available
        sort = { averageRating: -1, enrolled: -1, seatsAvailable: -1 };
    }
    
    // Execute query
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const results = await Workshop.find(filter)
      .select('title description category subcategory city mode date price discountedPrice averageRating reviewCount enrolled seatsAvailable maxParticipants imageUrl thumbnailUrl certificateProvided materialProvided targetAudience tags artist bookingCount isFullyBooked')
      .populate('artist', 'name imageUrl thumbnailUrl rating featured')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    // Get total count
    const total = await Workshop.countDocuments(filter);
    const totalPages = Math.ceil(total / parseInt(limit));
    
    // Get facets (filter counts)
    const facets = {};
    
    // Category facets
    const categoryFacets = await Workshop.aggregate([
      { $match: filter },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    facets.category = categoryFacets;
    
    res.json({
      success: true,
      data: {
        results,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages,
        hasMore: parseInt(page) < totalPages,
        facets
      }
    });
    
  } catch (error) {
    console.error('Search workshops error:', error);
    res.status(500).json({
      success: false,
      message: 'Workshop search failed',
      error: error.message
    });
  }
};

/**
 * Autocomplete / Typeahead Suggestions
 */
export const autocomplete = async (req, res) => {
  try {
    const { q, type = 'all' } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({ success: true, data: { suggestions: [] } });
    }
    
    const suggestions = [];
    const searchRegex = new RegExp(q, 'i');
    
    if (type === 'all' || type === 'artists') {
      // Use regular query with text search until Atlas Search indexes are created
      const artists = await Artist.find({
        $or: [
          { name: searchRegex },
          { category: searchRegex },
          { city: searchRegex },
          { searchText: searchRegex }
        ]
      })
        .select('_id name category city imageUrl profilePicture rating')
        .limit(5)
        .lean();
      
      // Format results with type field
      const formattedArtists = artists.map(a => ({
        type: 'artist',
        _id: a._id,
        name: a.name,
        category: a.category,
        city: a.city,
        imageUrl: a.imageUrl || a.profilePicture,
        rating: a.rating
      }));
      
      suggestions.push(...formattedArtists);
    }
    
    if (type === 'all' || type === 'workshops') {
      // Use regular query with text search until Atlas Search indexes are created
      const workshops = await Workshop.find({
        $or: [
          { title: searchRegex },
          { category: searchRegex },
          { city: searchRegex },
          { searchText: searchRegex }
        ]
      })
        .select('_id title category city date imageUrl thumbnail price rating')
        .limit(5)
        .lean();
      
      // Format results with type field
      const formattedWorkshops = workshops.map(w => ({
        type: 'workshop',
        _id: w._id,
        title: w.title,
        category: w.category,
        city: w.city,
        date: w.date,
        imageUrl: w.imageUrl || w.thumbnail,
        price: w.price,
        rating: w.rating
      }));
      
      suggestions.push(...formattedWorkshops);
    }
    
    res.json({
      success: true,
      data: { suggestions }
    });
    
  } catch (error) {
    console.error('Autocomplete error:', error);
    res.status(500).json({
      success: false,
      message: 'Autocomplete failed',
      error: error.message
    });
  }
};

/**
 * Helper: Build Atlas Search stage for artists
 */
function buildArtistSearchStage(query, filters) {
  const must = [];
  const filter = [];
  const should = [];
  
  // Text search with autocomplete and fuzzy matching
  if (query && query.trim()) {
    must.push({
      compound: {
        should: [
          {
            autocomplete: {
              query,
              path: 'name',
              score: { boost: { value: 5 } }, // Boost name matches
              fuzzy: { maxEdits: 1, prefixLength: 2 }
            }
          },
          {
            text: {
              query,
              path: ['name', 'bio', 'specialization', 'searchText'],
              score: { boost: { value: 2 } },
              fuzzy: { maxEdits: 1 }
            }
          },
          {
            text: {
              query,
              path: ['city', 'locality'],
              score: { boost: { value: 3 } } // Boost location matches
            }
          }
        ],
        minimumShouldMatch: 1
      }
    });
  }
  
  // Category filter
  if (filters.category) {
    filter.push({
      text: { query: filters.category, path: 'category' }
    });
  }
  
  // Subcategories filter
  if (filters.subcategories?.length) {
    filter.push({
      text: { query: filters.subcategories, path: 'subcategories' }
    });
  }
  
  // City filter
  if (filters.city) {
    filter.push({
      text: { query: filters.city, path: 'city' }
    });
  }
  
  // Geo-proximity filter
  if (filters.lat && filters.lng && filters.radius) {
    filter.push({
      geoWithin: {
        path: 'coordinates',
        circle: {
          center: {
            type: 'Point',
            coordinates: [filters.lng, filters.lat]
          },
          radius: filters.radius * 1000 // km to meters
        }
      }
    });
  }
  
  // Price range
  if (filters.minPrice || filters.maxPrice) {
    filter.push({
      range: {
        path: 'pricePerHour',
        gte: filters.minPrice || 0,
        lte: filters.maxPrice || Number.MAX_SAFE_INTEGER
      }
    });
  }
  
  // Rating filter
  if (filters.minRating) {
    filter.push({
      range: { path: 'rating', gte: filters.minRating }
    });
  }
  
  // Availability
  if (filters.available) {
    filter.push({
      equals: { path: 'availabilitySettings.isAvailable', value: true }
    });
  }
  
  // Mode filter
  if (filters.mode) {
    filter.push({
      text: { query: filters.mode, path: 'availabilitySettings.modes' }
    });
  }
  
  // Experience years
  if (filters.experienceYears) {
    filter.push({
      range: { path: 'experienceYears', gte: filters.experienceYears }
    });
  }
  
  // Boost featured artists
  should.push({
    equals: {
      path: 'featured',
      value: true,
      score: { boost: { value: 2 } }
    }
  });
  
  return {
    index: 'artists_search',
    compound: {
      must: must.length > 0 ? must : undefined,
      filter: filter.length > 0 ? filter : undefined,
      should: should.length > 0 ? should : undefined
    }
  };
}

/**
 * Helper: Build Atlas Search stage for workshops
 */
function buildWorkshopSearchStage(query, filters) {
  const must = [];
  const filter = [];
  const should = [];
  
  // Text search
  if (query && query.trim()) {
    must.push({
      compound: {
        should: [
          {
            autocomplete: {
              query,
              path: 'title',
              score: { boost: { value: 5 } },
              fuzzy: { maxEdits: 1 }
            }
          },
          {
            text: {
              query,
              path: ['title', 'description', 'searchText'],
              score: { boost: { value: 2 } },
              fuzzy: { maxEdits: 1 }
            }
          }
        ],
        minimumShouldMatch: 1
      }
    });
  }
  
  // Category/subcategory filters
  if (filters.category) {
    filter.push({ text: { query: filters.category, path: 'category' } });
  }
  if (filters.subcategory) {
    filter.push({ text: { query: filters.subcategory, path: 'subcategory' } });
  }
  if (filters.tags?.length) {
    filter.push({ text: { query: filters.tags, path: 'tags' } });
  }
  
  // Location filters
  if (filters.city) {
    filter.push({ text: { query: filters.city, path: 'city' } });
  }
  if (filters.lat && filters.lng && filters.radius) {
    filter.push({
      geoWithin: {
        path: 'coordinates',
        circle: {
          center: { type: 'Point', coordinates: [filters.lng, filters.lat] },
          radius: filters.radius * 1000
        }
      }
    });
  }
  
  // Price range
  if (filters.minPrice || filters.maxPrice) {
    filter.push({
      range: {
        path: 'price',
        gte: filters.minPrice || 0,
        lte: filters.maxPrice || Number.MAX_SAFE_INTEGER
      }
    });
  }
  
  // Rating
  if (filters.minRating) {
    filter.push({ range: { path: 'averageRating', gte: filters.minRating } });
  }
  
  // Mode
  if (filters.mode) {
    filter.push({ text: { query: filters.mode, path: 'mode' } });
  }
  
  // Target audience
  if (filters.targetAudience) {
    filter.push({ text: { query: filters.targetAudience, path: 'targetAudience' } });
  }
  
  // Date range
  if (filters.dateFrom || filters.dateTo) {
    filter.push({
      range: {
        path: 'date',
        gte: filters.dateFrom || new Date(),
        lte: filters.dateTo || new Date('2099-12-31')
      }
    });
  }
  
  // Seat availability
  if (filters.hasSeats) {
    filter.push({ equals: { path: 'isFullyBooked', value: false } });
  }
  
  // Certificate/materials
  if (filters.certificateProvided) {
    filter.push({ equals: { path: 'certificateProvided', value: true } });
  }
  if (filters.materialProvided) {
    filter.push({ equals: { path: 'materialProvided', value: true } });
  }
  
  // Only active workshops
  filter.push({ text: { query: 'active', path: 'status' } });
  
  return {
    index: 'workshops_search',
    compound: {
      must: must.length > 0 ? must : undefined,
      filter: filter.length > 0 ? filter : undefined,
      should: should.length > 0 ? should : undefined
    }
  };
}

/**
 * Helper: Calculate multi-signal ranking score for artists
 */
function calculateArtistRankingScore() {
  return {
    $add: [
      { $multiply: ['$searchScore', 0.4] },        // 40% text relevance
      { $multiply: ['$rating', 4] },               // 20% rating (scaled to 0-20)
      { $multiply: ['$totalBookings', 0.01] },     // 10% popularity
      { $multiply: ['$reviewsCount', 0.05] },      // 5% social proof
      { $multiply: ['$experienceYears', 0.5] },    // 5% experience
      {
        $cond: [
          '$availabilitySettings.isAvailable',
          10,                                       // 10% availability bonus
          0
        ]
      },
      {
        $cond: ['$featured', 10, 0]                // 10% featured bonus
      }
    ]
  };
}

/**
 * Helper: Calculate ranking score for workshops
 */
function calculateWorkshopRankingScore() {
  return {
    $add: [
      { $multiply: ['$searchScore', 0.4] },        // 40% text relevance
      { $multiply: ['$averageRating', 5] },        // 25% rating
      { $multiply: ['$reviewCount', 0.2] },        // 10% social proof
      { $multiply: ['$artistInfo.rating', 3] },    // 15% artist reputation
      {
        $cond: [
          { $gt: ['$seatsAvailable', 0] },
          5,                                        // 5% seat availability
          0
        ]
      },
      {
        $cond: ['$certificateProvided', 3, 0]      // 3% certificate bonus
      },
      {
        $cond: ['$materialProvided', 2, 0]         // 2% materials bonus
      }
    ]
  };
}

/**
 * Helper: Build sort stage based on sortBy parameter
 */
function buildSortStage(sortBy, hasLocation) {
  switch (sortBy) {
    case 'rating':
      return { rating: -1, reviewsCount: -1 };
    case 'price':
      return { pricePerHour: 1, rating: -1 };
    case 'price_desc':
      return { pricePerHour: -1, rating: -1 };
    case 'popularity':
      return { totalBookings: -1, rating: -1 };
    case 'distance':
      return hasLocation ? { distance: 1 } : { rankingScore: -1 };
    case 'date':
      return { date: 1 };
    case 'relevance':
    default:
      return { rankingScore: -1, rating: -1 };
  }
}

/**
 * Helper: Get faceted search results (category counts, etc.)
 */
async function getArtistFacets(query, filters) {
  try {
    const facetPipeline = [];
    
    if (query) {
      facetPipeline.push({
        $search: {
          index: 'artists_search',
          text: { query, path: ['name', 'bio', 'searchText'] }
        }
      });
    }
    
    facetPipeline.push({
      $facet: {
        categories: [
          { $group: { _id: '$category', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ],
        cities: [
          { $group: { _id: '$city', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ],
        priceRanges: [
          {
            $bucket: {
              groupBy: '$pricePerHour',
              boundaries: [0, 500, 1000, 2000, 5000, 10000],
              default: '10000+',
              output: { count: { $sum: 1 } }
            }
          }
        ],
        modes: [
          { $unwind: '$availabilitySettings.modes' },
          { $group: { _id: '$availabilitySettings.modes', count: { $sum: 1 } } }
        ]
      }
    });
    
    const result = await Artist.aggregate(facetPipeline);
    return result[0] || {};
  } catch (error) {
    console.error('Facet error:', error);
    return {};
  }
}

async function getWorkshopFacets(query, filters) {
  try {
    const facetPipeline = [];
    
    if (query) {
      facetPipeline.push({
        $search: {
          index: 'workshops_search',
          text: { query, path: ['title', 'description'] }
        }
      });
    }
    
    facetPipeline.push({
      $facet: {
        categories: [
          { $group: { _id: '$category', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ],
        cities: [
          { $group: { _id: '$city', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ],
        modes: [
          { $group: { _id: '$mode', count: { $sum: 1 } } }
        ],
        targetAudiences: [
          { $group: { _id: '$targetAudience', count: { $sum: 1 } } }
        ]
      }
    });
    
    const result = await Workshop.aggregate(facetPipeline);
    return result[0] || {};
  } catch (error) {
    console.error('Facet error:', error);
    return {};
  }
}

export default {
  searchArtists,
  searchWorkshops,
  autocomplete
};
