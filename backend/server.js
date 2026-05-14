import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dashboardRoutes from "./routes/dashboard.js";
import simulatorRoutes from "./routes/simulatorRoutes.js";
import problemRoutes from "./routes/problemRoutes.js";
import aiFeedbackRoutes from "./routes/feedbackRoutes.js";
const app = express();

// CORS
app.use(
cors({
  origin: [
    "http://localhost:3000",
    "https://code-mentor-roan.vercel.app",
  ],
  credentials: true,
})
);

// JSON middleware
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/simulator", simulatorRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/ai-feedback", aiFeedbackRoutes);

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is running!" });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
