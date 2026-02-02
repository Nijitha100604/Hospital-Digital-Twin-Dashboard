import mongoose from 'mongoose';

const bedRequestSchema = new mongoose.Schema({
    requestId: { type: String, unique: true },
    consultationId: { type: String, required: true },
    admissionIndex: { type: Number, required: true },
    appointmentId: { type: String, required: true },
    patientId: { type: String, required: true },
    patientName: { type: String, required: true },
    doctorId: { type: String, required: true },
    bedType: { type: String, enum: ["ICU", "OT", "General"], required: true },
    status: { type: String, enum: ["Pending", "Assigned"], default: "Pending" }
}, { timestamps: true });

bedRequestSchema.pre("save", async function () {
  if (!this.requestId) {
    const last = await mongoose
      .model("bedrequest")
      .findOne({}, {}, { sort: { createdAt: -1 } });

    let num = 1;
    if (last?.requestId) {
      num = parseInt(last.requestId.replace("REQ-", "")) + 1;
    }

    this.requestId = `REQ-${num.toString().padStart(4, "0")}`;
  }
});


const bedRequestModel = mongoose.models.bedRequest || mongoose.model('bedrequest', bedRequestSchema);
export default bedRequestModel;