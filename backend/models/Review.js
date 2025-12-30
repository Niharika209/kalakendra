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
  }
}, { timestamps: true });

reviewSchema.index({ workshop: 1, learner: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);
