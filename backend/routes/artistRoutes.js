import express from "express";
import { createArtist, loginArtist, getAllArtists } from "../controllers/artistController.js";

const router = express.Router();

// Signup
router.post("/", createArtist);

// Login
router.post("/login", loginArtist);

// Get all artists
router.get("/", getAllArtists);

export default router;
