"use client";

import React, { useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiMoreVertical,
  FiBook,
  FiList,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

export type ViewMode = "page" | "list";

interface MushafNavigationBarProps {
  currentChapter: number;
  currentPage?: number;
  chapterNameArabic?: string;
  chapterNameEnglish?: string;
  viewMode?: ViewMode;
  showTranslation?: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
  onViewChange?: (mode: ViewMode) => void;
  onToggleTranslation?: () => void;
}

// Shared class names for consistency
const BASE_STYLES =
  "border border-border rounded-sm transition-colors hover:bg-accent cursor-pointer";
const NAV_BUTTON = `flex items-center gap-1 px-2 py-1 text-sm ${BASE_STYLES} disabled:opacity-40 disabled:cursor-not-allowed self-stretch`;
const CHAPTER_INFO = `flex items-center gap-1 text-sm font-medium px-3 py-1 ${BASE_STYLES} whitespace-nowrap`;
const MENU_BUTTON = `absolute right-4 p-1.5 ${BASE_STYLES}`;
const MUTED_TEXT = "text-muted-foreground";
const DROPDOWN_ITEM_BASE =
  "w-full flex items-center gap-2 px-3 py-1.5 text-sm rounded-[4px] cursor-pointer";

export function MushafNavigationBar({
  currentChapter,
  currentPage,
  chapterNameArabic,
  chapterNameEnglish,
  viewMode = "page",
  showTranslation = false,
  onNext,
  onPrevious,
  onViewChange,
  onToggleTranslation,
}: MushafNavigationBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  return (
    <div className="border-t bg-background relative z-1">
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
        <div className="absolute right-4">
          <button
            className="p-1.5 border border-border rounded-sm transition-colors hover:bg-accent cursor-pointer"
            aria-label="More options"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <FiMoreVertical className="h-3.5 w-3.5" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-1"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-popover text-popover-foreground rounded-md border shadow-md z-5">
                <div className="p-2">
                  {/* View Mode Options */}
                  <button
                    className={`${DROPDOWN_ITEM_BASE} ${
                      viewMode === "page" ? "bg-accent" : ""
                    } hover:bg-accent transition-colors text-left`}
                    onClick={() => {
                      onViewChange?.("page");
                      setDropdownOpen(false);
                    }}
                  >
                    <FiBook className="h-3.5 w-3.5" />
                    <span>Page View</span>
                  </button>
                  <button
                    className={`${DROPDOWN_ITEM_BASE} mt-1 ${
                      viewMode === "list" ? "bg-accent" : ""
                    } hover:bg-accent transition-colors text-left`}
                    onClick={() => {
                      onViewChange?.("list");
                      setDropdownOpen(false);
                    }}
                  >
                    <FiList className="h-3.5 w-3.5" />
                    <span>List View</span>
                  </button>

                  {/* Separator - Only show if in list view */}
                  {viewMode === "list" && (
                    <>
                      <div className="h-px bg-border my-2" />

                      {/* Translation Toggle - Only in List View */}
                      <button
                        className={`${DROPDOWN_ITEM_BASE} hover:bg-accent transition-colors text-left`}
                        onClick={() => {
                          onToggleTranslation?.();
                        }}
                      >
                        {showTranslation ? (
                          <>
                            <FiEyeOff className="h-3.5 w-3.5" />
                            <span>Hide Translation</span>
                          </>
                        ) : (
                          <>
                            <FiEye className="h-3.5 w-3.5" />
                            <span>Show Translation</span>
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
