"use client";

import type React from "react";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Track {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  url: string;
}

interface MusicSearchProps {
  onTrackSelect: (track: Track) => void;
  onLyricsFound: (lyrics: string | null) => void;
}

export default function MusicSearch({
  onTrackSelect,
  onLyricsFound,
}: MusicSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/search-youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTrack = async (track: Track) => {
    setSelectedTrack(track);
    onTrackSelect(track);

    try {
      const response = await fetch("/api/search-lyrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: track.title, artist: track.artist }),
      });
      const data = await response.json();
      onLyricsFound(data.lyrics || null);
    } catch (error) {
      console.error("Lyrics fetch error:", error);
      onLyricsFound(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="space-y-3">
        <Input
          placeholder="Search songs, artists..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-card border border-red-500/70 focus:border-red-600/80"
        />
      </form>

      {/* Results */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground/60">Results</h3>
        <div className="space-y-2 h-[calc(100vh-250px)] overflow-y-auto">
          {results.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              {query ? "No results found" : "Search for a song"}
            </p>
          ) : (
            results.map((track) => (
              <button
                key={track.id}
                onClick={() => handleSelectTrack(track)}
                className={`w-full p-3 rounded-lg border transition-all text-left ${
                  selectedTrack?.id === track.id
                    ? "bg-red-600/20 border-red-500 text-foreground"
                    : "bg-card/50 border-[var(--border-light)] hover:bg-card hover:border-red-500/50"
                }`}
              >
                <p className="font-medium text-sm truncate">{track.title}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {track.artist}
                </p>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
