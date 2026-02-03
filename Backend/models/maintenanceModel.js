import mongoose from "mongoose";

async function generateLogId() {
  const lastLog = await mongoose
    .model("maintenance")
    .findOne({}, {}, { sort: { createdAt: -1 } });

  let newSerial = 1;
  if (lastLog && lastLog.logId) {
    const lastNum = parseInt(lastLog.logId.replace("ML", ""));
    newSerial = lastNum + 1;
  }
  return `ML${newSerial.toString().padStart(6, "0")}`;
}

const maintenanceSchema = new mongoose.Schema(
  {
    logId: { type: String, unique: true },
    equipmentId: { type: String, required: true },
    equipmentName: { type: String, required: true },
    
    maintenanceDate: { type: String, required: true }, 
    nextScheduled: { type: String, required: true },   
    
    technicianName: { type: String, required: true },
    duration: { type: String, default: "" }, 
    cost: { type: Number, default: 0 },
    
    status: {
      type: String,
      enum: ["Completed", "In Progress", "Pending Parts"],
      default: "Completed"
    },

    issueReported: { type: String, default: "" },
    actionsTaken: { type: String, default: "" }
  },
  { timestamps: true }
);

maintenanceSchema.pre("save", async function () {
  if (!this.logId) {
    this.logId = await generateLogId();
  }
});

const maintenanceModel = mongoose.models.maintenance || mongoose.model("maintenance", maintenanceSchema);

export default maintenanceModel;