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

export default mongoose.model("Booking", bookingSchema);
