import { useAuth, useUser } from "@clerk/clerk-react";
import "./App.css";
import Header from "./Components/Header/Header.jsx";
import useApi from "./Utils/api.js";
import { useEffect } from "react";
import useSyncUser from "./hooks/useSyncUser.js";

function App() {
  const { isSignedIn } = useUser();

  const api = useApi();

  useSyncUser();
  useEffect(() => {
    if (!isSignedIn) return;

    api
      .get("/problems")
      .then((res) => {
        console.log("Problems:", res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch problems", err);
      });
  }, [isSignedIn]);

  return (
    <>
      <Header />
    </>
  );
}

export default App;
