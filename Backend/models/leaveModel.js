import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
  staffId: {
    type: String,
    required: true,
    ref: "Staff", // Assuming you have a Staff model to link to
  },
  name: {
    type: String,
    required: true,
  },
  leaveType: {
    type: String,
    required: true,
    enum: ["Sick Leave", "Casual Leave", "Vacation", "Emergency"], // Restrict to known types
  },
  fromDate: {
    type: Date,
    required: true,
  },
  toDate: {
    type: Date,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  isEmergency: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  appliedOn: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

// Optional: Add a method to check if the leave dates are valid (e.g., fromDate <= toDate)
leaveSchema.pre('save', function(next) {
  if (this.fromDate > this.toDate) {
    next(new Error('From Date must be before or equal to To Date'));
  } else {
    next();
  }
});

const LeaveModel = mongoose.models.Leave || mongoose.model("Leave", leaveSchema);

export default LeaveModel;