import mongoose from "mongoose";

// --- AUTO-GENERATE REPORT ID (LR0001, LR0002...) ---
async function generateReportId() {
  try {
    const lastRecord = await labReportModel.findOne().sort({ _id: -1 });
    if (!lastRecord || !lastRecord.reportId) return "LR0001";

    const lastId = lastRecord.reportId; // e.g., "LR0015"
    const numericPart = parseInt(lastId.substring(2)); // Get 15
    const nextNumber = numericPart + 1; // 16
    return "LR" + nextNumber.toString().padStart(4, "0"); // "LR0016"
  } catch (error) {
    return "LR" + Date.now().toString().slice(-4); // Fallback unique ID
  }
}

const labReportSchema = new mongoose.Schema({
  reportId: {
    type: String,
    unique: true,
  },

  consultationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "consultation",
    required: true
  },


  // --- 1. PATIENT & DOCTOR DETAILS (From your Image) ---
  patientId: {
    type: String,
    required: [true, "Patient ID is required"], // e.g., "P000123"
    trim: true,
  },
  patientName: {
    type: String,
    required: [true, "Patient Name is required"],
    trim: true,
  },
  // Storing Age/Gender typically separated in DB for better analytics
  age: {
    type: String, // String to handle "25 Yrs" or "2 Months"
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true,
  },
  referringDoctor: {
    type: String,
    default: "Self", // e.g., "Dr. Smith"
  },
  sampleDate: {
    type: Date,
    required: [true, "Sample Date is required"],
    default: Date.now,
  },

  // --- 2. TEST & TECHNICIAN DETAILS (From your Image) ---
  testType: {
    type: String,
    required: [true, "Test Type is required"],
    trim: true, // e.g., "CBC", "X-Ray"
  },
  department: {
    type: String,
    default: "Pathology",
  },
  technicianName: {
    type: String,
    trim: true,
  },
  technicianId: {
    type: String,
    trim: true,
  },

  // --- 3. MODE OF ENTRY (Combined Logic) ---
  entryType: {
    type: String,
    enum: ["Upload", "Manual"],
    required: true,
    default: "Manual"
  },

  // OPTION A: For "Upload Report" (File Path/URL)
  reportDocument: {
    type: String, // Cloudinary URL or Base64 string
    required: function() { return this.entryType === 'Upload'; } 
  },

  // OPTION B: For "Result Entry" (Structured Data)
  testResults: [
    {
      parameter: String, // e.g. "Hemoglobin"
      value: String,     // e.g. "12.5"
      unit: String,      // e.g. "g/dL"
      referenceRange: String, // e.g. "11.5 - 15.5"
      status: {          // Auto-calculated flag
        type: String,
        enum: ["Normal", "High", "Low", "Abnormal", ""],
        default: "Normal"
      }
    }
  ],
  
  // Pathologist's Remarks (Common for both)
  comments: {
    type: String,
    default: ""
  },

  // --- SYSTEM FIELDS ---
  status: {
    type: String,
    enum: ["Pending", "Completed", "Printed"],
    default: "Completed",
  },

}, { timestamps: true });

// --- PRE-SAVE HOOK ---
// Automatically adds the ID like "LR0001" before saving
labReportSchema.pre("save", async function (next) {
  if (!this.reportId) {
    this.reportId = await generateReportId();
  }
  next();
});

const labReportModel = mongoose.models.labReport || mongoose.model("labReport", labReportSchema);

export default labReportModel;
