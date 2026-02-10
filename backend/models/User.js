import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    problemsSolved: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 },
    avgScore: { type: Number, default: 0 },

    skills: [
      {
        name: String,
        score: Number,
      },
    ],

    recentActivity: [String],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
