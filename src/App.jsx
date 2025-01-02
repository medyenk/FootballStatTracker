import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Matches from "./Matches"; // Import your Matches component

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Define routes */}
        <Route path="/" element={<h1>Home Page</h1>} />
        <Route path="/matches" element={<Matches />} />
      </Routes>
    </Router>
  );
};

export default App;
