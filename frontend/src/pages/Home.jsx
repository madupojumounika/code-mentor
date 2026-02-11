import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Card from "../components/Card";
import Button from "../components/Button";
import { FaCode, FaRobot, FaChartLine } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import Tilt from "react-parallax-tilt";
import Lottie from "lottie-react";
import aiRobot from "../assets/ai-robot.json";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [text] = useTypewriter({
    words: [
      "Crack Coding Interviews",
      "Practice with AI Feedback",
      "Track Your Progress Smartly",
    ],
    loop: true,
    delaySpeed: 2000,
  });

  const cards = [
    {
      title: "Coding Simulator",
      description: "Solve real interview problems with live code execution.",
      link: "/simulator",
      icon: <FaCode className="w-9 h-9 text-white" />,
      gradient: "from-indigo-500 to-purple-600",
    },
    {
      title: "AI Feedback Engine",
      description: "Get instant AI suggestions, optimizations & complexity.",
      link: "/feedback",
      icon: <FaRobot className="w-9 h-9 text-white" />,
      gradient: "from-pink-500 to-rose-600",
    },
    {
      title: "Learning Tracker",
      description: "Visual dashboards to monitor strengths & weaknesses.",
      link: "/skills",
      icon: <FaChartLine className="w-9 h-9 text-white" />,
      gradient: "from-emerald-400 to-teal-600",
    },
  ];

  const handleNavigate = (link) => {
    if (!user) navigate("/login");
    else navigate(link);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 px-6 py-20">

      {/* Background Blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-400 opacity-30 rounded-full blur-3xl" />
      <div className="absolute top-40 -right-32 w-96 h-96 bg-indigo-400 opacity-30 rounded-full blur-3xl" />

      {/* Hero Section */}
      <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-white text-4xl md:text-6xl font-extrabold leading-tight">
            {text}
            <Cursor cursorStyle="|" />
          </h1>

          <p className="mt-6 text-lg text-white/90">
            AI-powered interview preparation platform to help you practice,
            improve, and succeed 🚀
          </p>

          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="mt-10"
          >
            <Button
              className="px-14 py-4 text-lg shadow-2xl"
              onClick={() =>
                user ? navigate("/dashboard") : navigate("/login")
              }
            >
              Start Practicing Now 🔥
            </Button>
          </motion.div>
        </motion.div>

        {/* Lottie Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Lottie animationData={aiRobot} loop className="w-full max-w-md mx-auto" />
        </motion.div>
      </div>

      {/* Cards Section */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 mt-28 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto"
      >
        {cards.map((card, idx) => (
          <Tilt
            key={idx}
            tiltMaxAngleX={15}
            tiltMaxAngleY={15}
            perspective={1200}
            glareEnable
            glareMaxOpacity={0.25}
          >
            <motion.div whileHover={{ scale: 1.05 }}>
              <Card
                title={card.title}
                description={card.description}
                icon={card.icon}
                gradient={card.gradient}
                onClick={() => handleNavigate(card.link)}
                className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl"
              />
            </motion.div>
          </Tilt>
        ))}
      </motion.div>
    </div>
  );
};

export default Home;
