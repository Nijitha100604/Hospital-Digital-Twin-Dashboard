import mongoose from 'mongoose';

const consultationSchema = new mongoose.Schema({

    consultationId: { type: String, unique: true },
    appointmentId: { type: String, required: true },
    doctorId: { type: String, required: true },
    patientId: { type: String, required: true },
    doctor:{
        diagnosis: { type: String, default: "" },
        remarks: { type: String, default: "" }
    },
    prescriptions: [
        {
            medicineName: { type: String, required: true },
            frequency: { type: [String], required: true },
            duration: { type: String, required: true },
            instruction: { type: String, required: true }
        }
    ],
    labReports: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "labReport"
        }
    ],
    admission:[
        {
            admitted: { type: Boolean, default: false },
            block: { type: String, default: "" },
            ward: { type: String, default: "" },
            bedNumber: { type: String, default: "" },
            numberOfDays: { type: Number, default: 0 },
            dischargeRemarks: { type: String, default: "" },
            dailyNotes: [String],
            finalVitals:{
                bloodPressure: { type: String, default: ""},
                heartRate: { type: String, default: "" }
            },
            patientInstructions: { type: [String], default: [] }
        }
    ]

}, { timestamps: true })

consultationSchema.pre("save", async function () {
  if (!this.consultationId) {
    const last = await mongoose
      .model("consultation")
      .findOne({}, {}, { sort: { createdAt: -1 } });

    let num = 1;
    if (last?.consultationId) {
      num = parseInt(last.consultationId.replace("CON-", "")) + 1;
    }

    this.consultationId = `CON-${num.toString().padStart(5, "0")}`;
  }
});

const consultationModel = mongoose.models.consultation || mongoose.model('consultation', consultationSchema);
export default consultationModel;