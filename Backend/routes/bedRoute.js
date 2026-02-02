import express from "express";
import authUser from "../middlewares/authUser.js";
import { getBeds } from "../controllers/bedsController.js";

const bedRouter = express.Router();

bedRouter.get('/all-beds', authUser, getBeds);

export default bedRouter;