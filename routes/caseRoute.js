import express from "express";
import { getCaseById, getUncompleteCases, registerCase } from "../controllers/cases.js";

const router = express.Router();

router.post("/registerCase", registerCase);

router.get("/IncompleteCases", getUncompleteCases);

router.get("/findCaseById/:caseId", getCaseById);

export default router;