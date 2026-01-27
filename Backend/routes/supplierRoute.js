import express from "express";
import upload from "../middlewares/multer.js";
import authUser from "../middlewares/authUser.js";

import {
  addSupplier,
  seedSuppliers, 
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplierController.js";

const supplierRouter = express.Router();

// Add New Supplier (Single)
supplierRouter.post(
  "/add-supplier",
  authUser,
  upload.single("document"), 
  addSupplier
);

// Seed Suppliers (Add via JSON)
supplierRouter.post(
  "/seed-suppliers",
  authUser,
  seedSuppliers
);

// Get All Suppliers
supplierRouter.get("/all-suppliers", authUser, getAllSuppliers);

// Get Supplier by Id
supplierRouter.get("/supplier/:id", authUser, getSupplierById);

// Update Supplier
supplierRouter.put(
  "/update/:id",
  authUser,
  upload.single("document"),
  updateSupplier
);

// Delete Supplier
supplierRouter.delete("/delete/:id", authUser, deleteSupplier);

export default supplierRouter;