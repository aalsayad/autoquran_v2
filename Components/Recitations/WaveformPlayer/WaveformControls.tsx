import React from "react";
import { Play, Pause, Plus, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { cn } from "@/lib/utils";

type WaveformControlsProps = {
  isPlaying: boolean;
  isReady: boolean;
  currentTime: number;
  duration: number;
  zoom: number;
  onPlayPause: () => void;
  onAddSegment: () => void;
  onZoomChange: (zoom: number) => void;
};

export function WaveformControls({
  isPlaying,
  isReady,
  currentTime,
  duration,
  zoom,
  onPlayPause,
  onAddSegment,
  onZoomChange,
}: WaveformControlsProps) {
  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  return (
    <div className="flex items-center justify-between mt-4 border-t pt-4">
      <div className="flex items-center gap-2">
        <Button
          onClick={onPlayPause}
          disabled={!isReady}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-muted"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4 fill-current" />
          ) : (
            <Play className="h-4 w-4 ml-0.5 fill-current" />
          )}
        </Button>
        <Button
          onClick={onAddSegment}
          disabled={!isReady}
          size="sm"
          variant="ghost"
          className="h-8 text-xs font-normal hover:bg-muted"
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Add Segment
        </Button>
      </div>

      {/* Zoom Slider */}
      <div className="flex items-center gap-2">
        <ZoomOut className="h-3.5 w-3.5 text-muted-foreground" />
        <input
          type="range"
          min="0"
          max="500"
          step="10"
          value={zoom}
          onChange={(e) => onZoomChange(Number(e.target.value))}
          disabled={!isReady}
          className="w-24 h-1 bg-muted rounded-full appearance-none cursor-pointer accent-foreground [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:cursor-pointer"
          title={zoom === 0 ? "Fit to view" : `${zoom} px/sec`}
        />
        <ZoomIn className="h-3.5 w-3.5 text-muted-foreground" />
      </div>

      <div className="text-xs font-mono text-muted-foreground">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>
  );
}
