import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useState, useRef, useEffect } from "react";
import {
  FaRobot,
  FaHome,
  FaCode,
  FaChartLine,
  FaMoon,
  FaSun,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const DashboardNavbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [openProfile, setOpenProfile] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg transition whitespace-nowrap
     ${
       isActive
         ? "bg-white/20 text-white"
         : "text-white/90 hover:bg-white/10"
     }`;

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav
      className="
      w-full sticky top-0 z-50
      bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500
      dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
      shadow-lg
    "
    >
      <div className="w-full px-6 py-4 flex justify-between items-center">

        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <FaRobot className="text-white text-3xl" />
          <h1 className="text-2xl font-bold text-white whitespace-nowrap">
            Code Mentor
          </h1>
        </div>

        <div className="flex items-center gap-6">

          <div className="hidden md:flex items-center gap-6 text-white font-medium">
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
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition text-white"
          >
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </button>

          {user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpenProfile(!openProfile)}
                className="relative"
              >

                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="profile"
                    className="w-9 h-9 rounded-full object-cover border-2 border-white"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-white text-indigo-600 flex items-center justify-center font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}

                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
              </button>

              {openProfile && (
                <div
                  className="
                  absolute right-0 mt-3 w-56
                  bg-white dark:bg-gray-800
                  rounded-xl shadow-lg
                  text-gray-800 dark:text-white
                  p-4
                "
                >
                  <div className="border-b pb-2 mb-3">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      navigate("/dashboard");
                      setOpenProfile(false);
                    }}
                    className="block w-full text-left px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Dashboard
                  </button>

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-2 py-2 mt-2 rounded text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {mobileMenu && (
        <div className="md:hidden px-6 pb-4 space-y-3 text-white font-medium">
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
        </div>
      )}
    </nav>
  );
};

export default DashboardNavbar;