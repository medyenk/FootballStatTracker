import { useEffect, useState } from "react";

interface Match {
  id: number;
  date: string;
  winner: string;
  teamA: number[];
  teamB: number[];
  teamAScore: number;
  teamBScore: number;
  potm: number;
  gotm: number;
}

const Index = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch("http://localhost:5001/matches");
        if (!response.ok) throw new Error("Failed to fetch matches");
        const data = await response.json();
        setMatches(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const convertIDtoPlayerName = (id: number) => {
    const player = players.find((player) => player.id === id);
    return player ? player.name : "Unknown Player";
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <Text fontSize="3xl" fontWeight="bold" marginBottom="20px">
        Alperton Thursday Latest Match Results
      </Text>

      {/* Show Loading State */}
      {loading && <p>Loading matches...</p>}

      {/* Show Error Message */}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {/* Display Matches */}
      {!loading && !error && matches.length > 0 ? (
        <div>
          {matches.map((match) => (
            <>
              <Card.Root key={match.id} style={{ marginBottom: "20px" }}>
                <CardHeader>
                  <Heading as="h3" size="md">
                    {new Date(match.date).toLocaleDateString()}
                  </Heading>
                </CardHeader>
                <CardHeader>
                  <Text fontWeight="bold">Team A</Text>
                  {match.teamA
                    .map((id) => convertIDtoPlayerName(id))
                    .join(", ")}
                </CardHeader>
                <CardHeader>
                  <Text fontWeight="bold">Team B</Text>
                  {match.teamB
                    .map((id) => convertIDtoPlayerName(id))
                    .join(", ")}
                </CardHeader>

                <CardBody>
                  <Text>
                    <strong>Score:</strong> {match.teamAScore} -{" "}
                    {match.teamBScore} <br />
                    <strong>Player of the Match:</strong>{" "}
                    {convertIDtoPlayerName(match.potm)} <br />
                    <strong>Goal of the Match:</strong>{" "}
                    {convertIDtoPlayerName(match.gotm)} <br />
                  </Text>
                </CardBody>
              </Card.Root>
            </>
          ))}
        </div>
      ) : (
        !loading && <p>No matches found.</p>
      )}
    </div>
  );
};

export default Index;
