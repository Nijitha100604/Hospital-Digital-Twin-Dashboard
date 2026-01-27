import express from 'express'
import authUser from './../middlewares/authUser.js';
import { allReports } from '../controllers/labReportsController.js';

const labReportRouter = express.Router();

labReportRouter.get('/all-reports', authUser, allReports);

export default labReportRouter;