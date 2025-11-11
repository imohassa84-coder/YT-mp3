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

    // Proxy the MP3 conversion request to the local server
    const response = await fetch(
      `http://localhost:3001/api/ytmp3?id=${encodeURIComponent(videoId)}`,
      {
        method: "GET",
        headers: {
          "Accept": "audio/mpeg",
        },
      }
    );

    console.log(`[MP3 Conversion] Response status: ${response.status}`);
    console.log(`[MP3 Conversion] Response headers:`, {
      contentType: response.headers.get("content-type"),
      contentLength: response.headers.get("content-length"),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[MP3 Conversion] Error response: ${errorText}`);
      return NextResponse.json(
        { error: `Failed to convert to MP3: ${response.status}` },
        { status: response.status }
      );
    }

    // Get the audio stream
    const buffer = await response.arrayBuffer();
    console.log(`[MP3 Conversion] Received buffer size: ${buffer.byteLength} bytes`);

    if (buffer.byteLength === 0) {
      console.error("[MP3 Conversion] Buffer is empty!");
      return NextResponse.json(
        { error: "MP3 conversion returned empty file" },
        { status: 500 }
      );
    }

    // Return the MP3 file with proper headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": buffer.byteLength.toString(),
        "Content-Disposition": `attachment; filename="${(
          title || videoId
        ).replace(/[^a-z0-9]/gi, "_")}.mp3"`,
      },
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

    // Proxy the MP3 conversion request to the local server
    const response = await fetch(
      `http://localhost:3001/api/ytmp3?id=${encodeURIComponent(videoId)}`,
      {
        method: "GET",
        headers: {
          "Accept": "audio/mpeg",
        },
      }
    );

    console.log(`[MP3 Conversion] Response status: ${response.status}`);
    console.log(`[MP3 Conversion] Response headers:`, {
      contentType: response.headers.get("content-type"),
      contentLength: response.headers.get("content-length"),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[MP3 Conversion] Error response: ${errorText}`);
      return NextResponse.json(
        { error: `Failed to convert to MP3: ${response.status}` },
        { status: response.status }
      );
    }

    // Get the audio stream
    const buffer = await response.arrayBuffer();
    console.log(`[MP3 Conversion] Received buffer size: ${buffer.byteLength} bytes`);

    if (buffer.byteLength === 0) {
      console.error("[MP3 Conversion] Buffer is empty!");
      return NextResponse.json(
        { error: "MP3 conversion returned empty file" },
        { status: 500 }
      );
    }

    // Return the MP3 file with proper headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": buffer.byteLength.toString(),
        "Content-Disposition": `attachment; filename="${(
          title || videoId
        ).replace(/[^a-z0-9]/gi, "_")}.mp3"`,
      },
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
