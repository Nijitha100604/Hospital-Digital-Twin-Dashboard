import mongoose from "mongoose";

// Auto-Generate Staff ID (S001, S002...)
async function generateStaffId() {
  const lastRecord = await staffModel.findOne().sort({ _id: -1 });
  if (!lastRecord) return "STF0001";

  const lastId = lastRecord.staffId;
  const numeric = parseInt(lastId.substring(3)) + 1;
  return "STF" + numeric.toString().padStart(4, "0");
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
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  contactNumber: {
    type: String, // String allows preserving leading zeros if any
    required: [true, "Contact Number is required"],
    trim: true,
  },
  dateOfBirth: {
    type: Date,
    required: [true, "Date of Birth is required"],
  },
  profilePhoto: {
    type: String, // Store image as Base64 string or URL
    default: "",
  },
  address: {
    type: String,
    required: [true, "Address is required"],
    trim: true,
  },
  
  // Qualification Details
  designation: {
    type: String,
    required: [true, "Designation is required"],
    enum: ["Doctor", "Nurse", "Admin", "Support", "Technician", "Receptionist"], 
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
    type: Number, // Years of experience
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
  
  // Uploaded Documents (e.g., ID Proof)
  idProofDoc: {
    type: String, // Store document as Base64 or URL
    default: "",
  },
  idProofName: { // To store original filename if needed
      type: String,
      default: ""
  },

  // System Fields
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

// Auto-generate ID before saving
staffSchema.pre("save", async function (next) {
  if (!this.staffId) {
    this.staffId = await generateStaffId();
  }
  next();
});

const staffModel = mongoose.models.staff || mongoose.model("staff", staffSchema);

export default staffModel;