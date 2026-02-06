import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import api from "../api/axios"; 

const tabs = ["Efficiency", "Code Readability", "Edge Cases"];

const demoFeedback = {
  Efficiency: [
    "Optimized loops and recursion",
    "Minimal space complexity",
    "Avoided redundant calculations",
  ],
  "Code Readability": [
    "Clear variable names",
    "Proper indentation",
    "Modular function design",
  ],
  "Edge Cases": [
    "Handled empty input",
    "Checked for null/undefined",
    "Validated user input",
  ],
};

const AIFeedback = ({ submissionId = null }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(!!submissionId);

  useEffect(() => {
    if (submissionId) {
      setLoading(true);
      api
        .get(`/ai-feedback/${submissionId}`)
        .then((res) => {
          setFeedback(res.data);
        })
        .catch((err) => {
          console.error("Failed to fetch AI feedback:", err);
          setFeedback(null);
        })
        .finally(() => setLoading(false));
    }
  }, [submissionId]);

  const renderData = feedback || demoFeedback;

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-100">
      {/* Header */}
      <motion.h1
        className="text-3xl md:text-4xl font-bold mb-10 text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        AI Feedback Engine
      </motion.h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-full font-medium transition ${
              activeTab === tab
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-indigo-100"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        className="bg-white rounded-2xl shadow-xl p-6 min-h-[200px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {loading ? (
          <p className="text-gray-500 text-center animate-pulse">
            Loading AI Feedback...
          </p>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">{activeTab} Feedback</h2>
            <ul className="space-y-3 text-gray-700">
              {renderData[activeTab]?.map((item, idx) => (
                <motion.li
                  key={idx}
                  className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <FaCheckCircle className="text-green-500" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default AIFeedback;
