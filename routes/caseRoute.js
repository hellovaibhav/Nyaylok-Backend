import express from "express";
import { getUncompleteCases, registerCase } from "../controllers/cases.js";

const router = express.Router();

router.post("/registerCase", registerCase);

router.get("/IncompleteCases", getUncompleteCases);

export default router;