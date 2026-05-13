import Groq from "groq-sdk";

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

import { ruleAnalyzer } from "./ruleAnalyzer.js";

export const analyzeSubmission = async ({ problem, submission, testResults }) => {
  const { code, language } = submission;

  const ruleFeedback = ruleAnalyzer({ problem, submission });

  let groqFeedback = null;

if (groq) {
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

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    let text = response?.choices?.[0]?.message?.content;

    if (!text) {
      console.error("Groq returned empty response");
      groqFeedback = null;
    } else {
      text = text.replace(/```json|```/g, "").trim();

      try {
        groqFeedback = JSON.parse(text);
      } catch (e) {
        console.error("JSON Parse Failed:", text);
        groqFeedback = null;
      }
    }

  } catch (err) {
    console.error("Groq error:", err.message);
    groqFeedback = null;
  }
}

  const finalFeedback = mergeFeedback(ruleFeedback, groqFeedback);

  finalFeedback.testResults = testResults;

const eff = finalFeedback?.Efficiency?.score || 0;
const read = finalFeedback?.["Code Readability"]?.score || 0;
const edge = finalFeedback?.["Edge Cases"]?.score || 0;

finalFeedback.overallScore = Math.round((eff + read + edge) / 3);

  return finalFeedback;
};

function mergeFeedback(rule, ai) {
  if (!ai) return rule;

  return {
    Efficiency: mergeSection(rule.Efficiency, ai.Efficiency),
    "Code Readability": mergeSection(rule["Code Readability"], ai["Code Readability"]),
    "Edge Cases": mergeSection(rule["Edge Cases"], ai["Edge Cases"]),
    complexity: ai.complexity || rule.complexity,
    lineFeedback: [...(rule.lineFeedback || []), ...(ai.lineFeedback || [])],
    learningTips: [...new Set([...(rule.learningTips || []), ...(ai.learningTips || [])])],
    summary: ai.summary || rule.summary
  };
}

function mergeSection(rulePart, aiPart) {
  if (!aiPart) return rulePart;

  return {
    score: Math.max(1, Math.min(10, Math.round(
      (rulePart.score + aiPart.score) / 2
    ))),
    comments: [...new Set([...(rulePart.comments || []), ...(aiPart.comments || [])])],
    suggestions: [...new Set([...(rulePart.suggestions || []), ...(aiPart.suggestions || [])])]
  };
}
