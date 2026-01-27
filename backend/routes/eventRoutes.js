import express from "express";
import {
  createEvent,
  getEvents,
  getPendingEvents,
  moderateEvent,
} from "../controllers/eventController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* PUBLIC */
router.get("/", getEvents);

/* ADMIN */
router.post("/", protect, isAdmin, createEvent);
router.get("/pending", protect, isAdmin, getPendingEvents);
router.put("/moderate/:id", protect, isAdmin, moderateEvent);

export default router;
