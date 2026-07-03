import { NextResponse } from "next/server";
import { getQuota, hasActiveJob } from "@/lib/quota";
import { getAnonymousUserId } from "@/lib/anonymous-user";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const userId = await getAnonymousUserId();
    const quota = await getQuota(userId);
    const active = await hasActiveJob(userId);

    return NextResponse.json({
      used: quota.used,
      limit: quota.limit,
      remaining: quota.remaining,
      hasActiveJob: active,
    });
  } catch (error) {
    console.error("Quota error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
