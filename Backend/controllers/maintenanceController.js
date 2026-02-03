import maintenanceModel from "../models/maintenanceModel.js";
import equipmentModel from "../models/equipmentModel.js";

//Add Maintenance Log
const addMaintenanceLog = async (req, res) => {
  try {
    const {
      equipmentId,
      equipmentName,
      maintenanceDate,
      nextScheduled,
      technicianName,
      duration,
      cost,
      status,
      issueReported,
      actionsTaken
    } = req.body;

    // Validation
    if (!equipmentId || !maintenanceDate || !nextScheduled || !technicianName) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    // Create Log
    const newLog = new maintenanceModel({
      equipmentId,
      equipmentName,
      maintenanceDate,
      nextScheduled,
      technicianName,
      duration,
      cost,
      status,
      issueReported,
      actionsTaken
    });

    await newLog.save();
    if (status === "Completed") {
        await equipmentModel.updateOne(
            { equipmentId: equipmentId },
            {
                $set: {
                    "serviceSchedule.lastService": maintenanceDate,
                    "serviceSchedule.nextService": nextScheduled,
                    "basicInfo.equipmentStatus": "Working" 
                }
            }
        );
    } else {
        await equipmentModel.updateOne(
            { equipmentId: equipmentId },
            { $set: { "basicInfo.equipmentStatus": "Under Maintenance" } }
        );
    }

    res.json({ success: true, message: "Maintenance Log Created & Schedule Updated!" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//Get All Logs
const getAllMaintenanceLogs = async (req, res) => {
  try {
    const logs = await maintenanceModel.find({}).sort({ maintenanceDate: -1 }); 
    res.json({ success: true, data: logs });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//Update Log
const updateMaintenanceLog = async (req, res) => {
  try {
    const { logId } = req.params;
    const updateData = req.body;

    await maintenanceModel.updateOne({ logId }, updateData);
    if (updateData.status === "Completed" && updateData.equipmentId) {
         await equipmentModel.updateOne(
            { equipmentId: updateData.equipmentId },
            {
                $set: {
                    "serviceSchedule.lastService": updateData.maintenanceDate,
                    "serviceSchedule.nextService": updateData.nextScheduled,
                    "basicInfo.equipmentStatus": "Working"
                }
            }
        );
    }

    res.json({ success: true, message: "Log Updated Successfully" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//Delete Log
const deleteMaintenanceLog = async (req, res) => {
    try {
        const { logId } = req.params;
        await maintenanceModel.findOneAndDelete({ logId });
        res.json({ success: true, message: "Log Deleted" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { 
    addMaintenanceLog, 
    getAllMaintenanceLogs, 
    updateMaintenanceLog, 
    deleteMaintenanceLog 
};