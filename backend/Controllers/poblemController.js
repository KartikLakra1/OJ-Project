import Problem from "../Models/Problem.model.js";
import User from "../Models/auth.models.js";

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
    const {sub: userId} = req.auth;
    const { title, description, difficulty, constraints, sampleTestcases } = req.body;

    const user = await User.findOne({clerkId: userId});
    if(!user || user.role !== "admin"){
      return res.status(403).json({
        error : "Access denied: Admin only"
      })
    }

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

export const getAproblem = async (req,res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ error: "Problem not found" });
    res.json(problem);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};


