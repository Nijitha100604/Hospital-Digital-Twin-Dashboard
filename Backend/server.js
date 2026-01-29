import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import staffRouter from './routes/staffRoute.js';
import adminRouter from './routes/adminRoute.js';
import patientRouter from './routes/patientRoute.js';
import appointmentRouter from './routes/appointmentRoute.js';
import medicineRouter from './routes/medicineRoute.js';
import supplierRouter from './routes/supplierRoute.js';
import shiftRouter from './routes/shiftRoute.js';
import leaveRouter from './routes/leaveRoute.js';

// app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// middlewares
app.use(express.json());
app.use(cors());

//  api endpoints

// staff routes
app.use('/api', adminRouter);
app.use('/api/staff', staffRouter);
app.use('/api/patient', patientRouter);
app.use('/api/appointment', appointmentRouter);

//medicine routes
app.use('/api/medicine', medicineRouter);
app.use('/api/supplier', supplierRouter)

// shift routes
app.use('/api/staff', staffRouter);
app.use('/api/shift', shiftRouter);

//leave
app.use('/api/leave', leaveRouter);

app.get('/',(req,res)=>{
    res.send('API WORKING');
})

app.listen(port, ()=>console.log("Server Started", port))