import Event from "../models/Event.js";

// Create a new event
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, mode, tag } = req.body;

    // Ensure all required fields are present
    if (!title || !description || !date || !mode || !tag) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const event = await Event.create({
      title,
      description,
      date,
      mode,
      tag,
    });

    res.status(201).json(event);
  } catch (err) {
    console.error("Create Event Error:", err);
    res.status(500).json({ message: "Failed to create event" });
  }
};

// Fetch all events sorted by upcoming date
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });

    res.status(200).json(events);
  } catch (err) {
    console.error("Get Events Error:", err);
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

// Fetch events waiting for approval (admin use)
export const getPendingEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "pending" }).sort({
      createdAt: -1,
    });

    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch pending events" });
  }
};

// Approve or reject an event (admin moderation)
export const moderateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Only allow valid moderation states
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const event = await Event.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (err) {
    res.status(500).json({ message: "Event moderation failed" });
  }
};
