import { useEffect, useState } from "react";
import {
  useUser,
  SignedIn,
  SignedOut,
  SignIn,
  useAuth,
} from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const { isSignedIn } = useUser();
  const [problems, setProblems] = useState([]);
  const [acceptedProblems, setAcceptedProblems] = useState(new Set());
  const { getToken } = useAuth();

  useEffect(() => {
    if (!isSignedIn) return;

    const fetchProblems = async () => {
      try {
        const token = await getToken();
        const [problemsRes, submissionsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/problems"),
          axios.get("http://localhost:5000/api/submissions", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        setProblems(problemsRes.data);

        const accepted = new Set(
          submissionsRes.data
            .filter((s) => s.verdict === "Accepted")
            .map((s) => s.problemId)
        );
        setAcceptedProblems(accepted);
      } catch (err) {
        console.error("❌ Failed to fetch data:", err);
      }
    };

    fetchProblems();
  }, [isSignedIn]);

  return (
    <div className="p-6 min-h-screen bg-white text-black dark:bg-zinc-900 dark:text-white">
      <SignedOut>
        <div className="mt-10 text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Please sign in to view problems
          </h2>
          <SignIn />
        </div>
      </SignedOut>

      <SignedIn>
        <h1 className="text-3xl font-bold mb-6">All Problems</h1>

        <div className="overflow-x-auto">
          <table className="w-full text-left border rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-300 uppercase text-sm">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Difficulty</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((problem) => {
                const isDone = acceptedProblems.has(problem._id);
                return (
                  <tr
                    key={problem._id}
                    className={`border-t hover:bg-gray-50 dark:hover:bg-zinc-800 ${
                      isDone ? "bg-green-100 dark:bg-green-900" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <Link
                        to={`/problems/${problem._id}`}
                        className={`hover:underline ${
                          isDone
                            ? "text-green-700 dark:text-green-300"
                            : "text-indigo-600"
                        }`}
                      >
                        {problem.title}
                      </Link>
                      {isDone && (
                        <span className="ml-2 inline-block text-green-700 dark:text-green-300 text-xs font-semibold bg-green-200 dark:bg-green-800 px-2 py-0.5 rounded-full">
                          ✔ Done
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-sm font-medium ${
                          problem.difficulty === "Easy"
                            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-300"
                            : problem.difficulty === "Medium"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-300"
                            : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-300"
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SignedIn>
    </div>
  );
};

export default Home;
