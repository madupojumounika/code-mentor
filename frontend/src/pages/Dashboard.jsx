import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import api from "../api/axios";
import {
  FaCheckCircle,
  FaBolt,
  FaExclamationTriangle,
  FaLightbulb,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import DashboardCard from "../components/DashboardCard";

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  useEffect(() => {
    api
      .get("/dashboard")
      .then((res) => setDashboardData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black">
        <p className="text-gray-500 dark:text-gray-400 animate-pulse">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  const stats = [
    {
      title: "Problems Solved",
      value: dashboardData?.problemsSolved ?? 0,
      icon: FaCheckCircle,
      color: "text-green-400",
    },
    {
      title: "Average Score",
      value: dashboardData ? `${dashboardData.avgScore}%` : "0%",
      icon: FaBolt,
      color: "text-yellow-400",
    },
    {
      title: "Weak Areas",
      value:
        dashboardData?.weakAreas?.length > 0
          ? dashboardData.weakAreas.join(", ")
          : "None",
      icon: FaExclamationTriangle,
      color: "text-red-400",
    },
  ];

  const recentActivity = dashboardData?.recentActivity || [];
  const upcomingChallenges = dashboardData?.upcomingChallenges || [];
  const skills = dashboardData?.skills || [];
  const practiceRecommendations =
    dashboardData?.practiceRecommendations || [];

  const neonCard =
    "relative rounded-3xl p-[1px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500";

  const neonInner =
    "relative rounded-3xl p-6 bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-white/10 shadow-xl dark:shadow-[0_0_30px_rgba(99,102,241,0.25)] hover:shadow-[0_0_60px_rgba(168,85,247,0.45)] transition-all duration-300";

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-indigo-100 via-white to-purple-100 dark:from-black dark:via-gray-950 dark:to-gray-900 transition-colors duration-500">
      <div className="flex justify-between items-center mb-14">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white"
        >
          Welcome,{" "}
          <span className="text-indigo-600 dark:text-indigo-400">
            {user?.name || "User"}
          </span>{" "}
          👋
        </motion.h1>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-12 h-12 rounded-full flex items-center justify-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 shadow-lg hover:scale-110 transition"
        >
          {darkMode ? (
            <FaSun className="text-yellow-400 text-lg" />
          ) : (
            <FaMoon className="text-indigo-700 text-lg" />
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {stats.map((stat, idx) => (
          <div key={idx} className={neonCard}>
            <div className={neonInner}>
              <DashboardCard
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          className={neonCard}
        >
          <div className={neonInner}>
            <h3 className="text-xl font-bold mb-5 text-gray-900 dark:text-white">
              📌 Recent Activity
            </h3>
            <ul className="space-y-4 text-gray-700 dark:text-gray-300">
              {recentActivity.length ? (
                recentActivity.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-green-500/20 flex items-center justify-center">
                      <FaCheckCircle className="text-green-400" />
                    </div>
                    {item}
                  </li>
                ))
              ) : (
                <li className="text-gray-400">No recent activity</li>
              )}
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          className={neonCard}
        >
          <div className={neonInner}>
            <h3 className="text-xl font-bold mb-5 text-gray-900 dark:text-white">
              🚀 Upcoming Challenges
            </h3>
            <ul className="space-y-4 text-gray-700 dark:text-gray-300">
              {upcomingChallenges.length ? (
                upcomingChallenges.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                      <FaBolt className="text-yellow-400" />
                    </div>
                    {item}
                  </li>
                ))
              ) : (
                <li className="text-gray-400">No upcoming challenges</li>
              )}
            </ul>
          </div>
        </motion.div>
      </div>

      <div className="mb-16">
        <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
          💡 Skills
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.length ? (
            skills.map((skill, idx) => (
              <div key={idx} className={neonCard}>
                <div className={neonInner}>
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-3">
                    <FaLightbulb className="text-indigo-400 text-lg" />
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {skill.name}
                  </p>
                  <p className="text-indigo-600 dark:text-indigo-400 font-bold">
                    {skill.score}%
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No skills data</p>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
          📚 Practice Recommendations
        </h3>
        <div className="space-y-6">
          {practiceRecommendations.length ? (
            practiceRecommendations.map((rec, idx) => (
              <div key={idx} className={neonCard}>
                <div className={neonInner}>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {rec.title}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    {rec.description}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No recommendations yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
