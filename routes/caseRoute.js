import express from "express";
import { allCaseInfo, getCaseById, getIncompleteCases, getIncompleteCasesPaginated, registerCase, updateCase, upgradeToCompleted, upgradeToOngoing, variousCaseCount } from "../controllers/cases.js";

const router = express.Router();

router.post("/registerCase", registerCase);

router.get("/IncompleteCases", getIncompleteCases);

router.get("/findCaseById/:caseId", getCaseById);

router.patch("/updateCase/:caseId", updateCase);

router.get("/IncompleteCasesPaginated/?", getIncompleteCasesPaginated);

router.get("/caseCounts", variousCaseCount);

router.patch("/upgradeToOngoing/:caseId", upgradeToOngoing);

router.patch("/upgradeToCompleted/:caseId", upgradeToCompleted);

router.get("/allCaseInfo/:caseId", allCaseInfo);

export default router;