import express from 'express';
import upload from '../middlewares/multer.js';
import  authUser from '../middlewares/authUser.js';
import { 
    addPatient, 
    allPatients, 
    patientAppDetails,
    patientData 
} from '../controllers/patientController.js';

const patientRouter = express.Router();

patientRouter.post('/add-patient', authUser, upload.single('idProof'), addPatient);
patientRouter.get('/all-patients', authUser, allPatients);
patientRouter.get('/app-details', authUser, patientAppDetails);
patientRouter.get('/:id', authUser, patientData);

export default patientRouter