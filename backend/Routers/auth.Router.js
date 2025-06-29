import express from "express";
const router = express.Router();
import User from "../Models/auth.models.js";
import {protect} from "../Utils/auth.js"

router.get("/me", protect, async (req, res) => {
  const { sub: userId } = req.auth;
  const user = await User.findOne({ clerkId: userId });

  if (!user) return res.status(404).json({ error: "User not found" });

  res.json({ role: user.role });
});


router.post("/sync", protect, async (req, res) => {
  try {
    const { sub: userId } = req.auth; // Clerk v4 token structure
    const { email, username } = req.body;

    // console.log("📥 Incoming sync:", { userId, email, username });

    if (!userId || !email || !username) {
      return res.status(400).json({
        error: "Missing data from Clerk",
        userId,
        email,
        username,
      });
    }

    let user = await User.findOne({ clerkId: userId });

    if (user) {
      return res.status(200).json({
        message: "User already exists",
        user,
      });
    }

    user = new User({
      clerkId: userId,
      email,
      username,
    });
    await user.save();

    res.status(200).json({ message: "✅ User synced", user });
  } catch (err) {
    console.error("❌ Sync failed:", err);
    res.status(500).json({ error: "Sync failed", details: err.message });
  }
});


export default router;
