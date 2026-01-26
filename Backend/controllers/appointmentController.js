import appointmentModel from "../models/appointmentModel.js";
import patientModel from "../models/patientModel.js";
import staffModel from './../models/staffModel.js';
import consultationModel from './../models/consultationModel.js';

// Book appointment
const createAppointment = async(req, res) =>{

    try{

        const {
            patientId, 
            docId, 
            appointmentType, 
            department, 
            doctorName, 
            consultationType, 
            date, 
            timeSlot, 
            remarks, 
            name, 
            age, 
            gender, 
            bloodGroup, 
            contact
        } = req.body;

        if(!patientId){
            return res.json({success: false, message: "Patient ID required"});
        }

        if(!docId){
            return res.json({success: false, message: "Staff ID required"});
        }

        if(
            !appointmentType || 
            !department || 
            !consultationType || 
            !date || 
            !timeSlot || 
            !remarks || 
            !doctorName || 
            !name || 
            !age || 
            !gender || 
            !bloodGroup || 
            !contact
        ){
            return res.json({success: false, message: "Missing appointment details"})
        }

        const patient = await patientModel.findOne({patientId});
        if(!patient){
            return res.json({success: false, message: "Invalid Patient ID"});
        }

        const doctor = await staffModel.findOne({ staffId: docId});
        if(!doctor){
            return res.json({success: false, message: "Invalid Staff ID"});
        }

        const slotCount = await appointmentModel.countDocuments({
            docId,
            date,
            timeSlot,
        });

        if(slotCount >= 5){
            return res.json({success: false, message: "This time slot is fully booked"});
        }

        const appointmentData = {
            patientId,
            name,
            age,
            gender,
            bloodGroup,
            contact,
            docId,
            appointmentType,
            department, 
            doctorName, 
            consultationType, 
            date, 
            timeSlot, 
            remarks
        }

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        const newConsultation = new consultationModel({
            appointmentId: newAppointment.appointmentId,
            doctorId: docId,
            patientId: patientId,
            doctor: {
                diagnosis: "",
                remarks: ""
            },
            prescriptions: [],
            labReports: [],
            admission: []
        })

        await newConsultation.save();
        return res.json({success: true, message: "Appointment created successfully !"});

    }catch(error){
        console.log(error);
        res.json({success: false, message:error.message});
    }

}

// Get all appointments
const allAppointments = async(req, res)=>{
    try{

        const appointments = await appointmentModel.find({}).sort({createdAt: -1});
        res.json({success: true, data: appointments})

    } catch(error){
        console.log(error);
        res.json({success: false, message: error.message});
    }
}


export {
    createAppointment,
    allAppointments,
}