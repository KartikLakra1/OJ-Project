import { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";

const languageOptions = [
  { id: 54, label: "C++", value: "cpp" },
  { id: 62, label: "Java", value: "java" },
  { id: 71, label: "Python", value: "python" },
  { id: 63, label: "JavaScript", value: "javascript" },
];

const Compiler = () => {
  const [language, setLanguage] = useState(54); // Default to C++
  const [code, setCode] = useState("// Write your code here");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    setOutput("");

    try {
      const response = await axios.post(
        "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
        {
          source_code: code,
          stdin: input,
          language_id: language,
        },
        {
          headers: {
            "content-type": "application/json",
            "X-RapidAPI-Key": import.meta.env.VITE_RAPID_API_KEY,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        }
      );

      const result = response.data;
      if (result.stdout) {
        setOutput(result.stdout);
      } else if (result.stderr) {
        setOutput(result.stderr);
      } else if (result.compile_output) {
        setOutput(result.compile_output);
      } else {
        setOutput("Unknown Error");
      }
    } catch (error) {
      console.error(error);
      setOutput("Execution failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16 p-2.5 pb-3.5 md:pt-24 min-h-[94vh] bg-[#0f172a] text-white md:p-8 flex flex-col md:flex-row gap-6 ">
      {/* Left: Editor and Language Selector */}
      <div className="md:w-2/3 md:mt-0 md:flex md:flex-col text-left md:gap-7 ">
        <h1 className="text-3xl font-bold pb-4 md:pb-0">Compiler Your Code</h1>

        <div className="mb-2">
          <label className="font-medium mr-2">Language:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(parseInt(e.target.value))}
            className="border border-gray-600 px-3 py-1 rounded bg-[#1e293b] text-white"
          >
            {languageOptions.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <Editor
          height="400px"
          defaultLanguage="cpp"
          value={code}
          onChange={(val) => setCode(val ?? "")}
          theme="vs-dark"
          options={{ fontSize: 14 }}
        />
      </div>

      {/* Right: Input, Run, Output */}
      <div className="md:w-1/3 flex flex-col gap-14 md:mt-32">
        <div>
          <label className="font-medium">Input:</label>
          <textarea
            rows={5}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full mt-1 border border-gray-600 p-2 rounded bg-[#1e293b] text-white"
          />
          <button
            onClick={handleRun}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Running..." : "Run Code"}
          </button>
        </div>

        <div>
          <label className="font-medium">Output:</label>
          <pre className="bg-[#1e293b] text-green-400 border border-gray-600 p-3 rounded mt-1 whitespace-pre-wrap">
            {output || "No output yet"}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default Compiler;
