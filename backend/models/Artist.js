import mongoose from "mongoose";

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed later
  category: { type: String, required: true }, // primary artform
  bio: { type: String },
  location: { type: String, required: true },
  pricePerHour: { type: Number, required: true },
  availability: [{ date: Date, slots: [String] }],

  // Featured / homepage
  featured: { type: Boolean, default: false },
  featuredOrder: { type: Number, default: 0 },

  // Images and media
  imageUrl: { type: String, default: null },        // full profile image (absolute URL)
  thumbnailUrl: { type: String, default: null },    // small thumb for cards
  gallery: [{ type: String }],                      // additional image URLs
  imageMetadata: {
    width: Number,
    height: Number,
    sizeBytes: Number,
    format: String,
    uploadedAt: Date,
  },

  // Public stats
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  specialties: [{ type: String }],
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
  refreshTokens: { type: [String], default: [] }
}, { timestamps: true });

// Indexes for fast featured queries and lookups
artistSchema.index({ featured: 1, featuredOrder: 1, updatedAt: -1 });
artistSchema.index({ name: 'text', bio: 'text', specialties: 'text' });

export default mongoose.model("Artist", artistSchema);
