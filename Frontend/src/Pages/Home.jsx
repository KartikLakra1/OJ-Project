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
import video from "../assets/horizontal-video.mp4";

const Home = () => {
  const { isSignedIn } = useUser();
  const [problems, setProblems] = useState([]);
  const [submittedIds, setSubmittedIds] = useState([]);
  const [view, setView] = useState("card");
  const { getToken } = useAuth();

  useEffect(() => {
    if (!isSignedIn) return;

    const fetchProblems = async () => {
      try {
        const token = await getToken();
        // console.log("token : ", token);
        // console.log("env : ", import.meta.env.VITE_BACKEND_URL);
        const res = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/problems`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProblems(res.data.problems || []);
        setSubmittedIds(res.data.submittedProblemIds || []);
        // console.log("problems : ", problems);
        console.log("problems fetched successfully");
      } catch (err) {
        console.error("❌ Failed to fetch problems:", err);
      }
    };

    fetchProblems();
  }, [isSignedIn]);

  return (
    <div className=" min-h-[97vh] pt-8 flex flex-col align-middle justify-start bg-gradient-to-r from-slate-700 via-gray-800 to-slate-950 text-white">
      <SignedOut>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          src={video}
        />

        <div className="z-200 mt-50 text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Please sign in to view Problems
          </h2>
          {/* <SignIn /> */}
        </div>
      </SignedOut>

      <SignedIn>
        <h1 className="text-3xl font-bold mt-20 mb-5">All Problems</h1>

        <div className="flex font-bold fixed top-32 right-0 bg-yellow-400 gap-3 p-2 rounded-md z-200 text-black cursor-pointer">
          <span>View : </span>
          <h1
            className="hover:underline"
            onClick={() => {
              setView("card");
            }}
          >
            CARD
          </h1>
          <h1
            className="hover:underline"
            onClick={() => {
              setView("table");
            }}
          >
            TABLE
          </h1>
        </div>

        {view === "card" ? (
          <>
            {/* Problem cards */}
            <div className="flex flex-wrap justify-center align-middle gap-[2rem] w-[100%] p-1 pb-7">
              {problems.map((problem) => {
                const isSubmitted = submittedIds.includes(problem._id);

                return (
                  <Link to={`/problems/${problem._id}`}>
                    <div
                      key={problem._id}
                      className="bg-slate-500 font-bold border-gray-600 border-2 rounded-xl flex md:flex-wrap flex-col text-white w-[90vw] md:w-[500px] justify-between p-2.5 hover:bg-gradient-to-r from-slate-800 to-slate-600 min-h-44"
                    >
                      <h1 className="flex flex-row justify-between text-2xl text-left">
                        {problem.title}

                        <span
                          className={`px-2 py-1 rounded text-[16px] font-medium flex align-middle my-auto justify-center
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
                      </h1>
                      <p>{problem.description}</p>

                      <p className="p-3 text-left flex flex-wrap gap-2">
                        {problem.tags && problem.tags.length > 0 ? (
                          problem.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="inline-block bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full"
                            >
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 italic text-sm p-0"></span>
                        )}
                      </p>

                      <p
                        className={`flex flex-row justify-between text-white p-2 rounded-sm ${
                          isSubmitted ? "bg-green-950" : "bg-pink-950"
                        }`}
                      >
                        <h1>Submission Status : </h1>
                        {isSubmitted ? (
                          <span className="text-white  font-bold">
                            ✅ Submitted
                          </span>
                        ) : (
                          <span>❌ Not Submitted</span>
                        )}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        ) : (
          <>
            {/* problem tables */}
            <div className="bg-black text-white overflow-x-auto p-2 md:text-2xl">
              <table className="w-full border rounded-lg overflow-hidden">
                <thead className=" uppercase text-sm">
                  <tr>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Difficulty</th>
                    <th className="px-4 py-3">Tags</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {problems.map((problem) => {
                    const isSubmitted = submittedIds.includes(problem._id);
                    return (
                      <tr
                        key={problem._id}
                        className={`border-t  ${
                          isSubmitted
                            ? "bg-green-600 text-white"
                            : "bg-slate-900"
                        }`}
                      >
                        <td className="px-4 py-3">
                          <Link
                            to={`/problems/${problem._id}`}
                            className="text-white font-bold hover:underline"
                          >
                            {problem.title}
                          </Link>
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded text-sm font-medium
                          ${
                            problem.difficulty === "Easy"
                              ? "bg-green-400 text-white"
                              : problem.difficulty === "Medium"
                              ? "bg-yellow-800 text-white"
                              : "bg-red-800 text-white"
                          }
                        `}
                          >
                            {problem.difficulty}
                          </span>
                        </td>

                        <td className="px-4 py-3 space-x-2">
                          {problem.tags && problem.tags.length > 0 ? (
                            problem.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="inline-block bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full"
                              >
                                {tag}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400 italic text-sm">
                              —
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {isSubmitted ? (
                            <span className="text-white font-semibold">
                              ✅ Submitted
                            </span>
                          ) : (
                            <span>
                              <span>❌ Not Submitted</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </SignedIn>
    </div>
  );
};

export default Home;
