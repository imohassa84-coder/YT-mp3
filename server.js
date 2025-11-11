const express = require("express");
const http = require("http");
const https = require("https");
const { URL } = require("url");
const cheerio = require("cheerio");
const app = express();
const PORT = process.env.PORT || 3001;

// IMPORTANT: Put your Genius API token in GENIUS_API_TOKEN env var, or set here for quick test.
const GENIUS_API_TOKEN =
  process.env.GENIUS_API_TOKEN ||
  "M7F1tHysVeN5H2qV8XUtzHdyVTp9sNQMmfgdNAMAIZ-oKs1oNbHrbxB4mK4G0n27";

app.use(express.static(__dirname));

// simple fetch-like function that returns { ok, status, text() }
function fetchText(url, options = {}, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    try {
      const u = new URL(url);
      const lib = u.protocol === "https:" ? https : http;
      const headers = options.headers || {};
      const request = lib.get(u, { headers }, (resp) => {
        const statusCode = resp.statusCode;
        if (
          statusCode >= 300 &&
          statusCode < 400 &&
          resp.headers.location &&
          maxRedirects > 0
        ) {
          const loc = new URL(resp.headers.location, u).toString();
          resolve(fetchText(loc, options, maxRedirects - 1));
          resp.resume();
          return;
        }
        let data = "";
        resp.setEncoding("utf8");
        resp.on("data", (chunk) => (data += chunk));
        resp.on("end", () =>
          resolve({
            ok: statusCode >= 200 && statusCode < 300,
            status: statusCode,
            text: () => Promise.resolve(data),
          })
        );
      });
      request.on("error", reject);
    } catch (err) {
      reject(err);
    }
  });
}

app.get("/api/search", async (req, res) => {
  const { artist = "", song = "" } = req.query;
  if (!artist && !song)
    return res.status(400).json({ error: "artist or song required" });

  try {
    const q = encodeURIComponent(`${artist} ${song}`);
    const apiUrl = `https://api.genius.com/search?q=${q}`;
    const apiRes = await fetchText(apiUrl, {
      headers: { Authorization: `Bearer ${GENIUS_API_TOKEN}` },
    });
    if (!apiRes.ok)
      return res
        .status(502)
        .json({ error: "Genius API error", status: apiRes.status });
    const apiText = await apiRes.text();
    const json = JSON.parse(apiText);

    if (json.response.hits && json.response.hits.length > 0) {
      const songUrl = json.response.hits[0].result.url;

      // fetch the song page HTML and try to extract lyrics
      const pageRes = await fetchText(songUrl, {
        headers: { "User-Agent": "LyricsProxy/1.0" },
      });
      if (!pageRes.ok) return res.json({ songUrl });
      let html = await pageRes.text();

      // Normalize some markup to preserve section headings and line breaks
      // Convert <h3>Heading</h3> to [Heading]\n so we keep sections
      html = html.replace(
        /<h3[^>]*>([\s\S]*?)<\/h3>/gi,
        (m, p1) => `\n[${p1.replace(/<[^>]+>/g, "").trim()}]\n`
      );
      // Convert <br> to newlines
      html = html.replace(/<br\s*\/?>(\s*)/gi, "\n");

      const $ = cheerio.load(html);

      // Genius embeds lyrics in multiple <div data-lyrics-container="true"> blocks or .Lyrics__Container
      const parts = [];
      $('div[data-lyrics-container="true"], .Lyrics__Container').each(
        (i, el) => {
          // Get text and trim; keep any bracketed headings introduced above
          const text = $(el)
            .text()
            .replace(/\u00A0/g, " ")
            .trim();
          if (text) parts.push(text);
        }
      );

      const lyrics = parts.join("\n\n").trim();
      if (lyrics) return res.json({ lyrics });
      return res.json({ songUrl });
    }

    return res.json({});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal error" });
  }
});

// Suggest endpoint: returns a small list of matching songs for autocomplete
app.get("/api/suggest", async (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q) return res.json({ suggestions: [] });
  try {
    const apiUrl = `https://api.genius.com/search?q=${encodeURIComponent(q)}`;
    const apiRes = await fetchText(apiUrl, {
      headers: { Authorization: `Bearer ${GENIUS_API_TOKEN}` },
    });
    if (!apiRes.ok) return res.status(502).json({ suggestions: [] });
    const apiText = await apiRes.text();
    const json = JSON.parse(apiText);
    const hits = (json.response && json.response.hits) || [];
    const suggestions = hits.slice(0, 10).map((h) => {
      const r = h.result || {};
      return {
        id: r.id,
        title: r.title || r.full_title || "",
        primary_artist: (r.primary_artist && r.primary_artist.name) || "",
        full_title: r.full_title || "",
        songUrl: r.url || "",
      };
    });
    res.json({ suggestions });
  } catch (err) {
    console.error("suggest error", err);
    res.status(500).json({ suggestions: [] });
  }
});

