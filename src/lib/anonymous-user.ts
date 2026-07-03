import { prisma } from "./prisma";

const ANONYMOUS_EMAIL = "guest@sonatune.local";

let cached: string | null = null;

export async function getAnonymousUserId(): Promise<string> {
  if (cached) return cached;

  const user = await prisma.user.upsert({
    where: { email: ANONYMOUS_EMAIL },
    update: {},
    create: {
      email: ANONYMOUS_EMAIL,
      name: "Guest",
    },
  });

  cached = user.id;
  return user.id;
}
