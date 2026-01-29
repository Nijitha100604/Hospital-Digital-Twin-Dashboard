import express from 'express';
import authUser from './../middlewares/authUser.js';
import { addDepartment } from '../controllers/departmentController.js';

const deptRouter = express.Router();

deptRouter.post('/add-dept', authUser, addDepartment);

export default deptRouter;