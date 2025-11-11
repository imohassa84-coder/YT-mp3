import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { title, artist } = await request.json();

    // Call the local server's lyrics search endpoint
    const response = await fetch(
      `http://localhost:3001/api/search?artist=${encodeURIComponent(
        artist || ""
      )}&song=${encodeURIComponent(title || "")}`
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch lyrics" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({ lyrics: data.lyrics || null });
  } catch (error) {
    console.error("Lyrics search error:", error);
    return NextResponse.json(
      { error: "Failed to fetch lyrics" },
      { status: 500 }
    );
  }
}
