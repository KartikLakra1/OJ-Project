import "./App.css";
import Header from "./Components/Header/Header.jsx";
import useSyncUser from "./hooks/useSyncUser.js";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import ProblemPage from "./Pages/ProblemPage.jsx";
import Footer from "./Components/Footer/Footer.jsx";

function App() {
  useSyncUser();

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/problems/:id" element={<ProblemPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
