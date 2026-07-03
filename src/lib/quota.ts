import { prisma } from "./prisma";

const DAILY_LIMIT = parseInt(process.env.DAILY_GENERATION_QUOTA || "5", 10);

export async function getQuota(userId: string) {
  const now = new Date();
  const windowStart = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const window = await prisma.quotaWindow.findFirst({
    where: {
      userId,
      windowStart: { gte: windowStart },
    },
    orderBy: { windowStart: "desc" },
  });

  const used = window?.generationsUsed ?? 0;
  return { used, limit: DAILY_LIMIT, remaining: Math.max(0, DAILY_LIMIT - used) };
}

export async function incrementQuota(userId: string) {
  const now = new Date();
  const windowStart = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const existing = await prisma.quotaWindow.findFirst({
    where: {
      userId,
      windowStart: { gte: windowStart },
    },
    orderBy: { windowStart: "desc" },
  });

  if (existing) {
    return prisma.quotaWindow.update({
      where: { id: existing.id },
      data: { generationsUsed: { increment: 1 } },
    });
  }

  return prisma.quotaWindow.create({
    data: { userId, generationsUsed: 1, windowStart: now },
  });
}

export async function decrementQuota(userId: string) {
  const now = new Date();
  const windowStart = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const existing = await prisma.quotaWindow.findFirst({
    where: {
      userId,
      windowStart: { gte: windowStart },
    },
    orderBy: { windowStart: "desc" },
  });

  if (existing && existing.generationsUsed > 0) {
    return prisma.quotaWindow.update({
      where: { id: existing.id },
      data: { generationsUsed: { decrement: 1 } },
    });
  }
}

export async function hasActiveJob(userId: string) {
  const active = await prisma.generationJob.findFirst({
    where: {
      userId,
      status: { in: ["PENDING", "PROCESSING"] },
    },
  });
  return active !== null;
}

export async function checkCooldown(userId: string) {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  const recentFailedOrFlagged = await prisma.generationJob.count({
    where: {
      userId,
      status: "FAILED",
      queuedAt: { gte: oneHourAgo },
    },
  });

  return recentFailedOrFlagged >= 3;
}
