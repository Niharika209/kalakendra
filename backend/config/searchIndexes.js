export const artistsSearchIndex = {
  "name": "artists_search",
  "mappings": {
    "dynamic": false,
    "fields": {
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
            "type": "stringFacet"
          }
        }
      },
      "bio": {
        "type": "string",
        "analyzer": "lucene.standard"
      },
      "searchText": {
        "type": "string",
        "analyzer": "lucene.standard"
      },
      "category": {
        "type": "stringFacet"
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
      "coordinates": {
        "type": "geo"
      },
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
      "availabilitySettings.isAvailable": {
        "type": "boolean"
      },
      "availabilitySettings.modes": {
        "type": "stringFacet"
      },
      "availabilitySettings.nextAvailableDate": {
        "type": "date"
      },
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
      "date": {
        "type": "date"
      },
      "createdAt": {
        "type": "date"
      },
      "isFullyBooked": {
        "type": "boolean"
      },
      "materialProvided": {
        "type": "boolean"
      },
      "certificateProvided": {
        "type": "boolean"
      },
      "status": {
        "type": "stringFacet"
      }
    }
  }
};

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
          "type": "asciiFolding"
        }
      ]
    }
  ]
};

export const buildSearchQuery = {
  compound: (searchTerm, filters = {}) => {
    const must = [];
    const filter = [];
    const should = [];
    
    if (searchTerm) {
      must.push({
        compound: {
          should: [
            {
              autocomplete: {
                query: searchTerm,
                path: "name.autocomplete",
                score: { boost: { value: 3 } }
              }
            },
            {
              text: {
                query: searchTerm,
                path: ["name", "bio", "specialization", "searchText"],
                fuzzy: {
                  maxEdits: 1,
                  prefixLength: 2
                }
              }
            }
          ],
          minimumShouldMatch: 1
        }
      });
    }
    
    if (filters.category) {
      filter.push({
        text: {
          query: filters.category,
          path: "category"
        }
      });
    }
    
    if (filters.subcategories?.length) {
      filter.push({
        text: {
          query: filters.subcategories,
          path: "subcategories"
        }
      });
    }
    
    if (filters.city) {
      filter.push({
        text: {
          query: filters.city,
          path: "city"
        }
      });
    }
    
    if (filters.minPrice || filters.maxPrice) {
      filter.push({
        range: {
          path: "pricePerHour",
          gte: filters.minPrice || 0,
          lte: filters.maxPrice || Number.MAX_SAFE_INTEGER
        }
      });
    }
    
    if (filters.minRating) {
      filter.push({
        range: {
          path: "rating",
          gte: filters.minRating
        }
      });
    }
    
    if (filters.isAvailable !== undefined) {
      filter.push({
        equals: {
          path: "availabilitySettings.isAvailable",
          value: filters.isAvailable
        }
      });
    }
    
    if (filters.mode) {
      filter.push({
        text: {
          query: filters.mode,
          path: "availabilitySettings.modes"
        }
      });
    }
    
    if (filters.coordinates && filters.radiusKm) {
      filter.push({
        geoWithin: {
          path: "coordinates",
          circle: {
            center: {
              type: "Point",
              coordinates: filters.coordinates
            },
            radius: filters.radiusKm * 1000
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
