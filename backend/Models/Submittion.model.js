// /Models/Submission.model.js
import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: "Problem", required: true },
    userId: { type: String, required: true }, // Clerk `sub`
    language: { type: String, required: true },
    code: { type: String, required: true },
    verdict: {
      type: String,
      enum: ["Accepted", "Wrong Answer", "Time Limit Exceeded", "Runtime Error", "Compilation Error", "Error"],
      default: "Error",
    },
    input: String,
    output: String,
    expected: String,
    time: Number,
    memory: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Submission", submissionSchema);
