import supplierModel from "../models/supplierModel.js";
import { v2 as cloudinary } from "cloudinary";

// Add new supplier
const addSupplier = async (req, res) => {
  try {
    const {
      supplierName,
      contactPerson,
      email,
      phone,
      street,
      city,
      state,
      zip,
      country,
      category,
      taxId,
      paymentTerms,
      creditLimit,
      bankName,
      accountNumber,
      ifsc,
      itemsSupplied, // Expecting comma-separated string from frontend form
      notes,
      status,
      rating,
    } = req.body;

    const file = req.file; // For optional document/contract upload
    let documentUrl = "";
    let documentName = "";

    // Required fields check
    if (
      !supplierName ||
      !contactPerson ||
      !email ||
      !phone ||
      !category ||
      !paymentTerms
    ) {
      return res.json({
        success: false,
        message: "Please fill all mandatory fields",
      });
    }

    // Duplicate check (by email)
    const duplicate = await supplierModel.findOne({ email });
    if (duplicate) {
      return res.json({
        success: false,
        message: "A supplier with this email already exists!",
      });
    }

    // Upload document if provided
    if (file) {
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        resource_type: "auto",
      });
      documentUrl = uploadResult.secure_url;
      documentName = file.originalname;
    }

    // Process itemsSupplied (convert comma string to array)
    let suppliesArray = [];
    if (itemsSupplied) {
      suppliesArray = typeof itemsSupplied === "string" 
        ? itemsSupplied.split(",").map((item) => item.trim())
        : itemsSupplied;
    }

    // Create new supplier
    const newSupplier = new supplierModel({
      supplierName,
      contactPerson,
      email,
      phone,
      address: {
        street: street || "",
        city: city || "",
        state: state || "",
        zip: zip || "",
        country: country || "",
      },
      category,
      taxId: taxId || "",
      paymentTerms,
      creditLimit: creditLimit || 0,
      bankDetails: {
        bankName: bankName || "",
        accountNumber: accountNumber || "",
        ifsc: ifsc || "",
      },
      itemsSupplied: suppliesArray,
      notes: notes || "",
      status: status || "Active",
      rating: rating || 0,
      documentUrl,
      documentName,
    });

    await newSupplier.save();

    res.json({ success: true, message: "Supplier added successfully!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get all suppliers
const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await supplierModel.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: suppliers,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get supplier by ID
const getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find using custom ID (supplierId: SUP0001)
    const supplier = await supplierModel.findOne({ supplierId: id });

    if (!supplier) {
      return res.json({ success: false, message: "Supplier not found!" });
    }

    res.json({ success: true, data: supplier });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update supplier
const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    // Find by custom supplierId
    const existing = await supplierModel.findOne({ supplierId: id });

    if (!existing) {
      return res.json({ success: false, message: "Supplier not found!" });
    }

    const file = req.file;
    let documentUrl = existing.documentUrl;
    let documentName = existing.documentName;

    // Upload new document if provided
    if (file) {
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        resource_type: "auto",
      });
      documentUrl = uploadResult.secure_url;
      documentName = file.originalname;
    }

    // Process itemsSupplied update
    let suppliesArray = existing.itemsSupplied;
    if (req.body.itemsSupplied) {
      suppliesArray = typeof req.body.itemsSupplied === "string" 
        ? req.body.itemsSupplied.split(",").map((item) => item.trim())
        : req.body.itemsSupplied;
    }

    const updateData = {
      supplierName: req.body.supplierName ?? existing.supplierName,
      contactPerson: req.body.contactPerson ?? existing.contactPerson,
      email: req.body.email ?? existing.email,
      phone: req.body.phone ?? existing.phone,
      
      address: {
        street: req.body.street ?? existing.address.street,
        city: req.body.city ?? existing.address.city,
        state: req.body.state ?? existing.address.state,
        zip: req.body.zip ?? existing.address.zip,
        country: req.body.country ?? existing.address.country,
      },

      category: req.body.category ?? existing.category,
      taxId: req.body.taxId ?? existing.taxId,
      paymentTerms: req.body.paymentTerms ?? existing.paymentTerms,
      creditLimit: req.body.creditLimit ?? existing.creditLimit,

      bankDetails: {
        bankName: req.body.bankName ?? existing.bankDetails.bankName,
        accountNumber: req.body.accountNumber ?? existing.bankDetails.accountNumber,
        ifsc: req.body.ifsc ?? existing.bankDetails.ifsc,
      },

      itemsSupplied: suppliesArray,
      notes: req.body.notes ?? existing.notes,
      status: req.body.status ?? existing.status,
      rating: req.body.rating ?? existing.rating,
      documentUrl: documentUrl,
      documentName: documentName,
    };

    await supplierModel.updateOne({ supplierId: id }, updateData);

    res.json({ success: true, message: "Supplier updated successfully!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Delete supplier
const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const supplier = await supplierModel.findOne({ supplierId: id });

    if (!supplier) {
      return res.json({ success: false, message: "Supplier not found!" });
    }

    await supplierModel.deleteOne({ supplierId: id });

    res.json({ success: true, message: "Supplier deleted successfully!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  addSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};