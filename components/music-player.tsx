"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface Track {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  url: string;
}

interface MusicPlayerProps {
  track: Track;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function MusicPlayer({ track }: MusicPlayerProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);
  const playerInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Load YouTube IFrame API if not already loaded
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }

    // Wait for YouTube API to be ready
    const timer = setTimeout(() => {
      if (window.YT && window.YT.Player && playerRef.current) {
        // If player already exists, just load the new video
        if (playerInstanceRef.current) {
          playerInstanceRef.current.loadVideoById(track.id);
        } else {
          // Create new player
          playerInstanceRef.current = new window.YT.Player(playerRef.current, {
            height: "100%",
            width: "100%",
            videoId: track.id,
            playerVars: {
              autoplay: 0,
              controls: 1,
              rel: 0,
              modestbranding: 1,
            },
          });
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [track.id]);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch("/api/convert-to-mp3", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId: track.id, title: track.title }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // If we got a download URL (from RapidAPI), open it directly
        if (data.downloadUrl) {
          const a = document.createElement("a");
          a.href = data.downloadUrl;
          a.download = `${track.title}.mp3`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } else {
          // Otherwise treat it as a blob response
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `${track.title}.mp3`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }
      } else {
        alert("Failed to download MP3");
      }
    } catch (error) {
      console.error("Download error:", error);
      alert(
        "Error downloading MP3: " +
          (error instanceof Error ? error.message : String(error))
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-card border border-[var(--border-light)] rounded-lg p-6 space-y-6">
      {/* YouTube Player */}
      <div className="relative w-full h-96 bg-black rounded-lg overflow-hidden">
        <div ref={playerRef} className="w-full h-full" />
      </div>

      {/* Track Info */}
      <div>
        <h2 className="text-2xl font-bold text-foreground text-balance">
          {track.title}
        </h2>
        <p className="text-muted-foreground text-sm mt-1">{track.artist}</p>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-6"
        >
          {isDownloading ? (
            <>
              <svg
                className="w-4 h-4 mr-2 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Converting...
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download MP3
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
