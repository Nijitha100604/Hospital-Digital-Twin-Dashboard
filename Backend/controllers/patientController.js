import validator from 'validator';
import patientModel from '../models/patientModel.js';
import { v2 as cloudinary } from "cloudinary";

// API for add new patient

const addPatient = async(req, res) =>{

    try{

        const {name, gender, age, bloodGroup, contact, email, address, guardianName, guardianContact} = req.body;
        const allergies = req.body.allergies ? JSON.parse(req.body.allergies): [];
        const medicalHistory = req.body.medicalHistory ? JSON.parse(req.body.medicalHistory): [];
        const proofImage = req.file;
        let proofUrl = "";

        if(!name || !gender || !age || !bloodGroup || !contact || !address || !email){
            return res.json({success: false, message: "Please enter all mandatory fields"})
        }

        // validating email
        if(!validator.isEmail(email)){
            return res.json({success: false, message: "Please enter a valid email"});
        }

        // check existing patient
        const existingPatient = await patientModel.findOne({"personal.email": email});
        if(existingPatient){
            return res.json({success: false, message: "Email already exists"})
        }
        
        if(proofImage){
            const imageUpload = await cloudinary.uploader.upload(proofImage.path, {resource_type: "auto"});
            proofUrl = imageUpload.secure_url;
        }

        const patientData = {
            personal: {
                name,
                gender,
                age,
                bloodGroup,
                email,
                contact,
                address
            },
            guardian: {
                name: guardianName,
                contact: guardianContact
            },
            medical: {
                allergies,
                history: medicalHistory
            },
            proof: proofUrl
        }

        const newPatient = new patientModel(patientData);
        await newPatient.save();

        res.json({success: true, message: "Patient Added Successfully!"});

    } catch(error){
        console.log(error);
        res.json({success: false, message:error.message});
    }

}

// API for all patients

const allPatients = async(req, res)=>{

    try{

        const patients = await patientModel.find().sort({ createdAt: -1 });
        res.json({success: true, data: patients});

    } catch(error){
        console.log(error);
        res.json({success: false, message: error.message});
    }

}

// patient details for appointment booking

const patientAppDetails = async(req, res) =>{
    try{

        const {patientId} = req.body;
        if(!patientId){
            return res.json({success: false, message: "Patient ID required"});
        }

        const patient  = await patientModel.findOne({ patientId }).select('personal.name personal.age personal.contact personal.bloodGroup personal.gender')
        if (!patient) {
            return res.json({ success: false, message: "Patient not found" });
        }
        res.json({ success: true, patient });

    } catch(error){
        console.log(error);
        res.json({success: false, message: error.message});
    }
}

// Fetch Patient data

const patientData = async(req, res) =>{
    try{

        const {id} = req.params;
        if(!id){
            return res.json({success: false, message: "ID is required"});
        }
        const patient = await patientModel.findById(id);
        if(!patient){
            return res.json({success: false, message: "Patient Not Found"});
        }
        res.json({success: true, patient});

    } catch(error){
        console.log(error);
        res.json({success: false, message: error.message});
    }
}

export {
    addPatient,
    allPatients,
    patientAppDetails,
    patientData
}