import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const users = [
  { email: "admin@sikabijoux.bj", name: "Admin SIKA", role: "ADMIN" as const, password: "admin1234" },
  {
    email: "secretariat@sikabijoux.bj",
    name: "Secrétariat SIKA",
    role: "SECRETARIAT" as const,
    password: "secret1234",
  },
];

async function main() {
  for (const user of users) {
    const passwordHash = await bcrypt.hash(user.password, 10);
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        name: user.name,
        role: user.role,
        passwordHash,
      },
    });
    console.log(`Utilisateur prêt : ${user.email} / ${user.password}`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
