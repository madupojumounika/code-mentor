import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import api from "../api/axios"; 
import {
  FaCheckCircle,
  FaBolt,
  FaExclamationTriangle,
  FaLightbulb,
} from "react-icons/fa";
import DashboardCard from "../components/DashboardCard";

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/dashboard")
      .then((res) => setDashboardData(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg animate-pulse">
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
      color: "text-green-500",
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
      color: "text-red-500",
    },
  ];

  const recentActivity = dashboardData?.recentActivity || [];
  const upcomingChallenges = dashboardData?.upcomingChallenges || [];
  const skills = dashboardData?.skills || [];
  const practiceRecommendations = dashboardData?.practiceRecommendations || [];

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-100">
      <motion.h1
        className="text-3xl md:text-4xl font-bold mb-10 text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Welcome, {user?.name || "User"} 👋
      </motion.h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <DashboardCard
            key={idx}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Weak Areas Badges */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold mb-3">Weak Areas</h3>
        <div className="flex flex-wrap gap-2">
          {dashboardData?.weakAreas?.length > 0 ? (
            dashboardData.weakAreas.map((area, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
              >
                {area}
              </span>
            ))
          ) : (
            <span className="text-gray-500">None</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Recent Activity */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <ul className="space-y-3 text-gray-700">
            {recentActivity.length > 0 ? (
              recentActivity.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  {item}
                </li>
              ))
            ) : (
              <li className="text-gray-500">No recent activity</li>
            )}
          </ul>
        </motion.div>

        {/* Upcoming Challenges */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h3 className="text-lg font-semibold mb-4">Upcoming Challenges</h3>
          <ul className="space-y-3 text-gray-700">
            {upcomingChallenges.length > 0 ? (
              upcomingChallenges.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <FaBolt className="text-yellow-400" />
                  {item}
                </li>
              ))
            ) : (
              <li className="text-gray-500">No upcoming challenges</li>
            )}
          </ul>
        </motion.div>
      </div>

      {/* Skills */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold mb-3">Skills</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.length > 0 ? (
            skills.map((skill, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-xl p-4 flex flex-col items-center"
              >
                <FaLightbulb className="text-yellow-400 mb-2" />
                <p className="font-semibold">{skill.name}</p>
                <p>{skill.score}%</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No skill data available</p>
          )}
        </div>
      </div>

      {/* Practice Recommendations */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold mb-3">Practice Recommendations</h3>
        <ul className="space-y-3">
          {practiceRecommendations.length > 0 ? (
            practiceRecommendations.map((rec, idx) => (
              <li
                key={idx}
                className="bg-white rounded-2xl shadow-xl p-4 flex flex-col"
              >
                <p className="font-semibold">{rec.title}</p>
                <p className="text-gray-600">{rec.description}</p>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No recommendations yet</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
