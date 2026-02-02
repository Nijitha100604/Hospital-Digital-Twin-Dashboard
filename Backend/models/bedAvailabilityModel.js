import mongoose from 'mongoose';

const bedAvailabilitySchema = new mongoose.Schema({

    bedId: { type: String, unique: true, required: true },
    departmentId: { type: String, required: true },
    departmentName: { type: String, required: true },
    floor: { type: String, required: true },
    bedType: { type: String, enum: ["ICU", "OT", "General"], required: true },
    status: { type: String, enum: ["Available", "Occupied"], default: "Available" },
    occupiedDetails: {
        patientId: { type: String, default: "" },
        patientName: { type: String, default: "" },
        admittedDate: { type: Date },
        admissionId: { type: String, default: "" },
        consultationId: { type: String, default: "" },
        doctorId: { type: String, default: "" },
        bedRequestId: { type: String, default: "" }
    },

}, { timestamps: true })

const bedAvailabilityModel = mongoose.models.bed || mongoose.model('bed', bedAvailabilitySchema);
export default bedAvailabilityModel