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
  const [submittedIds, setSubmittedIds] = useState([]);
  const { getToken } = useAuth();

  useEffect(() => {
    if (!isSignedIn) return;

    const fetchProblems = async () => {
      try {
        const token = await getToken();

        const res = await axios.get("http://localhost:5000/api/problems", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProblems(res.data.problems || []);
        setSubmittedIds(res.data.submittedProblemIds || []);
      } catch (err) {
        console.error("❌ Failed to fetch problems:", err);
      }
    };

    fetchProblems();
  }, [isSignedIn]);

  return (
    <div className="p-6 min-h-screen bg-white text-black">
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
            <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Difficulty</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((problem) => {
                const isSubmitted = submittedIds.includes(problem._id);
                return (
                  <tr
                    key={problem._id}
                    className={`border-t hover:bg-gray-50 ${
                      isSubmitted ? "bg-green-100" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <Link
                        to={`/problems/${problem._id}`}
                        className="text-indigo-600 hover:underline"
                      >
                        {problem.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-sm font-medium
                          ${
                            problem.difficulty === "Easy"
                              ? "bg-green-100 text-green-800"
                              : problem.difficulty === "Medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }
                        `}
                      >
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {isSubmitted && (
                        <span className="text-green-600 font-semibold">
                          ✅ Submitted
                        </span>
                      )}
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
