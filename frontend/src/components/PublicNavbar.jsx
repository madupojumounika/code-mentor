import React from "react";
import { Link } from "react-router-dom";
import { FaRobot } from "react-icons/fa";

const PublicNavbar = () => {
  return (
    <nav className="w-full sticky top-0 z-50 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
      
        <div className="flex items-center gap-3">
          {/* Logo */}
          <FaRobot className="text-white text-3xl animate-bounce-slow" />
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-white">
            Code Mentor
          </h1>
        </div>

        {/* Navigation links */}
        <div className="flex items-center gap-6">
          <Link
            to="/login"
            className="text-white font-medium hover:text-gray-200 transition"
          >
            Login
          </Link>

          {/* Get started button */}
          <Link
            to="/register"
            className="bg-white text-indigo-600 px-5 py-2 rounded-lg font-semibold shadow hover:scale-105 transition transform"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
