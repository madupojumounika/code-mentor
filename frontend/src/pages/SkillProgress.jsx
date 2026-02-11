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
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import api from "../api/axios";

const colors = [
  "#6366F1",
  "#F59E0B",
  "#EF4444",
  "#10B981",
  "#8B5CF6",
  "#EC4899",
  "#3B82F6",
  "#FBBF24",
];

const SkillProgress = () => {
  const [skillProgressData, setSkillProgressData] = useState([]);
  const [weakAreasData, setWeakAreasData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [skills, setSkills] = useState([]);
  const [activeSkills, setActiveSkills] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   api
    .get("/dashboard")
    .then((res) => {
      const data = res.data;
      const chartData = [];
      const skillsActiveState = {};
      const weakData = [];
      const pieChart = [];

      (data.skills || []).forEach((skill, idx) => {
        skillsActiveState[skill.name] = true;

        if (skill.history && skill.history.length) {
          skill.history.forEach((h) => {
            chartData.push({
              day: h.date.split("T")[0],
              pattern: skill.name,
              score: h.score,
            });
          });
        } else {
          chartData.push({
            day: new Date().toISOString().split("T")[0],
            pattern: skill.name,
            score: skill.score,
          });
        }

        pieChart.push({
          name: skill.name,
          value: skill.score,
          color: colors[idx % colors.length],
        });

        if (skill.score < 70) {
          weakData.push({ area: skill.name, count: 1, color: "#EF4444" });
        }
      });

      (data.weakAreas || []).forEach((area, idx) => {
        if (!weakData.some((w) => w.area === area)) {
          weakData.push({ area, count: 1, color: "#EF4444" });
        }
      });

      setSkillProgressData(chartData);
      setWeakAreasData(weakData);
      setPieData(pieChart);
      setSkills(data.skills || []);
      setActiveSkills(skillsActiveState);
    })
    .catch(() => {})
    .finally(() => setLoading(false));
   }, []);
 
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black">
        <p className="text-gray-500 dark:text-gray-400 animate-pulse">
          Loading Skill Dashboard...
        </p>
      </div>
    );

  const neonCard =
    "relative rounded-3xl p-[1px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500";
  const neonInner =
    "relative rounded-3xl p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 shadow-xl transition-all duration-300";

  const patterns = Array.from(new Set(skillProgressData.map((d) => d.pattern)));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-white/20 text-gray-900 dark:text-white">
          {payload.map((p, idx) => (
            <div key={idx}>
              <span className="font-semibold">{p.name}</span>: {p.value}%
              <div className="text-sm text-gray-500 dark:text-gray-300">
                {p.payload.day}
              </div>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-100 dark:bg-gray-900 transition-colors duration-500">
      <motion.h1
        className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Skill Dashboard
      </motion.h1>

      <div className="mb-6 flex flex-wrap gap-3">
        {patterns.map((pattern, idx) => (
          <button
            key={idx}
            onClick={() =>
              setActiveSkills((prev) => ({
                ...prev,
                [pattern]: !prev[pattern],
              }))
            }
            className={`px-4 py-2 rounded-full font-semibold transition ${
              activeSkills[pattern]
                ? "bg-indigo-600 text-white"
                : "bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
            }`}
          >
            {pattern}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <motion.div className={neonCard}>
          <div className={neonInner}>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Skill Progress
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={skillProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                {patterns.map((pattern, idx) =>
                  activeSkills[pattern] ? (
                    <Line
                      key={idx}
                      type="monotone"
                      dataKey={(d) =>
                        d.pattern === pattern ? d.score : null
                      }
                      name={pattern}
                      stroke={colors[idx % colors.length]}
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                  ) : null
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div className={neonCard}>
          <div className={neonInner}>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Weak Areas
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weakAreasData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="area" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" radius={[5, 5, 0, 0]}>
                  {weakAreasData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.div className={neonCard}>
        <div className={neonInner}>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Skill Accuracy Distribution
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Legend verticalAlign="top" />
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div className="mt-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Skill Progress Bars
        </h2>
        <div className="space-y-4">
          {skills.map((skill, idx) => (
            <div key={idx}>
              <p className="font-semibold text-gray-900 dark:text-white mb-1">
                {skill.name} ({skill.score}%)
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.score}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="h-4 rounded-full"
                  style={{
                    backgroundColor: skill.score < 70 ? "#EF4444" : colors[idx % colors.length],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SkillProgress;
