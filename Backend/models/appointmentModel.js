import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({

    patientId: { type: String, required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    contact: { type: String, required: true },
    appointmentId: {type: String, unique: true},
    appointmentType: { type: String, required: true},
    department: { type: String, required: true},
    docId: { type: String, required: true},
    doctorName: { type: String, required: true },
    consultationType: { type: String, required: true},
    date: { type: String, required: true},
    timeSlot: { type: String, required: true},
    remarks: { type: String, required: true},
    status: { type: String, default: "Scheduled" },
    admissionStatus: {
        type: String,
        enum: ["Not Required", "Requested", "Admitted", "Discharged"],
        default: "Not Required"
    }

}, { timestamps: true });

appointmentSchema.pre('save', async function() {
    if (!this.appointmentId) {

        const lastAppointment = await mongoose.model('appointment').findOne({}, {}, { sort: { 'createdAt': -1 } });
        
        let newSerialNumber = 1;

        if (lastAppointment && lastAppointment.appointmentId) {
            const lastIdNumber = parseInt(lastAppointment.appointmentId.replace('APT-', ''));
            newSerialNumber = lastIdNumber + 1;
        }

        this.appointmentId = `APT-${newSerialNumber.toString().padStart(5, '0')}`;
    }
});

const appointmentModel = mongoose.models.appointment || mongoose.model('appointment', appointmentSchema);
export default appointmentModel;