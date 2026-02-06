import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { runCodeOnly, submitCode, getAllProblems, getProblemById } from "../controllers/simulatorController.js";

const router = express.Router();

// Problems
router.get("/problems", getAllProblems);
router.get("/problem/:id", getProblemById);

// Run & Submit
router.post("/run", runCodeOnly);
router.post("/submit", submitCode);

export default router;
