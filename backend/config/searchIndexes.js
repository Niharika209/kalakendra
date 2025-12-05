/**
 * MongoDB Atlas Search Index Definitions
 * 
 * To set up these indexes:
 * 1. Go to MongoDB Atlas Dashboard
 * 2. Navigate to your cluster → Search tab
 * 3. Click "Create Search Index"
 * 4. Choose "JSON Editor"
 * 5. Paste the corresponding index definition below
 * 6. Name it as specified (e.g., "artists_search", "workshops_search")
 * 
 * OR use the MongoDB CLI/API to create programmatically
 */

export const artistsSearchIndex = {
  "name": "artists_search",
  "mappings": {
    "dynamic": false,
    "fields": {
      // Full-text search fields with autocomplete support
      "name": {
        "type": "string",
        "analyzer": "lucene.standard",
        "searchAnalyzer": "lucene.standard",
        "multi": {
          "autocomplete": {
            "type": "autocomplete",
            "analyzer": "lucene.standard",
            "tokenization": "edgeGram",
            "minGrams": 2,
            "maxGrams": 15,
            "foldDiacritics": true
          },
          "keyword": {
            "type": "stringFacet" // For exact matching and faceting
          }
        }
      },
      "bio": {
        "type": "string",
        "analyzer": "lucene.standard"
      },
      "searchText": {
        "type": "string",
        "analyzer": "lucene.standard" // Combined text field for broad search
      },
      
      // Category fields for filtering
      "category": {
        "type": "stringFacet" // Enables faceted search
      },
      "subcategories": {
        "type": "stringFacet"
      },
      "specialization": {
        "type": "string",
        "analyzer": "lucene.standard",
        "multi": {
          "keyword": {
            "type": "stringFacet"
          }
        }
      },
      
      // Location fields
      "city": {
        "type": "stringFacet"
      },
      "locality": {
        "type": "string",
        "analyzer": "lucene.keyword" // Exact match for neighborhoods
      },
      "state": {
        "type": "stringFacet"
      },
      "coordinates": {
        "type": "geo" // Enables geospatial queries
      },
      
      // Numeric fields for filtering and sorting
      "pricePerHour": {
        "type": "number",
        "indexIntegers": true,
        "indexDoubles": true
      },
      "rating": {
        "type": "number",
        "indexDoubles": true
      },
      "reviewsCount": {
        "type": "number",
        "indexIntegers": true
      },
      "totalBookings": {
        "type": "number",
        "indexIntegers": true
      },
      "experienceYears": {
        "type": "number",
        "indexIntegers": true
      },
      
      // Availability fields
      "availabilitySettings.isAvailable": {
        "type": "boolean"
      },
      "availabilitySettings.modes": {
        "type": "stringFacet"
      },
      "availabilitySettings.nextAvailableDate": {
        "type": "date"
      },
      
      // Metadata
      "featured": {
        "type": "boolean"
      },
      "createdAt": {
        "type": "date"
      },
      "updatedAt": {
        "type": "date"
      }
    }
  }
};

export const workshopsSearchIndex = {
  "name": "workshops_search",
  "mappings": {
    "dynamic": false,
    "fields": {
      // Full-text search fields
      "title": {
        "type": "string",
        "analyzer": "lucene.standard",
        "multi": {
          "autocomplete": {
            "type": "autocomplete",
            "analyzer": "lucene.standard",
            "tokenization": "edgeGram",
            "minGrams": 2,
            "maxGrams": 15,
            "foldDiacritics": true
          },
          "keyword": {
            "type": "stringFacet"
          }
        }
      },
      "description": {
        "type": "string",
        "analyzer": "lucene.standard"
      },
      "searchText": {
        "type": "string",
        "analyzer": "lucene.standard"
      },
      
      // Category fields
      "category": {
        "type": "stringFacet"
      },
      "subcategory": {
        "type": "stringFacet"
      },
      "tags": {
        "type": "stringFacet"
      },
      "targetAudience": {
        "type": "stringFacet"
      },
      
      // Location fields
      "city": {
        "type": "stringFacet"
      },
      "locality": {
        "type": "string",
        "analyzer": "lucene.keyword"
      },
      "state": {
        "type": "stringFacet"
      },
      "mode": {
        "type": "stringFacet"
      },
      "coordinates": {
        "type": "geo"
      },
      
      // Numeric fields
      "price": {
        "type": "number",
        "indexIntegers": true,
        "indexDoubles": true
      },
      "discountedPrice": {
        "type": "number",
        "indexDoubles": true
      },
      "averageRating": {
        "type": "number",
        "indexDoubles": true
      },
      "reviewCount": {
        "type": "number",
        "indexIntegers": true
      },
      "enrolled": {
        "type": "number",
        "indexIntegers": true
      },
      "seatsAvailable": {
        "type": "number",
        "indexIntegers": true
      },
      "durationMinutes": {
        "type": "number",
        "indexIntegers": true
      },
      "viewCount": {
        "type": "number",
        "indexIntegers": true
      },
      "bookingCount": {
        "type": "number",
        "indexIntegers": true
      },
      
      // Date fields
      "date": {
        "type": "date"
      },
      "createdAt": {
        "type": "date"
      },
      
      // Boolean fields
      "isFullyBooked": {
        "type": "boolean"
      },
      "materialProvided": {
        "type": "boolean"
      },
      "certificateProvided": {
        "type": "boolean"
      },
      
      // Status
      "status": {
        "type": "stringFacet"
      }
    }
  }
};

