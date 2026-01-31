import express from "express";
import authUser from "../middlewares/authUser.js";
import { markAttendance, getAttendanceByDate } from "../controllers/attendanceController.js";

const attendanceRouter = express.Router();

attendanceRouter.post("/mark", authUser, markAttendance);
attendanceRouter.get("/daily", authUser, getAttendanceByDate);

export default attendanceRouter;