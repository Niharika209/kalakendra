import express from "express";
import { 
  createWorkshop, 
  getAllWorkshops, 
  getWorkshopsByCategory,
  getWorkshopById, 
  updateWorkshop, 
  deleteWorkshop 
} from "../controllers/workshopController.js";
import { artistAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE - Create workshop (requires artist auth)
router.post("/", artistAuth, createWorkshop);

// READ - Get all workshops
router.get("/", getAllWorkshops);

// READ - Get workshops by category slug or name (e.g. /api/workshops/category/dance)
router.get("/category/:categoryId", getWorkshopsByCategory);

// READ - Get single workshop by ID
router.get("/:id", getWorkshopById);

// UPDATE - Update workshop
router.put("/:id", updateWorkshop);

// DELETE - Delete workshop
router.delete("/:id", deleteWorkshop);

export default router;
