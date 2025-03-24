// import { VercelRequest, VercelResponse } from "@vercel/node";

// const sanityClient = createClient({
//   projectId: process.env.SANITY_PROJECT_ID!,
//   dataset: "production",
//   token: process.env.SANITY_WRITE_TOKEN!,
//   useCdn: false,
//   apiVersion: "2023-01-01",
// });

// export default async function handler(req: VercelRequest, res: VercelResponse) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method Not Allowed" });
//   }

//   const incoming = req.body;
//   const matchId = incoming._id;

//   if (!matchId) {
//     return res.status(400).json({ message: "Match ID missing" });
//   }

//   // 🔄 Fetch the latest match from Sanity to check the current flag
//   const match = await sanityClient.getDocument(matchId);

//   if (!match) {
//     return res.status(404).json({ message: "Match not found in Sanity" });
//   }

//   if (match.hasBeenProcessed) {
//     console.log("⚠️ Match already processed. Skipping...");
//     return res.status(200).json({ message: "Match already processed" });
//   }

//   const patchPlayer = (playerRef: any, field: string) =>
//     sanityClient
//       .patch(playerRef._ref)
//       .inc({ [field]: 1 })
//       .commit();

//   const updateAll = async () => {
//     const allPlayers = [...(match.teamA || []), ...(match.teamB || [])];

//     for (const player of allPlayers) {
//       await patchPlayer(player, "attended");
//     }

//     if (match.winner === "teamA") {
//       for (const player of match.teamA) await patchPlayer(player, "win");
//       for (const player of match.teamB) await patchPlayer(player, "loss");
//     } else if (match.winner === "teamB") {
//       for (const player of match.teamB) await patchPlayer(player, "win");
//       for (const player of match.teamA) await patchPlayer(player, "loss");
//     } else {
//       for (const player of allPlayers) await patchPlayer(player, "draw");
//     }

//     if (match.potm) await patchPlayer(match.potm, "motm");
//     if (match.gotm) await patchPlayer(match.gotm, "gotm");
//   };

//   try {
//     console.log("📦 Processing match:", match._id);
//     await updateAll();

//     await sanityClient
//       .patch(match._id)
//       .set({ hasBeenProcessed: true })
//       .commit();

//     console.log("✅ Done! Stats updated & match marked as processed");
//     return res.status(200).json({ message: "Player stats updated" });
//   } catch (error) {
//     console.error("❌ Error:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// }
