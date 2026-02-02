import express from "express";
import authUser from './../middlewares/authUser.js';
import { allIssues, createIssue, updateIssue } from "../controllers/issueController.js";

const issueRouter = express.Router();

issueRouter.post('/create-issue', authUser, createIssue);
issueRouter.get('/all-issues', authUser, allIssues);
issueRouter.put('/update-status', authUser, updateIssue);

export default issueRouter;