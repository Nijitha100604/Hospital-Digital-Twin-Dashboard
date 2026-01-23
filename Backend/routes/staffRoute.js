import { addStaff } from '../controllers/staffController.js';
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

// --- Configuration for Multiple File Uploads ---
const staffUploads = upload.fields([
  { name: "profilePhoto", maxCount: 1 },
  { name: "idProofDoc", maxCount: 1 },
]);

// Add New Staff
staffRouter.post(
  "/add-staff", 
  authUser, 
  staffUploads, // Handles both profilePhoto and idProofDoc
  addStaff
);

// Get All Staff
staffRouter.get(
  "/all-staff", 
  authUser, 
  getAllStaff
);

// Get Staff by ID
staffRouter.get(
  "/staff/:id", 
  authUser, 
  getStaffById
);

// Update Staff
staffRouter.put(
  "/update/:id", 
  authUser, 
  staffUploads, // Allows updating images as well
  updateStaff
);

// Delete Staff
staffRouter.delete(
  "/delete/:id", 
  authUser, 
  deleteStaff
);

export default staffRouter;