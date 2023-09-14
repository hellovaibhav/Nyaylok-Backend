import express from "express";
import { registerCase } from "../controllers/cases.js";

const router = express.Router();

router.post("/registerCase", registerCase);

export default router;