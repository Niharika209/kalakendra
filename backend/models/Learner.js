import mongoose from "mongoose";

const learnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: { type: String, required: true },
  profileImage: { type: String, default: null },
  refreshTokens: { type: [String], default: [] }
}, { timestamps: true });

export default mongoose.model("Learner", learnerSchema);
