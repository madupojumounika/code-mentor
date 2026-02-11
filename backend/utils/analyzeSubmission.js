import { GoogleGenAI } from "@google/genai";
import { performance } from "perf_hooks";

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

export const analyzeSubmission = async ({ problem, submission }) => {
  const { code, language } = submission;
  const testResults = [];

  for (const testCase of problem.testCases) {
    const startTime = performance.now();
    let output = "";
    let passed = false;
    let error = null;

    try {
      output = eval(code + `\n${testCase.input}`);
      passed =
        String(output).replace(/\s/g, "") ===
        String(testCase.expected).replace(/\s/g, "");
    } catch (err) {
      error = err.message;
      passed = false;
    }

    const endTime = performance.now();
    const execTimeMs = Math.round(endTime - startTime);

    testResults.push({
      input: testCase.input,
      expected: testCase.expected,
      output: output ?? "",
      passed,
      execTimeMs,
      error,
    });
  }

  const userPrompt = `
You are a programming coach.

Problem:
Title: ${problem.title}
Description: ${problem.description}
Pattern: ${problem.pattern}

User code (${language}):
${code}

Test results:
${JSON.stringify(testResults, null, 2)}

Return ONLY JSON with the structure:
{
  "Efficiency": {"score": number, "comments": string[], "suggestions": string[]},
  "Code Readability": {"score": number, "comments": string[], "suggestions": string[]},
  "Edge Cases": {"score": number, "comments": string[], "suggestions": string[]},
  "complexity": {"time": string, "space": string, "bestTime": string, "bestSpace": string},
  "lineFeedback": [{"line": number, "message": string}],
  "learningTips": string[],
  "summary": string,
  "testResults": []
}

Evaluate efficiency, readability, edge cases, and time/space complexity. Include testResults unchanged.
Respond with valid JSON only.
`;

  let feedback = {};
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userPrompt,
      });
      feedback = JSON.parse(response.text?.trim() || "{}");
    } catch {
      feedback = null;
    }
  }

  if (!feedback || typeof feedback !== "object") {
    feedback = {
      Efficiency: { score: 7, comments: ["Fallback"], suggestions: [] },
      "Code Readability": { score: 7, comments: ["Fallback"], suggestions: [] },
      "Edge Cases": { score: 7, comments: ["Fallback"], suggestions: [] },
      complexity: { time: "O(n)", space: "O(n)", bestTime: "O(n)", bestSpace: "O(1)" },
      lineFeedback: [],
      learningTips: [],
      summary: "AI feedback unavailable; using fallback.",
      testResults,
    };
  }

  feedback.testResults = testResults;
  feedback.overallScore = Math.round(
    (feedback.Efficiency.score + feedback["Code Readability"].score + feedback["Edge Cases"].score) / 3
  );

  return feedback;
};
