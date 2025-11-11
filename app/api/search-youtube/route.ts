import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    // Call the local server's YouTube search endpoint
    const response = await fetch(
      `http://localhost:3001/api/ytsearch?q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to search YouTube" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const items = data.items || [];

    const results = items.map((item: any) => ({
      id: item.id,
      title: item.title,
      artist: item.channelTitle,
      thumbnail: item.thumbnails?.default?.url || "",
      url: `https://www.youtube.com/watch?v=${item.id}`,
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error("YouTube search error:", error);
    return NextResponse.json(
      { error: "Failed to search YouTube" },
      { status: 500 }
    );
  }
}
