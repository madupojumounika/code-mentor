import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  FaRobot,
  FaHome,
  FaCode,
  FaChartLine,
  FaSignOutAlt,
  FaMoon,
  FaSun,
} from "react-icons/fa";

const DashboardNavbar = () => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-1 rounded-lg transition
     ${
       isActive
         ? "bg-white/20 text-white"
         : "text-white/90 hover:bg-white/10"
     }`;

  return (
    <nav className="
      w-full sticky top-0 z-50
      bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500
      dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
      shadow-lg transition-colors
    ">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <FaRobot className="text-white text-3xl" />
          <h1 className="text-2xl font-bold text-white">Code Mentor</h1>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-white font-medium">
          <NavLink to="/" className={linkClass}>
            <FaHome /> Home
          </NavLink>

          <NavLink to="/dashboard" className={linkClass}>
            <FaHome /> Dashboard
          </NavLink>

          <NavLink to="/simulator" className={linkClass}>
            <FaCode /> Simulator
          </NavLink>

          <NavLink to="/skills" className={linkClass}>
            <FaChartLine /> Skills
          </NavLink>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
          >
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </button>

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
