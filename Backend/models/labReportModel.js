import mongoose from "mongoose";

const labReportSchema = new mongoose.Schema({

  consultationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "consultation",
    required: true
  },

  patientId: { type: String, required: true },
  doctorId: { type: String, required: true },

  testName: { type: String, required: true },

  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending"
  },

  results: { type : String, default: "" }, // dynamic lab values
  remarks: { type: String, default: "" },

  reportedAt: { type: Date }

}, { timestamps: true });

const labReportModel = mongoose.models.labreport || mongoose.model("labreport", labReportSchema);

export default labReportModel;
