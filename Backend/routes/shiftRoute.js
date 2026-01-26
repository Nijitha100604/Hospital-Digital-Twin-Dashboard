import express from "express";
import authUser from "../middlewares/authUser.js";

import {
  addShift,
  getAllShifts,
  getShiftsByRange,
  updateShift,
  deleteShift,
} from "../controllers/shiftController.js";

const shiftRouter = express.Router();

// --- Shift Management Routes ---

// Add a new shift (Protected)
shiftRouter.post(
  "/add-shift", 
  authUser, 
  addShift
);

// Get all shifts (Protected)
shiftRouter.get(
  "/all-shifts", 
  authUser, 
  getAllShifts
);

// Get shifts by date range (e.g. ?startDate=...&endDate=...)
shiftRouter.get(
  "/range", 
  authUser, 
  getShiftsByRange
);

// Update a specific shift
shiftRouter.put(
  "/update/:id", 
  authUser, 
  updateShift
);

// Delete a shift
shiftRouter.delete(
  "/delete/:id", 
  authUser, 
  deleteShift
);

export default shiftRouter;