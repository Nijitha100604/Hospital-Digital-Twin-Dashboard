import express from 'express';
import  authUser from '../middlewares/authUser.js';
import { createAppointment } from '../controllers/appointmentController.js';

const appointmentRouter = express.Router();

appointmentRouter.post('/create-appointment', authUser, createAppointment);

export default appointmentRouter;