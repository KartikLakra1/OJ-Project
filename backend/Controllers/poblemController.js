import Problem from "../Models/Problem.model.js";
import User from "../Models/auth.models.js";


/* ────────────────────────────── GET all problems ────────────────────────────── */
export const getAllProblems = async (req, res) => {
  try {
    // Get current logged-in user's Clerk ID
    const { sub: userId } = req.auth;

    // Fetch all problems (title and difficulty only)
    const problems = await Problem.find().select("title difficulty");

    // Fetch the user's submitted problems
    const user = await User.findOne({ clerkId: userId }).select("submissions");

    const submittedProblemIds = user?.submissions?.map((id) =>
      id.toString()
    ) || [];

    res.json({
      problems,
      submittedProblemIds,
    });
  } catch (error) {
    console.error("❌ getAllProblems error:", error);
    res.status(500).json({ error: "Failed to fetch problems" });
  }
};

/* ────────────────────────────── GET single problem ────────────────────────────── */
export const getAproblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id).select(
      "-hiddenTestcases" // Don't expose hidden test cases to frontend
    );

    if (!problem) return res.status(404).json({ error: "Problem not found" });
    res.json(problem);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

/* ──────────────────────── POST new problem (admin only) ──────────────────────── */
export const addProblem = async (req, res) => {
  try {
    const { sub: userId } = req.auth;
    const {
      title,
      description,
      difficulty,
      constraints,
      sampleTestcases,
      hiddenTestcases,
      tags,
    } = req.body;

    const user = await User.findOne({ clerkId: userId });
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Access denied: Admin only" });
    }

    const newProblem = new Problem({
      title,
      description,
      difficulty,
      constraints,
      sampleTestcases,
      hiddenTestcases,
      tags,
      createdBy: user._id,
    });

    await newProblem.save();
    res.status(201).json({ message: "Problem added", problem: newProblem });
  } catch (err) {
    res
      .status(400)
      .json({ error: "Failed to create problem", details: err.message });
  }
};
