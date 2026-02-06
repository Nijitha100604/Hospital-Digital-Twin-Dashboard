import labReportModel from "../models/labReportModel.js";
import consultationModel from "../models/consultationModel.js";
import patientModel from "../models/patientModel.js";
import staffModel from "../models/staffModel.js";
import { v2 as cloudinary } from "cloudinary";

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


// --- GET SINGLE REPORT BY ID ---
const getReportById = async (req, res) => {
    try {
        const { id } = req.params;

        // Try to find by MongoDB _id first, then by custom labReportId (e.g., LAB0001)
        const report = await labReportModel.findOne({
            $or: [
                { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, // check valid ObjectId format
                { labReportId: id }
            ]
        });

        if (!report) {
            return res.json({ success: false, message: "Report not found" });
        }

        res.json({ success: true, data: report });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// --- SUBMIT RESULTS (Manual Entry) ---
const submitLabResults = async (req, res) => {
    try {
        const { reportId, testResults, comments, technicianId, technicianName, sampleDate } = req.body;

        // 1. Find the report
        const report = await labReportModel.findById(reportId);
        
        if (!report) {
            return res.json({ success: false, message: "Report not found" });
        }

        // 2. Update fields
        report.testResults = testResults;
        report.comments = comments || "";
        report.technicianId = technicianId;
        report.technicianName = technicianName;
        report.sampleDate = sampleDate; // Update sample date if changed
        
        // 3. Mark as Completed
        report.entryType = "Manual";
        report.status = "Completed";
        report.completedAt = new Date();

        // 4. Save
        await report.save();

        res.json({ success: true, message: "Results saved successfully!" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// --- 4. UPLOAD REPORT FILE (Handles both Existing Request & New Entry) ---
const uploadLabReportFile = async (req, res) => {
    try {
        const { reportId, patientId, patientName, age, gender, doctorName, testName, department, sampleDate } = req.body;
        const reportFile = req.file;

        if (!reportFile) return res.json({ success: false, message: "No file uploaded" });

        // 1. Upload to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(reportFile.path, { resource_type: "auto" });
        const fileUrl = uploadResponse.secure_url;

        let report;

        // SCENARIO A: Updating an existing request (from List)
        if (reportId) {
            report = await labReportModel.findById(reportId);
            if (!report) return res.json({ success: false, message: "Report ID provided but not found" });
            
            report.reportDocument = fileUrl;
            report.entryType = "Upload";
            report.status = "Completed";
            report.completedAt = new Date();
            await report.save();
        } 
        // SCENARIO B: Creating a new report (Direct Upload)
        else {
            // Validate required fields for new entry
            if(!patientId || !testName) {
                return res.json({ success: false, message: "Patient ID and Test Type are required for new entries" });
            }

            report = new labReportModel({
                // Generate a new ID automatically via Model hook
                appointmentId: "MANUAL-UPLOAD", // Placeholder
                consultationId: "MANUAL-UPLOAD", // Placeholder
                patientId,
                patientName,
                age: age || 0,
                gender: gender || "Unknown",
                doctorName: doctorName || "Self/External",
                doctorId: "EXT",
                testName,
                department: department || "Pathology",
                sampleDate: sampleDate || new Date(),
                reportDocument: fileUrl,
                entryType: "Upload",
                status: "Completed",
                completedAt: new Date()
            });
            await report.save();
        }

        res.json({ success: true, message: "Report uploaded successfully!" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { addLabReports, getAllLabReports, getReportById,submitLabResults,uploadLabReportFile };
