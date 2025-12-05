import mongoose from "mongoose";

const workshopSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  artist: { type: mongoose.Schema.Types.ObjectId, ref: "Artist", required: true },
  date: { type: Date, required: true },
  price: { type: Number, required: true },
  time: { type: String },            // e.g. "10:00 AM - 12:00 PM"
  duration: { type: String },        // e.g. "2 hours"
  enrolled: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 }, // Total revenue generated from this workshop
  mode: { type: String, enum: ["Online", "Offline", "online", "offline"], default: "Online" },
  location: { type: String },
  
  // Additional details
  category: { type: String },
  subcategory: { type: String },
  maxParticipants: { type: Number },
  requirements: { type: String },
  whatYouWillLearn: { type: String },
  targetAudience: { type: String, enum: ['Beginners', 'Intermediate', 'Advanced', 'All Levels'], default: 'All Levels' },
  materialProvided: { type: Boolean, default: false },
  certificateProvided: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'cancelled', 'completed'], default: 'active' },
  
  // Media
  imageUrl: { type: String },
  thumbnailUrl: { type: String },
  
  // Reviews
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review"
  }],
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Workshop", workshopSchema);
