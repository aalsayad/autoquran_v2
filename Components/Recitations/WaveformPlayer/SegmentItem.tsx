import React, { useState } from "react";
import { Play, Trash2 } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Segment } from "@/lib/storage/recitations";
import { cn } from "@/lib/utils";

type SegmentItemProps = {
  segment: Segment;
  index: number;
  isSelected: boolean;
  totalAyahs: number;
  ayahTexts: Record<number, string>;
  onSelect: () => void;
  onPlay: () => void;
  onDelete: () => void;
  onUpdateAyahs: (ayahs: number[]) => void;
};

export const SegmentItem = React.forwardRef<HTMLDivElement, SegmentItemProps>(
  function SegmentItem(
    {
      segment,
      index,
      isSelected,
      totalAyahs,
      ayahTexts,
      onSelect,
      onPlay,
      onDelete,
      onUpdateAyahs,
    },
    ref
  ) {
    const [ayahInput, setAyahInput] = useState(segment.ayahs.join(", ") || "");

    function formatTime(seconds: number): string {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    }

    function handleAyahInputChange(value: string) {
      setAyahInput(value);

      // Parse comma-separated numbers
      const ayahs = value
        .split(",")
        .map((s) => parseInt(s.trim()))
        .filter((n) => !isNaN(n) && n > 0 && n <= totalAyahs);

      onUpdateAyahs(ayahs);
    }

    const hasAyahs = segment.ayahs.length > 0;

    return (
      <div
        ref={ref}
        className={cn(
          "group relative p-3 cursor-pointer transition-colors hover:bg-muted/50",
          isSelected && "bg-muted/50"
        )}
        onClick={onSelect}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Play button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlay();
              }}
              className="h-6 w-6 rounded flex items-center justify-center hover:bg-muted transition-colors shrink-0 text-foreground"
              title="Play segment"
            >
              <Play className="h-3 w-3 fill-current" />
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full shrink-0",
                    hasAyahs ? "bg-green-500" : "bg-blue-500"
                  )}
                />
                <span className="text-sm font-medium text-foreground">
                  Segment {index + 1}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono pl-4">
                <span>{formatTime(segment.start)}</span>
                <span className="text-muted-foreground/30">→</span>
                <span>{formatTime(segment.end)}</span>
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-6 w-6"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="flex items-center gap-2 mt-2 pl-[36px]">
          <label className="text-[10px] font-medium text-muted-foreground shrink-0 uppercase tracking-wider">
            Ayahs
          </label>
          <input
            type="text"
            value={ayahInput}
            onChange={(e) => handleAyahInputChange(e.target.value)}
            placeholder="e.g., 1, 2, 3"
            className="flex-1 text-xs border-b border-border bg-transparent px-1 py-0.5 focus:border-foreground outline-none transition-colors placeholder:text-muted-foreground/50"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Display Ayah Text for Verification */}
        {hasAyahs && (
          <div className="mt-2 pt-2 pl-[36px]">
            <div className="space-y-1">
              {segment.ayahs.map((ayahNum) => (
                <div
                  key={ayahNum}
                  className="text-base font-arabic leading-relaxed text-foreground/90 py-1"
                  dir="rtl"
                >
                  <span className="inline-flex items-center justify-center bg-muted h-4 min-w-[16px] px-1 rounded text-[9px] text-muted-foreground font-sans font-bold ml-2 align-middle">
                    {ayahNum}
                  </span>
                  {ayahTexts[ayahNum] || "Loading..."}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);
