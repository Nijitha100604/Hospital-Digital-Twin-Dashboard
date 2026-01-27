import shiftModel from "../models/shiftModel.js";
import staffModel from "../models/staffModel.js"; // Needed to validate staff existence

// --- 1. ADD NEW SHIFT ---
const addShift = async (req, res) => {
  try {
    const {
      staffId,
      date,
      shiftType,
      startTime,
      endTime,
      location,
      notes,
      isExtraDuty,
      notified
    } = req.body;

    // A. Basic Validation
    if (!staffId || !date || !shiftType || !startTime || !endTime) {
      return res.json({
        success: false,
        message: "Missing required fields: Staff ID, Date, Shift Type, Start/End Time",
      });
    }

    // B. Validate Staff Exists & Get Name
    const staff = await staffModel.findOne({ staffId });
    if (!staff) {
      return res.json({ success: false, message: "Invalid Staff ID" });
    }

    // C. Overlap Check (Unless it's marked as Extra Duty)
    if (!isExtraDuty) {
      const existingShift = await shiftModel.findOne({
        staffId,
        date,
        // Check if a shift already exists for this date (simplest rule for now)
        // Or check specifically for overlapping times if you want complex logic
        status: { $ne: "Cancelled" } 
      });

      if (existingShift) {
        return res.json({
          success: false,
          message: `Conflict: ${staff.fullName} already has a ${existingShift.shiftType} shift on this date.`,
          conflictData: existingShift // Send back data so frontend can show "Add Extra Duty" option
        });
      }
    }

    // D. Create Shift
    const newShift = new shiftModel({
      staffId,
      staffName: staff.fullName,
      department: staff.department,
      date,
      shiftType,
      startTime,
      endTime,
      location: location || "General Ward",
      notes: notes || "",
      isExtraDuty: isExtraDuty || false,
      notified: notified || false,
      status: "Scheduled"
    });

    await newShift.save();

    res.json({ success: true, message: "Shift assigned successfully!" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// --- 2. GET ALL SHIFTS ---
const getAllShifts = async (req, res) => {
  try {
    // Sort by date (newest first)
    const shifts = await shiftModel.find().sort({ date: -1 });
    res.json({ success: true, data: shifts });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// --- 3. GET SHIFTS BY DATE RANGE (Optional but useful for Weekly View) ---
// Frontend sends ?startDate=2023-10-01&endDate=2023-10-07
const getShiftsByRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if(!startDate || !endDate) {
        return res.json({ success: false, message: "Start and End dates required" });
    }

    const shifts = await shiftModel.find({
        date: { $gte: startDate, $lte: endDate }
    });

    res.json({ success: true, data: shifts });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// --- 4. UPDATE SHIFT ---
const updateShift = async (req, res) => {
  try {
    const { id } = req.params; // MongoDB _id
    const updateData = req.body;

    const updatedShift = await shiftModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedShift) {
      return res.json({ success: false, message: "Shift not found" });
    }

    res.json({ success: true, message: "Shift updated", data: updatedShift });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// --- 5. DELETE SHIFT ---
const deleteShift = async (req, res) => {
  try {
    const { id } = req.params;
    await shiftModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Shift removed successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addShift, getAllShifts, getShiftsByRange, updateShift, deleteShift };