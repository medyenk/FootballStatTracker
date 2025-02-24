import { useEffect, useState } from "react";

const Index = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch matches from the API
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch("http://localhost:5000/matches");
        if (!response.ok) throw new Error("Failed to fetch matches");
        const data = await response.json();
        setMatches(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Football Match Tracker</h1>

      {/* Show Loading State */}
      {loading && <p>Loading matches...</p>}

      {/* Show Error Message */}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {/* Display Matches */}
      {!loading && !error && matches.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {matches.map((match) => (
            <li
              key={match.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "5px",
              }}
            >
              <strong>Date:</strong> {Date(match.date)} <br />
              <strong>Winner:</strong> {match.winner.toUpperCase()} <br />
              <strong>Score:</strong> {match.score.teamA} - {match.score.teamB}{" "}
              <br />
              <strong>Player of the Match:</strong> {match.potm} <br />
              <strong>Goal of the Match:</strong> {match.gotm}
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p>No matches found.</p>
      )}
    </div>
  );
};

export default Index;
