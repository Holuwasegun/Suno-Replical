import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAnonymousUserId } from "@/lib/anonymous-user";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const userId = await getAnonymousUserId();

    const songs = await prisma.song.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        durationSec: true,
        createdAt: true,
        prompt: true,
      },
    });

    return NextResponse.json({ songs });
  } catch (error) {
    console.error("Songs list error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
