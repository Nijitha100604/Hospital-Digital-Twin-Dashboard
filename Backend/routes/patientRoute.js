import express from 'express';
import upload from '../middlewares/multer.js';
import  authUser from '../middlewares/authUser.js';
import { addPatient } from '../controllers/patientController.js';

const patientRouter = express.Router();

patientRouter.post('/add-patient', authUser, upload.single('idProof'), addPatient);

export default patientRouter