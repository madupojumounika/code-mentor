export const ruleAnalyzer = ({ problem, submission }) => {
  const code = submission.code || "";
  const lines = code.split("\n");

  const feedback = {
    Efficiency: { score: 10, comments: [], suggestions: [] },
    "Code Readability": { score: 10, comments: [], suggestions: [] },
    "Edge Cases": { score: 10, comments: [], suggestions: [] },
    complexity: {
      time: problem.optimalTime || "O(n)",
      space: problem.optimalSpace || "O(1)",
      bestTime: problem.optimalTime || "O(n)",
      bestSpace: problem.optimalSpace || "O(1)",
    },
    lineFeedback: [],
    learningTips: [],
    summary: "",
  };

  const nestedLoopRegex = /(for\s*\(.*\)\s*{[\s\S]*for\s*\(.*\))|(while\s*\(.*\)\s*{[\s\S]*while\s*\(.*\))/;
  if (nestedLoopRegex.test(code)) {
    feedback.Efficiency.score -= 3;
    feedback.Efficiency.comments.push("Nested loops detected");
    feedback.Efficiency.suggestions.push(
      "Try to reduce nested loops using hashing or two-pointer technique"
    );
    feedback.complexity.time = "O(n²)";
  }

  if (/Map|Set|new Array|{}/.test(code)) {
    feedback.complexity.space = "O(n)";
    feedback.Efficiency.comments.push("Using extra memory structures");
    feedback.Efficiency.suggestions.push("Consider in-place solutions to reduce space");
  }

  if (!/null|undefined|length\s*===\s*0/.test(code)) {
    feedback["Edge Cases"].score -= 2;
    feedback["Edge Cases"].comments.push("Missing empty input checks");
    feedback["Edge Cases"].suggestions.push("Validate input before processing");
  }

  if (!/for|while/.test(code)) {
    feedback["Edge Cases"].comments.push("Check if all possible inputs are handled");
  }

  let longLineCount = 0;
  lines.forEach((line, index) => {
    if (line.length > 100) {
      longLineCount++;
      feedback.lineFeedback.push({
        line: index + 1,
        message: "Line is too long; consider breaking into smaller statements",
      });
    }

    if (line.includes("for") && line.includes("for", line.indexOf("for") + 1)) {
      feedback.lineFeedback.push({
        line: index + 1,
        message: "Nested loop may cause performance issues",
      });
    }

    if (line.includes("if") && !line.includes("{")) {
      feedback["Code Readability"].comments.push("Consider adding braces for clarity");
    }
  });

  if (longLineCount > 2) {
    feedback["Code Readability"].score -= 2;
    feedback["Code Readability"].suggestions.push("Keep lines concise for readability");
  }

  feedback.learningTips.push("Practice optimizing loops and reducing nested iterations");
  feedback.learningTips.push("Use meaningful variable names and comments");
  feedback.learningTips.push("Handle all edge cases including empty and null inputs");

  feedback.summary =
    "Your solution works, but review efficiency, readability, and edge case handling to improve.";

  return feedback;
};
