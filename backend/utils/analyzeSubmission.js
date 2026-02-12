import { GoogleGenAI } from "@google/genai";
import { ruleAnalyzer } from "./ruleAnalyzer.js";

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

export const analyzeSubmission = async ({ problem, submission, testResults }) => {
  const { code, language } = submission;

  const ruleFeedback = ruleAnalyzer({ problem, submission });

  let geminiFeedback = null;

  if (ai) {
    try {
      const prompt = `
You are an expert DSA code reviewer.

Analyze the following submission and return STRICT JSON only.

Problem:
Title: ${problem.title}
Description: ${problem.description}
Pattern: ${problem.pattern}

Language: ${language}

Code:
${code}

Test Results:
${JSON.stringify(testResults, null, 2)}

Return ONLY this JSON format:
{
  "Efficiency": {"score": number, "comments": string[], "suggestions": string[]},
  "Code Readability": {"score": number, "comments": string[], "suggestions": string[]},
  "Edge Cases": {"score": number, "comments": string[], "suggestions": string[]},
  "complexity": {"time": string, "space": string, "bestTime": string, "bestSpace": string},
  "lineFeedback": [{"line": number, "message": string}],
  "learningTips": string[],
  "summary": string
}
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      let text = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      text = text.replace(/```json|```/g, "").trim();

      geminiFeedback = JSON.parse(text);
    } catch (err) {
      console.error("Gemini parse error:", err.message);
      geminiFeedback = null;
    }
  }

  const finalFeedback = mergeFeedback(ruleFeedback, geminiFeedback);

  finalFeedback.testResults = testResults;

  finalFeedback.overallScore = Math.round(
    (
      finalFeedback.Efficiency.score +
      finalFeedback["Code Readability"].score +
      finalFeedback["Edge Cases"].score
    ) / 3
  );

  return finalFeedback;
};

function mergeFeedback(rule, gemini) {
  if (!gemini) return rule;

  return {
    Efficiency: mergeSection(rule.Efficiency, gemini.Efficiency),
    "Code Readability": mergeSection(rule["Code Readability"], gemini["Code Readability"]),
    "Edge Cases": mergeSection(rule["Edge Cases"], gemini["Edge Cases"]),
    complexity: gemini.complexity || rule.complexity,
    lineFeedback: [...(rule.lineFeedback || []), ...(gemini.lineFeedback || [])],
    learningTips: [...new Set([...(rule.learningTips || []), ...(gemini.learningTips || [])])],
    summary: gemini.summary || rule.summary
  };
}

function mergeSection(rulePart, geminiPart) {
  if (!geminiPart) return rulePart;

  return {
    score: Math.max(1, Math.min(10, Math.round(
      (rulePart.score + geminiPart.score) / 2
    ))),
    comments: [...new Set([...(rulePart.comments || []), ...(geminiPart.comments || [])])],
    suggestions: [...new Set([...(rulePart.suggestions || []), ...(geminiPart.suggestions || [])])]
  };
}
