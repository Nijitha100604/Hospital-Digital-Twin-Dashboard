import attendanceModel from "../models/attendanceModel.js";

// Mark or Update Attendance
const markAttendance = async (req, res) => {
  try {
    const { staffId, date, status, checkIn, checkOut } = req.body;

    // Upsert: Update if exists, Insert if new
    const attendance = await attendanceModel.findOneAndUpdate(
      { staffId, date },
      { status, checkIn, checkOut },
      { new: true, upsert: true } // <--- Magic option
    );

    res.json({ success: true, message: "Attendance updated", data: attendance });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get Attendance for a specific Date
const getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.query;
    const records = await attendanceModel.find({ date });
    res.json({ success: true, data: records });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { markAttendance, getAttendanceByDate };