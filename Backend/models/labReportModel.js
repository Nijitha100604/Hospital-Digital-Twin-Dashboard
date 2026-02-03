import mongoose from "mongoose";

const labReportSchema = new mongoose.Schema({

  labReportId: { type: String, unique: true },
  appointmentId: { type: String, required: true },
  consultationId: { type: String, required: true },
  
  // --- PATIENT INFO ---
  patientId: { type: String, required: true },
  patientName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  
  // --- DOCTOR INFO ---
  doctorName: { type: String, required: true },
  doctorId: { type: String, required: true },
  
  // --- LAB DETAILS ---
  testName: { type: String, required: true },
  department: { type: String, default: "Pathology" },
  sampleDate: { type: Date, default: null },
  
  // --- TECHNICIAN ---
  technicianName: { type: String, default: "" },
  technicianId: { type: String, default: "" },

  // --- ENTRY MODE ---
  entryType: {
    type: String,
    enum: ["Upload", "Manual"],
    default: "Manual"
  },

  // OPTION A: File Upload
  reportDocument: { type: String, default: "" },

  // OPTION B: Manual Entry
  testResults: [
    {
      parameter: String, // e.g. "Hemoglobin"
      value: String,     // e.g. "12.5"
      unit: String,      // e.g. "g/dL"
      referenceRange: String, // e.g. "11.5 - 15.5"
      status: {          
        type: String,
        enum: ["Normal", "High", "Low", "Abnormal", "Pending"],
        default: "Pending"
      }
    }
  ],
  
  comments: { type: String, default: "" },
  completedAt: { type: Date, default: null },

  // --- STATUS ---
  status: {
    type: String,
    enum: ["Requested", "Completed"],
    default: "Requested",
  },

}, { timestamps: true });

// --- FIX: Async Hook WITHOUT 'next' ---
labReportSchema.pre("save", async function () {
  // If ID exists, skip
  if (this.labReportId) return; 

  const last = await mongoose.model("labReport").findOne({}, {}, { sort: { createdAt: -1 } });
  
  let num = 1;
  if (last && last.labReportId) {
    // Extract number from "LAB0001" -> 1
    const part = last.labReportId.replace("LAB", "");
    num = parseInt(part) + 1;
  }

  this.labReportId = `LAB${num.toString().padStart(4, "0")}`;
  // No need to call next() in an async function
});

const labReportModel = mongoose.models.labReport || mongoose.model("labReport", labReportSchema);

export default labReportModel;