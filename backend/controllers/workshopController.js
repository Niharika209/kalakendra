import Workshop from "../models/Workshop.js";

// READ - Get workshops by artist ID
export const getWorkshopsByArtist = async (req, res) => {
  try {
    const { artistId } = req.params;
    console.log('🔍 Fetching workshops for artist:', artistId);
    
    const workshops = await Workshop.find({ artist: artistId })
      .populate('artist')
      .sort({ date: -1 });
    
    console.log(`✅ Found ${workshops.length} workshops`);
    res.json(workshops);
  } catch (err) {
    console.error('❌ Error fetching artist workshops:', err);
    res.status(500).json({ error: err.message });
  }
};

// CREATE - Create a new workshop
export const createWorkshop = async (req, res) => {
  try {
    console.log('🎨 Workshop creation request received');
    console.log('📋 Full request body:', JSON.stringify(req.body, null, 2));
    console.log('👤 User from token:', req.user?._id, req.userRole);
    
    // Validate required fields
    if (!req.body.title) {
      console.error('❌ Validation failed: title is required');
      return res.status(400).json({ error: 'Title is required' });
    }
    if (!req.body.artist) {
      console.error('❌ Validation failed: artist is required');
      return res.status(400).json({ error: 'Artist ID is required' });
    }
    if (!req.body.date) {
      console.error('❌ Validation failed: date is required');
      return res.status(400).json({ error: 'Date is required' });
    }
    if (!req.body.price) {
      console.error('❌ Validation failed: price is required');
      return res.status(400).json({ error: 'Price is required' });
    }
    
    const workshop = await Workshop.create(req.body);
    console.log('✅ Workshop created successfully:', {
      id: workshop._id,
      title: workshop.title
    });
    
    res.status(201).json(workshop);
  } catch (err) {
    console.error('❌ Workshop creation error:', err.message);
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

// READ - List all workshops
export const getAllWorkshops = async (req, res) => {
  try {
    // Support optional query params: category (matches artist.category or specialties), page, limit
    const { category, page = 1, limit = 20, mode } = req.query

    // If category provided, first find matching artists then workshops for those artists
    if (category) {
      const match = category.toString().toLowerCase()
      // Find artists whose category or specialties match the category slug/text
      const Artist = (await import("../models/Artist.js")).default
      const artists = await Artist.find({
        $or: [
          { category: { $regex: new RegExp(`^${match}$`, 'i') } },
          { specialties: { $elemMatch: { $regex: new RegExp(match, 'i') } } }
        ]
      }).select("_id")

      const artistIds = artists.map(a => a._id)
      const filter = { artist: { $in: artistIds } }
      if (mode) filter.mode = mode

      const workshops = await Workshop.find(filter)
        .populate('artist')
        .sort({ date: 1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))

      return res.json(workshops)
    }

    // No category: return paginated workshops (optionally filter by mode)
    const filter = {}
    if (mode) filter.mode = mode
    const workshops = await Workshop.find(filter)
      .populate('artist')
      .sort({ date: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    res.json(workshops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ - Get workshops by category via route param (helper for frontend explore pages)
export const getWorkshopsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params
    const { page = 1, limit = 20, mode } = req.query
    if (!categoryId) return res.status(400).json({ error: 'categoryId required' })

    const match = categoryId.toString().toLowerCase()
    const Artist = (await import("../models/Artist.js")).default
    const artists = await Artist.find({
      $or: [
        { category: { $regex: new RegExp(`^${match}$`, 'i') } },
        { specialties: { $elemMatch: { $regex: new RegExp(match, 'i') } } }
      ]
    }).select("_id")

    const artistIds = artists.map(a => a._id)
    const filter = { artist: { $in: artistIds } }
    if (mode) filter.mode = mode

    const workshops = await Workshop.find(filter)
      .populate('artist')
      .sort({ date: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    res.json(workshops)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// READ - Get single workshop by ID
export const getWorkshopById = async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id).populate("artist");
    if (!workshop) return res.status(404).json({ error: "Workshop not found" });
    res.json(workshop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE - Update workshop
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

// DELETE - Delete workshop
export const deleteWorkshop = async (req, res) => {
  try {
    const workshop = await Workshop.findByIdAndDelete(req.params.id);
    if (!workshop) return res.status(404).json({ error: "Workshop not found" });
    res.json({ message: "Workshop deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
