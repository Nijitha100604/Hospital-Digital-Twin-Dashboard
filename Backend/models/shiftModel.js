import mongoose from "mongoose";

const shiftSchema = new mongoose.Schema({
  // --- STAFF LINKING ---
  staffId: {
    type: String, // e.g., "S001"
    required: [true, "Staff ID is required"],
    ref: "Staff", // Reference to Staff Model if you use populate()
    index: true,  // For faster lookups
  },
  staffName: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },

  // --- SHIFT DETAILS ---
  date: {
    type: String, // Store as "YYYY-MM-DD" for easier string comparison in frontend
    required: [true, "Shift Date is required"],
  },
  shiftType: {
    type: String,
    required: [true, "Shift Type is required"],
    enum: ["Morning", "Evening", "Night", "Custom"],
  },
  startTime: {
    type: String, // "HH:MM" format (24h)
    required: true,
  },
  endTime: {
    type: String, // "HH:MM" format (24h)
    required: true,
  },
  location: {
    type: String,
    default: "General Ward", // Fallback location
  },
  
  // --- METADATA ---
  notes: {
    type: String,
    default: "",
  },
  isExtraDuty: {
    type: Boolean,
    default: false, // True if added via "Add as Extra Duty"
  },
  notified: {
    type: Boolean,
    default: false, // True if "Notify Staff" was checked
  },
  status: {
    type: String,
    enum: ["Scheduled", "Completed", "Cancelled"],
    default: "Scheduled",
  }

}, { timestamps: true });

// --- INDEXING ---
// Ensure one staff cannot have overlapping "Morning" shifts on the same day unless 'isExtraDuty' is true.
// This is optional but good for data integrity.
shiftSchema.index({ staffId: 1, date: 1, shiftType: 1 }, { unique: false }); 

const ShiftModel = mongoose.models.Shift || mongoose.model("Shift", shiftSchema);

export default ShiftModel;