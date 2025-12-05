import express from "express";
import { 
  createWorkshop, 
  getAllWorkshops, 
  getWorkshopsByCategory,
  getWorkshopsByArtist,
  getWorkshopById, 
  updateWorkshop, 
  deleteWorkshop,
  fixCategoryIndexing,
  updateWorkshopImage,
  deleteWorkshopImage
} from "../controllers/workshopController.js";
import { protect } from "../middleware/authMiddleware.js";
import Workshop from "../models/Workshop.js";

const router = express.Router();

// DEBUG endpoint - test category query
router.get("/debug/category-test", async (req, res) => {
  try {
    const categoryRegex = /dance/i
    
    // Find specific workshop
    const workshop = await Workshop.findById('692034205ac3466d6639143b')
    
    // Test category filter alone
    const categoryOnly = await Workshop.find({ category: categoryRegex })
    
    // Test with OR
    const withOr = await Workshop.find({
      $or: [
        { category: categoryRegex },
        { subcategory: categoryRegex }
      ]
    })
    
    res.json({
      workshop: workshop ? {
        title: workshop.title,
        category: workshop.category,
        matches: categoryRegex.test(workshop.category || '')
      } : null,
      categoryOnly: {
        count: categoryOnly.length,
        results: categoryOnly.map(w => ({ title: w.title, category: w.category }))
      },
      withOr: {
        count: withOr.length,
        results: withOr.map(w => ({ title: w.title, category: w.category }))
      }
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// FIX endpoint - re-save workshop to fix indexing
router.post("/debug/fix-workshop/:id", async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id)
    if (!workshop) return res.status(404).json({ error: 'Workshop not found' })
    
    // Re-save to trigger proper indexing
    await workshop.save()
    
    // Test if it now works
    const test = await Workshop.find({ category: workshop.category })
    
    res.json({
      message: 'Workshop re-saved',
      category: workshop.category,
      nowQueryable: test.length > 0,
      matchingWorkshops: test.length
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// MIGRATION endpoint - fix all workshops
router.post("/migrate/fix-categories", fixCategoryIndexing)

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
