import express from "express";
import upload from "../middlewares/multer.js";
import authUser from "../middlewares/authUser.js";

import {
  addStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
} from "../controllers/staffController.js";

const staffRouter = express.Router();

const staffUploads = upload.fields([
  { name: "profilePhoto", maxCount: 1 },
  { name: "idProofDoc", maxCount: 1 },
]);

// Add New Staff (Protected)
staffRouter.post(
  "/add-staff", 
  authUser, 
  staffUploads, 
  addStaff
);

// --- MODIFIED: Removed 'authUser' so frontend can fetch data ---
// Get All Staff
staffRouter.get(
  "/all-staff", 
  getAllStaff
);

// Get Staff by ID
staffRouter.get(
  "/staff/:id", 
  getStaffById
);
// -------------------------------------------------------------

// Update Staff (Protected)
staffRouter.put(
  "/update/:id", 
  authUser, 
  staffUploads, 
  updateStaff
);

// Delete Staff (Protected)
staffRouter.delete(
  "/delete/:id", 
  authUser, 
  deleteStaff
);

export default staffRouter;