import medicineModel from "../models/medicineModel.js";
import { v2 as cloudinary } from "cloudinary";

// Add new medicine
const addMedicine = async (req, res) => {
  try {
    const {
      medicineName,
      genericName,
      category,
      manufacturer,
      dosageForm,
      strength,
      packSize,
      batchNumber,
      quantity,
      minimumThreshold,
      manufacturingDate,
      expiryDate,
      storageLocation,
      storageConditions,
      supplierName,
      costPerUnit,
      sellingPrice,
      description,
    } = req.body;

    const imageFile = req.file;
    let imageUrl = "";

    // Required fields check
    if (
      !medicineName ||
      !genericName ||
      !category ||
      !manufacturer ||
      !dosageForm ||
      !strength ||
      !batchNumber ||
      !quantity ||
      !expiryDate ||
      !manufacturingDate ||
      !supplierName ||
      !costPerUnit
    ) {
      return res.json({
        success: false,
        message: "Please fill all mandatory fields",
      });
    }

    // Duplicate check (strict rule)
    const duplicate = await medicineModel.findOne({
      medicineName,
      genericName,
      batchNumber,
      manufacturer,
    });

    if (duplicate) {
      return res.json({
        success: false,
        message: "This medicine (same name & batch) already exists!",
      });
    }

    // Upload image if provided
    if (imageFile) {
  const uploadedImage = await cloudinary.uploader.upload(imageFile.path, {
    resource_type: "auto",
  });
  imageUrl = uploadedImage.secure_url;
}

    // Create new medicine
    const newMedicine = new medicineModel({
      medicineName,
      genericName,
      category,
      manufacturer,
      dosageForm,
      strength,
      packSize,
      batchNumber,
      quantity,
      minimumThreshold,
      expiryDate,
      storageLocation,
      storageConditions,
      supplierName,
      costPerUnit,
      sellingPrice,
      description,
      medicineImage: imageUrl,
      medicineImageName: imageFile ? imageFile.originalname : "Default Image",
    });

    await newMedicine.save();

    res.json({ success: true, message: "Medicine added successfully!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//Get all medicines
const getAllMedicines = async (req, res) => {
  try {
    const medicines = await medicineModel.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: medicines,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get medicine by ID
const getMedicineById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find using custom ID
    const medicine = await medicineModel.findOne({ medicineId: id });

    if (!medicine) {
      return res.json({ success: false, message: "Medicine not found!" });
    }

    res.json({ success: true, data: medicine });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update by medicineId
const updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;

    // Find by medicineId instead of _id
    const existing = await medicineModel.findOne({ medicineId: id });

    if (!existing) {
      return res.json({ success: false, message: "Medicine not found!" });
    }

    const imageFile = req.file;
    let imageUrl = existing.medicineImage;
    //  Preserve existing name by default
let imageName = existing.medicineImageName || "";

    // Upload new image if provided
    if (imageFile) {
      const uploadedImage = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "auto",
      });
      imageUrl = uploadedImage.secure_url;
      //Update name only if a new file is uploaded
  imageName = imageFile.originalname;
    }

    // Prepare update data safely
    const safeUpdateData = {
      medicineName: req.body.medicineName ?? existing.medicineName,
      genericName: req.body.genericName ?? existing.genericName,
      category: req.body.category ?? existing.category,
      manufacturer: req.body.manufacturer ?? existing.manufacturer,
      dosageForm: req.body.dosageForm ?? existing.dosageForm,
      strength: req.body.strength ?? existing.strength,
      packSize: req.body.packSize ?? existing.packSize,
      batchNumber: req.body.batchNumber ?? existing.batchNumber,
      quantity: req.body.quantity ?? existing.quantity,
      minimumThreshold:
        req.body.minimumThreshold ?? existing.minimumThreshold,
      manufacturingDate: req.body.manufacturingDate ?? existing.manufacturingDate,
      expiryDate: req.body.expiryDate ?? existing.expiryDate,
      storageLocation: req.body.storageLocation ?? existing.storageLocation,
      storageConditions:
        req.body.storageConditions ?? existing.storageConditions,
      supplierName: req.body.supplierName ?? existing.supplierName,
      costPerUnit: req.body.costPerUnit ?? existing.costPerUnit,
      sellingPrice: req.body.sellingPrice ?? existing.sellingPrice,
      description: req.body.description ?? existing.description,
      medicineImage: imageUrl,
      medicineImageName: imageName,
    };

    await medicineModel.updateOne({ medicineId: id }, safeUpdateData);

    res.json({ success: true, message: "Medicine updated successfully!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Delete by ID
const deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;

    const medicine = await medicineModel.findOne({ medicineId: id });

    if (!medicine) {
      return res.json({ success: false, message: "Medicine not found!" });
    }

    await medicineModel.deleteOne({ medicineId: id });

    res.json({ success: true, message: "Medicine deleted successfully!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  addMedicine,
  getAllMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
};
