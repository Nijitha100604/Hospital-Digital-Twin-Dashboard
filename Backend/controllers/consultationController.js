import appointmentModel from '../models/appointmentModel.js';
import bedRequestModel from '../models/bedRequestModel.js';
import labReportModel from '../models/labReportModel.js';
import patientModel from '../models/patientModel.js';
import prescriptionModel from '../models/prescriptionModel.js';
import staffModel from '../models/staffModel.js';
import consultationModel from './../models/consultationModel.js';
import bedAvailabilityModel from './../models/bedAvailabilityModel.js';
import mongoose from 'mongoose';

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

const consultation = async(req, res) =>{
    try{

        const {id} = req.params;
        const cons = await consultationModel.findOne({consultationId: id});
        if(!cons){
            return res.json({success: false, message: "Consultation not found"});
        }
        return res.json({success: true, data: cons});

    } catch(error){
        console.log(error);
        return res.json({success: false, message: error.message});
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

        const patient = await patientModel.findOne({ patientId: consultation.patientId });
        const doctor = await staffModel.findOne({ staffId: consultation.doctorId });

        if (!patient || !doctor) {
            return res.json({ success: false, message: "Patient or Doctor not found" });
        }

        consultation.prescriptions = prescriptions;
        await consultation.save();

        const existing = await prescriptionModel.findOne({ appointmentId });
        if (existing) {
            return res.json({ success: false, message: "Prescription already exists for this appointment" });
        }

        const newPrescription = new prescriptionModel({
            consultationId: consultation.consultationId,
            appointmentId,
            doctorId: doctor.staffId,
            doctorName: doctor.fullName,
            patientId: patient.patientId,
            patientName: patient.personal.name,
            medicines: prescriptions.map(item => ({
                medicineId: item.medicineId,
                medicineName: item.medicineName,
                frequency: item.frequency,
                duration: item.duration,
                instruction: item.instruction
            }))
        });

        await newPrescription.save();

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

// doctor request admission
const requestAdmission = async(req, res) => {

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        
        const { consultationId, appointmentId, patientId, patientName, doctorId, bedType } = req.body;
        if( !consultationId || !appointmentId || !patientId || !patientName || !doctorId || !bedType ){
            return res.json({success: false, message: "Missing admission details"});
        }

        const consultation = await consultationModel.findOne({consultationId}).session(session);
        if(!consultation){
            return res.json({success: false, message: "Consultation not found"});
        }

        consultation.admission.push({
            request:{
                requested: true,
                requestDate: new Date(),
                requestStatus: "Pending"
            }
        })

        const admissionIndex = consultation.admission.length - 1;
        await consultation.save({session});
        const bedRequest = new bedRequestModel({
            consultationId,
            admissionIndex,
            appointmentId,
            patientId, 
            patientName,
            doctorId,
            bedType
        })

        await bedRequest.save({session});
        await appointmentModel.updateOne(
            {appointmentId},
            { admissionStatus: "Requested" },
            {session}
        );

        await session.commitTransaction();
        session.endSession();

        res.json({success: true, message: "Admission requested successfully", admissionIndex});

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.log(error);
        return res.json({success: false, message: error.message});
    }
}

// get pending bed requests
const getPendingBedRequests = async(req, res) => {

    try {
        
        const requests = await bedRequestModel.find({status: "Pending"}).sort({createdAt: -1});
        return res.json({success: true, data: requests});

    } catch (error) {
        console.log(error);
        return res.json({success: false, message: error.message});
    }

}

// assign bed
const assignBed = async(req, res) =>{

    const session = await mongoose.startSession();

    try{

        session.startTransaction();

        const { bedId, requestId, consultationId, admissionIndex, appointmentId, patientName, patientId, doctorId, department, block } = req.body;

        if(!bedId || !requestId || !consultationId || admissionIndex === undefined || !appointmentId || !block || !department){
            await session.abortTransaction();
            session.endSession();
            return res.json({success: false, message: "Missing data"});
        }

        const bed = await bedAvailabilityModel.findOneAndUpdate(
            { bedId, status: "Available" },
            {
                status: "Occupied",
                occupiedDetails: {
                    patientId,
                    patientName,
                    admissionIndex,
                    appointmentId,
                    admittedDate: new Date(),
                    consultationId,
                    doctorId,
                    bedRequestId: requestId
                }
            },
            { new: true, session }
        );

        if (!bed) {
            await session.abortTransaction();
            session.endSession();
            return res.json({ success: false, message: "Bed already occupied" });
        }

        const consultation = await consultationModel.findOne({ consultationId }).session(session);
        if (!consultation) {
            await session.abortTransaction();
            session.endSession();
            return res.json({ success: false, message: "Consultation not found" });
        }

        if (!consultation.admission[admissionIndex]) {
            await session.abortTransaction();
            session.endSession();
            return res.json({ success: false, message: "Invalid admission index" });
        }

        consultation.admission[admissionIndex].allocation = {
            admitted: true,
            admissionDate: new Date(),
            block,
            department,
            bedId
        }

        consultation.admission[admissionIndex].request.requestStatus = "Assigned";
        await consultation.save({ session });

        await bedRequestModel.updateOne(
            {requestId},
            {status: "Assigned"},
            { session }
        );

        await appointmentModel.updateOne(
            { appointmentId },
            { admissionStatus: "Admitted" },
            { session }
        )

        await session.commitTransaction();
        session.endSession();

        return res.json({success: true, message: "Bed assigned successfully"});

    } catch(error){
        console.log(error);
        await session.abortTransaction();
        session.endSession();
        return res.json({success: false, message: error.message});
    }

}

// add daily Note
const addDailyNote = async(req, res) => {

    try {
        
        const { consultationId, admissionIndex, note } = req.body;

        if(!note?.trim()){
            return res.json({success: false, message: "Daily Note is required"});
        }

        const consultation = await consultationModel.findOne({ consultationId });

        if (!consultation) {
            return res.json({success: false, message: "Consultation not found" });
        }

        const admission = consultation.admission[admissionIndex];
        if (!admission) {
            return res.json({success: false, message: "Invalid admission index" });
        }
        admission.dailyNotes.push({
            date: new Date(),
            note
        });

        await consultation.save();

        res.json({success: true, message: "Daily Note added", dailyNotes: admission.dailyNotes});

    } catch (error) {
        console.log(error);
        return res.json({success: false, message: error.message});
    }

}

// discharge patient
const dischargePatient = async(req, res) => {

    const session = await mongoose.startSession();

    try {

        session.startTransaction();
        
        const { consultationId, admissionIndex, dischargeRemarks, finalDiagnosis, finalVitals, patientInstructions, appointmentId } = req.body;
        if(!consultationId || admissionIndex === undefined || !appointmentId || !dischargeRemarks || !finalVitals || !patientInstructions){
            await session.abortTransaction();
            session.endSession();
            return res.json({success: false, message: "Missing details"});
        }

        const consultation = await consultationModel.findOne({consultationId}).session(session);
        if(!consultation){
            await session.abortTransaction();
            session.endSession();
            return res.json({success: false, message: "Consultation not found"});
        }

        const admission = consultation.admission[admissionIndex];

        if(!admission){
            await session.abortTransaction();
            session.endSession();
            return res.json({success: false, message: "Invalid admission index"});
        }

        if(!admission.allocation.admitted){
            await session.abortTransaction();
            session.endSession();
            return res.json({success: false, message: "Patient is not admitted"});
        }

        const dischargeDate = new Date();
        const admissionDate = admission.allocation.admissionDate;

        const numberOfDays = Math.max(1,
            Math.ceil((dischargeDate - admissionDate) / (1000 * 60 * 60 * 24) )
        )

        admission.discharge = {
            dischargeDate,
            dischargeRemarks: dischargeRemarks || "",
            numberOfDays,
            finalVitals: finalVitals || {},
            finalDiagnosis: finalDiagnosis || "",
            patientInstructions: patientInstructions || []
        }

        admission.allocation.admitted = false;

        await consultation.save({session});

        await bedAvailabilityModel.updateOne(
            { bedId: admission.allocation.bedId },
            {
                status: "Available",
                $unset: { occupiedDetails: "" }
            },
            { session }
        );

        await appointmentModel.updateOne(
            { appointmentId },
            { admissionStatus: "Discharged" },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        res.json({success: true, message: "Patient Discharged Successfully"});

    } catch (error) {
        console.log(error);
        await session.abortTransaction();
        session.endSession();
        return res.json({success: false, message: error.message});
    }

}

export {
    allConsultations,
    addDiagnosisAndRemarks,
    addPrescriptions,
    addLabReports,
    requestAdmission,
    getPendingBedRequests,
    assignBed,
    dischargePatient,
    addDailyNote,
    consultation
}