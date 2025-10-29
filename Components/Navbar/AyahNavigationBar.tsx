"use client";

import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Button } from "@/Components/ui/button";

interface AyahNavigationBarProps {
  currentAyah: number;
  totalAyahs: number;
  onNext: () => void;
  onPrevious: () => void;
}

// Shared class names

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
          <Button
            variant="outline"
            size="sm"
            onClick={onPrevious}
            disabled={currentAyah <= 1}
            className="gap-1 px-3 py-2 h-auto text-xs"
          >
            <FiChevronLeft className="h-3.5 w-3.5" />
            <span>Previous Ayah</span>
          </Button>

          {/* Current Ayah Indicator */}
          <div className="flex items-center gap-2 text-xs font-medium px-4 py-2 border border-border rounded-sm">
            <span>Ayah {currentAyah}</span>
            <span className="text-muted-foreground">of</span>
            <span className="text-muted-foreground">{totalAyahs}</span>
          </div>

          {/* Next Ayah Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onNext}
            disabled={currentAyah >= totalAyahs}
            className="gap-1 px-3 py-2 h-auto text-xs"
          >
            <span>Next Ayah</span>
            <FiChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
