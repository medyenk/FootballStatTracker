import { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@sanity/client";

const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: "production",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
  apiVersion: "2024-03-19",
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  try {
    const match = req.body;
    if (!match || !match.teamA || !match.teamB) {
      return res.status(400).json({ message: "Invalid match data" });
    }

    const allPlayers = [...match.teamA, ...match.teamB];

    for (const player of allPlayers) {
      await sanityClient.patch(player._ref).inc({ attended: 1 }).commit();
    }

    if (match.winner === "teamA") {
      for (const player of match.teamA)
        await sanityClient.patch(player._ref).inc({ win: 1 }).commit();
      for (const player of match.teamB)
        await sanityClient.patch(player._ref).inc({ loss: 1 }).commit();
    } else if (match.winner === "teamB") {
      for (const player of match.teamB)
        await sanityClient.patch(player._ref).inc({ win: 1 }).commit();
      for (const player of match.teamA)
        await sanityClient.patch(player._ref).inc({ loss: 1 }).commit();
    } else {
      for (const player of allPlayers)
        await sanityClient.patch(player._ref).inc({ draw: 1 }).commit();
    }

    if (match.potm)
      await sanityClient.patch(match.potm._ref).inc({ motm: 1 }).commit();
    if (match.gotm)
      await sanityClient.patch(match.gotm._ref).inc({ gotm: 1 }).commit();

    res.status(200).json({ message: "Player stats updated!" });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
