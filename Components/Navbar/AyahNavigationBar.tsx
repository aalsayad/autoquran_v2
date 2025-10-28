"use client";

import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface AyahNavigationBarProps {
  currentAyah: number;
  totalAyahs: number;
  onNext: () => void;
  onPrevious: () => void;
}

// Shared class names
const BASE_STYLES =
  "border border-border rounded-sm transition-colors hover:bg-accent cursor-pointer";
const NAV_BUTTON = `flex items-center gap-1 px-3 py-2 text-xs ${BASE_STYLES} disabled:opacity-40 disabled:cursor-not-allowed`;

export function AyahNavigationBar({
  currentAyah,
  totalAyahs,
  onNext,
  onPrevious,
}: AyahNavigationBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t z-50">
      <div className="max-w-[1150px] mx-auto px-4 py-3 flex items-center justify-center">
        <div className="flex items-center gap-3">
          {/* Previous Ayah Button */}
          <button
            onClick={onPrevious}
            disabled={currentAyah <= 1}
            className={NAV_BUTTON}
          >
            <FiChevronLeft className="h-3.5 w-3.5" />
            <span>Previous Ayah</span>
          </button>

          {/* Current Ayah Indicator */}
          <div className="flex items-center gap-2 text-xs font-medium px-4 py-2 border border-border rounded-sm">
            <span>Ayah {currentAyah}</span>
            <span className="text-muted-foreground">of</span>
            <span className="text-muted-foreground">{totalAyahs}</span>
          </div>

          {/* Next Ayah Button */}
          <button
            onClick={onNext}
            disabled={currentAyah >= totalAyahs}
            className={NAV_BUTTON}
          >
            <span>Next Ayah</span>
            <FiChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
