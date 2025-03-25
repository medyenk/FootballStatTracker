// import type { VercelRequest, VercelResponse } from "@vercel/node";
// import { prisma } from "../lib/prisma"; 

// export default async function handler(req: VercelRequest, res: VercelResponse) {
//   try {
//     const players = await prisma.player.findMany({
//       orderBy: { name: "asc" },
//     });

//     res.status(200).json(players);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch players" });
//   }
// }

export default function handler(req: any, res: any) {
  res.status(200).json([{ id: 1, name: "Zack" }]);
}