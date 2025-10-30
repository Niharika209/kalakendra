import mongoose from "mongoose";

const workshopSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: mongoose.Schema.Types.ObjectId, ref: "Artist", required: true },
  date: { type: Date, required: true },
  price: { type: Number, required: true },
  time: { type: String },            // e.g. "10:00 AM - 12:00 PM"
  duration: { type: String },        // e.g. "2 hours"
  enrolled: { type: Number, default: 0 },
  mode: { type: String, enum: ["online", "offline"], default: "online" },
  location: { type: String }, // new field
}, { timestamps: true });

export default mongoose.model("Workshop", workshopSchema);
