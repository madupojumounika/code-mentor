import React, { useEffect, useState } from "react";
import { FaPlay, FaUpload } from "react-icons/fa";
import CodeEditor from "../components/CodeEditor";
import AIFeedback from "./AIFeedback";
import api from "../api/axios";

const DEFAULT_CODE = {
  javascript: `function solution(...args) {\n  // Write your logic here\n  return args;\n}\nmodule.exports = solution;`,
  python: `def solution(*args):\n    # Write your logic here\n    return args`,
  java: `class Solution {\n  public static Object solution(Object... args) {\n  // Write your logic here\n  return args;\n  }\n}`,
  cpp: `#include <bits/stdc++.h>\nusing namespace std;\nauto solution(vector<int> args) {\n  // Write your logic here\n  return args;\n}`
};

const preStyle = "whitespace-pre-wrap break-words overflow-x-auto max-w-full";

const CodingSimulator = () => {
  const [problems, setProblems] = useState([]);
  const [currentIndex] = useState(0);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(DEFAULT_CODE.javascript);
  const [output, setOutput] = useState("");
  const [testResults, setTestResults] = useState([]);
  const [submissionId, setSubmissionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorLine, setErrorLine] = useState(null);

  const currentProblem = problems[currentIndex];

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await api.get("/problems");
        setProblems(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProblems();
  }, []);

  useEffect(() => {
    if (!problems.length) return;
    const starter = problems[currentIndex]?.starterCode?.[language] || DEFAULT_CODE[language];
    setCode(starter);
    setOutput("");
    setTestResults([]);
    setSubmissionId(null);
    setErrorLine(null);
  }, [language, currentIndex, problems]);

  const simplifyError = (err) => {
    setErrorLine(null);
    if (!err) return "Runtime Error ❌";

    const msg = String(err);
    const lines = msg.split("\n").filter(l => l.trim() !== "");
    let line = null;

    // Detect error line number based on language
    if (language === "javascript") {
      const match = msg.match(/:(\d+):\d+\)?$/);
      if (match) line = parseInt(match[1]);
    } else if (language === "python") {
      const match = msg.match(/line (\d+)/i);
      if (match) line = parseInt(match[1]);
    } else if (language === "java") {
      const match = msg.match(/:(\d+):/);
      if (match) line = parseInt(match[1]);
    } else if (language === "cpp") {
      const match = msg.match(/:(\d+):\d+:/);
      if (match) line = parseInt(match[1]);
    }

    if (line) setErrorLine(line);
    return lines.length > 0 ? lines[0].slice(0, 120) : "Runtime Error ❌";
  };

  const handleRun = async () => {
    if (!currentProblem) return;
    setLoading(true);
    setOutput("Running...");
    setTestResults([]);
    setErrorLine(null);

    try {
      const res = await api.post("/simulator/run", {
        language,
        code,
        problemId: currentProblem._id
      });

      const cleanedResults = (res.data.results || []).map(r => ({
        ...r,
        output: String(r.output),
        expected: String(r.expected),
        passed: String(r.output).replace(/\s/g, "") === String(r.expected).replace(/\s/g, "")
      }));

      setTestResults(cleanedResults);
      const total = cleanedResults.length;
      const passedCount = cleanedResults.filter(t => t.passed).length;
      setOutput(
        passedCount === total
          ? "✅ All test cases passed"
          : `❌ Wrong Answer (${passedCount}/${total} passed)`
      );
    } catch (err) {
      setOutput(simplifyError(err.response?.data?.error || err.response?.data?.message || err.message));
    }

    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!currentProblem) return;
    setLoading(true);
    setOutput("Submitting...");
    setTestResults([]);
    setSubmissionId(null);
    setErrorLine(null);

    try {
      const res = await api.post("/simulator/submit", {
        language,
        code,
        problemId: currentProblem._id
      });

      const cleanedResults = (res.data.results || []).map(r => ({
        ...r,
        output: String(r.output),
        expected: String(r.expected),
        passed: String(r.output).replace(/\s/g, "") === String(r.expected).replace(/\s/g, "")
      }));

      setTestResults(cleanedResults);
      const total = cleanedResults.length;
      const passedCount = cleanedResults.filter(t => t.passed).length;

      setOutput(
        passedCount === total
          ? "🎉 Accepted"
          : `❌ Wrong Answer (${passedCount}/${total} passed)`
      );

      if (res.data.submissionId) setSubmissionId(res.data.submissionId);
    } catch (err) {
      setOutput(simplifyError(err.response?.data?.error || err.response?.data?.message || err.message));
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Coding Simulator</h1>

      {currentProblem && (
        <div className="bg-white p-6 rounded-2xl shadow mb-6 overflow-hidden">
          <h2 className="text-2xl font-semibold mb-2">{currentProblem.title}</h2>
          <p className="text-gray-700 whitespace-pre-line mb-4">{currentProblem.description}</p>

          {currentProblem.testCases?.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Test Cases:</h3>
              {currentProblem.testCases.map((t, i) => (
                <div key={i} className="bg-gray-50 p-3 rounded mb-2">
                  <p><b>Input:</b></p>
                  <pre className={preStyle}>{t.input}</pre>
                  <p><b>Expected Output:</b></p>
                  <pre className={preStyle}>{t.output}</pre>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center mt-4 flex-wrap gap-2">
            <select
              className="border rounded px-3 py-1"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>

            <div className="flex gap-3">
              <button
                onClick={handleRun}
                disabled={loading}
                className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2"
              ><FaPlay /> Run</button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
              ><FaUpload /> Submit</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl shadow mb-6 overflow-hidden">
        <CodeEditor
          code={code}
          setCode={setCode}
          language={language}
          height="500px"
          highlightLine={errorLine}
        />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow overflow-hidden">
        <h3 className="font-semibold mb-2">Output</h3>
        <pre
          className={`p-4 rounded min-h-[120px] ${preStyle} ${
            output.includes("❌") || output.toLowerCase().includes("error")
              ? "bg-red-900 text-red-200"
              : "bg-black text-green-400"
          }`}
        >
          {output}
        </pre>

        {testResults.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Test Case Results:</h3>
            {testResults.map((t, i) => (
              <div key={i} className={`p-3 rounded mb-2 ${t.passed ? "bg-green-100 border-l-4 border-green-500" : "bg-red-100 border-l-4 border-red-500"}`}>
                <p><b>Input:</b></p><pre className={preStyle}>{t.input}</pre>
                <p><b>Expected:</b></p><pre className={preStyle}>{t.expected}</pre>
                <p><b>Your Output:</b></p><pre className={preStyle}>{t.output}</pre>
                <p><b>Status:</b> {t.passed ? "✅ Passed" : "❌ Failed"}</p>
              </div>
            ))}
          </div>
        )}

        {submissionId && <AIFeedback submissionId={submissionId} />}
      </div>
    </div>
  );
};

export default CodingSimulator;
