import Artist from "../models/Artist.js";

// Signup a new artist
export const createArtist = async (req, res) => {
  try {
    const artist = await Artist.create(req.body);
    res.status(201).json(artist);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Artist login (basic)
export const loginArtist = async (req, res) => {
  try {
    const { email, password } = req.body;
    const artist = await Artist.findOne({ email, password });
    if (!artist) return res.status(400).json({ error: "Invalid credentials" });
    res.json({ message: "Login successful", artist });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// List all artists
export const getAllArtists = async (req, res) => {
  try {
    const artists = await Artist.find();
    res.json(artists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
