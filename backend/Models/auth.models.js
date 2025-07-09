import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  clerkId: { type: String, unique: true },
  username: String,
  email: String,
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  submissions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
    },
  ],
});

export default mongoose.model('User', userSchema);
