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
            medicineId: { type: String, required: true },
            medicineName: { type: String, required: true },
            frequency: { type: [String], required: true },
            duration: { type: String, required: true },
            instruction: { type: String, required: true }
        }
    ],
    labReports: [
        {
            labReportId: { type: String, required: true },
            testName: { type: String, required: true }
        }
    ],
    admission:[
        {
            admitted: { type: Boolean, default: false },
            date: { type: Date, default: null },
            block: { type: String, default: "" },
            ward: { type: String, default: "" },
            bedNumber: { type: String, default: "" },
            numberOfDays: { type: Number, default: 0 },
            dischargeRemarks: { type: String, default: "" },
            dailyNotes: [{
                date: {type: Date, default: ""},
                note: {type: String, default: ""}
            }],
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