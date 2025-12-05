import express from "express";
import { 
  createArtist, 
  loginArtist, 
  getAllArtists, 
  getFeaturedArtists,
  getArtistById,
  getArtistByEmail, 
  updateArtist, 
  deleteArtist,
  updateArtistProfileImage,
  deleteArtistProfileImage,
  addToArtistGallery,
  removeFromArtistGallery
} from "../controllers/artistController.js";

const router = express.Router();

// CREATE - Signup
router.post("/", createArtist);

// READ - Get all artists
router.get("/", getAllArtists);

// READ - Featured artists (for landing page)
router.get('/featured', getFeaturedArtists);

// READ - Get artist by email
router.get('/email/:email', getArtistByEmail);

// READ - Get single artist by ID
router.get("/:id", getArtistById);

// UPDATE - Update artist
router.put("/:id", updateArtist);

// UPDATE - Update artist profile image
router.put("/:id/profile-image", updateArtistProfileImage);

// DELETE - Delete artist profile image
router.delete("/:id/profile-image", deleteArtistProfileImage);

// UPDATE - Add images to gallery
router.post("/:id/gallery", addToArtistGallery);

// DELETE - Remove image from gallery
router.delete("/:id/gallery", removeFromArtistGallery);

// DELETE - Delete artist
router.delete("/:id", deleteArtist);

// Login
router.post("/login", loginArtist);

export default router;
