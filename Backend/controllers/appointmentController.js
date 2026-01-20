import appointmentModel from "../models/appointmentModel.js";
import patientModel from "../models/patientModel.js";

// API for the appointment creation
const createAppointment = async(req, res) =>{

    try{

        const {patientId, appointmentType, department, doctor, consultationType, date, timeSlot, remarks} = req.body;

        if(!patientId){
            return res.json({success: false, message: "Patient ID required"});
        }

        if(!appointmentType || !department || !doctor || !consultationType || !date || !timeSlot || !remarks){
            return res.json({success: false, message: "Missing appointment details"})
        }

        const patient = await patientModel.findOne({patientId});
        if(!patient){
            return res.json({success: false, message: "Invalid Patient ID"});
        }

        const appointmentData = {
            patientId,
            appointmentType,
            department, 
            doctor, 
            consultationType, 
            date, 
            timeSlot, 
            remarks
        }

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        return res.json({success: false, message: "Appointment created successfully !"})

    }catch(error){
        console.log(error);
        res.json({success: false, message:error.message});
    }

}

export {
    createAppointment
}