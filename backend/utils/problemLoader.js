import fs from "fs";
import path from "path";

let cachedProblems = null;

export const loadProblems = () => {
  if (cachedProblems) return cachedProblems;

  try {
    const filePath = path.join(process.cwd(), "data", "problems.json");

    if (!fs.existsSync(filePath)) {
      console.error("problems.json not found at:", filePath);
      cachedProblems = [];
      return cachedProblems;
    }

    const data = fs.readFileSync(filePath, "utf-8");
    const problems = JSON.parse(data);

    cachedProblems = problems.filter(p =>
      p._id &&
      p.title &&
      Array.isArray(p.testCases) &&
      p.testCases.every(tc => "input" in tc && "output" in tc)
    );

    if (cachedProblems.length === 0) console.warn("No valid problems found");

    return cachedProblems;

  } catch (err) {
    console.error("Error loading problems.json:", err);
    cachedProblems = [];
    return cachedProblems;
  }
};
