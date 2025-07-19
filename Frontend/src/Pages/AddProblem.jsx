import { useState } from "react";
import useApi from "../Utils/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddProblem = () => {
  const api = useApi();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    difficulty: "Easy",
    constraints: "",
    sampleTestcases: [{ input: "", output: "" }],
    hiddenTestcases: [{ input: "", output: "" }],
    tags: [],
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTestcaseChange = (type, idx, field, value) => {
    const updated = [...form[type]];
    updated[idx][field] = value;
    setForm({ ...form, [type]: updated });
  };

  const addTestcase = (type) => {
    setForm({
      ...form,
      [type]: [...form[type], { input: "", output: "" }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Title and description are required.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...form,
        tags: form.tags.filter((tag) => tag.trim() !== ""), // remove empty tags
      };

      await api.post(`/problems/add`, payload);
      toast.success("✅ Problem added successfully");
      navigate("/");
    } catch (err) {
      console.error("❌ Failed to add problem:", err.response?.data || err);
      toast.error(err.response?.data?.error || "Add failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[97vh] pt-20 flex justify-center align-middle flex-col p-11 bg-gradient-to-b from-slate-700 to-slate-950 text-white">
      <h1 className="text-2xl  md:text-4xl font-bold mb-8">Add New Problem</h1>
      <form onSubmit={handleSubmit} className="space-y-4 text-white">
        {/* Title */}
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-2 rounded text-white bg-black"
          required
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded bg-black"
          rows={5}
          required
        />

        {/* Constraints */}
        <textarea
          name="constraints"
          placeholder="Constraints"
          value={form.constraints}
          onChange={handleChange}
          className="w-full border p-2 rounded bg-black"
          rows={3}
        />

        {/* Difficulty */}
        <select
          name="difficulty"
          value={form.difficulty}
          onChange={handleChange}
          className="w-full border p-2 rounded bg-black"
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        {/* Tags */}
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={form.tags.join(", ")}
          onChange={(e) =>
            setForm({
              ...form,
              tags: e.target.value.split(",").map((tag) => tag.trim()),
            })
          }
          className="w-full border p-2 rounded bg-black"
        />

        {/* Sample Test Cases */}
        <div>
          <h2 className="text-2xl font-bold mt-6 mb-2">Sample Test Cases</h2>
          {form.sampleTestcases.map((tc, idx) => (
            <div
              key={idx}
              className="border-slate-200 p-3 rounded space-y-2 mb-3"
            >
              <textarea
                placeholder="Sample Input"
                value={tc.input}
                onChange={(e) =>
                  handleTestcaseChange(
                    "sampleTestcases",
                    idx,
                    "input",
                    e.target.value
                  )
                }
                className="w-full border p-2 rounded bg-black"
                rows={2}
                required
              />
              <textarea
                placeholder="Sample Output"
                value={tc.output}
                onChange={(e) =>
                  handleTestcaseChange(
                    "sampleTestcases",
                    idx,
                    "output",
                    e.target.value
                  )
                }
                className="w-full border p-2 rounded bg-black"
                rows={2}
                required
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => addTestcase("sampleTestcases")}
            className="text-sm text-yellow-100 cursor-pointer"
          >
            + Add Sample Test Case
          </button>
        </div>

        {/* Hidden Test Cases */}
        <div>
          <h2 className="text-2xl font-bold mt-6 mb-2">Hidden Test Cases</h2>
          {form.hiddenTestcases.map((tc, idx) => (
            <div
              key={idx}
              className="border-slate-100 p-3 rounded space-y-2  mb-3"
            >
              <textarea
                placeholder="Hidden Input"
                value={tc.input}
                onChange={(e) =>
                  handleTestcaseChange(
                    "hiddenTestcases",
                    idx,
                    "input",
                    e.target.value
                  )
                }
                className="w-full border p-2 rounded bg-black"
                rows={2}
                required
              />
              <textarea
                placeholder="Hidden Output"
                value={tc.output}
                onChange={(e) =>
                  handleTestcaseChange(
                    "hiddenTestcases",
                    idx,
                    "output",
                    e.target.value
                  )
                }
                className="w-full border p-2 rounded bg-black"
                rows={2}
                required
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => addTestcase("hiddenTestcases")}
            className="text-sm text-yellow-100 cursor-pointer"
          >
            + Add Hidden Test Case
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Submitting…" : "Submit Problem"}
        </button>
      </form>
    </div>
  );
};

export default AddProblem;
