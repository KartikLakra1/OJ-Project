import { verifyToken } from "@clerk/backend";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid token" });
    }

    const token = authHeader.split(" ")[1];

    // ✅ This is the actual supported function now
    const session = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    req.auth = session;
    next();
  } catch (err) {
    console.error("❌ Clerk Auth Failed:", err.message);
    res.status(401).json({ error: "Unauthorized" });
  }
};
