import Workshop from "../models/Workshop.js";

// CREATE - Create a new workshop
export const createWorkshop = async (req, res) => {
  try {
    const workshop = await Workshop.create(req.body);
    res.status(201).json(workshop);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ - List all workshops
export const getAllWorkshops = async (req, res) => {
  try {
    const workshops = await Workshop.find().populate("artist");
    res.json(workshops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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
