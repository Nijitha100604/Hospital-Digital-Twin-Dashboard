import express from 'express';
import { createOrder, deleteOrder, getAllOrders, updateOrder } from '../controllers/purchaseController.js';
import authUser from '../middlewares/authUser.js';

const purchaseRouter = express.Router();

purchaseRouter.post('/create', authUser, createOrder);
purchaseRouter.get('/all-orders', authUser, getAllOrders);
purchaseRouter.put('/update/:id', authUser, updateOrder);
purchaseRouter.delete('/delete/:id', authUser, deleteOrder);

export default purchaseRouter;