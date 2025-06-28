// src/pages/Problem.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import Editor from "@monaco-editor/react";
import useApi from "../Utils/api";

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
    setSubmitting(true);
    setVerdict(null);
    try {
      const res = await api.post("/submit", {
        problemId: id,
        language,
        code,
      });
      setVerdict(res.data); // expected: { verdict, time, memory }
    } catch (err) {
      setVerdict({
        verdict: "Error",
        message: err.response?.data?.error || err.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  /* ─────────────────────────────── Render ──────────────────────────────── */
  if (!isSignedIn)
    return <p className="p-6">Please sign in to view problems.</p>;
  if (loading) return <p className="p-6">Loading…</p>;
  if (!problem) return <p className="p-6">Problem not found.</p>;

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 max-w-[1300px] mx-auto">
      {/* ───── Left: Problem details ───── */}
      <div className="md:w-1/2">
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
      <div className="md:w-1/2">
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
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="mt-4 w-full px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {submitting ? "Submitting…" : "Submit"}
        </button>

        {/* Verdict box */}
        {verdict && (
          <div className="mt-4 p-4 border rounded bg-gray-50 text-sm">
            {verdict.verdict === "Accepted" ? (
              <p className="text-green-600 font-semibold">✔ Accepted</p>
            ) : verdict.verdict === "Error" ? (
              <p className="text-red-600 font-semibold">{verdict.message}</p>
            ) : (
              <p className="text-red-600 font-semibold">✖ {verdict.verdict}</p>
            )}
            {verdict.time !== undefined && <p>Time: {verdict.time} ms</p>}
            {verdict.memory !== undefined && <p>Memory: {verdict.memory} KB</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Problem;
