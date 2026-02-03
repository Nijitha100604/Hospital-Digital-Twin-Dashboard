import labReportModel from "../models/labReportModel.js";
import consultationModel from "../models/consultationModel.js";
import patientModel from "../models/patientModel.js";
import staffModel from "../models/staffModel.js";

// --- 1. ADD LAB REPORTS (Request Test) ---
const addLabReports = async (req, res) => {
    try {
        const { appointmentId, consultationId, patientId, labTests } = req.body;

        if (!appointmentId || !consultationId || !patientId || !labTests || !labTests.length) {
            return res.json({ success: false, message: "Missing required fields" });
        }

        // 1. Fetch Patient Details (to fill name, age, gender)
        const patient = await patientModel.findOne({ patientId });
        if (!patient) return res.json({ success: false, message: "Patient not found" });

        // 2. Fetch Consultation & Doctor (to fill doctorName, doctorId)
        const consultation = await consultationModel.findOne({ consultationId });
        if (!consultation) return res.json({ success: false, message: "Consultation not found" });

        const doctor = await staffModel.findOne({ staffId: consultation.doctorId });
        if (!doctor) return res.json({ success: false, message: "Doctor not found" });

        const createdReports = [];

        // 3. Create a Report for each test
        for (const test of labTests) {
            
            // Prevent Duplicate Requests for same test in same appointment
            const exists = await labReportModel.findOne({ appointmentId, testName: test.testName });
            if (exists) continue;

            const newReport = new labReportModel({
                appointmentId,
                consultationId,
                patientId,
                
                // Populate Required Fields from Patient/Doctor Models
                patientName: patient.personal.name,
                age: patient.personal.age,
                gender: patient.personal.gender,
                
                doctorId: doctor.staffId,
                doctorName: doctor.fullName,
                
                testName: test.testName,
                status: "Requested",
                
                // Default empty fields for later entry
                sampleDate: null,
                testResults: []
            });

            await newReport.save();
            
            createdReports.push({
                labReportId: newReport.labReportId,
                testName: newReport.testName
            });
        }

        // 4. Update Consultation Record
        if (createdReports.length > 0) {
            consultation.labReports.push(...createdReports);
            await consultation.save();
        }

        res.json({ success: true, message: "Lab Reports requested successfully" });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// --- 2. GET ALL LAB REPORTS ---
const getAllLabReports = async (req, res) => {
    try {
        const reports = await labReportModel.find({}).sort({ createdAt: -1 });
        res.json({ success: true, data: reports });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export { addLabReports, getAllLabReports };
