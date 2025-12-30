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

router.post("/", createArtist);

router.get("/", getAllArtists);

router.get('/featured', getFeaturedArtists);

router.get('/email/:email', getArtistByEmail);

router.get("/:id", getArtistById);

router.put("/:id", updateArtist);

router.patch("/:id", updateArtist);

router.put("/:id/profile-image", updateArtistProfileImage);

router.delete("/:id/profile-image", deleteArtistProfileImage);

router.post("/:id/gallery", addToArtistGallery);

router.delete("/:id/gallery", removeFromArtistGallery);

router.delete("/:id", deleteArtist);

// Login
router.post("/login", loginArtist);

export default router;
