import staffModel from "../models/staffModel.js";
import { v2 as cloudinary } from "cloudinary";
import validator from "validator";

// --- 1. ADD NEW STAFF ---
const addStaff = async (req, res) => {
  try {
    const {
      fullName,
      gender,
      email,
      contactNumber,
      dateOfBirth,
      address,
      designation,
      department,
      qualification,
      specialization,
      experience,
      licenseNumber,
      employmentType,
      joiningDate,
      status,
      profilePhoto: profilePhotoBase64,
      idProofDoc: idProofDocBase64
    } = req.body;

    const profileImage = req.files?.profilePhoto?.[0];
    const idProofFile = req.files?.idProofDoc?.[0];

    // Basic Validation
    if (
      !fullName ||
      !email ||
      !contactNumber ||
      !designation ||
      !department ||
      !licenseNumber
    ) {
      return res.json({
        success: false,
        message: "Please fill all mandatory fields (Name, Email, Phone, Role, License)",
      });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email address format" });
    }

    const existingStaff = await staffModel.findOne({
      $or: [{ email: email }, { licenseNumber: licenseNumber }],
    });

    if (existingStaff) {
      return res.json({
        success: false,
        message: "Staff with this Email or License Number already exists!",
      });
    }

    let profileUrl = "";
    let idProofUrl = "";
    let idProofOriginalName = "";

    // Handle file uploads
    if (profileImage) {
      const uploadRes = await cloudinary.uploader.upload(profileImage.path, {
        resource_type: "auto",
        folder: "staff_profiles",
      });
      profileUrl = uploadRes.secure_url;
    } else if (profilePhotoBase64) {
      // Use base64 data if provided
      profileUrl = profilePhotoBase64;
    }

    if (idProofFile) {
      const uploadRes = await cloudinary.uploader.upload(idProofFile.path, {
        resource_type: "auto",
        folder: "staff_docs",
      });
      idProofUrl = uploadRes.secure_url;
      idProofOriginalName = idProofFile.originalname;
    } else if (idProofDocBase64) {
      idProofUrl = idProofDocBase64;
    }

    const newStaff = new staffModel({
      fullName,
      gender,
      email,
      contactNumber,
      dateOfBirth,
      address,
      designation,
      department,
      qualification,
      specialization,
      experience,
      licenseNumber,
      employmentType,
      joiningDate,
      status: status || "Active",
      profilePhoto: profileUrl,
      idProofDoc: idProofUrl,
      idProofName: idProofOriginalName,
    });

    await newStaff.save();

    res.json({ success: true, message: "Staff member added successfully!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// --- 2. GET ALL STAFF ---
const getAllStaff = async (req, res) => {
  try {
    const staffList = await staffModel.find().sort({ createdAt: -1 });
    res.json({ success: true, data: staffList });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// --- 3. GET STAFF BY ID ---
const getStaffById = async (req, res) => {
  try {
    const { id } = req.params;
    const staff = await staffModel.findOne({ staffId: id });

    if (!staff) {
      return res.json({ success: false, message: "Staff not found!" });
    }

    res.json({ success: true, data: staff });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// --- 4. UPDATE STAFF ---
const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await staffModel.findOne({ staffId: id });
    if (!existing) {
      return res.json({ success: false, message: "Staff not found!" });
    }

    const profileImage = req.files?.profilePhoto?.[0];
    const idProofFile = req.files?.idProofDoc?.[0];

    let profileUrl = existing.profilePhoto;
    let idProofUrl = existing.idProofDoc;
    let idProofName = existing.idProofName;

    if (profileImage) {
      const uploadRes = await cloudinary.uploader.upload(profileImage.path, {
        resource_type: "auto",
      });
      profileUrl = uploadRes.secure_url;
    }

    if (idProofFile) {
      const uploadRes = await cloudinary.uploader.upload(idProofFile.path, {
        resource_type: "auto",
      });
      idProofUrl = uploadRes.secure_url;
      idProofName = idProofFile.originalname;
    }

    const updateData = {
      fullName: req.body.fullName ?? existing.fullName,
      gender: req.body.gender ?? existing.gender,
      email: req.body.email ?? existing.email,
      contactNumber: req.body.contactNumber ?? existing.contactNumber,
      dateOfBirth: req.body.dateOfBirth ?? existing.dateOfBirth,
      address: req.body.address ?? existing.address,
      designation: req.body.designation ?? existing.designation,
      department: req.body.department ?? existing.department,
      qualification: req.body.qualification ?? existing.qualification,
      specialization: req.body.specialization ?? existing.specialization,
      experience: req.body.experience ?? existing.experience,
      licenseNumber: req.body.licenseNumber ?? existing.licenseNumber,
      employmentType: req.body.employmentType ?? existing.employmentType,
      joiningDate: req.body.joiningDate ?? existing.joiningDate,
      status: req.body.status ?? existing.status,
      profilePhoto: profileUrl,
      idProofDoc: idProofUrl,
      idProofName: idProofName,
    };

    await staffModel.updateOne({ staffId: id }, updateData);

    res.json({ success: true, message: "Staff details updated successfully!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// --- 5. DELETE STAFF ---
const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const staff = await staffModel.findOne({ staffId: id });

    if (!staff) {
      return res.json({ success: false, message: "Staff not found!" });
    }

    await staffModel.deleteOne({ staffId: id });

    res.json({ success: true, message: "Staff deleted successfully!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addStaff, getAllStaff, getStaffById, updateStaff, deleteStaff };