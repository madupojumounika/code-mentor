import { loadProblems } from "../utils/problemLoader.js";
import Submission from "../models/Submission.js";
import { runCode } from "../utils/codeWrapper.js";
import { analyzeCode } from "../utils/codeAnalysis.js";
import User from "../models/User.js";

/* GET ALL PROBLEMS*/
export const getAllProblems = async (req, res) => {
  try {
    res.json(loadProblems());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load problems" });
  }
};

export const getProblemById = async (req, res) => {
  try {
    const problem = loadProblems().find(
      p => String(p._id) === String(req.params.id) || p.title === req.params.id
    );
    if (!problem) return res.status(404).json({ error: "Problem not found" });
    res.json(problem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

/* RUN CODE*/
export const runCodeOnly = async (req, res) => {
  try {
    const { language, code, problemId } = req.body;
    if (!language || !code || !problemId) 
      return res.status(400).json({ error: "Missing fields" });

    const problem = loadProblems().find(p => String(p._id) === String(problemId));
    if (!problem) return res.status(404).json({ error: "Problem not found" });

    runCode({ language, code, testCases: problem.testCases }, results => {
      const normalized = results.map(r => ({
        ...r,
        passed: String(r.output).replace(/\s/g, '') === String(r.expected).replace(/\s/g, '')
      }));
      res.json({ results: normalized });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Run failed" });
  }
};

//submitcode
export const submitCode = async (req, res) => {
  try {
    const { language, code, problemId } = req.body;
    const userId = req.user?._id;

    if (!language || !code || !problemId) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const problem = loadProblems().find(
      (p) => String(p._id) === String(problemId)
    );

    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    runCode({ language, code, testCases: problem.testCases }, async (results) => {
      try {
        const normalized = results.map((r) => ({
          ...r,
          passed:
            String(r.output).replace(/\s/g, "") ===
            String(r.expected).replace(/\s/g, ""),
        }));

        const passed = normalized.every((r) => r.passed);
        const status = passed ? "Accepted ✅" : "Wrong Answer ❌";

        const submission = await Submission.create({
          userId,
          problemId,
          language,
          code,
          status,
          passed,
          pattern: problem.pattern,
          difficulty: problem.difficulty,
        });

        if (passed && userId) {
          const user = await User.findById(userId);

          if (user) {
            user.problemsSolved += 1;
            user.totalScore += 100;
            user.avgScore = Math.round(
              user.totalScore / user.problemsSolved
            );

            const skillIndex = user.skills.findIndex(
              (s) => s.name === language
            );

            if (skillIndex !== -1) {
              user.skills[skillIndex].score = Math.min(
                100,
                user.skills[skillIndex].score + 10
              );
            } else {
              user.skills.push({ name: language, score: 10 });
            }

            user.recentActivity.unshift(`Solved ${problem.title}`);
            user.recentActivity = user.recentActivity.slice(0, 5);

            await user.save();
          }
        }

        const aiFeedback = analyzeCode ? analyzeCode(code) : null;

        res.json({
          submissionId: submission._id,
          status,
          results: normalized,
          aiFeedback,
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Submission failed" });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Submit failed" });
  }
};
