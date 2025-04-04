import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "./pages/admin";
import Home from "./pages";
import Navbar from "./components/Navbar";
import Leaderboard from "./pages/leaderboard";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
};

export default App;
