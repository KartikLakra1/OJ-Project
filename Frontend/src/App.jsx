import "./App.css";
import Header from "./Components/Header/Header.jsx";
import useSyncUser from "./hooks/useSyncUser.js";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import ProblemPage from "./Pages/ProblemPage.jsx";
import Footer from "./Components/Footer/Footer.jsx";
import AddProblem from "./Pages/AddProblem.jsx";

function App() {
  // console.log("BACKEND:", import.meta.env.VITE_BACKEND_URL);
  useSyncUser();

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/problems/:id" element={<ProblemPage />} />
        <Route path="/add-problem" element={<AddProblem />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
