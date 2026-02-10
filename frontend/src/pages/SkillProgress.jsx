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
import { FaMoon, FaSun } from "react-icons/fa";
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
  const [practiceRecommendations, setPracticeRecommendations] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeSkills, setActiveSkills] = useState({});
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  useEffect(() => {
    api
      .get("/dashboard")
      .then((res) => {
        const data = res.data;
        const chartData = [];
        const skillsActiveState = {};
        const weakData = [];
        const pieChart = [];
        const skillsArr = [];

        (data.skills || []).forEach((skill, idx) => {
          skillsActiveState[skill.name] = true;
          skillsArr.push(skill);
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
        });

        (data.weakAreas || []).forEach((area, idx) => {
          weakData.push({ area, count: 1, color: colors[idx % colors.length] });
        });

        setSkillProgressData(chartData);
        setWeakAreasData(weakData);
        setPieData(pieChart);
        setPracticeRecommendations(data.practiceRecommendations || []);
        setActiveSkills(skillsActiveState);
        setSkills(skillsArr);
      })
      .catch((err) =>
        console.log("Dashboard API not ready, showing demo data.", err)
      )
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
    "relative rounded-3xl p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 shadow-xl dark:shadow-[0_0_30px_rgba(99,102,241,0.25)] hover:shadow-[0_0_60px_rgba(168,85,247,0.35)] transition-all duration-300";

  const patterns = Array.from(new Set(skillProgressData.map((d) => d.pattern)));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-white/20 text-gray-900 dark:text-white">
          {payload.map((p, idx) => (
            <div key={idx} className="mb-1">
              <span className="font-semibold">{p.name}</span>: {p.value}%
              <br />
              <span className="text-sm text-gray-500 dark:text-gray-300">
                Date: {p.payload.day}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-100 dark:bg-gray-900 transition-colors duration-500">
      <div className="flex justify-between items-center mb-10">
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Skill Dashboard
        </motion.h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-12 h-12 rounded-full flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 shadow-lg hover:scale-110 transition"
        >
          {darkMode ? (
            <FaSun className="text-yellow-400 text-lg" />
          ) : (
            <FaMoon className="text-indigo-700 text-lg" />
          )}
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        {patterns.map((pattern, idx) => (
          <button
            key={idx}
            onClick={() =>
              setActiveSkills((prev) => ({ ...prev, [pattern]: !prev[pattern] }))
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
                      dataKey={(d) => (d.pattern === pattern ? d.score : null)}
                      name={pattern}
                      stroke={colors[idx % colors.length]}
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      isAnimationActive
                      animationDuration={1000}
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
                    <Cell key={`cell-${index}`} fill={entry.color} />
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
                fill="#8884d8"
                label
                isAnimationActive
                animationDuration={1500}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
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
                  className={`h-4 rounded-full`}
                  style={{ backgroundColor: colors[idx % colors.length] }}
                ></motion.div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="mb-10 mt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Practice Recommendations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {practiceRecommendations.length ? (
            practiceRecommendations.map((item, idx) => (
              <motion.div
                key={idx}
                className={neonCard}
                whileHover={{ scale: 1.03 }}
              >
                <div className={neonInner}>
                  <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {item.description}
                  </p>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-full shadow hover:scale-105 transition mt-4">
                    Start Practice
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-400">No recommendations yet</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SkillProgress;
