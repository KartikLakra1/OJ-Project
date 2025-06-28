import express from "express";
const router = express.Router();
import User from "../Models/auth.models.js";
import {protect} from "../Utils/auth.js"

router.post("/sync", protect, async (req, res) => {
  try {
    const { sub: userId } = req.auth; // 🧠 Clerk v4 token structure
    const { email_addresses, username } = req.body;

    if (!userId || !email_addresses || !username) {
      return res.status(400).json({
        error: "Missing data from Clerk",
        userId,
        email_addresses,
        username
      });
    }

    let user = await User.findOne({ clerkId: userId });

    if(user){
      return res.status(301).json({
        message : "user already present",
        user : user
      })
    }

    if (!user) {
      user = new User({
        clerkId: userId,
        email: email_addresses[0].email_address,
        username,
      });
      await user.save();
    }

    res.status(200).json({ message: "User synced", user });
  } catch (err) {
    console.error("❌ Sync failed:", err);
    res.status(500).json({ error: "Sync failed", details: err.message });
  }
});


export default router;
