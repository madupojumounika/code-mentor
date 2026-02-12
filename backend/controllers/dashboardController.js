import Submission from "../models/Submission.js";
import { loadProblems } from "../utils/problemLoader.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user?._id?.toString() || "guest";

    const submissions = await Submission.find({ userId }).sort({ createdAt: -1 });
    
    const solvedProblemSet = new Set(
      submissions.filter(s => s.passed).map(s => String(s.problemId))
    );

    const problemsSolved = solvedProblemSet.size;

    const avgScore = submissions.length
      ? Math.round(
          (submissions.filter(s => s.passed).length / submissions.length) * 100
        )
      : 0;

    const patternScores = {};
    const skillHistory = {};

    submissions.forEach((s) => {
      if (!s.pattern) return;

      if (!patternScores[s.pattern]) {
        patternScores[s.pattern] = { total: 0, correct: 0 };
      }

      patternScores[s.pattern].total++;
      if (s.passed) patternScores[s.pattern].correct++;

      const date = new Date(s.createdAt).toLocaleDateString("en-CA", {
        timeZone: "Asia/Kolkata", 
      });

      if (!skillHistory[s.pattern]) {
        skillHistory[s.pattern] = {};
      }

      if (!skillHistory[s.pattern][date]) {
        skillHistory[s.pattern][date] = { total: 0, correct: 0 };
      }

      skillHistory[s.pattern][date].total++;
      if (s.passed) skillHistory[s.pattern][date].correct++;
    });

    const skills = Object.entries(patternScores).map(([pattern, data]) => {
      const score = Math.round((data.correct / data.total) * 100);

      let level = "Strong";
      if (score < 60) level = "Weak";
      else if (score < 80) level = "Needs Improvement";

      const history = Object.entries(skillHistory[pattern] || {}).map(
        ([date, val]) => ({
          date,
          score: Math.round((val.correct / val.total) * 100),
        })
      );

      return {
        name: pattern,
        score,
        level,
        history,
      };
    });

    const weakAreas = skills
      .filter(skill => skill.level !== "Strong")
      .map(skill => skill.name);

    const recentActivity = submissions.slice(0, 5).map(s => ({
      problemId: s.problemId,
      status: s.passed ? "Solved" : "Attempted",
    }));

    const allProblems = loadProblems();

    const upcomingChallenges = allProblems
      .filter(p => !solvedProblemSet.has(String(p._id)))
      .slice(0, 5)
      .map(p => p.title);

    const practiceRecommendations = weakAreas.map(area => {
      const recommendedProblem = allProblems.find(
        p =>
          p.pattern === area &&
          !solvedProblemSet.has(String(p._id))
      );

      return recommendedProblem
        ? {
            title: recommendedProblem.title,
            description: `Recommended ${area} problem to improve your performance.`,
          }
        : null;
    }).filter(Boolean);

    res.json({
      problemsSolved,
      avgScore,
      weakAreas,
      recentActivity,
      upcomingChallenges,
      skills,
      practiceRecommendations,
    });

  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
