import Submission from "../models/Submission.js";
import { analyzeSubmission } from "../utils/analyzeSubmission.js";
import { loadProblems } from "../utils/problemLoader.js";

const fallbackFeedback = {
  Efficiency: { score: 7, comments: ["Fallback feedback"], suggestions: [] },
  "Code Readability": { score: 7, comments: ["Fallback feedback"], suggestions: [] },
  "Edge Cases": { score: 7, comments: ["Fallback feedback"], suggestions: [] },
  complexity: { time: "O(n)", space: "O(n)" },
  lineFeedback: [],
  learningTips: [],
  summary: "AI feedback unavailable; using default analysis.",
};

export const getAIFeedback = async (req, res) => {
  try {
    const { submissionId } = req.params;

    const submission = await Submission.findById(submissionId);
    if (!submission) return res.status(404).json({ error: "Submission not found" });

    const problem = loadProblems().find(p => String(p._id) === String(submission.problemId));
    if (!problem) return res.status(404).json({ error: "Problem not found" });

    let feedback = fallbackFeedback;

    try {
      feedback = await analyzeSubmission({ problem, submission });
    } catch (err) {
      console.error("Feedback generation failed:", err.message);
    }

    res.json({ submissionId, feedback });
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({ error: "Server error", feedback: fallbackFeedback });
  }
};
