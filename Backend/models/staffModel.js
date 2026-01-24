import mongoose from "mongoose";

// Declare the model reference first
let staffModel;

async function generateStaffId() {
  try {
    const lastRecord = await staffModel.findOne().sort({ _id: -1 });
    
    if (!lastRecord || !lastRecord.staffId) {
      return "STF0001";
    }

    const lastId = lastRecord.staffId;
    const numeric = parseInt(lastId.substring(3)) + 1;
    return "STF" + numeric.toString().padStart(4, "0");
  } catch (error) {
    console.error("Error generating staff ID:", error);
    return "STF0001";
  }
}

const staffSchema = new mongoose.Schema({
  staffId: {
    type: String,
    unique: true,
  },
  fullName: {
    type: String,
    required: [true, "Full Name is required"],
    trim: true,
  },
  gender: {
    type: String,
    required: [true, "Gender is required"],
    enum: ["Male", "Female", "Other"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  contactNumber: {
    type: String, 
    required: [true, "Contact Number is required"],
    trim: true,
  },
  dateOfBirth: {
    type: Date,
    required: [true, "Date of Birth is required"],
  },
  address: {
    type: String,
    required: [true, "Address is required"],
    trim: true,
  },
  
  // Professional Details
  designation: {
    type: String,
    required: [true, "Designation is required"],
    enum: ["Doctor", "Nurse", "Admin", "Support", "Technician", "Receptionist", "Pharmacist", "Inventory Incharge", "Reception Incharge"], 
  },
  department: {
    type: String,
    required: [true, "Department is required"],
  },
  qualification: {
    type: String,
    required: [true, "Qualification is required"],
    trim: true,
  },
  specialization: {
    type: String,
    default: "General",
    trim: true,
  },
  experience: {
    type: Number, 
    required: [true, "Years of Experience is required"],
    min: 0,
  },
  licenseNumber: {
    type: String,
    required: [true, "License/Registration Number is required"],
    unique: true,
    trim: true,
  },
  employmentType: {
    type: String,
    required: [true, "Employment Type is required"],
    enum: ["Permanent", "Contract", "Visiting", "Intern"],
  },
  joiningDate: {
    type: Date,
    required: [true, "Joining Date is required"],
    default: Date.now,
  },
  
  // Documents & Status
  profilePhoto: {
    type: String,
    default: "",
  },
  idProofDoc: {
    type: String, 
    default: "",
  },
  idProofName: { 
    type: String,
    default: ""
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },
}, { timestamps: true });

staffSchema.pre("save", async function () {
  if (!this.staffId) {
    this.staffId = await generateStaffId();
  }
});

staffModel = mongoose.models.staff || mongoose.model("staff", staffSchema);

export default staffModel;