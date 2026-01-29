import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  staffId: { type: String, required: true, ref: "Staff" },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  status: { 
    type: String, 
    enum: ["Present", "Absent", "Late", "Half Day", "Leave"], 
    default: "Absent" 
  },
  checkIn: { type: String, default: "-" }, // Store as HH:MM AM/PM
  checkOut: { type: String, default: "-" }
}, { timestamps: true });

// Prevent duplicate entries for same staff on same day
attendanceSchema.index({ staffId: 1, date: 1 }, { unique: true });

const AttendanceModel = mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema);
export default AttendanceModel;