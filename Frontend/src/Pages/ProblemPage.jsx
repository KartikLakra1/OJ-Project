// src/pages/Problem.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import Editor from "@monaco-editor/react";
import useApi from "../Utils/api";
import { toast } from "react-toastify";

const languageOptions = [
  { label: "C++17", value: "cpp" },
  { label: "Java 17", value: "java" },
  { label: "Python 3.11", value: "python" },
  { label: "JavaScript", value: "javascript" },
];

const Problem = () => {
  const { id } = useParams(); // problem ID from URL
  const { isSignedIn } = useUser();
  const api = useApi();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [runResult, setRunResult] = useState(null); // replaces runOutput

  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("// write your solution here\n");
  const [submitting, setSubmitting] = useState(false);
  const [verdict, setVerdict] = useState(null);

  /* ────────────────────────── Fetch the problem once ────────────────────────── */
  useEffect(() => {
    if (!isSignedIn) return;

    const fetchProblem = async () => {
      try {
        const res = await api.get(`/problems/${id}`);
        setProblem(res.data);
      } catch (err) {
        console.error("Failed to fetch problem:", err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id, isSignedIn]);

  /* ───────────────────────────── Submissions ───────────────────────────── */
  const handleSubmit = async () => {
    setRunResult(null);
    setSubmitting(true);
    setVerdict(null);

    try {
      const res = await api.post("/submit", {
        problemId: id,
        language,
        code,
      });

      const result = res.data;
      setVerdict(result);

      if (result.verdict === "Accepted") {
        toast.success("✅ Accepted");
      } else if (result.verdict === "Wrong Answer") {
        toast.error("❌ Wrong Answer on a test case");
      } else {
        toast.warn("⚠ Error: " + result.message);
      }
    } catch (err) {
      setVerdict({
        verdict: "Error",
        message: err.response?.data?.error || err.message,
      });
      toast.error("❌ Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  /* ─────────── RUN handler (first sample only) ─────────── */
  const handleRun = async () => {
    setVerdict(null);
    const sample = problem.sampleTestcases[0];
    const expected = sample.output.trim();

    try {
      const res = await api.post("/submit/run", {
        code,
        language,
        input: sample.input,
      });

      const actual = res.data.stdout?.trim() ?? "";
      const verdict = actual === expected ? "Correct" : "Wrong Answer";

      setRunResult({
        input: sample.input,
        output: actual,
        expected,
        verdict,
      });

      verdict === "Correct"
        ? toast.success("✅ Correct output!")
        : toast.error("✖ Wrong Answer");
    } catch (err) {
      console.error("❌ Run failed", err);
      toast.error("⚠️ Execution error");
      setRunResult({
        input: sample.input,
        output: err.response?.data?.stdout ?? "",
        expected,
        verdict: "Error",
      });
    }
  };

  /* ─────────────────────────────── Render ──────────────────────────────── */
  if (!isSignedIn)
    return <p className="p-6">Please sign in to view problems.</p>;
  if (loading) return <p className="p-6">Loading…</p>;
  if (!problem) return <p className="p-6">Problem not found.</p>;

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 max-w-[100%] mx-auto">
      {/* ───── Left: Problem details ───── */}
      <div className="md:w-1/3">
        <h1 className="text-3xl font-bold mb-2">{problem.title}</h1>
        <p className="text-sm text-gray-600 mb-4">
          Difficulty:&nbsp;
          <span
            className={
              problem.difficulty === "Easy"
                ? "text-green-600"
                : problem.difficulty === "Medium"
                ? "text-yellow-600"
                : "text-red-600"
            }
          >
            {problem.difficulty}
          </span>
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-1">Description</h2>
        <p className="whitespace-pre-wrap">{problem.description}</p>

        <h2 className="text-xl font-semibold mt-6 mb-1">Constraints</h2>
        <p className="whitespace-pre-wrap">{problem.constraints}</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Sample Test Cases</h2>
        {problem.sampleTestcases.map((t, i) => (
          <div key={i} className="border p-3 rounded mb-3 bg-gray-50">
            <p className="mb-1">
              <strong>Input {i + 1}:</strong> {t.input}
            </p>
            <p>
              <strong>Output {i + 1}:</strong> {t.output}
            </p>
          </div>
        ))}
      </div>

      {/* ───── Right: Editor & Submit ───── */}
      <div className="md:w-2/3">
        {/* Language selector */}
        <div className="mb-3">
          <label className="block mb-1 font-medium">Language:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          >
            {languageOptions.map((opt) => (
              <option value={opt.value} key={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Monaco editor */}
        <Editor
          height="300px"
          theme="vs-dark"
          defaultLanguage={language === "cpp" ? "cpp" : language}
          value={code}
          onChange={(val) => setCode(val ?? "")}
          options={{ fontSize: 14, minimap: { enabled: false } }}
        />

        {/* Submit button */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={handleRun}
            className="flex-1 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Run
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {submitting ? "Submitting…" : "Submit"}
          </button>
        </div>

        {runResult && (
          <div className="mt-4 p-4 border rounded bg-gray-50 text-sm space-y-2">
            <p>
              <strong className="text-gray-700">Input:</strong>
              <pre className="whitespace-pre-wrap bg-white p-2 rounded border mt-1">
                {runResult.input}
              </pre>
            </p>

            <p>
              <strong className="text-gray-700">Your Output:</strong>
              <pre className="whitespace-pre-wrap bg-white p-2 rounded border mt-1">
                {runResult.output}
              </pre>
            </p>

            <p>
              <strong className="text-gray-700">Expected Output:</strong>
              <pre className="whitespace-pre-wrap bg-white p-2 rounded border mt-1">
                {runResult.expected}
              </pre>
            </p>

            <p className="text-sm mt-2 font-semibold">
              Verdict:
              <span
                className={
                  runResult.verdict === "Correct"
                    ? "text-green-600 ml-2"
                    : runResult.verdict === "Wrong Answer"
                    ? "text-red-600 ml-2"
                    : "text-yellow-600 ml-2"
                }
              >
                {runResult.verdict}
              </span>
            </p>
          </div>
        )}

        {/* Verdict box */}
        {verdict?.verdict === "Wrong Answer" && (
          <div className="mt-2 p-4 border rounded bg-red-50 text-sm">
            <p className="font-semibold text-red-600 mb-2">Failing Test Case</p>

            <p className="mb-1 text-gray-700">Input:</p>
            <pre className="whitespace-pre-wrap bg-white p-2 rounded border mb-2">
              {verdict.input}
            </pre>

            <p className="mb-1 text-gray-700">Expected Output:</p>
            <pre className="whitespace-pre-wrap bg-white p-2 rounded border mb-2">
              {verdict.expected}
            </pre>

            <p className="mb-1 text-gray-700">Your Output:</p>
            <pre className="whitespace-pre-wrap bg-white p-2 rounded border">
              {verdict.actual}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Problem;
