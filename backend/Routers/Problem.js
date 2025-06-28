import express from "express";
const router = express.Router();
import {getAllProblems,addProblem} from "../Controllers/poblemController.js"
import {protect} from "../Utils/auth.js";

// Public: List problems
router.get("/", getAllProblems);

// Protected: Add problem (admin only)
router.post("/add", protect, addProblem);

export default router;
