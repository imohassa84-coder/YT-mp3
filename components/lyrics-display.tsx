"use client";

interface LyricsDisplayProps {
  lyrics: string | null;
}

export default function LyricsDisplay({ lyrics }: LyricsDisplayProps) {
  if (!lyrics) {
    return (
      <div className="bg-card border border-[var(--border-light)] rounded-lg p-8 text-center">
        <p className="text-muted-foreground">Lyrics will appear here</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-[var(--border-light)] rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Lyrics</h3>
      <div className="bg-muted/50 rounded-lg p-4 h-96 overflow-y-auto">
        <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
          {lyrics}
        </div>
      </div>
    </div>
  );
}
