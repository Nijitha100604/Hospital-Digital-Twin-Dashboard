import express from 'express';
import authUser from '../middlewares/authUser.js';
import upload from '../middlewares/multer.js'; // Ensure multer is imported
import { 
    addLabReports, 
    getAllLabReports, 
    getReportById,
    submitLabResults,
    uploadLabReportFile // Import the controller
} from '../controllers/labController.js';

const labReportRouter = express.Router();

labReportRouter.post('/add', authUser, addLabReports);
labReportRouter.get('/all-reports', authUser, getAllLabReports);
labReportRouter.get('/:id', authUser, getReportById);
labReportRouter.post('/submit-results', authUser, submitLabResults);

// --- ADD THIS MISSING ROUTE ---
labReportRouter.post('/upload', authUser, upload.single('reportFile'), uploadLabReportFile);

export default labReportRouter;