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

staffRouter.post( "/add-staff", authUser, upload.fields([
    { 
      name: "profilePhoto", 
      maxCount: 1 },
    { 
      name: "idProofDoc", 
      maxCount: 1 }
  ]), addStaff);
staffRouter.get( "/all-staff", authUser, getAllStaff );
staffRouter.get( "/staff/:id", authUser, getStaffById );
staffRouter.put( "/update/:id", authUser, upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "idProofDoc", maxCount: 1 }
  ]), updateStaff );
staffRouter.delete( "/delete/:id", authUser, deleteStaff );

export default staffRouter;