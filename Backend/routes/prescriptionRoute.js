import express from 'express';
import authUser from '../middlewares/authUser.js';
import { getPrescriptionQueue, dispensePrescription } from '../controllers/prescriptionController.js';

const prescriptionRouter = express.Router();

prescriptionRouter.get('/queue', authUser, getPrescriptionQueue);
prescriptionRouter.post('/checkout', authUser, dispensePrescription);

export default prescriptionRouter;