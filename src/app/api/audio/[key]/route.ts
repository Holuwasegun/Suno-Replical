import { NextResponse } from "next/server";
import { MockStorageProvider } from "@/lib/storage/mock-storage";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { key: string } }
) {
  const audio = MockStorageProvider.getAudio(params.key);
  if (!audio) {
    return NextResponse.json({ error: "Audio not found" }, { status: 404 });
  }

  return new NextResponse(audio.buffer, {
    headers: {
      "Content-Type": audio.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
