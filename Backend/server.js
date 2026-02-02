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
import attendanceRouter from './routes/attendanceRoute.js';
import consultationRouter from './routes/consultationRoute.js';
import labReportRouter from './routes/labRoute.js';
import purchaseRouter from './routes/purchaseRoute.js';
import deptRouter from './routes/departmentRoute.js';
import prescriptionRouter from './routes/prescriptionRoute.js';
import equipmentRouter from './routes/equipmentRoute.js';

// app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// middlewares
app.use(express.json());
app.use(cors());

//  api endpoints


app.use('/api', adminRouter);

// staff routes
app.use('/api/staff', staffRouter);

// patient routes
app.use('/api/patient', patientRouter);
app.use('/api/appointment', appointmentRouter);
app.use('/api/consultation', consultationRouter);

// departments routes
app.use('/api/dept', deptRouter);

// laboratory routes
app.use('/api/reports', labReportRouter);

//medicine routes
app.use('/api/medicine', medicineRouter);
app.use('/api/supplier', supplierRouter);
app.use('/api/purchase', purchaseRouter);
app.use('/api/prescription', prescriptionRouter);

//equipment routes
app.use('/api/equipment', equipmentRouter);

// shift routes
app.use('/api/staff', staffRouter);
app.use('/api/shift', shiftRouter);

//leave
app.use('/api/leave', leaveRouter);

//attendence
app.use('/api/attendance', attendanceRouter);

app.get('/',(req,res)=>{
    res.send('API WORKING');
})

app.listen(port, ()=>console.log("Server Started", port))