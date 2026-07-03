import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getQuota, hasActiveJob } from "@/lib/quota";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
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
