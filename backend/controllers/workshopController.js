import Workshop from "../models/Workshop.js";
import { deleteFromCloudinary } from "../utils/cloudinaryHelper.js";

export const getWorkshopsByArtist = async (req, res) => {
  try {
    const { artistId } = req.params;
    console.log('Fetching workshops for artist:', artistId);
    
    const workshops = await Workshop.find({ artist: artistId })
      .populate('artist')
      .sort({ date: -1 });
    
    console.log(`Found ${workshops.length} workshops`);
    res.json(workshops);
  } catch (err) {
    console.error('Error fetching artist workshops:', err);
    res.status(500).json({ error: err.message });
  }
};

export const createWorkshop = async (req, res) => {
  try {
    console.log('Workshop creation request received');
    console.log('Full request body:', JSON.stringify(req.body, null, 2));
    console.log('User from token:', req.user?._id, req.userRole);
    if (!req.body.title) {
      console.error('Validation failed: title is required');
      return res.status(400).json({ error: 'Title is required' });
    }
    if (!req.body.artist) {
      console.error('Validation failed: artist is required');
      return res.status(400).json({ error: 'Artist ID is required' });
    }
    if (!req.body.date) {
      console.error('Validation failed: date is required');
      return res.status(400).json({ error: 'Date is required' });
    }
    if (!req.body.price) {
      console.error('Validation failed: price is required');
      return res.status(400).json({ error: 'Price is required' });
    }
    
    const workshop = await Workshop.create(req.body);
    console.log('Workshop created successfully:', {
      id: workshop._id,
      title: workshop.title
    });
    
    res.status(201).json(workshop);
  } catch (err) {
    console.error('Workshop creation error:', err.message);
    console.error('Error name:', err.name);
    if (err.name === 'ValidationError') {
      console.error('Validation errors:', err.errors);
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ error: `Validation failed: ${messages.join(', ')}` });
    }
    console.error('Full error:', err);
    res.status(400).json({ error: err.message });
  }
};

