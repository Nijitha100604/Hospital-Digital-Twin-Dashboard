import express from "express";
import upload from "../middlewares/multer.js";
import authUser from "../middlewares/authUser.js";
import {
  addEquipment,
  getAllEquipment,
  getEquipmentById,
  updateEquipment,
  deleteEquipment
} from "../controllers/equipmentController.js";

const equipmentRouter = express.Router();

// Add
equipmentRouter.post("/add-equipment", authUser, upload.single("equipmentImage"), addEquipment);

// Read
equipmentRouter.get("/all-equipments", authUser, getAllEquipment);
equipmentRouter.get("/:id", authUser, getEquipmentById);

// Update
equipmentRouter.put("/update/:id", authUser, upload.single("equipmentImage"), updateEquipment);

// Delete
equipmentRouter.delete("/delete/:id", authUser, deleteEquipment);

export default equipmentRouter;