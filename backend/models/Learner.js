import mongoose from "mongoose";

const learnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed later
  location: { type: String, required: true },
  refreshTokens: { type: [String], default: [] }
}, { timestamps: true });

export default mongoose.model("Learner", learnerSchema);
