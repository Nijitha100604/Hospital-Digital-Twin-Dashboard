import express from "express";
import authUser from "../middlewares/authUser.js";
import { applyLeave, getAllLeaves, updateLeaveStatus } from "../controllers/leaveController.js";

const leaveRouter = express.Router();

// Apply for Leave
leaveRouter.post("/apply", authUser, applyLeave);

// Get All Leave Requests
leaveRouter.get("/all-leaves", authUser, getAllLeaves);

// Update Status (Approve/Reject)
leaveRouter.put("/update-status/:id", authUser, updateLeaveStatus);

export default leaveRouter;