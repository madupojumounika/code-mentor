import React from "react";
import { Link } from "react-router-dom";
import { FaRobot } from "react-icons/fa";

const PublicNavbar = () => {
  return (
    <nav className="w-full sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 shadow-2xl border-b border-white/20">
      
      <div className="w-full px-10 py-6 flex justify-between items-center">

        {/* Logo Section */}
        <div className="flex items-center gap-4 cursor-pointer group transition-all duration-500">
          
          {/* Logo Icon */}
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md group-hover:bg-white/20 transition-all duration-500">
            <FaRobot 
              className="text-white text-4xl transition-all duration-500 
              group-hover:scale-125 
              group-hover:rotate-6 
              group-hover:drop-shadow-[0_0_20px_white]" 
            />
          </div>

          {/* Brand Name */}
          <h1 className="relative text-3xl font-extrabold text-white tracking-wide 
          transition-all duration-500 
          group-hover:text-yellow-200 
          group-hover:drop-shadow-[0_0_20px_white]">
            
            Code Mentor

            <span className="absolute left-0 -bottom-1 w-0 h-1 bg-yellow-300 
            transition-all duration-500 group-hover:w-full rounded-full"></span>
          </h1>
        </div>

        {/* Right Side Buttons */}
        <div className="flex items-center gap-6">

          {/* Home Button */}
          <a
            href="#home"
            className="relative px-6 py-2.5 text-xl font-semibold tracking-wide
            text-white rounded-xl border border-white/40
            backdrop-blur-md
            transition-all duration-500
            hover:scale-110
            hover:text-yellow-300
            hover:border-yellow-300
            hover:shadow-[0_0_20px_#ffffff]
            hover:bg-white/10"
          >
            Home
          </a>

          {/* About Button */}
          <a
            href="#about"
            className="relative px-6 py-2.5 text-xl font-semibold tracking-wide
            text-white rounded-xl border border-white/40
            backdrop-blur-md
            transition-all duration-500
            hover:scale-110
            hover:text-yellow-300
            hover:border-yellow-300
            hover:shadow-[0_0_20px_#ffffff]
            hover:bg-white/10"
          >
            About
          </a>

          {/* Login Button */}
          <Link
            to="/login"
            className="relative px-6 py-2.5 text-xl font-semibold tracking-wide
            text-white rounded-xl border border-white/40
            backdrop-blur-md
            transition-all duration-500
            hover:scale-110
            hover:text-yellow-300
            hover:border-yellow-300
            hover:shadow-[0_0_20px_#ffffff]
            hover:bg-white/10"
          >
            Login
          </Link>

          {/* Get Started Button */}
          <Link
            to="/register"
            className="relative px-7 py-3 font-bold text-white rounded-xl 
            bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 
            shadow-lg transition-all duration-500 
            hover:scale-110 hover:shadow-[0_0_25px_white] 
            overflow-hidden"
          >
            <span className="relative z-10">Get Started</span>

            <span className="absolute inset-0 bg-white opacity-0 
            hover:opacity-20 transition duration-500"></span>
          </Link>

        </div>

      </div>
    </nav>
  );
};

export default PublicNavbar;
