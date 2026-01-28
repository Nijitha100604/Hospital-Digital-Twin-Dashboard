import mongoose from "mongoose";

const labReportSchema = new mongoose.Schema({

  labReportId: { type: String, unique: true },
  appointmentId:{ type: String, required: true},
  consultationId:{ type: String, required: true },
  patientId: { type: String, required: true },
  patientName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  doctorName: { type: String, required: true },
  doctorId: { type: String, required: true },
  sampleDate: {
    type: Date,
    default : null
  },
  testName: { type: String, required: true },
  department: { type: String, default: "Pathology" },
  technicianName: { type: String, default: "" },
  technicianId: { type: String, default: "" },

  // --- 3. MODE OF ENTRY (Combined Logic) ---
  entryType: {
    type: String,
    enum: ["Upload", "Manual"],
    default: "Manual"
  },

  // OPTION A: For "Upload Report" (File Path/URL)
  reportDocument: { type: String, default: "" },

  // OPTION B: For "Result Entry" (Structured Data)
  testResults: [
    {
      parameter: String, // e.g. "Hemoglobin"
      value: String,     // e.g. "12.5"
      unit: String,      // e.g. "g/dL"
      referenceRange: String, // e.g. "11.5 - 15.5"
      status: {          // Auto-calculated flag
        type: String,
        enum: ["Normal", "High", "Low", "Abnormal", "Pending"],
        default: "Pending"
      }
    }
  ],
  
  // Pathologist's Remarks (Common for both)
  comments: {
    type: String,
    default: ""
  },

  completedAt:{ type: Date, default: "" },

  // --- SYSTEM FIELDS ---
  status: {
    type: String,
    enum: ["Requested", "Completed"],
    default: "Requested",
  },

}, { timestamps: true });


labReportSchema.pre("save", async function () {
  if (!this.labReportId) {
    const last = await mongoose
      .model("labReport")
      .findOne({}, {}, { sort: { createdAt: -1 } });

    let num = 1;
    if (last?.labReportId) {
      num = parseInt(last.labReportId.replace("LAB", "")) + 1;
    }

    this.labReportId = `LAB${num.toString().padStart(4, "0")}`;
  }
});

const labReportModel = mongoose.models.labReport || mongoose.model("labReport", labReportSchema);

export default labReportModel;
