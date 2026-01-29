import express from 'express';
import authUser from '../middlewares/authUser.js';
import { 
    allConsultations,
    addDiagnosisAndRemarks,
    addPrescriptions, 
    addLabReports
} from '../controllers/consultationController.js';

const consultationRouter = express.Router();

consultationRouter.get('/all-consultations', authUser, allConsultations);
consultationRouter.post('/add-diagnosis-remarks', authUser, addDiagnosisAndRemarks);
consultationRouter.post('/add-prescriptions', authUser, addPrescriptions);
consultationRouter.post('/add-labReports', authUser, addLabReports);

export default consultationRouter;