import { loadProblems } from "../utils/problemLoader.js";
import Submission from "../models/Submission.js";
import { runCode } from "../utils/codeWrapper.js";
import User from "../models/User.js";
import { analyzeSubmission } from "../utils/analyzeSubmission.js";

export const getAllProblems = (req, res) => {
  try {
    res.json(loadProblems());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load problems" });
  }
};

export const getProblemById = (req, res) => {
  try {
    const problem = loadProblems().find(
      (p) => String(p._id) === String(req.params.id) || p.title === req.params.id
    );
    if (!problem) return res.status(404).json({ error: "Problem not found" });
    res.json(problem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const runCodeOnly = async (req, res) => {
  try {
    const { language, code, problemId } = req.body;
    if (!language || !code || !problemId)
      return res.status(400).json({ error: "Missing fields" });

    const problem = loadProblems().find((p) => String(p._id) === String(problemId));
    if (!problem) return res.status(404).json({ error: "Problem not found" });

    runCode({ language, code, testCases: problem.testCases }, async (results, runtimeError) => {
      if (runtimeError) {
        return res.json({
          status: "Runtime Error ❌",
          results: [],
          error: runtimeError,
          weakAreas: [],
          aiFeedback: null
        });
      }

      const normalized = results.map((r) => ({
        ...r,
        passed: r.hasOwnProperty("output") && String(r.output).replace(/\s/g, "") === String(r.expected).replace(/\s/g, "")
      }));

      const anyPassed = normalized.some(r => r.passed);
      const weakAreas = [];

      let feedback = null;
      if (anyPassed) {
        const submissionContext = { problem, submission: { code, language, status: "Run Only" } };
        feedback = await analyzeSubmission(submissionContext);
        ["Efficiency", "Code Readability", "Edge Cases"].forEach((key) => {
          if (feedback[key].score < 7) weakAreas.push(problem.pattern);
        });
      }

      res.json({ results: normalized, aiFeedback: feedback, weakAreas });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Run failed" });
  }
};

export const submitCode = async (req, res) => {
  try {
    const { language, code, problemId } = req.body;
    const userId = req.user?._id;
    if (!language || !code || !problemId)
      return res.status(400).json({ error: "Missing fields" });

    const problem = loadProblems().find((p) => String(p._id) === String(problemId));
    if (!problem) return res.status(404).json({ error: "Problem not found" });

    runCode({ language, code, testCases: problem.testCases }, async (results, runtimeError) => {
      if (runtimeError) {
        return res.json({
          status: "Runtime Error ❌",
          results: [],
          error: runtimeError,
          weakAreas: [],
          aiFeedback: null,
          skills: userId ? (await User.findById(userId)).skills : []
        });
      }

      const normalized = results.map((r) => ({
        ...r,
        passed: r.hasOwnProperty("output") && String(r.output).replace(/\s/g, "") === String(r.expected).replace(/\s/g, "")
      }));

      const passed = normalized.every(r => r.passed);
      const status = passed ? "Accepted ✅" : "Wrong Answer ❌";

      const submission = await Submission.create({
        userId,
        problemId,
        language,
        code,
        status,
        passed,
        pattern: problem.pattern,
        difficulty: problem.difficulty
      });

      let feedback = null;
      const weakAreas = [];
      const anyPassed = normalized.some(r => r.passed);

      if (anyPassed) {
        const submissionContext = { problem, submission: { code, language, status } };
        feedback = await analyzeSubmission(submissionContext);
        ["Efficiency", "Code Readability", "Edge Cases"].forEach((key) => {
          if (feedback[key].score < 7) weakAreas.push(problem.pattern);
        });
      }

      if (userId) {
        const user = await User.findById(userId);
        if (user) {
          if (passed) {
            user.problemsSolved += 1;
            user.totalScore += 100;
            user.avgScore = Math.round(user.totalScore / user.problemsSolved);
            user.recentActivity.unshift(`Solved ${problem.title}`);
            user.recentActivity = user.recentActivity.slice(0, 5);
          }

          if (feedback) {
            const skillScore = Math.round(
              (feedback.Efficiency.score +
                feedback["Code Readability"].score +
                feedback["Edge Cases"].score) / 3 * 10
            );
            const skillIndex = user.skills.findIndex((s) => s.name === problem.pattern);
            if (skillIndex !== -1) user.skills[skillIndex].score = skillScore;
            else user.skills.push({ name: problem.pattern, score: skillScore });
          }

          await user.save();
        }
      }

      res.json({
        submissionId: submission._id,
        status,
        results: normalized,
        aiFeedback: feedback,
        skills: userId ? (await User.findById(userId)).skills : [],
        weakAreas
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Submit failed" });
  }
};
