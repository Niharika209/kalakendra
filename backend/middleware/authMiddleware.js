import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_SECRET || 'access-secret');
    req.user = await User.findById(decoded.id).select('-password -refreshTokens');
    
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Old middleware (keeping for backward compatibility)
import Artist from "../models/Artist.js";
import Learner from "../models/Learner.js";

export const artistAuth = async (req, res, next) => {
  const { email, password } = req.body;
  const artist = await Artist.findOne({ email, password });
  if (!artist) return res.status(401).json({ error: "Unauthorized artist" });
  req.artist = artist;
  next();
};

export const learnerAuth = async (req, res, next) => {
  const { email, password } = req.body;
  const learner = await Learner.findOne({ email, password });
  if (!learner) return res.status(401).json({ error: "Unauthorized learner" });
  req.learner = learner;
  next();
};
