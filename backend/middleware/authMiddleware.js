import jwt from "jsonwebtoken";
import Artist from "../models/Artist.js";
import Learner from "../models/Learner.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_SECRET || 'access-secret');
    
    let profile = await Artist.findById(decoded.id).select('-password -refreshTokens');
    let userRole = 'artist';
    
    if (!profile) {
      profile = await Learner.findById(decoded.id).select('-password -refreshTokens');
      userRole = 'learner';
    }
    
    if (!profile) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    req.user = profile;
    req.userRole = userRole;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

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
