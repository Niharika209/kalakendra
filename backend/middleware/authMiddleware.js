import Artist from "../models/Artist.js";
import Learner from "../models/Learner.js";

// Check if artist exists (basic demo)
export const artistAuth = async (req, res, next) => {
  const { email, password } = req.body;
  const artist = await Artist.findOne({ email, password });
  if (!artist) return res.status(401).json({ error: "Unauthorized artist" });
  req.artist = artist; // attach artist to request
  next();
};

// Check if learner exists (basic demo)
export const learnerAuth = async (req, res, next) => {
  const { email, password } = req.body;
  const learner = await Learner.findOne({ email, password });
  if (!learner) return res.status(401).json({ error: "Unauthorized learner" });
  req.learner = learner;
  next();
};
