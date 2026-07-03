import { NextResponse } from "next/server";
import { getQuota } from "@/lib/quota";
import { getAnonymousUserId } from "@/lib/anonymous-user";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const userId = await getAnonymousUserId();
    const quota = await getQuota(userId);

    return NextResponse.json({
      used: quota.used,
      limit: quota.limit,
      remaining: quota.remaining,
    });
  } catch (error) {
    console.error("Quota error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
