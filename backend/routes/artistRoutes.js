import express from "express";
import { 
  createArtist, 
  loginArtist, 
  getAllArtists, 
  getArtistById, 
  updateArtist, 
  deleteArtist 
} from "../controllers/artistController.js";

const router = express.Router();

// CREATE - Signup
router.post("/", createArtist);

// READ - Get all artists
router.get("/", getAllArtists);

// READ - Get single artist by ID
router.get("/:id", getArtistById);

// UPDATE - Update artist
router.put("/:id", updateArtist);

// DELETE - Delete artist
router.delete("/:id", deleteArtist);

// Login
router.post("/login", loginArtist);

export default router;