/**
 * Custom Analyzers (Optional - for advanced text processing)
 * Add these if you need typo tolerance or language-specific search
 */
export const customAnalyzers = {
  "analyzers": [
    {
      "name": "artistNameAnalyzer",
      "charFilters": [],
      "tokenizer": {
        "type": "edgeGram",
        "minGram": 2,
        "maxGram": 15
      },
      "tokenFilters": [
        {
          "type": "lowercase"
        },
        {
          "type": "asciiFolding" // Handles diacritics (é → e)
        }
      ]
    }
  ]
};

/**
 * Search Query Builder Utilities
 */
export const buildSearchQuery = {
  // Compound query for multi-field search with filters
  compound: (searchTerm, filters = {}) => {
    const must = [];
    const filter = [];
    const should = [];
    
    // Text search across multiple fields
    if (searchTerm) {
      must.push({
        compound: {
          should: [
            {
              autocomplete: {
                query: searchTerm,
                path: "name.autocomplete",
                score: { boost: { value: 3 } } // Boost name matches
              }
            },
            {
              text: {
                query: searchTerm,
                path: ["name", "bio", "specialization", "searchText"],
                fuzzy: {
                  maxEdits: 1, // Typo tolerance
                  prefixLength: 2
                }
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
        text: {
          query: filters.category,
          path: "category"
        }
      });
    }
    
    // Subcategories filter
    if (filters.subcategories?.length) {
      filter.push({
        text: {
          query: filters.subcategories,
          path: "subcategories"
        }
      });
    }
    
    // City filter
    if (filters.city) {
      filter.push({
        text: {
          query: filters.city,
          path: "city"
        }
      });
    }
    
    // Price range
    if (filters.minPrice || filters.maxPrice) {
      filter.push({
        range: {
          path: "pricePerHour",
          gte: filters.minPrice || 0,
          lte: filters.maxPrice || Number.MAX_SAFE_INTEGER
        }
      });
    }
    
    // Rating filter
    if (filters.minRating) {
      filter.push({
        range: {
          path: "rating",
          gte: filters.minRating
        }
      });
    }
    
    // Availability
    if (filters.isAvailable !== undefined) {
      filter.push({
        equals: {
          path: "availabilitySettings.isAvailable",
          value: filters.isAvailable
        }
      });
    }
    
    // Mode (online/studio)
    if (filters.mode) {
      filter.push({
        text: {
          query: filters.mode,
          path: "availabilitySettings.modes"
        }
      });
    }
    
    // Geo-proximity search (near me)
    if (filters.coordinates && filters.radiusKm) {
      filter.push({
        geoWithin: {
          path: "coordinates",
          circle: {
            center: {
              type: "Point",
              coordinates: filters.coordinates // [longitude, latitude]
            },
            radius: filters.radiusKm * 1000 // Convert km to meters
          }
        }
      });
    }
    
    return {
      compound: {
        must: must.length > 0 ? must : undefined,
        filter: filter.length > 0 ? filter : undefined,
        should: should.length > 0 ? should : undefined
      }
    };
  }
};

export default {
  artistsSearchIndex,
  workshopsSearchIndex,
  customAnalyzers,
  buildSearchQuery
};
