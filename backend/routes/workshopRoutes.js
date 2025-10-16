import express from "express";
import { createWorkshop, getAllWorkshops } from "../controllers/workshopController.js";
import { artistAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create workshop (requires artist auth)
router.post("/", artistAuth, createWorkshop);

// Get all workshops
router.get("/", getAllWorkshops);

export default router;
