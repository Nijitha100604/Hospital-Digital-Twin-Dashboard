import express from 'express';
import  authUser from '../middlewares/authUser.js';
import { allAppointments, createAppointment } from '../controllers/appointmentController.js';

const appointmentRouter = express.Router();

appointmentRouter.post('/book-appointment', authUser, createAppointment);
appointmentRouter.get('/all-appointments', authUser, allAppointments);

export default appointmentRouter;