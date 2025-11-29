import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  workshop: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Workshop", 
    required: true 
  },
  learner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Learner", 
    required: true 
  },
  artist: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Artist", 
    required: true 
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  comment: { 
    type: String, 
    required: true,
    maxlength: 500
  },
  reviewerName: { 
    type: String, 
    required: true 
  },
  // Prevent duplicate reviews from same learner for same workshop
}, { timestamps: true });

// Create compound index to ensure one review per learner per workshop
reviewSchema.index({ workshop: 1, learner: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);
