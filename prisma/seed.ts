import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const players = [
  "Abdoulla",
  "Abdullah",
  "Alan",
  "Ali",
  "Ameen",
  "Awalah",
  "Basma",
  "Farhan",
  "Hassan",
  "Hussein",
  "Ibbad",
  "Imran",
  "Iqbal",
  "Isa",
  "Ish",
  "Karan",
  "Khaled",
  "Mahdi",
  "Malik",
  "Manraj",
  "MoIbz",
  "MoDiaby",
  "MoSalem",
  "Nadir",
  "Naj",
  "Niro",
  "OmarI",
  "OmarM",
  "OmarS",
  "Sal",
  "Samy",
  "Tahir",
  "Yousaf",
  "Zack",
  "Zain",
  "Zion",
];

async function main() {
  for (const name of players) {
    await prisma.player.create({ data: { name } });
  }

  console.log("✅ Seeded all player names!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
