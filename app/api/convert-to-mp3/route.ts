import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const videoId = request.nextUrl.searchParams.get("id");
    const title = request.nextUrl.searchParams.get("title");

    if (!videoId) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 }
      );
    }

    console.log(`[MP3 Conversion] Starting conversion for video: ${videoId}`);

    // Use RapidAPI for MP3 conversion (works on Netlify)
    const rapidApiKey = process.env.RAPIDAPI_KEY || "1f88695774msh719cb026ed51d53p188d16jsn409cfafa8249";
    const rapidApiHost = "youtube-video-download-info.p.rapidapi.com";

    const rapidUrl = `https://${rapidApiHost}/dl?id=${encodeURIComponent(videoId)}`;

    const response = await fetch(rapidUrl, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": rapidApiKey,
        "X-RapidAPI-Host": rapidApiHost,
      },
    });

    const data = await response.json();

    if (!response.ok || !data.mp3) {
      return NextResponse.json(
        { error: "Failed to convert to MP3", details: data.error || "Unknown error" },
        { status: 502 }
      );
    }

    // Return the MP3 URL for download
    return NextResponse.json({
      downloadUrl: data.mp3,
      title: data.title || title || videoId,
    });
  } catch (error) {
    console.error("[MP3 Conversion] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to convert to MP3",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { videoId, title } = await request.json();

    console.log(`[MP3 Conversion] Starting conversion for video: ${videoId}`);

    // Use RapidAPI for MP3 conversion (works on Netlify)
    const rapidApiKey = process.env.RAPIDAPI_KEY || "1f88695774msh719cb026ed51d53p188d16jsn409cfafa8249";
    const rapidApiHost = "youtube-video-download-info.p.rapidapi.com";

    const rapidUrl = `https://${rapidApiHost}/dl?id=${encodeURIComponent(videoId)}`;

    const response = await fetch(rapidUrl, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": rapidApiKey,
        "X-RapidAPI-Host": rapidApiHost,
      },
    });

    const data = await response.json();

    if (!response.ok || !data.mp3) {
      return NextResponse.json(
        { error: "Failed to convert to MP3", details: data.error || "Unknown error" },
        { status: 502 }
      );
    }

    // Return the MP3 URL for download
    return NextResponse.json({
      downloadUrl: data.mp3,
      title: data.title || title || videoId,
    });
  } catch (error) {
    console.error("[MP3 Conversion] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to convert to MP3",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
