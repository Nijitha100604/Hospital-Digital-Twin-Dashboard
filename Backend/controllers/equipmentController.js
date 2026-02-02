import equipmentModel from "../models/equipmentModel.js";
import { v2 as cloudinary } from "cloudinary";

// Add new Equipment
const addEquipment = async (req, res) => {
  try {
    const data = req.body;
    const imageFile = req.file;
    let imageUrl = "";
    
    const basicInfo = data.basicInfo || {
      equipmentName: data.equipmentName,
      serialNumber: data.serialNumber,
      modelName: data.modelName,
      manufacturer: data.manufacturer,
      category: data.category,
      department: data.department,
      location: data.location,
      equipmentStatus: data.equipmentStatus
    };

    const technicalSpecifications = data.technicalSpecifications || {
      fieldStrength: data.fieldStrength,
      boreSize: data.boreSize,
      maxGradient: data.maxGradient,
      slewRate: data.slewRate,
      powerRequirement: data.powerRequirement
    };

    const serviceSchedule = data.serviceSchedule || {
      lastService: data.lastService,
      nextService: data.nextService
    };

    const purchaseInfo = data.purchaseInfo || {
      installationDate: data.installationDate,
      purchaseCost: data.purchaseCost,
      warrantyPeriod: data.warrantyPeriod,
      warrantyExpiry: data.warrantyExpiry
    };

    const supplier = data.supplier || {
      supplierName: data.supplierName,
      contactNumber: data.contactNumber,
      emailId: data.emailId
    };

    const description = data.description;

    if (
      !basicInfo.equipmentName || 
      !basicInfo.serialNumber || 
      !basicInfo.manufacturer || 
      !basicInfo.department || 
      !supplier.supplierName
    ) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    //Check duplicate
    const exists = await equipmentModel.findOne({ "basicInfo.serialNumber": basicInfo.serialNumber });
    if (exists) {
      return res.json({ success: false, message: "Equipment with this Serial Number already exists!" });
    }

    if (imageFile) {
      const uploadRes = await cloudinary.uploader.upload(imageFile.path, { resource_type: "auto" });
      imageUrl = uploadRes.secure_url;
    }

    const newEquipment = new equipmentModel({
      basicInfo,
      technicalSpecifications,
      serviceSchedule,
      purchaseInfo,
      supplier,
      description,
      equipmentImage: imageUrl,
      equipmentImageName: imageFile ? imageFile.originalname : ""
    });

    await newEquipment.save();
    res.json({ success: true, message: "Equipment Added Successfully" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get All Equipment
const getAllEquipment = async (req, res) => {
  try {
    const equipment = await equipmentModel.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: equipment });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get Single Equipment
const getEquipmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const equipment = await equipmentModel.findOne({ equipmentId: id });
    
    if (!equipment) {
      return res.json({ success: false, message: "Equipment not found" });
    }
    res.json({ success: true, data: equipment });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update Equipment
const updateEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await equipmentModel.findOne({ equipmentId: id });

    if (!existing) {
      return res.json({ success: false, message: "Equipment not found" });
    }

    const data = req.body;
    const imageFile = req.file;
    let imageUrl = existing.equipmentImage;
    let imageName = existing.equipmentImageName;

    if (imageFile) {
      const uploadRes = await cloudinary.uploader.upload(imageFile.path, { resource_type: "auto" });
      imageUrl = uploadRes.secure_url;
      imageName = imageFile.originalname;
    }

    // Helper to merge data (Nested or Flat)
    const getUpdate = (nestedKey, flatKey, fallback) => {
      if (data[nestedKey] && data[nestedKey][flatKey] !== undefined) return data[nestedKey][flatKey];
      if (data[flatKey] !== undefined) return data[flatKey];
      return fallback;
    };

    const updateData = {
        basicInfo: {
            equipmentName: getUpdate('basicInfo', 'equipmentName', existing.basicInfo.equipmentName),
            serialNumber: getUpdate('basicInfo', 'serialNumber', existing.basicInfo.serialNumber),
            modelName: getUpdate('basicInfo', 'modelName', existing.basicInfo.modelName),
            manufacturer: getUpdate('basicInfo', 'manufacturer', existing.basicInfo.manufacturer),
            category: getUpdate('basicInfo', 'category', existing.basicInfo.category),
            department: getUpdate('basicInfo', 'department', existing.basicInfo.department),
            location: getUpdate('basicInfo', 'location', existing.basicInfo.location),
            equipmentStatus: getUpdate('basicInfo', 'equipmentStatus', existing.basicInfo.equipmentStatus),
        },
        technicalSpecifications: {
            fieldStrength: getUpdate('technicalSpecifications', 'fieldStrength', existing.technicalSpecifications.fieldStrength),
            boreSize: getUpdate('technicalSpecifications', 'boreSize', existing.technicalSpecifications.boreSize),
            maxGradient: getUpdate('technicalSpecifications', 'maxGradient', existing.technicalSpecifications.maxGradient),
            slewRate: getUpdate('technicalSpecifications', 'slewRate', existing.technicalSpecifications.slewRate),
            powerRequirement: getUpdate('technicalSpecifications', 'powerRequirement', existing.technicalSpecifications.powerRequirement),
        },
        serviceSchedule: {
            lastService: getUpdate('serviceSchedule', 'lastService', existing.serviceSchedule.lastService),
            nextService: getUpdate('serviceSchedule', 'nextService', existing.serviceSchedule.nextService),
        },
        purchaseInfo: {
            installationDate: getUpdate('purchaseInfo', 'installationDate', existing.purchaseInfo.installationDate),
            purchaseCost: getUpdate('purchaseInfo', 'purchaseCost', existing.purchaseInfo.purchaseCost),
            warrantyPeriod: getUpdate('purchaseInfo', 'warrantyPeriod', existing.purchaseInfo.warrantyPeriod),
            warrantyExpiry: getUpdate('purchaseInfo', 'warrantyExpiry', existing.purchaseInfo.warrantyExpiry),
        },
        supplier: {
            supplierName: getUpdate('supplier', 'supplierName', existing.supplier.supplierName),
            contactNumber: getUpdate('supplier', 'contactNumber', existing.supplier.contactNumber),
            emailId: getUpdate('supplier', 'emailId', existing.supplier.emailId),
        },
        description: data.description || existing.description,
        equipmentImage: imageUrl,
        equipmentImageName: imageName
    };

    await equipmentModel.updateOne({ equipmentId: id }, updateData);
    res.json({ success: true, message: "Equipment updated successfully" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Delete Equipment
const deleteEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await equipmentModel.findOneAndDelete({ equipmentId: id });

    if (!deleted) {
      return res.json({ success: false, message: "Equipment not found" });
    }

    res.json({ success: true, message: "Equipment deleted successfully" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  addEquipment,
  getAllEquipment,
  getEquipmentById,
  updateEquipment,
  deleteEquipment
};