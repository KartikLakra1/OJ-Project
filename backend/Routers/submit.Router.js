import express from 'express';
import { protect } from '../Utils/auth.js';
import axios from 'axios';

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
  const language_id = languageMap[language];

  if (!problemId || !code || !language_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ error: "Problem not found" });

    const results = [];

    for (let test of problem.sampleTestcases) {
      const submission = await axios.post(
        `${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
        {
          source_code: code,
          language_id,
          stdin: test.input,
          expected_output: test.output,
        },
        { headers: JUDGE0_HEADERS }
      );

      const { status, stdout } = submission.data;

      if (status.id !== 3) {
        return res.status(200).json({
          verdict: "Error",
          message: status.description,
        });
      }

      if (stdout?.trim() !== test.output.trim()) {
        return res.status(200).json({
          verdict: "Wrong Answer",
          input: test.input,
          expected: test.output,
          actual: stdout,
        });
      }

      results.push(submission.data);
    }

    res.status(200).json({
      verdict: "Accepted",
      time: results[0].time || 0,
      memory: results[0].memory || 0,
    });
  } catch (err) {
    console.error("❌ Submit error:", err.response?.data || err.message);
    res.status(500).json({ error: "Submit failed", details: err.message });
  }
});



export default router;