import labReportModel from "../models/labReportModel.js";
import { v2 as cloudinary } from "cloudinary";

// --- 1. GET ALL LAB REPORTS ---
const getAllLabReports = async (req, res) => {
    try {
        const reports = await labReportModel.find({}).sort({ createdAt: -1 });
        res.json({ success: true, data: reports });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// --- 2. GET SINGLE REPORT BY ID ---
const getReportById = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await labReportModel.findOne({
            $or: [
                { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, 
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

// --- 3. SUBMIT RESULTS (Manual Entry) ---
const submitLabResults = async (req, res) => {
    try {
        const { reportId, testResults, comments, technicianId, technicianName, sampleDate, correctionReason } = req.body;

        if (!reportId) {
            return res.json({ success: false, message: "Report ID is required" });
        }

        const report = await labReportModel.findById(reportId);
        
        if (!report) {
            return res.json({ success: false, message: "Report request not found" });
        }

        // --- AMENDMENT / AUDIT LOGIC ---
        if (report.status === "Completed") {
            if (!correctionReason) {
                return res.json({ success: false, message: "A reason is required to amend a completed report." });
            }
            report.revisionHistory.push({
                amendedBy: technicianName,
                amendedAt: new Date(),
                reason: correctionReason,
                previousResults: report.testResults,
                previousFile: null
            });
        }

        // Update Fields
        report.testResults = testResults;
        report.comments = comments || "";
        report.technicianId = technicianId;
        report.technicianName = technicianName;
        report.sampleDate = sampleDate; 
        
        report.entryType = "Manual";
        report.status = "Completed";
        report.completedAt = new Date();

        await report.save();

        res.json({ success: true, message: "Results saved successfully!" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// --- 4. UPLOAD REPORT FILE (STRICT UPDATE MODE) ---
const uploadLabReportFile = async (req, res) => {
    try {
        console.log("1. Upload Request Received");

        const { reportId, correctionReason } = req.body;
        const reportFile = req.file;

        // --- STRICT VALIDATION: Must have an ID ---
        if (!reportId) {
            return res.json({ 
                success: false, 
                message: "Report Request ID is missing. You cannot create a standalone report. Please select a patient from the requested list." 
            });
        }

        if (!reportFile) {
            return res.json({ success: false, message: "No file uploaded" });
        }

        console.log("2. Finding Report in DB:", reportId);
        // We only find existing reports created by the Doctor
        const report = await labReportModel.findById(reportId);
        
        if (!report) {
            return res.json({ success: false, message: "Report request not found. Ask the doctor to prescribe this test first." });
        }

        console.log("3. Uploading to Cloudinary...");
        
        const uploadResponse = await cloudinary.uploader.upload(reportFile.path, { 
            resource_type: "auto",
            timeout: 120000 
        });
        
        console.log("4. Cloudinary Upload Success:", uploadResponse.secure_url);

        // --- AMENDMENT / AUDIT LOGIC ---
        if (report.status === "Completed") {
            if (!correctionReason) {
                return res.json({ success: false, message: "A reason is required to amend a completed report." });
            }
            report.revisionHistory.push({
                amendedBy: "System/Upload", 
                amendedAt: new Date(),
                reason: correctionReason,
                previousResults: [],
                previousFile: report.reportDocument
            });
        }

        // --- UPDATE EXISTING RECORD ---
        // We DO NOT set appointmentId or consultationId here. 
        // They are already correct because we found the existing document.
        report.reportDocument = uploadResponse.secure_url;
        report.entryType = "Upload";
        report.status = "Completed";
        report.completedAt = new Date();

        console.log("5. Saving to DB...");
        await report.save();

        console.log("6. Success!");
        res.json({ success: true, message: "Report uploaded and status updated!" });

    } catch (error) {
        console.error("CONTROLLER ERROR:", error);
        res.json({ success: false, message: error.message || "Upload Failed" });
    }
};

export { 
    getAllLabReports, 
    getReportById, 
    submitLabResults, 
    uploadLabReportFile 
};