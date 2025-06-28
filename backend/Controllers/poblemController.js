import Problem from "../Models/Problem.model.js";

// GET all problems
export const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find().select("title difficulty");
    res.json(problems);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch problems" });
  }
};

// POST new problem (admin only)
export const addProblem = async (req, res) => {
  try {
    const { title, description, difficulty, constraints, sampleTestcases } = req.body;
    const newProblem = new Problem({
      title,
      description,
      difficulty,
      constraints,
      sampleTestcases,
      createdBy: req.auth.userId // Clerk sets this from JWT
    });
    await newProblem.save();
    res.status(201).json({ message: "Problem added", problem: newProblem });
  } catch (err) {
    res.status(400).json({ error: "Failed to create problem", details: err.message });
  }
};

