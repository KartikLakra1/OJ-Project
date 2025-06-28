import express from "express";
const router = express.Router();
import {getAllProblems,addProblem, getAproblem} from "../Controllers/poblemController.js"
import {protect} from "../Utils/auth.js";

// Public: List problems
router.get("/", getAllProblems);

// Protected: Add problem (admin only)
router.post("/add", protect, addProblem);

// get a problem 
router.get("/:id", getAproblem);

export default router;
