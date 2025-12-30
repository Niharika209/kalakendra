import mongoose from "mongoose";

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  category: { type: String, required: true },
  subcategories: [{ type: String }],
  specialization: { type: String },
  
  bio: { type: String },
  
  location: { type: String, required: true },
  city: { type: String, index: true },
  locality: { type: String },
  state: { type: String },
  country: { type: String, default: "India" },
  coordinates: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' }
  },
  
  pricePerHour: { type: Number, required: true },
  experienceYears: { type: Number, default: 0 },
  
  availability: [{
    date: Date,
    slots: [String]
  }],
  
  availabilitySettings: {
    isAvailable: { type: Boolean, default: true },
    modes: [{ type: String, enum: ['online', 'studio', 'both'], default: 'both' }],
    daysAvailable: [{ type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }],
    nextAvailableDate: { type: Date }
  },

  featured: { type: Boolean, default: false },
  featuredOrder: { type: Number, default: 0 },

  imageUrl: { type: String, default: null },
  thumbnailUrl: { type: String, default: null },
  gallery: [{
    url: { type: String, required: false },
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

  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewsCount: { type: Number, default: 0 },
  totalBookings: { type: Number, default: 0 },
  responseRate: { type: Number, default: 0, min: 0, max: 100 },
  specialties: [{ type: String }],
  
  searchText: { type: String },
  
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
  demoSessionSettings: {
    enabled: { type: Boolean, default: false },
    offersLive: { type: Boolean, default: false },
    offersRecorded: { type: Boolean, default: false },
    recordedSessionUrl: { type: String, default: null },
    demoDescription: { type: String, default: '' },
    liveSessionSlots: [{
      date: { type: String, required: true },
      time: { type: String, required: true },
      available: { type: Boolean, default: true },
      bookedBy: { type: String, default: null }
    }]
  },
  refreshTokens: { type: [String], default: [] }
}, { timestamps: true });

artistSchema.index({ featured: 1, featuredOrder: 1, updatedAt: -1 });
artistSchema.index({ name: 'text', bio: 'text', specialties: 'text', searchText: 'text' });
artistSchema.index({ city: 1, category: 1 });
artistSchema.index({ rating: -1, totalBookings: -1 });
artistSchema.index({ 'coordinates': '2dsphere' });
artistSchema.index({ 'availabilitySettings.isAvailable': 1, 'availabilitySettings.nextAvailableDate': 1 });

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
  
  if (this.coordinates && this.coordinates.type === 'Point') {
    if (!this.coordinates.coordinates || this.coordinates.coordinates.length !== 2) {
      this.coordinates = undefined;
    }
  }
  
  next();
});

artistSchema.post('save', async function(doc) {
  try {
    const { searchSync } = await import('../services/searchSyncService.js');
    await searchSync.syncArtist(doc._id);
  } catch (error) {
    console.error('Search sync error (post-save):', error);
  }
});

artistSchema.post('remove', async function(doc) {
  try {
    const { searchSync } = await import('../services/searchSyncService.js');
    await searchSync.handleDeletion('Artist', doc._id);
  } catch (error) {
    console.error('Search sync error (post-remove):', error);
  }
});

export default mongoose.model("Artist", artistSchema);
