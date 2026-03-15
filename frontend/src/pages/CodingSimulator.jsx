import React, { useEffect, useState } from "react";
import { FaPlay, FaUpload } from "react-icons/fa";
import CodeEditor from "../components/CodeEditor";
import AIFeedback from "./AIFeedback";
import api from "../api/axios";

/* DEFAULT STARTER CODES */
const DEFAULT_CODE = {
  javascript: `function solution(...args) {
  // Write your logic here
  return args;
}
module.exports = solution;`,

  python: `def solution(*args):
    # Write your logic here
    return args`,

  java: `class Solution {
  public static Object solution(Object... args) {
    // Write your logic here
    return args;
  }
}`,

  cpp: `#include <bits/stdc++.h>
using namespace std;
auto solution(vector<int> args) {
  // Write your logic here
  return args;
}`
};

const preStyle =
  "whitespace-pre-wrap break-words overflow-x-auto max-w-full bg-black text-green-400 p-3 rounded-lg text-sm";

const CodingSimulator = () => {
  const [problems, setProblems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(DEFAULT_CODE.javascript);
  const [output, setOutput] = useState("");
  const [testResults, setTestResults] = useState([]);
  const [submissionId, setSubmissionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorLine, setErrorLine] = useState(null);

  const currentProblem = problems[currentIndex];

  /* FETCH PROBLEMS */
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await api.get("/problems");
        setProblems(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProblems();
  }, []);

  /*RESET ON CHANGE */
  useEffect(() => {
    if (!currentProblem) return;

    const starter =
      currentProblem.starterCode?.[language] || DEFAULT_CODE[language];

    setCode(starter);
    setOutput("");
    setTestResults([]);
    setSubmissionId(null);
    setErrorLine(null);
  }, [language, currentIndex, currentProblem]);

  const simplifyError = (err) => {
    setErrorLine(null);
    if (!err) return "Runtime Error ❌";

    const msg = String(err);
    const lines = msg.split("\n").filter(Boolean);
    let line = null;

    if (language === "javascript") {
      const match =
        msg.match(/solution\.js:(\d+)/) ||
        msg.match(/:(\d+):\d+/);
      if (match) line = parseInt(match[1], 10);
    } else if (language === "python") {
      const m = msg.match(/line (\d+)/i);
      if (m) line = +m[1];
    } else if (language === "java") {
      const m = msg.match(/:(\d+):/);
      if (m) line = +m[1];
    } else if (language === "cpp") {
      const m = msg.match(/:(\d+):\d+:/);
      if (m) line = +m[1];
    }

    if (line) setErrorLine(line);

    const clean =
      lines.find(l =>
        l.toLowerCase().includes("error") ||
        l.toLowerCase().includes("exception")
      ) || lines[0];

    return clean ? clean.slice(0, 120) : "Runtime Error ❌";
  };

  /* RUN CODE */
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

      const results = (res.data.results || []).map(r => ({
        ...r,
        output: String(r.output),
        expected: String(r.expected),
        passed:
          String(r.output).replace(/\s/g, "") ===
          String(r.expected).replace(/\s/g, "")
      }));

      setTestResults(results);

      const passed = results.filter(t => t.passed).length;
      setOutput(
        passed === results.length
          ? "✅ All test cases passed"
          : `❌ Wrong Answer (${passed}/${results.length})`
      );
    } catch (err) {
      setOutput(
        simplifyError(
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message
        )
      );
    }

    setLoading(false);
  };

  /* SUBMIT CODE */
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

      const results = (res.data.results || []).map(r => ({
        ...r,
        output: String(r.output),
        expected: String(r.expected),
        passed:
          String(r.output).replace(/\s/g, "") ===
          String(r.expected).replace(/\s/g, "")
      }));

      setTestResults(results);

      const passed = results.filter(t => t.passed).length;
      setOutput(
        passed === results.length
          ? "🎉 Accepted"
          : `❌ Wrong Answer (${passed}/${results.length})`
      );

      if (res.data.submissionId) {
        setSubmissionId(res.data.submissionId);
      }
    } catch (err) {
      setOutput(
        simplifyError(
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message
        )
      );
    }

    setLoading(false);
  };

  /* NAVIGATION  */
  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(i => i - 1);
  };

  const handleNext = () => {
    if (currentIndex < problems.length - 1) setCurrentIndex(i => i + 1);
  };

  if (!currentProblem) {
    return <p className="p-6">Loading problems...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">
        Coding Simulator
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-indigo-600">
          <h2 className="text-2xl font-semibold mb-2">
            {currentProblem.title}
          </h2>

          <p className="text-gray-700 whitespace-pre-line mb-4">
            {currentProblem.description}
          </p>

          {currentProblem.testCases?.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2 text-indigo-700">
                🧪 Sample Test Cases
              </h3>

              {currentProblem.testCases.map((t, i) => (
                <div key={i} className="bg-gray-50 border rounded-lg p-4 mb-3">
                  <p className="font-medium">Input</p>
                  <pre className={preStyle}>{t.input}</pre>

                  <p className="font-medium mt-2">Expected Output</p>
                  <pre className={preStyle}>{t.output}</pre>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center flex-wrap gap-2 mt-4">
            <select
              className="border rounded px-3 py-1"
              value={language}
              onChange={e => setLanguage(e.target.value)}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>

            <div className="flex gap-3">
              <button onClick={handleRun} disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center gap-2">
                <FaPlay /> Run
              </button>

              <button onClick={handleSubmit} disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2">
                <FaUpload /> Submit
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            <button onClick={handlePrev} disabled={currentIndex === 0}
              className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-40">
              ⬅ Prev
            </button>

            <span className="text-sm text-gray-600">
              Problem {currentIndex + 1} / {problems.length}
            </span>

            <button onClick={handleNext}
              disabled={currentIndex === problems.length - 1}
              className="px-4 py-2 bg-indigo-700 text-white rounded disabled:opacity-40">
              Next ➡
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <CodeEditor
              code={code}
              setCode={setCode}
              language={language}
              height="500px"
              highlightLine={errorLine}
            />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="font-semibold mb-2">Output</h3>

            <pre className={preStyle}>{output}</pre>

            {testResults.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Test Case Results</h3>
                {testResults.map((t, i) => (
                  <div key={i} className="p-3 rounded mb-2">
                    <pre className={preStyle}>{t.output}</pre>
                  </div>
                ))}
              </div>
            )}

            {submissionId ? <AIFeedback submissionId={submissionId} /> : <p>Submit your code to see AI feedback</p>}

          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingSimulator;