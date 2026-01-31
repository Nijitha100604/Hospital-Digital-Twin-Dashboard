import express from 'express';
import authUser from './../middlewares/authUser.js';
import { 
    addDepartment, 
    allDepartments, 
    department,
    updateDeptStatus 
} from '../controllers/departmentController.js';

const deptRouter = express.Router();

deptRouter.post('/add-dept', authUser, addDepartment);
deptRouter.get('/all-depts', authUser, allDepartments);
deptRouter.get('/:id', authUser, department);
deptRouter.put('/update/:id', authUser, updateDeptStatus);

export default deptRouter;