import leaveModel from "../models/leaveModel.js";
import staffModel from "../models/staffModel.js";

// --- 1. APPLY FOR LEAVE ---
const applyLeave = async (req, res) => {
  try {
    const { staffId, name, leaveType, fromDate, toDate, reason, isEmergency } = req.body;

    // Validation
    if (!staffId || !leaveType || !fromDate || !toDate || !reason) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    // Check if staff exists
    const staff = await staffModel.findOne({ staffId });
    if (!staff) {
      return res.json({ success: false, message: "Invalid Staff ID" });
    }

    const newLeave = new leaveModel({
      staffId,
      name: staff.fullName, // Ensure name matches DB
      leaveType,
      fromDate,
      toDate,
      reason,
      isEmergency,
      status: "Pending"
    });

    await newLeave.save();
    res.json({ success: true, message: "Leave applied successfully!" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// --- 2. GET ALL LEAVES (For Admin/HR View) ---
const getAllLeaves = async (req, res) => {
  try {
    const leaves = await leaveModel.find().sort({ appliedOn: -1 }); // Newest first
    res.json({ success: true, data: leaves });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// --- 3. UPDATE LEAVE STATUS (Approve/Reject) ---
const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "Approved" or "Rejected"

    if (!["Approved", "Rejected", "Pending"].includes(status)) {
        return res.json({ success: false, message: "Invalid status" });
    }

    const updatedLeave = await leaveModel.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedLeave) {
      return res.json({ success: false, message: "Leave request not found" });
    }

    res.json({ success: true, message: `Leave marked as ${status}`, data: updatedLeave });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { applyLeave, getAllLeaves, updateLeaveStatus };