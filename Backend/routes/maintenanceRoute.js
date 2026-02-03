import express from "express";
import authUser from "../middlewares/authUser.js"; 
import {
  addMaintenanceLog,
  getAllMaintenanceLogs,
  updateMaintenanceLog,
  deleteMaintenanceLog
} from "../controllers/maintenanceController.js";

const maintenanceRouter = express.Router();

maintenanceRouter.post("/add", authUser, addMaintenanceLog);
maintenanceRouter.get("/all", authUser, getAllMaintenanceLogs);
maintenanceRouter.put("/update/:logId", authUser, updateMaintenanceLog);
maintenanceRouter.delete("/delete/:logId", authUser, deleteMaintenanceLog);

export default maintenanceRouter;