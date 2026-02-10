import express from 'express';
import authUser from '../middlewares/authUser.js';
import upload from '../middlewares/multer.js'; 
import { 
    getAllLabReports, 
    getReportById, 
    submitLabResults,
    uploadLabReportFile 
} from '../controllers/labController.js';

const labReportRouter = express.Router();

// --- NOTE: POST /add is removed. Tests must be added via Consultation Route ---

labReportRouter.get('/all-reports', authUser, getAllLabReports);
labReportRouter.get('/:id', authUser, getReportById);
labReportRouter.post('/submit-results', authUser, submitLabResults);
labReportRouter.post('/upload', authUser, upload.single('reportFile'), uploadLabReportFile);

export default labReportRouter;