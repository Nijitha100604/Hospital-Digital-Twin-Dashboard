import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({

    patientId: { type: String, required: true },
    appointmentId: {type: String, unique: true},
    appointmentType: { type: String, required: true},
    department: { type: String, required: true},
    doctor: { type: String, required: true},
    consultationType: { type: String, required: true},
    date: { type: String, required: true},
    timeSlot: { type: String, required: true},
    remarks: { type: String, required: true},
    status: { type: String, default: "Scheduled" }

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