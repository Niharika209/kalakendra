import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  learner: { type: mongoose.Schema.Types.ObjectId, ref: "Learner", required: true },
  workshop: { type: mongoose.Schema.Types.ObjectId, ref: "Workshop", required: true },
  status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
