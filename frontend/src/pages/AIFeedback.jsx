import React, { useEffect, useState } from "react";
import { FaTrophy, FaCheckCircle, FaLightbulb, FaClock, FaMemory } from "react-icons/fa";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import api from "../api/axios";

const tabs = ["Efficiency", "Code Readability", "Edge Cases"];

const fallbackFeedback = {
  Efficiency: { score: 7, comments: ["Fallback feedback"], suggestions: [] },
  "Code Readability": { score: 7, comments: ["Fallback feedback"], suggestions: [] },
  "Edge Cases": { score: 7, comments: ["Fallback feedback"], suggestions: [] },
  complexity: { time: "O(n)", space: "O(n)", bestTime: "O(n)", bestSpace: "O(1)" },
  lineFeedback: [],
  learningTips: [],
  summary: "AI feedback unavailable; using default analysis.",
  testResults: [],
  overallScore: 7
};

const AIFeedback = ({ submissionId }) => {
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0]);

  useEffect(() => {
    if (!submissionId) return;
    setLoading(true);
    api.get(`/ai-feedback/${submissionId}`)
      .then((res) => setFeedback(res.data?.feedback || null))
      .catch(() => setFeedback(null))
      .finally(() => setLoading(false));
  }, [submissionId]);

  const displayFeedback = feedback || fallbackFeedback;
  const safeScore = (key) => displayFeedback[key]?.score ?? fallbackFeedback[key].score;
  const overallScore = displayFeedback.overallScore ?? Math.round(
    (safeScore("Efficiency") + safeScore("Code Readability") + safeScore("Edge Cases")) / 3
  );
  const radarData = tabs.map((t) => ({ metric: t, value: safeScore(t) }));  
  const currentTab = displayFeedback[activeTab] || fallbackFeedback[activeTab];

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">🤖 AI + Rule-Based Feedback</h1>

      {displayFeedback.testResults?.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="font-semibold mb-2">🧪 Test Case Results</h2>
          <ul className="list-disc ml-6">
            {displayFeedback.testResults.map((t, i) => (
              <li key={i} className={t.passed ? "text-green-600" : "text-red-600"}>
                {JSON.stringify(t.input)} → Output: {t.output ?? "Error"} | Expected: {t.expected} | {t.passed ? "✅ Passed" : "❌ Failed"} | {t.execTimeMs}ms
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-white rounded-xl shadow p-6 mb-6 flex items-center gap-3">
        <FaTrophy className="text-yellow-500 text-2xl" />
        <div>
          <p className="font-semibold">Overall Performance</p>
          <p className="text-sm text-gray-600">Your solution is dynamically analyzed by AI + rules</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">Overall Score</h2>
        <div className="flex items-center gap-4">
          <span className="text-3xl font-bold text-indigo-600">{overallScore}/10</span>
          <div className="w-full bg-gray-200 h-3 rounded">
            <div className="bg-indigo-600 h-3 rounded" style={{ width: `${overallScore * 10}%` }} />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl shadow">
          <FaClock className="text-indigo-500 mb-2" />
          <p>Time Complexity</p>
          <p className="font-bold">{displayFeedback.complexity?.time}</p>
          <p className="text-sm text-gray-500">Best: {displayFeedback.complexity?.bestTime}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow">
          <FaMemory className="text-indigo-500 mb-2" />
          <p>Space Complexity</p>
          <p className="font-bold">{displayFeedback.complexity?.space}</p>
          <p className="text-sm text-gray-500">Best: {displayFeedback.complexity?.bestSpace}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6 h-72 mb-6">
        <h2 className="font-semibold mb-3">Performance Overview</h2>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <Radar dataKey="value" stroke="#4f46e5" fill="#6366f1" fillOpacity={0.6} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-3 mb-4 flex-wrap">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2 rounded-full ${activeTab === tab ? "bg-indigo-600 text-white" : "bg-white hover:bg-indigo-100"}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow mb-6">
        {loading ? <p className="text-center animate-pulse">Analyzing...</p> : <>
          <div className="flex justify-between mb-4">
            <h2 className="font-semibold">{activeTab}</h2>
            <span className="font-bold text-indigo-600">{currentTab.score}/10</span>
          </div>
          <ul className="space-y-3 mb-4">
            {(currentTab.comments || []).map((c, i) => (
              <li key={i} className="flex gap-2 items-center">
                <FaCheckCircle className="text-green-500" /> {c}
              </li>
            ))}
          </ul>
          <h3 className="font-semibold mb-2">Suggestions</h3>
          <ul className="space-y-2">
            {(currentTab.suggestions || []).map((s, i) => (
              <li key={i} className="flex gap-2 items-center">
                <FaLightbulb className="text-yellow-500" /> {s}
              </li>
            ))}
          </ul>
        </>}
      </div>

      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="font-semibold mb-3">📌 Line-by-Line Suggestions</h2>
        {(displayFeedback.lineFeedback || []).map((l, i) => (
          <p key={i} className="text-gray-700">Line {l.line}: {l.message}</p>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="font-semibold mb-3">🎯 Personalized Learning Tips</h2>
        <ul className="list-disc ml-6">
          {(displayFeedback.learningTips || []).map((tip, i) => <li key={i}>{tip}</li>)}
        </ul>
      </div>

      <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded">
        <h2 className="font-semibold mb-2">🧠 AI Summary</h2>
        <p>{displayFeedback.summary}</p>
      </div>
    </div>
  );
};

export default AIFeedback;
