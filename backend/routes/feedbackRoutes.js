import { Router } from "express";
import { getAIFeedback } from "../controllers/feedbackController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

// Get AI feedback 
router.get("/:submissionId", protect, getAIFeedback);

export default router;
