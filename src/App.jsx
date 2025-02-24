import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Matches from "./Matches"; // Import your Matches component
import Index from "./index"; // Import your Index component

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Define routes */}
        <Route path="/" element={<Index />} />
        <Route path="/matches" element={<Matches />} />
      </Routes>
    </Router>
  );
};

export default App;
