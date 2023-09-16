import express from "express";
import { getCaseById, getIncompleteCases, getIncompleteCasesPaginated, registerCase, updateCase } from "../controllers/cases.js";

const router = express.Router();

router.post("/registerCase", registerCase);

router.get("/IncompleteCases", getIncompleteCases);

router.get("/findCaseById/:caseId", getCaseById);

router.patch("/updateCase/:caseId", updateCase);

router.get("/IncompleteCasesPaginated/?", getIncompleteCasesPaginated);

export default router;