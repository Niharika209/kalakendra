import express from "express";
import { 
  createWorkshop, 
  getAllWorkshops, 
  getWorkshopsByCategory,
  getWorkshopsByArtist,
  getWorkshopById, 
  updateWorkshop, 
  deleteWorkshop,
  updateWorkshopImage,
  deleteWorkshopImage
} from "../controllers/workshopController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE - Create workshop (requires authentication)
router.post("/", protect, createWorkshop);

// READ - Get all workshops
router.get("/", getAllWorkshops);

// READ - Get workshops by category slug or name (e.g. /api/workshops/category/dance)
router.get("/category/:categoryId", getWorkshopsByCategory);

// READ - Get workshops by artist ID (MUST come before /:id to avoid conflict)
router.get("/artist/:artistId", getWorkshopsByArtist);

// READ - Get single workshop by ID (MUST come AFTER specific routes)
router.get("/:id", getWorkshopById);

// UPDATE - Update workshop (requires authentication)
router.put("/:id", protect, updateWorkshop);

// UPDATE - Update workshop image (requires authentication)
router.put("/:id/image", protect, updateWorkshopImage);

// DELETE - Delete workshop image (requires authentication)
router.delete("/:id/image", protect, deleteWorkshopImage);

// DELETE - Delete workshop (requires authentication)
router.delete("/:id", protect, deleteWorkshop);

export default router;
