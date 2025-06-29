import { useState } from "react";
import useApi from "../Utils/api";
import { useNavigate } from "react-router-dom";

const AddProblem = () => {
  const api = useApi();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    difficulty: "Easy",
    constraints: "",
    sampleTestcases: [{ input: "", output: "" }],
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTestcaseChange = (idx, field, value) => {
    const updated = [...form.sampleTestcases];
    updated[idx][field] = value;
    setForm({ ...form, sampleTestcases: updated });
  };

  const addTestcase = () => {
    setForm({
      ...form,
      sampleTestcases: [...form.sampleTestcases, { input: "", output: "" }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/problems/add", form);
      alert("✅ Problem added");
      navigate("/");
    } catch (err) {
      console.error("❌ Failed to add problem:", err.response?.data || err);
      alert("❌ Add failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Problem</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          rows={4}
          required
        />

        <textarea
          name="constraints"
          placeholder="Constraints"
          value={form.constraints}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          rows={3}
        />

        <select
          name="difficulty"
          value={form.difficulty}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        <h2 className="font-medium mt-4">Sample Test Cases</h2>
        {form.sampleTestcases.map((tc, idx) => (
          <div key={idx} className="border p-3 rounded space-y-2 bg-gray-50">
            <input
              type="text"
              placeholder="Input"
              value={tc.input}
              onChange={(e) =>
                handleTestcaseChange(idx, "input", e.target.value)
              }
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Output"
              value={tc.output}
              onChange={(e) =>
                handleTestcaseChange(idx, "output", e.target.value)
              }
              className="w-full border p-2 rounded"
              required
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addTestcase}
          className="text-sm text-indigo-600 hover:underline"
        >
          + Add Another Test Case
        </button>

        <button
          type="submit"
          className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Submit Problem
        </button>
      </form>
    </div>
  );
};

export default AddProblem;
