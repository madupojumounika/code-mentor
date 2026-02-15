import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser({ email, password });

      login(data.token, {
        _id: data.userId,
        name: data.name,
        email: data.email,
      });

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6">
      <form
        onSubmit={handleLogin}
        className="bg-white/80 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-full max-w-md transition-all duration-300 hover:shadow-purple-300/40"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Welcome Back 👋
        </h2>

        <div className="relative mb-5">
          <FaEnvelope className="absolute left-3 top-4 text-gray-400" />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-200"
            required
          />
        </div>

        <div className="relative mb-6">
          <FaLock className="absolute left-3 top-4 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-200"
            required
          />
          <div
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-4 cursor-pointer text-gray-400 hover:text-purple-500 transition"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={loading}
            className="w-40 transition duration-300 hover:scale-105"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </div>

        <p className="text-sm text-gray-500 text-center mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-purple-600 font-semibold cursor-pointer hover:underline hover:text-purple-800 transition"
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
