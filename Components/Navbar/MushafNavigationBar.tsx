"use client";

import React from "react";
import { FiChevronLeft, FiChevronRight, FiMoreVertical } from "react-icons/fi";

interface MushafNavigationBarProps {
  currentChapter: number;
  currentPage?: number;
  chapterNameArabic?: string;
  chapterNameEnglish?: string;
  onNext?: () => void;
  onPrevious?: () => void;
}

// Shared class names for consistency
const BASE_STYLES =
  "border border-border rounded-sm transition-colors hover:bg-accent cursor-pointer";
const NAV_BUTTON = `flex items-center gap-1 px-2 py-1 text-xs ${BASE_STYLES} disabled:opacity-40 disabled:cursor-not-allowed self-stretch`;
const CHAPTER_INFO = `flex items-center gap-1 text-sm font-medium px-3 py-1 ${BASE_STYLES} whitespace-nowrap`;
const MENU_BUTTON = `absolute right-4 p-1.5 ${BASE_STYLES}`;
const MUTED_TEXT = "text-muted-foreground";

export function MushafNavigationBar({
  currentChapter,
  currentPage,
  chapterNameArabic,
  chapterNameEnglish,
  onNext,
  onPrevious,
}: MushafNavigationBarProps) {
  return (
    <div className="border-t bg-background">
      <div className="max-w-[1150px] mx-auto px-4 py-2.5 flex items-center justify-center relative">
        {/* Navigation buttons centered together */}
        <div className="flex items-center gap-2">
          {/* Next Button */}
          <button
            onClick={onNext}
            disabled={currentChapter >= 114}
            className={NAV_BUTTON}
          >
            <FiChevronLeft className="h-3 w-3" />
          </button>

          {/* Center - Chapter Info */}
          <div className={CHAPTER_INFO}>
            <span>{chapterNameArabic || `Chapter ${currentChapter}`}</span>
            <span className={MUTED_TEXT}>•</span>
            <span className={MUTED_TEXT}>{chapterNameEnglish}</span>
          </div>

          {/* Previous Button */}
          <button
            onClick={onPrevious}
            disabled={currentChapter <= 1}
            className={NAV_BUTTON}
          >
            <FiChevronRight className="h-3 w-3" />
          </button>
        </div>

        {/* Menu Icon - Right aligned with email dropdown above */}
        <button className={MENU_BUTTON} aria-label="More options">
          <FiMoreVertical className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
