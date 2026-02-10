import mongoose from "mongoose";

const labReportSchema = new mongoose.Schema({
  labReportId: { type: String, unique: true },
  appointmentId: { type: String, required: true },
  consultationId: { type: String, required: true },
  
  // Patient & Doctor Info
  patientId: { type: String, required: true },
  patientName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  doctorName: { type: String, required: true },
  doctorId: { type: String, required: true },
  
  // Lab Details
  testName: { type: String, required: true },
  department: { type: String, default: "Pathology" },
  sampleDate: { type: Date, default: null },
  technicianName: { type: String, default: "" },
  technicianId: { type: String, default: "" },

  // Entry Data
  entryType: { type: String, enum: ["Upload", "Manual"], default: "Manual" },
  reportDocument: { type: String, default: "" },
  testResults: [
    {
      parameter: String,
      value: String,
      unit: String,
      referenceRange: String,
      status: { type: String, enum: ["Normal", "High", "Low", "Abnormal", "Pending"], default: "Pending" }
    }
  ],
  
  comments: { type: String, default: "" },
  completedAt: { type: Date, default: null },
  status: { type: String, enum: ["Requested", "Completed"], default: "Requested" },

  // --- 1. AMENDMENT HISTORY (Already exists) ---
  revisionHistory: [
    {
      amendedBy: String,
      amendedAt: Date,
      reason: String,
      previousResults: Array,
      previousFile: String
    }
  ],

  // --- 2. NEW: SOFT DELETE FIELDS ---
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
  deletionReason: { type: String, default: "" },
  deletedBy: { type: String, default: "" } // Optional: Track who deleted it

}, { timestamps: true });

// Auto-Generate ID Hook
labReportSchema.pre("save", async function () {
  if (this.labReportId) return; 
  const last = await mongoose.model("labReport").findOne({}, {}, { sort: { createdAt: -1 } });
  let num = 1;
  if (last && last.labReportId) {
    const part = last.labReportId.replace("LAB", "");
    num = parseInt(part) + 1;
  }
  this.labReportId = `LAB${num.toString().padStart(4, "0")}`;
});

const labReportModel = mongoose.models.labReport || mongoose.model("labReport", labReportSchema);

export default labReportModel;