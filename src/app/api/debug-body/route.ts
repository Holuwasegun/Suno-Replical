import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const text = await request.text();
    let parsed: unknown = null;
    let parseError: string | null = null;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      parseError = e instanceof Error ? e.message : String(e);
    }
    return NextResponse.json({
      receivedLength: text.length,
      receivedText: text.slice(0, 200),
      charCodes: Array.from(text.slice(0, 20)).map(c => c.charCodeAt(0)),
      parsed,
      parseError,
    });
  } catch (error) {
    return NextResponse.json({
      fatal: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
