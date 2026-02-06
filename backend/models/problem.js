import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
  {
    title: String,
    category: String,
    difficulty: String,
    description: String,
    starterCode: Object,
    pattern: String,
    testCases: Array,
  },
  { timestamps: true }
);

let Problem;
try {
  Problem = mongoose.model("Problem");
} catch (err) {
  Problem = mongoose.model("Problem", problemSchema);
}

export default Problem;
