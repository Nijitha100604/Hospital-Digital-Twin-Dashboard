import express from 'express';
import { addStaff } from '../controllers/staffController.js';
import upload from '../middlewares/multer.js';
import authUser from '../middlewares/authUser.js';

const staffRouter = express.Router();

staffRouter.post('/add-staff', authUser, upload.single('image'), addStaff);

export default staffRouter;