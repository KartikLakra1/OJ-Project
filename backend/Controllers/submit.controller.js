import Submission from "../Models/Submission.model.js";
import Problem from "../Models/Problem.model.js";
import { runCode } from "../utils/judge0.js"; // Assuming you're using Judge0 or Docker
import mongoose from "mongoose";

export const submitSolution = async (req, res) => {
  try {
    const { sub: userId } = req.auth;
    const { problemId, code, language } = req.body;

    // Validate input
    if (!problemId || !code || !language) {
      return res.status(400).json({ error: "Missing fields in request" });
    }

    // Check if problem exists
    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ error: "Problem not found" });

    // Run against hidden testcases
    const testcases = problem.hiddenTestcases;

    let allPassed = true;
    let failedCase = null;

    for (const tc of testcases) {
      const result = await runCode(language, code, tc.input);

      const userOutput = (result.stdout || "").trim();
      const expectedOutput = tc.output.trim();

      if (userOutput !== expectedOutput) {
        allPassed = false;
        failedCase = {
          input: tc.input,
          actual: userOutput,
          expected: expectedOutput,
        };
        break;
      }
    }

    // Verdict
    const verdict = allPassed ? "Accepted" : "Wrong Answer";

    // Save submission
    const submission = new Submission({
      problemId: new mongoose.Types.ObjectId(problemId),
      userId,
      code,
      language,
      verdict,
      ...(failedCase || {}),
    });

    await submission.save();

    if (verdict === "Accepted") {
      return res.status(200).json({ verdict });
    } else {
      return res.status(200).json({
        verdict,
        input: failedCase.input,
        actual: failedCase.actual,
        expected: failedCase.expected,
      });
    }
  } catch (err) {
    console.error("❌ Submission error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
