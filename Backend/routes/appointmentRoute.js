import express from 'express';
import  authUser from '../middlewares/authUser.js';
import { allAppointments, appointment, createAppointment, updateAppStatus } from '../controllers/appointmentController.js';

const appointmentRouter = express.Router();

appointmentRouter.post('/book-appointment', authUser, createAppointment);
appointmentRouter.get('/all-appointments', authUser, allAppointments);
appointmentRouter.get('/:id', authUser, appointment);
appointmentRouter.put('/update-status', authUser, updateAppStatus);

export default appointmentRouter;