import Artist from "../models/Artist.js";

// CREATE - Signup a new artist
export const createArtist = async (req, res) => {
  try {
    const artist = await Artist.create(req.body);
    res.status(201).json(artist);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ - List all artists
export const getAllArtists = async (req, res) => {
  try {
    const artists = await Artist.find();
    res.json(artists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ - Get single artist by ID
export const getArtistById = async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) return res.status(404).json({ error: "Artist not found" });
    res.json(artist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE - Update artist profile
export const updateArtist = async (req, res) => {
  try {
    const artist = await Artist.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!artist) return res.status(404).json({ error: "Artist not found" });
    res.json(artist);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE - Delete artist
export const deleteArtist = async (req, res) => {
  try {
    const artist = await Artist.findByIdAndDelete(req.params.id);
    if (!artist) return res.status(404).json({ error: "Artist not found" });
    res.json({ message: "Artist deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
