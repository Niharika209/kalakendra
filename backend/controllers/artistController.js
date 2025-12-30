import Artist from "../models/Artist.js";
import Workshop from "../models/Workshop.js";
import { deleteFromCloudinary } from "../utils/cloudinaryHelper.js";
import { sortByRankingScore } from "../utils/artistSortHelper.js";

export const getArtistByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    console.log('Fetching artist by email:', email);
    
    const artist = await Artist.findOne({ email }).lean();
    
    if (!artist) {
      console.log('Artist not found for email:', email);
      return res.status(404).json({ error: "Artist not found" });
    }

    console.log('Artist found:', artist._id);
    res.json(artist);
  } catch (err) {
    console.error('Error fetching artist by email:', err);
    res.status(500).json({ error: err.message });
  }
};

export const createArtist = async (req, res) => {
  try {
    const artist = await Artist.create(req.body);
    res.status(201).json(artist);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllArtists = async (req, res) => {
  try {
    const artists = await Artist.find().lean();
    const sortedArtists = sortByRankingScore(artists);
    res.json(sortedArtists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getFeaturedArtists = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 6;
    const artists = await Artist.find({ featured: true })
      .sort({ featuredOrder: 1, updatedAt: -1 })
      .limit(limit)
      .select('name slug category location rating reviewsCount thumbnailUrl imageUrl specialties featuredOrder');

    res.json(artists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getArtistById = async (req, res) => {
  try {
    const idOrSlug = req.params.id;
    let artist = null;
    if (/^[0-9a-fA-F]{24}$/.test(idOrSlug)) {
      artist = await Artist.findById(idOrSlug).lean();
    } else {
      artist = await Artist.findOne({ slug: idOrSlug }).lean();
    }

    if (!artist) return res.status(404).json({ error: "Artist not found" });

    const workshops = await Workshop.find({ artist: artist._id }).select('title date time duration price enrolled location').lean();
    res.json({ ...artist, workshops });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateArtist = async (req, res) => {
  try {
    console.log('=== UPDATE ARTIST REQUEST ===')
    console.log('Artist ID:', req.params.id)
    console.log('Update data:', JSON.stringify(req.body, null, 2))
    
    const artist = await Artist.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!artist) {
      console.log('Artist not found with ID:', req.params.id)
      return res.status(404).json({ error: "Artist not found" });
    }
    
    console.log('Artist updated successfully:', artist._id)
    console.log('Saved demoSessionSettings:', JSON.stringify(artist.demoSessionSettings, null, 2))
    console.log('Saved slots count:', artist.demoSessionSettings?.liveSessionSlots?.length || 0)
    console.log('============================')
    res.json(artist);
  } catch (err) {
    console.error('Error updating artist:', err)
    res.status(400).json({ error: err.message });
  }
};

export const deleteArtist = async (req, res) => {
  try {
    const artist = await Artist.findByIdAndDelete(req.params.id);
    if (!artist) return res.status(404).json({ error: "Artist not found" });
    res.json({ message: "Artist deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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

export const updateArtistProfileImage = async (req, res) => {
  try {
    const { imageUrl, thumbnailUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ error: "imageUrl is required" });
    }

    const artist = await Artist.findByIdAndUpdate(
      req.params.id,
      { imageUrl, thumbnailUrl: thumbnailUrl || imageUrl },
      { new: true, runValidators: true }
    );

    if (!artist) return res.status(404).json({ error: "Artist not found" });
    
    res.json({ 
      message: "Profile image updated successfully", 
      imageUrl: artist.imageUrl,
      thumbnailUrl: artist.thumbnailUrl
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteArtistProfileImage = async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) return res.status(404).json({ error: "Artist not found" });
    if (artist.imageUrl) {
      try {
        await deleteFromCloudinary(artist.imageUrl);
        console.log('Image deleted from Cloudinary');
      } catch (cloudinaryError) {
        console.error('Failed to delete from Cloudinary:', cloudinaryError);
      }
    }
    artist.imageUrl = undefined;
    artist.thumbnailUrl = undefined;
    await artist.save();
    
    res.json({ 
      message: "Profile image deleted successfully"
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const addToArtistGallery = async (req, res) => {
  try {
    const { mediaItems } = req.body;
    
    if (!mediaItems || !Array.isArray(mediaItems) || mediaItems.length === 0) {
      return res.status(400).json({ error: "mediaItems array is required" });
    }

    const artist = await Artist.findByIdAndUpdate(
      req.params.id,
      { $push: { gallery: { $each: mediaItems } } },
      { new: true, runValidators: true }
    );

    if (!artist) return res.status(404).json({ error: "Artist not found" });
    
    res.json({ 
      message: "Gallery media added successfully", 
      gallery: artist.gallery
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const removeFromArtistGallery = async (req, res) => {
  try {
    const { mediaUrl } = req.body;
    
    if (!mediaUrl) {
      return res.status(400).json({ error: "mediaUrl is required" });
    }

    const artist = await Artist.findById(req.params.id);
    if (!artist) return res.status(404).json({ error: "Artist not found" });
    try {
      await deleteFromCloudinary(mediaUrl);
      console.log('Gallery item deleted from Cloudinary');
    } catch (cloudinaryError) {
      console.error('Failed to delete from Cloudinary:', cloudinaryError);
    }
    artist.gallery = artist.gallery.filter(item => item.url !== mediaUrl);
    await artist.save();
    
    res.json({ 
      message: "Gallery media removed successfully", 
      gallery: artist.gallery
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
