import { prisma } from "../src/lib/prisma";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function main() {
  const email = "admin@blog.local";
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Seed already applied");
    return;
  }

  await prisma.user.create({
    data: {
      email,
      passwordHash: await hashPassword("password123"),
      posts: {
        create: [
          {
            title: "Welcome to BlogCraft",
            description: "Your backend seed is ready.",
            body: "<p>This post was created from the backend seed script.</p>",
            tags: "welcome, seed",
          },
        ],
      },
    },
  });

  console.log(`Seed created: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
