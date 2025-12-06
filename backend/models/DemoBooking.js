import mongoose from 'mongoose';

const demoBookingSchema = new mongoose.Schema({
  artistId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Artist', 
    required: true 
  },
  learnerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Learner',
    default: null
  },
  learnerName: { type: String, required: true },
  learnerEmail: { type: String, required: true },
  learnerPhone: { type: String, required: true },
  sessionTitle: { type: String, default: 'Demo Session' },
  artInterest: { type: String, default: '' },
  message: { type: String, default: '' },
  sessionType: { 
    type: String, 
    enum: ['live', 'recorded'], 
    required: true 
  },
  selectedSlot: {
    date: String,
    time: String
  },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'completed', 'cancelled'], 
    default: 'confirmed' 
  },
  confirmedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexes for fast queries
demoBookingSchema.index({ artistId: 1, createdAt: -1 });
demoBookingSchema.index({ learnerEmail: 1, createdAt: -1 });
demoBookingSchema.index({ status: 1 });

export default mongoose.model('DemoBooking', demoBookingSchema);
