/**
 * Search Routes
 * 
 * Endpoints:
 * - GET /api/search/artists - Search artists with filters
 * - GET /api/search/workshops - Search workshops with filters
 * - GET /api/search/autocomplete - Get search suggestions
 */

import express from 'express';
import { searchArtists, searchWorkshops, autocomplete } from '../controllers/searchController.js';

const router = express.Router();

/**
 * @route   GET /api/search/artists
 * @desc    Search artists with advanced filters
 * @access  Public
 * 
 * Query Parameters:
 * - q: Search query (name, bio, category, city)
 * - category: Art category filter
 * - subcategories: Comma-separated subcategories
 * - city: City name
 * - lat, lng, radius: Geo search (radius in km)
 * - minPrice, maxPrice: Price range (₹/hour)
 * - minRating: Minimum rating (0-5)
 * - available: Filter by availability (true/false)
 * - mode: online/studio/both
 * - experienceYears: Minimum years of experience
 * - sortBy: relevance/rating/price/distance/popularity
 * - page: Page number (default: 1)
 * - limit: Results per page (default: 20)
 * 
 * Example:
 * /api/search/artists?q=kathak&city=Jaipur&minRating=4&sortBy=rating&page=1
 */
router.get('/artists', searchArtists);

/**
 * @route   GET /api/search/workshops
 * @desc    Search workshops with advanced filters
 * @access  Public
 * 
 * Query Parameters:
 * - q: Search query
 * - category, subcategory, tags
 * - city: City name
 * - lat, lng, radius: Geo search
 * - minPrice, maxPrice: Price range
 * - minRating: Minimum rating
 * - mode: online/offline/hybrid
 * - targetAudience: Beginners/Intermediate/Advanced/All Levels
 * - dateFrom, dateTo: Date range (ISO format)
 * - hasSeats: Show only workshops with available seats
 * - certificateProvided, materialProvided: Boolean filters
 * - sortBy: relevance/rating/price/date/popularity
 * - page, limit: Pagination
 * 
 * Example:
 * /api/search/workshops?q=painting&city=Mumbai&dateFrom=2025-12-10&hasSeats=true
 */
router.get('/workshops', searchWorkshops);

/**
 * @route   GET /api/search/autocomplete
 * @desc    Get search suggestions (typeahead)
 * @access  Public
 * 
 * Query Parameters:
 * - q: Partial query (min 2 chars)
 * - type: all/artists/workshops
 * 
 * Example:
 * /api/search/autocomplete?q=kath&type=all
 */
router.get('/autocomplete', autocomplete);

export default router;
