import express from "express";
import upload from "../middlewares/multer.js";
import authUser from "../middlewares/authUser.js";

import {
  addMedicine,
  getAllMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
} from "../controllers/medicineController.js";

const medicineRouter = express.Router();

// Add New Medicine
medicineRouter.post("/add-medicine", authUser, upload.single("medicineImage"), addMedicine,);

// Get All Medicine
medicineRouter.get("/all-medicines", authUser, getAllMedicines);

// Get Medicine by Id
medicineRouter.get("/medicine/:id", authUser, getMedicineById);

// Update Medicine
medicineRouter.put("/update/:id", authUser, upload.single("medicineImage"),updateMedicine,);

// Delete Medicine
medicineRouter.delete("/delete/:id", authUser, deleteMedicine);

export default medicineRouter;
