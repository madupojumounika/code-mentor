import Submission from "../models/Submission.js";
import { loadProblems } from "../utils/problemLoader.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user?._id?.toString() || "guest";

    const submissions = await Submission.find({ userId }).sort({ createdAt: -1 });

    // ✅ FIX 1: use passed
    const solvedProblemSet = new Set(
      submissions.filter(s => s.passed).map(s => String(s.problemId))
    );

    const problemsSolved = solvedProblemSet.size;

    const avgScore = submissions.length
      ? Math.round(
          (submissions.filter(s => s.passed).length / submissions.length) * 100
        )
      : 0;

    // pattern performance
    const patternScores = {};
    submissions.forEach(s => {
      if (!s.pattern) return;

      if (!patternScores[s.pattern]) {
        patternScores[s.pattern] = { total: 0, correct: 0 };
      }

      patternScores[s.pattern].total++;
      if (s.passed) patternScores[s.pattern].correct++;
    });

    const weakAreas = Object.entries(patternScores)
      .map(([pattern, data]) => ({
        pattern,
        score: Math.round((data.correct / data.total) * 100),
      }))
      .filter(p => p.score < 50)
      .map(p => p.pattern);

    const recentActivity = submissions.slice(0, 5).map(s => ({
      problemId: s.problemId,
      status: s.passed ? "Solved" : "Attempted",
    }));

    // ✅ FIX 3: same source as submit
    const allProblems = loadProblems();
    const upcomingChallenges = allProblems
      .filter(p => !solvedProblemSet.has(String(p._id)))
      .slice(0, 5)
      .map(p => p.title);

    const skills = Object.entries(patternScores).map(([pattern, data]) => ({
      name: pattern,
      score: Math.round((data.correct / data.total) * 100),
    }));

    const practiceRecommendations = weakAreas.map(area => ({
      title: `${area} Practice`,
      description: `Practice more ${area} problems to improve accuracy.`,
    }));

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
