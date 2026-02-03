import express from 'express';
import authUser from '../middlewares/authUser.js';

// --- FIX: Import from labController.js, NOT consultationController.js ---
import { addLabReports, getAllLabReports } from '../controllers/labController.js'; 

const labReportRouter = express.Router();

labReportRouter.post('/add', authUser, addLabReports);
labReportRouter.get('/all-reports', authUser, getAllLabReports);

export default labReportRouter;