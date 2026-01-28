import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({

    prescriptionId: { type: String, unique: true },
    consultationId: { type: String, required: true },
    appointmentId: { type: String, required: true },
    doctorId: { type: String, required: true },
    patientId: { type: String, required: true },

    medicines: [
        {
            medicineId: { type: String, required: true },
            medicineName: { type: String, required: true },
            frequency: { type: [String], required: true },
            duration: { type: String, required: true }, 
            instruction: { type: String, required: true },
            isDispensed: { type: Boolean, default: false } 
        }
    ],

    status: { 
        type: String, 
        enum: ['Pending', 'Dispensed', 'Cancelled'], 
        default: 'Pending' 
    },

    
    totalAmount: { type: Number, default: 0 },

    dispensedBy: { type: String, default: "" }

}, { timestamps: true });

prescriptionSchema.pre("save", async function () {
  if (!this.prescriptionId) {
    const last = await mongoose
      .model("prescription")
      .findOne({}, {}, { sort: { createdAt: -1 } });

    let num = 1;
    if (last?.prescriptionId) {
      num = parseInt(last.prescriptionId.replace("RX-", "")) + 1;
    }

    this.prescriptionId = `RX-${num.toString().padStart(5, "0")}`;
  }
});

const prescriptionModel = mongoose.models.prescription || mongoose.model('prescription', prescriptionSchema);
export default prescriptionModel;