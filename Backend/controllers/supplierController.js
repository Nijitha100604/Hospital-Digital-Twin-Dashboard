import supplierModel from "../models/supplierModel.js";
import { v2 as cloudinary } from "cloudinary";

// Helper to determine resource type
const getResourceType = (mimetype) => {
  if (
    mimetype.includes("pdf") ||
    mimetype.includes("document") ||
    mimetype.includes("text")
  ) {
    return "raw"; 
  }
  return "auto"; 
};

// Add New Supplier 
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
      itemsSupplied, 
      totalSupplies,
      notes,
      status,
      rating,
      // Allow passing document details via JSON body if file isn't uploaded 
      documentName: bodyDocName,
      documentUrl: bodyDocUrl
    } = req.body;

    const file = req.file; 
    let documentUrl = bodyDocUrl || "";
    let documentName = bodyDocName || "";

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

    // Duplicate check
    const duplicate = await supplierModel.findOne({ email });
    if (duplicate) {
      return res.json({
        success: false,
        message: "A supplier with this email already exists!",
      });
    }

    // Upload document if provided
    if (file) {
      const resourceType = getResourceType(file.mimetype);
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        resource_type: resourceType,
        use_filename: true,
        unique_filename: false,
      });
      documentUrl = uploadResult.secure_url;
      documentName = file.originalname;
    }

    // Process itemsSupplied
    let suppliesArray = [];
    if (itemsSupplied) {
      suppliesArray =
        typeof itemsSupplied === "string"
          ? itemsSupplied.split(",").map((item) => item.trim())
          : itemsSupplied; // Accepts Array if sent via JSON
    }

    const newSupplier = new supplierModel({
      supplierName,
      contactPerson,
      email,
      phone,
      address: {
        street: street || req.body.address?.street || "",
        city: city || req.body.address?.city || "",
        state: state || req.body.address?.state || "",
        zip: zip || req.body.address?.zip || "",
        country: country || req.body.address?.country || "",
      },
      category,
      taxId: taxId || "",
      paymentTerms,
      creditLimit: creditLimit || 0,
      bankDetails: {
        bankName: bankName || req.body.bankDetails?.bankName || "",
        accountNumber: accountNumber || req.body.bankDetails?.accountNumber || "",
        ifsc: ifsc || req.body.bankDetails?.ifsc || "",
      },
      itemsSupplied: suppliesArray,
      totalSupplies: totalSupplies || 0,
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

// Seed Suppliers (Bulk Add via Array)
const seedSuppliers = async (req, res) => {
  try {
    const suppliers = req.body; 

    if (!Array.isArray(suppliers)) {
      return res.json({ success: false, message: "Expected an array of suppliers" });
    }

    let count = 0;
    for (const s of suppliers) {
      const exists = await supplierModel.findOne({ email: s.email });
      if (!exists) {
        const newSupplier = new supplierModel(s);
        await newSupplier.save();
        count++;
      }
    }

    res.json({ success: true, message: `Successfully added ${count} new suppliers!` });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get All Suppliers
const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await supplierModel.find().sort({ createdAt: -1 });
    res.json({ success: true, data: suppliers });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get Supplier by ID
const getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;
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

// Update Supplier
const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await supplierModel.findOne({ supplierId: id });

    if (!existing) {
      return res.json({ success: false, message: "Supplier not found!" });
    }

    const file = req.file;
    let documentUrl = existing.documentUrl;
    let documentName = existing.documentName;

    // Upload new document if provided
    if (file) {
      const resourceType = getResourceType(file.mimetype);
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        resource_type: resourceType,
        use_filename: true,
        unique_filename: false,
      });
      documentUrl = uploadResult.secure_url;
      documentName = file.originalname;
    }

    let suppliesArray = existing.itemsSupplied;
    if (req.body.itemsSupplied) {
      suppliesArray =
        typeof req.body.itemsSupplied === "string"
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
      totalSupplies: req.body.totalSupplies ?? existing.totalSupplies,
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

// Delete Supplier
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
  seedSuppliers, 
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};