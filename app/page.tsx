"use client";

import { useState } from "react";
import MusicSearch from "@/components/music-search";
import MusicPlayer from "@/components/music-player";
import LyricsDisplay from "@/components/lyrics-display";

export default function Home() {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [lyrics, setLyrics] = useState(null);

  return (
    <main className="h-screen overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        <div className="lg:col-span-2 p-4 sm:p-6 overflow-y-auto space-y-6 border-r border-[var(--border-light)]">
          {currentTrack ? (
            <>
              <MusicPlayer track={currentTrack} />
              <LyricsDisplay lyrics={lyrics} />
            </>
          ) : (
            <div className="bg-card border border-[var(--border-light)] rounded-lg p-12 text-center">
              <svg
                className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z"
                />
              </svg>
              <p className="text-muted-foreground text-lg">
                Search for a song to get started
              </p>
            </div>
          )}
        </div>

        <div className="lg:col-span-1 border-l border-[var(--border-light)] p-4 sm:p-6 overflow-y-auto">
          <MusicSearch
            onTrackSelect={setCurrentTrack}
            onLyricsFound={setLyrics}
          />
        </div>
      </div>
    </main>
  );
}
