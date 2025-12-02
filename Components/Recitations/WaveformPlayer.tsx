"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Trash2 } from "lucide-react";
import { Segment } from "@/lib/storage/recitations";
import { SegmentItem } from "./WaveformPlayer/SegmentItem";
import { WaveformControls } from "./WaveformPlayer/WaveformControls";
import { useWaveSurfer } from "./WaveformPlayer/hooks/useWaveSurfer";

type WaveformPlayerProps = {
  audioUrl: string;
  segments: Segment[];
  surahId: number;
  totalAyahs: number;
  onSegmentsChange: (segments: Segment[]) => void;
};

type AyahText = {
  verse_number: number;
  text_uthmani: string;
};

export function WaveformPlayer({
  audioUrl,
  segments,
  surahId,
  totalAyahs,
  onSegmentsChange,
}: WaveformPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isUpdatingRegionRef = useRef(false);
  const waveformScrollRef = useRef<HTMLDivElement>(null);
  const segmentsListRef = useRef<HTMLDivElement>(null);
  const segmentRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Local mirror to avoid flicker while parent re-renders
  const [localSegments, setLocalSegments] = useState<Segment[]>(segments);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [ayahTexts, setAyahTexts] = useState<Record<number, string>>({});
  const [zoom, setZoom] = useState(0);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    segmentId: string;
  } | null>(null);

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const drawStartTimeRef = useRef<number | null>(null);
  const tempRegionRef = useRef<any>(null);

  // Refs for stable access
  const localSegmentsRef = useRef(localSegments);
  const onSegmentsChangeRef = useRef(onSegmentsChange);

  useEffect(() => {
    localSegmentsRef.current = localSegments;
    onSegmentsChangeRef.current = onSegmentsChange;
  }, [localSegments, onSegmentsChange]);

  // Use the custom hook
  const {
    wavesurfer,
    regionsPlugin,
    isReady,
    isPlaying,
    currentTime,
    duration,
    handlePlayPause,
    handleZoomChange: hookHandleZoomChange,
  } = useWaveSurfer({
    containerRef,
    audioUrl,
    onReady: (ws) => {
      // Initial load of regions
      if (regionsPlugin) {
        (localSegments.length ? localSegments : segments).forEach((segment) => {
          addRegionToPlugin(segment);
        });
      }
    },
  });

  // Helper to add region to plugin
  const addRegionToPlugin = (segment: Segment) => {
    if (!regionsPlugin) return;
    const hasAyahs = segment.ayahs.length > 0;
    regionsPlugin.addRegion({
      id: segment.id,
      start: segment.start,
      end: segment.end,
      color: hasAyahs
        ? "rgba(34, 197, 94, 0.25)" // green
        : "rgba(59, 130, 246, 0.25)", // blue
      drag: true,
      resize: true,
      content: createRegionBadge(segment.ayahs),
    });
  };

  // Helper to create badge content for regions
  function createRegionBadge(ayahs: number[]): HTMLElement {
    const badge = document.createElement("div");
    badge.className = "region-badge";
    const text = ayahs.length > 0 ? ayahs.join(",") : "?";
    const isWide = text.length > 2;
    badge.style.cssText = `
      position: absolute;
      top: 2px;
      left: 2px;
      ${isWide ? "min-width: 16px; padding: 0 4px;" : "width: 16px;"}
      height: 16px;
      border-radius: 8px;
      background: ${
        ayahs.length > 0 ? "rgb(34, 197, 94)" : "rgb(100, 116, 139)"
      };
      color: white;
      font-size: 9px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      box-shadow: 0 1px 2px rgba(0,0,0,0.15);
    `;
    badge.textContent = text;
    return badge;
  }

  // Handle region events
  useEffect(() => {
    if (!regionsPlugin) return;

    const onRegionUpdated = (region: any) => {
      isUpdatingRegionRef.current = true;
      setLocalSegments((prev) =>
        prev.map((seg) =>
          seg.id === region.id
            ? { ...seg, start: region.start, end: region.end }
            : seg
        )
      );
    };

    const onRegionUpdateEnd = (region: any) => {
      isUpdatingRegionRef.current = false;
      const currentSegments = localSegmentsRef.current;
      const updatedSegments = currentSegments.map((seg) =>
        seg.id === region.id
          ? { ...seg, start: region.start, end: region.end }
          : seg
      );
      setLocalSegments(updatedSegments);
      onSegmentsChangeRef.current(updatedSegments);
    };

    const onRegionClicked = (region: any, e: MouseEvent) => {
      e.stopPropagation();
      setSelectedSegment(region.id);
      setContextMenu(null);
      setTimeout(() => {
        const segmentEl = segmentRefs.current.get(region.id);
        if (segmentEl && segmentsListRef.current) {
          segmentEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }, 50);
    };

    regionsPlugin.on("region-updated", onRegionUpdated);
    regionsPlugin.on("region-update-end" as any, onRegionUpdateEnd);
    regionsPlugin.on("region-clicked", onRegionClicked);

    return () => {
      regionsPlugin.un("region-updated", onRegionUpdated);
      regionsPlugin.un("region-update-end" as any, onRegionUpdateEnd);
      regionsPlugin.un("region-clicked", onRegionClicked);
    };
  }, [regionsPlugin]);

  // Sync regions with segments
  useEffect(() => {
    if (isUpdatingRegionRef.current || !isReady || !regionsPlugin) return;

    const regions = regionsPlugin.getRegions();
    const segmentIds = new Set(localSegments.map((s) => s.id));

    // Remove deleted regions
    regions.forEach((region) => {
      if (!segmentIds.has(region.id)) {
        region.remove();
      }
    });

    // Add/Update regions
    localSegments.forEach((segment) => {
      const existingRegion = regions.find((r) => r.id === segment.id);
      if (!existingRegion) {
        addRegionToPlugin(segment);
      } else {
        // Update color/badge if needed
        const hasAyahs = segment.ayahs.length > 0;
        const expectedColor = hasAyahs
          ? "rgba(34, 197, 94, 0.25)"
          : "rgba(59, 130, 246, 0.25)";
        existingRegion.setOptions({
          color: expectedColor,
          content: createRegionBadge(segment.ayahs),
        });
      }
    });
  }, [localSegments, isReady, regionsPlugin]);

  // Keep local in sync with parent
  useEffect(() => {
    if (isUpdatingRegionRef.current) return;
    setLocalSegments(segments);
  }, [segments]);

  // Fetch ayah texts
  useEffect(() => {
    const allAyahs = new Set<number>();
    (localSegments.length ? localSegments : segments).forEach((seg) =>
      seg.ayahs.forEach((a) => allAyahs.add(a))
    );

    const ayahArray = Array.from(allAyahs);
    if (ayahArray.length === 0) return;

    const missingAyahs = ayahArray.filter((a) => !ayahTexts[a]);

    if (missingAyahs.length > 0) {
      fetch(
        `https://api.quran.com/api/v4/verses/by_chapter/${surahId}?fields=text_uthmani&per_page=${totalAyahs}`
      )
        .then((res) => res.json())
        .then((data) => {
          const newTexts: Record<number, string> = { ...ayahTexts };
          data.verses.forEach((verse: AyahText) => {
            newTexts[verse.verse_number] = verse.text_uthmani;
          });
          setAyahTexts(newTexts);
        })
        .catch((err) => console.error("Failed to fetch ayah texts:", err));
    }
  }, [localSegments, segments, surahId, totalAyahs]);

  // Interaction Handlers
  function handleZoomChange(newZoom: number) {
    setZoom(newZoom);
    hookHandleZoomChange(newZoom);
  }

  function updateLocalAndParent(newSegments: Segment[]) {
    setLocalSegments(newSegments);
    onSegmentsChange(newSegments);
  }

  function handleAddSegment() {
    if (!regionsPlugin) return;
    const newSegment: Segment = {
      id: `segment-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      start: currentTime,
      end: Math.min(currentTime + 5, duration),
      ayahs: [],
    };
    addRegionToPlugin(newSegment);
    const updatedSegments = [...localSegments, newSegment];
    updateLocalAndParent(updatedSegments);
    setSelectedSegment(newSegment.id);
  }

  function handleDeleteSegment(segmentId: string) {
    if (!regionsPlugin) return;
    const region = regionsPlugin.getRegions().find((r) => r.id === segmentId);
    if (region) region.remove();
    const updatedSegments = localSegments.filter((seg) => seg.id !== segmentId);
    updateLocalAndParent(updatedSegments);
    setSelectedSegment(null);
  }

  function handleUpdateAyahs(segmentId: string, ayahs: number[]) {
    const updatedSegments = localSegments.map((seg) =>
      seg.id === segmentId ? { ...seg, ayahs } : seg
    );
    updateLocalAndParent(updatedSegments);
  }

  function handlePlayRegion(segmentId: string) {
    const region = regionsPlugin?.getRegions().find((r) => r.id === segmentId);
    if (region) region.play();
  }

  function handleSelectSegmentFromList(segmentId: string, startTime: number) {
    setSelectedSegment(segmentId);
    if (wavesurfer) {
      wavesurfer.seekTo(startTime / wavesurfer.getDuration());
    }
    // Scroll logic...
    if (waveformScrollRef.current && containerRef.current && wavesurfer) {
      const scrollContainer = waveformScrollRef.current;
      const waveformWidth = containerRef.current.scrollWidth;
      const containerWidth = scrollContainer.clientWidth;

      if (waveformWidth > containerWidth) {
        const progress = startTime / wavesurfer.getDuration();
        const targetScroll = progress * waveformWidth - 50;
        const clampedScroll = Math.max(
          0,
          Math.min(targetScroll, waveformWidth - containerWidth)
        );
        scrollContainer.scrollTo({ left: clampedScroll, behavior: "smooth" });
      }
    }
  }

  // Alt+Drag Logic
  function getTimeFromMouseX(clientX: number): number {
    if (!waveformScrollRef.current || !containerRef.current || !wavesurfer)
      return 0;

    const scrollContainer = waveformScrollRef.current;
    const waveformContent = containerRef.current;

    // Get scroll container's visual position (this stays stable during scroll)
    const scrollRect = scrollContainer.getBoundingClientRect();

    // Click position relative to the visible scroll viewport
    const clickXInViewport = clientX - scrollRect.left;

    // Add scroll offset to get absolute position within waveform content
    const absoluteX = clickXInViewport + scrollContainer.scrollLeft;

    // Total waveform width (this is wider when zoomed)
    const waveformWidth = waveformContent.scrollWidth;

    // Clamp to valid range
    const clampedX = Math.max(0, Math.min(absoluteX, waveformWidth));

    // Calculate time
    const proportion = clampedX / waveformWidth;
    return proportion * wavesurfer.getDuration();
  }

  function handleWaveformMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    if (!e.altKey || !isReady || !regionsPlugin) return;
    e.preventDefault();
    const startTime = getTimeFromMouseX(e.clientX);
    drawStartTimeRef.current = startTime;
    setIsDrawing(true);

    tempRegionRef.current = regionsPlugin.addRegion({
      id: `temp-region-${Date.now()}`,
      start: startTime,
      end: startTime + 0.1,
      color: "rgba(59, 130, 246, 0.4)",
      drag: false,
      resize: false,
    });
  }

  function handleWaveformMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (
      !isDrawing ||
      !tempRegionRef.current ||
      drawStartTimeRef.current === null
    )
      return;
    const currentMouseTime = getTimeFromMouseX(e.clientX);
    const start = Math.min(drawStartTimeRef.current, currentMouseTime);
    const end = Math.max(drawStartTimeRef.current, currentMouseTime);
    tempRegionRef.current.setOptions({
      start,
      end: Math.max(end, start + 0.1),
    });
  }

  function handleWaveformMouseUp(e: React.MouseEvent<HTMLDivElement>) {
    if (
      !isDrawing ||
      !tempRegionRef.current ||
      drawStartTimeRef.current === null
    )
      return;
    const endTime = getTimeFromMouseX(e.clientX);
    const start = Math.min(drawStartTimeRef.current, endTime);
    const end = Math.max(drawStartTimeRef.current, endTime);

    tempRegionRef.current.remove();
    tempRegionRef.current = null;
    drawStartTimeRef.current = null;
    setIsDrawing(false);

    if (end - start < 0.3) return;

    const newSegment: Segment = {
      id: `segment-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      start,
      end,
      ayahs: [],
    };
    addRegionToPlugin(newSegment);
    const updatedSegments = [...localSegments, newSegment];
    updateLocalAndParent(updatedSegments);
    setSelectedSegment(newSegment.id);
  }

  // Context Menu Logic
  function handleWaveformContextMenu(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    if (!regionsPlugin || !wavesurfer || !containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const relativeX = e.clientX - containerRect.left;
    const proportion = relativeX / containerRect.width;
    const clickTime = proportion * wavesurfer.getDuration();

    const regions = regionsPlugin.getRegions();
    const clickedRegion = regions.find(
      (r) => clickTime >= r.start && clickTime <= r.end
    );

    if (clickedRegion) {
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        segmentId: clickedRegion.id,
      });
    } else {
      setContextMenu(null);
    }
  }

  // Close context menu
  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  return (
    <div className="space-y-4">
      {/* Waveform Container */}
      <div
        className={`border rounded-lg bg-card p-6 relative ${
          isDrawing ? "cursor-crosshair" : ""
        }`}
        onContextMenu={handleWaveformContextMenu}
        onMouseDown={handleWaveformMouseDown}
        onMouseMove={handleWaveformMouseMove}
        onMouseUp={handleWaveformMouseUp}
        onMouseLeave={handleWaveformMouseUp}
      >
        <div ref={waveformScrollRef} className="overflow-x-auto">
          <div ref={containerRef} className="w-full min-w-full" />
        </div>

        {/* Context Menu */}
        <AnimatePresence>
          {contextMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.1 }}
              className="fixed z-50 min-w-[140px] overflow-hidden rounded border bg-background p-1 text-foreground shadow-sm"
              style={{ top: contextMenu.y, left: contextMenu.x }}
            >
              <div
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-xs outline-none hover:bg-muted"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayRegion(contextMenu.segmentId);
                  setContextMenu(null);
                }}
              >
                <Play className="mr-2 h-3.5 w-3.5" />
                Play
              </div>
              <div
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-xs outline-none hover:bg-muted text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteSegment(contextMenu.segmentId);
                  setContextMenu(null);
                }}
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Delete
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <WaveformControls
          isPlaying={isPlaying}
          isReady={isReady}
          currentTime={currentTime}
          duration={duration}
          zoom={zoom}
          onPlayPause={handlePlayPause}
          onAddSegment={handleAddSegment}
          onZoomChange={handleZoomChange}
        />
      </div>

      {/* Segments List */}
      <div className="border rounded-lg bg-card">
        <div className="flex items-center justify-between p-6 pb-4 border-b sticky top-0 bg-card z-10">
          <h3 className="font-semibold text-sm">
            Segments ({localSegments.length})
          </h3>
        </div>

        <div
          ref={segmentsListRef}
          className="max-h-[400px] overflow-y-auto p-6 pt-4"
        >
          {localSegments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <p className="text-sm">No segments yet</p>
            </div>
          ) : (
            <div className="space-y-0 divide-y divide-border">
              <AnimatePresence mode="popLayout">
                {localSegments.map((segment, index) => (
                  <motion.div
                    key={segment.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <SegmentItem
                      ref={(el) => {
                        if (el) segmentRefs.current.set(segment.id, el);
                        else segmentRefs.current.delete(segment.id);
                      }}
                      segment={segment}
                      index={index}
                      isSelected={segment.id === selectedSegment}
                      totalAyahs={totalAyahs}
                      ayahTexts={ayahTexts}
                      onSelect={() =>
                        handleSelectSegmentFromList(segment.id, segment.start)
                      }
                      onPlay={() => handlePlayRegion(segment.id)}
                      onDelete={() => handleDeleteSegment(segment.id)}
                      onUpdateAyahs={(ayahs) =>
                        handleUpdateAyahs(segment.id, ayahs)
                      }
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
