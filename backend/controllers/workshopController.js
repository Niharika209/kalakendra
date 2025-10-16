import Workshop from "../models/Workshop.js";

// Create a new workshop
export const createWorkshop = async (req, res) => {
  try {
    const workshop = await Workshop.create(req.body);
    res.status(201).json(workshop);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// List all workshops
export const getAllWorkshops = async (req, res) => {
  try {
    const workshops = await Workshop.find().populate("artist");
    res.json(workshops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
