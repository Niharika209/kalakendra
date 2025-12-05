import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  learner: { type: mongoose.Schema.Types.ObjectId, ref: "Learner", required: true },
  workshop: { type: mongoose.Schema.Types.ObjectId, ref: "Workshop", required: true },
  status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
}, { timestamps: true });

// Post-save hook to update workshop availability
bookingSchema.post('save', async function(doc) {
  try {
    const { searchSync } = await import('../services/searchSyncService.js');
    
    // Update workshop seat availability
    if (doc.workshop) {
      await searchSync.updateWorkshopAvailability(doc.workshop);
    }
  } catch (error) {
    console.error('Booking sync error (post-save):', error);
  }
});

// Post-update hook (when booking is cancelled)
bookingSchema.post('findOneAndUpdate', async function(doc) {
  try {
    if (doc && doc.workshop) {
      const { searchSync } = await import('../services/searchSyncService.js');
      await searchSync.updateWorkshopAvailability(doc.workshop);
    }
  } catch (error) {
    console.error('Booking sync error (post-update):', error);
  }
});

export default mongoose.model("Booking", bookingSchema);
