import { type NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function POST(request: NextRequest) {
  try {
    const { title, artist } = await request.json();

    // Use Genius API directly
    const GENIUS_API_TOKEN =
      process.env.GENIUS_API_TOKEN ||
      "M7F1tHysVeN5H2qV8XUtzHdyVTp9sNQMmfgdNAMAIZ-oKs1oNbHrbxB4mK4G0n27";

    const q = encodeURIComponent(`${artist} ${title}`);
    const apiUrl = `https://api.genius.com/search?q=${q}`;

    const apiRes = await fetch(apiUrl, {
      headers: { Authorization: `Bearer ${GENIUS_API_TOKEN}` },
    });

    if (!apiRes.ok) {
      return NextResponse.json(
        { error: "Genius API error", status: apiRes.status },
        { status: 502 }
      );
    }

    const apiData = await apiRes.json();

    if (!apiData.response.hits || apiData.response.hits.length === 0) {
      return NextResponse.json({ lyrics: null });
    }

    const songUrl = apiData.response.hits[0].result.url;

    // Fetch the song page and extract lyrics
    const pageRes = await fetch(songUrl, {
      headers: { "User-Agent": "LyricsProxy/1.0" },
    });

    if (!pageRes.ok) {
      return NextResponse.json({ lyrics: null });
    }

    let html = await pageRes.text();

    // Normalize some markup to preserve section headings and line breaks
    html = html.replace(
      /<h3[^>]*>([\s\S]*?)<\/h3>/gi,
      (m, p1) => `\n[${p1.replace(/<[^>]+>/g, "").trim()}]\n`
    );
    html = html.replace(/<br\s*\/?>(\s*)/gi, "\n");

    const $ = cheerio.load(html);

    // Genius embeds lyrics in multiple <div data-lyrics-container="true"> blocks
    const parts: string[] = [];
    $('div[data-lyrics-container="true"], .Lyrics__Container').each(
      (i, el) => {
        const text = $(el)
          .text()
          .replace(/\u00A0/g, " ")
          .trim();
        if (text) parts.push(text);
      }
    );

    const lyrics = parts.join("\n\n") || null;

    return NextResponse.json({ lyrics });
  } catch (error) {
    console.error("Lyrics search error:", error);
    return NextResponse.json(
      { error: "Failed to fetch lyrics" },
      { status: 500 }
    );
  }
}
