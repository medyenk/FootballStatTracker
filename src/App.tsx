import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Matches from "./pages/Matches";
import Home from "./pages/Home";
import Navbar from "./components/Navbar/Navbar";

const App = () => {
  return (
    <Router>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/matches" element={<Matches />} />
      </Routes>
    </Router>
  );
};

export default App;