export const getAllWorkshops = async (req, res) => {
  try {
    const { category, page = 1, limit = 20, mode } = req.query

    if (category) {
      const match = category.toString().toLowerCase();
      const Artist = (await import("../models/Artist.js")).default
      const artists = await Artist.find({
        $or: [
          { category: { $regex: new RegExp(match, 'i') } },
          { specialties: { $elemMatch: { $regex: new RegExp(match, 'i') } } }
        ]
      }).select("_id")

      const artistIds = artists.map(a => a._id)
      
      console.log(`[getAllWorkshops] category="${category}", found ${artists.length} artists`);
      
      const categoryRegex = new RegExp(match, 'i')
      const filter = {
        $or: [
          { category: categoryRegex },
          { subcategory: categoryRegex },
          { artist: { $in: artistIds } }
        ]
      }
      if (mode) filter.mode = mode

      const workshops = await Workshop.find(filter)
        .populate('artist')
        .sort({ date: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))

      console.log(`[getAllWorkshops] Returning ${workshops.length} workshops`)
      return res.json(workshops)
    }


    const filter = {}
    if (mode) filter.mode = mode
    const workshops = await Workshop.find(filter)
      .populate('artist')
      .sort({ date: -1 })  // Changed to descending order (newest first)
      .skip((page - 1) * limit)
      .limit(Number(limit))

    res.json(workshops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getWorkshopsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params
    const { page = 1, limit = 20, mode } = req.query
    if (!categoryId) return res.status(400).json({ error: 'categoryId required' })

    const match = categoryId.toString().toLowerCase();
    const Artist = (await import("../models/Artist.js")).default
    const artists = await Artist.find({
      $or: [
        { category: { $regex: new RegExp(`^${match}$`, 'i') } },
        { specialties: { $elemMatch: { $regex: new RegExp(match, 'i') } } }
      ]
    }).select("_id")

    const artistIds = artists.map(a => a._id)
    
    console.log(`Searching for category: "${categoryId}" (match: "${match}")`)
    console.log(`Found ${artists.length} matching artists`);
    
    const categoryRegex = new RegExp(match, 'i');
    
    const filter = {
      $or: [
        { category: categoryRegex },
        { subcategory: categoryRegex },
        { artist: { $in: artistIds } }
      ]
    }
    
    if (mode) filter.mode = mode

    console.log(`artistIds:`, artistIds.map(id => id.toString()))
    console.log(`regex pattern:`, categoryRegex.toString())

    // Test: First try to find the specific workshop directly
    const testWorkshop = await Workshop.findById('692034205ac3466d6639143b')
    const testResults = {
      foundDirectly: !!testWorkshop,
      workshopData: testWorkshop ? {
        title: testWorkshop.title,
        category: testWorkshop.category,
        regexMatches: categoryRegex.test(testWorkshop.category || '')
      } : null
    }

    // Test: Try just the category filter alone
    const testCategoryOnly = await Workshop.find({ category: categoryRegex })
    testResults.categoryOnlyResults = {
      count: testCategoryOnly.length,
      titles: testCategoryOnly.map(w => w.title)
    }
    
    // Test: Try exact match
    const testExactMatch = await Workshop.find({ category: 'Dance' })
    testResults.exactMatchResults = {
      count: testExactMatch.length,
      titles: testExactMatch.map(w => w.title)
    }
    
    // Test: Try case-insensitive exact match
    const testCaseInsensitive = await Workshop.find({ category: /^Dance$/i })
    testResults.caseInsensitiveExact = {
      count: testCaseInsensitive.length,
      titles: testCaseInsensitive.map(w => w.title)
    }
    
    // Test: Try the full OR query
    const testFullQuery = await Workshop.find(filter)
    testResults.fullQueryResults = {
      count: testFullQuery.length,
      titles: testFullQuery.map(w => w.title)
    }
    
    console.log('TEST RESULTS:', JSON.stringify(testResults, null, 2));
    
    if (req.query.debug === 'true') {
      return res.json({ debug: testResults, artistIds: artistIds.map(id => id.toString()), filter })
    }

    const workshops = await Workshop.find(filter)
      .populate('artist')
      .sort({ date: -1 })

    workshops.forEach(w => {
      const matchesCategory = w.category && new RegExp(match, 'i').test(w.category)
      const matchesSubcategory = w.subcategory && new RegExp(match, 'i').test(w.subcategory)
      const matchesArtist = artistIds.some(id => id.toString() === w.artist._id.toString())
      console.log(`${w.title}: cat=${matchesCategory}, subcat=${matchesSubcategory}, artist=${matchesArtist}`)
    })


    const startIndex = (page - 1) * limit
    const endIndex = startIndex + Number(limit)
    const paginatedWorkshops = workshops.slice(startIndex, endIndex)

    console.log(`Found ${workshops.length} total workshops, returning ${paginatedWorkshops.length} (page ${page})`)
    console.log(`Workshop titles:`, workshops.map(w => w.title))
    res.json(paginatedWorkshops)
  } catch (err) {
    console.error('Error in getWorkshopsByCategory:', err)
    res.status(500).json({ error: err.message })
  }
}

export const getWorkshopById = async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id).populate("artist");
    if (!workshop) return res.status(404).json({ error: "Workshop not found" });
    res.json(workshop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateWorkshop = async (req, res) => {
  try {
    const workshop = await Workshop.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("artist");
    if (!workshop) return res.status(404).json({ error: "Workshop not found" });
    res.json(workshop);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const fixCategoryIndexing = async (req, res) => {
  try {
    console.log('Starting category field migration...');
    
    // Get all workshops
    const workshops = await Workshop.find({})
    console.log(`Found ${workshops.length} workshops`)
    
    let fixed = 0
    for (const workshop of workshops) {
      if (workshop.category) {
        // Re-save to trigger proper indexing
        await workshop.save()
        fixed++
      }
    }
    
    console.log(`Migration complete: ${fixed} workshops re-saved`);
    
    const testDance = await Workshop.find({ category: /dance/i })
    const testPainting = await Workshop.find({ category: /painting/i })
    
    res.json({
      message: 'Category indexing fixed',
      workshopsProcessed: fixed,
      totalWorkshops: workshops.length,
      testResults: {
        dance: testDance.length,
        painting: testPainting.length
      }
    })
  } catch (err) {
    console.error('Migration error:', err)
    res.status(500).json({ error: err.message })
  }
}

export const deleteWorkshop = async (req, res) => {
  try {
    const workshop = await Workshop.findByIdAndDelete(req.params.id);
    if (!workshop) return res.status(404).json({ error: "Workshop not found" });
    res.json({ message: "Workshop deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateWorkshopImage = async (req, res) => {
  try {
    const { imageUrl, thumbnailUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ error: "imageUrl is required" });
    }

    const workshop = await Workshop.findByIdAndUpdate(
      req.params.id,
      { imageUrl, thumbnailUrl: thumbnailUrl || imageUrl },
      { new: true, runValidators: true }
    );

    if (!workshop) return res.status(404).json({ error: "Workshop not found" });
    
    res.json({ 
      message: "Workshop image updated successfully", 
      imageUrl: workshop.imageUrl,
      thumbnailUrl: workshop.thumbnailUrl
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteWorkshopImage = async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) return res.status(404).json({ error: "Workshop not found" });
    if (workshop.imageUrl) {
      try {
        await deleteFromCloudinary(workshop.imageUrl);
        console.log('Workshop image deleted from Cloudinary');
      } catch (cloudinaryError) {
        console.error('Failed to delete from Cloudinary:', cloudinaryError);
      }
    }
    workshop.imageUrl = undefined;
    workshop.thumbnailUrl = undefined;
    await workshop.save();
    
    res.json({ 
      message: "Workshop image deleted successfully"
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
