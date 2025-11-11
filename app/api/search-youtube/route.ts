import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    // Use YouTube API directly
    const YT_KEY =
      process.env.YOUTUBE_API_KEY || "AIzaSyA9EgjnU-ZrklvfN2MuG4Ki2hjisAqNmEY";
    
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=8&q=${encodeURIComponent(
      query
    )}&key=${YT_KEY}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorData = await response.json();
      const msg =
        (errorData.error &&
          (errorData.error.message ||
            (errorData.error.errors &&
              errorData.error.errors[0] &&
              errorData.error.errors[0].message))) ||
        JSON.stringify(errorData);
      return NextResponse.json(
        { error: `YouTube API error: ${msg}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const items = data.items || [];

    const results = items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails?.default?.url || "",
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
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
