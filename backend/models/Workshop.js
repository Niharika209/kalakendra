import mongoose from "mongoose";

const workshopSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  artist: { type: mongoose.Schema.Types.ObjectId, ref: "Artist", required: true },
  
  // Scheduling
  date: { type: Date, required: true },
  time: { type: String },            // e.g. "10:00 AM - 12:00 PM"
  duration: { type: String },        // e.g. "2 hours"
  durationMinutes: { type: Number }, // For filtering by duration
  
  // Pricing
  price: { type: Number, required: true },
  discountedPrice: { type: Number }, // For sale/offers
  
  enrolled: { type: Number, default: 0 },
  maxParticipants: { type: Number },
  revenue: { type: Number, default: 0 }, // Total revenue generated from this workshop
  
  // Mode and Location (enhanced)
  mode: { type: String, enum: ["online", "offline", "hybrid"], default: "online", lowercase: true },
  location: { type: String }, // Full address for offline workshops
  city: { type: String, index: true },
  locality: { type: String },
  state: { type: String },
  coordinates: {
    type: { type: String, enum: ['Point'] },
    coordinates: { type: [Number], index: '2dsphere' } // [longitude, latitude]
  },
  
  // Categories (enhanced)
  category: { type: String, index: true },
  subcategory: { type: String },
  tags: [{ type: String }], // e.g., ["beginner-friendly", "weekend", "certification"]
  
  // Additional details
  requirements: { type: String },
  whatYouWillLearn: { type: String },
  targetAudience: { type: String, enum: ['Beginners', 'Intermediate', 'Advanced', 'All Levels'], default: 'All Levels' },
  materialProvided: { type: Boolean, default: false },
  certificateProvided: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'cancelled', 'completed', 'upcoming'], default: 'active' },
  
  // Availability metadata
  seatsAvailable: { type: Number }, // Calculated: maxParticipants - enrolled
  isFullyBooked: { type: Boolean, default: false },
  
  // Media
  imageUrl: { type: String },
  thumbnailUrl: { type: String },
  
  // Reviews and ratings
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review"
  }],
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  
  // Search optimization
  searchText: { type: String }, // Concatenated text for full-text search
  
  // Popularity metrics
  viewCount: { type: Number, default: 0 },
  bookingCount: { type: Number, default: 0 }
}, { timestamps: true });

// Indexes for efficient queries
workshopSchema.index({ title: 'text', description: 'text', searchText: 'text' });
workshopSchema.index({ category: 1, subcategory: 1, date: 1 });
workshopSchema.index({ city: 1, mode: 1, date: 1 });
workshopSchema.index({ price: 1, averageRating: -1 });
workshopSchema.index({ date: 1, status: 1 });
workshopSchema.index({ 'coordinates': '2dsphere' });
workshopSchema.index({ artist: 1, createdAt: -1 });

// Pre-save hook for calculated fields
workshopSchema.pre('save', function(next) {
  // Generate searchText
  this.searchText = [
    this.title,
    this.description,
    this.category,
    this.subcategory,
    this.tags?.join(' '),
    this.city,
    this.locality
  ].filter(Boolean).join(' ').toLowerCase();
  
  // Calculate seats available
  if (this.maxParticipants) {
    this.seatsAvailable = Math.max(0, this.maxParticipants - this.enrolled);
    this.isFullyBooked = this.seatsAvailable === 0;
  }
  
  // Fix coordinates if invalid - either set to null or ensure proper GeoJSON format
  if (this.coordinates && this.coordinates.type === 'Point') {
    if (!this.coordinates.coordinates || this.coordinates.coordinates.length !== 2) {
      // Invalid coordinates - remove the field entirely to avoid geo index errors
      this.coordinates = undefined;
    }
  }
  
  // Ensure mode is lowercase (fix capitalized values)
  if (this.mode && typeof this.mode === 'string') {
    this.mode = this.mode.toLowerCase();
  }
  
  next();
});

// Post-save hook for search index synchronization
workshopSchema.post('save', async function(doc) {
  try {
    const { searchSync } = await import('../services/searchSyncService.js');
    await searchSync.syncWorkshop(doc._id);
  } catch (error) {
    console.error('Search sync error (post-save):', error);
  }
});

// Post-remove hook for cleanup
workshopSchema.post('remove', async function(doc) {
  try {
    const { searchSync } = await import('../services/searchSyncService.js');
    await searchSync.handleDeletion('Workshop', doc._id);
  } catch (error) {
    console.error('Search sync error (post-remove):', error);
  }
});

export default mongoose.model("Workshop", workshopSchema);
