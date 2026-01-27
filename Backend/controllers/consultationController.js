import appointmentModel from '../models/appointmentModel.js';
import labReportModel from '../models/labReportModel.js';
import patientModel from '../models/patientModel.js';
import staffModel from '../models/staffModel.js';
import consultationModel from './../models/consultationModel.js';

// Get all consultations
const allConsultations = async(req, res) =>{

    try{

        const consultations = await consultationModel.find({}).sort({ createdAt: -1 });
        res.json({success: true, data: consultations});

    } catch(error){
        console.log(error);
        res.json({success: false, message: error.message})
    }

}

//  Add diagnosis and remarks
const addDiagnosisAndRemarks = async(req, res) =>{

    try{

        const { appointmentId, diagnosis, remarks } = req.body;

        if(!appointmentId || !diagnosis || !remarks){
            return res.json({success: false, message: "Missing Diganosis or Remarks"});
        }

        const consultation = await consultationModel.findOne({appointmentId});

        if(!consultation){
            return res.json({success: false, message: "Consultation not found"});
        }

        consultation.doctor.diagnosis = diagnosis;
        consultation.doctor.remarks = remarks;

        await consultation.save();

        res.json({success: true, message: "Diagnosis and remarks updated"});

    } catch(error){
        console.log(error);
        res.json({success: false, message: error.message});
    }

}

// Add Prescriptions
const addPrescriptions = async(req, res) =>{

    try{

        const { appointmentId, prescriptions } = req.body; 

        if (!appointmentId || !Array.isArray(prescriptions)) {
            return res.json({ success: false, message: "Missing Prescriptions" });
        }

        const consultation = await consultationModel.findOne({ appointmentId });

        if (!consultation) {
            return res.json({ success: false, message: "Consultation not found" });
        }

        consultation.prescriptions = prescriptions;
        await consultation.save();
        res.json({success: true, message: "Prescriptions saved successfully"});

    } catch(error){
        console.log(error);
        res.json({success: false, message: error.message});
    }

}

// Add Lab Reports
const addLabReports = async(req, res) =>{

    try{

        const {appointmentId, consultationId, patientId, labTests} = req.body;
        if (!appointmentId || !consultationId || !patientId || !labTests?.length){
            return res.json({success: false, message: "Missing Lab Tests"});
        }

        const consultation = await consultationModel.findOne({consultationId});
        if(!consultation){
            return res.json({success: false, message: "Consultation not found"});
        }

        const appointment = await appointmentModel.findOne({appointmentId});
        if(!appointment){
            return res.json({success: false, message: "Appointment not found"});
        }

        const patient = await patientModel.findOne({ patientId });
        if (!patient) {
            return res.json({ success: false, message: "Patient not found" });
        }

        const doctor = await staffModel.findOne({ staffId: consultation.doctorId });
        if (!doctor) {
            return res.json({ success: false, message: "Doctor not found" });
        }

        const createdReports = [];

        for(const test of labTests){

            const exists = await labReportModel.findOne({
                appointmentId,
                testName: test.testName
            });

            if (exists) continue;

            const labReport = new labReportModel({
                appointmentId,
                consultationId,
                patientId,
                patientName: patient.personal.name,
                age: patient.personal.age,
                gender: patient.personal.gender,
                doctorName: doctor.fullName,
                doctorId: doctor.staffId,
                testName: test.testName
            });

            await labReport.save();

            createdReports.push({
                labReportId: labReport.labReportId,
                testName: labReport.testName
            })
        }
        consultation.labReports.push(...createdReports);
        await consultation.save();

        return res.json({success: true, message: "Lab Reports requested Successfully"});

    } catch(error){
        console.log(error);
        res.json({success: false, message: error.message});
    }

}

export {
    allConsultations,
    addDiagnosisAndRemarks,
    addPrescriptions,
    addLabReports
}