// YouTube search proxy (requires YOUTUBE_API_KEY env var)
app.get("/api/ytsearch", async (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q) return res.json({ items: [] });
  // Use environment variable if set; fallback to the provided API key (embedded for convenience).
  const YT_KEY =
    process.env.YOUTUBE_API_KEY || "AIzaSyA9EgjnU-ZrklvfN2MuG4Ki2hjisAqNmEY";
  try {
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=8&q=${encodeURIComponent(
      q
    )}&key=${YT_KEY}`;
    const apiRes = await fetchText(apiUrl);
    const txt = await apiRes.text();
    if (!apiRes.ok) {
      // try to parse an error message from the YouTube API response
      try {
        const errJson = JSON.parse(txt);
        const msg =
          (errJson.error &&
            (errJson.error.message ||
              (errJson.error.errors &&
                errJson.error.errors[0] &&
                errJson.error.errors[0].message))) ||
          JSON.stringify(errJson);
        return res.status(502).json({ error: `YouTube API error: ${msg}` });
      } catch (e) {
        return res
          .status(502)
          .json({ error: `YouTube API returned status ${apiRes.status}` });
      }
    }
    const json = JSON.parse(txt);
    const items = (json.items || []).map((i) => ({
      id: i.id.videoId,
      title: i.snippet.title,
      channelTitle: i.snippet.channelTitle,
      thumbnails: i.snippet.thumbnails,
    }));
    res.json({ items });
  } catch (err) {
    console.error("ytsearch error", err);
    res.status(500).json({ items: [] });
  }
});

// Convert YouTube video to MP3 and stream it back
app.get("/api/ytmp3", (req, res) => {
  const videoId = (req.query.id || "").trim();
  console.log(`[ytmp3] Route called with videoId: ${videoId}`);
  
  if (!videoId) {
    console.log("[ytmp3] No video ID");
    return res.status(400).json({ error: "id query param required" });
  }

  try {
    const cp = require("child_process");
    console.log(`[ytmp3] Starting yt-dlp for ${videoId}`);

    // Use yt-dlp to stream audio, pipe through FFmpeg to convert to MP3
    const ytdlp = cp.spawn("yt-dlp", [
      "-f",
      "bestaudio",
      "-o",
      "-",
      `https://www.youtube.com/watch?v=${videoId}`,
    ]);

    const ffmpeg = require("fluent-ffmpeg");
    
    // Process the audio stream through FFmpeg to convert to MP3
    const ffmpegCmd = ffmpeg()
      .input(ytdlp.stdout)
      .noVideo()
      .audioCodec("libmp3lame")
      .audioBitrate("192k")
      .format("mp3")
      .on("start", () => {
        console.log("[ytmp3] FFmpeg conversion started");
      })
      .on("error", (err) => {
        console.error("[ytmp3] FFmpeg error:", err.message);
        ytdlp.kill();
        if (!res.headersSent) {
          res.status(500).json({ error: "Conversion failed", details: err.message });
        }
      })
      .on("end", () => {
        console.log("[ytmp3] FFmpeg conversion complete");
      });

    ytdlp.stderr.on("data", (data) => {
      console.log("[yt-dlp]", data.toString());
    });

    ytdlp.on("error", (err) => {
      console.error("[ytmp3] yt-dlp error:", err.message);
      if (!res.headersSent) {
        res.status(500).json({ error: "Download failed", details: err.message });
      }
    });

    ytdlp.on("close", (code) => {
      if (code !== 0) {
        console.error("[ytmp3] yt-dlp exited with code", code);
      }
    });

    // Set response headers
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Disposition", `inline; filename="${videoId}.mp3"`);

    console.log(`[ytmp3] Piping FFmpeg output to response`);
    // Pipe FFmpeg output to response
    ffmpegCmd.pipe(res, { end: true });

  } catch (err) {
    console.error("[ytmp3] Error:", err.message);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal error", details: err.message });
    }
  }
});

// RapidAPI YouTube to MP3 converter endpoint
app.get("/api/ytmp3-rapid", async (req, res) => {
  const videoId = (req.query.id || "").trim();
  if (!videoId) return res.status(400).json({ error: "video id required" });

  const rapidApiKey = "1f88695774msh719cb026ed51d53p188d16jsn409cfafa8249";
  const rapidApiHost = "youtube-video-download-info.p.rapidapi.com";

  const options = {
    hostname: rapidApiHost,
    path: `/dl?id=${encodeURIComponent(videoId)}`,
    method: "GET",
    headers: {
      "X-RapidAPI-Key": rapidApiKey,
      "X-RapidAPI-Host": rapidApiHost,
    },
  };

  console.log("Making RapidAPI request with options:", {
    host: options.hostname,
    path: options.path,
    headers: options.headers,
  });

  const rapidReq = https.request(options, (rapidRes) => {
    console.log("RapidAPI response status:", rapidRes.statusCode);
    console.log("RapidAPI response headers:", rapidRes.headers);

    let body = "";
    rapidRes.on("data", (chunk) => (body += chunk));
    rapidRes.on("end", () => {
      console.log("RapidAPI status code:", rapidRes.statusCode);
      console.log("RapidAPI raw response body:", body);

      // Check if the response is an error from RapidAPI itself
      if (rapidRes.statusCode !== 200) {
        console.error("RapidAPI returned error status:", rapidRes.statusCode);
        return res.status(502).json({
          error: `RapidAPI returned status ${rapidRes.statusCode}`,
          details: body,
        });
      }

      try {
        const data = JSON.parse(body);
        console.log("RapidAPI parsed response:", data);

        if (data && data.mp3) {
          console.log("Conversion successful, sending download URL to client");
          res.json({ downloadUrl: data.mp3, title: data.title || videoId });
        } else if (data && data.error) {
          console.error("RapidAPI returned error:", data.error);
          res.status(502).json({
            error: `API Error: ${data.error}`,
            details: JSON.stringify(data),
          });
        } else {
          console.error("Unexpected API response structure:", data);
          res.status(502).json({
            error: "Invalid API response format",
            details: JSON.stringify(data),
          });
        }
      } catch (err) {
        console.error("RapidAPI response parse error:", err);
        console.error("Raw response body:", body);
        res.status(502).json({
          error: "Failed to parse conversion response",
          details: body.substring(0, 200), // First 200 chars of response for debugging
        });
      }
    });
  });

  rapidReq.on("error", (err) => {
    console.error("RapidAPI request failed:", err);
    res.status(502).json({
      error: "Conversion service request failed",
      details: err.message,
    });
  });

  rapidReq.end();
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
