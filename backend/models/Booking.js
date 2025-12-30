import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  learner: { type: mongoose.Schema.Types.ObjectId, ref: "Learner", required: true },
  workshop: { type: mongoose.Schema.Types.ObjectId, ref: "Workshop", required: true },
  quantity: { type: Number, default: 1, min: 1 },
  totalAmount: { type: Number, required: true },
  paymentId: { type: String },
  orderId: { type: String },
  status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "confirmed" },
  paymentStatus: { type: String, enum: ["pending", "paid"], default: "paid" },
}, { timestamps: true });

bookingSchema.post('save', async function(doc) {
  try {
    const { searchSync } = await import('../services/searchSyncService.js');
    
    if (doc.workshop) {
      await searchSync.updateWorkshopAvailability(doc.workshop);
    }
  } catch (error) {
    console.error('Booking sync error (post-save):', error);
  }
});

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
