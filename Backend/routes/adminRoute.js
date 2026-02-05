import express from 'express';
import { changePassword, login} from '../controllers/adminController.js'

const adminRouter = express.Router();

adminRouter.post('/login', login);
adminRouter.put('/change-password', changePassword);

export default adminRouter;