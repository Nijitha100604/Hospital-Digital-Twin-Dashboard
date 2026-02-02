import express from 'express';
import authUser from '../middlewares/authUser.js';
import { 
    allConsultations,
    addDiagnosisAndRemarks,
    addPrescriptions, 
    addLabReports,
    requestAdmission,
    getPendingBedRequests,
    assignBed,
    addDailyNote,
    dischargePatient
} from '../controllers/consultationController.js';

const consultationRouter = express.Router();

consultationRouter.get('/all-consultations', authUser, allConsultations);
consultationRouter.post('/add-diagnosis-remarks', authUser, addDiagnosisAndRemarks);
consultationRouter.post('/add-prescriptions', authUser, addPrescriptions);
consultationRouter.post('/add-labReports', authUser, addLabReports);
consultationRouter.post('/request-admission', authUser, requestAdmission);
consultationRouter.get('/pending-requests', authUser, getPendingBedRequests);
consultationRouter.post('/assign-bed', authUser, assignBed);
consultationRouter.post('/add-daily-note', authUser, addDailyNote);
consultationRouter.post('/discharge', authUser, dischargePatient)

export default consultationRouter;