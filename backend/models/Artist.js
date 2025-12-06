import mongoose from "mongoose";

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed later
  
  // Categories and specialization (enhanced for search)
  category: { type: String, required: true }, // primary artform (e.g., "Dance", "Music")
  subcategories: [{ type: String }], // e.g., ["Classical", "Bharatanatyam", "Kathak"]
  specialization: { type: String }, // Short title, e.g., "Classical Dance Instructor"
  
  bio: { type: String },
  
  // Location (enhanced with geo-coordinates and structured address)
  location: { type: String, required: true }, // Full address (backward compatible)
  city: { type: String, index: true }, // e.g., "Jaipur", "Mumbai"
  locality: { type: String }, // Neighborhood, e.g., "Malviya Nagar"
  state: { type: String },
  country: { type: String, default: "India" },
  coordinates: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' } // [longitude, latitude]
  },
  
  // Pricing and experience
  pricePerHour: { type: Number, required: true },
  experienceYears: { type: Number, default: 0 },
  
  // Availability calendar (enhanced for search)
  availability: [{
    date: Date,
    slots: [String] // e.g., ["09:00-11:00", "14:00-16:00"]
  }],
  
  // Availability metadata for quick filtering
  availabilitySettings: {
    isAvailable: { type: Boolean, default: true },
    modes: [{ type: String, enum: ['online', 'studio', 'both'], default: 'both' }],
    daysAvailable: [{ type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }],
    nextAvailableDate: { type: Date } // Cached field updated via background job
  },

  // Featured / homepage
  featured: { type: Boolean, default: false },
  featuredOrder: { type: Number, default: 0 },

  // Images and media
  imageUrl: { type: String, default: null },        // full profile image (absolute URL)
  thumbnailUrl: { type: String, default: null },    // small thumb for cards
  gallery: [{                                       // gallery items (images and videos)
    url: { type: String, required: false },  // Not required to avoid validation issues with partial data
    type: { type: String, enum: ['image', 'video'], default: 'image' },
    uploadedAt: { type: Date, default: Date.now }
  }],
  imageMetadata: {
    width: Number,
    height: Number,
    sizeBytes: Number,
    format: String,
    uploadedAt: Date,
  },

  // Public stats (enhanced)
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewsCount: { type: Number, default: 0 },
  totalBookings: { type: Number, default: 0 }, // For popularity ranking
  responseRate: { type: Number, default: 0, min: 0, max: 100 }, // Response rate percentage
  specialties: [{ type: String }],
  
  // Search optimization
  searchText: { type: String }, // Concatenated text for full-text search (auto-generated)
  
  // Videos and testimonials for profile page
  videos: [{
    title: String,
    thumbnailUrl: String,
    url: String,
    duration: String,
    views: { type: Number, default: 0 }
  }],
  testimonials: [{
    name: String,
    rating: Number,
    text: String,
    date: Date
  }],
  // Demo session settings
  demoSessionSettings: {
    enabled: { type: Boolean, default: false },
    offersLive: { type: Boolean, default: false },
    offersRecorded: { type: Boolean, default: false },
    recordedSessionUrl: { type: String, default: null }, // URL to pre-recorded demo
    sessionTitle: { type: String, default: 'Demo Session' },
    demoDescription: { type: String, default: '' },
    recurringSchedule: [{ // Weekly recurring schedule
      day: { type: String, required: true }, // 'Monday', 'Tuesday', etc.
      time: { type: String, required: true } // '10:00', '14:30', etc.
    }],
    liveSessionSlots: [{
      date: { type: String, required: true },
      time: { type: String, required: true },
      available: { type: Boolean, default: true },
      bookedBy: { type: String, default: null } // Learner email
    }]
  },
  refreshTokens: { type: [String], default: [] }
}, { timestamps: true });

// Indexes for fast featured queries and lookups
artistSchema.index({ featured: 1, featuredOrder: 1, updatedAt: -1 });
artistSchema.index({ name: 'text', bio: 'text', specialties: 'text', searchText: 'text' });
artistSchema.index({ city: 1, category: 1 }); // Common filter combination
artistSchema.index({ rating: -1, totalBookings: -1 }); // For popularity sorting
artistSchema.index({ 'coordinates': '2dsphere' }); // Geospatial queries
artistSchema.index({ 'availabilitySettings.isAvailable': 1, 'availabilitySettings.nextAvailableDate': 1 });

// Pre-save hook to generate searchText for better full-text search
artistSchema.pre('save', function(next) {
  this.searchText = [
    this.name,
    this.bio,
    this.category,
    this.subcategories?.join(' '),
    this.specialization,
    this.city,
    this.locality,
    this.specialties?.join(' ')
  ].filter(Boolean).join(' ').toLowerCase();
  
  // Fix coordinates if invalid - either set to null or ensure proper GeoJSON format
  if (this.coordinates && this.coordinates.type === 'Point') {
    if (!this.coordinates.coordinates || this.coordinates.coordinates.length !== 2) {
      // Invalid coordinates - remove the field entirely to avoid geo index errors
      this.coordinates = undefined;
    }
  }
  
  next();
});

// Post-save hook for search index synchronization
artistSchema.post('save', async function(doc) {
  try {
    // Dynamic import to avoid circular dependencies
    const { searchSync } = await import('../services/searchSyncService.js');
    await searchSync.syncArtist(doc._id);
  } catch (error) {
    console.error('Search sync error (post-save):', error);
    // Don't block the save operation if search sync fails
  }
});

// Post-remove hook for cleanup
artistSchema.post('remove', async function(doc) {
  try {
    const { searchSync } = await import('../services/searchSyncService.js');
    await searchSync.handleDeletion('Artist', doc._id);
  } catch (error) {
    console.error('Search sync error (post-remove):', error);
  }
});

export default mongoose.model("Artist", artistSchema);
