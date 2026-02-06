import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Card from "../components/Card";
import Button from "../components/Button";
import { FaCode, FaRobot, FaChartLine } from "react-icons/fa";
import { motion } from "framer-motion";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const cards = [
    {
      title: "Coding Simulator",
      description: "Practice coding problems with real-time evaluation.",
      link: "/simulator",
      icon: <FaCode className="w-8 h-8 text-white" />,
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      title: "AI Feedback Engine",
      description: "Get automated tips, time & space complexity analysis.",
      link: "/feedback",
      icon: <FaRobot className="w-8 h-8 text-white" />,
      gradient: "from-pink-500 to-red-500",
    },
    {
      title: "Learning Tracker",
      description: "Track your progress and identify weak areas.",
      link: "/skills",
      icon: <FaChartLine className="w-8 h-8 text-white" />,
      gradient: "from-green-400 to-teal-500",
    },
  ];

  const handleCardClick = (link) => {
    if (!user) navigate("/login");
    else navigate(link);
  };

  const handleStart = () => {
    if (user) navigate("/dashboard");
    else navigate("/login");
  };

  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.25 } },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-500 px-6 py-16">
      <h1 className="text-white text-4xl md:text-5xl font-bold text-center mb-12">
        AI-Powered Code Interview Coach
      </h1>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 w-full max-w-6xl mb-20"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {cards.map((card, idx) => (
          <motion.div key={idx} variants={item}>
            <Card
              title={card.title}
              description={card.description}
              icon={card.icon}
              gradient={card.gradient}
              onClick={() => handleCardClick(card.link)}
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.div whileHover={{ scale: 1.05 }}>
        <Button className="px-12 py-4 text-lg" onClick={handleStart}>
          Start Your Practice
        </Button>
      </motion.div>
    </div>
  );
};

export default Home;
