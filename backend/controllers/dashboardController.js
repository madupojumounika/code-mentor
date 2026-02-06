import Submission from "../models/Submission.js";
import Problem from "../models/problem.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id.toString(); 

    const submissions = await Submission.find({ userId }).sort({ createdAt: 1 });

    const solvedProblemSet = new Set(
      submissions
        .filter(s => s.status === "Accepted")
        .map(s => s.problemId)
    );

    const problemsSolved = solvedProblemSet.size;

    const avgScore = submissions.length
      ? Math.round(
          (submissions.filter(s => s.status === "Accepted").length /
            submissions.length) *
            100
        )
      : 0;

    const patternScores = {};
    submissions.forEach(s => {
      if (!s.pattern) return;

      if (!patternScores[s.pattern]) {
        patternScores[s.pattern] = { total: 0, correct: 0 };
      }

      patternScores[s.pattern].total++;
      if (s.status === "Accepted") {
        patternScores[s.pattern].correct++;
      }
    });

    const weakAreas = Object.entries(patternScores)
      .map(([pattern, data]) => ({
        pattern,
        score: Math.round((data.correct / data.total) * 100),
      }))
      .filter(p => p.score < 50)
      .map(p => p.pattern);

    const recentActivity = submissions
      .slice(-5)
      .reverse()
      .map(
        s => `Problem ${s.problemId} → ${s.status === "Accepted" ? "Solved" : "Attempted"}`
      );

    const allProblems = await Problem.find();
    const upcomingChallenges = allProblems
      .filter(p => !solvedProblemSet.has(p._id.toString()))
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
    console.error("Error in dashboard:", err);
    res.status(500).json({ message: "Server error" });
  }
};
