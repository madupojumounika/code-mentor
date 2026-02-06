import Submission from "../models/Submission.js";
import { analyzeCode } from "../utils/codeAnalysis.js";

export const getAIFeedback = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const submission = await Submission.findById(submissionId);
    if (!submission) return res.status(404).json({ error: "Submission not found" });

    const aiFeedback = await analyzeCode(submission.code);

    res.json({ aiFeedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
