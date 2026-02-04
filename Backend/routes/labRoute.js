import express from 'express';
import authUser from '../middlewares/authUser.js';
import { 
    // ... other imports
    getReportById 
} from '../controllers/labController.js';

// --- FIX: Import from labController.js, NOT consultationController.js ---
import { addLabReports, getAllLabReports } from '../controllers/labController.js'; 

const labReportRouter = express.Router();

labReportRouter.post('/add', authUser, addLabReports);
labReportRouter.get('/all-reports', authUser, getAllLabReports);
labReportRouter.get('/:id', authUser, getReportById);

export default labReportRouter;