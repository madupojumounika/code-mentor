import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import api from "../api/axios";

const SkillProgress = () => {
  const [skillProgressData, setSkillProgressData] = useState([]);
  const [weakAreasData, setWeakAreasData] = useState([]);
  const [practiceRecommendations, setPracticeRecommendations] = useState([]);

  useEffect(() => {
    api
      .get("/dashboard")
      .then((res) => {
        const data = res.data;

        // Average score
        const patterns = data.skills || {};
        const chartData = [];
        Object.entries(patterns).forEach(([pattern, scores]) => {
          scores.forEach((s) => {
            chartData.push({
              day: s.date.split("T")[0], 
              pattern,
              score: s.score,
            });
          });
        });
        setSkillProgressData(chartData);

        // Weak Areas for Bar Chart
        const weakData = data.weakAreas.map((area) => ({ area, count: 1 })); // count placeholder
        setWeakAreasData(weakData);

        // Practice Recommendations
        setPracticeRecommendations(data.practiceRecommendations || []);
      })
      .catch((err) => console.log("Dashboard API not ready, showing demo data."));
  }, []);

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-100">
      <motion.h1
        className="text-3xl md:text-4xl font-bold mb-10 text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Skill Dashboard
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Skill Progress*/}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-xl font-semibold mb-4">Skill Progress</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={skillProgressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
        
              {Array.from(new Set(skillProgressData.map(d => d.pattern))).map((pattern, idx) => (
                <Line
                  key={idx}
                  type="monotone"
                  dataKey={(d) => (d.pattern === pattern ? d.score : null)}
                  name={pattern}
                  stroke={`hsl(${idx * 60}, 70%, 50%)`}
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  isAnimationActive
                  animationDuration={1000}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Weak Areas*/}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-xl font-semibold mb-4">Weak Areas</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weakAreasData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="area" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="count"
                fill="#EF4444"
                radius={[5, 5, 0, 0]}
                isAnimationActive
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Practice Recommendations */}
      <motion.div
        className="mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-xl font-semibold mb-4">Practice Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {practiceRecommendations.map((item, idx) => (
            <motion.div
              key={idx}
              className="bg-white rounded-2xl shadow-xl p-6 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              whileHover={{ scale: 1.03 }}
            >
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-600 mb-4">{item.description}</p>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-full shadow hover:scale-105 transition">
                Start Practice
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SkillProgress;
