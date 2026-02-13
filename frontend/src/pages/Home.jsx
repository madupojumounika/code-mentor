import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Card from "../components/Card";
import Button from "../components/Button";
import { FaCode, FaRobot, FaChartLine, FaComments } from "react-icons/fa";
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
      <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center min-h-[80vh]">

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

      {/* Why choose us */}
      <section className="relative z-10 mt-40 max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-5xl font-extrabold text-white mb-6">
          Why Choose Code Mentor?
        </h2>
        <p className="text-white/80 text-lg max-w-3xl mx-auto mb-20">
          Everything you need to crack coding interviews in one powerful AI-driven platform.
        </p>

        <div className="grid md:grid-cols-4 gap-10">
          <div className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl border border-white/20 shadow-2xl hover:scale-105 transition duration-300">
            <div className="text-4xl mb-4">💼</div>
            <h3 className="text-2xl font-semibold text-white mb-4">
              Real Interview Problems
            </h3>
            <p className="text-white/80 text-lg">
              Practice curated problems asked in top tech companies.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl border border-white/20 shadow-2xl hover:scale-105 transition duration-300">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-2xl font-semibold text-white mb-4">
              AI Code Analysis
            </h3>
            <p className="text-white/80 text-lg">
              Get instant feedback, optimizations & time complexity analysis.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl border border-white/20 shadow-2xl hover:scale-105 transition duration-300">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-2xl font-semibold text-white mb-4">
              Smart Progress Tracking
            </h3>
            <p className="text-white/80 text-lg">
              Visual dashboards to measure your improvement.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl border border-white/20 shadow-2xl hover:scale-105 transition duration-300">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-2xl font-semibold text-white mb-4">
              Fast & Interactive UI
            </h3>
            <p className="text-white/80 text-lg">
              Smooth experience with modern design and real-time responses.
            </p>
          </div>
        </div>
      </section>
      
      {/* About */}
      <section
        id="about"
        className="relative z-10 mt-44 max-w-7xl mx-auto px-6 text-center"
      >
        <h2 className="text-5xl font-extrabold text-white mb-6">
          About Code Mentor
        </h2>

        <p className="text-white/80 text-lg max-w-4xl mx-auto mb-16 leading-relaxed">
          Code Mentor is an AI-powered coding interview preparation platform
          designed to help students and developers master problem solving,
          improve logical thinking, and confidently crack technical interviews.
          Our mission is to make interview preparation smart, structured, and
          accessible to everyone.
        </p>

        <div className="grid md:grid-cols-2 gap-12 mb-24">
          <div className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl border border-white/20 shadow-2xl hover:scale-105 transition duration-300 text-left">
            <h3 className="text-3xl font-bold text-yellow-300 mb-6">
              🚀 Our Mission
            </h3>
            <p className="text-white/80 text-lg leading-relaxed">
              To empower every learner with AI-driven feedback, real interview
              problems, and structured learning paths.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl border border-white/20 shadow-2xl hover:scale-105 transition duration-300 text-left">
            <h3 className="text-3xl font-bold text-pink-300 mb-6">
              🎯 Our Vision
            </h3>
            <p className="text-white/80 text-lg leading-relaxed">
              To become the most trusted AI-based coding mentor for interview success.
            </p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="relative z-10 mt-40 text-center max-w-7xl mx-auto px-6">
        <h2 className="text-5xl font-extrabold text-white mb-16">Platform Impact</h2>
        <div className="grid md:grid-cols-4 gap-10">
          {[
            { number: "10K+", label: "Active Users" },
            { number: "50K+", label: "Problems Solved" },
            { number: "95%", label: "Success Rate" },
            { number: "24/7", label: "AI Assistance" },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl border border-white/20 shadow-2xl"
            >
              <h3 className="text-4xl font-bold text-yellow-300 mb-4">{item.number}</h3>
              <p className="text-white/80 text-lg">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Features*/}
      <section className="relative z-10 mt-40 max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-5xl font-extrabold text-white mb-6">
          Upcoming Features
        </h2>
        <p className="text-white/80 text-lg max-w-3xl mx-auto mb-20">
          We are continuously improving Code Mentor with new AI-driven tools to enhance your coding journey.
        </p>

        <div className="grid md:grid-cols-3 gap-10">
          <div className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl border border-white/20 shadow-2xl hover:scale-105 transition duration-300">
            <div className="text-4xl mb-4">🧠</div>
            <h3 className="text-2xl font-semibold text-white mb-4">Mock Interview Mode</h3>
            <p className="text-white/80 text-lg">Simulate real-time coding interviews with AI interviewer feedback.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl border border-white/20 shadow-2xl hover:scale-105 transition duration-300">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-2xl font-semibold text-white mb-4">Leaderboard System</h3>
            <p className="text-white/80 text-lg">Compete with peers and track your global ranking.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl border border-white/20 shadow-2xl hover:scale-105 transition duration-300">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-2xl font-semibold text-white mb-4">Personalized Learning Paths</h3>
            <p className="text-white/80 text-lg">AI suggests topics based on your strengths & weaknesses.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 mt-44 py-12 border-t border-white/20 text-center text-white/70">
        <p className="text-lg">
          © {new Date().getFullYear()} Code Mentor. All rights reserved.
        </p>
        <p className="mt-3 text-white/60">
          Helping students ace coding interviews with AI-driven practice.
        </p>
      </footer>

      <div
        onClick={() => navigate("/feedback")}
        className="fixed bottom-8 right-8 bg-yellow-400 hover:bg-yellow-500 text-black p-5 rounded-full shadow-2xl cursor-pointer transition duration-300 z-50"
      >
        <FaComments size={24} />
      </div>

    </div>
  );
};

export default Home;
