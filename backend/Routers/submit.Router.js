import express from 'express';
import { protect } from '../Utils/auth.js';
import axios from 'axios';
import Problem from "../Models/Problem.model.js"
import Submission from "../Models/Submittion.model.js"
import User from "../Models/auth.models.js";

const router = express.Router();

const JUDGE0_URL = "https://judge0-ce.p.rapidapi.com";

const JUDGE0_HEADERS = {
  "X-RapidAPI-Key": process.env.RAPID_API_KEY,
  "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
  "Content-Type": "application/json"
};

const languageMap = {
  cpp: 54,
  java: 62,
  python: 71,
  javascript: 63,
};



router.post("/run", protect, async (req, res) => {
  const { code, language, input } = req.body;      // input is the first sample
  try {
    const runRes = await axios.post(
      `${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
      {
        source_code: code,
        language_id: languageMap[language],
        stdin: input,
      },
      { headers: JUDGE0_HEADERS }
    );
    res.json(runRes.data);      // contains stdout / stderr / status
  } catch (err) {
    res.status(500).json({ error: "Run failed", details: err.message });
  }
});

router.post("/", protect, async (req, res) => {
  const { problemId, code, language } = req.body;
  const userId = req.auth.sub;
  const language_id = languageMap[language];

  if (!problemId || !code || !language_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ error: "Problem not found" });

    const testcases = problem.sampleTestcases;
    let finalVerdict = "Accepted";
    let failedCase = null;
    let lastData = null;

    for (let idx = 0; idx < testcases.length; idx++) {
      const test = testcases[idx];
      const { data } = await axios.post(
        `${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
        {
          source_code: code,
          language_id,
          stdin: test.input,
        },
        { headers: JUDGE0_HEADERS }
      );

      const { status, stdout = "", stderr = "", compile_output = "" } = data;
      const actual = (stdout || "").trim();
      const expected = test.output.trim();

      lastData = data;

      if (status.id !== 3) {
        finalVerdict = status.description;
        failedCase = { input: test.input, expected, actual, stderr, compile_output };
        break;
      }

      if (actual !== expected) {
        finalVerdict = "Wrong Answer";
        failedCase = { input: test.input, expected, actual };
        break;
      }
    }

    const submission = new Submission({
      problemId,
      userId,
      code,
      language,
      verdict: finalVerdict,
      input: failedCase?.input,
      output: failedCase?.actual,
      expected: failedCase?.expected,
      time: lastData?.time,
      memory: lastData?.memory,
    });

    await submission.save();

    // ✅ Add to user's submissions if Accepted
    if (finalVerdict === "Accepted") {
      const user = await User.findOne({ clerkId: userId });
      if (user && !user.submissions.includes(problemId)) {
        user.submissions.push(problemId);
        await user.save();
      }

      return res.status(200).json({ verdict: "Accepted" });
    } else {
      return res.status(200).json({
        verdict: finalVerdict,
        ...failedCase,
        time: lastData?.time,
        memory: lastData?.memory,
      });
    }
  } catch (err) {
    console.error("❌ Submit error:", err.response?.data || err.message);
    return res.status(500).json({
      verdict: "Error",
      message: err.response?.data?.message || err.message,
    });
  }
});



export default router;