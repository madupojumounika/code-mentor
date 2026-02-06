import { loadProblems } from "../utils/problemLoader.js";
export const getAllProblems = (req, res) => {
  try {
    const problems = loadProblems();
    if (!problems.length)
      return res.status(404).json({ error: "No problems found" });

    res.json(problems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getProblemById = (req, res) => {
  try {
    const problems = loadProblems();
    const idOrTitle = req.params.id;

    const problem = problems.find(
      p =>
        String(p._id) === String(idOrTitle) ||
        String(p.id) === String(idOrTitle) ||
        p.title === idOrTitle
    );

    if (!problem)
      return res.status(404).json({ error: "Problem not found" });

    res.json(problem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
