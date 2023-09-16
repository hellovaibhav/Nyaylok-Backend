import express from "express";
import { getCaseById, getIncompleteCases, getIncompleteCasesPaginated, registerCase, updateCase, upgradeToCompleted, upgradeToOngoing, variousCaseCount } from "../controllers/cases.js";

const router = express.Router();

router.post("/registerCase", registerCase);

router.get("/IncompleteCases", getIncompleteCases);

router.get("/findCaseById/:caseId", getCaseById);

router.patch("/updateCase/:caseId", updateCase);

router.get("/IncompleteCasesPaginated/?", getIncompleteCasesPaginated);

router.get("/caseCounts", variousCaseCount);

router.patch("/upgradeToOngoing/:caseId", upgradeToOngoing);

router.patch("/upgradeToCompleted/:caseId", upgradeToCompleted);

export default router;