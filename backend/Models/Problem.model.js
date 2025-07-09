import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    default: "Easy"
  },
  constraints: String,
  sampleTestcases: [{ input: String, output: String }],
  hiddenTestcases: [{ input: String, output: String }], // Not sent to frontend
  tags: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, {
  timestamps: true
});

export default mongoose.model("Problem", problemSchema);
