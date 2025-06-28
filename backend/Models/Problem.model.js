import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
  title: String,
  description: String,
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    default: "Easy"
  },
  constraints: String,
  sampleTestcases: [{ input: String, output: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

export default mongoose.model("Problem", problemSchema);
