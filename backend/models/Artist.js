import mongoose from "mongoose";

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed later
  category: { type: String, required: true }, // e.g., dancer, singer
  bio: { type: String },
  location: { type: String, required: true },
  pricePerHour: { type: Number, required: true },
  availability: [{ date: Date, slots: [String] }], // optional for midterm
}, { timestamps: true });

export default mongoose.model("Artist", artistSchema);
