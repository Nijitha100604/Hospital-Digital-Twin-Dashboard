import express from 'express';
import { changePassword, login, staffProfile} from '../controllers/adminController.js'
import protect from '../middlewares/protect.js';

const adminRouter = express.Router();

adminRouter.post('/login', login);
adminRouter.put('/change-password', changePassword);
adminRouter.get('/get-profile', protect, staffProfile);

export default adminRouter;