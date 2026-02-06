import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaRobot, FaHome, FaCode, FaChartLine, FaSignOutAlt } from "react-icons/fa";

const DashboardNavbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
  `flex items-center gap-2 px-3 py-1 rounded-lg transition-all duration-300
   ${isActive 
     ? "bg-white/20 text-white shadow-md" 
     : "text-white hover:bg-white/10 hover:scale-105"
   }`;

  return (
    <nav className="w-full sticky top-0 z-50 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <FaRobot className="text-white text-3xl" />
          <h1 className="text-2xl font-bold text-white">Code Mentor</h1>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-8 text-white font-medium">
          <NavLink to="/dashboard" className={linkClass}>
            <FaHome /> Dashboard
          </NavLink>

          <NavLink to="/simulator" className={linkClass}>
            <FaCode /> Simulator
          </NavLink>

          <NavLink to="/skills" className={linkClass}>
           <FaChartLine /> Skills
          </NavLink>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-200 hover:text-red-300"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
