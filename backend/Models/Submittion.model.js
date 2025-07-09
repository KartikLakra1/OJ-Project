import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    userId: {
      type: String, // Clerk `sub` (unique user identifier from JWT)
      required: true,
    },
    language: {
      type: String,
      required: true,
      enum: ["cpp", "java", "python", "javascript"],
    },
    code: {
      type: String,
      required: true,
    },
    verdict: {
      type: String,
      enum: ["Accepted", "Wrong Answer", "Time Limit Exceeded", "Runtime Error", "Error"],
      default: "Error",
    },
    input: String,     // Optional: if storing specific input used
    output: String,    // Optional: actual output from user code
    expected: String,  // Optional: expected output
    time: Number,      // Optional: execution time
    memory: Number,    // Optional: memory used in KB
  },
  { timestamps: true }
);

export default mongoose.model("Submission", submissionSchema);
